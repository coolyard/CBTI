import { describe, expect, it } from 'vitest'
import { BANKS, banks, characters, genderSplitQuestion } from '../index'
import { DIM_TOTAL_MAX, DIM_TOTAL_MIN, DIMENSION_THRESHOLDS, MATCH_LUT } from '../match-lut'
import {
  DIMENSIONS_BY_QUESTION,
  EASTER_SEED_COUNTS,
  OPTIONS_PER_QUESTION,
  QUESTION_COUNT,
  SCORE_VALUES
} from '../questions.spec'

describe('v5 题库形状', () => {
  it('Q0 性别分流题只有 A/B 两个选项', () => {
    expect(genderSplitQuestion.options).toHaveLength(2)
    expect(genderSplitQuestion.options.map((option) => option.key)).toEqual(['A', 'B'])
    expect(genderSplitQuestion.options.map((option) => option.targetPool)).toEqual([
      'male',
      'female'
    ])
  })

  it.each(banks.map((bank) => [bank.id, bank] as const))(
    '%s 卷恰好 15 题 × 4 选项',
    (_id, bank) => {
      expect(bank.questions).toHaveLength(QUESTION_COUNT)
      for (const question of bank.questions) {
        expect(question.options).toHaveLength(OPTIONS_PER_QUESTION)
        expect(question.options.map((option) => option.key)).toEqual(['A', 'B', 'C', 'D'])
        expect(question.options.map((option) => option.score).sort()).toEqual([0, 3, 7, 9])
      }
    }
  )

  it('每卷维度顺序为 A/B/C/D/E 各三题', () => {
    for (const bank of banks) {
      expect(bank.questions.map((question) => question.dimension)).toEqual([
        ...DIMENSIONS_BY_QUESTION
      ])
    }
  })

  it('分值只允许 0/3/7/9', () => {
    const scores = banks.flatMap((bank) =>
      bank.questions.flatMap((question) => question.options.map((option) => option.score))
    )
    for (const score of scores) expect(SCORE_VALUES).toContain(score)
  })
})

describe('v5 彩蛋与角色库', () => {
  it('男卷只埋 wukong，女卷只埋 nezha', () => {
    expect(
      BANKS.male.questions.flatMap((question) => question.options).filter((o) => o.seedTag)
    ).toHaveLength(EASTER_SEED_COUNTS.male.wukong)
    expect(
      BANKS.female.questions.flatMap((question) => question.options).filter((o) => o.seedTag)
    ).toHaveLength(EASTER_SEED_COUNTS.female.nezha)

    expect(
      BANKS.male.questions
        .flatMap((question) => question.options)
        .every((option) => !option.seedTag || option.seedTag === 'wukong')
    ).toBe(true)
    expect(
      BANKS.female.questions
        .flatMap((question) => question.options)
        .every((option) => !option.seedTag || option.seedTag === 'nezha')
    ).toBe(true)
  })

  it('角色库恰好 54 条且隐藏角色为 27-f / 28-m', () => {
    expect(characters).toHaveLength(54)
    expect(new Set(characters.map((character) => character.id)).size).toBe(54)
    expect(
      characters.filter((character) => character.easterKey).map((character) => character.id)
    ).toEqual(['27-f', '28-m'])
  })
})

describe('v5 LUT 与阈值', () => {
  it('两类池各覆盖 243 个模式串且不指向彩蛋角色', () => {
    for (const pool of ['male', 'female'] as const) {
      const entries = Object.entries(MATCH_LUT[pool])
      expect(entries).toHaveLength(243)
      for (const [pattern, characterId] of entries) {
        expect(pattern).toMatch(/^[HML](-[HML]){4}$/)
        const character = characters.find((item) => item.id === characterId)
        expect(character, `${pattern} 指向不存在的 ${characterId}`).toBeDefined()
        expect(character?.gender).toBe(pool)
        expect(character?.easterKey).toBeUndefined()
      }
    }
  })

  it('阈值固定为 L 0-9 / M 10-18 / H 19-27', () => {
    for (const thresholds of Object.values(DIMENSION_THRESHOLDS)) {
      expect(thresholds).toEqual({ lowMax: 9, highMin: 19 })
    }
    for (const minimum of Object.values(DIM_TOTAL_MIN)) expect(minimum).toBe(0)
    for (const maximum of Object.values(DIM_TOTAL_MAX)) expect(maximum).toBe(27)
  })
})
