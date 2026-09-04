import { describe, expect, it, vi } from 'vitest'
import { getH5SafeAreaTopValue, resolveMpSafeAreaTopPx, type SafeAreaUniApi } from '../safe-area'

function createUniApi(overrides: Partial<SafeAreaUniApi> = {}): {
  api: SafeAreaUniApi
  getWindowInfo: ReturnType<typeof vi.fn>
  getMenuButtonBoundingClientRect: ReturnType<typeof vi.fn>
} {
  const getWindowInfo = vi.fn(() => ({ statusBarHeight: 47 }))
  const getMenuButtonBoundingClientRect = vi.fn(() => ({ bottom: 83 }))
  return {
    api: {
      getWindowInfo,
      getMenuButtonBoundingClientRect,
      ...overrides
    },
    getWindowInfo,
    getMenuButtonBoundingClientRect
  }
}

describe('safe-area 顶部占位', () => {
  it('MP 使用胶囊 bottom + 8px，而非只按状态栏高度', () => {
    const { api, getWindowInfo, getMenuButtonBoundingClientRect } = createUniApi()

    expect(resolveMpSafeAreaTopPx(api)).toBe(91)
    expect(getWindowInfo).toHaveBeenCalledOnce()
    expect(getMenuButtonBoundingClientRect).toHaveBeenCalledOnce()
  })

  it('MP 缺失胶囊信息时回退到状态栏高度 + 8px', () => {
    const { api } = createUniApi({
      getMenuButtonBoundingClientRect: undefined
    })

    expect(resolveMpSafeAreaTopPx(api)).toBe(55)
  })

  it('H5 返回 env(safe-area-inset-top) + 固定余量，可直接用于 CSS 变量', () => {
    expect(getH5SafeAreaTopValue()).toBe('calc(env(safe-area-inset-top, 0px) + 16px)')
  })
})
