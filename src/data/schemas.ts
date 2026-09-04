/**
 * Zod 数据契约（与 specs/20-data-schema.md §2 逐字对应）
 */
import { z } from 'zod'

export const PATTERN_REGEX = /^[HML](-[HML]){4}$/

export const PAIR_SKELETON = [
  ['presence', 'endurance'],
  ['cognition', 'order'],
  ['emotion', 'endurance'],
  ['presence', 'cognition'],
  ['emotion', 'order'],
  ['cognition', 'endurance'],
  ['presence', 'order'],
  ['cognition', 'emotion'],
  ['order', 'endurance'],
  ['presence', 'emotion'],
  ['presence', 'endurance'],
  ['presence', 'cognition'],
  ['cognition', 'emotion'],
  ['emotion', 'order'],
  ['order', 'endurance']
] as const

const optionKeySchema = z.enum(['A', 'B', 'C', 'D', 'E', 'F'])
const dimensionSchema = z.enum(['presence', 'cognition', 'emotion', 'order', 'endurance'])
const seedTagSchema = z.enum(['nezha', 'wukong', 'jingwei', 'nuwa'])
const categorySchema = z.enum(['xiuxian', 'jianghu', 'rexue', 'mori', 'gongting', 'dushi'])
const scoreValueSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(5),
  z.literal(9),
  z.literal(10)
])
const scoresSchema = z.object({
  presence: scoreValueSchema.optional(),
  cognition: scoreValueSchema.optional(),
  emotion: scoreValueSchema.optional(),
  order: scoreValueSchema.optional(),
  endurance: scoreValueSchema.optional()
})

export const questionOptionSchema = z.object({
  key: optionKeySchema,
  text: z.string().min(1).max(40, '选项文案不得超过 40 字'),
  scores: scoresSchema.optional(),
  seedTag: seedTagSchema.optional(),
  targetCategory: categorySchema.optional()
})

export const questionSchema = z
  .object({
    id: z.number().int().min(1).max(15),
    type: z.enum(['normal', 'easter']),
    pair: z.tuple([dimensionSchema, dimensionSchema]),
    scene: z.string().min(1),
    stem: z.string().max(50, '题干不得超过 50 字').startsWith('你', '题干必须以「你」开头'),
    options: z.tuple([
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema
    ]),
    designNote: z.string().optional()
  })
  .superRefine((q, ctx) => {
    const [xDim, yDim] = q.pair
    if (xDim === yDim) {
      ctx.addIssue({ code: 'custom', message: `题 ${q.id} 维度对不能相同` })
    }

    const keys = q.options.map((o) => o.key)
    for (const k of ['A', 'B', 'C', 'D', 'E', 'F'] as const) {
      if (!keys.includes(k)) {
        ctx.addIssue({ code: 'custom', message: `题 ${q.id} 缺少选项 ${k}` })
      }
    }

    const seenGrid = new Set<string>()
    for (const o of q.options) {
      const scores = o.scores
      if (!scores) {
        ctx.addIssue({ code: 'custom', message: `题 ${q.id} 选项 ${o.key} 缺少 scores` })
        continue
      }
      const scoreKeys = Object.keys(scores) as Array<keyof typeof scores>
      const expected = new Set([xDim, yDim])
      if (scoreKeys.length !== 2 || scoreKeys.some((dim) => !expected.has(dim))) {
        ctx.addIssue({
          code: 'custom',
          message: `题 ${q.id} 选项 ${o.key} scores 维度必须恰好为 ${xDim}/${yDim}`
        })
      }
      const x = scores[xDim]
      const y = scores[yDim]
      if (x === undefined || ![1, 5, 10].includes(x)) {
        ctx.addIssue({
          code: 'custom',
          message: `题 ${q.id} 选项 ${o.key} 的 ${xDim} 必须 ∈ {1,5,10}`
        })
      }
      if (y === undefined || ![2, 9].includes(y)) {
        ctx.addIssue({
          code: 'custom',
          message: `题 ${q.id} 选项 ${o.key} 的 ${yDim} 必须 ∈ {2,9}`
        })
      }
      if (x !== undefined && y !== undefined) {
        seenGrid.add(`${x}:${y}`)
      }
      if (o.targetCategory) {
        ctx.addIssue({ code: 'custom', message: `计分题 ${q.id} 不允许 targetCategory` })
      }
    }
    for (const pair of ['1:2', '1:9', '5:2', '5:9', '10:2', '10:9'] as const) {
      if (!seenGrid.has(pair)) {
        ctx.addIssue({ code: 'custom', message: `题 ${q.id} 网格缺少 ${pair}` })
      }
    }

    if (q.type === 'normal' && q.options.some((o) => o.seedTag)) {
      ctx.addIssue({ code: 'custom', message: `常规题 ${q.id} 不允许 seedTag` })
    }
    if (q.type === 'easter' && q.options.every((o) => !o.seedTag)) {
      ctx.addIssue({ code: 'custom', message: `彩蛋题 ${q.id} 缺少种子选项` })
    }
    if (q.id === 7 || q.id === 11) {
      if (q.type !== 'easter') {
        ctx.addIssue({ code: 'custom', message: `题 ${q.id} 必须为 easter` })
      }
    } else if (q.type === 'easter') {
      ctx.addIssue({ code: 'custom', message: `easter 题只允许出现在题 7/11，实际 ${q.id}` })
    }
  })

