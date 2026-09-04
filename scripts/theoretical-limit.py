#!/usr/bin/env python3
"""
理论上限分析：若档位向量是乘积分布（每维独立 (pL,pM,pH)），
曼哈顿最近邻匹配能做到多均匀？

对 3^5=243 个档位格点精确枚举（无蒙特卡洛噪声），
坐标下降优化 5 维 × (pL,pM,pH) 共 15 个参数（softmax 参数化），
目标：max(男性池极差比, 女性池极差比) 最小。
"""
import itertools
import re
import numpy as np

CHARACTERS_TS = '/Users/work/learn/CBTI/src/data/characters.ts'
CELLS = np.array(list(itertools.product([0, 1, 2], repeat=5)))  # 243×5


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


def assign(codes):
    """243 格点 → 最近模式串索引（并列取最小 archetypeId = codes 已按 aid 排序）"""
    d = np.abs(CELLS[:, None, :] - codes[None, :, :]).sum(axis=2)
    return d.argmin(axis=1)


def char_masses(theta, assignment, k):
    """theta: (5,3) logits → 每格点质量 → 按 assignment 聚合"""
    p = np.exp(theta - theta.max(axis=1, keepdims=True))
    p /= p.sum(axis=1, keepdims=True)  # (5,3)
    logm = sum(np.log(p[d, CELLS[:, d]]) for d in range(5))
    m = np.exp(logm)
    return np.bincount(assignment, weights=m, minlength=k)


def optimize(pools, seed=0, rounds=4000, step=0.15):
    k_m = len(pools['male'][1])
    k_f = len(pools['female'][1])
    asg = {g: assign(pools[g][1]) for g in pools}
    rng = np.random.default_rng(seed)
    theta = np.zeros((5, 3))

    def obj(th):
        mm = char_masses(th, asg['male'], k_m)
        mf = char_masses(th, asg['female'], k_f)
        return max(mm.max() / mm.min(), mf.max() / mf.min())

    best = obj(theta)
    print(f'均匀起点 max(极差比) = {best:.2f}')
    cur = theta.copy()
    T = 1.0
    for it in range(rounds):
        cand = cur + rng.normal(0, step, size=cur.shape)
        cand -= cand.mean(axis=1, keepdims=True)
        v = obj(cand)
        if v < best or rng.random() < np.exp((best - v) / max(T, 1e-9) * 5):
            cur = cand
            if v < best:
                best = v
        T *= 0.997
    p = np.exp(cur - cur.max(axis=1, keepdims=True))
    p /= p.sum(axis=1, keepdims=True)
    return cur, best, p, asg


def main():
    pools = load_pools()
    names = ['A存在感', 'B认知力', 'C情感力', 'D规则感', 'E持久力']
    theta, best, p, asg = optimize(pools)
    print(f'\n优化后 max(极差比) = {best:.2f}')
    print('最优分维档位概率（pL/pM/pH）：')
    for d in range(5):
        print(f'  {names[d]}: L={p[d,0]:.1%} M={p[d,1]:.1%} H={p[d,2]:.1%}')
    for label, g in [('男性池', 'male'), ('女性池', 'female')]:
        pats, codes, owners = pools[g]
        m = char_masses(theta, asg[g], len(pats))
        m /= m.sum()
        k = len(pats)
        print(f'\n== {label}（{k} 串，基准 {1 / k:.2%}，极差比 {m.max() / m.min():.2f}）==')
        for i in np.argsort(-m):
            dup = f' ⚠×{len(owners[pats[i]])}' if len(owners[pats[i]]) > 1 else ''
            print(f'  {pats[i]}  {m[i]:6.2%} (×{m[i] * k:4.2f})  {"、".join(owners[pats[i]])}{dup}')


if __name__ == '__main__':
    main()
