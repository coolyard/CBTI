import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useQuizStore } from '../quiz'

function fillNormalAnswers(store: ReturnType<typeof useQuizStore>): void {
  for (let index = 0; index < 15; index += 1) {
    const question = store.questions[index]
    const option = question.options.find((candidate) => !candidate.seedTag)
    store.answerAt(index, option?.key ?? 'A')
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.stubGlobal('uni', {
    setStorageSync: vi.fn(),
    getStorageSync: vi.fn(() => ''),
    removeStorageSync: vi.fn()
  })
})

describe('quiz store（v5）', () => {
  it('Q0-A 进入男性卷，Q0-B 进入女性卷', () => {
    const store = useQuizStore()
    store.chooseQ0('A')
    expect(store.bank?.id).toBe('male')
    expect(store.questions).toHaveLength(15)

    store.chooseQ0('B')
    expect(store.bank?.id).toBe('female')
    expect(store.questions).toHaveLength(15)
  })

  it('回改会作废该题之后的答案', () => {
    const store = useQuizStore()
    store.chooseQ0('A')
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
      q0Choice: 'B',
      answers: ['A', 'B']
    })

    store.restore()

    expect(store.q0Choice).toBe('B')
    expect(store.bank?.id).toBe('female')
    expect(store.answers).toEqual(['A', 'B'])
    expect(store.currentIndex).toBe(2)
  })

  it('switchPool 保留模式串与维度分，只对另一池重算 LUT/近亲', () => {
    const store = useQuizStore()
    store.chooseQ0('A')
    fillNormalAnswers(store)
    store.finalize()
    const original = store.result
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

  it('男性卷累计 3 个 wukong 种子后锁定且不可切换', () => {
    const store = useQuizStore()
    store.chooseQ0('A')
    let remaining = 3
    for (let index = 0; index < 15; index += 1) {
      const question = store.questions[index]
      const seedOption = question.options.find((option) => option.seedTag === 'wukong')
      const normalOption = question.options.find((option) => !option.seedTag)
      if (seedOption && remaining > 0) {
        store.answerAt(index, seedOption.key)
        remaining -= 1
      } else {
        store.answerAt(index, normalOption?.key ?? 'A')
      }
    }
    store.finalize()

    expect(store.result?.easterLocked).toBe(true)
    expect(store.result?.main.id).toBe('28-m')
    expect(store.switchPool()).toBeNull()
    expect(store.switchedPool).toBe(false)
  })

  it('重复回答同一题不膨胀答案', () => {
    const store = useQuizStore()
    store.chooseQ0('A')
    store.answerAt(0, 'A')
    store.answerAt(0, 'A')

    expect(store.answers).toEqual(['A'])
  })
})
