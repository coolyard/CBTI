#!/usr/bin/env python3
"""CBTI 装饰贴纸入库脚本（specs/45 §8 可选增强：AI 贴纸包替换 emoji 装饰层）

用法：python3 scripts/compress-decor.py
输入：raw-decor/{name}.png（豆包原图，白底 1:1；name 必须在白名单内）
处理：四角洪水填充把近白背景抠成透明 → 裁内容边距 → 等比放进 320×320 透明画布
      → 索引色 PNG（保留透明通道）→ 规范命名
输出：src/static/decor/decor-{name}.png

规范来源：specs/70-assets.md §5（装饰贴纸行：320×320、≤60KB、总量 ≤300KB）、
         specs/45-visual-polish.md §8（可选增强，验收同立绘管线）

注意：豆包「AI生成」水印按合规要求保留（同立绘注记）；贴纸渲染尺寸仅 48–72rpx，
水印基本不可见。如介意，请在豆包内用「局部消除」抹掉后再放入 raw-decor/。
"""
import io
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'raw-decor'
DST = ROOT / 'src' / 'static' / 'decor'
MAX_BYTES = 60 * 1024           # 单张上限（specs/70 §5 装饰贴纸行）
TOTAL_BUDGET = 300 * 1024       # 贴纸包总量预算（同上）
TARGET = 320                    # 输出边长（specs/70 §5）
FILL = 0.92                     # 内容占画布比例，四周留白避免贴边
THRESH = 32                     # 近白判定阈值：与纯白差 ≤32 视为背景
PRE_MAX = 640                   # 抠图前先降采样到此边长：输出仅 320，640 有 2 倍余量，
                                # 且纯 Python 洪水填充在 2048 原图上会超时
# 贴纸白名单（specs/45 §8 可选增强；第一批通用 8 个 + 第二批答题页主题 8 个）
NAMES = [
    'burst', 'star', 'bubble', 'bolt', 'tape', 'bang', 'dots', 'arrow',
    'question', 'think', 'target', 'bulb', 'pencil', 'check', 'sweat', 'fire',
]
PNG_COLORS = 128


def white_to_alpha(im: Image.Image, path: Path) -> Image.Image:
    """四角洪水填充把近白背景变透明。

    贴纸本体被粗黑描边封闭（风格前缀保证），填充不会漏进贴纸内部；
    白色内部（如云朵对话框）因描边隔离得以保留。
    """
    rgb = im.convert('RGB')
    arr = np.asarray(rgb)
    sentinel = (1, 2, 3)

    filled = rgb.copy()
    w, h = rgb.size
    corner_used = False
    for seed in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        r, g, b = rgb.getpixel(seed)
        if r >= 255 - THRESH and g >= 255 - THRESH and b >= 255 - THRESH:
            ImageDraw.floodfill(filled, seed, sentinel, thresh=THRESH)
            corner_used = True
    if not corner_used:
        raise RuntimeError(f'{path.name}：四个角都不是近白色，无法抠背景（贴纸顶满画面？请重新出图留白边）')

    # 背景判定 = 填充前后发生变化的像素。不依赖哨兵色唯一性：
    # 背景是近白色，恰好等于 (1,2,3) 的背景像素实际不可能存在；
    # 前景中等于哨兵色的像素不会被填充触及，前后不变，仍判前景。
    bg = np.any(np.asarray(filled) != arr, axis=2)
    out = np.dstack([arr, np.where(bg, 0, 255).astype(np.uint8)])
    return Image.fromarray(out, 'RGBA')


def trim_and_fit(im: Image.Image, path: Path) -> Image.Image:
    """按 alpha 通道裁内容边距，等比缩放进 320×320 透明画布（内容占 92%）。"""
    bbox = im.getchannel('A').getbbox()
    if bbox is None:
        raise RuntimeError(f'{path.name}：抠完背景后没有内容（全透明）')
    im = im.crop(bbox)
    w, h = im.size
    inner = int(TARGET * FILL)
    scale = min(inner / w, inner / h)
    nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
    im = im.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new('RGBA', (TARGET, TARGET), (0, 0, 0, 0))
    canvas.paste(im, ((TARGET - nw) // 2, (TARGET - nh) // 2), im)
    return canvas


def main() -> int:
    if not SRC.is_dir():
        print(f'!! 原图目录不存在：{SRC}（请先把豆包原图按命名表放入）')
        return 1
    DST.mkdir(parents=True, exist_ok=True)

    errors: list[str] = []
    images: list[tuple[str, Image.Image]] = []
    covered: set[str] = set()

    for f in sorted(SRC.iterdir()):
        m = re.match(r'([a-z]+)\.(png|jpg|jpeg|webp)$', f.name, re.I)
        if not m:
            errors.append(f'文件名不合法（期望 {{元素英文名}}.png）：{f.name}')
            continue
        name = m.group(1).lower()
        if name not in NAMES:
            errors.append(f'元素名不在白名单（{"/".join(NAMES)}）：{f.name}')
            continue
        try:
            im = Image.open(f)
            if max(im.size) > PRE_MAX:  # 先降采样再抠图，控制洪水填充耗时
                s = PRE_MAX / max(im.size)
                im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
            im = trim_and_fit(white_to_alpha(im, f), f)
        except RuntimeError as e:
            errors.append(str(e))
            continue
        images.append((f'decor-{name}.png', im))
        covered.add(name)

    for name in sorted(set(NAMES) - covered):
        errors.append(f'缺原图：raw-decor/{name}.png')

    if errors:
        print('!! 问题清单：')
        for e in errors:
            print(f'  - {e}')
        return 1

    encoded: list[tuple[str, bytes, int]] = []
    for out_name, im in images:
        png = im.quantize(colors=PNG_COLORS, method=Image.FASTOCTREE)
        buf = io.BytesIO()
        png.save(buf, 'PNG', optimize=True)
        encoded.append((out_name, buf.getvalue(), buf.tell()))

    if any(size > MAX_BYTES for _, _, size in encoded) or \
            sum(size for _, _, size in encoded) > TOTAL_BUDGET:
        print(f'!! 超出预算（单张 {MAX_BYTES // 1024}KB / 总量 {TOTAL_BUDGET // 1024}KB），请人工介入')
        return 1

    print(f'== 入库 {len(encoded)}/{len(NAMES)} 张（PNG {PNG_COLORS} 色，{TARGET}×{TARGET} 透明底）==')
    for out_name, data, size in encoded:
        (DST / out_name).write_bytes(data)
        flag = ' ⚠️超 60KB' if size > MAX_BYTES else ''
        print(f'  {out_name}  {size / 1024:.1f}KB{flag}')
    total = sum(size for _, _, size in encoded)
    print(f'\n总计 {total / 1024:.1f}KB，预算 {TOTAL_BUDGET // 1024}KB')
    print(f'全部通过：{len(encoded)}/{len(NAMES)}，命名规范，单张 ≤60KB，总量在预算内')
    return 0


if __name__ == '__main__':
    sys.exit(main())
