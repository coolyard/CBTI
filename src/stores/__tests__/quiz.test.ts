import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useQuizStore } from '../quiz'

function completeAnswers(store: ReturnType<typeof useQuizStore>): void {
  store.chooseQ1('A')
  for (let index = 0; index < 15; index += 1) {
    store.answerAt(index, 'A')
  }
  store.finalize()
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.stubGlobal('uni', {
    setStorageSync: vi.fn(),
    getStorageSync: vi.fn(() => ''),
    removeStorageSync: vi.fn()
  })
})

describe('quiz store（v4.0）', () => {
  it('Q1 路由到对应类别', () => {
    const store = useQuizStore()
    store.chooseQ1('F')
    expect(store.category?.id).toBe('dushi')
    expect(store.category?.pool).toBe('female')
    expect(store.questions).toHaveLength(15)
  })

  it('回改会作废该题之后的答案', () => {
    const store = useQuizStore()
    store.chooseQ1('A')
    store.answerAt(0, 'A')
    store.answerAt(1, 'B')
    store.answerAt(2, 'C')
    store.answerAt(1, 'D')

    expect(store.answers).toEqual(['A', 'D'])
    expect(store.currentIndex).toBe(2)
  })

  it('restore 恢复未完成进度', () => {
    const store = useQuizStore()
    vi.mocked(uni.getStorageSync).mockReturnValue({
      q1Choice: 'A',
      answers: ['A', 'B']
    })

    store.restore()

    expect(store.q1Choice).toBe('A')
    expect(store.category?.id).toBe('xiuxian')
    expect(store.answers).toEqual(['A', 'B'])
    expect(store.currentIndex).toBe(2)
  })

  it('switchPool 保留模式串与维度分，只对另一池重算 LUT/近亲', () => {
    const store = useQuizStore()
    completeAnswers(store)
    const original = store.result
    expect(original?.pool).toBe('male')
    const maleMain = original?.main

    store.switchPool()

    expect(store.result?.pool).toBe('female')
    expect(store.result?.pattern).toBe(original?.pattern)
    expect(store.result?.dimensionScores).toEqual(original?.dimensionScores)
    expect(store.result?.dimensionTotals).toEqual(original?.dimensionTotals)
    expect(store.result?.main.id).not.toBe(maleMain?.id)
    expect(store.result?.main.gender).toBe('female')
    expect(store.result?.main.easterKey).toBeUndefined()
    expect(store.result?.relative).not.toBeNull()
    expect(store.switchedPool).toBe(true)
  })

  it('彩蛋锁定态 switchPool 返回 null 且不切换', () => {
    const store = useQuizStore()
    store.chooseQ1('A')
    const q7Key = store.questions
      .find((q) => q.id === 7)
      ?.options.find((o) => o.seedTag === 'nezha')?.key
    const q11Key = store.questions
      .find((q) => q.id === 11)
      ?.options.find((o) => o.seedTag === 'nezha')?.key
    for (let index = 0; index < 15; index += 1) {
      store.answerAt(index, index === 6 ? (q7Key ?? 'B') : index === 10 ? (q11Key ?? 'E') : 'A')
    }
    store.finalize()

    expect(store.result?.easterLocked).toBe(true)
    expect(store.switchPool()).toBeNull()
    expect(store.switchedPool).toBe(false)
  })

  it('重复回答同一题不膨胀答案', () => {
    const store = useQuizStore()
    store.chooseQ1('A')
    store.answerAt(0, 'A')
    store.answerAt(0, 'A')

    expect(store.answers).toEqual(['A'])
  })

  it('答满 15 题后重复回答不再改变状态', () => {
    const store = useQuizStore()
    completeAnswers(store)
    const answerCount = store.answers.length
    store.answerAt(14, 'A')

    expect(store.answers).toHaveLength(answerCount)
    expect(store.status).toBe('finished')
  })
})
