# 20 · 数据 Schema 规范（v4.0）

> 题库、角色库的**机器可校验契约**。AI 生成内容、Codex 生成代码都以本文件的 Zod schema 为准。
> `src/data/schemas.ts` 与本文件保持逐字一致；改动先改本文件。

## 1. 核心类型（`src/types/index.ts`）

```ts
export type Dimension = 'presence' | 'cognition' | 'emotion' | 'order' | 'endurance'
export type FinalBand = 'L' | 'M' | 'H'
export type RolePool = 'male' | 'female'
export type Category = 'xiuxian' | 'jianghu' | 'rexue' | 'mori' | 'gongting' | 'dushi'
export type SeedTag = 'nezha' | 'wukong' | 'jingwei' | 'nuwa'
export type OptionKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type QuestionType = 'theme-split' | 'normal' | 'easter'

/** 题材 → 角色池映射：修仙/江湖/热血 → male；末日/宫廷/都市 → female */
export const CATEGORY_POOL: Record<Category, RolePool> = {
  xiuxian: 'male',
  jianghu: 'male',
  rexue: 'male',
  mori: 'female',
  gongting: 'female',
  dushi: 'female'
}

/** 3×2 网格：X ∈ {1,5,10}，Y ∈ {2,9} */
export type ScoreValue = 1 | 2 | 5 | 9 | 10

export interface QuestionOption {
  key: OptionKey
  text: string            // 计分题 ≤ 30 字目标、≤ 40 字硬上限；题干以「你」开头
  scores?: Partial<Record<Dimension, ScoreValue>> // 计分题必填：恰好覆盖 pair 两个维度，X/Y 各取一格
  seedTag?: SeedTag       // 仅 easter 题的 seed option 可携带
  targetCategory?: Category // 仅 theme-split 题选项可携带，6 个选项覆盖 6 类各一
}

/** 类别计分题：每个题材类别独立一份，id 1–15 */
export interface Question {
  id: number              // 1–15
  type: 'normal' | 'easter'
  pair: [Dimension, Dimension]
  scene: string           // 场景类型标签，如 '修仙宗门' '后宫宫斗'
  stem: string            // ≤ 50 字，以「你」开头
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption, QuestionOption, QuestionOption]
  designNote?: string     // 设计说明（不渲染）
}

/** 题材分流题：全局第 1 屏、数据 id=0，纯分流不计分 */
export interface ThemeSplitQuestion {
  id: 0                   // 数据层固定为 0；展示层/题库 MD 可称“Q1 / 第 1 屏”
  type: 'theme-split'
  scene: string           // 如 '题材世界入口'
  stem: string
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption, QuestionOption, QuestionOption]
  designNote?: string
}

export interface Answer {
  questionId: number      // 0 = theme-split；1–15 = 类别计分题
  optionKey: OptionKey
}

export interface Character {
  /** 唯一 id：`{archetypeId}-{性别后缀}`，如 '1-m' / '1-f' / '27-m' / '29-f' */
  id: string
  /** 灵魂原型编号 1–30（对应 PRD 角色表行号） */
  archetypeId: number
  archetype: string       // 灵魂原型，如 '逆袭枭雄'
  name: string            // 角色名
  gender: RolePool        // 角色只属于 male 或 female 池
  source: string          // 出处
  pattern: string         // 'H-H-M-L-H'，必填
  easterKey?: SeedTag     // 仅隐藏角色：#27='nezha'，#28='wukong'，#29='jingwei'，#30='nuwa'
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
- 计分题 `Question.options`：恰好 6 项；key 恰好为 A–F 各一。
- 计分题每题 `pair = [X, Y]`：
  - 选项 `scores` 的维度键必须恰好等于 `pair` 的两个维度；
  - 每维取值必须合法：pair 第一位 ∈ `{1,5,10}`，第二位 ∈ `{2,9}`；
  - 6 个选项的 `(X, Y)` 组合必须恰好覆盖 3×2 网格全部 6 个分值位：
    `(1,2) (1,9) (5,2) (5,9) (10,2) (10,9)`，字母顺序可逐题打乱。
- `stem` 以「你」开头且 ≤ 50 字；计分选项 `text` 硬上限 ≤ 40 字（v4.0 题库目标 ≤ 30 字，Zod 按题库实测放宽至 40）。
- `type === 'easter'`：题 7 / 题 11 的 6 个选项中允许且必须各出现对应池的两个种子选项（男池 `nezha`/`wukong`，女池 `jingwei`/`nuwa`）；`type === 'normal'`：不允许任何 `seedTag`；计分题选项一律不允许 `targetCategory`。
- `theme-split`：恰好 6 项；key 为 A–F 各一；每项必须有 `targetCategory`；6 个 `targetCategory` 覆盖 6 类各一；不允许 `scores` / `seedTag`。
- 题库整体约束：
  - `theme-split` 独立 1 条，`id = 0`；
  - 6 个类别题库各恰好 15 题，题内 id 连续 1–15；
  - 每类 15 题的 `pair` 序列必须等于统一骨架
    `AE BD CE AB CD BE AD BC DE AC AE AB BC CD DE`
    （A=presence、B=cognition、C=emotion、D=order、E=endurance）；
  - 题 7 / 题 11 为 `easter`，其余为 `normal`。
- 角色库整体约束：恰好 **56 条**：
  - 原型 1–26 各含 `male` / `female` 各 1 条；
  - 原型 #27/#28 为 `male`，原型 #29/#30 为 `female`；
  - id 全局唯一且与 `archetypeId`/`gender` 一致；
  - `easterKey` 只允许出现在 #27（`nezha`）/ #28（`wukong`）/ #29（`jingwei`）/ #30（`nuwa`），且各只能出现一次。
- 角色内容字段含 `quote`（≤30 字）、`quoteExtra`（≤30 字）、`brief`（≤24 字）、`tags`、`interpretation`、`parallelUniverse`，均为必填（`quoteExtra`/`brief` 为 P03 新增）。
- **内容完整度**（六字段非空且 `tags/interpretation` 数量达标）由 `assertContentComplete()` 单独校验，内容管线阶段启用；主链路阶段允许为空。

## 3. 计分与匹配常量（唯一定义在 `src/core/scoring.ts` / 生成数据 `match-lut.ts`）

### 3.1 选项网格与计分骨架

| 常量 | 值 | 说明 |
|------|-----|------|
| `SCORE_X` | `{1, 5, 10}` | 维度对第一位可取分值 |
| `SCORE_Y` | `{2, 9}` | 维度对第二位可取分值 |
| `GRID_CELLS` | 6 个 `(X, Y)` 全组合 | 每题选项必须覆盖 |
| `QUESTION_PAIR_SKELETON` | `AE BD CE AB CD BE AD BC DE AC AE AB BC CD DE` | 15 题的维度对固定顺序，全部类别一致 |

### 3.2 分维阈值与范围

档位按**每维原始总分**判定（非均分）：

| 维度 | MIN–MAX | L | M | H |
|------|---------|-----|-----|-----|
| A presence | 6–60 | ≤28 | 29–35 | ≥36 |
| B cognition | 8–58 | ≤28 | 29–36 | ≥37 |
| C emotion | 9–57 | ≤29 | 30–35 | ≥36 |
| D order | 10–56 | ≤28 | 29–36 | ≥37 |
| E endurance | 12–54 | ≤26 | 27–39 | ≥40 |

### 3.3 匹配与角色锚点

| 常量 | 值 | 说明 |
|------|-----|------|
| `LUT_CELLS` | 243 | 每池 243 格（5 维 × 3 档全组合） |
| `CHARACTER_ANCHOR` | L=2, M=5, H=9 | 角色模式串在雷达图上的取值 |

## 4. 数据文件纪律

1. 数据文件**只含数据**，禁止写逻辑；所有计算在 `src/core/`。
2. 每个数据文件默认导出**原始字面量**，由 `src/data/index.ts` 统一过 Zod 校验后再导出给应用使用——校验失败即启动报错（fail-fast，见 specs/92）。
3. 题库内容与 [CBTI_test_questions_categorized.md](../CBTI_test_questions_categorized.md) v4.0 逐字对应；改题先改该 MD 再同步数据文件。
4. 角色 `pattern` 与 [PRD.md](../PRD.md) 第十节速查表逐字对应。
5. 池映射（theme-split）：`xiuxian/jianghu/rexue → male`；`mori/gongting/dushi → female`。
6. `match-lut.ts` 是 [scripts/build-match-table.py](../scripts/build-match-table.py) 的**生成产物**，禁止手改；生成参数变更须重跑脚本并做确定性对拍。
