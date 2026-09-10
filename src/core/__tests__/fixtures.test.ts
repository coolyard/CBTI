import { describe, expect, it } from 'vitest'
import { BANKS, characters } from '../../data'
import { DIMENSIONS, type Dimension, type ScoringAnswers } from '../../types'
import { computeResult } from '../engine'

function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

describe('v5 随机路径对拍（1000 条）', () => {
  it('计分、模式串与真实题库选项一致', () => {
    const random = seededRandom(20260910)

    for (let path = 0; path < 1000; path += 1) {
      const bank = path % 2 === 0 ? BANKS.male : BANKS.female
      const answers: ScoringAnswers = bank.questions.map((question) => {
        const option = question.options[Math.floor(random() * question.options.length)]
        return option.key
      })
      const totals = Object.fromEntries(DIMENSIONS.map((dimension) => [dimension, 0])) as Record<
        Dimension,
        number
      >
      bank.questions.forEach((question, index) => {
        const option = question.options.find((candidate) => candidate.key === answers[index])
        totals[question.dimension] += option?.score ?? 0
      })

      const result = computeResult(bank, answers, characters)
      expect(result.dimensionTotals).toEqual(totals)
      expect(result.main.gender).toBe(bank.pool)
      expect(result.pattern).toMatch(/^[HML](-[HML]){4}$/)
    }
  })
})
