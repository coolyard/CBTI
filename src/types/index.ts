/**
 * 领域类型定义
 *
 * v5 以性别双卷替代 v4 的题材分流与双维计分；规格尚未回写时以
 * CBTI_test_questions_categorized_v5.md 与 tasks/codex-prompts-v5.md 为准。
 */

export type Dimension = 'presence' | 'cognition' | 'emotion' | 'order' | 'endurance'
export type FinalBand = 'L' | 'M' | 'H'
export type RolePool = 'male' | 'female'
export type SeedTag = 'nezha' | 'wukong'
export type OptionKey = 'A' | 'B' | 'C' | 'D'
export type QuestionType = 'gender-split' | 'normal'
export type ScoreValue = 0 | 3 | 7 | 9

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

export const QUESTION_COUNT = 15
export const OPTIONS_PER_QUESTION = 4

export interface QuestionOption {
  key: OptionKey
  text: string
  /** 计分题必填；0/3/7/9 四档 */
  score?: ScoreValue
  /** 彩蛋种子选项 */
  seedTag?: SeedTag
  /** 仅 Q0 性别分流选项可携带 */
  targetPool?: RolePool
}

/** 性别卷计分题，id 1–15 */
export interface Question {
  id: number
  dimension: Dimension
  scene: string
  stem: string
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption]
  designNote?: string
}

/** 性别分流题：第一屏，数据 id=0，纯分流不计分 */
export interface GenderSplitQuestion {
  id: 0
  type: 'gender-split'
  scene: string
  stem: string
  options: [QuestionOption, QuestionOption]
  designNote?: string
}

export interface QuestionBank {
  id: RolePool
  name: string
  pool: RolePool
  questions: Question[]
}

/** 计分题答案：按题号 1–15 顺序存放，长度 15 */
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
