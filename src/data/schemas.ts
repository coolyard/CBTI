/**
 * Zod 数据契约（与 specs/20-data-schema.md §2 逐字对应）
 * 规则改动必须先改 spec 再改这里。
 */
import { z } from 'zod'

export const PATTERN_REGEX = /^[HML](-[HML]){4}$/

const optionKeySchema = z.enum(['A', 'B', 'C', 'D'])
const optionBandSchema = z.enum(['L', 'M1', 'M2', 'H'])
const dimensionSchema = z.enum(['presence', 'cognition', 'emotion', 'order', 'endurance'])
const seedTagSchema = z.enum(['nezha', 'wukong'])
const rolePoolSchema = z.enum(['male', 'female'])

export const questionOptionSchema = z.object({
  key: optionKeySchema,
  text: z.string().min(1).max(50, '选项文案不得超过 50 字'), // 规范目标 ≤30 字；v3.0 题库实际 30–45 字，暂放宽至 50，内容优化阶段收紧（specs/20 §2 注）
  band: optionBandSchema,
  seedTag: seedTagSchema.optional(),
  targetPool: rolePoolSchema.optional()
})

export const questionSchema = z
  .object({
    id: z.number().int().min(1).max(15),
    type: z.enum(['gender-split', 'normal', 'easter']),
    dimension: dimensionSchema,
    scene: z.string().min(1),
    stem: z.string().max(50, '题干不得超过 50 字').startsWith('你', '题干必须以「你」开头'),
    options: z.tuple([
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema,
      questionOptionSchema
    ]),
    designNote: z.string().optional()
  })
  .superRefine((q, ctx) => {
    const keys = q.options.map((o) => o.key)
    for (const k of ['A', 'B', 'C', 'D'] as const) {
      if (!keys.includes(k)) {
        ctx.addIssue({ code: 'custom', message: `题 ${q.id} 缺少选项 ${k}` })
      }
    }
    const bands = q.options.map((o) => o.band)
    for (const b of ['L', 'M1', 'M2', 'H'] as const) {
      if (!bands.includes(b)) {
        ctx.addIssue({ code: 'custom', message: `题 ${q.id} 缺少档位 ${b}` })
      }
    }
    if (q.type === 'gender-split') {
      for (const o of q.options) {
        if (!o.targetPool) {
          ctx.addIssue({
            code: 'custom',
            message: `性别分流题 ${q.id} 的选项 ${o.key} 缺少 targetPool`
          })
        }
      }
    }
    if (q.type === 'easter') {
      const seeds = q.options.map((o) => o.seedTag).filter(Boolean)
      if (!seeds.includes('nezha') || !seeds.includes('wukong')) {
        ctx.addIssue({
          code: 'custom',
          message: `彩蛋题 ${q.id} 必须同时含 nezha 与 wukong 种子选项`
        })
      }
    }
    if (q.type === 'normal') {
      for (const o of q.options) {
        if (o.seedTag || o.targetPool) {
          ctx.addIssue({ code: 'custom', message: `常规题 ${q.id} 不允许携带 seedTag/targetPool` })
        }
      }
    }
  })

export const questionBankSchema = z
  .array(questionSchema)
  .length(15, '题库必须恰好 15 题')
  .superRefine((qs, ctx) => {
    qs.forEach((q, i) => {
      if (q.id !== i + 1) {
        ctx.addIssue({ code: 'custom', message: `题号不连续：期望 ${i + 1}，实际 ${q.id}` })
      }
    })
    for (const dim of ['presence', 'cognition', 'emotion', 'order', 'endurance'] as const) {
      const count = qs.filter((q) => q.dimension === dim).length
      if (count !== 3) {
        ctx.addIssue({ code: 'custom', message: `维度 ${dim} 必须恰好 3 题，实际 ${count}` })
      }
    }
    if (qs[0]?.type !== 'gender-split') {
      ctx.addIssue({ code: 'custom', message: '题 1 必须为性别分流题' })
    }
    if (qs[13]?.type !== 'easter' || qs[14]?.type !== 'easter') {
      ctx.addIssue({ code: 'custom', message: '题 14/15 必须为彩蛋种子题' })
    }
  })

export const characterSchema = z
  .object({
    id: z.string().regex(/^(\d{1,2})-(m|f|u)$/, 'id 必须形如 1-m / 1-f / 27-u'),
    archetypeId: z.number().int().min(1).max(28),
    archetype: z.string().min(1),
    name: z.string().min(1),
    gender: z.union([rolePoolSchema, z.literal('universal')]),
    source: z.string(),
    pattern: z.string().regex(PATTERN_REGEX, '模式串格式非法'),
    easterKey: seedTagSchema.optional(),
    quote: z.string().max(30, '经典梗台词不得超过 30 字'),
    quoteExtra: z.string().min(1).max(30, '副台词不得超过 30 字'),
    brief: z.string().min(1).max(24, '一句话简介不得超过 24 字'),
    tags: z.array(z.string()),
    interpretation: z.array(z.string().max(120, '解读单段不得超过 120 字')),
    parallelUniverse: z.string().max(150, '平行宇宙不得超过 150 字')
  })
  .superRefine((c, ctx) => {
    const [archetypePart, genderPart] = c.id.split('-')
    if (Number(archetypePart) !== c.archetypeId) {
      ctx.addIssue({ code: 'custom', message: `id ${c.id} 与 archetypeId ${c.archetypeId} 不一致` })
    }
    const expectedSuffix = c.gender === 'male' ? 'm' : c.gender === 'female' ? 'f' : 'u'
    if (genderPart !== expectedSuffix) {
      ctx.addIssue({ code: 'custom', message: `id ${c.id} 后缀与 gender ${c.gender} 不一致` })
    }
    if (c.easterKey && c.archetypeId !== 27 && c.archetypeId !== 28) {
      ctx.addIssue({ code: 'custom', message: 'easterKey 只允许出现在原型 #27/#28' })
    }
  })

export const characterLibrarySchema = z
  .array(characterSchema)
  .length(54, '角色库必须恰好 54 条（26 原型 × 男女 + 2 通用隐藏）')
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
    for (const a of [27, 28]) {
      const entries = chars.filter((c) => c.archetypeId === a)
      if (entries.length !== 1 || entries[0].gender !== 'universal') {
        ctx.addIssue({ code: 'custom', message: `原型 #${a} 必须为恰好 1 条 universal 角色` })
      }
    }
  })

/** 内容完整度校验（内容管线 C07 启用；主链路阶段不强制） */
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
