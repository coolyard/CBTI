/**
 * v5 题库不变量。
 */
export const QUESTION_COUNT = 15
export const OPTIONS_PER_QUESTION = 4

export const DIMENSIONS_BY_QUESTION = [
  'presence',
  'presence',
  'presence',
  'cognition',
  'cognition',
  'cognition',
  'emotion',
  'emotion',
  'emotion',
  'order',
  'order',
  'order',
  'endurance',
  'endurance',
  'endurance'
] as const

export const SCORE_VALUES = [0, 3, 7, 9] as const

export const EASTER_SEED_COUNTS = {
  male: { wukong: 8 },
  female: { nezha: 7 }
} as const
