/**
 * 核心算法测试（用例编号与 specs/30-scoring-algorithm.md §7 一一对应）
 */
import { describe, expect, it } from 'vitest'
import { averageScore, bandOf, bandToFinal, OPTION_SCORE, patternFromBands } from '../scoring'
import { manhattan, matchCharacters, patternToBands } from '../matcher'
import { resolveEasterLock } from '../easter'
import { characterRadarValues, computeResult, IncompleteAnswersError, resolvePool } from '../engine'
import { characters, questionsFemale, questionsMale } from '../../data'
import type { Answer, Character, FinalBand } from '../../types'

/** 构造答题记录：每题选指定 key（默认全 A） */
function answerAll(
  questions: typeof questionsMale,
  pick: (qid: number) => 'A' | 'B' | 'C' | 'D' = () => 'A'
): Answer[] {
  return questions.map((q) => ({ questionId: q.id, optionKey: pick(q.id) }))
}

describe('#1 bandOf 边界', () => {
  it('3.49 → L，3.5 → M，6.49 → M，6.5 → H', () => {
    expect(bandOf(3.49)).toBe('L')
    expect(bandOf(3.5)).toBe('M')
    expect(bandOf(6.49)).toBe('M')
    expect(bandOf(6.5)).toBe('H')
  })
})

describe('#2 M1/M2 归并为 M', () => {
  it('bandToFinal', () => {
    expect(bandToFinal('M1')).toBe('M')
    expect(bandToFinal('M2')).toBe('M')
    expect(bandToFinal('L')).toBe('L')
    expect(bandToFinal('H')).toBe('H')
  })
})

describe('#3 曼哈顿距离计算', () => {
  it('手算对拍', () => {
    // H-H-M-L-H vs H-H-M-L-H → 0
    expect(manhattan(patternToBands('H-H-M-L-H'), patternToBands('H-H-M-L-H'))).toBe(0)
    // H-H-M-L-H vs H-H-M-H-H → |1-3|=2
    expect(manhattan(patternToBands('H-H-M-L-H'), patternToBands('H-H-M-H-H'))).toBe(2)
    // L-L-L-L-L vs H-H-H-H-H → 2*5=10
    expect(manhattan(patternToBands('L-L-L-L-L'), patternToBands('H-H-H-H-H'))).toBe(10)
  })
})

describe('#4 距离并列时按 archetypeId 升序', () => {
  it('等距候选取原型编号更小者', () => {
    const make = (archetypeId: number, pattern: string): Character => ({
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
    })
    // 用户 H-H-M-L-H；两个候选距离均为 1
    const chars = [make(9, 'H-H-M-M-H'), make(2, 'H-H-M-L-M')]
    const { main } = matchCharacters(patternToBands('H-H-M-L-H'), 'male', chars)
    expect(main.archetypeId).toBe(2)
  })
})

describe('#5 角色池过滤', () => {
  it('男性池不含 female-only 角色，含 universal 角色', () => {
    const { main } = matchCharacters(patternToBands('H-H-M-L-H'), 'male', characters)
    expect(main.gender).not.toBe('female')
    const universalInPool = characters.filter((c) => c.gender === 'universal')
    expect(universalInPool.length).toBe(2) // #27 #28
  })

  it('用户 H-H-M-L-H 在男池精确命中高启强', () => {
    const { main, relative } = matchCharacters(patternToBands('H-H-M-L-H'), 'male', characters)
    expect(main.name).toBe('高启强')
    expect(relative).not.toBeNull()
  })
})

describe('#6 彩蛋：题14 D + 题15 D → 锁定魔童哪吒（双题库）', () => {
  it.each([
    ['male', questionsMale],
    ['female', questionsFemale]
  ] as const)('%s 题库', (_label, bank) => {
    const answers = answerAll(bank, (qid) => (qid === 14 || qid === 15 ? 'D' : 'A'))
    expect(resolveEasterLock(bank, answers)).toBe('nezha')
    const result = computeResult(bank, answers, characters)
    expect(result.easterLocked).toBe(true)
    expect(result.main.name).toBe('魔童哪吒')
  })
})

describe('#7 彩蛋：题14 C + 题15 C → 锁定黑神话悟空', () => {
  it('male 题库', () => {
    const answers = answerAll(questionsMale, (qid) => (qid === 14 || qid === 15 ? 'C' : 'A'))
    const result = computeResult(questionsMale, answers, characters)
    expect(result.easterLocked).toBe(true)
    expect(result.main.name).toBe('黑神话孙悟空')
  })
})

