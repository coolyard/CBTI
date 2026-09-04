import { describe, expect, it } from 'vitest'
import { getHeadCropLayout, HEAD_CROP_SIDE, HEAD_CROP_TOP } from '../head-crop'

describe('运行时头部裁切布局', () => {
  it('参数与 make-headshots.py 同源', () => {
    expect(HEAD_CROP_SIDE).toBe(0.6)
    expect(HEAD_CROP_TOP).toBe(0.02)
  })

  it('image 等比放大 1/0.6，并在容器中定位到头部区域', () => {
    const layout = getHeadCropLayout()
    expect(layout.scale).toBeCloseTo(1 / 0.6, 5)
    expect(layout.x).toBeCloseTo(-33.3333, 4)
    expect(layout.y).toBeCloseTo(3.3333, 4)
  })
})
