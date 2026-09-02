/**
 * 主导维度判定（规范：specs/45-visual-polish.md §2）
 * 纯函数，禁止引入 vue / uni API。
 */
import { DIMENSIONS, type Dimension } from '../types'

export function dominantDimensionOf(pattern: string): Dimension {
  const bands = pattern.split('-')
  if (bands.length !== 5) {
    throw new Error('[CBTI][DominantDimension] 模式串必须为 5 位')
  }

  const pickByBand = (target: 'H' | 'M'): Dimension | null => {
    let best: Dimension | null = null
    let bestCount = 0
    for (const dimension of DIMENSIONS) {
      const count = bands[DIMENSIONS.indexOf(dimension)] === target ? 1 : 0
      if (count > bestCount) {
        best = dimension
        bestCount = count
      }
    }
    return best
  }

  return pickByBand('H') ?? pickByBand('M') ?? 'presence'
}
