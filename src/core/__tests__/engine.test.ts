import { describe, expect, it } from 'vitest'
import { CATEGORIES, characters } from '../../data'
import type { CategoryMeta, Character, OptionKey, Question, ScoringAnswers } from '../../types'
import { resolveEasterLock } from '../easter'
import { computeResult, IncompleteAnswersError } from '../engine'
import { matchByLut, matchRelative, manhattan, patternToBands } from '../matcher'
import { bandFromTotal, CHARACTER_ANCHOR, patternFromBands } from '../scoring'

const ANSWER_KEYS: OptionKey[] = ['A', 'B', 'C', 'D', 'E', 'F']

function allA(): ScoringAnswers {
  return Array.from({ length: 15 }, () => 'A')
}

function seedAnswerKeys(category: CategoryMeta, tag: string): { q7: OptionKey; q11: OptionKey } {
  const q7 = category.questions.find((q) => q.id === 7)?.options.find((o) => o.seedTag === tag)
  const q11 = category.questions.find((q) => q.id === 11)?.options.find((o) => o.seedTag === tag)
  if (!q7 || !q11) throw new Error(`找不到 ${tag} 种子`)
  return { q7: q7.key, q11: q11.key }
}

function lockAnswers(category: CategoryMeta, tag: string): ScoringAnswers {
  const answers = allA()
  const keys = seedAnswerKeys(category, tag)
  answers[6] = keys.q7
  answers[10] = keys.q11
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

describe('v4.0 分维阈值边界', () => {
  it.each([
    ['presence', 28, 'L'],
    ['presence', 29, 'M'],
    ['presence', 35, 'M'],
    ['presence', 36, 'H'],
    ['cognition', 28, 'L'],
    ['cognition', 29, 'M'],
    ['cognition', 36, 'M'],
    ['cognition', 37, 'H'],
    ['emotion', 29, 'L'],
    ['emotion', 30, 'M'],
    ['emotion', 35, 'M'],
    ['emotion', 36, 'H'],
    ['order', 28, 'L'],
    ['order', 29, 'M'],
    ['order', 36, 'M'],
    ['order', 37, 'H'],
    ['endurance', 26, 'L'],
    ['endurance', 27, 'M'],
    ['endurance', 39, 'M'],
    ['endurance', 40, 'H']
  ] as const)('%s total=%s → %s', (dimension, total, expected) => {
    expect(bandFromTotal(total, dimension)).toBe(expected)
  })
})

describe('LUT 与灵魂近亲', () => {
  it('同输入同输出且主结果不是彩蛋角色', () => {
    const category = CATEGORIES.xiuxian
    const first = computeResult(category, allA(), characters)
    const second = computeResult(category, allA(), characters)
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

describe('v4.0 彩蛋双题锁定', () => {
  it.each([
    ['xiuxian', 'nezha', '27-m'],
    ['xiuxian', 'wukong', '28-m'],
    ['mori', 'jingwei', '29-f'],
    ['mori', 'nuwa', '30-f']
  ] as const)('%s %s 双题命中锁定 %s', (categoryId, tag, expectedId) => {
    const category = CATEGORIES[categoryId]
    const answers = lockAnswers(category, tag)
    expect(resolveEasterLock(category.questions, answers, category.pool)).toBe(tag)
    const result = computeResult(category, answers, characters)
    expect(result.easterLocked).toBe(true)
    expect(result.main.id).toBe(expectedId)
  })

  it('单题命中不触发', () => {
    const category = CATEGORIES.xiuxian
    const answers = lockAnswers(category, 'nezha')
    answers[10] = 'A'
    expect(resolveEasterLock(category.questions, answers, category.pool)).toBeNull()
    expect(computeResult(category, answers, characters).easterLocked).toBe(false)
  })

  it('跨池种子不触发', () => {
    const category = CATEGORIES.xiuxian
    const overridden = {
      ...category,
      questions: category.questions.map((q) => ({
        ...q,
        options: q.options.map((o): Question['options'][number] =>
          o.seedTag ? { ...o, seedTag: 'jingwei' as const } : o
        ) as Question['options']
      }))
    } satisfies CategoryMeta
    const answers = lockAnswers(category, 'nezha')
    expect(resolveEasterLock(overridden.questions, answers, 'male')).toBeNull()
    expect(computeResult(overridden, answers, characters).easterLocked).toBe(false)
  })
})

describe('真实题库跑通', () => {
  it('6 类别全选 A 均可算出合法结果', () => {
    for (const category of Object.values(CATEGORIES)) {
      const result = computeResult(category, allA(), characters)
      expect(result.pattern).toMatch(/^[HML](-[HML]){4}$/)
      expect(result.main.easterKey).toBeUndefined()
      expect(result.relative).not.toBeNull()
    }
  })

  it('答案不足 15 抛 IncompleteAnswersError', () => {
    expect(() => computeResult(CATEGORIES.xiuxian, allA().slice(0, 14), characters)).toThrow(
      IncompleteAnswersError
    )
  })

  it('patternFromBands 与角色锚点', () => {
    expect(patternFromBands(['H', 'M', 'M', 'L', 'H'])).toBe('H-M-M-L-H')
    expect(CHARACTER_ANCHOR).toEqual({ L: 2, M: 5, H: 9 })
  })
})

describe('random answer keys never crash', () => {
  it('所有 6 个字母都在真实题中出现', () => {
    for (const category of Object.values(CATEGORIES)) {
      for (const question of category.questions) {
        const keys = question.options.map((o) => o.key)
        for (const key of ANSWER_KEYS) expect(keys).toContain(key)
      }
    }
  })
})
