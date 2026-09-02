import { defineConfig, presetUno } from 'unocss'

// 设计令牌唯一来源：specs/40-design-system.md（改动必须先改 spec）
export default defineConfig({
  presets: [presetUno()],
  safelist: ['bg-cbti-card-1', 'bg-cbti-card-2', 'bg-cbti-card-3', 'bg-cbti-card-4'],
  theme: {
    colors: {
      'cbti-ink': '#1A1A2E',
      'cbti-paper': '#FFF6E5',
      'cbti-primary': '#7C4DFF',
      'cbti-accent': '#FFC224',
      'cbti-pink': '#FF5C8A',
      'cbti-mint': '#3ED6A5',
      'cbti-orange': '#FF8A4C',
      'cbti-white': '#FFFFFF',
      'cbti-card-1': '#B3E5FF',
      'cbti-card-2': '#FFD1DC',
      'cbti-card-3': '#D9F7C4',
      'cbti-card-4': '#FFE8A3'
    },
    easing: {
      'cbti-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    fontFamily: {
      'display-cbti': "'ZCOOL KuaiLe', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    }
  },
  shortcuts: {
    'card-sticker':
      'bg-cbti-white border-2 border-solid border-cbti-ink rounded-[24rpx] shadow-sticker',
    'btn-primary':
      'bg-cbti-primary text-cbti-white border-[3px] border-solid border-cbti-ink rounded-[999rpx] shadow-sticker transition-all duration-150 ease-cbti-bounce active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#1A1A2E]',
    'btn-ghost':
      'bg-cbti-white text-cbti-ink border-[3px] border-solid border-cbti-ink rounded-[999rpx] shadow-sticker transition-all duration-150 ease-cbti-bounce active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#1A1A2E]',
    'tag-capsule':
      'inline-block bg-cbti-accent text-cbti-ink border-2 border-solid border-cbti-ink rounded-full px-4 py-1 text-[24rpx]',
    'shadow-sticker': 'shadow-[4px_4px_0_#1A1A2E]',
    'anim-pop-in': 'animate-[pop-in_500ms_cubic-bezier(0.34,1.56,0.64,1)_both]',
    'anim-float': 'animate-[float_3s_ease-in-out_infinite]',
    'anim-wiggle': 'hover:animate-[wiggle_200ms_ease-in-out]'
  }
})
