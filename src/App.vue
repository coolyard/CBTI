<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {
  // 数据完整性在 src/data/index.ts 顶层校验，fail-fast（specs/92 §1）
})
</script>

<style>
/* #ifdef H5 */
@import url('https://fonts.loli.net/css2?family=ZCOOL+KuaiLe&display=swap');
/* #endif */

:root,
page {
  --cbti-bg: #fff6e5;
  --cbti-theme: #7c4dff;
  background-color: var(--cbti-bg);
  color: #1a1a2e;
  font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  line-height: 1.7;
}

[data-theme='presence'] {
  --cbti-bg: #ffedf2;
  --cbti-theme: #ff5c8a;
}

[data-theme='cognition'] {
  --cbti-bg: #f0eaff;
  --cbti-theme: #7c4dff;
}

[data-theme='emotion'] {
  --cbti-bg: #fff0e6;
  --cbti-theme: #ff8a4c;
}

[data-theme='order'] {
  --cbti-bg: #e9f9f3;
  --cbti-theme: #3ed6a5;
}

[data-theme='endurance'] {
  --cbti-bg: #fff7dd;
  --cbti-theme: #ffc224;
}

.page > :not(.background-decor) {
  position: relative;
  z-index: 1;
}

@keyframes pop-in {
  from {
    transform: scale(0.8) rotate(-3deg);
  }

  to {
    transform: scale(1) rotate(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8rpx);
  }
}

@keyframes wiggle {
  0%,
  100% {
    transform: rotate(0);
  }

  25% {
    transform: rotate(-2deg);
  }

  75% {
    transform: rotate(2deg);
  }
}

/* #ifdef H5 */
@media (prefers-reduced-motion: reduce) {
  .anim-float,
  .anim-wiggle {
    animation: none !important;
  }
}
/* #endif */
</style>
