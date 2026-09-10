/**
 * v5 答题状态机：Q0 性别分流 → 对应卷 15 题。
 */
import { defineStore } from 'pinia'
import { BANKS, characters, getBankByQ0Option } from '../data'
import { computeResult } from '../core/engine'
import { matchByLut, matchRelative } from '../core/matcher'
import {
  QUESTION_COUNT,
  type OptionKey,
  type QuestionBank,
  type ScoringAnswers,
  type TestResult
} from '../types'

const PROGRESS_KEY = 'cbti:v5:progress'

type QuizStatus = 'idle' | 'answering' | 'finished'

interface QuizState {
  status: QuizStatus
  q0Choice: OptionKey | null
  bank: QuestionBank | null
  answers: ScoringAnswers
  result: TestResult | null
  switchedPool: boolean
}

function persist(state: QuizState): void {
  try {
    uni.setStorageSync(PROGRESS_KEY, {
      q0Choice: state.q0Choice,
      answers: state.answers
    })
  } catch (error) {
    console.error('[CBTI] 进度持久化失败', error)
  }
}

function isOptionKey(value: unknown): value is OptionKey {
  return typeof value === 'string' && ['A', 'B', 'C', 'D'].includes(value)
}

function isQ0Option(value: unknown): value is 'A' | 'B' {
  return value === 'A' || value === 'B'
}

export const useQuizStore = defineStore('quiz', {
  state: (): QuizState => ({
    status: 'idle',
    q0Choice: null,
    bank: null,
    answers: [],
    result: null,
    switchedPool: false
  }),

  getters: {
    questions(state) {
      return state.bank?.questions ?? []
    },
    currentIndex(state): number {
      if (!state.q0Choice) return 0
      return state.answers.length >= QUESTION_COUNT ? QUESTION_COUNT - 1 : state.answers.length
    },
    isComplete(state): boolean {
      return state.q0Choice !== null && state.answers.length >= QUESTION_COUNT
    }
  },

  actions: {
    chooseQ0(key: 'A' | 'B'): void {
      this.q0Choice = key
      this.bank = getBankByQ0Option(key)
      this.answers = []
      this.result = null
      this.switchedPool = false
      this.status = 'answering'
      persist(this)
    },

    resetQ0(): void {
      this.q0Choice = null
      this.bank = null
      this.answers = []
      this.result = null
      this.switchedPool = false
      this.status = 'idle'
      persist(this)
    },

    answerAt(index: number, optionKey: OptionKey): void {
      if (!this.q0Choice || !this.bank) return
      const question = this.bank.questions[index]
      if (!question || !question.options.some((option) => option.key === optionKey)) return
      if (index < this.answers.length && this.answers[index] === optionKey) return

      this.answers = [...this.answers.slice(0, index), optionKey]
      persist(this)
      if (this.isComplete) this.status = 'finished'
    },

    start(): void {
      if (!this.q0Choice) {
        this.status = 'idle'
        return
      }
      this.status = this.isComplete ? 'finished' : 'answering'
    },

    finalize(): TestResult {
      if (!this.bank || !this.isComplete) {
        throw new Error('[CBTI] finalize 前必须完成 Q0 并答满 15 题')
      }
      this.result = computeResult(this.bank, this.answers, characters)
      this.status = 'finished'
      return this.result
    },

    switchPool(): TestResult | null {
      if (!this.result || this.result.easterLocked) return null
      const opposite = this.result.pool === 'male' ? 'female' : 'male'
      const main = matchByLut(this.result.pattern, opposite, characters)
      const relative = matchRelative(this.result.pattern, opposite, characters, main.id)
      this.result = {
        ...this.result,
        pool: opposite,
        main,
        relative
      }
      this.switchedPool = !this.switchedPool
      return this.result
    },

    reset(): void {
      this.status = 'idle'
      this.q0Choice = null
      this.bank = null
      this.answers = []
      this.result = null
      this.switchedPool = false
      try {
        uni.removeStorageSync(PROGRESS_KEY)
      } catch (error) {
        console.error('[CBTI] 清除进度失败', error)
      }
    },

    restore(): void {
      try {
        const saved = uni.getStorageSync(PROGRESS_KEY) as
          { q0Choice?: unknown; answers?: unknown[] } | ''
        if (!saved || !isQ0Option(saved.q0Choice) || !Array.isArray(saved.answers)) return
        const answers = saved.answers.filter(isOptionKey)
        if (answers.length === 0) return
        this.q0Choice = saved.q0Choice
        this.bank = BANKS[getBankByQ0Option(saved.q0Choice).id]
        this.answers = answers
        this.status = answers.length >= QUESTION_COUNT ? 'finished' : 'answering'
      } catch (error) {
        console.error('[CBTI] 恢复进度失败', error)
      }
    }
  }
})
