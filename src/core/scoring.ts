/**
 * 计分规则（规范：specs/30-scoring-algorithm.md §2–§3）
 * 纯函数，禁止引入 vue / uni API。
 */
import { DIM_TOTAL_MAX, DIM_TOTAL_MIN, DIMENSION_THRESHOLDS } from '../data/match-lut'
import type { Dimension, FinalBand } from '../types'

/** 档位数值化（曼哈顿距离用） */
export const BAND_CODE: Record<FinalBand, number> = {
  L: 1,
  M: 2,
  H: 3
}

/** 角色模式串在雷达图上的锚点值 */
export const CHARACTER_ANCHOR: Record<FinalBand, number> = {
  L: 2,
  M: 5,
  H: 9
}

/** 维度原始总分 → 最终档位（分维阈值见 specs/30 §3） */
export function bandFromTotal(total: number, dimension: Dimension): FinalBand {
  const { lowMax, highMin } = DIMENSION_THRESHOLDS[dimension]
  if (total <= lowMax) return 'L'
  if (total >= highMin) return 'H'
  return 'M'
}

/** 维度原始总分 → 雷达图用户线 1.0–10.0 */
export function normalizeDimensionScore(total: number, dimension: Dimension): number {
  const min = DIM_TOTAL_MIN[dimension]
  const max = DIM_TOTAL_MAX[dimension]
  return Math.round((1 + ((total - min) / (max - min)) * 9) * 100) / 100
}

/** 五维 FinalBand 数组 → 模式串（顺序固定为 DIMENSIONS） */
export function patternFromBands(bands: FinalBand[]): string {
  return bands.join('-')
}
