/**
 * 结果编排（规范：specs/30-scoring-algorithm.md §1 流水线）
 * 纯函数，禁止引入 vue / uni API。
 */
import type {
  Answer,
  Character,
  Dimension,
  FinalBand,
  Question,
  RolePool,
  TestResult
} from '../types'
import { DIMENSIONS } from '../types'
import { averageScore, bandOf, CHARACTER_ANCHOR, OPTION_SCORE, patternFromBands } from './scoring'
import { DataIntegrityError, matchCharacters, patternToBands } from './matcher'
import { resolveEasterLock } from './easter'

/** 流程错误：未答满就调用 computeResult（specs/92 §1） */
export class IncompleteAnswersError extends Error {
  constructor(message: string) {
    super(`[CBTI][IncompleteAnswers] ${message}`)
    this.name = 'IncompleteAnswersError'
  }
}

function findOption(question: Question, answers: Answer[]) {
  const answer = answers.find((a) => a.questionId === question.id)
  if (!answer) {
    throw new IncompleteAnswersError(`题 ${question.id} 未作答`)
  }
  const option = question.options.find((o) => o.key === answer.optionKey)
  if (!option) {
    throw new DataIntegrityError(`题 ${question.id} 不存在选项 ${answer.optionKey}`)
  }
  return option
}

/** 分流：题 1 所选选项的 targetPool（specs/30 §1-①） */
export function resolvePool(questions: Question[], answers: Answer[]): RolePool {
  const splitQuestion = questions.find((q) => q.type === 'gender-split')
  if (!splitQuestion) {
    throw new DataIntegrityError('题库缺少性别分流题')
  }
  const option = findOption(splitQuestion, answers)
  if (!option.targetPool) {
    throw new DataIntegrityError(`题 ${splitQuestion.id} 选项 ${option.key} 缺少 targetPool`)
  }
  return option.targetPool
}

/**
 * 主入口：答题记录 → TestResult
 * 彩蛋锁定时不影响维度分/模式串/灵魂近亲的正常计算（specs/30 §1-⑥）
 */
export function computeResult(
  questions: Question[],
  answers: Answer[],
  characters: Character[],
  options?: { forcePool?: RolePool }
): TestResult {
  if (answers.length < questions.length) {
    throw new IncompleteAnswersError(`已答 ${answers.length} 题，未满 ${questions.length} 题`)
  }

  // forcePool 用于结果页「切换性别版」（specs/50-pages/result.md §2）
  const pool = options?.forcePool ?? resolvePool(questions, answers)

  const dimensionScores = {} as Record<Dimension, number>
  const bands = {} as Record<Dimension, FinalBand>
  for (const dim of DIMENSIONS) {
    const scores = questions
      .filter((q) => q.dimension === dim)
      .map((q) => OPTION_SCORE[findOption(q, answers).band])
    dimensionScores[dim] = averageScore(scores)
    bands[dim] = bandOf(dimensionScores[dim])
  }

  const orderedBands = DIMENSIONS.map((d) => bands[d])
  const pattern = patternFromBands(orderedBands)

  const matched = matchCharacters(orderedBands, pool, characters)

  const easterTag = resolveEasterLock(questions, answers)
  if (easterTag) {
    const locked = characters.find((c) => c.easterKey === easterTag)
    if (!locked) {
      throw new DataIntegrityError(`缺少 easterKey=${easterTag} 的隐藏角色`)
    }
    return {
      pool,
      dimensionScores,
      bands,
      pattern,
      easterLocked: true,
      main: locked,
      // 灵魂近亲仍取正常匹配的第二名（specs/30 §1-⑥）
      relative: matched.relative
    }
  }

  return {
    pool,
    dimensionScores,
    bands,
    pattern,
    easterLocked: false,
    main: matched.main,
    relative: matched.relative
  }
}

/** 角色模式串 → 雷达图锚点值数组（specs/55 §6） */
export function characterRadarValues(character: Character): number[] {
  return patternToBands(character.pattern).map((b) => CHARACTER_ANCHOR[b])
}