export const categoryQuestionBankSchema = z
  .array(questionSchema)
  .length(15, '每个类别题库必须恰好 15 题')
  .superRefine((qs, ctx) => {
    qs.forEach((q, index) => {
      if (q.id !== index + 1) {
        ctx.addIssue({ code: 'custom', message: `题号不连续：期望 ${index + 1}，实际 ${q.id}` })
      }
      const expected = PAIR_SKELETON[index]
      if (q.pair[0] !== expected[0] || q.pair[1] !== expected[1]) {
        ctx.addIssue({
          code: 'custom',
          message: `题 ${q.id} pair 与骨架不一致：期望 ${expected.join('-')}，实际 ${q.pair.join('-')}`
        })
      }
    })
  })

export const themeSplitQuestionSchema = z
  .object({
    id: z.literal(0),
    type: z.literal('theme-split'),
    scene: z.string().min(1),
    stem: z.string().max(50).startsWith('你', '题干必须以「你」开头'),
    options: z.tuple([
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema
    ]),
    designNote: z.string().optional()
  })
  .superRefine((q, ctx) => {
    const keys = q.options.map((o) => o.key)
    for (const k of ['A', 'B', 'C', 'D', 'E', 'F'] as const) {
      if (!keys.includes(k)) {
        ctx.addIssue({ code: 'custom', message: `theme-split 缺少选项 ${k}` })
      }
    }
    const categories = new Set(q.options.map((o) => o.targetCategory))
    for (const category of ['xiuxian', 'jianghu', 'rexue', 'mori', 'gongting', 'dushi'] as const) {
      if (!categories.has(category)) {
        ctx.addIssue({ code: 'custom', message: `theme-split 缺少目标题材 ${category}` })
      }
    }
    for (const o of q.options) {
      if (o.scores || o.seedTag || !o.targetCategory) {
        ctx.addIssue({ code: 'custom', message: `theme-split 选项 ${o.key} 只允许 targetCategory` })
      }
    }
  })

