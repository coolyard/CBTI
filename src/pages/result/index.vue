<template>
  <view class="page" :data-theme="resultTheme" :style="safeAreaStyle">
    <BackgroundDecor
      :decor-names="['bang', 'bolt', 'fire', 'check', 'dots', 'star']"
      :spots="RESULT_STICKER_SPOTS"
    />
    <view class="identity">
      <QuoteBubble
        class="identity__bubble"
        placement="top"
        :quote="quote || '绝赞撰写中…'"
        :quote-extra="quoteExtra"
      />
      <view class="card-sticker identity__portrait-card">
        <image
          v-if="mainId && !mainPortraitError"
          class="identity__portrait-image"
          :src="characterPortraitPath(mainId)"
          mode="aspectFit"
          @error="handleMainPortraitError($event)"
        />
        <view v-else class="identity__portrait-placeholder" :class="homePlaceholderClass(0)">
          <text class="identity__portrait-placeholder-text">{{ mainName.charAt(0) }}</text>
        </view>
      </view>
      <text class="identity__archetype">{{ archetype }}</text>
      <text class="identity__name font-display-cbti">{{ mainName }}</text>
      <text class="identity__source">{{ source }}</text>
    </view>

    <view class="section">
      <text class="section__title">五维雷达图</text>
      <RadarChart
        :user-values="userValues"
        :character-values="characterValues"
        :character-name="mainName"
        :size="320"
        :animate="true"
      />
    </view>

    <view class="section">
      <text class="section__title">五维数值条</text>
      <view class="score-list">
        <view v-for="row in scoreRows" :key="row.dimension" class="score-row">
          <text class="score-row__alias">{{ row.alias }}</text>
          <view class="score-row__track">
            <view
              class="score-row__fill bg-cbti-primary"
              :style="{ width: `${row.score * 10}%` }"
            />
          </view>
          <text class="score-row__score">{{ row.score }}</text>
          <text class="score-row__band bg-cbti-accent border-2 border-solid border-cbti-ink">
            {{ row.band }}
          </text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section__title">灵魂标签</text>
      <view v-if="tags.length > 0" class="tags">
        <text v-for="tag in tags" :key="tag" class="tag-capsule tags__item">{{ tag }}</text>
      </view>
      <text v-else class="placeholder">绝赞撰写中…</text>
    </view>

    <view class="section">
      <text class="section__title">你的互联网病历</text>
      <template v-if="interpretations.length > 0">
        <view class="interpretation__paragraph">
          <text class="interpretation__pink">{{ firstSentence.first }}</text>
          <text>{{ firstSentence.rest }}</text>
        </view>
        <view
          v-for="(paragraph, index) in interpretations.slice(1)"
          :key="index"
          class="interpretation__paragraph"
        >
          <text>{{ paragraph }}</text>
        </view>
      </template>
      <text v-else class="placeholder">绝赞撰写中…</text>
    </view>

    <view class="section">
      <text class="section__title">如果 TA 活在 2026</text>
      <view v-if="parallelUniverse" class="card-sticker universe-card">
        <text class="universe-card__text">{{ parallelUniverse }}</text>
      </view>
      <text v-else class="placeholder">绝赞撰写中…</text>
    </view>

    <view class="section">
      <text class="section__title">灵魂近亲</text>
      <view v-if="relative" class="card-sticker relative-card" @tap="openRelativeModal">
        <view class="relative-card__portrait anim-float" :class="homePlaceholderClass(1)">
          <text class="relative-card__portrait-text">{{ relative.name.charAt(0) }}</text>
          <image
            v-if="!portraitErrors[relative.id]"
            class="relative-card__portrait-image"
            :src="characterPortraitPath(relative.id)"
            :style="headCropStyle"
            mode="aspectFill"
            @error="handlePortraitError(relative.id, $event)"
          />
        </view>
        <view class="relative-card__info">
          <text class="relative-card__name">{{ relative.name }}</text>
          <text class="relative-card__quote">“{{ relative.quote }}”</text>
        </view>
        <text class="relative-card__hint">查看模式串对比</text>
      </view>
      <text v-else class="placeholder">暂无灵魂近亲</text>
    </view>

    <view class="actions">
      <view class="btn-primary actions__primary" @tap="goPoster">生成分享海报</view>
      <!-- #ifdef MP-WEIXIN -->
      <button class="btn-ghost actions__secondary share-button" open-type="share">
        分享给好友
      </button>
      <!-- #endif -->
      <view class="actions__row">
        <view class="btn-ghost actions__secondary" @tap="restartTest">再测一次</view>
        <view
          class="btn-ghost actions__secondary"
          :class="{ actions__disabled: !canSwitchPool }"
          @tap="handleSwitchPool"
        >
          {{ switchLabel }}
        </view>
      </view>
      <text v-if="result?.easterLocked" class="actions__hint">隐藏角色锁定，不可切换对照池</text>
    </view>

    <!-- #ifdef H5 -->
    <view class="share-fab btn-primary" @tap="handleCopyShare">分享</view>
    <!-- #endif -->

    <view v-if="relativeModalOpen" class="modal-mask" @tap="closeRelativeModal">
      <view class="modal card-sticker" @tap.stop>
        <text class="modal__title">模式串对比</text>
        <view class="modal__row">
          <text class="modal__label">你</text>
          <text class="modal__pattern">{{ result?.pattern || '—' }}</text>
        </view>
        <view class="modal__row">
          <text class="modal__label">{{ mainName }}</text>
          <text class="modal__pattern">{{ result?.main.pattern || '—' }}</text>
        </view>
        <view v-if="relative" class="modal__row">
          <text class="modal__label">{{ relative.name }}</text>
          <text class="modal__pattern">{{ relative.pattern || '—' }}</text>
        </view>
        <view class="btn-primary modal__button" @tap="closeRelativeModal">知道了</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import BackgroundDecor from '../../components/background/BackgroundDecor.vue'
