#!/usr/bin/env python3
"""CBTI 题库 v4.0 机械校验器

校验 CBTI_test_questions_categorized.md 中全部 6 个题材类别：
- 每类 15 题，题号前缀连续（修仙-01..15 等）
- 题干以「你」开头且 ≤50 字
- 维度对匹配统一计分骨架（中文维度名）
- 每题恰好 6 个选项，覆盖 3x2 网格全部分值位 (X∈{1,5,10} x Y∈{2,9})
- 选项 ≤40 字
- Q7/Q11 彩蛋种子题：每枚彩蛋（男池=哪吒/悟空，女池=精卫/女娲）恰好 1 个种子选项
"""
import re
import sys

DOC = '/Users/work/learn/CBTI/CBTI_test_questions_categorized.md'

SKELETON = ['AE', 'BD', 'CE', 'AB', 'CD', 'BE', 'AD', 'BC', 'DE', 'AC',
            'AE', 'AB', 'BC', 'CD', 'DE']
DIM_NAME = {'A': '存在感', 'B': '认知力', 'C': '情感力', 'D': '规则感', 'E': '持久力'}
GRID = {(10, 2), (10, 9), (5, 2), (5, 9), (1, 2), (1, 9)}

CATEGORIES = {
    '修仙': ('哪吒', '悟空'),
    '江湖': ('哪吒', '悟空'),
    '热血': ('哪吒', '悟空'),
    '末日': ('精卫', '女娲'),
    '宫廷': ('精卫', '女娲'),
    '都市': ('精卫', '女娲'),
}


def main():
    text = open(DOC, encoding='utf-8').read()
    blocks = re.split(r'\n---\n', text)

    # 按前缀分组收集题目块
    by_cat = {k: [] for k in CATEGORIES}
    for b in blocks:
        m = re.search(r'【题号】([一-鿿]+)-(\d+)', b)
        if m and m.group(1) in CATEGORIES:
            by_cat[m.group(1)].append((int(m.group(2)), m.group(1) + '-' + m.group(2), b))

    total_errors = 0
    for cat, (egg1, egg2) in CATEGORIES.items():
        qs = sorted(by_cat[cat])
        errors = []
        if len(qs) != 15:
            errors.append(f'题数 {len(qs)} != 15')
        expected_ids = [f'{cat}-{i:02d}' for i in range(1, 16)]
        got_ids = [qid for _, qid, _ in qs]
        if got_ids != expected_ids:
            errors.append(f'题号序列异常: {got_ids}')

        for i, (num, qid, b) in enumerate(qs, start=1):
            # 题干
            m = re.search(r'【题干】(.*)', b)
            if not m:
                errors.append(f'{qid} 缺题干')
                continue
            stem = m.group(1).strip()
            if not stem.startswith('你'):
                errors.append(f'{qid} 题干未以「你」开头: {stem[:15]}…')
            if len(stem) > 50:
                errors.append(f'{qid} 题干超50字({len(stem)})')
            # 维度对
            pair = ''
            dm = re.search(r'维度对：(.+?)×(.+?)）', b)
            if dm:
                c1 = [k for k, v in DIM_NAME.items() if v == dm.group(1).strip()]
                c2 = [k for k, v in DIM_NAME.items() if v == dm.group(2).strip()]
                if c1 and c2:
                    pair = c1[0] + c2[0]
            if pair != SKELETON[i - 1]:
                errors.append(f'{qid} 维度对 {pair or "?"} != 骨架 {SKELETON[i-1]}')
            # 选项
            opts = re.findall(r'【选项 ([A-F])】(.+?) → .+? (\d+) / .+? (\d+)', b)
            if len(opts) != 6:
                errors.append(f'{qid} 选项数 {len(opts)} != 6')
            else:
                letters = [o[0] for o in opts]
                if letters != ['A', 'B', 'C', 'D', 'E', 'F']:
                    errors.append(f'{qid} 选项字母乱序: {letters}')
                scores = {(int(o[2]), int(o[3])) for o in opts}
                if scores != GRID:
                    errors.append(f'{qid} 网格未全覆盖: 缺{GRID - scores} 多{scores - GRID}')
                for letter, txt, _s1, _s2 in opts:
                    if len(txt.strip()) > 40:
                        errors.append(f'{qid} 选项{letter} 超40字({len(txt.strip())})')
            # 彩蛋
            if i in (7, 11):
                e1 = b.count(f'彩蛋标记：{egg1}种子')
                e2 = b.count(f'彩蛋标记：{egg2}种子')
                if e1 != 1 or e2 != 1:
                    errors.append(f'{qid} 彩蛋种子数异常: {egg1}x{e1} {egg2}x{e2} (应各1)')
                if '彩蛋种子题' not in b:
                    errors.append(f'{qid} 题型未标注彩蛋种子题')
            else:
                if '彩蛋标记：无' not in b:
                    errors.append(f'{qid} 缺 [彩蛋标记：无]')

        status = '✅ 全绿' if not errors else f'❌ {len(errors)} 个问题'
        print(f'[{cat}] 15题校验: {status}')
        for e in errors:
            print('   -', e)
        total_errors += len(errors)

    if total_errors:
        print(f'\n共 {total_errors} 个问题')
        sys.exit(1)
    print('\n✅ 六个类别全部通过')


if __name__ == '__main__':
    main()
