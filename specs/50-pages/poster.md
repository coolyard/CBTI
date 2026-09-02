# 50-pages/poster · 分享海报规范

> 路由：`pages/poster/index`。海报用 **Canvas 2D 统一绘制**（H5/MP 同一绘制函数），禁 html2canvas。
> 信息密度原则（PRD §九）：角色名 + 一句金句 + 雷达图 + 小程序码，刚好一条朋友圈。

## 1. 画布规格

- 逻辑尺寸 **750 × 1334**（即 375×667 @2x），导出处方可保存图片。
- 实现：离屏/页面 canvas 固定 750×1334 像素绘制；页面预览用 CSS 等比缩放展示。

## 2. 版面区块（坐标基于 750×1334）

| 区块 | 位置/尺寸 | 内容 |
|------|----------|------|
| 背景 | 全幅 | paper 底色 + 四角 ink 波点装饰（CSS 圆点阵画进 canvas） |
| 顶部品牌条 | y 48，居中 | `CBTI · 角色人格指标`，ink，32px bold |
| 立绘 | 居中，y 140，220×220 圆形 | 角色立绘 + 4px ink 描边 |
| 角色名 | y 420 居中 | Display 级 64px/900，ink |
| 灵魂原型 + 出处 | y 480 居中 | caption，ink @ 60% |
| 台词气泡 | y 540–680，宽 590 居中 | 漫画对话框（白底 3px ink 圆角 + 小尾巴），quote 40px |
| 迷你雷达 | 居中，y 720，360×360 | 复用 `drawRadar`（`animate: false`，隐藏图例与数值标签只留维度名） |
| 灵魂标签 | 雷达下方 | `#xxx` × 3–5，accent 色 |
| 底部条 | y 1180 起 | 左侧：静态小程序码 120×120；右侧文案「长按识别 · 测测你的灵魂角色」 |

## 3. 绘制实现

- `src/components/poster/draw-poster.ts` 导出 `drawPoster(ctx, result, assets)` 纯函数；页面组件与保存逻辑只是宿主。
- 立绘/小程序码图片加载：H5 用 `Image`，MP 用 `canvas.createImage()`；统一封装在 `src/utils/canvas-image.ts`（见 specs/80）。
- 文本换行：自实现 `wrapText(ctx, text, maxWidth)`（按字符宽度测量，中文逐字断行）。
- 导出：MP `uni.canvasToTempFilePath` → `uni.saveImageToPhotosAlbum`（处理授权拒绝，见 specs/92）；H5 `canvas.toDataURL('image/png')` → `<a download>`。
- 小程序码：MVP 为 `src/static/mp-code.png` 占位图，发布前替换为真实静态码。

## 4. 验收标准

- [ ] 导出图 750×1334，文字不虚、立绘不拉伸
- [ ] 台词超 30 字自动换行不破版
- [ ] 立绘缺失时使用占位圆（首字符 + 轮换底色）不阻断导出
- [ ] MP 拒绝相册授权后给出「去设置开启」引导，再次点击可重试
- [ ] H5 与 MP 导出视觉一致（抽 3 个角色对拍）
