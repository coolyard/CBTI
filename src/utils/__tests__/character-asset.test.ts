import { describe, expect, it } from 'vitest'
import { characterPortraitFileName, characterPortraitPathForPlatform } from '../character-asset'

describe('立绘资产路径', () => {
  it('m/f 后缀与两位补零', () => {
    expect(characterPortraitFileName('1-m', 'jpg')).toBe('char-01-male.jpg')
    expect(characterPortraitFileName('1-f', 'jpg')).toBe('char-01-female.jpg')
    expect(characterPortraitFileName('27-m', 'jpg')).toBe('char-27-male.jpg')
    expect(characterPortraitFileName('1-m', 'webp')).toBe('char-01-male.webp')
  })

  it('MP-WEIXIN 指向主包 static/characters', () => {
    expect(characterPortraitPathForPlatform('mp-weixin', '1-m')).toBe(
      '/static/characters/char-01-male.jpg'
    )
    expect(characterPortraitPathForPlatform('mp-weixin', '1-f')).toBe(
      '/static/characters/char-01-female.jpg'
    )
  })

  it('H5 继续指向 pkg-characters 640 母版', () => {
    expect(characterPortraitPathForPlatform('h5', '1-m')).toBe(
      '/pkg-characters/characters/char-01-male.webp'
    )
  })
})
