/**
 * Canvas 图片加载跨端封装（规范：specs/80 §1）
 * H5 用 Image，MP 用 canvas.createImage()。
 */
export interface CanvasImageHost {
  createImage?: () => unknown
}

export function loadCanvasImage(src: string, canvas?: CanvasImageHost): Promise<unknown | null> {
  return new Promise((resolve) => {
    // #ifdef H5
    if (typeof Image !== 'undefined') {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => resolve(image)
      image.onerror = () => resolve(null)
      image.src = src
      return
    }
    // #endif

    // #ifdef MP-WEIXIN
    if (canvas && typeof canvas.createImage === 'function') {
      const image = canvas.createImage() as {
        src?: string
        onload?: () => void
        onerror?: () => void
      }
      image.onload = () => resolve(image)
      image.onerror = () => resolve(null)
      image.src = src
      return
    }
    // #endif

    resolve(null)
  })
}
