#!/usr/bin/env python3
"""
CBTI v4.0 题库计分骨架 · 均匀性蒙特卡洛模拟（设计验证工具）

模型（经需求确认）：
- Q1 纯分流不计分；之后每个题材类别 15 道计分题
- 每题固定影响一对维度（X,Y），6 个选项：
    方向一（X高Y低）：(10,1) (10,2) (9,1)
    方向二（X低Y高）：(1,10) (2,10) (1,9)
  每个维度在单题中的取值多重集均为 {10,10,9,1,2,1}，方向对称
- 15 题的维度对分配：10 个无序对全覆盖 + 5 环(AB,BC,CD,DE,EA)
  → 每维恰好被覆盖 6 次，总分范围 6..60，均值 33
- 档位切分：按模拟边际分布取 1/3 分位（L/M/H 各约 1/3）
- 匹配：曼哈顿距离最近模式串；并列时按 archetypeId 升序（与线上代码一致）

输出：分维档位概率、分模式串匹配概率、重复模式串影响、均匀性指标。
"""
import random
import re
import sys
from collections import Counter, defaultdict

CHARACTERS_TS = '/Users/work/learn/CBTI/src/data/characters.ts'
DIMS = ['A存在感', 'B认知力', 'C情感力', 'D规则感', 'E持久力']

# ---- 计分骨架：15 题 → 维度对（0=A 1=B 2=C 3=D 4=E）----
QUESTION_PAIRS = [
    (0, 4), (1, 3), (2, 4), (0, 1), (2, 3),
    (1, 4), (0, 3), (1, 2), (3, 4), (0, 2),
    (0, 4), (0, 1), (1, 2), (2, 3), (3, 4),
]
# 每题 6 选项的 (X, Y) 分值
GRID_VALUES = [(10, 1), (10, 2), (9, 1), (1, 10), (2, 10), (1, 9)]


def load_characters():
    src = open(CHARACTERS_TS, encoding='utf-8').read()
    blocks = re.findall(
        r"\{\s*id: '([^']+)'.*?archetypeId: (\d+).*?name: '([^']+)'.*?gender: '([^']+)'.*?pattern: '([HML](?:-[HML]){4})'(.*?)\}",
        src, re.S,
    )
    chars = []
    for cid, aid, name, gender, pattern, rest in blocks:
        chars.append({
            'id': cid, 'archetypeId': int(aid), 'name': name,
            'gender': gender, 'pattern': pattern,
            'easter': 'easterKey' in rest,
        })
    return chars


def band_codes(pattern):
    return tuple({'L': 0, 'M': 1, 'H': 2}[p] for p in pattern.split('-'))


def simulate(n, thresholds):
    """随机答题 n 次，返回 (分维总分计数, 档位串计数)"""
    t1, t2 = thresholds  # total<=t1 → L; t1<total<t2-… → M; total>=t2 → H
    dim_totals = [Counter() for _ in range(5)]
    band_counter = Counter()
    rng = random.Random(42)
    for _ in range(n):
        totals = [0, 0, 0, 0, 0]
        for x, y in QUESTION_PAIRS:
            sx, sy = GRID_VALUES[rng.randrange(6)]
            totals[x] += sx
            totals[y] += sy
        bands = tuple(0 if t <= t1 else (2 if t >= t2 else 1) for t in totals)
        for i, t in enumerate(totals):
            dim_totals[i][t] += 1
        band_counter[bands] += 1
    return dim_totals, band_counter


def calibrate(n=100_000):
    """校准阈值：使每维 P(L)≈P(M)≈P(H)≈1/3"""
    dim_totals, _ = simulate(n, (-1, 999))  # 全 M，只要边际
    best = None
    # 各维边际分布相同（骨架对称），用第 0 维即可
    cnt = dim_totals[0]
    keys = sorted(cnt)
    cum, total = [], sum(cnt.values())
    s = 0
    cdf = {}
    for k in keys:
        s += cnt[k]
        cdf[k] = s / total
    # t1: 使 P(<=t1) 最接近 1/3；t2: 使 P(>=t2) 最接近 1/3
    t1 = min(keys, key=lambda k: abs(cdf[k] - 1 / 3))
    t2 = min(keys, key=lambda k: abs((1 - cdf.get(k - 1, 0)) - 1 / 3))
    return t1, t2


