#!/usr/bin/env python3
"""CBTI v4.0 数据生成器与匹配查找表生成器。

功能：
1. 从 CBTI_test_questions_categorized.md 解析 Q1 分流题与 6 类别 × 15 题，
   生成 src/data/category/*.ts。
2. 按 specs/30 分维阈值与均衡 LUT 逻辑生成 src/data/match-lut.ts。
3. 生成 tests/fixtures/v4-cases.json（1000 条对拍路径）。
"""
import argparse
import itertools
import json
import math
import random
import re
import sys
from pathlib import Path

import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent
CHARACTERS_TS = BASE_DIR / 'src/data/characters.ts'
DOC = BASE_DIR / 'CBTI_test_questions_categorized.md'

DIMS = ['A存在感', 'B认知力', 'C情感力', 'D规则感', 'E持久力']
CODES = ('presence', 'cognition', 'emotion', 'order', 'endurance')
QUESTION_PAIRS = [
    (0, 4), (1, 3), (2, 4), (0, 1), (2, 3),
    (1, 4), (0, 3), (1, 2), (3, 4), (0, 2),
    (0, 4), (0, 1), (1, 2), (2, 3), (3, 4),
]
GRID = np.array([(x, y) for x in (1, 5, 10) for y in (2, 9)])
CELLS = np.array(list(itertools.product([0, 1, 2], repeat=5)))
BAND_CODES = ('L', 'M', 'H')

CATEGORY_CONFIG = [
    ('xiuxian', '修仙', '修仙宗门'),
    ('jianghu', '江湖', '江湖朝堂'),
    ('rexue', '热血', '热血校园竞技'),
    ('mori', '末日', '末日求生'),
    ('gongting', '宫廷', '宫廷深宅后宫'),
    ('dushi', '都市', '都市闺蜜职场'),
]

DIM_CODE = {
    '存在感': 'presence',
    '认知力': 'cognition',
    '情感力': 'emotion',
    '规则感': 'order',
    '持久力': 'endurance',
}
SEED_CODE = {
    '哪吒种子': 'nezha',
    '悟空种子': 'wukong',
    '精卫种子': 'jingwei',
    '女娲种子': 'nuwa',
}
GRID_CELLS = [(10, 2), (10, 9), (5, 2), (5, 9), (1, 2), (1, 9)]

# 模式串去重微调（v4.0 已确认，生成数据与 LUT 均应用）
PROPOSED_EDITS = {
    '19-m': 'M-L-M-L-H',
    '26-m': 'H-M-M-L-H',
    '25-m': 'L-H-M-H-M',
    '20-f': 'H-H-M-M-H',
    '25-f': 'M-H-L-H-M',
}


