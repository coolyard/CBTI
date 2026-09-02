/**
 * 加载页文案（规范：specs/50-pages/loading.md §1）
 * 纯函数，禁止引入 vue / uni API。
 */
export const LOADING_SENTENCES = [
  '正在调取你的互联网病历…',
  '正在扫描你的灵魂五维…',
  '正在匹配你的灵魂住客…'
] as const

const EASTER_LOADING_SENTENCE = '检测到异常灵魂波动…？'

export function getLoadingSentences(easterLocked: boolean): readonly string[] {
  return [
    LOADING_SENTENCES[0],
    LOADING_SENTENCES[1],
    easterLocked ? EASTER_LOADING_SENTENCE : LOADING_SENTENCES[2]
  ]
}
