/**
 * 领域类型定义（契约见 specs/20-data-schema.md §1，保持逐字一致）
 */

export type Dimension = 'presence' | 'cognition' | 'emotion' | 'order' | 'endurance'
export type OptionBand = 'L' | 'M1' | 'M2' | 'H'
export type FinalBand = 'L' | 'M' | 'H'
export type RolePool = 'male' | 'female'
export type SeedTag = 'nezha' | 'wukong'
export type OptionKey = 'A' | 'B' | 'C' | 'D'
export type QuestionType = 'gender-split' | 'normal' | 'easter'

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

export interface QuestionOption {
  key: OptionKey
  text: string
  band: OptionBand
  seedTag?: SeedTag
  targetPool?: RolePool
}

export interface Question {
  id: number
  type: QuestionType
  dimension: Dimension
  scene: string
  stem: string
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption]
  designNote?: string
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
  archetype: string
  name: string
  gender: RolePool | 'universal'
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
  dimensionScores: Record<Dimension, number>
  bands: Record<Dimension, FinalBand>
  pattern: string
  easterLocked: boolean
  main: Character
  relative: Character | null
}
