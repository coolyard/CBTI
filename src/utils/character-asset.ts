/**
 * 立绘资产路径纯函数（规范：specs/70 §5）
 * 禁止引入 vue / uni API。
 */
export function characterPortraitFileName(id: string): string {
  const [archetypeId, gender] = id.split('-')
  const suffix = gender === 'f' ? 'female' : gender === 'u' ? 'universal' : 'male'
  return `char-${archetypeId.padStart(2, '0')}-${suffix}.webp`
}

export function characterPortraitPath(id: string): string {
  return `/pkg-characters/characters/${characterPortraitFileName(id)}`
}

export function characterHeadFileName(id: string): string {
  const [archetypeId, gender] = id.split('-')
  const suffix = gender === 'f' ? 'female' : gender === 'u' ? 'universal' : 'male'
  return `head-${archetypeId.padStart(2, '0')}-${suffix}.webp`
}

export function characterHeadPath(id: string): string {
  return `/pkg-heads/heads/${characterHeadFileName(id)}`
}
