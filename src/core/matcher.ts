/**
 * 曼哈顿距离匹配（规范：specs/30-scoring-algorithm.md §3）
 * 纯函数，禁止引入 vue / uni API。
 */
import type { Character, FinalBand, RolePool } from '../types'
import { BAND_CODE } from './scoring'

/** 数据完整性错误：属于启动期就该暴露的问题（specs/92 §1） */
export class DataIntegrityError extends Error {
  constructor(message: string) {
    super(`[CBTI][DataIntegrity] ${message}`)
    this.name = 'DataIntegrityError'
  }
}

/** 模式串 → FinalBand 数组（5 位，顺序固定） */
export function patternToBands(pattern: string): FinalBand[] {
  const parts = pattern.split('-')
  if (parts.length !== 5 || parts.some((p) => p !== 'L' && p !== 'M' && p !== 'H')) {
    throw new DataIntegrityError(`非法模式串：${pattern}`)
  }
  return parts as FinalBand[]
}

/** 曼哈顿距离：Σ |code(a[i]) − code(b[i])| */
export function manhattan(a: FinalBand[], b: FinalBand[]): number {
  if (a.length !== b.length) {
    throw new DataIntegrityError(`模式串长度不一致：${a.length} vs ${b.length}`)
  }
  return a.reduce((sum, band, i) => sum + Math.abs(BAND_CODE[band] - BAND_CODE[b[i]]), 0)
}

/**
 * 在指定角色池中匹配主结果与灵魂近亲。
 * 候选：gender === pool 或 universal（schema 保证角色库 pattern 全部非空）。
 * 排序：距离升序，并列时 archetypeId 升序（确定性）。
 */
export function matchCharacters(
  userBands: FinalBand[],
  pool: RolePool,
  characters: Character[]
): { main: Character; relative: Character | null } {
  const candidates = characters.filter((c) => c.gender === pool || c.gender === 'universal')
  if (candidates.length === 0) {
    throw new DataIntegrityError(`角色池 ${pool} 候选为空`)
  }
  const ranked = candidates
    .map((c) => ({
      character: c,
      distance: manhattan(userBands, patternToBands(c.pattern))
    }))
    .sort((x, y) => x.distance - y.distance || x.character.archetypeId - y.character.archetypeId)
  return {
    main: ranked[0].character,
    relative: ranked.length > 1 ? ranked[1].character : null
  }
}
