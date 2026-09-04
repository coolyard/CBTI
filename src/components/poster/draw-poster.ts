/**
 * 分享海报纯绘制函数（规范：specs/50-pages/poster.md §2–§3）
 * 与宿主组件分离，H5/MP 共用。
 */
import { characterRadarValues } from '../../core/engine'
import { DIMENSIONS } from '../../types'
import { drawRadar } from '../radar/draw-radar'
import type { TestResult } from '../../types'

export interface PosterAssets {
  portrait?: unknown
  qrCode?: unknown
}

const WIDTH = 750
const HEIGHT = 1334
const INK = '#1A1A2E'
const PAPER = '#FFF6E5'
const ACCENT = '#FFC224'
const WHITE = '#FFFFFF'
const ROTATION_COLORS = ['#B3E5FF', '#FFD1DC', '#D9F7C4', '#FFE8A3']

export const POSTER_TITLE_Y = 52
export const POSTER_BUBBLE_TOP = 116
export const POSTER_MAX_RADAR_SIZE = 320
export const POSTER_QR_TOP = 1228

export interface PosterBox {
  x: number
  y: number
  width: number
  height: number
}

const TITLE_Y = POSTER_TITLE_Y
const BUBBLE_TOP = POSTER_BUBBLE_TOP
const BUBBLE_WIDTH = 620
const PORTRAIT_HEIGHT = 410
const QR_SIZE = 94
const QR_TOP = POSTER_QR_TOP
const QR_X = 80
const PORTRAIT_TOP_GAP = 10
const RADAR_QR_GAP = 20
const RADAR_TOP_GAP = 8
const MIN_RADAR_SIZE = 150
const MAX_RADAR_SIZE = POSTER_MAX_RADAR_SIZE

export function resolveRadarSize(radarTop: number): number {
  return Math.max(MIN_RADAR_SIZE, Math.min(MAX_RADAR_SIZE, QR_TOP - RADAR_QR_GAP - radarTop))
}

export function getRadarBox(radarTop: number): PosterBox {
  const size = resolveRadarSize(radarTop)
  return { x: (WIDTH - size) / 2, y: radarTop, width: size, height: size }
}

export function getQrBox(): PosterBox {
  return { x: QR_X, y: QR_TOP, width: QR_SIZE, height: QR_SIZE }
}

