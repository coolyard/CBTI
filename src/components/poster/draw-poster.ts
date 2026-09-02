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
const ROTATION_COLORS = ['#B3E5FF', '#FFD1DC', '#D9F7C4', '#FFE8A3']

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

function truncateLines(ctx: CanvasRenderingContext2D, lines: string[], maxWidth: number): string[] {
  const result = lines.slice(0, 3)
  let lastLine = result[2]
  while (lastLine.length > 0 && ctx.measureText(`${lastLine}…`).width > maxWidth) {
    lastLine = lastLine.slice(0, -1)
  }
  result[2] = `${lastLine}…`
  return result
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

function drawPortrait(
  ctx: CanvasRenderingContext2D,
  result: TestResult,
  assets: PosterAssets
): void {
  const centerX = WIDTH / 2
  const centerY = 140 + 110
  const radius = 110

  ctx.save()
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.clip()

  if (isDrawableImage(assets.portrait)) {
    const sourceWidth = assets.portrait.width
    const sourceHeight = assets.portrait.height
    // 与 scripts/make-headshots.py 的 CROP_SIDE / CROP_TOP 保持同源
    const sourceSide = Math.round(Math.min(sourceWidth, sourceHeight) * 0.6)
    const sourceX = Math.round((sourceWidth - sourceSide) / 2)
    const sourceY = Math.round(sourceHeight * 0.02)
    ctx.drawImage(
      assets.portrait as CanvasImageSource,
      sourceX,
      sourceY,
      sourceSide,
      sourceSide,
      centerX - radius,
      centerY - radius,
      radius * 2,
      radius * 2
    )
  } else {
    ctx.fillStyle = ROTATION_COLORS[(result.main.archetypeId - 1) % ROTATION_COLORS.length]
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2)
    ctx.fillStyle = INK
    ctx.font = 'bold 96px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(result.main.name.charAt(0), centerX, centerY + 4)
  }
  ctx.restore()

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.strokeStyle = INK
  ctx.lineWidth = 4
  ctx.stroke()
}

function drawQuoteBubble(ctx: CanvasRenderingContext2D, result: TestResult): void {
  const x = (WIDTH - 590) / 2
  const y = 540
  const width = 590
  const height = 140
  const radius = 24

  ctx.fillStyle = '#FFFFFF'
  roundRectPath(ctx, x, y, width, height, radius)
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.stroke()

  const tailWidth = 36
  const tailHeight = 18
  const centerX = x + width / 2
  const tailApexY = y + 1
  const tailBaseY = tailApexY + tailHeight
  ctx.beginPath()
  ctx.moveTo(centerX, tailApexY)
  ctx.lineTo(centerX - tailWidth / 2, tailBaseY)
  ctx.lineTo(centerX + tailWidth / 2, tailBaseY)
  ctx.closePath()
  ctx.fillStyle = '#FFFFFF'
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(centerX, tailApexY)
  ctx.lineTo(centerX - tailWidth / 2, tailBaseY)
  ctx.moveTo(centerX, tailApexY)
  ctx.lineTo(centerX + tailWidth / 2, tailBaseY)
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = INK
  let fontSize = 40
  let lineHeight = 50
  ctx.font = `${fontSize}px sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  const maxTextWidth = width - 48
  let lines = wrapText(ctx, result.main.quote, maxTextWidth)
  if (lines.length > 2) {
    fontSize = 34
    lineHeight = 42
    ctx.font = `${fontSize}px sans-serif`
    lines = wrapText(ctx, result.main.quote, maxTextWidth)
  }
  if (lines.length > 3) {
    lines = truncateLines(ctx, lines, maxTextWidth)
  }
  const startY = Math.max(y + tailHeight + 8, y + (height - lines.length * lineHeight) / 2)
  lines.forEach((line, index) => {
    ctx.fillText(line, x + 24, startY + index * lineHeight)
  })
}

function drawMiniRadar(ctx: CanvasRenderingContext2D, result: TestResult): void {
  ctx.save()
  ctx.translate((WIDTH - 360) / 2, 720)
  drawRadar(
    ctx,
    360,
    {
      userValues: DIMENSIONS.map((dimension) => result.dimensionScores[dimension]),
      characterValues: characterRadarValues(result.main),
      characterName: result.main.name
    },
    { animate: false, hideLegend: true, hideValues: true }
  )
  ctx.restore()
}

function drawTags(ctx: CanvasRenderingContext2D, result: TestResult): void {
  ctx.font = 'bold 28px sans-serif'
  ctx.textBaseline = 'top'
  const gap = 24
  let x = 0
  const y = 1100
  const tags = result.main.tags

  if (tags.length === 0) {
    ctx.fillStyle = 'rgba(26, 26, 46, 0.55)'
    ctx.textAlign = 'center'
    ctx.fillText('绝赞撰写中…', WIDTH / 2, y)
    return
  }

  const firstLine = tags
  const widths = firstLine.map((tag) => ctx.measureText(tag).width)
  const totalWidth = widths.reduce((sum, width) => sum + width + gap * 2, 0) - gap
  x = (WIDTH - totalWidth) / 2
  ctx.textAlign = 'left'
  for (let i = 0; i < firstLine.length; i += 1) {
    ctx.fillStyle = ACCENT
    ctx.fillText(firstLine[i], x + gap, y)
    x += widths[i] + gap * 2
  }
}

function drawBottomBar(ctx: CanvasRenderingContext2D, assets: PosterAssets): void {
  const x = 80
  const y = 1180
  const size = 120

  ctx.fillStyle = '#FFFFFF'
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
  ctx.font = 'bold 34px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('长按识别 · 测测你的灵魂角色', x + size + 32, y + size / 2)
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
  ctx.fillText('CBTI · 角色人格指标', WIDTH / 2, 48)

  drawPortrait(ctx, result, assets)

  ctx.fillStyle = INK
  ctx.font = '900 64px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(result.main.name, WIDTH / 2, 420)

  ctx.fillStyle = 'rgba(26, 26, 46, 0.6)'
  ctx.font = '24px sans-serif'
  ctx.fillText(`${result.main.archetype} · ${result.main.source}`, WIDTH / 2, 480)

  drawQuoteBubble(ctx, result)
  drawMiniRadar(ctx, result)
  drawTags(ctx, result)
  drawBottomBar(ctx, assets)
}
