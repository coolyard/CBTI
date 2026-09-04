#!/usr/bin/env python3
"""
CBTI v4.0 题库计分骨架 · 结构对比实验

对比两种选项结构在「角色匹配均匀性」上的表现：
- 结构 A（纯极化镜像）：6 选项 = (10,1)(10,2)(9,1) + 镜像
  → 每题两维之和≈11，全卷总分近恒定 → 多 H 型角色饿死（已验证极差比 ≥27）
- 结构 B（3×2 独立网格）：6 选项 = {2,6,10}×{3,9} 全组合
  → 两维分值解耦，总分预算放开 → 档位向量接近乘积分布，格子质量可调

两池联合优化：目标 = max(男性池极差比, 女性池极差比) 最小。
"""
import re
import sys
import numpy as np

CHARACTERS_TS = '/Users/work/learn/CBTI/src/data/characters.ts'
DIMS = ['A存在感', 'B认知力', 'C情感力', 'D规则感', 'E持久力']
QUESTION_PAIRS = [
    (0, 4), (1, 3), (2, 4), (0, 1), (2, 3),
    (1, 4), (0, 3), (1, 2), (3, 4), (0, 2),
    (0, 4), (0, 1), (1, 2), (2, 3), (3, 4),
]
STRUCTS = {
    'A 极化镜像': np.array([(10, 1), (10, 2), (9, 1), (1, 10), (2, 10), (1, 9)]),
    'B 3×2网格': np.array([(x, y) for x in (2, 6, 10) for y in (3, 9)]),
}


def load_pools():
    src = open(CHARACTERS_TS, encoding='utf-8').read()
    blocks = re.findall(
        r"\{\s*id: '([^']+)'.*?archetypeId: (\d+).*?name: '([^']+)'.*?gender: '([^']+)'.*?pattern: '([HML](?:-[HML]){4})'(.*?)\}",
        src, re.S)
    out = {}
    for g in ('male', 'female'):
        chars = sorted(({'aid': int(a), 'name': n, 'pattern': p}
                        for _, a, n, gd, p, _ in blocks if gd == g), key=lambda c: c['aid'])
        pats, owners = [], {}
        for c in chars:
            owners.setdefault(c['pattern'], []).append(c['name'])
            if c['pattern'] not in pats:
                pats.append(c['pattern'])
        codes = np.array([[{'L': 0, 'M': 1, 'H': 2}[x] for x in p.split('-')] for p in pats])
        out[g] = (pats, codes, owners)
    return out


def make_bands(rng, n, th, scores):
    picks = rng.integers(0, len(scores), size=(n, len(QUESTION_PAIRS)))
    totals = np.zeros((n, 5), dtype=np.int32)
    for q, (x, y) in enumerate(QUESTION_PAIRS):
        s = scores[picks[:, q]]
        totals[:, x] += s[:, 0]  # x ≠ y，直接索引即可
        totals[:, y] += s[:, 1]
    bands = np.full((n, 5), 1, dtype=np.int32)
    for d in range(5):
        bands[totals[:, d] <= th[d, 0], d] = 0
        bands[totals[:, d] >= th[d, 1], d] = 2
    return bands, totals


def match_counts(bands, codes):
    d = np.abs(bands[:, None, :] - codes[None, :, :]).sum(axis=2)
    return np.bincount(d.argmin(axis=1), minlength=len(codes))


def ratio(counts):
    p = counts / counts.sum()
    return p.max() / max(p.min(), 1e-12), p


def optimize(pools, scores, n_eval=100_000, seed=7, t_lo=15, t_hi=55):
    th = np.tile(np.array([26, 40]), (5, 1))
    rng = np.random.default_rng(seed)

    def score(th_):
        bands, _ = make_bands(rng, n_eval, th_, scores)
        r_m, _ = ratio(match_counts(bands, pools['male'][1]))
        r_f, _ = ratio(match_counts(bands, pools['female'][1]))
        return max(r_m, r_f)

    best = score(th)
    print(f'  初始 max(极差比): {best:.2f}', flush=True)
    improved, sweep = True, 0
    while improved and sweep < 6:
        improved, sweep = False, sweep + 1
        for d in range(5):
            for j in range(2):
                for delta in (-2, -1, 1, 2):
                    cand = th.copy()
                    cand[d, j] += delta
                    if not (t_lo <= cand[d, 0] < cand[d, 1] - 1 <= t_hi):
                        continue
                    v = score(cand)
                    if v < best - 1e-9:
                        th, best = cand, v
                        improved = True
        print(f'  sweep {sweep}: max(极差比) {best:.2f}, 阈值 {th.tolist()}', flush=True)
    return th, best


def final_report(pools, scores, th, n=1_000_000):
    rng = np.random.default_rng(123)
    bands, totals = make_bands(rng, n, th, scores)
    print('  分维档位概率：')
    for d, name in enumerate(DIMS):
        t1, t2 = th[d]
        pL = (totals[:, d] <= t1).mean()
        pH = (totals[:, d] >= t2).mean()
        print(f'    {name}: L={pL:.1%} M={1 - pL - pH:.1%} H={pH:.1%}')
    for label, g in [('男性池', 'male'), ('女性池', 'female')]:
        pats, codes, owners = pools[g]
        counts = match_counts(bands, codes)
        r, p = ratio(counts)
        k = len(pats)
        print(f'  == {label}（{k} 串，基准 {1 / k:.2%}，极差比 {r:.2f}）==')
        for i in np.argsort(-p):
            dup = f' ⚠×{len(owners[pats[i]])}' if len(owners[pats[i]]) > 1 else ''
            print(f'    {pats[i]}  {p[i]:6.2%} (×{p[i] * k:4.2f})  {"、".join(owners[pats[i]])}{dup}')


def main():
    pools = load_pools()
    for name, scores in STRUCTS.items():
        print(f'\n########## 结构 {name}（选项：{scores.tolist()}）##########')
        th, best = optimize(pools, scores)
        print(f'  最优阈值:\n{th}\n  max(极差比)={best:.2f}，终验（100 万次，换种子）：')
        final_report(pools, scores, th)


if __name__ == '__main__':
    main()
