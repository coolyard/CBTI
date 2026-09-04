import { describe, expect, it } from 'vitest'
import { CATEGORIES, categories, characters, themeSplitQuestion } from '../index'
import {
  EASTER_GRID_LOCKS,
  OPTIONS_PER_QUESTION,
  PAIR_SKELETON_SHORT,
  QUESTION_COUNT
} from '../questions.spec'
import type { Category } from '../../types'

const DIM_SHORT: Record<string, string> = {
  presence: 'A',
  cognition: 'B',
  emotion: 'C',
  order: 'D',
  endurance: 'E'
}

const GRID_LIST = [
  [10, 2],
  [10, 9],
  [5, 2],
  [5, 9],
  [1, 2],
  [1, 9]
]

describe('v4.0 题库形状', () => {
  it('Q1 分流题 6 选项且覆盖 6 类别', () => {
    expect(themeSplitQuestion.options).toHaveLength(6)
    const route = themeSplitQuestion.options.map((o) => o.targetCategory)
    expect(new Set(route).size).toBe(6)
    expect(themeSplitQuestion.options.map((o) => o.key)).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
  })

  it.each(categories.map((c) => [c.id, c] as const))('%s 恰好 15 题 × 6 选项', (_id, category) => {
    expect(category.questions).toHaveLength(QUESTION_COUNT)
    for (const question of category.questions) {
      expect(question.options).toHaveLength(OPTIONS_PER_QUESTION)
      expect(question.options.map((o) => o.key)).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
      expect(question.stem.length).toBeLessThanOrEqual(50)
      for (const option of question.options) {
        expect(option.text.length).toBeLessThanOrEqual(40)
      }
    }
  })

  it('每类 pair 序列与统一骨架一致', () => {
    for (const category of categories) {
      const skeleton = category.questions.map(
        (q) => `${DIM_SHORT[q.pair[0]]}${DIM_SHORT[q.pair[1]]}`
      )
      expect(skeleton).toEqual([...PAIR_SKELETON_SHORT])
    }
  })

  it('每题 6 选项覆盖 3×2 网格全部分值位', () => {
    for (const category of categories) {
      for (const question of category.questions) {
        const grid = question.options.map((option) => {
          const scores = option.scores
          if (!scores) throw new Error(`题 ${question.id} 缺 scores`)
          return [scores[question.pair[0]], scores[question.pair[1]]] as number[]
        })
        for (const cell of GRID_LIST) {
          expect(grid).toContainEqual(cell)
        }
      }
    }
  })
})

describe('v4.0 彩蛋与角色库', () => {
  it.each([
    ['male', ['xiuxian', 'jianghu', 'rexue'], ['nezha', 'wukong']],
    ['female', ['mori', 'gongting', 'dushi'], ['jingwei', 'nuwa']]
  ] as const)('%s 池彩蛋种子与锁定网格一致', (_pool, ids, tags) => {
    for (const id of ids) {
      const category = CATEGORIES[id as Category]
      for (const tag of tags) {
        const rule = EASTER_GRID_LOCKS.find((item) => item.tag === tag)
        expect(rule).toBeDefined()
        for (const questionIndex of [6, 10]) {
          const question = category.questions[questionIndex]
          const seedOptions = question.options.filter((o) => o.seedTag === tag)
          expect(seedOptions).toHaveLength(1)
          const option = seedOptions[0]
          const grid = [option.scores?.[question.pair[0]], option.scores?.[question.pair[1]]]
          const expectedGrid = questionIndex === 6 ? rule?.q7Grid : rule?.q11Grid
          const actualGrid = GRID_LIST.findIndex(
            (cell) => cell[0] === grid[0] && cell[1] === grid[1]
          )
          expect(actualGrid).toBe((expectedGrid ?? 0) - 1)
        }
      }
    }
  })

  it('角色库恰好 56 条且常规池模式串唯一', () => {
    expect(characters).toHaveLength(56)
    expect(new Set(characters.map((c) => c.id)).size).toBe(56)
    for (const pool of ['male', 'female'] as const) {
      const regularPatterns = characters
        .filter((c) => c.gender === pool && !c.easterKey)
        .map((c) => c.pattern)
      expect(new Set(regularPatterns).size).toBe(26)
    }
    const hidden = characters.filter((c) => c.easterKey)
    expect(hidden.map((c) => c.id).sort()).toEqual(['27-m', '28-m', '29-f', '30-f'])
  })
})
