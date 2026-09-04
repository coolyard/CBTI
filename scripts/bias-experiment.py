#!/usr/bin/env python3
"""
均衡偏置实验：匹配规则 argmin(曼哈顿距离 + bias[pattern]) 能否达到极差比 ≤2？

- 在 243 个档位格点上精确计算（乘积分布，可用优化后的分维概率）
- 贪心水位法：每轮给「当前超出均匀值最多」的模式串 bias +1（最多 4），
  直到极差比达标或无改进
- bias 是整数档（1 档 = 1 个曼哈顿距离单位），保持几何语义、代码改动极小
  （matcher 排序时加一行 bias 查表即可，bias 表作为数据入库）
"""
import itertools
import re
import numpy as np

CHARACTERS_TS = '/Users/work/learn/CBTI/src/data/characters.ts'
CELLS = np.array(list(itertools.product([0, 1, 2], repeat=5)))
# 上一次理论优化得到的分维概率（也试均匀 1/3）
P_OPT = np.array([
    [0.220, 0.394, 0.385],
    [0.390, 0.270, 0.340],
    [0.348, 0.188, 0.464],
    [0.440, 0.159, 0.402],
    [0.266, 0.232, 0.502],
])
P_UNI = np.tile([1 / 3, 1 / 3, 1 / 3], (5, 1))


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


def cell_masses(p):
    logm = sum(np.log(p[d, CELLS[:, d]]) for d in range(5))
    return np.exp(logm)


def masses_with_bias(codes, masses, bias):
    d = np.abs(CELLS[:, None, :] - codes[None, :, :]).sum(axis=2) + bias[None, :]
    asg = d.argmin(axis=1)
    return np.bincount(asg, weights=masses, minlength=len(codes))


def waterfill(codes, masses, max_bias=4, iters=200):
    k = len(codes)
    bias = np.zeros(k, dtype=int)
    target = masses.sum() / k
    hist = []
    for _ in range(iters):
        m = masses_with_bias(codes, masses, bias)
        ratio = m.max() / max(m.min(), 1e-12)
        hist.append(ratio)
        over = m.argmax()
        if m[over] <= target * 1.05 or ratio <= 2.0:
            break
        if bias[over] >= max_bias:
            # 该串已加满 bias 仍超，找次超的
            cand = [i for i in np.argsort(-m) if bias[i] < max_bias]
            if not cand:
                break
            over = cand[0]
        bias[over] += 1
    return bias, hist


def report(label, pats, owners, codes, masses, bias):
    m = masses_with_bias(codes, masses, bias)
    m = m / m.sum()
    k = len(pats)
    print(f'\n== {label}（{k} 串，基准 {1 / k:.2%}，极差比 {m.max() / m.min():.2f}）==')
    for i in np.argsort(-m):
        dup = f' ⚠×{len(owners[pats[i]])}' if len(owners[pats[i]]) > 1 else ''
        b = f' bias={bias[i]}' if bias[i] else ''
        print(f'  {pats[i]}  {m[i]:6.2%} (×{m[i] * k:4.2f}){b}  {"、".join(owners[pats[i]])}{dup}')
    return m.max() / m.min()


def main():
    pools = load_pools()
    for pname, p in [('均匀 1/3', P_UNI), ('理论最优边际', P_OPT)]:
        print(f'\n########## 分维概率方案：{pname} ##########')
        masses = cell_masses(p)
        for label, g in [('男性池', 'male'), ('女性池', 'female')]:
            pats, codes, owners = pools[g]
            bias, hist = waterfill(codes, masses)
            print(f'  {label}: 水位法 {len(hist)} 轮，极差比轨迹 {hist[0]:.1f} → {hist[-1]:.2f}，bias 分布 {np.bincount(bias)}')
            report(label, pats, owners, codes, masses, bias)


if __name__ == '__main__':
    main()
