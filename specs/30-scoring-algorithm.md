# 30 · 计分与匹配算法规范

> `src/core/` 的唯一依据。全部为纯函数，零 UI 依赖，Vitest 100% 分支覆盖（见 specs/90）。

## 1. 处理流水线

```
答题记录 Answer[15]
  ① 分流：题 1 所选 option.targetPool → RolePool
  ② 彩蛋判定：题 14/15 所选 option.seedTag → 可能锁定隐藏角色
  ③ 计分：每维度 3 题 → OPTION_SCORE 求和取平均 → dimensionScore(1.0–10.0)
  ④ 定档：dimensionScore → bandOf() → FinalBand → 模式串 pattern
  ⑤ 匹配：pattern 与池内角色模式串做曼哈顿距离 → 主结果 + 灵魂近亲
  ⑥ 彩蛋覆盖：若 ② 锁定，则主结果 = 隐藏角色（灵魂近亲仍取 ⑤ 的第二名）
```

## 2. 计分规则

- `OPTION_SCORE = { L: 2, M1: 4, M2: 6, H: 9 }`。
- 维度均分 `dimensionScore = (该维度 3 题得分之和) / 3`，保留 2 位小数。
- `bandOf(avg)`：`avg < 3.5 → 'L'`；`3.5 ≤ avg < 6.5 → 'M'`；`avg ≥ 6.5 → 'H'`。
- 模式串：按维度固定顺序（presence, cognition, emotion, order, endurance）以 `-` 连接。

**算例**：存在感三题选 A(L) / C(M2) / D(H) → 得分 2/6/9 → avg = 5.67 → `M`。

## 3. 匹配规则（曼哈顿距离）

- 档位数值化：`BAND_CODE = { L: 1, M: 2, H: 3 }`。
- `distance = Σ |code(user[i]) − code(char[i])|`，i 按维度固定顺序。
- 候选池：`characters.filter(c => c.pattern !== null && (c.gender === pool || c.gender === 'universal'))`（池内即 26 名异性别角色被排除，含 2 名通用隐藏角色）。
- 排序：`distance` 升序；**并列时 `archetypeId` 升序**（确定性，禁止随机）。
- 主结果 = 第 1 名；灵魂近亲 = 第 2 名。

**算例**：用户 `H-H-M-L-H`，池内高启强 `H-H-M-L-H`（距离 0）→ 主结果高启强；若龙妈 `H-H-M-H-H` 距离 1 为次小 → 灵魂近亲龙妈（女池为例，男池同理按池内计算）。

## 4. 彩蛋锁定规则

- 彩蛋题 = 题库中 `type === 'easter'` 的题（当前为题 14、15）。
- 收集用户在所有彩蛋题中所选选项的 `seedTag`：
  - 全部为 `'nezha'` → 锁定 `easterKey === 'nezha'` 的角色（#27 魔童哪吒）
  - 全部为 `'wukong'` → 锁定 #28 黑神话悟空
  - 混合或全无 → 不锁定，走正常匹配
- 锁定时：主结果被覆盖，但维度分、模式串、雷达图、灵魂近亲**仍按正常流程计算并展示**（用户可看到自己的真实数据）。

## 5. 边界与异常

| 场景 | 行为 |
|------|------|
| 答题数不足 15 就调用 `computeResult` | 抛 `IncompleteAnswersError`（见 specs/92），由 store 保证不发生 |
| 题 1 无 `targetPool`（数据错误） | Zod 启动校验已拦截；运行时再遇则抛 `DataIntegrityError` |
| 候选池为空 | 抛 `DataIntegrityError` |
| 池内仅 1 个候选 | 主结果 = 该候选，灵魂近亲 = null（UI 隐藏该模块） |

## 6. 输出类型

```ts
export interface TestResult {
  pool: RolePool
  dimensionScores: Record<Dimension, number>  // 1.00–10.00，雷达图用户线
  bands: Record<Dimension, FinalBand>
  pattern: string                              // 如 'H-H-M-L-H'
  easterLocked: boolean
  main: Character
  relative: Character | null
}
```

## 7. 必须实现的测试用例（`src/core/__tests__/engine.test.ts`）

1. `bandOf` 边界：3.49→L，3.5→M，6.49→M，6.5→H
2. M1/M2 → M 的归并
3. 曼哈顿距离计算正确性（手算对拍）
4. 距离并列时按 `archetypeId` 升序取主结果
5. 男性池不含 female-only 角色，含 universal 角色
6. 彩蛋：题14 D + 题15 D → 锁定 #27（两套题库各验一次）
7. 彩蛋：题14 C + 题15 C → 锁定 #28
8. 彩蛋：C/D 混合 → 不锁定
9. 彩蛋锁定时 relative 仍正常计算
10. 用真实题库全选 A 跑通 `computeResult`，模式串合法、主结果存在于角色库
11. 数据校验：两套题库 + 角色库全部通过 Zod；每题 4 选项档位齐全；彩蛋题种子标记齐全