import RadarChart from '../../components/radar/RadarChart.vue'
import QuoteBubble from '../../components/quote-bubble/QuoteBubble.vue'
import { characterRadarValues } from '../../core/engine'
import { dominantDimensionOf } from '../../core/dominant-dimension'
import { homePlaceholderClass } from '../../core/home'
import { useQuizStore } from '../../stores/quiz'
import { DIMENSIONS, DIMENSION_LABELS } from '../../types'
import { characterPortraitPath } from '../../utils/character-asset'
import { getHeadCropLayout } from '../../utils/head-crop'
import { logImageEnvironment, reportImageError } from '../../utils/image-diagnostic'
import { getSafeAreaTopStyle } from '../../utils/safe-area'
import { copyShareLink, createShareMessage } from '../../utils/share'

const quiz = useQuizStore()
const safeAreaStyle = getSafeAreaTopStyle()
const headCropLayout = getHeadCropLayout()
const headCropStyle = {
  width: `${headCropLayout.scale * 100}%`,
  height: `${headCropLayout.scale * 100}%`,
  left: `${headCropLayout.x}%`,
  top: `${headCropLayout.y}%`
}
const result = computed(() => quiz.result)

const RESULT_STICKER_SPOTS = [
  { left: '0px', top: '80px', rotate: '-10deg', delay: '0s', size: '96rpx', opacity: 0.6 },
  { left: '86%', top: '70px', rotate: '10deg', delay: '0.5s', size: '96rpx', opacity: 0.55 },
  { left: '0px', top: '230px', rotate: '8deg', delay: '1s', size: '96rpx', opacity: 0.6 },
  { left: '86%', top: '220px', rotate: '-8deg', delay: '1.4s', size: '96rpx', opacity: 0.55 },
  { left: '0px', top: '370px', rotate: '10deg', delay: '0.3s', size: '96rpx', opacity: 0.5 },
  { left: '86%', top: '360px', rotate: '-10deg', delay: '1.8s', size: '96rpx', opacity: 0.5 }
]

