/**
 * 海报导出跨端封装（规范：specs/80 §1）
 * H5 用 a[download]；MP 走 canvasToTempFilePath，不在此文件处理。
 */
export function downloadH5PosterPng(dataUrl: string, filename: string): boolean {
  // #ifdef H5
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  return true
  // #endif

  // #ifndef H5
  return false
  // #endif
}
