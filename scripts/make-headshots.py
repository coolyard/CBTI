#!/usr/bin/env python3
"""CBTI 头部立绘生成脚本（用户需求：圆形头像框只放头部，源自 640 立绘裁切）

用法：python3 scripts/make-headshots.py
输入：src/pkg-characters/characters/char-*.webp（54 张 640×640 立绘）
处理：按头部区域裁方（居中半身像的头部在上半部中央）→ 320×320 → WebP
输出：src/pkg-heads/heads/head-{原型两位补零}-{male|female}.webp

裁切参数：CROP_SIDE 占原图比例、CROP_TOP 顶部偏移比例——如有角色裁偏，
调这两个常量后重跑（幂等覆盖）。

规范来源：specs/70-assets.md §5（装饰贴纸行同规格思路：≤60KB）；
输出入独立分包 src/pkg-heads（pkg-characters 已用 1.83MB/2MB，不能再塞）。
"""
import io
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src' / 'pkg-characters' / 'characters'
DST = ROOT / 'src' / 'pkg-heads' / 'heads'
MAX_BYTES = 60 * 1024           # 单张上限
TOTAL_BUDGET = 800 * 1024       # 54 张总量预算（新分包 2MB 限制下预留充裕）
TARGET = 320
CROP_SIDE = 0.60                # 裁切边长 = 原图 60%（640 → 384）
CROP_TOP = 0.02                 # 裁切框顶部距原图顶 2%（头部通常贴顶）
QUALITY_LADDER = (85, 80, 75, 70, 65, 60, 55, 50)


def main() -> int:
    if not SRC.is_dir():
        print(f'!! 立绘目录不存在：{SRC}')
        return 1
    DST.mkdir(parents=True, exist_ok=True)

    errors: list[str] = []
    images: list[tuple[str, Image.Image]] = []

    files = sorted(f for f in SRC.iterdir() if re.match(r'char-\d{2}-(male|female)\.webp$', f.name))
    if len(files) != 54:
        errors.append(f'立绘数量异常：期望 54，实际 {len(files)}')

    for f in files:
        out_name = f.name.replace('char-', 'head-', 1)
        im = Image.open(f).convert('RGB')
        w, h = im.size
        side = round(w * CROP_SIDE)
        x0 = (w - side) // 2
        y0 = round(h * CROP_TOP)
        im = im.crop((x0, y0, x0 + side, y0 + side))
        im = im.resize((TARGET, TARGET), Image.LANCZOS)
        images.append((out_name, im))

    if errors:
        print('!! 问题清单：')
        for e in errors:
            print(f'  - {e}')
        return 1

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
        print(f'!! 质量降至 q={QUALITY_LADDER[-1]} 仍超预算，请人工介入')
        return 1

    quality, encoded = chosen
    print(f'== 生成 {len(encoded)} 张头部立绘（q={quality}，{TARGET}×{TARGET}）==')
    for out_name, data, size in encoded:
        (DST / out_name).write_bytes(data)
    total = sum(size for _, _, size in encoded)
    print(f'总计 {total / 1024:.0f}KB，单张最大 {max(s for _, _, s in encoded) / 1024:.1f}KB'
          f'（预算：单张 {MAX_BYTES // 1024}KB / 总量 {TOTAL_BUDGET // 1024}KB）')
    return 0


if __name__ == '__main__':
    sys.exit(main())
