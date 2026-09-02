<template>
  <view class="page" :data-theme="currentDimension">
    <BackgroundDecor />
    <view class="progress">
      <text class="progress__count">{{ displayedQuestionNumber }}/{{ questions.length }}</text>
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
                isSelected(question.id, option.key)
                  ? 'btn-primary option--selected'
                  : 'card-sticker option'
              "
              @tap="selectOption(question.id, option.key)"
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

    <view class="quiz-footer">
      <text v-if="currentIndex > 0" class="back-link" @tap="goBack">上一题</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import BackgroundDecor from '../../components/background/BackgroundDecor.vue'
import { useQuizStore } from '../../stores/quiz'
import { decorAssetUrl, type DecorName } from '../../utils/decor'
import type { Answer, Dimension } from '../../types'

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

const currentDimension = computed<Dimension>(
  () => questions.value[currentIndex.value]?.dimension ?? 'presence'
)

const displayedQuestionNumber = computed(() =>
  Math.min(currentIndex.value + 1, questions.value.length)
)

const progressPercent = computed(() => {
  const total = questions.value.length
  if (total === 0) return 0
  return Math.min((displayedQuestionNumber.value / total) * 100, 100)
})

onLoad(() => {
  quiz.restore()
  if (quiz.status === 'idle') quiz.start()
  currentIndex.value = quiz.currentIndex
  if (quiz.isComplete) finishQuiz()
})

onUnload(() => {
  if (advanceTimer) clearTimeout(advanceTimer)
})

function isSelected(questionId: number, optionKey: Answer['optionKey']): boolean {
  return quiz.answers.some((a) => a.questionId === questionId && a.optionKey === optionKey)
}

function selectOption(questionId: number, optionKey: Answer['optionKey']): void {
  if (advanceTimer) return
  const currentQuestion = questions.value[currentIndex.value]
  if (!currentQuestion || currentQuestion.id !== questionId) return
  if (!isSelected(questionId, optionKey)) {
    quiz.answer(questionId, optionKey)
  }
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
  if (currentIndex.value > 0) currentIndex.value -= 1
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

.progress__count {
  display: block;
  margin-bottom: 12rpx;
  font-size: 24rpx;
  font-weight: 700;
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
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  height: 100%;
  padding: 8rpx 0;
  box-sizing: border-box;
  overflow-y: auto;
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
  font-size: 28rpx;
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.option {
  display: flex;
  align-items: center;
  gap: 16rpx;
  width: 100%;
  min-height: 104rpx;
  padding: 20rpx 24rpx;
  border-width: 2px;
  border-radius: 24rpx;
  box-sizing: border-box;
}

.option--selected {
  transform: rotate(-1.5deg);
}

.option__badge {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  font-size: 24rpx;
  font-weight: 800;
}

.option__text {
  flex: 1;
  font-size: 28rpx;
  line-height: 1.6;
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