def ts_str(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def parse_md():
    text = DOC.read_text(encoding='utf-8')
    categories = {}
    for cid, prefix, name in CATEGORY_CONFIG:
        section = re.search(rf'## .*?{name}题库.*?(?=\n## |\Z)', text, re.S)
        if not section:
            raise SystemExit(f'未找到 {name} 题库章节')
        categories[cid] = parse_category_questions(section.group(0), cid, prefix, name)
    q1 = parse_theme_split(text)
    return q1, categories


def parse_theme_split(text: str):
    section = re.search(r'## 一、题材分流题.*?(?=\n## 二、)', text, re.S)
    if not section:
        raise SystemExit('未找到题材分流题章节')
    block = section.group(0)
    stem_match = re.search(r'【题干】(.+)', block)
    if not stem_match:
        raise SystemExit('Q1 缺题干')
    note_match = re.search(r'【设计说明】(.+)', block)
    category_by_name = {name: cid for cid, _prefix, name in CATEGORY_CONFIG}
    options = []
    for letter in ('A', 'B', 'C', 'D', 'E', 'F'):
        m = re.search(rf'【选项 {letter}】(.+?) → (.+?)（', block)
        if not m:
            raise SystemExit(f'Q1 缺选项 {letter}')
        text_part = m.group(1).strip()
        category_name = m.group(2).strip()
        if category_name not in category_by_name:
            raise SystemExit(f'Q1 无法识别题材：{category_name}')
        options.append(
            {
                'key': letter,
                'text': text_part,
                'targetCategory': category_by_name[category_name],
            }
        )
    return {
        'id': 0,
        'type': 'theme-split',
        'scene': '题材世界入口',
        'stem': stem_match.group(1).strip(),
        'options': options,
        'designNote': note_match.group(1).strip() if note_match else '',
    }


def parse_category_questions(section: str, cid: str, prefix: str, name: str):
    questions = []
    blocks = re.split(r'\n---\n', section)
    for block in blocks:
        m = re.search(rf'【题号】{re.escape(prefix)}-(\d+)', block)
        if not m:
            continue
        qid = int(m.group(1))
        if qid < 1 or qid > 15:
            raise SystemExit(f'{prefix}-{qid} 越界')
        stem_match = re.search(r'【题干】(.+)', block)
        pair_match = re.search(r'维度对：(.+?)×(.+?)）', block)
        note_match = re.search(r'【设计说明】(.+)', block)
        if not stem_match or not pair_match:
            raise SystemExit(f'{prefix}-{qid} 缺题干或维度对')
        dim1 = DIM_CODE.get(pair_match.group(1).strip())
        dim2 = DIM_CODE.get(pair_match.group(2).strip())
        if not dim1 or not dim2:
            raise SystemExit(f'{prefix}-{qid} 维度名非法')

        option_line_re = re.compile(
            r'【选项 ([A-F])】(.+?) → (.+?) (\d+) / (.+?) (\d+)'
        )
        marker_re = re.compile(r'\[彩蛋标记：([^]]+)]')
        options = []
        current_letter = None
        for line in block.splitlines():
            option_match = option_line_re.search(line)
            if option_match:
                letter = option_match.group(1)
                text = option_match.group(2).strip()
                dim_a_name = option_match.group(3).strip()
                value_a = int(option_match.group(4))
                dim_b_name = option_match.group(5).strip()
                value_b = int(option_match.group(6))
                if DIM_CODE.get(dim_a_name) != dim1 or DIM_CODE.get(dim_b_name) != dim2:
                    raise SystemExit(f'{prefix}-{qid} 选项 {letter} 维度与题干不一致')
                options.append(
                    {
                        'key': letter,
                        'text': text,
                        'scores': {dim1: value_a, dim2: value_b},
                    }
                )
                current_letter = letter
                continue
            marker_match = marker_re.search(line)
            if marker_match and current_letter:
                marker = marker_match.group(1).strip()
                if marker != '无' and marker != '见选项标注':
                    seed = SEED_CODE.get(marker)
                    if not seed:
                        raise SystemExit(f'{prefix}-{qid} 未知彩蛋标记：{marker}')
                    option = next(o for o in options if o['key'] == current_letter)
                    option['seedTag'] = seed
                    current_letter = None

        if len(options) != 6:
            raise SystemExit(f'{prefix}-{qid} 选项数 {len(options)} != 6')
        keys = [o['key'] for o in options]
        if keys != ['A', 'B', 'C', 'D', 'E', 'F']:
            raise SystemExit(f'{prefix}-{qid} 选项顺序异常：{keys}')
        pair = (dim1, dim2)
        expected = QUESTION_PAIRS[qid - 1]
        if pair != (CODES[expected[0]], CODES[expected[1]]):
            raise SystemExit(f'{prefix}-{qid} pair {pair} 与骨架不一致')
        questions.append(
            {
                'id': qid,
                'type': 'easter' if qid in (7, 11) else 'normal',
                'pair': [pair[0], pair[1]],
                'scene': name,
                'stem': stem_match.group(1).strip(),
                'options': options,
                'designNote': note_match.group(1).strip() if note_match else '',
            }
        )
    if len(questions) != 15:
        raise SystemExit(f'{name} 题库题数 {len(questions)} != 15')
    return sorted(questions, key=lambda q: q['id'])


def scores_code(pair, scores):
    return (scores[pair[0]], scores[pair[1]])


def pattern_from_totals(totals, th):
    bands = []
    for dim in range(5):
        total = totals[dim]
        if total <= th[dim][0]:
            bands.append('L')
        elif total >= th[dim][1]:
            bands.append('H')
        else:
            bands.append('M')
    return '-'.join(bands)


def total_ranges():
    result = {}
    for dim in range(5):
        x_count = sum(1 for pair in QUESTION_PAIRS if pair[0] == dim)
        y_count = sum(1 for pair in QUESTION_PAIRS if pair[1] == dim)
        result[CODES[dim]] = {'min': x_count * 1 + y_count * 2, 'max': x_count * 10 + y_count * 9}
    return result


def load_pools(apply_edits):
    src = CHARACTERS_TS.read_text(encoding='utf-8')
    blocks = re.findall(
        r"\{\s*id: '([^']+)'.*?archetypeId: (\d+).*?name: '([^']+)'.*?gender: '([^']+)'.*?pattern: '([HML](?:-[HML]){4})'(.*?)\}",
        src,
        re.S,
    )
    out = {}
    for g in ('male', 'female'):
        chars = []
        for cid, aid, name, gender, pattern, _ in blocks:
            if gender != g:
                continue
            if int(aid) in (27, 28, 29, 30):
                continue  # 彩蛋角色不进常规池 / LUT
            if apply_edits and cid in PROPOSED_EDITS:
                pattern = PROPOSED_EDITS[cid]
            chars.append({'id': cid, 'aid': int(aid), 'name': name, 'pattern': pattern})
        chars.sort(key=lambda c: c['aid'])
        pats, ids, names, owners = [], [], [], {}
        for c in chars:
            owners.setdefault(c['pattern'], []).append(c['name'])
            if c['pattern'] not in pats:
                pats.append(c['pattern'])
                ids.append(c['id'])
                names.append(c['name'])
        codes = np.array([[{'L': 0, 'M': 1, 'H': 2}[x] for x in p.split('-')] for p in pats])
        out[g] = (pats, codes, ids, names, owners)
    return out


def simulate_totals(rng, n):
    picks = rng.integers(0, 6, size=(n, len(QUESTION_PAIRS)))
    totals = np.zeros((n, 5), dtype=np.int32)
    for q, (x, y) in enumerate(QUESTION_PAIRS):
        s = GRID[picks[:, q]]
        totals[:, x] += s[:, 0]
        totals[:, y] += s[:, 1]
    return totals


def tercile_thresholds(totals):
    th = np.zeros((5, 2), dtype=int)
    for d in range(5):
        t = np.sort(totals[:, d])
        th[d] = (t[len(t) // 3], t[2 * len(t) // 3 + 1])
    return th


def cell_masses(rng, n, th):
    totals = simulate_totals(rng, n)
    bands = np.full((n, 5), 1, dtype=np.int32)
    for d in range(5):
        bands[totals[:, d] <= th[d, 0], d] = 0
        bands[totals[:, d] >= th[d, 1], d] = 2
    keys = bands @ np.array([81, 27, 9, 3, 1])
    cnt = np.bincount(keys, minlength=243)
    return cnt / n


def refine(assign, codes, masses, slack, rounds=300):
    k = len(codes)
    d = np.abs(CELLS[:, None, :] - codes[None, :, :]).sum(axis=2)
    d1 = d.min(axis=1)
    for _ in range(rounds):
        m = np.bincount(assign, weights=masses, minlength=k)
        lo, hi = int(m.argmin()), int(m.argmax())
        best_c, best_gain = -1, 0.0
        for c in np.where(assign == hi)[0]:
            if d[c, lo] <= d1[c] + slack and masses[c] > best_gain and m[hi] - masses[c] >= m[lo] + masses[c]:
                best_c, best_gain = c, masses[c]
        if best_c < 0:
            break
        assign[best_c] = lo
    return assign


def build_lut(codes, masses, r0=1.10, slack=3):
    k = len(codes)
    d = np.abs(CELLS[:, None, :] - codes[None, :, :]).sum(axis=2)
    target = masses.sum() / k
    order = np.argsort(-(np.partition(d, 1, axis=1)[:, 1] - d.min(axis=1)))
    r = r0
    while True:
        cap = target * r
        used = np.zeros(k)
        assign = np.full(243, -1)
        overflow = 0
        for c in order:
            d1c = d[c].min()
            for o in np.argsort(d[c]):
                if d[c, o] <= d1c + slack and used[o] + masses[c] <= cap:
                    assign[c] = o
                    used[o] += masses[c]
                    break
            if assign[c] < 0:
                overflow += 1
                o = int(d[c].argmin())
                assign[c] = o
                used[o] += masses[c]
        if overflow == 0 or r > 2.5:
            break
        r += 0.05
    assign = refine(assign, codes, masses, slack)
    return assign


def build_maps(pools, th, masses):
    lut = {}
    for g in ('male', 'female'):
        pats, codes, ids, _names, _owners = pools[g]
        assign = build_lut(codes, masses)
        record = {}
        for cell_index in range(243):
            pattern = '-'.join(BAND_CODES[code] for code in CELLS[cell_index])
            record[pattern] = ids[assign[cell_index]]
        lut[g] = record
    thresholds = {}
    for dim, code in enumerate(CODES):
        thresholds[code] = {'lowMax': int(th[dim][0]), 'highMin': int(th[dim][1])}
    return lut, thresholds


def score_path(category_questions, answers):
    totals = {dim: 0 for dim in ('presence', 'cognition', 'emotion', 'order', 'endurance')}
    grid_path = []
    for question, key in zip(category_questions, answers):
        option = next(o for o in question['options'] if o['key'] == key)
        pair = question['pair']
        grid_value = (option['scores'][pair[0]], option['scores'][pair[1]])
        grid_path.append(GRID_CELLS.index(grid_value) + 1)
        for dim, value in option['scores'].items():
            totals[dim] += value
    return totals, grid_path


def normalize_totals(totals, ranges):
    out = {}
    for dim, value in totals.items():
        low = ranges[dim]['min']
        high = ranges[dim]['max']
        out[dim] = math.floor((1 + (value - low) / (high - low) * 9) * 100 + 0.5) / 100
    return out


def build_fixtures(categories, lut, th, ranges, count=1000):
    fixtures = []
    rng = random.Random(20260904)
    ids = list(categories)
    for index in range(count):
        cid = ids[index % len(ids)]
        category = categories[cid]
        answers = [rng.choice('ABCDEF') for _ in range(15)]
        fixtures.append(make_fixture(category, answers, lut, th, ranges, cid))
    # 每个类别补 4 条锁定路径，替换同量随机路径
    for cid, category in categories.items():
        pool = 'male' if cid in ('xiuxian', 'jianghu', 'rexue') else 'female'
        tags = ('nezha', 'wukong') if pool == 'male' else ('jingwei', 'nuwa')
        lock_paths = []
        for tag in tags:
            q7_key = next(o['key'] for o in category[6]['options'] if o.get('seedTag') == tag)
            q11_key = next(o['key'] for o in category[10]['options'] if o.get('seedTag') == tag)
            for _ in range(2):
                answers = [rng.choice('ABCDEF') for _ in range(15)]
                answers[6] = q7_key
                answers[10] = q11_key
                lock_paths.append(make_fixture(category, answers, lut, th, ranges, cid, force_easter=tag))
        for _ in range(len(lock_paths)):
            index = next(i for i, f in enumerate(fixtures) if f['category'] == cid and not f['expectedEaster'])
            fixtures[index] = lock_paths.pop(0)
    return fixtures


def make_fixture(category, answers, lut, th, ranges, cid, force_easter=None):
    totals, grid_path = score_path(category, answers)
    totals_list = [totals[dim] for dim in ('presence', 'cognition', 'emotion', 'order', 'endurance')]
    pattern = pattern_from_totals(totals_list, th)
    seed_q7 = next(
        o.get('seedTag')
        for o in category[6]['options']
        if o['key'] == answers[6]
    )
    seed_q11 = next(
        o.get('seedTag')
        for o in category[10]['options']
        if o['key'] == answers[10]
    )
    seed = seed_q7 if seed_q7 and seed_q7 == seed_q11 else None
    if seed and force_easter and seed != force_easter:
        seed = None
    pool = 'male' if cid in ('xiuxian', 'jianghu', 'rexue') else 'female'
    main_id = lut[pool][pattern]
    if seed:
        main_id = {'nezha': '27-m', 'wukong': '28-m', 'jingwei': '29-f', 'nuwa': '30-f'}[seed]
    elif force_easter:
        seed = force_easter
        main_id = {'nezha': '27-m', 'wukong': '28-m', 'jingwei': '29-f', 'nuwa': '30-f'}[seed]
    return {
        'category': cid,
        'answers': answers,
        'gridPath': grid_path,
        'expectedPattern': pattern,
        'expectedDimensionTotals': totals,
        'expectedDimensionScores': normalize_totals(totals, ranges),
        'expectedMainId': main_id,
        'expectedEaster': seed,
    }


def emit_data_ts(q1, categories):
    data_dir = BASE_DIR / 'src/data/category'
    data_dir.mkdir(parents=True, exist_ok=True)
    for cid, category in categories.items():
        lines = [
            '/**',
            f' * {category[0]["scene"]} 题库（由 scripts/build-match-table.py 生成，禁止手改）',
            ' */',
            "import type { Question } from '../../types'",
            '',
            f'export const rawQuestions: Question[] = [',
        ]
        for q in category:
            lines.append('  {')
            lines.append(f"    id: {q['id']},")
            lines.append(f"    type: {ts_str(q['type']) },")
            lines.append(
                f"    pair: [{ts_str(q['pair'][0])}, {ts_str(q['pair'][1])}],"
            )
            lines.append(f"    scene: {ts_str(q['scene']) },")
            lines.append(f"    stem: {ts_str(q['stem']) },")
            lines.append('    options: [')
            for option in q['options']:
                scores = option.get('scores')
                seed = option.get('seedTag')
                scores_text = (
                    '{ '
                    + ', '.join(f"{ts_str(k)}: {v}" for k, v in scores.items())
                    + ' }'
                    if scores
                    else 'undefined'
                )
                option_lines = [
                    '      {',
                    f"        key: {ts_str(option['key']) },",
                    f"        text: {ts_str(option['text']) },",
                    f"        scores: {scores_text},",
                ]
                if seed:
                    option_lines.append(f"        seedTag: {ts_str(seed) },")
                option_lines.append('      },')
                lines.extend(option_lines)
            lines.append('    ],')
            lines.append(f"    designNote: {ts_str(q['designNote']) },")
            lines.append('  },')
        lines.append(']')
        lines.append('')
        (data_dir / f'{cid}.ts').write_text('\n'.join(lines), encoding='utf-8')

    # category/index.ts
    names = {cid: name for cid, _prefix, name in CATEGORY_CONFIG}
    index = [
        '/**',
        ' * 6 类别题库与 Q1 分流题聚合（由 scripts/build-match-table.py 生成，禁止手改）',
        ' */',
        "import type { Category, CategoryMeta, OptionKey, ThemeSplitQuestion } from '../../types'",
        "import { CATEGORY_POOL } from '../../types'",
    ]
    for cid, _prefix, _name in CATEGORY_CONFIG:
        index.append(f"import {{ rawQuestions as raw{cid.capitalize()}Questions }} from './{cid}'")
    index.extend(
        [
            '',
            'export const themeSplitQuestion: ThemeSplitQuestion = {',
            f"  id: {q1['id']},",
            f"  type: 'theme-split',",
            f"  scene: {ts_str(q1['scene']) },",
            f"  stem: {ts_str(q1['stem']) },",
            '  options: [',
        ]
    )
    for option in q1['options']:
        index.extend(
            [
                '    {',
                f"      key: {ts_str(option['key']) },",
                f"      text: {ts_str(option['text']) },",
                f"      targetCategory: {ts_str(option['targetCategory']) },",
                '    },',
            ]
        )
    index.extend(
        [
            '  ],',
            f"  designNote: {ts_str(q1['designNote']) }",
            '}',
            '',
            'export const CATEGORIES: Record<Category, CategoryMeta> = {',
        ]
    )
    for cid, _prefix, _name in CATEGORY_CONFIG:
        index.extend(
            [
                f"  {cid}: {{",
                f"    id: {ts_str(cid) },",
                f"    name: {ts_str(names[cid]) },",
                f"    pool: CATEGORY_POOL.{cid},",
                f"    questions: raw{cid.capitalize()}Questions",
                '  },',
            ]
        )
    index.extend(
        [
            '}',
            '',
            'const Q1_ROUTE: Record<OptionKey, Category> = {',
        ]
    )
    for option in q1['options']:
        index.append(f"  {option['key']}: {ts_str(option['targetCategory']) },")
    index.extend(
        [
            '}',
            '',
            'export function getCategoryByQ1Option(key: OptionKey): CategoryMeta {',
            '  const categoryId = Q1_ROUTE[key]',
            '  return CATEGORIES[categoryId]',
            '}',
            '',
        ]
    )
    (data_dir / 'index.ts').write_text('\n'.join(index), encoding='utf-8')


def emit_lut_ts(lut, thresholds, ranges):
    target = BASE_DIR / 'src/data/match-lut.ts'
    lines = [
        '/**',
        ' * 本文件由 scripts/build-match-table.py 生成，禁止手改。',
        ' */',
        'import type { RolePool } from "../types"',
        '',
        'export const DIMENSION_THRESHOLDS = {',
    ]
    for code in ('presence', 'cognition', 'emotion', 'order', 'endurance'):
        lines.append(
            f"  {code}: {{ lowMax: {thresholds[code]['lowMax']}, highMin: {thresholds[code]['highMin']} }},"
        )
    lines.extend(['} as const', ''])
    lines.append('export const DIM_TOTAL_MIN = {')
    for code in ('presence', 'cognition', 'emotion', 'order', 'endurance'):
        lines.append(f"  {code}: {ranges[code]['min']},")
    lines.extend(['} as const', ''])
    lines.append('export const DIM_TOTAL_MAX = {')
    for code in ('presence', 'cognition', 'emotion', 'order', 'endurance'):
        lines.append(f"  {code}: {ranges[code]['max']},")
    lines.extend(['} as const', ''])
    lines.append('export const MATCH_LUT: Record<RolePool, Record<string, string>> = {')
    for pool in ('male', 'female'):
        lines.append(f"  {pool}: {{")
        for pattern, cid in lut[pool].items():
            lines.append(f"    {ts_str(pattern)}: {ts_str(cid) },")
        lines.append('  },')
    lines.extend(['}', ''])
    target.write_text('\n'.join(lines), encoding='utf-8')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('n', nargs='?', type=int, default=3_000_000)
    parser.add_argument('--no-edits', action='store_true')
    parser.add_argument('--emit-ts', action='store_true')
    parser.add_argument('--emit-fixtures', action='store_true')
    args = parser.parse_args()

    apply_edits = not args.no_edits
    rng = np.random.default_rng(7)
    totals = simulate_totals(rng, 200_000)
    th = tercile_thresholds(totals)
    ranges = total_ranges()
    masses = cell_masses(np.random.default_rng(42), args.n, th)
    pools = load_pools(apply_edits)
    lut, thresholds = build_maps(pools, th, masses)
    q1, categories = parse_md()

    if args.emit_ts:
        emit_data_ts(q1, categories)
        emit_lut_ts(lut, thresholds, ranges)
        print('✅ 已生成 src/data/category/*.ts 与 src/data/match-lut.ts')
    if args.emit_fixtures:
        fixtures = build_fixtures(categories, lut, th, ranges)
        fixture_path = BASE_DIR / 'tests/fixtures/v4-cases.json'
        fixture_path.parent.mkdir(parents=True, exist_ok=True)
        fixture_path.write_text(json.dumps(fixtures, ensure_ascii=False, indent=1), encoding='utf-8')
        print(f'✅ 已生成 {fixture_path.relative_to(BASE_DIR)}（{len(fixtures)} 条）')
    if not args.emit_ts and not args.emit_fixtures:
        print(f'分维阈值（tercile 校准）:\n{th}')
        print(f'去重微调: {"应用" if apply_edits else "不应用"}')
        for label, g in [('男性池', 'male'), ('女性池', 'female')]:
            pats, codes, _ids, _names, owners = pools[g]
            dups = {p: o for p, o in owners.items() if len(o) > 1}
            print(f'\n{label}: {sum(len(o) for o in owners.values())} 角色 / {len(pats)} distinct 模式串', end='')
            print(f'，重复: {dups if dups else "无"}')
            assign = build_lut(codes, masses)
            m = np.bincount(assign, weights=masses, minlength=len(pats))
            print(f'  LUT 极差比: {m.max() / max(m.min(), 1e-12):.2f}')


if __name__ == '__main__':
    main()
