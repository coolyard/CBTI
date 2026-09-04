/**
 * 首页展示数据（规范：specs/50-pages/home.md §1-2）
 * 纯函数，禁止引入 vue / uni API。
 */
import type { Character } from '../types'

const HOME_CAROUSEL_IDS = ['1-m', '1-f', '27-m', '28-m', '5-m', '23-f'] as const

const PLACEHOLDER_CLASSES = [
  'bg-cbti-card-1',
  'bg-cbti-card-2',
  'bg-cbti-card-3',
  'bg-cbti-card-4'
] as const

export function getHomeCarouselCharacters(characters: Character[]): Character[] {
  return HOME_CAROUSEL_IDS.map((id) => {
    const character = characters.find((item) => item.id === id)
    if (!character) {
      throw new Error(`[CBTI][Home] 轮播缺少角色：${id}`)
    }
    return character
  })
}

export function homePlaceholderClass(index: number): string {
  return PLACEHOLDER_CLASSES[index % PLACEHOLDER_CLASSES.length]
}
