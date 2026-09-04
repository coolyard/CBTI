/**
 * 数据聚合入口：原始数据 → Zod 校验 → 应用可用的强类型数据
 * 校验失败在启动时直接抛错（fail-fast，specs/92 §1）
 */
import { DataIntegrityError } from '../core/matcher'
import type { Category, CategoryMeta, Character } from '../types'
import {
  CATEGORIES as rawCategories,
  getCategoryByQ1Option,
  themeSplitQuestion as rawThemeSplit
} from './category'
import { rawCharacters } from './characters'
import {
  categoryQuestionBankSchema,
  characterLibrarySchema,
  themeSplitQuestionSchema
} from './schemas'

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

export const themeSplitQuestion = parseOrThrow('题材分流题', () =>
  themeSplitQuestionSchema.parse(rawThemeSplit)
)

export const CATEGORIES: Record<Category, CategoryMeta> = {} as Record<Category, CategoryMeta>
for (const categoryId of Object.keys(rawCategories) as Category[]) {
  const category = rawCategories[categoryId]
  CATEGORIES[categoryId] = {
    ...category,
    questions: parseOrThrow(`${category.name}题库`, () =>
      categoryQuestionBankSchema.parse(category.questions)
    )
  }
}

export const categories: CategoryMeta[] = Object.values(CATEGORIES)
export const characters: Character[] = parseOrThrow('角色库', () =>
  characterLibrarySchema.parse(rawCharacters)
)

export { getCategoryByQ1Option }
