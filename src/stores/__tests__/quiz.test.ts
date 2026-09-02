import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useQuizStore } from '../quiz'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.stubGlobal('uni', {
    setStorageSync: vi.fn(),
    getStorageSync: vi.fn(() => ''),
    removeStorageSync: vi.fn()
  })
})

describe('quiz store', () => {
  it('回改会作废该题之后的答案', () => {
    const store = useQuizStore()
    store.answer(1, 'A')
    store.answer(2, 'B')
    store.answer(3, 'C')
    store.answer(2, 'D')

    expect(store.answers).toEqual([
      { questionId: 1, optionKey: 'A' },
      { questionId: 2, optionKey: 'D' }
    ])
    expect(store.currentIndex).toBe(2)
  })

  it('restore 恢复未完成进度', () => {
    const store = useQuizStore()
    vi.mocked(uni.getStorageSync).mockReturnValue({
      answers: [
        { questionId: 1, optionKey: 'A' },
        { questionId: 2, optionKey: 'B' }
      ]
    })

    store.restore()

    expect(store.answers).toHaveLength(2)
    expect(store.currentIndex).toBe(2)
    expect(store.status).toBe('answering')
  })

  it('switchPool 对另一池重算并标记已切换', () => {
    const store = useQuizStore()
    for (const question of store.questions) {
      store.answer(question.id, 'A')
    }
    store.finalize()

    const maleMain = store.result?.main
    expect(store.pool).toBe('male')

    store.switchPool()

    expect(store.pool).toBe('female')
    expect(store.result?.main).not.toBe(maleMain)
    expect(store.switchedPool).toBe(true)
  })

  it('彩蛋锁定态 switchPool 返回 null 且不切换', () => {
    const store = useQuizStore()
    for (const question of store.questions) {
      store.answer(question.id, question.id === 14 || question.id === 15 ? 'D' : 'A')
    }
    store.finalize()

    expect(store.result?.easterLocked).toBe(true)
    expect(store.switchPool()).toBeNull()
    expect(store.switchedPool).toBe(false)
  })

  it('重复回答同一题不膨胀答案', () => {
    const store = useQuizStore()
    store.answer(1, 'A')
    store.answer(1, 'A')

    expect(store.answers).toHaveLength(1)
  })

  it('答满 15 题后重复回答不再改变状态', () => {
    const store = useQuizStore()
    for (const question of store.questions) {
      store.answer(question.id, 'A')
    }
    store.finalize()

    const answerCount = store.answers.length
    store.answer(15, 'A')

    expect(store.answers).toHaveLength(answerCount)
    expect(store.status).toBe('finished')
  })
})
