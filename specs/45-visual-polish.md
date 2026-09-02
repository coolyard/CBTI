# 45 · 视觉增强规范（主题 / 字体 / 台词气泡 / 立绘动画 / 背景装饰）

> 2026-09-01 视觉润色批次的唯一视觉依据（对应 tasks/polish-tasks.md P01–P10）。
> 与 specs/40 的分工：40 管基础设计令牌（色板/字号/圆角/硬阴影），本文件管**主题化换肤 + 立绘表现 + 装饰层**。冲突时 40 的基础规则不变，本文件为增量。

## 1. 维度主题（data-theme）

5 套主题对应 5 个维度。每套主题只覆盖两个变量：页面背景 `--cbti-bg` 与主题强调 `--cbti-theme`；`--cbti-ink` 恒定 `#1A1A2E`，描边/硬阴影语义不变。

| data-theme 值 | 维度（量词名） | `--cbti-bg` | `--cbti-theme` | 备注 |
|------|------|------|------|------|
| `presence` | 存在感 / 锋芒度 | `#FFEDF2` | `#FF5C8A`（cbti-pink） | 锋芒粉 |
| `cognition` | 认知力 / 执棋力 | `#F0EAFF` | `#7C4DFF`（cbti-primary） | 执棋紫 |
| `emotion` | 情感力 / 情感值 | `#FFF0E6` | `#FF8A4C`（**新令牌 cbti-orange**，注册进 uno.config.ts） | 热血橙 |
| `order` | 规则感 / 秩序感 | `#E9F9F3` | `#3ED6A5`（cbti-mint） | 秩序绿 |
| `endurance` | 持久力 / 坚韧值 | `#FFF7DD` | `#FFC224`（cbti-accent） | 坚韧黄 |

默认主题（无 data-theme）：`--cbti-bg: #FFF6E5`（cbti-paper），`--cbti-theme: #7C4DFF`。

应用规则：

- 首页 / 加载页 / 海报页：默认主题。
- 答题页：随当前题 `dimension` 切换页面根节点 `data-theme`；换题时 `background-color 300ms` 过渡。
- 结果页：按主角色主导维度（§2）切换 `data-theme`。
- **分享海报 canvas 不参与换肤**（绘制色固定，保证分享图一致性）；雷达图 primary/accent 双线颜色固定不变（双线语义 = 你 vs 角色）。
- 组件一律消费变量（如 `bg-[var(--cbti-bg)]` / UnoCSS 规则），禁止在组件里写死主题色；现有 `bg-cbti-paper` 页面背景逐个替换为变量消费。

## 2. 主导维度判定（dominantDimensionOf）

输入角色模式串（如 `H-H-M-L-H`，维度顺序见 specs/00 §2），输出一个 `Dimension`：

1. H 数量最多的维度胜；
2. H 数并列 → 按 `DIMENSIONS` 固定顺序（presence→cognition→emotion→order→endurance）取首个；
3. 无 H → 对 M 重复同样规则；全 L → 取 `presence`。

纯函数，落 `src/core/`，必须配单测（含并列、无 H、全 L 用例）。

## 3. 漫画字体（H5 only）

- 字体：**ZCOOL KuaiLe（站酷快乐体）**，免费可商用，Google Fonts 收录。
- 加载：H5 经 CDN `@import url('https://fonts.loli.net/css2?family=ZCOOL+KuaiLe&display=swap')`（loli.net 镜像，国内可达），用 CSS 条件编译 `/* #ifdef H5 */ … /* #endif */` 包裹——MP 端不打包、不请求；镜像不可达时登记偏差并改用 Google Fonts 原始域名。
- 字体栈：`'ZCOOL KuaiLe', -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`；`font-display: swap`；加载失败/MP 端自然回退系统字，布局不得因此崩坏（字号行高不变）。
- 应用范围（仅展示位）：品牌 Logo、轮播卡灵魂原型名、结果页角色名、QuoteBubble 台词、页面 H1。正文/题干/按钮保持系统字（可读性优先）。

## 4. 台词气泡组件（QuoteBubble）

契约：

```vue
<QuoteBubble :quote="quote" :quote-extra="quoteExtra" placement="top" />
```

