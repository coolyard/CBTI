# 40 · 设计系统（文字版设计稿）

> 没有设计稿，本文件就是设计稿。AI 生成任何 UI 前必读；`uno.config.ts` / `uni.scss` 与本文件逐字同步。

## 1. 视觉概念：「灵魂漫研所」

傻雕漫画 + 贴纸质感。关键词：**粗描边、硬阴影、高饱和、弹跳动效、emoji 当图标用**。
参考气质：表情包贴纸、四格漫画、大富翁卡牌——读起来 0 成本，截图有传播欲。
**反面清单**（禁止）：毛玻璃、蓝紫渐变、细灰边框、淡入上移动效、卡片套卡片、居中 Hero + 三栏特性卡。

## 2. 色彩令牌

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--cbti-ink` | `#1A1A2E` | 描边、正文、硬阴影 |
| `--cbti-paper` | `#FFF6E5` | 全局背景（漫画纸色） |
| `--cbti-primary` | `#7C4DFF` | 灵魂紫：主按钮、用户雷达线、强调 |
| `--cbti-accent` | `#FFC224` | 梗黄：角色雷达线、标签、点缀 |
| `--cbti-pink` | `#FF5C8A` | 扎心粉：扎心解读标题、彩蛋元素 |
| `--cbti-mint` | `#3ED6A5` | 辅助：成功、进度条 |
| `--cbti-white` | `#FFFFFF` | 卡片底色 |
| 角色卡片轮换色 | `#B3E5FF` `#FFD1DC` `#D9F7C4` `#FFE8A3` | 首页轮播/近亲卡背景 |

规则：描边只用 `--cbti-ink`；投影一律硬阴影 `4px 4px 0 var(--cbti-ink)`；禁止柔模糊阴影。

## 3. 字体与排版

- 字体栈：`-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`；展示位（Logo/角色名/台词气泡/轮播原型名/H1）在 H5 端叠加 ZCOOL KuaiLe CDN 字体，MP 端只用系统字（加载契约见 specs/45 §3）。
- 中文禁止斜体；强调用**加粗 + 颜色/底色高亮**。

| 层级 | 字号/字重 | 用途 |
|------|----------|------|
| Display | 56rpx / 900 | 结果页角色名 |
| H1 | 40rpx / 800 | 页面标题 |
| H2 | 32rpx / 700 | 模块标题（扎心解读等） |
| Body | 28rpx / 400 | 正文、题干 |
| Caption | 24rpx / 400 | 辅助说明、标签 |

- 行高：正文 1.7；题干 1.6。

## 4. 间距、圆角、边框

- 间距基数 8rpx：常用 `8 / 16 / 24 / 32 / 48rpx`。
- 卡片：白底 + `2px solid ink` + `border-radius: 24rpx` + 硬阴影。
- 按钮：`border-radius: 999rpx`，`3px solid ink`，硬阴影 `4px 4px 0 ink`；按下态 `transform: translate(2px, 2px)` 且阴影缩为 `2px 2px 0`（贴纸被按扁）。
- 选项卡（答题页）：白底贴纸卡，选中态 = `--cbti-primary` 底 + 白字 + 轻微 `-1.5deg` 倾斜。

## 5. 动效

| 场景 | 参数 |
|------|------|
| 通用缓动 | `cubic-bezier(0.34, 1.56, 0.64, 1)`（回弹） |
| 选项选中 | 150ms 缩放 0.96 → 1 |
| 题目切换 | 250ms 横向滑出滑入 |
| 结果揭晓 | 卡片 500ms 从 0.8 放大至 1 + 3° 回弹旋转 |
| 雷达图 | 600ms 从中心生长（见 specs/55-components/radar-chart.md） |
| 加载页 | 文案打字机 40ms/字 + 省略号循环 |
| 立绘 | pop-in 入场 + float 呼吸浮动 + wiggle 悬停抖动（类名与参数见 specs/45 §7） |
| 页面换肤 | 答题页随题目维度、结果页随主角色主导维度切换 data-theme（主题令牌见 specs/45 §1–§2） |

原则：动效只为「揭晓感」和「按压感」服务；禁止无意义的滚动触发淡入。

## 6. 图标与图像

- 一律用 emoji 当图标（🎯⚡️🧠💔📏💪），禁止引入 icon 字体/图标库。
- 立绘：傻雕漫画风（规范见 specs/70-assets.md），卡片内圆形裁切 + ink 描边。

## 7. UnoCSS 落位

- `uno.config.ts` 中注册上述颜色为 theme colors（`cbti-ink` / `cbti-primary` …），注册 `shadow-sticker: 4px 4px 0 #1A1A2E` 等快捷方式。
- 页面以原子类为主；重复 ≥3 次的组合才沉淀为 `shortcuts`（如 `btn-primary`、`card-sticker`）。
