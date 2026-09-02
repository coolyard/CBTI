/**
 * 背景装饰贴纸资产（规范：specs/70-assets.md §5）
 * 纯函数，禁止引入 vue / uni API。
 */
export const DECOR_NAMES = [
  'burst',
  'star',
  'bubble',
  'bolt',
  'tape',
  'bang',
  'dots',
  'arrow',
  'question',
  'think',
  'target',
  'bulb',
  'pencil',
  'check',
  'sweat',
  'fire'
] as const

export type DecorName = (typeof DECOR_NAMES)[number]

export function decorAssetUrl(name: DecorName): string {
  return `/static/decor/decor-${name}.webp`
}
