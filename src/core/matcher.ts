/**
 * 匹配规则（规范：specs/30-scoring-algorithm.md §4）
 * 主结果查均衡 LUT；灵魂近亲按曼哈顿距离取池内第二名。
 */
import { MATCH_LUT } from '../data/match-lut'
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

function regularCandidates(pool: RolePool, characters: Character[]): Character[] {
  const candidates = characters.filter((c) => c.gender === pool && !c.easterKey)
  if (candidates.length === 0) {
    throw new DataIntegrityError(`角色池 ${pool} 常规候选为空`)
  }
  return candidates
}

/** LUT 主结果：由 match-lut.ts 的 243 格映射直接给出 characterId */
export function matchByLut(pattern: string, pool: RolePool, characters: Character[]): Character {
  const characterId = MATCH_LUT[pool][pattern]
  if (!characterId) {
    throw new DataIntegrityError(`LUT 缺少 ${pool} 池模式串 ${pattern}`)
  }
  const character = characters.find((c) => c.id === characterId)
  if (!character) {
    throw new DataIntegrityError(`LUT 指向不存在的角色：${characterId}`)
  }
  return character
}

/** 灵魂近亲：排除主结果后取曼哈顿距离最小者；并列按 archetypeId 升序 */
export function matchRelative(
  userPattern: string,
  pool: RolePool,
  characters: Character[],
  excludeCharacterId?: string
): Character | null {
  const userBands = patternToBands(userPattern)
  const candidates = regularCandidates(pool, characters).filter((c) => c.id !== excludeCharacterId)
  const ranked = candidates
    .map((character) => ({
      character,
      distance: manhattan(userBands, patternToBands(character.pattern))
    }))
    .sort((a, b) => a.distance - b.distance || a.character.archetypeId - b.character.archetypeId)
  return ranked.length > 0 ? ranked[0].character : null
}
