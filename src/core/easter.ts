/**
 * v5 累计种子彩蛋：同一池内同一种子命中 >=3 次时锁定。
 */
import type { OptionKey, Question, RolePool, SeedTag } from '../types'

const POOL_TAGS: Record<RolePool, readonly SeedTag[]> = {
  male: ['wukong'],
  female: ['nezha']
}

export const EASTER_SEED_THRESHOLD = 3

/** 全卷同池同种子累计达到阈值 → 锁定；否则返回 null */
export function resolveEasterLock(
  questions: Question[],
  answers: OptionKey[],
  pool: RolePool
): SeedTag | null {
  const counts = new Map<SeedTag, number>()
  for (const tag of POOL_TAGS[pool]) counts.set(tag, 0)

  questions.forEach((question, index) => {
    const answerKey = answers[index]
    if (!answerKey) return
    const seedTag = question.options.find((option) => option.key === answerKey)?.seedTag
    if (seedTag && counts.has(seedTag)) {
      counts.set(seedTag, (counts.get(seedTag) ?? 0) + 1)
    }
  })

  const winner = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
  return winner && winner[1] >= EASTER_SEED_THRESHOLD ? winner[0] : null
}

export function poolTags(pool: RolePool): readonly SeedTag[] {
  return POOL_TAGS[pool]
}
