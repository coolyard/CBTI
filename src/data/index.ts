/**
 * 数据聚合入口：原始数据 → Zod 校验 → 应用可用的强类型数据。
 */
import { DataIntegrityError } from '../core/matcher'
import type { Character, GenderSplitQuestion, QuestionBank, RolePool } from '../types'
import { BANKS as rawBanks } from './banks'
import { rawCharacters } from './characters'
import { genderSplitQuestion as rawGenderSplit } from './gender-split'
import { characterLibrarySchema, genderSplitQuestionSchema, questionBankSchema } from './schemas'

function parseOrThrow<T>(label: string, parse: () => T): T {
  try {
    return parse()
  } catch (error) {
    throw new DataIntegrityError(`${label} 未通过 Zod 校验：${String(error)}`)
  }
}

export const genderSplitQuestion: GenderSplitQuestion = parseOrThrow('性别分流题', () =>
  genderSplitQuestionSchema.parse(rawGenderSplit)
)

export const BANKS: Record<RolePool, QuestionBank> = {
  male: parseOrThrow('男性卷', () => questionBankSchema.parse(rawBanks.male)),
  female: parseOrThrow('女性卷', () => questionBankSchema.parse(rawBanks.female))
}

export const banks: QuestionBank[] = Object.values(BANKS)
export const characters: Character[] = parseOrThrow('角色库', () =>
  characterLibrarySchema.parse(rawCharacters)
)

export function getBankByQ0Option(key: 'A' | 'B'): QuestionBank {
  const option = genderSplitQuestion.options.find((item) => item.key === key)
  if (!option?.targetPool) {
    throw new DataIntegrityError(`性别分流题不存在选项 ${key}`)
  }
  return BANKS[option.targetPool]
}
