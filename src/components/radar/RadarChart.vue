<template>
  <view class="radar-chart">
    <canvas
      v-if="!failed"
      :id="canvasId"
      :canvas-id="canvasId"
      type="2d"
      class="radar-canvas"
      :style="{ width: `${canvasSize}px`, height: `${canvasSize}px` }"
    />
    <view v-else class="radar-fallback">
      <text v-for="row in fallbackRows" :key="row.label" class="radar-fallback__row">
        {{ row.label }} {{ row.user }} / {{ characterName }} {{ row.character }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { DIMENSIONS, DIMENSION_LABELS } from '../../types'
import { drawRadar, radarEase, type RadarData } from './draw-radar'

const props = defineProps<{
  userValues: number[]
  characterValues: number[]
  characterName: string
  size?: number
  animate?: boolean
}>()

interface RadarCanvasNode {
  width: number
  height: number
  style?: { width?: string; height?: string }
  getContext: (contextType: '2d') => RadarContext2D | null
  requestAnimationFrame?: (callback: () => void) => number
  cancelAnimationFrame?: (handle: number) => void
}

type RadarContext2D = CanvasRenderingContext2D & {
  __hidpi__?: boolean
}

let canvasSequence = 0
const canvasId = `radar-canvas-${++canvasSequence}`
const resolvedSize = ref(320)
const currentProgress = ref(1)
const failed = ref(false)
let canvasNode: RadarCanvasNode | null = null
let context: RadarContext2D | null = null
let pixelRatio = 1
let frameHandle: number | null = null
let timeoutHandle: ReturnType<typeof setTimeout> | null = null
let frameIsTimeout = false
let initRetryTimer: ReturnType<typeof setTimeout> | null = null
let initRetryCount = 0

const canvasSize = computed(() => clampSize(resolvedSize.value))

const radarData = computed<RadarData>(() => ({
  userValues: props.userValues,
  characterValues: props.characterValues,
  characterName: props.characterName
}))

const fallbackRows = computed(() =>
  DIMENSIONS.map((dimension, index) => ({
    label: DIMENSION_LABELS[dimension].alias,
    user: formatFallback(props.userValues[index]),
    character: formatFallback(props.characterValues[index])
  }))
)

onMounted(async () => {
  if (props.size === undefined) {
    await measureParentWidth()
  }
  await initCanvas()
})

onBeforeUnmount(() => {
  cancelFrame()
  if (initRetryTimer) clearTimeout(initRetryTimer)
  canvasNode = null
  context = null
})

watch(
  () => props.size,
  () => {
    if (typeof props.size === 'number') {
      resolvedSize.value = clampSize(props.size)
    }
    void initCanvas()
  }
)

watch(
  () => [props.userValues, props.characterValues, props.characterName, props.animate],
  () => {
    if (failed.value) {
      void initCanvas()
    } else if (canvasNode) {
      startAnimation()
    }
  },
  { deep: true }
)

function clampSize(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 320
  return Math.min(value, 320)
}

function formatFallback(value: number | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0'
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function isCanvasNode(value: unknown): value is RadarCanvasNode {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.width === 'number' &&
    typeof candidate.height === 'number' &&
    typeof candidate.getContext === 'function'
  )
}

function measureParentWidth(): Promise<void> {
  return new Promise((resolve) => {
    const instance = getCurrentInstance()
    uni
      .createSelectorQuery()
      .in(instance?.proxy)
      .select('.radar-chart')
      .boundingClientRect((rect) => {
        const node = Array.isArray(rect) ? rect[0] : rect
        resolvedSize.value = clampSize(node?.width || 320)
        resolve()
      })
      .exec()
  })
}

async function initCanvas(): Promise<void> {
  cancelFrame()
  failed.value = false
  await nextTick()
  if (initRetryTimer) {
    clearTimeout(initRetryTimer)
    initRetryTimer = null
  }

  const instance = getCurrentInstance()
  uni
    .createSelectorQuery()
    .in(instance?.proxy)
    .select(`#${canvasId}`)
    .fields({ node: true, size: true }, () => undefined)
    .exec((res) => {
      const first = Array.isArray(res) ? res[0] : res
      if (!first) {
        scheduleInitRetry()
        return
      }
      const rawNode = (first as unknown as { node?: unknown }).node
      if (!isCanvasNode(rawNode)) {
        scheduleInitRetry()
        return
      }
      if (rawNode.width <= 0 || rawNode.height <= 0) {
        console.warn('[CBTI][Radar] canvas node 尺寸为 0，稍后重试')
        scheduleInitRetry()
        return
      }

      initRetryCount = 0
      canvasNode = rawNode
      pixelRatio = uni.getWindowInfo().pixelRatio || 1
      const cssSize = canvasSize.value
      canvasNode.width = Math.round(cssSize * pixelRatio)
      canvasNode.height = Math.round(cssSize * pixelRatio)
      if (canvasNode.style) {
        canvasNode.style.width = `${cssSize}px`
        canvasNode.style.height = `${cssSize}px`
      }

      const rawContext = canvasNode.getContext('2d')
      if (!rawContext) {
        failWithError(new Error('2d context 获取失败'))
        return
      }
      // uni-h5 的 hidpi 包装已自动换算 dpr，标记存在时不能再手动 scale
      const nativeHidpi = rawContext.__hidpi__ === true
      context = rawContext
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(
        0,
        0,
        nativeHidpi ? cssSize : canvasNode.width,
        nativeHidpi ? cssSize : canvasNode.height
      )
      startAnimation()
    })
}

function scheduleInitRetry(): void {
  if (initRetryCount >= 3) {
    failWithError(new Error('canvas node 获取失败'))
    return
  }
  initRetryCount += 1
  initRetryTimer = setTimeout(() => void initCanvas(), 60)
}

function startAnimation(): void {
  cancelFrame()
  if (!context || !canvasNode) return

  if (props.animate === false) {
    currentProgress.value = 1
    render()
    return
  }

  const startedAt = Date.now()
  currentProgress.value = 0
  const tick = (): void => {
    const elapsed = Date.now() - startedAt
    const t = Math.min(1, elapsed / 600)
    currentProgress.value = radarEase(t)
    render()
    if (t < 1) {
      scheduleNextFrame(tick)
    } else {
      currentProgress.value = 1
      render()
    }
  }
  scheduleNextFrame(tick)
}

function render(): void {
  if (!context) return
  try {
    const nativeHidpi = context.__hidpi__ === true
    const scale = nativeHidpi ? 1 : pixelRatio
    context.setTransform(scale, 0, 0, scale, 0, 0)
    drawRadar(context, canvasSize.value, radarData.value, {
      animate: props.animate !== false,
      progress: currentProgress.value
    })
  } catch (error) {
    failWithError(error)
  }
}

function scheduleNextFrame(callback: () => void): void {
  if (canvasNode?.requestAnimationFrame) {
    frameHandle = canvasNode.requestAnimationFrame(() => callback())
    frameIsTimeout = false
    return
  }
  if (typeof requestAnimationFrame === 'function') {
    frameHandle = requestAnimationFrame(callback)
    frameIsTimeout = false
    return
  }
  timeoutHandle = setTimeout(callback, 16)
  frameIsTimeout = true
}

function cancelFrame(): void {
  if (frameIsTimeout) {
    if (timeoutHandle) clearTimeout(timeoutHandle)
  } else if (frameHandle !== null) {
    if (canvasNode?.cancelAnimationFrame) {
      canvasNode.cancelAnimationFrame(frameHandle)
    } else if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(frameHandle)
    }
  }
  frameHandle = null
  timeoutHandle = null
  frameIsTimeout = false
}

function failWithError(error: unknown): void {
  console.error('[CBTI][Radar] 渲染失败', error)
  cancelFrame()
  failed.value = true
}
</script>

<style scoped>
.radar-chart {
  display: flex;
  width: 100%;
  justify-content: center;
}

.radar-canvas {
  display: block;
}

.radar-fallback {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx;
}

.radar-fallback__row {
  font-size: 24rpx;
  line-height: 1.7;
}
</style>
