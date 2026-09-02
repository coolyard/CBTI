# 20 · 数据 Schema 规范

> 题库、角色库的**机器可校验契约**。AI 生成内容、Codex 生成代码都以本文件的 Zod schema 为准。
> `src/data/schemas.ts` 与本文件保持逐字一致；改动先改本文件。

## 1. 核心类型（`src/types/index.ts`）

```ts
export type Dimension = 'presence' | 'cognition' | 'emotion' | 'order' | 'endurance'
export type OptionBand = 'L' | 'M1' | 'M2' | 'H'
export type FinalBand = 'L' | 'M' | 'H'
export type RolePool = 'male' | 'female'
export type SeedTag = 'nezha' | 'wukong'
export type OptionKey = 'A' | 'B' | 'C' | 'D'
export type QuestionType = 'gender-split' | 'normal' | 'easter'

export interface QuestionOption {
  key: OptionKey
  text: string            // ≤ 30 字
  band: OptionBand        // 选项档位；分值由 core 按 OPTION_SCORE 推导，数据层不存分值
  seedTag?: SeedTag       // 仅彩蛋种子题的选项可携带
  targetPool?: RolePool   // 仅性别分流题的选项必须携带
}

export interface Question {
  id: number              // 1–15
  type: QuestionType
  dimension: Dimension
  scene: string           // 场景类型标签，如 '修仙宗门' '后宫宫斗'
  stem: string            // ≤ 50 字，以「你」开头
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption]
  designNote?: string     // 设计说明（不渲染）
}

export interface Answer {
  questionId: number
  optionKey: OptionKey
}

export interface Character {
  /** 唯一 id：`{archetypeId}-{性别后缀}`，如 '1-m' / '1-f' / '27-u' */
  id: string
  /** 灵魂原型编号 1–28（对应 PRD 角色表行号） */
  archetypeId: number
  archetype: string       // 灵魂原型，如 '逆袭枭雄'
  name: string            // 角色名
  gender: RolePool | 'universal'
  source: string          // 出处
  pattern: string         // 'H-H-M-L-H'，必填
  easterKey?: SeedTag     // 原型 #27='nezha'，#28='wukong'（均 universal）
  // ---- 以下为内容管线填充字段 ----
  quote: string           // 经典梗台词，≤ 30 字
  quoteExtra: string      // 副台词/第二句梗，≤ 30 字（P03 新增，台词气泡双句用）
  brief: string           // 一句话简介（16personalities 式人设），≤ 24 字（P03 新增，轮播卡用）
  tags: string[]          // 灵魂标签，定稿后 3–5 个
  interpretation: string[]// 扎心解读，定稿后 3–5 段，每段 ≤ 120 字
  parallelUniverse: string// 现代平行宇宙，定稿后 ≤ 150 字
}
```

## 2. Zod Schema 要点（`src/data/schemas.ts`）

- `pattern`：必填，必须匹配 `/^[HML](-[HML]){4}$/`。
- `Question.options`：恰好 4 项；key 恰好为 A/B/C/D 各一；band 恰好覆盖 `{L, M1, M2, H}` 各一。
- `stem` 以「你」开头且 ≤ 50 字；`text` 规范目标 ≤ 30 字。
  - ⚠️ 偏差登记：v3.0 题库实测部分选项 30–45 字（如男库题 2 选项 D 为 41 字），schema 暂放宽至 **≤50 字**，内容优化阶段逐条收紧到 ≤30 后改回硬校验。
- `type === 'gender-split'`：每个 option 必须有 `targetPool`；`type === 'easter'`：4 个选项中必须恰好各含 1 个 `nezha` 与 1 个 `wukong` 的 `seedTag`；`type === 'normal'`：不允许出现 `seedTag` / `targetPool`。
- 题库整体约束：恰好 15 题；id 连续 1–15；每维度恰好 3 题；题 1 为 `gender-split`；题 14/15 为 `easter`。
- 角色库整体约束：恰好 **54 条**（原型 1–26 各含男女两版；27/28 各 1 条 universal）；id 全局唯一且与 archetypeId/gender 一致；`pattern` 必填；`easterKey` 只允许出现在原型 #27/#28。
- 角色内容字段含 `quote`（≤30 字）、`quoteExtra`（≤30 字）、`brief`（≤24 字）、`tags`、`interpretation`、`parallelUniverse`，均为必填（`quoteExtra`/`brief` 为 P03 新增）。
- **内容完整度**（六字段非空且 `tags/interpretation` 数量达标）由 `assertContentComplete()` 单独校验，内容管线阶段启用；主链路阶段允许为空。

## 3. 计分常量（core 与数据层共用，唯一定义在 `src/core/scoring.ts`）

| 常量 | 值 | 说明 |
|------|-----|------|
| `OPTION_SCORE` | L=2, M1=4, M2=6, H=9 | 选项档位的固定分值（落在 PRD 的 1-2/3-4/5-6/8-10 区间内） |
| `bandOf(avg)` | avg < 3.5 → L；3.5 ≤ avg < 6.5 → M；avg ≥ 6.5 → H | 维度均分 → 最终档位 |
| `CHARACTER_ANCHOR` | L=2, M=5, H=9 | 角色模式串在雷达图上的取值 |

## 4. 数据文件纪律

1. 数据文件**只含数据**，禁止写逻辑；所有计算在 `src/core/`。
2. 每个数据文件默认导出**原始字面量**，由 `src/data/index.ts` 统一过 Zod 校验后再导出给应用使用——校验失败即启动报错（fail-fast，见 specs/92）。
3. 题库内容与 [CBTI_test_questions_gendered.md](../CBTI_test_questions_gendered.md) v3.0 逐字对应；改题先改该 MD 再同步数据文件。
4. 角色 `pattern` 与 [PRD.md](../PRD.md) 第十节速查表逐字对应。
5. 分流映射（题 1）：A → `male`，B → `female`，C → `male`，D → `female`。