- props：`quote: string`（≤30 字）；`quoteExtra?: string`（≤30 字副台词，可缺省）；`placement?: 'top' | 'bottom'`，默认 `'bottom'`。
- 结构：白底 + 2px ink 描边 + 圆角 24rpx + 硬阴影的漫画对话框；主台词与副台词统一为 `font-display-cbti`、cbti-ink、28rpx/700。
- 尾巴：CSS 旋转方块。`placement='top'`：气泡作为立绘上方独立行，不与立绘/立绘卡交叠（gap 16rpx），尾巴朝下居中指向立绘；`placement='bottom'`：气泡在立绘下方、尾巴朝上居中。
- 边界：气泡宽度自适应内容，`max-width 560rpx`；`word-break: break-all`；主台词最多 2 行、副台词 1 行，超出省略号。

## 5. 首页轮播卡（16personalities 式结构）

参考 16personalities.com/personality-types 的类型卡：**立绘为绝对主角**，文字层级 = 类型名 → 一句描述。
CBTI 轮播卡改为竖版贴纸卡（总高随内容自适应，约 800rpx；margin 16rpx 24rpx），自上而下：

1. **QuoteBubble**：`placement='top'`，位于立绘上方独立行。
2. **立绘区**：白底贴纸方卡（ink 描边 + 硬阴影 + `-1.5deg` 微倾），立绘 `aspectFit` 完整显示，高度 420rpx；`anim-pop-in + anim-float` 保留。
3. **灵魂原型名**：H2 级（如「逆袭枭雄」）。
4. **角色名 · 出处**：Caption 级（如「甄嬛 · 甄嬛传」）。
5. **一句简介 `brief`**：Body 级一行，≤24 字。

swiper 属性（autoplay 3s / circular / indicator-dots）与轮播选取逻辑 `getHomeCarouselCharacters` 不变；首页其余区块不动。

## 6. 结果页身份证区

- 移除圆形立绘框；改为白底贴纸卡（2px ink 描边 + 硬阴影 + `-1.5deg` 微倾），立绘 `aspectFit` 完整显示，卡高约 520–560rpx。
- 结构自上而下：`QuoteBubble`（placement='top'）→ 立绘贴纸卡 → 灵魂原型 → 角色名 → 出处。
- 揭晓动效（pop-in）保留；结果页其余 7 个区块顺序与交互不动。

## 7. 立绘 CSS 动画库

沉淀为 UnoCSS shortcuts（uno.config.ts），**只用 transform/opacity**（MP 兼容）：

| 类名 | 效果 | 参数 |
|------|------|------|
| `anim-pop-in` | 入场回弹：scale 0.8 + rotate -3deg → 归位 | 500ms `ease-cbti-bounce`，both |
| `anim-float` | 呼吸浮动：translateY 0 → -8rpx → 0 | 3s ease-in-out infinite |
| `anim-wiggle` | 悬停抖动：rotate ±2deg | 200ms（H5 hover 生效；MP 无 hover 自然无效，不单独处理） |

应用：首页轮播立绘 = `anim-pop-in` + `anim-float`；结果页身份证立绘 = pop-in 完成后接 float（animation-delay 或类叠加）；灵魂近亲卡立绘 = `anim-float`。
H5 端加 `@media (prefers-reduced-motion: reduce)` 关闭 float/wiggle 循环（pop-in 保留静帧）。
禁止新增任何滚动触发动效；Canvas 动画（雷达图/海报）不在本范围。

## 8. 背景装饰层

每个目标页面根节点下挂一个装饰层（`position absolute inset-0`、`pointer-events: none`、z-index 0，内容层 z-index 1，页面 `overflow: hidden`）：

- **纹理**：CSS 绘制——`radial-gradient` 波点 或 `repeating-linear-gradient` 斜纹，颜色用 `var(--cbti-theme)` 8–10% 透明度（换肤自动跟随）。
- **贴纸（AI 图）**：尺寸档 96–144rpx，首页/结果页各 6 张绝对定位散落；透明度 0.5–0.7，±15deg 旋转 + `anim-float` 错峰 delay；答题页不再使用绝对定位贴纸。
- **答题页流内贴纸条**：题卡上方与选项后方各插一行，每行 3 张贴纸（96–120rpx），`pointer-events: none`，随 swiper-item 正常滚动。
- 应用：首页、答题页、结果页。加载页/海报页不动。
- 不得遮挡文字与按钮、不得引入横向滚动。

**可选增强（不阻塞 P10）**：AI 贴纸包——用与立绘同风格前缀让豆包生成纯装饰贴纸（爆炸贴/星星/对话框/闪电/纸胶带），抠白底 → 透明 WebP 320×320 ≤60KB，入 `src/static/decor/`（总量 ≤300KB），替换或混搭 emoji 贴纸。验收同立绘管线（specs/70 §5）。