const resultTheme = computed(() =>
  result.value?.main.pattern ? dominantDimensionOf(result.value.main.pattern) : 'presence'
)
const relativeModalOpen = ref(false)
const portraitErrors = ref<Record<string, boolean>>({})
const mainPortraitError = ref(false)

watch(
  () => result.value?.main.id,
  () => {
    mainPortraitError.value = false
  }
)

const mainName = computed(() => result.value?.main.name ?? '待揭晓')
const mainId = computed(() => result.value?.main.id ?? '')
const archetype = computed(() => result.value?.main.archetype ?? '灵魂角色')
const source = computed(() => result.value?.main.source ?? '—')
const quote = computed(() => result.value?.main.quote ?? '')
const quoteExtra = computed(() => result.value?.main.quoteExtra ?? '')
const tags = computed(() => result.value?.main.tags ?? [])
const interpretations = computed(() => result.value?.main.interpretation ?? [])
const parallelUniverse = computed(() => result.value?.main.parallelUniverse ?? '')
const relative = computed(() => result.value?.relative ?? null)

const userValues = computed(() =>
  DIMENSIONS.map((dimension) => result.value?.dimensionScores[dimension] ?? 0)
)
const characterValues = computed(() =>
  result.value ? characterRadarValues(result.value.main) : []
)

const scoreRows = computed(() =>
  DIMENSIONS.map((dimension) => ({
    dimension,
    alias: DIMENSION_LABELS[dimension].alias,
    score: result.value?.dimensionScores[dimension] ?? 0,
    band: result.value?.bands[dimension] ?? 'L'
  }))
)

const firstSentence = computed(() => splitFirstSentence(interpretations.value[0] ?? ''))

const canSwitchPool = computed(() => Boolean(result.value && !result.value.easterLocked))
const switchLabel = computed(() => (quiz.switchedPool ? '切回原版' : '切换对照池'))

onLoad(() => {
  logImageEnvironment()
  quiz.restore()
  if (!quiz.result && quiz.isComplete) {
    quiz.finalize()
  }
})

onShareAppMessage(() => createShareMessage(mainName.value))

function splitFirstSentence(text: string): { first: string; rest: string } {
  const match = text.match(/^(.+?[。！？!?])(.*)$/s)
  if (!match) return { first: text, rest: '' }
  return { first: match[1], rest: match[2] }
}

function handleSwitchPool(): void {
  if (canSwitchPool.value) {
    quiz.switchPool()
  }
}

function restartTest(): void {
  quiz.reset()
  uni.reLaunch({ url: '/pages/home/index' })
}

function goPoster(): void {
  if (result.value) {
    uni.navigateTo({ url: '/pages/poster/index' })
  }
}

function openRelativeModal(): void {
  if (relative.value) relativeModalOpen.value = true
}

function closeRelativeModal(): void {
  relativeModalOpen.value = false
}

function handlePortraitError(id: string, event: unknown): void {
  portraitErrors.value[id] = true
  reportImageError(`result-relative-${id}`, event)
}

function handleMainPortraitError(event: unknown): void {
  mainPortraitError.value = true
  reportImageError(`result-main-${mainId.value}`, event)
}

