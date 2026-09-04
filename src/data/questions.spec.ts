/**
 * v4.0 题库不变量（可执行常量，specs/20 §2、题库文档 v4.0）
 */
export const QUESTION_COUNT = 15
export const OPTIONS_PER_QUESTION = 6

export const PAIR_SKELETON_SHORT = [
  'AE',
  'BD',
  'CE',
  'AB',
  'CD',
  'BE',
  'AD',
  'BC',
  'DE',
  'AC',
  'AE',
  'AB',
  'BC',
  'CD',
  'DE'
] as const

/**
 * 彩蛋锁定表（grid 位：G1=(10,2) G2=(10,9) G3=(5,2) G4=(5,9) G5=(1,2) G6=(1,9)）
 * Q7/Q11 分别对应 answers 的第 6/10 位（0-based）。
 */
export const EASTER_GRID_LOCKS = [
  { tag: 'nezha', q7Grid: 1, q11Grid: 1 },
  { tag: 'wukong', q7Grid: 4, q11Grid: 6 },
  { tag: 'jingwei', q7Grid: 6, q11Grid: 6 },
  { tag: 'nuwa', q7Grid: 2, q11Grid: 2 }
] as const
