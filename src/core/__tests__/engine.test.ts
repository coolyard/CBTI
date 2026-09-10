import { describe, expect, it } from 'vitest'
import { BANKS, characters } from '../../data'
import type { Character, OptionKey, QuestionBank, ScoringAnswers } from '../../types'
import { resolveEasterLock } from '../easter'
import { computeResult, IncompleteAnswersError } from '../engine'
import { matchByLut, matchRelative, manhattan, patternToBands } from '../matcher'
import { bandFromTotal, CHARACTER_ANCHOR, patternFromBands } from '../scoring'

const ANSWER_KEYS: OptionKey[] = ['A', 'B', 'C', 'D']

function allA(): ScoringAnswers {
  return Array.from({ length: 15 }, () => 'A')
}

function answersWithoutSeeds(bank: QuestionBank): ScoringAnswers {
  return bank.questions.map((question) => {
    const option = question.options.find((candidate) => !candidate.seedTag)
    if (!option) throw new Error(`题 ${question.id} 没有非种子选项`)
    return option.key
  })
}

function answersWithSeeds(bank: QuestionBank, count: number): ScoringAnswers {
  const answers = answersWithoutSeeds(bank)
  let remaining = count
  bank.questions.forEach((question, index) => {
    if (remaining === 0) return
    const seedOption = question.options.find((option) => option.seedTag)
    if (!seedOption) return
    answers[index] = seedOption.key
    remaining -= 1
  })
  return answers
}

function makeCharacter(archetypeId: number, pattern: string): Character {
  return {
    id: `${archetypeId}-m`,
    archetypeId,
    archetype: `原型${archetypeId}`,
    name: `角色${archetypeId}`,
    gender: 'male',
    source: '测试',
    pattern,
    quote: '',
    quoteExtra: '',
    brief: '',
    tags: [],
    interpretation: [],
    parallelUniverse: ''
  }
}

describe('v5 分维阈值边界', () => {
  it.each([
    ['presence', 9, 'L'],
    ['presence', 10, 'M'],
    ['presence', 18, 'M'],
    ['presence', 19, 'H'],
    ['presence', 27, 'H'],
    ['cognition', 3, 'L'],
    ['cognition', 19, 'H'],
    ['emotion', 9, 'L'],
    ['emotion', 10, 'M'],
    ['order', 18, 'M'],
    ['order', 19, 'H'],
    ['endurance', 0, 'L'],
    ['endurance', 27, 'H']
  ] as const)('%s total=%s → %s', (dimension, total, expected) => {
    expect(bandFromTotal(total, dimension)).toBe(expected)
  })
})

describe('LUT 与灵魂近亲', () => {
  it('同输入同输出且主结果不是彩蛋角色', () => {
    const first = computeResult(BANKS.male, allA(), characters)
    const second = computeResult(BANKS.male, allA(), characters)
    expect(first.main.id).toBe(second.main.id)
    expect(first.easterLocked).toBe(false)
    expect(first.main.easterKey).toBeUndefined()
    expect(matchByLut(first.pattern, 'male', characters).id).toBe(first.main.id)
  })

  it('灵魂近亲并列按 archetypeId 升序', () => {
    const chars = [makeCharacter(9, 'H-H-M-M-H'), makeCharacter(2, 'H-H-M-L-M')]
    const relative = matchRelative('H-H-M-L-H', 'male', chars, '1-m')
    expect(relative?.archetypeId).toBe(2)
    expect(manhattan(patternToBands('H-H-M-L-H'), patternToBands('H-H-M-L-M'))).toBe(1)
  })
})

describe('v5 累计种子彩蛋', () => {
  it.each([
    ['male', 'wukong', '28-m'],
    ['female', 'nezha', '27-f']
  ] as const)('%s 卷命中 3 个 %s 种子锁定 %s', (pool, tag, expectedId) => {
    const bank = BANKS[pool]
    const two = answersWithSeeds(bank, 2)
    expect(resolveEasterLock(bank.questions, two, pool)).toBeNull()
    expect(computeResult(bank, two, characters).easterLocked).toBe(false)

    const three = answersWithSeeds(bank, 3)
    expect(resolveEasterLock(bank.questions, three, pool)).toBe(tag)
    const result = computeResult(bank, three, characters)
    expect(result.easterLocked).toBe(true)
    expect(result.main.id).toBe(expectedId)
  })

  it('跨池种子不触发', () => {
    const answers = answersWithSeeds(BANKS.female, 3)
    expect(resolveEasterLock(BANKS.female.questions, answers, 'male')).toBeNull()
  })
})

describe('真实题库跑通', () => {
  it.each(Object.values(BANKS))('$name 全选 A 可算出合法结果', (bank) => {
    const result = computeResult(bank, allA(), characters)
    expect(result.pattern).toMatch(/^[HML](-[HML]){4}$/)
    expect(result.main.gender).toBe(bank.pool)
    expect(result.relative?.gender).toBe(bank.pool)
  })

  it('答案不足 15 抛 IncompleteAnswersError', () => {
    expect(() => computeResult(BANKS.male, allA().slice(0, 14), characters)).toThrow(
      IncompleteAnswersError
    )
  })

  it('patternFromBands 与角色锚点', () => {
    expect(patternFromBands(['H', 'M', 'M', 'L', 'H'])).toBe('H-M-M-L-H')
    expect(CHARACTER_ANCHOR).toEqual({ L: 2, M: 5, H: 9 })
  })

  it('每卷每题都包含 A-D', () => {
    for (const bank of Object.values(BANKS)) {
      for (const question of bank.questions) {
        const keys = question.options.map((option) => option.key)
        for (const key of ANSWER_KEYS) expect(keys).toContain(key)
      }
    }
  })
})
