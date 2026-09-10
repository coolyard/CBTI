#!/usr/bin/env node
/**
 * Parse CBTI_test_questions_categorized_v5.md into the two scored question banks.
 *
 * The Markdown is the content source of truth. Seed keys in its appendix drifted
 * from the option tables, so seeds are bound here by question number and the
 * option letter that contains the documented text.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const SOURCE = resolve(ROOT, 'CBTI_test_questions_categorized_v5.md')
const text = readFileSync(SOURCE, 'utf8')

const DIMENSION_BY_LABEL = new Map([
  ['存在感', 'presence'],
  ['认知力', 'cognition'],
  ['情感力', 'emotion'],
  ['规则感', 'order'],
  ['持久力', 'endurance']
])

const SEEDS = {
  male: {
    wukong: new Set(['1:A', '3:B', '5:C', '7:C', '9:B', '12:B', '13:D', '15:C'])
  },
  female: {
    nezha: new Set(['1:D', '3:A', '6:D', '9:B', '10:B', '13:D', '15:D'])
  }
}

function quote(value) {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`
}

function parseBank(gender) {
  const genderLabel = gender === 'male' ? '男' : '女'
  const startMarker = gender === 'male' ? '## 三、男性版测试题' : '## 四、女性版测试题'
  const endMarker = gender === 'male' ? '## 四、女性版测试题' : '## 五、计分规则'
  const start = text.indexOf(startMarker)
  const end = text.indexOf(endMarker)
  if (start < 0 || end < 0) throw new Error(`找不到${genderLabel}性版题库边界`)

  const section = text.slice(start, end)
  const headingPattern =
    /#### Q(\d+)（[男女]）· ([^\n]+)\n\n\*\*【题干】\*\*\n([^\n]+)\n\n\| 选项 \| 内容 \| 分值 \| 维度 \|\n\|[-|]+\|\n([\s\S]*?)(?=\n\n#### Q|\n---\n|$)/g
  const questions = []

  for (const match of section.matchAll(headingPattern)) {
    const id = Number(match[1])
    const dimensionLabel = match[2].trim()
    const dimension = DIMENSION_BY_LABEL.get(dimensionLabel)
    if (!dimension) throw new Error(`Q${id} 未知维度：${dimensionLabel}`)

    const options = [...match[4].matchAll(/^\| ([A-D]) \| (.+?) \| (\d+) \| ([A-E]) \|$/gm)].map(
      (row) => {
        const key = row[1]
        const score = Number(row[3]) === 10 ? 9 : Number(row[3])
        const option = {
          key,
          text: row[2].trim(),
          score
        }
        const seedTag = Object.entries(SEEDS[gender]).find(([, keys]) =>
          keys.has(`${id}:${key}`)
        )?.[0]
        if (seedTag) option.seedTag = seedTag
        return option
      }
    )

    if (options.length !== 4) throw new Error(`Q${id} 选项数不是 4`)
    const expectedScores = [0, 3, 7, 9]
    if (!expectedScores.every((score) => options.some((option) => option.score === score))) {
      throw new Error(`Q${id} 分值未覆盖 0/3/7/9`)
    }

    questions.push({
      id,
      dimension,
      scene: gender === 'male' ? '男性卷' : '女性卷',
      stem: match[3].trim(),
      options
    })
  }

  if (questions.length !== 15) throw new Error(`${genderLabel}性版题数不是 15`)
  return questions
}

function emitBank(gender, questions) {
  const typeName = gender === 'male' ? '男性卷' : '女性卷'
  const lines = [
    '/**',
    ` * ${typeName}题库（由 scripts/build-v5-questions.mjs 从 v5 文档生成）。`,
    ' */',
    "import type { Question } from '../types'",
    '',
    'export const rawQuestions: Question[] = ['
  ]

  for (const [questionIndex, question] of questions.entries()) {
    lines.push('  {')
    lines.push(`    id: ${question.id},`)
    lines.push(`    dimension: ${quote(question.dimension)},`)
    lines.push(`    scene: ${quote(question.scene)},`)
    lines.push(`    stem: ${quote(question.stem)},`)
    lines.push('    options: [')
    for (const [optionIndex, option] of question.options.entries()) {
      lines.push('      {')
      lines.push(`        key: ${quote(option.key)},`)
      lines.push(`        text: ${quote(option.text)},`)
      lines.push(`        score: ${option.score}${option.seedTag ? ',' : ''}`)
      if (option.seedTag) lines.push(`        seedTag: ${quote(option.seedTag)}`)
      lines.push(`      }${optionIndex < question.options.length - 1 ? ',' : ''}`)
    }
    lines.push('    ]')
    lines.push(`  }${questionIndex < questions.length - 1 ? ',' : ''}`)
  }
  lines.push(']')
  lines.push('')
  return lines.join('\n')
}

for (const gender of ['male', 'female']) {
  const questions = parseBank(gender)
  const output = resolve(ROOT, 'src/data', `questions.${gender}.ts`)
  writeFileSync(output, emitBank(gender, questions), 'utf8')
  process.stdout.write(`generated ${output}\n`)
}
