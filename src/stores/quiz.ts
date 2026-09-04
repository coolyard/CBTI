/**
 * 答题状态机（规范：specs/50-pages/quiz.md §1，v4.0）
 * q1Choice → Category → 15 道计分题答案数组
 */
import { defineStore } from 'pinia'
import { CATEGORIES, characters, getCategoryByQ1Option } from '../data'
import { computeResult } from '../core/engine'
import { matchByLut, matchRelative } from '../core/matcher'
import type { CategoryMeta, OptionKey, ScoringAnswers, TestResult } from '../types'

const PROGRESS_KEY = 'cbti:progress'

type QuizStatus = 'idle' | 'answering' | 'finished'

interface QuizState {
  status: QuizStatus
  q1Choice: OptionKey | null
  category: CategoryMeta | null
  answers: ScoringAnswers
  result: TestResult | null
  switchedPool: boolean
}

function persist(state: QuizState): void {
  try {
    uni.setStorageSync(PROGRESS_KEY, {
      q1Choice: state.q1Choice,
      answers: state.answers
    })
  } catch (error) {
    console.error('[CBTI] 进度持久化失败', error)
  }
}

function isOptionKey(value: unknown): value is OptionKey {
  return typeof value === 'string' && ['A', 'B', 'C', 'D', 'E', 'F'].includes(value)
}

export const useQuizStore = defineStore('quiz', {
  state: (): QuizState => ({
    status: 'idle',
    q1Choice: null,
    category: null,
    answers: [],
    result: null,
    switchedPool: false
  }),

  getters: {
    questions(state) {
      return state.category?.questions ?? []
    },
    currentIndex(state): number {
      if (!state.q1Choice) return 0
      return state.answers.length >= 15 ? 14 : state.answers.length
    },
    isComplete(state): boolean {
      return state.q1Choice !== null && state.answers.length >= 15
    }
  },

  actions: {
    /** 第 1 屏选题材：路由到对应类别并清空旧答案 */
    chooseQ1(key: OptionKey): void {
      const category = CATEGORIES[getCategoryByQ1Option(key).id]
      this.q1Choice = key
      this.category = category
      this.answers = []
      this.result = null
      this.switchedPool = false
      this.status = 'answering'
      persist(this)
    },

    resetQ1(): void {
      this.q1Choice = null
      this.category = null
      this.answers = []
      this.result = null
      this.switchedPool = false
      this.status = 'idle'
      persist(this)
    },

    /** 记录/覆盖某题答案（index 0-based；回改截断后续答案） */
    answerAt(index: number, optionKey: OptionKey): void {
      if (!this.q1Choice || !this.category) return
      const question = this.category.questions[index]
      if (!question || !question.options.some((o) => o.key === optionKey)) return
      if (index < this.answers.length && this.answers[index] === optionKey) return

      this.answers = [...this.answers.slice(0, index), optionKey]
      persist(this)
      if (this.isComplete) {
        this.status = 'finished'
      }
    },

    start(): void {
      if (!this.q1Choice) {
        this.status = 'idle'
        return
      }
      this.status = this.isComplete ? 'finished' : 'answering'
    },

    /** 计算结果（答满后调用） */
    finalize(): TestResult {
      if (!this.category || !this.isComplete) {
        throw new Error('[CBTI] finalize 前必须完成 Q1 并答满 15 题')
      }
      this.result = computeResult(this.category, this.answers, characters)
      this.status = 'finished'
      return this.result
    },

    /** 切换对照池：保留模式串/维度分，仅对另一池重跑 LUT 主结果与灵魂近亲 */
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
      this.q1Choice = null
      this.category = null
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
          { q1Choice?: unknown; answers?: unknown[] } | ''
        if (!saved || !isOptionKey(saved.q1Choice) || !Array.isArray(saved.answers)) return
        const answers = saved.answers.filter(isOptionKey)
        if (answers.length === 0) return
        this.q1Choice = saved.q1Choice
        this.category = CATEGORIES[getCategoryByQ1Option(saved.q1Choice).id]
        this.answers = answers
        this.status = answers.length >= 15 ? 'finished' : 'answering'
      } catch (error) {
        console.error('[CBTI] 恢复进度失败', error)
      }
    }
  }
})