def evaluate(n, thresholds, chars, pool_gender):
    pool = [c for c in chars if c['gender'] == pool_gender]
    patterns = []
    for c in pool:
        if c['pattern'] not in patterns:
            patterns.append(c['pattern'])
    info = {p: {'codes': band_codes(p),
                'owners': sorted([c for c in pool if c['pattern'] == p],
                                 key=lambda c: c['archetypeId'])}
            for p in patterns}
    _, band_counter = simulate(n, thresholds)
    pat_counter = Counter()
    char_counter_code = Counter()   # 线上代码行为：并列 → archetypeId 最小者赢
    for bands, cnt in band_counter.items():
        ranked = sorted(patterns, key=lambda p: (
            sum(abs(bands[i] - info[p]['codes'][i]) for i in range(5)),
            info[p]['owners'][0]['archetypeId'],
        ))
        winner = ranked[0]
        pat_counter[winner] += cnt
        char_counter_code[info[winner]['owners'][0]['id']] += cnt
    return pat_counter, char_counter_code, info


def report(label, pat_counter, char_counter_code, info, n):
    k = len(info)
    uni = 1 / k
    print(f'\n===== {label}（{k} 个不同模式串，均匀基准 {uni:.2%}）=====')
    rows = sorted(info.keys(), key=lambda p: -pat_counter.get(p, 0))
    probs = []
    for p in rows:
        c = pat_counter.get(p, 0)
        prob = c / n
        probs.append(prob)
        owners = '、'.join(o['name'] for o in info[p]['owners'])
        dup = f' ⚠{len(info[p]["owners"])}人共串' if len(info[p]['owners']) > 1 else ''
        bar = '█' * int(prob / uni * 20)
        print(f'  {p}  {prob:6.2%} (×{prob / uni:4.2f}) {bar} {owners}{dup}')
    mn, mx = min(probs), max(probs)
    chi2 = sum((c - n / k) ** 2 / (n / k) for c in [pat_counter.get(p, 0) for p in info])
    print(f'  —— 最小 {mn:.2%} / 最大 {mx:.2%} / 极差比 {mx / mn:.2f} / χ²={chi2:.0f} (df={k - 1})')
    never = [o['name'] for p in info for o in info[p]['owners'][1:]
             if char_counter_code.get(o['id'], 0) == 0]
    if never:
        print(f'  —— 因并列规则永远当不了主结果的角色：{"、".join(never)}')


def main():
    n_cal, n_eval = 100_000, 300_000
    if len(sys.argv) > 1:
        n_eval = int(sys.argv[1])
    chars = load_characters()
    print(f'角色库：{len(chars)} 个角色')
    t1, t2 = calibrate(n_cal)
    print(f'校准阈值（{n_cal} 次预跑）：total<={t1} → L，{t1 + 1}..{t2 - 1} → M，total>={t2} → H')

    # 档位概率验证
    dim_totals, _ = simulate(n_eval, (t1, t2))
    print(f'\n===== 档位概率（{n_eval} 次模拟）=====')
    for i, name in enumerate(DIMS):
        total = sum(dim_totals[i].values())
        pL = sum(c for t, c in dim_totals[i].items() if t <= t1) / total
        pH = sum(c for t, c in dim_totals[i].items() if t >= t2) / total
        print(f'  {name}: L={pL:.1%} M={1 - pL - pH:.1%} H={pH:.1%}')

    for label, gender in [('男性池', 'male'), ('女性池', 'female')]:
        pc, cc, info = evaluate(n_eval, (t1, t2), chars, gender)
        report(label, pc, cc, info, n_eval)


if __name__ == '__main__':
    main()