export const characterSchema = z
  .object({
    id: z.string().regex(/^(\d{1,2})-(m|f)$/, 'id 必须形如 1-m / 1-f'),
    archetypeId: z.number().int().min(1).max(30),
    archetype: z.string().min(1),
    name: z.string().min(1),
    gender: z.enum(['male', 'female']),
    source: z.string(),
    pattern: z.string().regex(PATTERN_REGEX, '模式串格式非法'),
    easterKey: seedTagSchema.optional(),
    quote: z.string().max(30, '经典梗台词不得超过 30 字'),
    quoteExtra: z.string().max(30, '副台词不得超过 30 字'),
    brief: z.string().max(24, '一句话简介不得超过 24 字'),
    tags: z.array(z.string()),
    interpretation: z.array(z.string().max(120, '解读单段不得超过 120 字')),
    parallelUniverse: z.string().max(150, '平行宇宙不得超过 150 字')
  })
  .superRefine((c, ctx) => {
    const [archetypePart, genderPart] = c.id.split('-')
    if (Number(archetypePart) !== c.archetypeId) {
      ctx.addIssue({ code: 'custom', message: `id ${c.id} 与 archetypeId ${c.archetypeId} 不一致` })
    }
    const expectedSuffix = c.gender === 'male' ? 'm' : 'f'
    if (genderPart !== expectedSuffix) {
      ctx.addIssue({ code: 'custom', message: `id ${c.id} 后缀与 gender ${c.gender} 不一致` })
    }
    const allowedEaster: Record<string, string | undefined> = {
      27: 'nezha',
      28: 'wukong',
      29: 'jingwei',
      30: 'nuwa'
    }
    if (c.easterKey) {
      if (allowedEaster[String(c.archetypeId)] !== c.easterKey) {
        ctx.addIssue({
          code: 'custom',
          message: `easterKey=${c.easterKey} 只允许出现在原型 #${c.archetypeId} 对应角色`
        })
      }
    } else if (allowedEaster[String(c.archetypeId)]) {
      ctx.addIssue({ code: 'custom', message: `隐藏角色 #${c.archetypeId} 缺少 easterKey` })
    }
  })

export const characterLibrarySchema = z
  .array(characterSchema)
  .length(56, '角色库必须恰好 56 条（26 原型 × 男女 + 4 隐藏）')
  .superRefine((chars, ctx) => {
    const ids = new Set<string>()
    for (const c of chars) {
      if (ids.has(c.id)) {
        ctx.addIssue({ code: 'custom', message: `角色 id 重复：${c.id}` })
      }
      ids.add(c.id)
    }
    for (let a = 1; a <= 26; a++) {
      const genders = chars.filter((c) => c.archetypeId === a).map((c) => c.gender)
      if (!genders.includes('male') || !genders.includes('female')) {
        ctx.addIssue({ code: 'custom', message: `原型 #${a} 必须同时存在男女两版角色` })
      }
    }
    const maleHidden = chars.filter((c) => c.archetypeId === 27 || c.archetypeId === 28)
    const femaleHidden = chars.filter((c) => c.archetypeId === 29 || c.archetypeId === 30)
    if (
      maleHidden.length !== 2 ||
      maleHidden.some((c) => c.gender !== 'male') ||
      femaleHidden.length !== 2 ||
      femaleHidden.some((c) => c.gender !== 'female')
    ) {
      ctx.addIssue({
        code: 'custom',
        message: '隐藏角色归池错误：#27/#28 必须 male，#29/#30 必须 female'
      })
    }
  })

export function assertCategoryCoverage(): void {
  // 通过 src/data/category/index.ts 的启动校验保证 6 类齐全
}

export function assertContentComplete(characters: z.infer<typeof characterSchema>[]): void {
  const incomplete = characters.filter(
    (c) =>
      c.quote.length === 0 ||
      c.quoteExtra.length === 0 ||
      c.brief.length === 0 ||
      c.tags.length < 3 ||
      c.tags.length > 5 ||
      c.interpretation.length < 3 ||
      c.interpretation.length > 5 ||
      c.parallelUniverse.length === 0
  )
  if (incomplete.length > 0) {
    throw new Error(
      `[CBTI] 内容不完整：${incomplete.map((c) => `${c.id} ${c.name}`).join('、')}（见 specs/60）`
    )
  }
}
