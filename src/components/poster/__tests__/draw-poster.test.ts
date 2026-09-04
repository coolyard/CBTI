import { describe, expect, it, vi } from 'vitest'
import { characters } from '../../../data'
import type { Character, TestResult } from '../../../types'
import {
  drawPoster,
  getQrBox,
  getRadarBox,
  POSTER_BUBBLE_TOP,
  POSTER_MAX_RADAR_SIZE,
  POSTER_TITLE_Y,
  resolveRadarSize
} from '../draw-poster'

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

  it('30 字以上台词折行后仍完整绘制', () => {
    const ctx = createFakeContext()
    const result = createPosterResult()
    const longQuoteResult = {
      ...result,
      main: {
        ...result.main,
        quote: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十'
      }
    }

    expect(() => drawPoster(ctx, longQuoteResult, {})).not.toThrow()
    expect((ctx as unknown as { fontHistory: string[] }).fontHistory).toContain(
      'bold 30px sans-serif'
    )
  })

  it('完整立绘按 640 源图等比落位，不再裁切头部', () => {
    const ctx = createFakeContext()
    const portrait = { width: 640, height: 640 }
    const drawImage = (ctx as unknown as { drawImage: ReturnType<typeof vi.fn> }).drawImage

    expect(() => drawPoster(ctx, createPosterResult(), { portrait })).not.toThrow()
    expect(drawImage).toHaveBeenCalledWith(portrait, 170, 250, 410, 410)
  })

  it('台词气泡绘于立绘上方', () => {
    const ctx = createFakeContext()
    const fillText = (ctx as unknown as { fillText: ReturnType<typeof vi.fn> }).fillText
    const portrait = { width: 640, height: 640 }

    expect(() => drawPoster(ctx, createPosterResult(), { portrait })).not.toThrow()
    expect(fillText).toHaveBeenCalledWith('告诉老默，我想吃鱼了。', 93, 132)
    expect(
      (ctx as unknown as { drawImage: ReturnType<typeof vi.fn> }).drawImage
    ).toHaveBeenCalledWith(portrait, 170, 250, 410, 410)
  })

  it('解读首段超过 3 行时以省略号截断，不阻断绘制', () => {
    const ctx = createFakeContext()
    const result = createPosterResult()
    const longTextResult = {
      ...result,
      main: {
        ...result.main,
        interpretation: [
          '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十'
        ]
      }
    }
    const fillText = (ctx as unknown as { fillText: ReturnType<typeof vi.fn> }).fillText

    expect(() => drawPoster(ctx, longTextResult, {})).not.toThrow()
    const ellipsisText = fillText.mock.calls.find(([text]) => {
      return typeof text === 'string' && text.includes('…')
    })
    expect(ellipsisText).toBeDefined()
  })

  it('气泡与标题保持 ≥48px 呼吸间距', () => {
    expect(POSTER_BUBBLE_TOP - POSTER_TITLE_Y).toBeGreaterThanOrEqual(48)
  })

  it('雷达尺寸上限为 320px', () => {
    expect(resolveRadarSize(0)).toBe(POSTER_MAX_RADAR_SIZE)
    expect(resolveRadarSize(500)).toBe(POSTER_MAX_RADAR_SIZE)
  })

  it('实际海报的 320px 雷达 box 不与小程序码区重叠', () => {
    const ctx = createFakeContext()
    const portrait = { width: 640, height: 640 }

    expect(() => drawPoster(ctx, createPosterResult(), { portrait })).not.toThrow()

    const translate = (ctx as unknown as { translate: ReturnType<typeof vi.fn> }).translate
    const radarCall = translate.mock.calls.find(([x]) => typeof x === 'number' && x < 300)
    expect(radarCall).toEqual([215, 886])

    const radarBox = getRadarBox(886)
    const qrBox = getQrBox()
    expect(radarBox.width).toBe(POSTER_MAX_RADAR_SIZE)
    expect(radarBox.y + radarBox.height).toBeLessThanOrEqual(qrBox.y)
  })
})
