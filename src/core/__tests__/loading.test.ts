import { describe, expect, it } from 'vitest'
import { getLoadingSentences } from '../loading'

describe('加载页文案', () => {
  it('easterLocked 时第三句替换为异常文案', () => {
    const normal = getLoadingSentences(false)
    const easter = getLoadingSentences(true)

    expect(normal[2]).toBe('正在匹配你的灵魂住客…')
    expect(easter[2]).toBe('检测到异常灵魂波动…？')
    expect(easter[0]).toBe(normal[0])
    expect(easter[1]).toBe(normal[1])
  })
})
