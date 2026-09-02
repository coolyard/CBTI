/**
 * 五维雷达图纯绘制函数（规范：specs/55-components/radar-chart.md §2–§4）
 * 与宿主组件分离，海报离屏 canvas 复用同一函数。
 */
import { DIMENSIONS, DIMENSION_LABELS } from '../../types'

export interface RadarData {
  userValues: number[]
  characterValues: number[]
  characterName: string
}

export interface DrawRadarOptions {
  animate?: boolean
  progress?: number
  hideLegend?: boolean
  hideValues?: boolean
}

const INK = '#1A1A2E'
const PRIMARY = '#7C4DFF'
const ACCENT = '#FFC224'

export type RadarMeasureText = (text: string, fontSize: number) => number

export interface RadarTextBox {
  x: number
  y: number
  width: number
  height: number
}

export interface RadarLabelLayout {
  text: string
  align: 'left' | 'center' | 'right'
  x: number
  y: number
  box: RadarTextBox
}

export interface RadarLegendSwatch {
  x: number
  y: number
  width: number
  height: number
  dashed: boolean
}

export interface RadarLegendText {
  text: string
  x: number
  y: number
}

export interface RadarLegendLayout {
  swatches: RadarLegendSwatch[]
  texts: RadarLegendText[]
  box: RadarTextBox
}

export interface RadarLayout {
  labelMargin: number
  radius: number
  labelFontSize: number
  legendFontSize: number
  labels: RadarLabelLayout[]
  legend: RadarLegendLayout | null
}

