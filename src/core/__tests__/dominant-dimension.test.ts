import { describe, expect, it } from 'vitest'
import { dominantDimensionOf } from '../dominant-dimension'

describe('dominantDimensionOf', () => {
  it('H 数量最多者胜', () => {
    expect(dominantDimensionOf('H-H-M-M-H')).toBe('presence')
    expect(dominantDimensionOf('M-H-H-M-M')).toBe('cognition')
  })

  it('H 数并列时按 DIMENSIONS 固定顺序取首', () => {
    expect(dominantDimensionOf('H-H-M-L-H')).toBe('presence')
    expect(dominantDimensionOf('M-M-H-H-H')).toBe('emotion')
  })

  it('无 H 时对 M 重复同样规则', () => {
    expect(dominantDimensionOf('M-L-M-L-L')).toBe('presence')
    expect(dominantDimensionOf('L-M-M-M-L')).toBe('cognition')
  })

  it('全 L 取 presence', () => {
    expect(dominantDimensionOf('L-L-L-L-L')).toBe('presence')
  })
})
