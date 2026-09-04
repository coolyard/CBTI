/**
 * 领域类型定义（契约见 specs/20-data-schema.md §1，保持逐字一致）
 */

export type Dimension = 'presence' | 'cognition' | 'emotion' | 'order' | 'endurance'
export type FinalBand = 'L' | 'M' | 'H'
export type RolePool = 'male' | 'female'
export type Category = 'xiuxian' | 'jianghu' | 'rexue' | 'mori' | 'gongting' | 'dushi'
export type SeedTag = 'nezha' | 'wukong' | 'jingwei' | 'nuwa'
export type OptionKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type QuestionType = 'theme-split' | 'normal' | 'easter'
export type ScoreValue = 1 | 2 | 5 | 9 | 10
export type DimensionPair = [Dimension, Dimension]

/** 维度固定顺序：模式串、数组、雷达图一律按此顺序（specs/00 §2） */
export const DIMENSIONS: readonly Dimension[] = [
  'presence',
  'cognition',
  'emotion',
  'order',
  'endurance'
] as const

export const DIMENSION_LABELS: Record<Dimension, { name: string; alias: string }> = {
  presence: { name: '存在感', alias: '锋芒度' },
  cognition: { name: '认知力', alias: '执棋力' },
  emotion: { name: '情感力', alias: '情感值' },
  order: { name: '规则感', alias: '秩序感' },
  endurance: { name: '持久力', alias: '坚韧值' }
}

/** 题材 → 角色池映射（specs/20 §1） */
export const CATEGORY_POOL: Record<Category, RolePool> = {
  xiuxian: 'male',
  jianghu: 'male',
  rexue: 'male',
  mori: 'female',
  gongting: 'female',
  dushi: 'female'
}

export const QUESTION_COUNT = 15
export const OPTIONS_PER_QUESTION = 6

export interface QuestionOption {
  key: OptionKey
  text: string
  /** 计分题必填：恰好 pair 两个维度；X ∈ {1,5,10}，Y ∈ {2,9} */
  scores?: Partial<Record<Dimension, ScoreValue>>
  /** 仅 easter 题的 seed option 可携带 */
  seedTag?: SeedTag
  /** 仅 theme-split 题选项可携带 */
  targetCategory?: Category
}

/** 类别计分题：每个题材类别独立一份，id 1–15 */
export interface Question {
  id: number
  type: 'normal' | 'easter'
  pair: DimensionPair
  scene: string
  stem: string
  options: [
    QuestionOption,
    QuestionOption,
    QuestionOption,
    QuestionOption,
    QuestionOption,
    QuestionOption
  ]
  designNote?: string
}

/** 题材分流题：第一屏，数据 id=0，纯分流不计分 */
export interface ThemeSplitQuestion {
  id: 0
  type: 'theme-split'
  scene: string
  stem: string
  options: [
    QuestionOption,
    QuestionOption,
    QuestionOption,
    QuestionOption,
    QuestionOption,
    QuestionOption
  ]
  designNote?: string
}

export interface CategoryMeta {
  id: Category
  name: string
  pool: RolePool
  questions: Question[]
}

/** 计分题答案：按类别题 id 1–15 的固定顺序存放，长度 15 */
export type ScoringAnswers = OptionKey[]

export interface Character {
  id: string
  archetypeId: number
  archetype: string
  name: string
  gender: RolePool
  source: string
  pattern: string
  easterKey?: SeedTag
  quote: string
  quoteExtra: string
  brief: string
  tags: string[]
  interpretation: string[]
  parallelUniverse: string
}

export interface TestResult {
  pool: RolePool
  dimensionTotals: Record<Dimension, number>
  dimensionScores: Record<Dimension, number>
  bands: Record<Dimension, FinalBand>
  pattern: string
  easterLocked: boolean
  main: Character
  relative: Character | null
}