describe('#8 彩蛋：C/D 混合 → 不锁定', () => {
  it('题14 C + 题15 D', () => {
    const answers = answerAll(questionsMale, (qid) => (qid === 14 ? 'C' : qid === 15 ? 'D' : 'A'))
    expect(resolveEasterLock(questionsMale, answers)).toBeNull()
    const result = computeResult(questionsMale, answers, characters)
    expect(result.easterLocked).toBe(false)
  })
})

describe('#9 彩蛋锁定时 relative 仍正常计算', () => {
  it('relative 为正常匹配第二名且非隐藏角色', () => {
    const answers = answerAll(questionsMale, (qid) => (qid === 14 || qid === 15 ? 'D' : 'A'))
    const result = computeResult(questionsMale, answers, characters)
    expect(result.easterLocked).toBe(true)
    expect(result.relative).not.toBeNull()
    expect(result.relative?.easterKey).toBeUndefined()
  })
})

describe('#10 真实题库全选 A 跑通 computeResult', () => {
  it('模式串合法，主结果在角色库中', () => {
    const answers = answerAll(questionsMale)
    const result = computeResult(questionsMale, answers, characters)
    expect(result.pattern).toMatch(/^[HML](-[HML]){4}$/)
    expect(characters.some((c) => c.id === result.main.id)).toBe(true)
    // 全 A：题1 A → H，其余 A 全为 L → 存在感 (9+2+2)/3=4.33 M，其余维度 2.00 L
    expect(result.pattern).toBe('M-L-L-L-L')
    expect(result.pool).toBe('male') // 题1 A → male
  })
})

describe('#11 数据校验', () => {
  it('双题库与角色库已通过启动校验（import 即校验）', () => {
    expect(questionsMale).toHaveLength(15)
    expect(questionsFemale).toHaveLength(15)
    expect(characters).toHaveLength(54)
  })

  it('彩蛋题种子标记齐全', () => {
    for (const bank of [questionsMale, questionsFemale]) {
      for (const q of bank.filter((x) => x.type === 'easter')) {
        const seeds = q.options.map((o) => o.seedTag).filter(Boolean)
        expect(seeds).toContain('nezha')
        expect(seeds).toContain('wukong')
      }
    }
  })
})

describe('补充边界', () => {
  it('未满 15 题抛 IncompleteAnswersError', () => {
    const answers = answerAll(questionsMale).slice(0, 14)
    expect(() => computeResult(questionsMale, answers, characters)).toThrow(IncompleteAnswersError)
  })

  it('resolvePool 由题 1 选项决定', () => {
    expect(
      resolvePool(
        questionsMale,
        answerAll(questionsMale, () => 'A')
      )
    ).toBe('male')
    expect(
      resolvePool(
        questionsMale,
        answerAll(questionsMale, () => 'B')
      )
    ).toBe('female')
    expect(
      resolvePool(
        questionsMale,
        answerAll(questionsMale, () => 'C')
      )
    ).toBe('male')
    expect(
      resolvePool(
        questionsMale,
        answerAll(questionsMale, () => 'D')
      )
    ).toBe('female')
  })

  it('averageScore 与 OPTION_SCORE', () => {
    expect(OPTION_SCORE).toEqual({ L: 2, M1: 4, M2: 6, H: 9 })
    expect(averageScore([2, 6, 9])).toBe(5.67)
  })

  it('characterRadarValues 锚点换算', () => {
    const gao = characters.find((c) => c.id === '1-m')
    expect(gao).toBeDefined()
    expect(characterRadarValues(gao as Character)).toEqual([9, 9, 5, 2, 9])
  })

  it('patternFromBands', () => {
    const bands: FinalBand[] = ['H', 'L', 'M', 'L', 'H']
    expect(patternFromBands(bands)).toBe('H-L-M-L-H')
  })

  it('forcePool 切换性别版：同答案在女池命中女角色', () => {
    const answers = answerAll(questionsMale, () => 'A') // 默认分流 male
    const result = computeResult(questionsMale, answers, characters, { forcePool: 'female' })
    expect(result.pool).toBe('female')
    expect(result.main.gender).not.toBe('male')
  })
})
