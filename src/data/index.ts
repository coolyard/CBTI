/**
 * 数据聚合入口：原始数据 → Zod 校验 → 应用可用的强类型数据
 * 校验失败在启动时直接抛错（fail-fast，specs/92 §1）
 */
import { assertContentComplete, characterLibrarySchema, questionBankSchema } from './schemas'
import { rawQuestionsMale } from './questions.male'
import { rawQuestionsFemale } from './questions.female'
import { rawCharacters } from './characters'
import { DataIntegrityError } from '../core/matcher'
import type { Character, Question } from '../types'

function parseOrThrow<T>(label: string, parse: () => T): T {
  const result = (() => {
    try {
      return { ok: true as const, value: parse() }
    } catch (error) {
      return { ok: false as const, error }
    }
  })()
  if (!result.ok) {
    throw new DataIntegrityError(`${label} 未通过 Zod 校验：${String(result.error)}`)
  }
  return result.value
}

export const questionsMale: Question[] = parseOrThrow('男性题库', () =>
  questionBankSchema.parse(rawQuestionsMale)
)
export const questionsFemale: Question[] = parseOrThrow('女性题库', () =>
  questionBankSchema.parse(rawQuestionsFemale)
)
export const characters: Character[] = parseOrThrow('角色库', () =>
  characterLibrarySchema.parse(rawCharacters)
)

assertContentComplete(characters)

export { assertContentComplete } from './schemas'
