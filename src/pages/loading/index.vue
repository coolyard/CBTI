<template>
  <view class="page">
    <view class="scanner border-[6rpx] border-solid border-cbti-ink bg-cbti-white">
      <view class="scanner__line bg-cbti-primary"></view>
      <view class="scanner__dot bg-cbti-accent"></view>
    </view>
    <text class="copy-text">{{ visibleText }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { getLoadingSentences } from '../../core/loading'
import { useQuizStore } from '../../stores/quiz'

const TYPE_DELAY_MS = 40
const SENTENCE_PAUSE_MS = 400
const MIN_TOTAL_MS = 2200
const FORCE_REDIRECT_MS = 5000

const quiz = useQuizStore()
const visibleText = ref('')
let startedAt = 0
let disposed = false
let timer: ReturnType<typeof setTimeout> | null = null
let forceTimer: ReturnType<typeof setTimeout> | null = null

onLoad(() => {
  // #ifdef MP-WEIXIN
  const preloadSubpackage = (
    uni as unknown as { preloadSubpackage?: (options: { name: string }) => void }
  ).preloadSubpackage
  preloadSubpackage?.({ name: 'pkg-characters' })
  preloadSubpackage?.({ name: 'pkg-heads' })
  // #endif

  startedAt = Date.now()
  forceTimer = setTimeout(() => goResult(), FORCE_REDIRECT_MS)
  startCopyLoop()
})

onUnload(() => {
  disposed = true
  if (timer) clearTimeout(timer)
  if (forceTimer) clearTimeout(forceTimer)
})

function later(fn: () => void, delay: number): void {
  if (disposed) return
  timer = setTimeout(() => {
    timer = null
    if (!disposed) fn()
  }, delay)
}

function startCopyLoop(): void {
  typeSentence(getLoadingSentences(quiz.result?.easterLocked ?? false), 0)
}

function typeSentence(sentences: readonly string[], index: number): void {
  const sentence = sentences[index]
  visibleText.value = ''
  let charIndex = 0

  const typeNextChar = (): void => {
    charIndex += 1
    visibleText.value = sentence.slice(0, charIndex)
    if (charIndex < sentence.length) {
      later(typeNextChar, TYPE_DELAY_MS)
      return
    }
    if (index < sentences.length - 1) {
      later(() => typeSentence(sentences, index + 1), SENTENCE_PAUSE_MS)
      return
    }
    later(handleSequenceEnd, SENTENCE_PAUSE_MS)
  }

  later(typeNextChar, 0)
}

function handleSequenceEnd(): void {
  if (quiz.result) {
    const remaining = MIN_TOTAL_MS - (Date.now() - startedAt)
    if (remaining > 0) {
      later(goResult, remaining)
      return
    }
    goResult()
    return
  }
  startCopyLoop()
}

function goResult(): void {
  if (disposed) return
  disposed = true
  if (timer) clearTimeout(timer)
  if (forceTimer) clearTimeout(forceTimer)
  uni.redirectTo({ url: '/pages/result/index' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48rpx;
  padding: 48rpx 32rpx;
  box-sizing: border-box;
  background-color: var(--cbti-bg);
}

.scanner {
  position: relative;
  width: 280rpx;
  height: 280rpx;
  border-radius: 50%;
  overflow: hidden;
}

.scanner__line {
  position: absolute;
  left: 20rpx;
  right: 20rpx;
  height: 6rpx;
  border-radius: 999rpx;
  animation: scan-line 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

.scanner__dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: scan-dot 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

.copy-text {
  min-height: 44rpx;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
}

@keyframes scan-line {
  0% {
    top: 28rpx;
    opacity: 0.35;
  }

  50% {
    top: 132rpx;
    opacity: 1;
  }

  100% {
    top: 244rpx;
    opacity: 0.35;
  }
}

@keyframes scan-dot {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }

  50% {
    transform: translate(-50%, -50%) scale(1.35);
    opacity: 1;
  }
}
</style>
