<template>
  <view class="page">
    <text class="title font-display-cbti">分享海报</text>
    <view class="poster-wrap">
      <canvas :id="canvasId" :canvas-id="canvasId" type="2d" class="poster-canvas" />
    </view>
    <view class="btn-primary export-button" @tap="exportPoster">保存海报</view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { drawPoster, type PosterAssets } from '../../components/poster/draw-poster'
import { useQuizStore } from '../../stores/quiz'
import { characterPortraitPath } from '../../utils/character-asset'
import { loadCanvasImage } from '../../utils/canvas-image'
import { downloadH5PosterPng } from '../../utils/poster-export'

const QR_CODE_SRC = '/static/mp-code.png'
const canvasId = 'poster-canvas'

interface PosterCanvasNode {
  width: number
  height: number
  getContext: (contextType: '2d') => CanvasRenderingContext2D | null
  createImage?: () => unknown
  toDataURL?: (type?: string) => string
}

const quiz = useQuizStore()
const result = computed(() => quiz.result)
let canvasNode: PosterCanvasNode | null = null
let context: CanvasRenderingContext2D | null = null

onLoad(() => {
  quiz.restore()
  if (!quiz.result && quiz.isComplete) {
    quiz.finalize()
  }
})

onReady(() => {
  void initCanvas()
})

function isPosterCanvasNode(value: unknown): value is PosterCanvasNode {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.width === 'number' &&
    typeof candidate.height === 'number' &&
    typeof candidate.getContext === 'function'
  )
}

function queryCanvasNode(): Promise<PosterCanvasNode | null> {
  return new Promise((resolve) => {
    uni
      .createSelectorQuery()
      .select(`#${canvasId}`)
      .fields({ node: true, size: true }, () => undefined)
      .exec((res) => {
        const first = Array.isArray(res) ? res[0] : res
        const rawNode = (first as unknown as { node?: unknown }).node
        resolve(isPosterCanvasNode(rawNode) ? rawNode : null)
      })
  })
}

async function initCanvas(): Promise<void> {
  const node = await queryCanvasNode()
  if (!node) {
    uni.showToast({ title: '海报画布加载失败，再试一次嘛', icon: 'none' })
    return
  }
  if (!result.value) {
    uni.showToast({ title: '灵魂数据加载中…', icon: 'none' })
    return
  }

  canvasNode = node
  canvasNode.width = 750
  canvasNode.height = 1334
  const ctx = canvasNode.getContext('2d')
  if (!ctx) {
    uni.showToast({ title: '海报画布加载失败，再试一次嘛', icon: 'none' })
    return
  }
  context = ctx

  const assets = await loadPosterAssets(canvasNode)
  drawPoster(context, result.value, assets)
}

async function loadPosterAssets(canvas: PosterCanvasNode): Promise<PosterAssets> {
  const qrCode = await loadCanvasImage(QR_CODE_SRC, canvas)
  const main = result.value?.main
  const portrait = main ? await loadCanvasImage(characterPortraitPath(main.id), canvas) : null
  return { portrait, qrCode }
}

function exportPoster(): void {
  if (!canvasNode || !context || !result.value) {
    uni.showToast({ title: '海报还没画好，等一下再存嘛', icon: 'none' })
    return
  }

  // #ifdef H5
  if (typeof canvasNode.toDataURL === 'function') {
    const dataUrl = canvasNode.toDataURL('image/png')
    const downloaded = downloadH5PosterPng(dataUrl, 'cbti-poster.png')
    uni.showToast({
      title: downloaded ? '海报已生成' : '海报生成失败，再试一次嘛',
      icon: downloaded ? 'success' : 'none'
    })
    return
  }
  // #endif

  // #ifdef MP-WEIXIN
  const options = {
    canvasId,
    canvas: canvasNode,
    fileType: 'png',
    success: (res: { tempFilePath: string }) => saveToAlbum(res.tempFilePath),
    fail: () => {
      console.error('[CBTI][Poster] 海报导出失败')
      uni.showToast({ title: '海报生成失败，再试一次嘛', icon: 'none' })
    }
  } as unknown as UniNamespace.CanvasToTempFilePathOptions
  uni.canvasToTempFilePath(options)
  // #endif
}

function saveToAlbum(filePath: string): void {
  uni.saveImageToPhotosAlbum({
    filePath,
    success: () => {
      uni.showToast({ title: '海报已保存', icon: 'success' })
    },
    fail: () => {
      uni.showModal({
        title: '需要相册权限',
        content: '去设置开启相册权限，才能保存海报哦',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) uni.openSetting()
        }
      })
    }
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
  padding: 48rpx 32rpx calc(env(safe-area-inset-bottom) + 32rpx);
  box-sizing: border-box;
  background-color: var(--cbti-bg);
}

.title {
  font-size: 40rpx;
  font-weight: 800;
}

.poster-wrap {
  width: 375px;
  max-width: 100%;
}

.poster-canvas {
  display: block;
  width: 375px;
  height: 667px;
  max-width: 100%;
  border: 2px solid #1a1a2e;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #1a1a2e;
}

.export-button {
  width: 480rpx;
  padding: 24rpx 0;
  font-size: 32rpx;
  font-weight: 800;
  text-align: center;
}
</style>
