/**
 * 结果编排（规范：specs/30-scoring-algorithm.md §1 流水线）
 * 纯函数，禁止引入 vue / uni API。
 */
import type {
  CategoryMeta,
  Character,
  Dimension,
  FinalBand,
  OptionKey,
  ScoringAnswers,
  TestResult
} from '../types'
import { DIMENSIONS } from '../types'
import { resolveEasterLock } from './easter'
import { DataIntegrityError, matchByLut, matchRelative } from './matcher'
import {
  bandFromTotal,
  CHARACTER_ANCHOR,
  normalizeDimensionScore,
  patternFromBands
} from './scoring'

/** 流程错误：未答满就调用 computeResult（specs/92 §1） */
export class IncompleteAnswersError extends Error {
  constructor(message: string) {
    super(`[CBTI][IncompleteAnswers] ${message}`)
    this.name = 'IncompleteAnswersError'
  }
}

function findOption(questionIndex: number, category: CategoryMeta, answerKey: OptionKey) {
  const question = category.questions[questionIndex]
  const option = question.options.find((o) => o.key === answerKey)
  if (!option) {
    throw new DataIntegrityError(`${category.name} 题 ${question.id} 不存在选项 ${answerKey}`)
  }
  return { question, option }
}

/**
 * 主入口：类别 + 15 个计分答案 → TestResult
 * 彩蛋锁定时不影响维度分/模式串/灵魂近亲的正常计算（specs/30 §5）
 */
export function computeResult(
  category: CategoryMeta,
  answers: ScoringAnswers,
  characters: Character[]
): TestResult {
  if (answers.length !== 15) {
    throw new IncompleteAnswersError(`已答 ${answers.length} 题，需要 15 题`)
  }

  const dimensionTotals = {} as Record<Dimension, number>
  for (const dimension of DIMENSIONS) {
    let total = 0
    for (let index = 0; index < category.questions.length; index += 1) {
      const { option } = findOption(index, category, answers[index])
      total += option.scores?.[dimension] ?? 0
    }
    dimensionTotals[dimension] = total
  }

  const bands = {} as Record<Dimension, FinalBand>
  const dimensionScores = {} as Record<Dimension, number>
  for (const dimension of DIMENSIONS) {
    bands[dimension] = bandFromTotal(dimensionTotals[dimension], dimension)
    dimensionScores[dimension] = normalizeDimensionScore(dimensionTotals[dimension], dimension)
  }

  const pattern = patternFromBands(DIMENSIONS.map((d) => bands[d]))
  const pool = category.pool
  const main = matchByLut(pattern, pool, characters)
  const relative = matchRelative(pattern, pool, characters, main.id)

  const easterTag = resolveEasterLock(category.questions, answers, pool)
  let lockedMain = main
  if (easterTag) {
    const locked = characters.find((c) => c.easterKey === easterTag && c.gender === pool)
    if (!locked) {
      throw new DataIntegrityError(`缺少 ${pool} 池 easterKey=${easterTag} 的隐藏角色`)
    }
    lockedMain = locked
  }

  return {
    pool,
    dimensionTotals,
    dimensionScores,
    bands,
    pattern,
    easterLocked: Boolean(easterTag),
    main: lockedMain,
    relative
  }
}

/** 角色模式串 → 雷达图锚点值数组 */
export function characterRadarValues(character: Character): number[] {
  return character.pattern.split('-').map((band) => CHARACTER_ANCHOR[band as FinalBand])
}
