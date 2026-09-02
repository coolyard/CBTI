/**
 * 计分规则（规范：specs/30-scoring-algorithm.md §2）
 * 纯函数，禁止引入 vue / uni API。
 */
import type { FinalBand, OptionBand } from '../types'

/** 选项档位固定分值（落在 PRD 区间内：L 1-2 / M1 3-4 / M2 5-6 / H 8-10） */
export const OPTION_SCORE: Record<OptionBand, number> = {
  L: 2,
  M1: 4,
  M2: 6,
  H: 9
}

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

/** M1/M2 归并为 M */
export function bandToFinal(band: OptionBand): FinalBand {
  return band === 'M1' || band === 'M2' ? 'M' : band
}

/** 维度均分 → 最终档位：avg < 3.5 → L；3.5 ≤ avg < 6.5 → M；avg ≥ 6.5 → H */
export function bandOf(avg: number): FinalBand {
  if (avg < 3.5) return 'L'
  if (avg < 6.5) return 'M'
  return 'H'
}

/** 维度得分（3 题均值，保留 2 位小数，雷达图用户线直接使用） */
export function averageScore(scores: number[]): number {
  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
  return Math.round(avg * 100) / 100
}

/** 五维 FinalBand 数组 → 模式串（顺序固定为 DIMENSIONS，见 specs/00 §2） */
export function patternFromBands(bands: FinalBand[]): string {
  return bands.join('-')
}
