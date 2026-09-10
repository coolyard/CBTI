import type { QuestionBank, RolePool } from '../types'
import { rawQuestions as rawFemaleQuestions } from './questions.female'
import { rawQuestions as rawMaleQuestions } from './questions.male'

export const BANKS: Record<RolePool, QuestionBank> = {
  male: {
    id: 'male',
    name: '男性卷',
    pool: 'male',
    questions: rawMaleQuestions
  },
  female: {
    id: 'female',
    name: '女性卷',
    pool: 'female',
    questions: rawFemaleQuestions
  }
}
