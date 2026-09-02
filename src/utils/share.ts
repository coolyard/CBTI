/**
 * 分享能力封装（规范：specs/80 §1）
 * H5 复制链接，MP 分享标题由页面 onShareAppMessage 使用。
 */
export function buildShareTitle(characterName: string): string {
  return `我的 CBTI 灵魂角色是「${characterName}」，你的脑子里住着谁？`
}

export function createShareMessage(characterName: string): { title: string; path: string } {
  return {
    title: buildShareTitle(characterName),
    path: '/pages/home/index'
  }
}

export function copyShareLink(): Promise<boolean> {
  return new Promise((resolve) => {
    // #ifdef H5
    const link = window.location.href
    const fallbackCopy = (): boolean => {
      const textarea = document.createElement('textarea')
      textarea.value = link
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const copied = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (!copied) {
        console.error('[CBTI][Share] execCommand 复制失败')
      }
      return copied
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(link)
        .then(() => resolve(true))
        .catch((error) => {
          console.error('[CBTI][Share] clipboard 复制失败', error)
          resolve(fallbackCopy())
        })
      return
    }
    resolve(fallbackCopy())
    // #endif

    // #ifndef H5
    resolve(false)
    // #endif
  })
}
