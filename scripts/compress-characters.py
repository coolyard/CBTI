#!/usr/bin/env python3
"""CBTI 立绘入库脚本（内容管线 C06-A → C06-B 之间的人工环节）

用法：python3 scripts/compress-characters.py
输入：raw-portraits/{archetypeId}-{m|f|u}-{角色名}.png（豆包/即梦原图）
处理：中心裁方 → 640×640 → WebP（质量自降直至 单张 ≤200KB 且 总量 ≤预算）→ 规范命名
输出：src/pkg-characters/characters/char-{原型两位补零}-{male|female|universal}.webp

规范来源：specs/70-assets.md §5（资产规格 + 命名 + 640 尺寸与水印注记）、specs/80 §3（单分包 2MB 限制）
"""
import io
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'raw-portraits'
DST = ROOT / 'src' / 'pkg-characters' / 'characters'
MAX_BYTES = 200 * 1024          # 单张上限（specs/70 §5）
TOTAL_BUDGET = 1900 * 1024      # 54 张总量预算：微信单分包 2MB 硬限制，预留 ~150KB 余量（specs/80 §3）
TARGET = 640
SUFFIX_MAP = {'m': 'male', 'f': 'female', 'u': 'universal'}
QUALITY_LADDER = (85, 80, 75, 70, 65, 60, 55, 50)


def load_character_names() -> dict[str, str]:
    """从 characters.ts 提取 id → name，用于校验原图文件名没贴错角色。"""
    ts = (ROOT / 'src' / 'data' / 'characters.ts').read_text(encoding='utf-8')
    pairs = re.findall(
        r"id: '(\d+-[mfu])',\s*\n\s*archetypeId: \d+,\s*\n\s*archetype: '[^']*',\s*\n\s*name: '([^']*)'",
        ts,
    )
    return dict(pairs)


def main() -> int:
    if not SRC.is_dir():
        print(f'!! 原图目录不存在：{SRC}')
        return 1
    DST.mkdir(parents=True, exist_ok=True)
    id_name = load_character_names()

    errors: list[str] = []
    images: list[tuple[str, Image.Image]] = []  # (输出名, 处理后的图)
    covered: set[str] = set()

    for f in sorted(SRC.iterdir()):
        m = re.match(r'(\d+)-([mfu])-(.+)\.(png|jpg|jpeg|webp)$', f.name, re.I)
        if not m:
            errors.append(f'文件名不合法（期望 {{id}}-{{m|f|u}}-{{角色名}}.png）：{f.name}')
            continue
        aid, suffix, name = int(m.group(1)), m.group(2), m.group(3)
        cid = f'{aid}-{suffix}'
        expected = id_name.get(cid)
        if expected is None:
            errors.append(f'角色 id 不在角色库中：{f.name}')
            continue
        if expected != name:
            errors.append(f'文件名角色与角色库不符：{f.name} ↔ {cid} 应为「{expected}」')
            continue

        im = Image.open(f).convert('RGB')
        # 防御性中心裁方（豆包原图为 1:1，此步对非标尺寸兜底）
        w, h = im.size
        side = min(w, h)
        im = im.crop(((w - side) // 2, (h - side) // 2, (w + side) // 2, (h + side) // 2))
        im = im.resize((TARGET, TARGET), Image.LANCZOS)

        out_name = f'char-{aid:02d}-{SUFFIX_MAP[suffix]}.webp'
        images.append((out_name, im))
        covered.add(cid)

    missing = sorted(set(id_name) - covered)
    for cid in missing:
        errors.append(f'缺原图：{cid}（{id_name[cid]}）')

    if errors:
        print('!! 问题清单：')
        for e in errors:
            print(f'  - {e}')
        return 1

    # 两阶段：先在内存中按质量档试编码，找到满足「单张 ≤200KB 且 54 张总量 ≤预算」的最高档，再一次落盘
    chosen: tuple[int, list[tuple[str, bytes, int]]] | None = None
    for quality in QUALITY_LADDER:
        encoded: list[tuple[str, bytes, int]] = []
        for out_name, im in images:
            buf = io.BytesIO()
            im.save(buf, 'WEBP', quality=quality, method=6)
            encoded.append((out_name, buf.getvalue(), buf.tell()))
        if all(size <= MAX_BYTES for _, _, size in encoded) and \
                sum(size for _, _, size in encoded) <= TOTAL_BUDGET:
            chosen = (quality, encoded)
            break

    if chosen is None:
        print(f'!! 质量降至 q={QUALITY_LADDER[-1]} 仍超出总量预算 {TOTAL_BUDGET // 1024}KB，请人工介入')
        return 1

    quality, encoded = chosen
    print(f'== 入库 {len(encoded)}/{len(id_name)} 张（q={quality}，{TARGET}×{TARGET}）==')
    for out_name, data, size in encoded:
        (DST / out_name).write_bytes(data)
        flag = ' ⚠️超 200KB' if size > MAX_BYTES else ''
        print(f'  {out_name}  {size / 1024:.0f}KB{flag}')
    total = sum(size for _, _, size in encoded)
    print(f'\n总计 {total / 1024:.0f}KB（{total / 1024 / 1024:.2f}MB），预算 {TOTAL_BUDGET // 1024}KB')
    print('全部通过：54/54，命名规范，单张 ≤200KB，总量在单分包预算内')
    return 0


if __name__ == '__main__':
    sys.exit(main())
