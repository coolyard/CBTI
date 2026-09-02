/**
 * 彩蛋锁定规则（规范：specs/30-scoring-algorithm.md §4）
 * 纯函数，禁止引入 vue / uni API。
 */
import type { Answer, Question, SeedTag } from '../types'

/**
 * 收集用户在彩蛋题中所选选项的 seedTag：
 * - 全部相同 → 返回该 tag（锁定对应隐藏角色）
 * - 混合或存在未带标记的选项 → 返回 null（走正常匹配）
 */
export function resolveEasterLock(questions: Question[], answers: Answer[]): SeedTag | null {
  const easterQuestions = questions.filter((q) => q.type === 'easter')
  if (easterQuestions.length === 0) return null

  const tags: SeedTag[] = []
  for (const q of easterQuestions) {
    const answer = answers.find((a) => a.questionId === q.id)
    if (!answer) return null
    const option = q.options.find((o) => o.key === answer.optionKey)
    if (!option?.seedTag) return null
    tags.push(option.seedTag)
  }

  const first = tags[0]
  return tags.every((t) => t === first) ? first : null
}
