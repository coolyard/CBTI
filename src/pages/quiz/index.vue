<template>
  <view class="page" :data-theme="currentDimension">
    <BackgroundDecor />

    <!-- 第 1 屏：题材分流 -->
    <template v-if="!quiz.q1Choice">
      <view class="progress">
        <view class="progress__heading">
          <text class="progress__title">选择你的穿越世界</text>
          <text class="progress__count">{{ displayedScreenNumber }}/{{ totalScreenCount }}</text>
        </view>
        <view class="progress__track">
          <view class="progress__bar bg-cbti-mint" :style="{ width: `${progressPercent}%` }" />
        </view>
      </view>
      <view class="theme-screen">
        <view class="card-sticker question-card">
          <text class="question-card__stem">{{ themeSplitQuestion.stem }}</text>
        </view>
        <view class="world-grid">
          <view
            v-for="entry in themeWorlds"
            :key="entry.key"
            class="card-sticker world-card anim-pop-in"
            :style="{ animationDelay: entry.delay }"
            @tap="handleChooseQ1(entry.key)"
          >
            <view class="world-card__top">
              <view class="world-card__badge bg-cbti-ink text-cbti-white">{{ entry.key }}</view>
              <text class="world-card__emoji">{{ entry.emoji }}</text>
            </view>
            <text class="world-card__title">{{ entry.title }}</text>
            <text class="world-card__tagline">{{ entry.tagline }}</text>
          </view>
        </view>
        <view class="sticker-row">
          <image
            v-for="sticker in bottomStickerRow"
            :key="sticker.name"
            class="sticker-row__image anim-float"
            :style="{ width: sticker.size, height: sticker.size, animationDelay: sticker.delay }"
            :src="decorAssetUrl(sticker.name)"
            mode="aspectFit"
          />
        </view>
      </view>
    </template>

    <!-- 类别计分题：15 屏 -->
    <template v-else>
      <view class="progress">
        <text class="progress__count"> {{ displayedScreenNumber }}/{{ totalScreenCount }} </text>
        <view class="progress__track">
          <view class="progress__bar bg-cbti-mint" :style="{ width: `${progressPercent}%` }" />
        </view>
      </view>

      <swiper class="question-swiper" :current="currentIndex" :duration="250" :disable-touch="true">
        <swiper-item v-for="question in questions" :key="question.id">
          <view class="question-page">
            <view class="sticker-row">
              <image
                v-for="sticker in topStickerRow"
                :key="sticker.name"
                class="sticker-row__image anim-float"
                :style="{
                  width: sticker.size,
                  height: sticker.size,
                  animationDelay: sticker.delay
                }"
                :src="decorAssetUrl(sticker.name)"
                mode="aspectFit"
              />
            </view>
            <view class="card-sticker question-card">
              <view class="tag-capsule question-card__scene">{{ question.scene }}</view>
              <text class="question-card__stem">{{ question.stem }}</text>
            </view>

            <view class="options">
              <view
                v-for="option in question.options"
                :key="option.key"
                class="option"
                :class="
                  isSelected(option.key) ? 'btn-primary option--selected' : 'card-sticker option'
                "
                @tap="selectOption(option.key)"
              >
                <view
                  class="option__badge bg-cbti-ink text-cbti-white border-2 border-solid border-cbti-ink"
                >
                  {{ option.key }}
                </view>
                <text class="option__text">{{ option.text }}</text>
              </view>
            </view>
            <view class="sticker-row">
              <image
                v-for="sticker in bottomStickerRow"
                :key="sticker.name"
                class="sticker-row__image anim-float"
                :style="{
                  width: sticker.size,
                  height: sticker.size,
                  animationDelay: sticker.delay
                }"
                :src="decorAssetUrl(sticker.name)"
                mode="aspectFit"
              />
            </view>
          </view>
        </swiper-item>
      </swiper>
    </template>

    <view class="quiz-footer">
      <text v-if="quiz.q1Choice && currentIndex >= 0" class="back-link" @tap="goBack">
        {{ currentIndex > 0 ? '上一题' : '重选世界' }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import BackgroundDecor from '../../components/background/BackgroundDecor.vue'
import { CATEGORIES, themeSplitQuestion } from '../../data'
import { useQuizStore } from '../../stores/quiz'
import { decorAssetUrl, type DecorName } from '../../utils/decor'
import type { Category, Dimension, OptionKey } from '../../types'

const totalScreenCount = 16

const THEME_EMOJIS: Record<OptionKey, string> = {
  A: '⚔️',
  B: '🏯',
  C: '🏀',
  D: '🧟',
  E: '🏮',
  F: '💼'
}

const quiz = useQuizStore()
const questions = computed(() => quiz.questions)
const currentIndex = ref(0)
let advanceTimer: ReturnType<typeof setTimeout> | null = null

const topStickerRow: Array<{ name: DecorName; size: string; delay: string }> = [
  { name: 'question', size: '96rpx', delay: '0s' },
  { name: 'think', size: '108rpx', delay: '0.4s' },
  { name: 'target', size: '120rpx', delay: '0.8s' }
]

const bottomStickerRow: Array<{ name: DecorName; size: string; delay: string }> = [
  { name: 'bulb', size: '108rpx', delay: '0.2s' },
  { name: 'pencil', size: '96rpx', delay: '0.6s' },
  { name: 'sweat', size: '120rpx', delay: '1s' }
]

const themeWorlds = computed(() =>
  themeSplitQuestion.options.map((option, index) => {
    const categoryId = option.targetCategory
    return {
      key: option.key,
      title: categoryId ? CATEGORIES[categoryId as Category].name : option.key,
      tagline: option.text,
      emoji: THEME_EMOJIS[option.key],
      delay: `${index * 40}ms`
    }
  })
)

const currentDimension = computed<Dimension>(
  () => questions.value[currentIndex.value]?.pair[0] ?? 'presence'
)

const displayedScreenNumber = computed(() => {
  if (!quiz.q1Choice) return 1
  return Math.min(currentIndex.value + 2, totalScreenCount)
})

const progressPercent = computed(() => {
  return Math.min((displayedScreenNumber.value / totalScreenCount) * 100, 100)
})

onLoad(() => {
  quiz.restore()
  currentIndex.value = quiz.currentIndex
  if (quiz.isComplete) finishQuiz()
})

onUnload(() => {
  if (advanceTimer) clearTimeout(advanceTimer)
})

function handleChooseQ1(key: OptionKey): void {
  quiz.chooseQ1(key)
  currentIndex.value = 0
}

function isSelected(optionKey: OptionKey): boolean {
  return quiz.answers[currentIndex.value] === optionKey
}

function selectOption(optionKey: OptionKey): void {
  if (advanceTimer) return
  const currentQuestion = questions.value[currentIndex.value]
  if (!currentQuestion) return
  if (!currentQuestion.options.some((o) => o.key === optionKey)) return

  quiz.answerAt(currentIndex.value, optionKey)
  const nextIndex = Math.min(currentIndex.value + 1, questions.value.length - 1)
  advanceTimer = setTimeout(() => {
    advanceTimer = null
    if (quiz.isComplete) {
      finishQuiz()
      return
    }
    currentIndex.value = nextIndex
  }, 250)
}

function goBack(): void {
  if (advanceTimer) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
    return
  }
  quiz.resetQ1()
  currentIndex.value = 0
}

