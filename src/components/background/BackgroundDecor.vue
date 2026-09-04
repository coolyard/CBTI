<template>
  <view class="background-decor">
    <view class="background-decor__texture"></view>
    <view
      v-for="(sticker, index) in stickers"
      :key="index"
      class="background-decor__sticker-wrap"
      :style="{
        left: sticker.left,
        top: sticker.top,
        transform: `rotate(${sticker.rotate})`
      }"
    >
      <image
        v-if="!failedDecor[sticker.name]"
        class="background-decor__sticker anim-float"
        :style="{
          width: sticker.size,
          height: sticker.size,
          opacity: sticker.opacity,
          animationDelay: sticker.delay
        }"
        :src="decorAssetUrl(sticker.name)"
        mode="aspectFit"
        @error="handleError(sticker.name, $event)"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { decorAssetUrl, type DecorName } from '../../utils/decor'
import { reportImageError } from '../../utils/image-diagnostic'

type DecorSpot = {
  left: string
  top: string
  rotate: string
  delay: string
  size: string
  opacity: number
}

const props = withDefaults(
  defineProps<{
    decorNames?: DecorName[]
    spots?: DecorSpot[]
  }>(),
  {
    decorNames: () => [],
    spots: () => []
  }
)

const failedDecor = ref<Record<string, boolean>>({})

const DEFAULT_STICKER_SPOTS: DecorSpot[] = [
  { left: '3%', top: '6%', rotate: '-12deg', delay: '0s', size: '96rpx', opacity: 0.6 },
  { left: '85%', top: '4%', rotate: '10deg', delay: '0.5s', size: '108rpx', opacity: 0.55 },
  { left: '4%', top: '52%', rotate: '8deg', delay: '1s', size: '120rpx', opacity: 0.6 },
  { left: '84%', top: '48%', rotate: '-9deg', delay: '1.4s', size: '132rpx', opacity: 0.55 },
  { left: '6%', top: '88%', rotate: '14deg', delay: '0.3s', size: '144rpx', opacity: 0.5 },
  { left: '78%', top: '84%', rotate: '-11deg', delay: '1.8s', size: '108rpx', opacity: 0.5 }
]

const stickers = computed(() => {
  const spots = props.spots.length > 0 ? props.spots : DEFAULT_STICKER_SPOTS
  return props.decorNames.slice(0, spots.length).map((name, index) => ({
    name,
    ...spots[index]
  }))
})

function handleError(name: DecorName, event: unknown): void {
  failedDecor.value[name] = true
  reportImageError(`decor-${name}`, event)
}
</script>

<style scoped>
.background-decor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.background-decor__texture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, var(--cbti-theme) 2rpx, transparent 2rpx);
  background-size: 48rpx 48rpx;
  opacity: 0.1;
}

.background-decor__sticker-wrap {
  position: absolute;
  z-index: 0;
}

.background-decor__sticker {
  display: block;
}
</style>
