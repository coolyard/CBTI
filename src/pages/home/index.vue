<template>
  <view class="page">
    <BackgroundDecor :decor-names="['burst', 'star', 'arrow', 'bolt', 'dots', 'tape']" />
    <view class="brand">
      <text class="brand__logo font-display-cbti">CBTI</text>
      <text class="brand__name">Character-Based Type Indicator</text>
      <text class="brand__slogan">测测你的灵魂被哪个角色附体了</text>
      <text class="brand__subtitle">你的脑子里，住着谁？</text>
    </view>

    <swiper
      class="carousel"
      :autoplay="true"
      :interval="3000"
      :duration="250"
      :circular="true"
      :indicator-dots="true"
      indicator-color="rgba(26, 26, 46, 0.25)"
      indicator-active-color="#1A1A2E"
    >
      <swiper-item v-for="character in carouselCharacters" :key="character.id">
        <view class="card-sticker carousel__card">
          <QuoteBubble
            class="carousel__bubble"
            placement="top"
            :quote="character.quote || '绝赞撰写中…'"
            :quote-extra="character.quoteExtra"
          />
          <view class="carousel__portrait-wrap anim-float">
            <view class="carousel__portrait-frame">
              <view class="card-sticker carousel__portrait anim-pop-in">
                <text class="carousel__portrait-text">{{ character.name.charAt(0) }}</text>
                <image
                  v-if="!portraitErrors[character.id]"
                  class="carousel__portrait-image"
                  :src="characterPortraitPath(character.id)"
                  mode="aspectFit"
                  @error="handlePortraitError(character.id)"
                />
              </view>
            </view>
          </view>
          <text class="carousel__archetype font-display-cbti">{{ character.archetype }}</text>
          <text class="carousel__meta">{{ character.name }} · {{ character.source }}</text>
          <text class="carousel__brief">{{ character.brief || '灵魂角色' }}</text>
        </view>
      </swiper-item>
    </swiper>

    <view class="actions">
      <view class="btn-primary actions__button" @tap="handlePrimary">{{ primaryLabel }}</view>
      <view v-if="hasUnfinishedProgress" class="btn-ghost actions__button" @tap="handleRestart">
        重新开始
      </view>
    </view>

    <text class="footer-note">15 道题 · 约 2 分钟 · 仅供娱乐</text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import BackgroundDecor from '../../components/background/BackgroundDecor.vue'
import QuoteBubble from '../../components/quote-bubble/QuoteBubble.vue'
import { characters } from '../../data'
import { getHomeCarouselCharacters } from '../../core/home'
import { useQuizStore } from '../../stores/quiz'
import { characterPortraitPath } from '../../utils/character-asset'

const quiz = useQuizStore()
const carouselCharacters = getHomeCarouselCharacters(characters)
const portraitErrors = ref<Record<string, boolean>>({})
const hasUnfinishedProgress = computed(() => quiz.answers.length > 0 && !quiz.isComplete)
const primaryLabel = computed(() => (hasUnfinishedProgress.value ? '继续上次测试' : '开始测试'))

onShow(() => {
  quiz.restore()
})

function handlePrimary(): void {
  if (hasUnfinishedProgress.value) {
    quiz.start()
  } else {
    quiz.reset()
    quiz.start()
  }
  uni.navigateTo({ url: '/pages/quiz/index' })
}

function handleRestart(): void {
  quiz.reset()
  quiz.start()
  uni.navigateTo({ url: '/pages/quiz/index' })
}

function handlePortraitError(id: string): void {
  portraitErrors.value[id] = true
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96rpx 32rpx 48rpx;
  box-sizing: border-box;
  background-color: var(--cbti-bg);
  position: relative;
  overflow-x: hidden;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  text-align: center;
}

.brand__logo {
  font-size: 72rpx;
  font-weight: 900;
}

.brand__name {
  font-size: 24rpx;
}

.brand__slogan {
  font-size: 32rpx;
  font-weight: 700;
}

.brand__subtitle {
  font-size: 24rpx;
}

.carousel {
  width: 100%;
  height: 860rpx;
  margin-top: 48rpx;
}

.carousel__card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 800rpx;
  margin: 16rpx 24rpx 8rpx;
  padding: 24rpx;
  box-sizing: border-box;
}

.carousel__bubble {
  align-self: center;
  margin-bottom: 16rpx;
}

.carousel__portrait-wrap {
  position: relative;
  height: 420rpx;
  flex: none;
  margin-bottom: 16rpx;
}

.carousel__portrait-frame {
  position: relative;
  height: 100%;
  transform: rotate(-1.5deg);
}

.carousel__portrait {
  position: relative;
  width: 100%;
  height: 420rpx;
  overflow: hidden;
}

.carousel__portrait-text {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 72rpx;
  font-weight: 900;
}

.carousel__portrait-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.carousel__archetype {
  display: block;
  overflow: hidden;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.carousel__meta {
  display: block;
  overflow: hidden;
  margin-top: 4rpx;
  font-size: 24rpx;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.carousel__brief {
  display: flex;
  align-items: center;
  overflow: hidden;
  flex: 1;
  min-height: 0;
  margin-top: 8rpx;
  font-size: 28rpx;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  width: 100%;
  margin-top: 48rpx;
}

.actions__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 480rpx;
  padding: 24rpx 0;
  font-size: 32rpx;
  font-weight: 800;
}

.footer-note {
  margin-top: 48rpx;
  font-size: 24rpx;
}
</style>
