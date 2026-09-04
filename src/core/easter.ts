/**
 * 彩蛋锁定规则（规范：specs/30-scoring-algorithm.md §5）
 * 纯函数，禁止引入 vue / uni API。
 */
import type { OptionKey, Question, RolePool, SeedTag } from '../types'

const POOL_TAGS: Record<RolePool, readonly SeedTag[]> = {
  male: ['nezha', 'wukong'],
  female: ['jingwei', 'nuwa']
}

function findSeedTag(question: Question, answerKey: OptionKey): SeedTag | null {
  const option = question.options.find((o) => o.key === answerKey)
  return option?.seedTag ?? null
}

/** Q7/Q11 双题同种子且属于当前池 → 锁定；否则返回 null */
export function resolveEasterLock(
  questions: Question[],
  answers: OptionKey[],
  pool: RolePool
): SeedTag | null {
  const q7 = questions.find((q) => q.id === 7)
  const q11 = questions.find((q) => q.id === 11)
  if (!q7 || !q11) return null
  const key7 = answers[6]
  const key11 = answers[10]
  if (!key7 || !key11) return null

  const tag7 = findSeedTag(q7, key7)
  const tag11 = findSeedTag(q11, key11)
  if (!tag7 || tag7 !== tag11) return null
  return POOL_TAGS[pool].includes(tag7) ? tag7 : null
}

export function poolTags(pool: RolePool): readonly SeedTag[] {
  return POOL_TAGS[pool]
}