function isDrawableImage(value: unknown): value is { width: number; height: number } {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.width === 'number' && typeof candidate.height === 'number'
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const char of text) {
    const next = line + char
    if (ctx.measureText(next).width > maxWidth && line.length > 0) {
      lines.push(line)
      line = char
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function truncateLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  maxLines: number,
  maxWidth: number
): string[] {
  if (lines.length <= maxLines) return lines
  const visible = lines.slice(0, maxLines)
  let lastLine = visible[maxLines - 1]
  while (lastLine.length > 0 && ctx.measureText(`${lastLine}…`).width > maxWidth) {
    lastLine = lastLine.slice(0, -1)
  }
  visible[maxLines - 1] = `${lastLine}…`
  return visible
}

function drawCornerDots(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = 'rgba(26, 26, 46, 0.22)'
  const corners = [
    { x: 36, y: 72 },
    { x: WIDTH - 36, y: 72 },
    { x: 36, y: HEIGHT - 72 },
    { x: WIDTH - 36, y: HEIGHT - 72 }
  ]
  for (const corner of corners) {
    for (let i = -2; i <= 2; i += 1) {
      const offset = i * 14
      ctx.beginPath()
      ctx.arc(corner.x + offset, corner.y + offset, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawQuoteBubble(ctx: CanvasRenderingContext2D, result: TestResult): { bottomY: number } {
  const x = (WIDTH - BUBBLE_WIDTH) / 2
  const y = BUBBLE_TOP
  const radius = 26
  const padX = 28
  const padY = 16
  const textGap = 6
  const quoteFontSize = 30
  const extraFontSize = 26
  const quoteLineHeight = 36
  const extraLineHeight = 32
  const maxTextWidth = BUBBLE_WIDTH - padX * 2

  ctx.font = `bold ${quoteFontSize}px sans-serif`
  let quoteLines = wrapText(ctx, result.main.quote || '绝赞撰写中…', maxTextWidth)
  if (quoteLines.length > 2) {
    quoteLines = truncateLines(ctx, quoteLines, 2, maxTextWidth)
  }
  const quoteHeight = quoteLines.length * quoteLineHeight

  let extraHeight = 0
  let extraLines: string[] = []
  if (result.main.quoteExtra) {
    ctx.font = `bold ${extraFontSize}px sans-serif`
    extraLines = wrapText(ctx, result.main.quoteExtra, maxTextWidth)
    if (extraLines.length > 1) {
      extraLines = truncateLines(ctx, extraLines, 1, maxTextWidth)
    }
    extraHeight = textGap + extraLines.length * extraLineHeight
  }

  const contentHeight = quoteHeight + extraHeight
  const height = Math.max(110, Math.ceil(contentHeight + padY * 2))

  ctx.fillStyle = WHITE
  roundRectPath(ctx, x, y, BUBBLE_WIDTH, height, radius)
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.stroke()

  const tailWidth = 30
  const tailHeight = 14
  const centerX = WIDTH / 2
  const tailBaseY = y + height
  ctx.beginPath()
  ctx.moveTo(centerX, tailBaseY + tailHeight)
  ctx.lineTo(centerX - tailWidth / 2, tailBaseY)
  ctx.lineTo(centerX + tailWidth / 2, tailBaseY)
  ctx.closePath()
  ctx.fillStyle = WHITE
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.stroke()

  let textY = y + padY
  ctx.fillStyle = INK
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = `bold ${quoteFontSize}px sans-serif`
  quoteLines.forEach((line) => {
    ctx.fillText(line, x + padX, textY)
    textY += quoteLineHeight
  })

  if (extraLines.length > 0) {
    ctx.font = `bold ${extraFontSize}px sans-serif`
    extraLines.forEach((line) => {
      ctx.fillText(line, x + padX, textY)
      textY += extraLineHeight
    })
  }

  return { bottomY: y + height + tailHeight }
}

function drawPortrait(
  ctx: CanvasRenderingContext2D,
  result: TestResult,
  assets: PosterAssets,
  top: number
): number {
  const size = PORTRAIT_HEIGHT
  const x = (WIDTH - size) / 2

  if (isDrawableImage(assets.portrait)) {
    ctx.drawImage(assets.portrait as CanvasImageSource, x, top, size, size)
  } else {
    ctx.save()
    ctx.fillStyle = ROTATION_COLORS[(result.main.archetypeId - 1) % ROTATION_COLORS.length]
    roundRectPath(ctx, x + 10, top + 10, size - 20, size - 20, 24)
    ctx.fill()
    ctx.strokeStyle = INK
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillStyle = INK
    ctx.font = '900 128px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(result.main.name.charAt(0), WIDTH / 2, top + size / 2 + 4)
    ctx.restore()
  }

  return top + size
}

function drawNameAndSource(
  ctx: CanvasRenderingContext2D,
  result: TestResult,
  portraitBottom: number
): { nameY: number; sourceY: number } {
  const nameY = portraitBottom + 34
  ctx.fillStyle = INK
  ctx.font = '900 56px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(result.main.name, WIDTH / 2, nameY)

  const sourceY = nameY + 48
  ctx.fillStyle = 'rgba(26, 26, 46, 0.6)'
  ctx.font = 'bold 26px sans-serif'
  ctx.fillText(`${result.main.archetype} · ${result.main.source}`, WIDTH / 2, sourceY)
  return { nameY, sourceY }
}

function drawTags(ctx: CanvasRenderingContext2D, result: TestResult, y: number): number {
  ctx.font = 'bold 24px sans-serif'
  ctx.textBaseline = 'top'
  const gap = 16
  const tags = result.main.tags
  const lineHeight = 34

  if (tags.length === 0) {
    ctx.fillStyle = 'rgba(26, 26, 46, 0.55)'
    ctx.textAlign = 'center'
    ctx.fillText('绝赞撰写中…', WIDTH / 2, y)
    return y + lineHeight
  }

  const widths = tags.map((tag) => ctx.measureText(tag).width)
  const totalWidth = widths.reduce((sum, width) => sum + width + gap, 0) - gap
  let x = (WIDTH - totalWidth) / 2
  ctx.fillStyle = ACCENT
  ctx.textAlign = 'left'
  tags.forEach((tag, index) => {
    ctx.fillText(tag, x, y)
    x += widths[index] + gap
  })
  return y + lineHeight
}

const INTERPRETATION_FONT = 22
const INTERPRETATION_LINE_HEIGHT = 30
const INTERPRETATION_X = 70
const INTERPRETATION_MAX_WIDTH = WIDTH - 140

function resolveInterpretationLines(
  ctx: CanvasRenderingContext2D,
  result: TestResult,
  maxLines: number
): string[] {
  const text = result.main.interpretation[0]?.trim() || '绝赞撰写中…'
  ctx.font = `${INTERPRETATION_FONT}px sans-serif`
  return truncateLines(
    ctx,
    wrapText(ctx, text, INTERPRETATION_MAX_WIDTH),
    maxLines,
    INTERPRETATION_MAX_WIDTH
  )
}

function drawInterpretation(
  ctx: CanvasRenderingContext2D,
  result: TestResult,
  y: number,
  maxLines: number
): { lines: string[]; bottomY: number } {
  const lines = resolveInterpretationLines(ctx, result, maxLines)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillStyle = 'rgba(26, 26, 46, 0.82)'
  lines.forEach((line, index) => {
    ctx.fillText(line, INTERPRETATION_X, y + index * INTERPRETATION_LINE_HEIGHT)
  })
  return { lines, bottomY: y + lines.length * INTERPRETATION_LINE_HEIGHT }
}

function resolveInterpretationMaxLines(
  ctx: CanvasRenderingContext2D,
  result: TestResult,
  y: number
): number {
  const threeLineCount = resolveInterpretationLines(ctx, result, 3).length
  const radarTopWithThreeLines = y + threeLineCount * INTERPRETATION_LINE_HEIGHT + RADAR_TOP_GAP
  return radarTopWithThreeLines + MAX_RADAR_SIZE <= QR_TOP - RADAR_QR_GAP ? 3 : 2
}

function drawMiniRadar(
  ctx: CanvasRenderingContext2D,
  result: TestResult,
  y: number,
  size: number
): void {
  ctx.save()
  ctx.translate((WIDTH - size) / 2, y)
  drawRadar(
    ctx,
    size,
    {
      userValues: DIMENSIONS.map((dimension) => result.dimensionScores[dimension]),
      characterValues: characterRadarValues(result.main),
      characterName: result.main.name
    },
    { animate: false, hideLegend: true, hideValues: true }
  )
  ctx.restore()
}

function drawBottomBar(ctx: CanvasRenderingContext2D, assets: PosterAssets): void {
  const x = QR_X
  const y = QR_TOP
  const size = QR_SIZE

  ctx.fillStyle = WHITE
  ctx.fillRect(x, y, size, size)
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.strokeRect(x, y, size, size)

  if (isDrawableImage(assets.qrCode)) {
    ctx.drawImage(assets.qrCode as CanvasImageSource, x, y, size, size)
  } else {
    ctx.fillStyle = 'rgba(26, 26, 46, 0.55)'
    ctx.font = '24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('码', x + size / 2, y + size / 2)
  }

  ctx.fillStyle = INK
  ctx.font = 'bold 28px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('长按识别 · 测测你的灵魂角色', x + size + 28, y + size / 2)
}

export function drawPoster(
  ctx: CanvasRenderingContext2D,
  result: TestResult,
  assets: PosterAssets
): void {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  drawCornerDots(ctx)

  ctx.fillStyle = INK
  ctx.font = 'bold 32px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('CBTI · 角色人格指标', WIDTH / 2, TITLE_Y)

  const bubbleBottom = drawQuoteBubble(ctx, result)
  const portraitTop = bubbleBottom.bottomY + PORTRAIT_TOP_GAP
  const portraitBottom = drawPortrait(ctx, result, assets, portraitTop)

  const { sourceY } = drawNameAndSource(ctx, result, portraitBottom)
  const tagsBottom = drawTags(ctx, result, sourceY + 30)
  const interpretationTop = tagsBottom + 12
  const interpretation = drawInterpretation(
    ctx,
    result,
    interpretationTop,
    resolveInterpretationMaxLines(ctx, result, interpretationTop)
  )

  const radarTop = interpretation.bottomY + RADAR_TOP_GAP
  const radarSize = resolveRadarSize(radarTop)
  drawMiniRadar(ctx, result, radarTop, radarSize)

  drawBottomBar(ctx, assets)
}
