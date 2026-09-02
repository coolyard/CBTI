import { describe, expect, it, vi } from 'vitest'
import { computeRadarLayout, drawRadar, radarEase } from '../draw-radar'

function createFakeContext(): CanvasRenderingContext2D {
  const context = {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 20 })),
    setLineDash: vi.fn(),
    setTransform: vi.fn(),
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'left' as CanvasTextAlign,
    textBaseline: 'alphabetic' as CanvasTextBaseline
  }
  return context as unknown as CanvasRenderingContext2D
}

describe('drawRadar 纯函数', () => {
  it('合法数据完整绘制不抛错', () => {
    const ctx = createFakeContext()
    expect(() =>
      drawRadar(
        ctx,
        320,
        {
          userValues: [8.5, 6, 4, 2, 9],
          characterValues: [9, 9, 5, 2, 9],
          characterName: '高启强'
        },
        { animate: false }
      )
    ).not.toThrow()
  })

  it('数组长度不为 5 时抛错', () => {
    expect(() =>
      drawRadar(
        createFakeContext(),
        320,
        {
          userValues: [1, 2],
          characterValues: [9, 9, 5, 2, 9],
          characterName: '高启强'
        },
        { animate: false }
      )
    ).toThrow(/长度必须为 5/)
  })

  it('radarEase 起终点固定', () => {
    expect(radarEase(0)).toBe(0)
    expect(radarEase(1)).toBeCloseTo(1, 5)
  })

  it('隐藏图例与数值后仍可完整绘制', () => {
    expect(() =>
      drawRadar(
        createFakeContext(),
        320,
        {
          userValues: [8.5, 6, 4, 2, 9],
          characterValues: [9, 9, 5, 2, 9],
          characterName: '高启强'
        },
        { animate: false, hideLegend: true, hideValues: true }
      )
    ).not.toThrow()
  })

  it.each([280, 320])('size=%s 最长标签与图例包围盒完整落在画布内', (size) => {
    const measureText = (text: string, fontSize: number) => Array.from(text).length * fontSize
    const labels = Array.from({ length: 5 }, () => '锋芒度 10.0')
    const layout = computeRadarLayout(size, labels, '高启强', measureText)

    expect(layout.labelMargin).toBeGreaterThanOrEqual(44)
    expect(layout.labels).toHaveLength(5)
    for (const label of layout.labels) {
      expect(label.box.x).toBeGreaterThanOrEqual(0)
      expect(label.box.y).toBeGreaterThanOrEqual(0)
      expect(label.box.x + label.box.width).toBeLessThanOrEqual(size)
      expect(label.box.y + label.box.height).toBeLessThanOrEqual(size)
    }

    expect(layout.legend).not.toBeNull()
    const legend = layout.legend as NonNullable<typeof layout.legend>
    expect(legend.box.x).toBeGreaterThanOrEqual(0)
    expect(legend.box.y).toBeGreaterThanOrEqual(0)
    expect(legend.box.x + legend.box.width).toBeLessThanOrEqual(size)
    expect(legend.box.y + legend.box.height).toBeLessThanOrEqual(size)
  })
})
