# 30 · 计分与匹配算法规范（v4.0）

> `src/core/` 的唯一依据。全部为纯函数，零 UI 依赖，Vitest 100% 分支覆盖（见 specs/90）。

## 1. 处理流水线

```
Answer[]（共 16 屏：theme-split id=0 + 类别计分题 id=1..15）
  ① 分流：theme-split 所选 option.targetCategory → Category → CATEGORY_POOL → RolePool；该题不计分
  ② 计分：15 道类别题所选 option.scores 按维度累加 → 每维原始总分
  ③ 定档：每维原始总分查 DIMENSION_THRESHOLDS → FinalBand → 模式串 pattern
  ④ 匹配：模式串查对应池 LUT（match-lut.ts）→ 主结果；灵魂近亲按曼哈顿距离取池内第二名
  ⑤ 彩蛋：Q7/Q11 所选 option.seedTag 相同且属于当前池 → 主结果覆盖为锁定隐藏角色
  ⑥ 雷达图：每维原始总分按该维 MIN/MAX 归一化 → dimensionScore（1.0–10.0）
```

## 2. 计分规则

- 计分仅处理类别题 `id = 1..15`；每题固定 `pair = [X, Y]`。
- 选项 `scores` 恰好携带两个维度，取值 X ∈ `{1,5,10}`、Y ∈ `{2,9}`。
- 15 题累加后，每维出现 6 次。固定骨架决定各维总分范围：

| 维度 | X/Y 出现次数 | MIN–MAX |
|------|-------------|---------|
| A presence | 6X | 6–60 |
| B cognition | 4X + 2Y | 8–58 |
| C emotion | 3X + 3Y | 9–57 |
| D order | 2X + 4Y | 10–56 |
| E endurance | 6Y | 12–54 |

- `dimensionTotal` 不取平均；直接用于定档和雷达图归一化。

## 3. 定档规则

| 维度 | L | M | H |
|------|-----|-----|-----|
| A presence | ≤28 | 29–35 | ≥36 |
| B cognition | ≤28 | 29–36 | ≥37 |
| C emotion | ≤29 | 30–35 | ≥36 |
| D order | ≤28 | 29–36 | ≥37 |
| E endurance | ≤26 | 27–39 | ≥40 |

- 按维度固定顺序（presence, cognition, emotion, order, endurance）以 `-` 连接成 `pattern`，如 `H-H-M-L-H`。
- 阈值边界含端点：`29` 即 M、`36` 即 H（A 维度）等，禁止实现时使用开区间错位。

**算例**：presence=36、cognition=29、emotion=30、order=28、endurance=40 → `H-M-M-L-H`。

## 4. 匹配规则（LUT + 灵魂近亲）

### 4.1 LUT 主结果

- `match-lut.ts` 由 `scripts/build-match-table.py` 生成，每池一份：全部 243 个模式串格点 → 一个 `characterId`。
- 生成逻辑以角色模式串的曼哈顿距离为基底，做容量均衡分配（贪心 regret + 边界再平衡），同模式串角色共享可达格点；**LUT 不是纯最近邻**。
- 运行期：`main = LUT[pool][userPattern]`，不做二次距离计算。

### 4.2 灵魂近亲

- 档位数值化：`BAND_CODE = { L: 1, M: 2, H: 3 }`。
- 候选 = 当前池全部角色，排除 LUT 主结果；只比较各角色自身模式串与用户模式串的曼哈顿距离。
- `distance = Σ |code(user[i]) − code(char[i])|`，i 按维度固定顺序。
- 排序：distance 升序；**并列时 `archetypeId` 升序**（确定性，禁止随机）。
- 灵魂近亲 = 排序第一名；若当前池仅 1 个候选则 `null`（UI 隐藏该模块）。

**算例**：男池用户 `H-H-M-L-H`，哪吒 `H-L-M-L-M` 距离 2 为次小 → 灵魂近亲哪吒（若 LUT 主结果不是哪吒）。

## 5. 彩蛋锁定规则

- 彩蛋题 = 类别题库内 `type === 'easter'` 的题（第 7 题 / 第 11 题）。
- 收集两道题所选选项的 `seedTag`：
  - 两题同为 `'nezha'` → 男池锁定 #27 魔童哪吒；
  - 两题同为 `'wukong'` → 男池锁定 #28 黑神话悟空；
  - 两题同为 `'jingwei'` → 女池锁定 #29 精卫；
  - 两题同为 `'nuwa'` → 女池锁定 #30 女娲。
- 任一题无种子、两题种子混合，或种子不属于当前角色池（跨池）→ 不锁定，主结果保持 LUT 匹配结果。
- 锁定时：主结果被覆盖为隐藏角色；维度分、模式串、灵魂近亲仍按正常流程计算并展示。

## 6. 雷达图归一化与输出类型

- 用户线 `dimensionScore[dim] = 1 + (dimensionTotal − MIN[dim]) / (MAX[dim] − MIN[dim]) × 9`。
- 每维 MIN/MAX 见 §2 表格；结果保留 2 位小数。
- 角色线取值 `CHARACTER_ANCHOR = { L: 2, M: 5, H: 9 }`，v4.0 不变。

```ts
export interface TestResult {
  pool: RolePool
  dimensionTotals: Record<Dimension, number>   // 原始总分，用于推导与诊断
  dimensionScores: Record<Dimension, number>   // 1.00–10.00，雷达图用户线
  bands: Record<Dimension, FinalBand>
  pattern: string                              // 如 'H-H-M-L-H'
  easterLocked: boolean
  main: Character
  relative: Character | null
}
```

## 7. 必须实现的测试用例（`src/core/__tests__/engine.test.ts`）

1. 分维阈值 A：27→L、28→L、29→M、35→M、36→H、60→H
2. 分维阈值 B/C/D：各覆盖 L/M/H 边界（按 §3 表逐维断言）
3. 分维阈值 E：26→L、27→M、39→M、40→H
4. LUT 确定性：同输入同输出；主结果字符存在于当前池
5. 灵魂近亲：排除主结果后按曼哈顿距离取最小，并列按 `archetypeId` 升序
6. 男池彩蛋：Q7+Q11 同选 `nezha` 锁定 #27；同选 `wukong` 锁定 #28
7. 女池彩蛋：Q7+Q11 同选 `jingwei` 锁定 #29；同选 `nuwa` 锁定 #30
8. 彩蛋混合（两题不同种子）→ 不锁定
9. 彩蛋跨池拒绝：女池题库出现 `nezha/wukong` 种子或反向情况 → 不锁定
10. 真实题库全选 A 跑通 `computeResult`：模式串合法、主结果存在于角色库、16 屏答案计数正确
11. 数据完整性：56 条角色与 6 类题库全部过 Zod；1000 条随机答题路径与直接 LUT/阈值实现对拍无差异