function finishQuiz(): void {
  quiz.finalize()
  uni.redirectTo({ url: '/pages/loading/index' })
}
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: calc(env(safe-area-inset-top) + 24rpx) 32rpx calc(env(safe-area-inset-bottom) + 24rpx);
  box-sizing: border-box;
  overflow: hidden;
  background-color: var(--cbti-bg);
  transition: background-color 300ms;
  position: relative;
}

.progress {
  flex: none;
}

.progress__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.progress__title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
}

.progress__count {
  display: block;
  font-size: 24rpx;
  font-weight: 700;
  white-space: nowrap;
}

.progress__track {
  height: 16rpx;
  border-radius: 999rpx;
  background-color: rgba(26, 26, 46, 0.12);
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  border-radius: 999rpx;
  transition: width 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.theme-screen,
.question-page {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  min-height: 0;
  padding: 8rpx 0;
  box-sizing: border-box;
  overflow-y: auto;
}

.theme-screen {
  flex: 1;
  margin-top: 16rpx;
}

.sticker-row {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  height: 140rpx;
  padding: 0 16rpx;
  pointer-events: none;
}

.sticker-row__image {
  display: block;
}

.question-swiper {
  flex: 1;
  width: 100%;
  min-height: 0;
  margin-top: 32rpx;
}

.question-page {
  height: 100%;
}

.world-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  flex: none;
}

.world-card {
  display: flex;
  min-height: 176rpx;
  flex-direction: column;
  gap: 10rpx;
  padding: 18rpx 16rpx;
}

.world-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.world-card__badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44rpx;
  height: 44rpx;
  border-radius: 12rpx;
  font-size: 22rpx;
  font-weight: 800;
}

.world-card__emoji {
  font-size: 44rpx;
  line-height: 1;
}

.world-card__title {
  display: block;
  overflow: hidden;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.world-card__tagline {
  display: block;
  overflow-wrap: anywhere;
  word-break: break-all;
  font-size: 22rpx;
  line-height: 1.45;
  color: rgba(26, 26, 46, 0.72);
}

.question-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24rpx;
  padding: 32rpx;
}

.question-card__scene {
  flex: none;
}

.question-card__stem {
  font-size: 32rpx;
  line-height: 1.6;
}

.options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.option {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 10rpx;
  width: 100%;
  min-height: 132rpx;
  padding: 16rpx;
  border-width: 2px;
  border-radius: 24rpx;
  box-sizing: border-box;
}

.option--selected {
  transform: rotate(-1.5deg);
  border-radius: 24rpx;
}

.option__badge {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
  font-weight: 800;
}

.option__text {
  flex: 1;
  overflow-wrap: anywhere;
  word-break: break-all;
  font-size: 28rpx;
  line-height: 1.5;
}

.option--selected .option__text {
  color: #ffffff;
}

.quiz-footer {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: flex-start;
  height: 64rpx;
}

.back-link {
  font-size: 24rpx;
  text-decoration: underline;
}
</style>
