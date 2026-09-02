import { describe, expect, it } from 'vitest'
import {
  characterHeadFileName,
  characterHeadPath,
  characterPortraitFileName,
  characterPortraitPath
} from '../character-asset'

describe('立绘资产路径', () => {
  it('m/f/u 后缀与两位补零', () => {
    expect(characterPortraitFileName('1-m')).toBe('char-01-male.webp')
    expect(characterPortraitFileName('1-f')).toBe('char-01-female.webp')
    expect(characterPortraitFileName('27-u')).toBe('char-27-universal.webp')
  })

  it('路径固定挂在 pkg-characters 分包下', () => {
    expect(characterPortraitPath('1-m')).toBe('/pkg-characters/characters/char-01-male.webp')
  })

  it('头部立绘 m/f/u 后缀与两位补零', () => {
    expect(characterHeadFileName('1-m')).toBe('head-01-male.webp')
    expect(characterHeadFileName('1-f')).toBe('head-01-female.webp')
    expect(characterHeadFileName('27-u')).toBe('head-27-universal.webp')
  })

  it('头部立绘路径固定挂在 pkg-heads 分包下', () => {
    expect(characterHeadPath('1-m')).toBe('/pkg-heads/heads/head-01-male.webp')
  })
})
