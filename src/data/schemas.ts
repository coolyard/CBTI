/**
 * v5 数据契约（与 tasks/codex-prompts-v5.md 同步）。
 */
import { z } from 'zod/v3'

export const PATTERN_REGEX = /^[HML](-[HML]){4}$/

export const DIMENSION_BY_QUESTION_INDEX = [
  'presence',
  'presence',
  'presence',
  'cognition',
  'cognition',
  'cognition',
  'emotion',
  'emotion',
  'emotion',
  'order',
  'order',
  'order',
  'endurance',
  'endurance',
  'endurance'
] as const

const optionKeySchema = z.enum(['A', 'B', 'C', 'D'])
const dimensionSchema = z.enum(['presence', 'cognition', 'emotion', 'order', 'endurance'])
const rolePoolSchema = z.enum(['male', 'female'])
const seedTagSchema = z.enum(['nezha', 'wukong'])
const scoreValueSchema = z.union([z.literal(0), z.literal(3), z.literal(7), z.literal(9)])

export const questionOptionSchema = z.object({
  key: optionKeySchema,
  text: z.string().min(1).max(200, '选项文案不得超过 200 字'),
  score: scoreValueSchema.optional(),
  seedTag: seedTagSchema.optional(),
  targetPool: rolePoolSchema.optional()
})

export const questionSchema = z
  .object({
    id: z.number().int().min(1).max(15),
    dimension: dimensionSchema,
    scene: z.string().min(1),
    stem: z.string().min(1).max(240, '题干不得超过 240 字'),
    options: z.tuple([
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema
    ]),
    designNote: z.string().optional()
  })
  .superRefine((question, ctx) => {
    const keys = question.options.map((option) => option.key)
    for (const key of ['A', 'B', 'C', 'D'] as const) {
      if (!keys.includes(key)) {
        ctx.addIssue({ code: 'custom', message: `题 ${question.id} 缺少选项 ${key}` })
      }
    }

    const scores = question.options.map((option) => option.score)
    for (const score of [0, 3, 7, 9] as const) {
      if (!scores.includes(score)) {
        ctx.addIssue({ code: 'custom', message: `题 ${question.id} 缺少分值 ${score}` })
      }
    }

    for (const option of question.options) {
      if (option.score === undefined) {
        ctx.addIssue({ code: 'custom', message: `题 ${question.id} 选项 ${option.key} 缺少 score` })
      }
      if (option.targetPool) {
        ctx.addIssue({ code: 'custom', message: `计分题 ${question.id} 不允许 targetPool` })
      }
    }
  })

export const questionBankSchema = z
  .object({
    id: rolePoolSchema,
    name: z.string().min(1),
    pool: rolePoolSchema,
    questions: z.array(questionSchema).length(15, '每一卷必须恰好 15 题')
  })
  .superRefine((bank, ctx) => {
    if (bank.id !== bank.pool) {
      ctx.addIssue({ code: 'custom', message: `${bank.name} 的 id 与 pool 不一致` })
    }

    bank.questions.forEach((question, index) => {
      if (question.id !== index + 1) {
        ctx.addIssue({
          code: 'custom',
          message: `题号不连续：期望 ${index + 1}，实际 ${question.id}`
        })
      }
      const expectedDimension = DIMENSION_BY_QUESTION_INDEX[index]
      if (question.dimension !== expectedDimension) {
        ctx.addIssue({
          code: 'custom',
          message: `题 ${question.id} 维度错误：期望 ${expectedDimension}，实际 ${question.dimension}`
        })
      }
    })

    const expectedSeed = bank.pool === 'male' ? 'wukong' : 'nezha'
    const seedCount = bank.questions.reduce(
      (total, question) =>
        total + question.options.filter((option) => option.seedTag === expectedSeed).length,
      0
    )
    if (seedCount < 3) {
      ctx.addIssue({
        code: 'custom',
        message: `${bank.name} 至少需要 3 个 ${expectedSeed} 种子选项`
      })
    }
    for (const question of bank.questions) {
      for (const option of question.options) {
        if (option.seedTag && option.seedTag !== expectedSeed) {
          ctx.addIssue({
            code: 'custom',
            message: `题 ${question.id} 选项 ${option.key} 的种子不属于 ${bank.pool} 池`
          })
        }
      }
    }
  })

