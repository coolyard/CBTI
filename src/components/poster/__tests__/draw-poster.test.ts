import { describe, expect, it, vi } from 'vitest'
import { characters } from '../../../data'
import type { Character, TestResult } from '../../../types'
import { drawPoster } from '../draw-poster'

function createFakeContext(): CanvasRenderingContext2D {
  const fontHistory: string[] = []
  let currentFont = ''
  const context = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arcTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    drawImage: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: Array.from(text).length * 40 })),
    setLineDash: vi.fn(),
    arc: vi.fn(),
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 1,
    get font() {
      return currentFont
    },
    set font(value: string) {
      currentFont = value
      fontHistory.push(value)
    },
    fontHistory,
    textAlign: 'left' as CanvasTextAlign,
    textBaseline: 'alphabetic' as CanvasTextBaseline
  }
  return context as unknown as CanvasRenderingContext2D
}

function createPosterResult(): TestResult {
  const main = characters.find((c) => c.id === '1-m') as Character
  return {
    pool: 'male',
    dimensionTotals: {
      presence: 36,
      cognition: 30,
      emotion: 30,
      order: 24,
      endurance: 30
    },
    dimensionScores: {
      presence: 8.5,
      cognition: 6,
      emotion: 4,
      order: 2,
      endurance: 9
    },
    bands: {
      presence: 'H',
      cognition: 'M',
      emotion: 'M',
      order: 'L',
      endurance: 'H'
    },
    pattern: 'H-M-M-L-H',
    easterLocked: false,
    main,
    relative: null
  }
}

describe('drawPoster 纯函数', () => {
  it('合法结果与缺失资产可完整绘制不抛错', () => {
    expect(() => drawPoster(createFakeContext(), createPosterResult(), {})).not.toThrow()
  })

  it('30 字以上台词发生字号降级且不抛错', () => {
    const ctx = createFakeContext()
    const result = createPosterResult()
    const longQuoteResult = {
      ...result,
      main: {
        ...result.main,
        quote: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十'
      }
    }

    expect(() => drawPoster(ctx, longQuoteResult, {})).not.toThrow()
    expect((ctx as unknown as { fontHistory: string[] }).fontHistory).toContain('34px sans-serif')
  })

  it('立绘圆从 640 源图按头部裁切参数绘制', () => {
    const ctx = createFakeContext()
    const portrait = { width: 640, height: 640 }
    const drawImage = (ctx as unknown as { drawImage: ReturnType<typeof vi.fn> }).drawImage

    expect(() => drawPoster(ctx, createPosterResult(), { portrait })).not.toThrow()
    expect(drawImage).toHaveBeenCalledWith(portrait, 128, 13, 384, 384, 265, 140, 220, 220)
  })
})