function clampValue(value: number): number {
  return Math.min(10, Math.max(0, value))
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

function formatScore(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function clampBox(box: RadarTextBox, size: number): void {
  box.x = Math.min(Math.max(0, box.x), Math.max(0, size - box.width))
  box.y = Math.min(Math.max(0, box.y), Math.max(0, size - box.height))
}

function computeLegendLayout(
  size: number,
  characterName: string,
  measureText: RadarMeasureText
): { legend: RadarLegendLayout; fontSize: number } {
  const swatchWidth = 24
  const swatchHeight = 4
  const sectionGap = 28
  const labelGap = 12
  const youLabel = '你'
  const characterLabel = characterName || '角色'
  const legendY = size - 22

  const build = (fontSize: number) => {
    const youWidth = measureText(youLabel, fontSize)
    const characterWidth = measureText(characterLabel, fontSize)
    const totalWidth =
      swatchWidth + labelGap + youWidth + sectionGap + swatchWidth + labelGap + characterWidth
    const height = fontSize + 8
    const swatches: RadarLegendSwatch[] = [
      {
        x: 0,
        y: legendY - swatchHeight / 2,
        width: swatchWidth,
        height: swatchHeight,
        dashed: false
      },
      {
        x: swatchWidth + labelGap + youWidth + sectionGap,
        y: legendY - swatchHeight / 2,
        width: swatchWidth,
        height: swatchHeight,
        dashed: true
      }
    ]
    const texts: RadarLegendText[] = [
      { text: youLabel, x: swatchWidth + labelGap, y: legendY },
      {
        text: characterLabel,
        x: swatchWidth + labelGap + youWidth + sectionGap + swatchWidth + labelGap,
        y: legendY
      }
    ]
    return {
      legend: {
        swatches,
        texts,
        box: { x: 0, y: legendY - height / 2, width: totalWidth, height }
      },
      totalWidth
    }
  }

  let fontSize = Math.max(10, Math.round(size / 20))
  let built = build(fontSize)
  if (built.totalWidth > size && fontSize > 8) {
    const scale = Math.min(1, (size - 8) / built.totalWidth)
    fontSize = Math.max(8, Math.floor(fontSize * scale))
    built = build(fontSize)
  }

  const startX = built.totalWidth <= size ? (size - built.totalWidth) / 2 : 0
  for (const swatch of built.legend.swatches) {
    swatch.x += startX
  }
  for (const text of built.legend.texts) {
    text.x += startX
  }
  built.legend.box.x += startX
  clampBox(built.legend.box, size)
  return { legend: built.legend, fontSize }
}

export function computeRadarLayout(
  size: number,
  labels: string[],
  characterName: string,
  measureText: RadarMeasureText,
  options?: { hideLegend?: boolean }
): RadarLayout {
  if (labels.length !== 5) {
    throw new Error('[CBTI][Radar] labels 长度必须为 5')
  }

  const labelFontSize = Math.max(10, Math.round(size / 13.3))
  const widths = labels.map((label) => measureText(label, labelFontSize))
  const sideWidths = DIMENSIONS.map((_, index) => {
    const cos = Math.cos(degToRad(-90 + 72 * index))
    return Math.abs(cos) > 0.1 ? widths[index] : 0
  })
  const maxSideWidth = Math.max(...sideWidths)
  const radius = Math.max(2, size / 2 - Math.max(44, maxSideWidth + 12))
  const labelMargin = size / 2 - radius

  const labelLayouts: RadarLabelLayout[] = DIMENSIONS.map((_, index) => {
    const anchor = polygonPoint(size, radius + 26, index, 1)
    const cos = Math.cos(degToRad(-90 + 72 * index))
    let align: RadarLabelLayout['align'] = 'center'
    if (Math.abs(cos) > 0.1) {
      align = cos > 0 ? 'left' : 'right'
    }

    const box: RadarTextBox = {
      x: 0,
      y: 0,
      width: widths[index],
      height: labelFontSize + 8
    }
    if (align === 'center') {
      box.x = anchor.x - box.width / 2
    } else if (align === 'left') {
      box.x = anchor.x
    } else {
      box.x = anchor.x - box.width
    }
    box.y = anchor.y - box.height / 2
    clampBox(box, size)

    let x = box.x
    if (align === 'center') {
      x += box.width / 2
    } else if (align === 'right') {
      x += box.width
    }
    return {
      text: labels[index],
      align,
      x,
      y: box.y + box.height / 2,
      box
    }
  })

  let legend: RadarLegendLayout | null = null
  let legendFontSize = Math.max(10, Math.round(size / 20))
  if (!options?.hideLegend) {
    const computed = computeLegendLayout(size, characterName, measureText)
    legend = computed.legend
    legendFontSize = computed.fontSize
  }

  return {
    labelMargin,
    radius,
    labelFontSize,
    legendFontSize,
    labels: labelLayouts,
    legend
  }
}

function polygonPoint(
  size: number,
  radius: number,
  index: number,
  value: number
): { x: number; y: number } {
  const angle = degToRad(-90 + 72 * index)
  return {
    x: size / 2 + radius * Math.cos(angle) * value,
    y: size / 2 + radius * Math.sin(angle) * value
  }
}

function tracePolygon(
  ctx: CanvasRenderingContext2D,
  points: Array<{ x: number; y: number }>
): void {
  ctx.beginPath()
  points.forEach((point, i) => {
    if (i === 0) ctx.moveTo(point.x, point.y)
    else ctx.lineTo(point.x, point.y)
  })
  ctx.closePath()
}

function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number, t: number): number {
  const cx = 3 * p1x
  const bx = 3 * (p2x - p1x) - cx
  const ax = 1 - cx - bx

  let x = t
  for (let i = 0; i < 8; i += 1) {
    const curveX = ((ax * x + bx) * x + cx) * x
    const derivative = 3 * ax * x + 2 * bx * x + cx
    if (Math.abs(curveX - t) < 1e-4) break
    x -= (curveX - t) / (derivative || 1)
  }

  const cy = 3 * p1y
  const by = 3 * (p2y - p1y) - cy
  const ay = 1 - cy - by
  return ((ay * x + by) * x + cy) * x
}

/** specs/40 §5 通用回弹缓动 */
export function radarEase(t: number): number {
  return cubicBezier(0.34, 1.56, 0.64, 1, Math.min(Math.max(t, 0), 1))
}

export function drawRadar(
  ctx: CanvasRenderingContext2D,
  size: number,
  data: RadarData,
  opts?: DrawRadarOptions
): void {
  if (data.userValues.length !== 5 || data.characterValues.length !== 5) {
    throw new Error('[CBTI][Radar] userValues 与 characterValues 长度必须为 5')
  }

  const progress = opts?.animate === false ? 1 : Math.max(0, opts?.progress ?? 1)
  const userValues = data.userValues.map(clampValue)
  const characterValues = data.characterValues.map(clampValue)
  const labels = DIMENSIONS.map((dimension, index) =>
    opts?.hideValues
      ? DIMENSION_LABELS[dimension].alias
      : `${DIMENSION_LABELS[dimension].alias} ${formatScore(userValues[index])}`
  )
  const measureText: RadarMeasureText = (text, fontSize) => {
    ctx.font = `${fontSize}px sans-serif`
    return ctx.measureText(text).width
  }
  const layout = computeRadarLayout(size, labels, data.characterName || '角色', measureText, {
    hideLegend: opts?.hideLegend
  })
  const radius = layout.radius

  ctx.clearRect(0, 0, size, size)

  // 网格：5 个同心五边形，最外圈加深
  for (const gridValue of [2, 4, 6, 8, 10]) {
    ctx.strokeStyle = gridValue === 10 ? 'rgba(26, 26, 46, 0.3)' : 'rgba(26, 26, 46, 0.12)'
    ctx.lineWidth = 1
    tracePolygon(
      ctx,
      DIMENSIONS.map((_, i) => polygonPoint(size, radius, i, gridValue / 10))
    )
    ctx.stroke()
  }

  // 轴线：中心到最外圈
  ctx.strokeStyle = 'rgba(26, 26, 46, 0.12)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i < DIMENSIONS.length; i += 1) {
    const outer = polygonPoint(size, radius, i, 1)
    ctx.moveTo(size / 2, size / 2)
    ctx.lineTo(outer.x, outer.y)
  }
  ctx.stroke()

  // 角色线：accent 虚线，不填充
  const characterPoints = characterValues.map((value, i) =>
    polygonPoint(size, radius, i, (value / 10) * progress)
  )
  tracePolygon(ctx, characterPoints)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 2.5
  ctx.setLineDash([8, 6])
  ctx.stroke()
  ctx.setLineDash([])

  // 用户线：primary 半透明面 + 实线 + 顶点圆点
  const userPoints = userValues.map((value, i) =>
    polygonPoint(size, radius, i, (value / 10) * progress)
  )
  tracePolygon(ctx, userPoints)
  ctx.fillStyle = 'rgba(124, 77, 255, 0.3)'
  ctx.fill()
  ctx.strokeStyle = PRIMARY
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = '#FFFFFF'
  ctx.strokeStyle = PRIMARY
  ctx.lineWidth = 2
  for (const point of userPoints) {
    ctx.beginPath()
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }

  // 维度标签：量词名 + 用户值，按象限对齐
  ctx.fillStyle = INK
  ctx.lineWidth = 1
  ctx.font = `${layout.labelFontSize}px sans-serif`
  ctx.textBaseline = 'middle'
  for (const label of layout.labels) {
    ctx.textAlign = label.align
    ctx.fillText(label.text, label.x, label.y)
  }

  // 图例：实心紫线 = 你；虚线黄线 = 角色名
  if (!layout.legend) return
  ctx.font = `${layout.legendFontSize}px sans-serif`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  layout.legend.swatches.forEach((swatch, index) => {
    ctx.strokeStyle = index === 0 ? PRIMARY : ACCENT
    ctx.lineWidth = index === 0 ? 3 : 2.5
    ctx.setLineDash(swatch.dashed ? [6, 4] : [])
    ctx.beginPath()
    ctx.moveTo(swatch.x, swatch.y)
    ctx.lineTo(swatch.x + swatch.width, swatch.y)
    ctx.stroke()
  })
  ctx.setLineDash([])
  ctx.fillStyle = INK
  for (const text of layout.legend.texts) {
    ctx.fillText(text.text, text.x, text.y)
  }
}
