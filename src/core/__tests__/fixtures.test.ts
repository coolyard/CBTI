import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CATEGORIES, characters } from '../../data'
import { computeResult } from '../engine'
import type { ScoringAnswers } from '../../types'

interface V4Fixture {
  category: string
  answers: string[]
  expectedPattern: string
  expectedMainId: string
  expectedEaster: string | null
  expectedDimensionTotals: Record<string, number>
  expectedDimensionScores: Record<string, number>
}

function loadFixtures(): V4Fixture[] {
  const path = resolve(process.cwd(), 'tests/fixtures/v4-cases.json')
  return JSON.parse(readFileSync(path, 'utf-8')) as V4Fixture[]
}

describe('v4.0 fixtures 对拍（1000 条）', () => {
  const fixtures = loadFixtures()
  expect(fixtures).toHaveLength(1000)

  it.each(fixtures)('$category $answers 与生成器一致', (fixture) => {
    const category = CATEGORIES[fixture.category as keyof typeof CATEGORIES]
    const result = computeResult(category, fixture.answers as ScoringAnswers, characters)

    expect(result.pattern).toBe(fixture.expectedPattern)
    expect(result.dimensionTotals).toEqual(fixture.expectedDimensionTotals)
    expect(result.dimensionScores).toEqual(fixture.expectedDimensionScores)
    expect(result.main.id).toBe(fixture.expectedMainId)
    expect(result.easterLocked ? fixture.expectedEaster : null).toBe(fixture.expectedEaster)
  })
})