async function handleCopyShare(): Promise<void> {
  const copied = await copyShareLink()
  uni.showToast({
    title: copied ? '链接已复制，快发给损友看看' : '复制失败，长按地址自己复制嘛',
    icon: 'none'
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: var(--safe-top) 32rpx calc(env(safe-area-inset-bottom) + 180rpx);
  box-sizing: border-box;
  background-color: var(--cbti-bg);
  position: relative;
  overflow-x: hidden;
}

.identity,
.section,
.actions,
.share-fab,
.modal-mask {
  position: relative;
  z-index: 1;
}

.identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  text-align: center;
  transform-origin: center;
  animation: identity-reveal 500ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes identity-reveal {
  from {
    transform: scale(0.8) rotate(-3deg);
  }

  to {
    transform: scale(1) rotate(0);
  }
}

.relative-card__portrait {
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 4rpx solid #1a1a2e;
  overflow: hidden;
}

.relative-card__portrait-image {
  position: absolute;
  display: block;
}

.identity__bubble {
  align-self: center;
  max-width: 560rpx;
}

.identity__portrait-card {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 500rpx;
  height: 540rpx;
  padding: 16rpx;
  box-sizing: border-box;
  overflow: hidden;
  transform: rotate(-1.5deg);
}

.identity__portrait-image {
  width: 100%;
  height: 100%;
}

.identity__portrait-placeholder {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.identity__portrait-placeholder-text {
  font-size: 120rpx;
  font-weight: 900;
}

.identity__archetype {
  font-size: 32rpx;
  font-weight: 700;
}

.identity__name {
  font-size: 56rpx;
  font-weight: 900;
}

.identity__source {
  font-size: 24rpx;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-top: 48rpx;
}

.section__title {
  font-size: 32rpx;
  font-weight: 700;
}

.score-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.score-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.score-row__alias {
  width: 120rpx;
  flex: none;
  font-size: 24rpx;
  font-weight: 700;
}

.score-row__track {
  flex: 1;
  height: 16rpx;
  border-radius: 999rpx;
  background-color: rgba(26, 26, 46, 0.12);
  overflow: hidden;
}

.score-row__fill {
  height: 100%;
  border-radius: 999rpx;
  transition: width 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.score-row__score {
  width: 88rpx;
  flex: none;
  font-size: 24rpx;
  font-weight: 700;
  text-align: right;
}

.score-row__band {
  display: inline-block;
  width: 48rpx;
  height: 40rpx;
  flex: none;
  border-radius: 999rpx;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 40rpx;
  text-align: center;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tags__item {
  max-width: 100%;
}

.placeholder {
  font-size: 24rpx;
  color: rgba(26, 26, 46, 0.55);
}

.interpretation__paragraph {
  font-size: 28rpx;
  line-height: 1.7;
}

.interpretation__pink {
  color: #ff5c8a;
  font-weight: 700;
}

.universe-card {
  padding: 24rpx 32rpx;
}

.universe-card__text {
  font-size: 28rpx;
  line-height: 1.7;
}

.relative-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
}

.relative-card__portrait {
  width: 96rpx;
  height: 96rpx;
}

.relative-card__portrait-text {
  font-size: 40rpx;
  font-weight: 900;
}

.relative-card__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8rpx;
  min-width: 0;
}

.relative-card__name {
  font-size: 32rpx;
  font-weight: 800;
}

.relative-card__quote {
  font-size: 24rpx;
  line-height: 1.6;
}

.relative-card__hint {
  flex: none;
  font-size: 24rpx;
  text-decoration: underline;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  margin-top: 48rpx;
}

.actions__primary {
  width: 480rpx;
  padding: 24rpx 0;
  font-size: 32rpx;
  font-weight: 800;
  text-align: center;
}

.actions__row {
  display: flex;
  gap: 24rpx;
}

.actions__secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 220rpx;
  padding: 16rpx 24rpx;
  font-size: 28rpx;
  font-weight: 700;
  text-align: center;
}

.share-button {
  margin: 0;
  line-height: 1;
}

.share-button::after {
  border: none;
}

.actions__disabled {
  opacity: 0.45;
}

.actions__hint {
  color: rgba(26, 26, 46, 0.45);
  font-size: 22rpx;
}

.share-fab {
  position: fixed;
  right: 24rpx;
  bottom: calc(env(safe-area-inset-bottom) + 48rpx);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  font-size: 28rpx;
  font-weight: 800;
}

.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
  background-color: rgba(26, 26, 46, 0.45);
}

.modal {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  width: 100%;
  max-width: 560rpx;
  padding: 32rpx;
}

.modal__title {
  font-size: 32rpx;
  font-weight: 800;
  text-align: center;
}

.modal__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.modal__label {
  font-size: 24rpx;
  font-weight: 700;
}

.modal__pattern {
  font-size: 24rpx;
  font-weight: 800;
}

.modal__button {
  padding: 16rpx 0;
  font-size: 28rpx;
  font-weight: 800;
  text-align: center;
}
</style>
