/**
 * 自定义导航安全区工具（specs/80 §1：跨端差异走 src/utils 封装）。
 * 顶部占位：MP 以胶囊 bottom + 8px 为基准；H5 以 env(safe-area-inset-top) + 16px 为基准。
 */
export const MP_SAFE_TOP_MARGIN_PX = 8
export const H5_SAFE_TOP_MARGIN_PX = 16

export interface SafeAreaUniApi {
  getWindowInfo: () => { statusBarHeight?: number }
  getMenuButtonBoundingClientRect?: () => { bottom?: number }
}

export function resolveMpSafeAreaTopPx(api: SafeAreaUniApi): number {
  const windowInfo = api.getWindowInfo()
  const menuRect = api.getMenuButtonBoundingClientRect?.()
  const fallbackBottom = windowInfo.statusBarHeight ?? 0
  const capsuleBottom = Math.max(menuRect?.bottom ?? 0, fallbackBottom)
  return Math.max(0, capsuleBottom + MP_SAFE_TOP_MARGIN_PX)
}

export function getH5SafeAreaTopValue(): string {
  return `calc(env(safe-area-inset-top, 0px) + ${H5_SAFE_TOP_MARGIN_PX}px)`
}

export function getSafeAreaTopStyle(): { '--safe-top': string } {
  // #ifdef MP-WEIXIN
  return { '--safe-top': `${resolveMpSafeAreaTopPx(uni as SafeAreaUniApi)}px` }
  // #endif

  // #ifdef H5
  return { '--safe-top': getH5SafeAreaTopValue() }
  // #endif
}