export const genderSplitQuestionSchema = z
  .object({
    id: z.literal(0),
    type: z.literal('gender-split'),
    scene: z.string().min(1),
    stem: z.string().min(1).max(240).startsWith('你', '题干必须以「你」开头'),
    options: z.tuple([questionOptionSchema, questionOptionSchema]),
    designNote: z.string().optional()
  })
  .superRefine((question, ctx) => {
    const keys = question.options.map((option) => option.key)
    if (keys.join('') !== 'AB') {
      ctx.addIssue({ code: 'custom', message: '性别分流题必须按 A/B 顺序提供两个选项' })
    }
    const pools = new Set(question.options.map((option) => option.targetPool))
    if (!pools.has('male') || !pools.has('female')) {
      ctx.addIssue({ code: 'custom', message: '性别分流题必须同时覆盖 male/female' })
    }
    for (const option of question.options) {
      if (option.score !== undefined || option.seedTag || !option.targetPool) {
        ctx.addIssue({
          code: 'custom',
          message: `性别分流选项 ${option.key} 只允许 targetPool`
        })
      }
    }
  })

export const characterSchema = z
  .object({
    id: z.string().regex(/^(\d{1,2})-(m|f)$/, 'id 必须形如 1-m / 1-f'),
    archetypeId: z.number().int().min(1).max(28),
    archetype: z.string().min(1),
    name: z.string().min(1),
    gender: rolePoolSchema,
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
  .superRefine((character, ctx) => {
    const [archetypePart, genderPart] = character.id.split('-')
    if (Number(archetypePart) !== character.archetypeId) {
      ctx.addIssue({
        code: 'custom',
        message: `id ${character.id} 与 archetypeId ${character.archetypeId} 不一致`
      })
    }
    const expectedSuffix = character.gender === 'male' ? 'm' : 'f'
    if (genderPart !== expectedSuffix) {
      ctx.addIssue({
        code: 'custom',
        message: `id ${character.id} 后缀与 gender ${character.gender} 不一致`
      })
    }

    const allowedEaster: Record<number, string | undefined> = {
      27: 'nezha',
      28: 'wukong'
    }
    const expectedEaster = allowedEaster[character.archetypeId]
    if (character.easterKey && character.easterKey !== expectedEaster) {
      ctx.addIssue({
        code: 'custom',
        message: `easterKey=${character.easterKey} 与原型 #${character.archetypeId} 不匹配`
      })
    }
    if (!character.easterKey && expectedEaster) {
      ctx.addIssue({ code: 'custom', message: `隐藏角色 #${character.archetypeId} 缺少 easterKey` })
    }
  })

export const characterLibrarySchema = z
  .array(characterSchema)
  .length(54, '角色库必须恰好 54 条（26 原型 × 男女 + 2 隐藏）')
  .superRefine((characters, ctx) => {
    const ids = new Set<string>()
    for (const character of characters) {
      if (ids.has(character.id)) {
        ctx.addIssue({ code: 'custom', message: `角色 id 重复：${character.id}` })
      }
      ids.add(character.id)
    }

    for (let archetypeId = 1; archetypeId <= 26; archetypeId += 1) {
      const genders = characters
        .filter((character) => character.archetypeId === archetypeId)
        .map((character) => character.gender)
      if (!genders.includes('male') || !genders.includes('female')) {
        ctx.addIssue({
          code: 'custom',
          message: `原型 #${archetypeId} 必须同时存在男女两版角色`
        })
      }
    }

    const nezha = characters.find((character) => character.archetypeId === 27)
    const wukong = characters.find((character) => character.archetypeId === 28)
    if (!nezha || nezha.id !== '27-f' || nezha.gender !== 'female' || nezha.easterKey !== 'nezha') {
      ctx.addIssue({ code: 'custom', message: '#27 必须是 female 魔童哪吒（27-f / nezha）' })
    }
    if (
      !wukong ||
      wukong.id !== '28-m' ||
      wukong.gender !== 'male' ||
      wukong.easterKey !== 'wukong'
    ) {
      ctx.addIssue({ code: 'custom', message: '#28 必须是 male 黑神话悟空（28-m / wukong）' })
    }
  })

export function assertContentComplete(characters: z.infer<typeof characterSchema>[]): void {
  const incomplete = characters.filter(
    (character) =>
      character.quote.length === 0 ||
      character.quoteExtra.length === 0 ||
      character.brief.length === 0 ||
      character.tags.length < 3 ||
      character.tags.length > 5 ||
      character.interpretation.length < 3 ||
      character.interpretation.length > 5 ||
      character.parallelUniverse.length === 0
  )
  if (incomplete.length > 0) {
    throw new Error(`[CBTI] 内容不完整：${incomplete.map((c) => `${c.id} ${c.name}`).join('、')}`)
  }
}
