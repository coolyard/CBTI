/**
 * 立绘资产路径纯函数（规范：specs/70 §5）
 * 禁止引入 vue / uni API。
 */
export type CharacterAssetPlatform = 'mp-weixin' | 'h5'

export type CharacterPortraitFormat = 'webp' | 'jpg'

export function characterPortraitFileName(
  id: string,
  format: CharacterPortraitFormat = 'webp'
): string {
  const [archetypeId, gender] = id.split('-')
  const suffix = gender === 'f' ? 'female' : 'male'
  return `char-${archetypeId.padStart(2, '0')}-${suffix}.${format}`
}

export function characterPortraitPathForPlatform(
  platform: CharacterAssetPlatform,
  id: string
): string {
  if (platform === 'mp-weixin') {
    return `/static/characters/${characterPortraitFileName(id, 'jpg')}`
  }
  return `/pkg-characters/characters/${characterPortraitFileName(id, 'webp')}`
}

export function characterPortraitPath(id: string): string {
  // MP 主包放 448 JPG；H5 继续读 640 WebP 母版，避免重复占主包体积。
  // #ifdef MP-WEIXIN
  return characterPortraitPathForPlatform('mp-weixin', id)
  // #endif

  // #ifdef H5
  return characterPortraitPathForPlatform('h5', id)
  // #endif
}
