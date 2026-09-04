/**
 * 运行时头部裁切布局（与 scripts/make-headshots.py 的裁切参数同源）
 * 容器固定为 100% 正方形；内部 image 等比放大后定位，露出的区域等价于
 * 原图：x = 20%、y = 2%、边长 = 60%。
 */
export const HEAD_CROP_SIDE = 0.6
export const HEAD_CROP_TOP = 0.02

export interface HeadCropLayout {
  /** image 元素相对容器的宽/高倍率 */
  scale: number
  /** image 元素 left 相对容器宽度的百分比 */
  x: number
  /** image 元素 top 相对容器高度的百分比 */
  y: number
}

export function getHeadCropLayout(): HeadCropLayout {
  const scale = 1 / HEAD_CROP_SIDE
  const x = -((1 - HEAD_CROP_SIDE) / (2 * HEAD_CROP_SIDE)) * 100
  const y = (HEAD_CROP_TOP / HEAD_CROP_SIDE) * 100
  return { scale, x, y }
}
