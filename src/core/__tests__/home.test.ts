import { describe, expect, it } from 'vitest'
import { characters } from '../../data'
import { getHomeCarouselCharacters, homePlaceholderClass } from '../home'

describe('首页轮播数据', () => {
  it('从角色库取到 6 个热门角色', () => {
    const carousel = getHomeCarouselCharacters(characters)
    expect(carousel).toHaveLength(6)
    expect(carousel.map((c) => c.id)).toEqual(['1-m', '1-f', '27-u', '28-u', '5-m', '23-f'])
  })

  it('占位底色按 4 色轮换', () => {
    expect(homePlaceholderClass(0)).toBe('bg-cbti-card-1')
    expect(homePlaceholderClass(3)).toBe('bg-cbti-card-4')
    expect(homePlaceholderClass(4)).toBe('bg-cbti-card-1')
  })
})
