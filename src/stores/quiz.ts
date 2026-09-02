/**
 * 答题状态机（规范：specs/50-pages/quiz.md §1）
 * idle → answering(1..15) → finished
 */
import { defineStore } from 'pinia'
import { characters, questionsFemale, questionsMale } from '../data'
import { computeResult } from '../core/engine'
import type { Answer, Question, RolePool, TestResult } from '../types'

const PROGRESS_KEY = 'cbti:progress'

type QuizStatus = 'idle' | 'answering' | 'finished'

interface QuizState {
  status: QuizStatus
  answers: Answer[]
  pool: RolePool | null
  result: TestResult | null
  switchedPool: boolean
}

function persist(state: QuizState): void {
  try {
    uni.setStorageSync(PROGRESS_KEY, { answers: state.answers })
  } catch (error) {
    console.error('[CBTI] 进度持久化失败', error)
  }
}

export const useQuizStore = defineStore('quiz', {
  state: (): QuizState => ({
    status: 'idle',
    answers: [],
    pool: null,
    result: null,
    switchedPool: false
  }),

  getters: {
    /** 当前应使用的题库：由题 1 答案的 targetPool 决定（题 1 双库相同） */
    questions(state): Question[] {
      const first = state.answers.find((a) => a.questionId === 1)
      const q1 = questionsMale[0]
      const option = first ? q1.options.find((o) => o.key === first.optionKey) : null
      const pool: RolePool = option?.targetPool === 'female' ? 'female' : 'male'
      return pool === 'female' ? questionsFemale : questionsMale
    },
    currentIndex(state): number {
      return state.answers.length
    },
    isComplete(state): boolean {
      return state.answers.length >= 15
    }
  },

  actions: {
    start(): void {
      const hasProgress = this.answers.length > 0
      if (!hasProgress) {
        this.status = 'answering'
        return
      }
      // 有历史进度：由首页决定「继续」或「重新开始」，这里只切状态
      this.status = 'answering'
    },

    /** 记录/覆盖某题答案（回改支持） */
    answer(questionId: number, optionKey: Answer['optionKey']): void {
      const existing = this.answers.findIndex((a) => a.questionId === questionId)
      if (existing >= 0) {
        // 回改：截断到该题并替换，后续答案作废（避免跨题逻辑不一致）
        this.answers = this.answers.slice(0, existing)
      }
      this.answers.push({ questionId, optionKey })
      persist(this)
      if (this.isComplete) {
        this.status = 'finished'
      }
    },

    /** 计算结果（答满后调用） */
    finalize(): TestResult {
      if (!this.isComplete) {
        throw new Error('[CBTI] finalize 前必须答满 15 题')
      }
      this.result = computeResult(this.questions, this.answers, characters)
      this.pool = this.result.pool
      return this.result
    },

    /** 切换性别版：保留答案，对另一池重算（specs/50-pages/result.md §2） */
    switchPool(): TestResult | null {
      if (!this.result || this.result.easterLocked) return null
      const opposite: RolePool = this.result.pool === 'male' ? 'female' : 'male'
      this.result = computeResult(this.questions, this.answers, characters, { forcePool: opposite })
      this.pool = opposite
      this.switchedPool = !this.switchedPool
      return this.result
    },

    reset(): void {
      this.status = 'idle'
      this.answers = []
      this.pool = null
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
        const saved = uni.getStorageSync(PROGRESS_KEY) as { answers?: Answer[] } | ''
        if (saved && Array.isArray(saved.answers)) {
          this.answers = saved.answers
          this.status = this.isComplete ? 'finished' : 'answering'
        }
      } catch (error) {
        console.error('[CBTI] 恢复进度失败', error)
      }
    }
  }
})
