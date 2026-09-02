<template>
  <view class="quote-bubble card-sticker" :class="`quote-bubble--${placement}`">
    <text class="quote-bubble__quote font-display-cbti">{{ quote }}</text>
    <text v-if="quoteExtra" class="quote-bubble__extra font-display-cbti">{{ quoteExtra }}</text>
    <view class="quote-bubble__tail"></view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    quote: string
    quoteExtra?: string
    placement?: 'top' | 'bottom'
  }>(),
  {
    quoteExtra: '',
    placement: 'bottom'
  }
)
</script>

<style scoped>
.quote-bubble {
  position: relative;
  max-width: 560rpx;
  padding: 24rpx 32rpx;
  word-break: break-all;
}

.quote-bubble--bottom {
  margin-top: 16rpx;
}

.quote-bubble__quote {
  display: -webkit-box;
  overflow: hidden;
  color: #1a1a2e;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.quote-bubble__extra {
  display: block;
  overflow: hidden;
  margin-top: 8rpx;
  color: #1a1a2e;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.6;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quote-bubble__tail {
  position: absolute;
  width: 24rpx;
  height: 24rpx;
  background-color: #ffffff;
}

.quote-bubble--bottom .quote-bubble__tail {
  top: -12rpx;
  left: 50%;
  border-top: 2px solid #1a1a2e;
  border-left: 2px solid #1a1a2e;
  transform: translateX(-50%) rotate(45deg);
}

.quote-bubble--top .quote-bubble__tail {
  bottom: -12rpx;
  left: 50%;
  border-right: 2px solid #1a1a2e;
  border-bottom: 2px solid #1a1a2e;
  transform: translateX(-50%) rotate(45deg);
}
</style>
