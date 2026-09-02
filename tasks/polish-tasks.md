# tasks/polish-tasks · 视觉润色批次（2026-09-01）

> 触发：用户 7 条反馈（① 首页单调 ② 轮播卡要 16personalities 式立绘卡 ③ 立绘不可见 ④ 台词两句嵌立绘 ⑤ 立绘 CSS 动画 ⑥ 雷达图显示不全 ⑦ 按题目/结果换肤背景）。
> 规格依据：**specs/45-visual-polish.md（新）** + 20/40/55/70/50-pages 相关修订（已先行落地）。
> Codex 指令全文见 [tasks/codex-prompts-polish.md](codex-prompts-polish.md)，按编号顺序逐条发送。
> 状态栏：`[ ]` 未开始 `[~]` 进行中 `[x]` 完成。

### P01 · 立绘 H5 dev 链路修复（bug） `[x]`
- **根因**：uni-app `dev:h5` 不服务 `src/pkg-characters/`——请求命中 SPA fallback 返回 `200 text/html` 假成功，`<image>` 解码失败走首字符占位（已实测确认）。build 产物由 vite `copyCharacterAssets` 插件拷贝，正常。
- **产出**：vite.config.ts 增加 dev-only 静态服务中间件；H5 dev 下立绘可见
- **验收**：dev 中 `curl` 立绘 URL 返回 `content-type: image/webp`；首页/结果页/近亲卡立绘真实渲染
- **依赖**：无

### P02 · 雷达图标签溢出修复（bug） `[x]`
- **根因**：`draw-radar.ts` `LABEL_MARGIN=44` 固定，侧向标签按 left/right 对齐绘制时伸出画布被裁（用户截图：标签与分数各被裁半）
- **产出**：标签/图例布局抽纯函数（measureText 量宽 + labelMargin 自适应 + clamp 兜底）；单测断言全部包围盒 ∈ [0, size]
- **验收**：specs/55 §8 全条（含新增第 6 条）；320px 画布下五标签 + 分数 + 图例完整可见
- **依赖**：无

### P03 · 角色字段扩展：brief + quoteExtra `[x]`
- **产出**：types/schemas/characters.ts 增加 `brief`（≤24 字一句简介）、`quoteExtra`（≤30 字副台词），54 条全量回写；`assertContentComplete` 纳入两字段
- **规则**：specs/20 §1–§2（已更新）、specs/60 语气；原子交付不留半填充
- **依赖**：无

### P04 · QuoteBubble 台词气泡组件 `[x]`
- **产出**：`src/components/quote-bubble/QuoteBubble.vue`（契约：specs/45 §4）；结果页现有独立气泡替换为组件（placement=bottom）验证一致性
- **依赖**：P03（字段）

### P05 · 首页轮播卡改版 `[x]`
- **产出**：16personalities 式竖版轮播卡（specs/45 §5）：立绘大卡 + 气泡叠右上 + 灵魂原型名 + 角色名·出处 + brief
- **依赖**：P01（立绘可见）、P03（brief/quoteExtra）、P04（气泡）

### P06 · 结果页身份证区改版 `[x]`
- **产出**：立绘 320rpx + QuoteBubble 叠立绘右上（specs/45 §6）
- **依赖**：P01、P03、P04

### P07 · 立绘 CSS 动画库 `[x]`
- **产出**：`anim-pop-in` / `anim-float` / `anim-wiggle` 三个 UnoCSS shortcuts + 应用（specs/45 §7）；transform/opacity only
- **依赖**：P05、P06

### P08 · 维度主题系统 `[x]`
- **产出**：5 套 data-theme 主题令牌 + `cbti-orange` 新令牌 + `dominantDimensionOf` 纯函数（含单测）+ 答题页按题换肤 + 结果页按主导维度换肤（specs/45 §1–§2）
- **依赖**：无（独立）；海报与雷达图不换肤

### P09 · 漫画字体 ZCOOL KuaiLe `[x]`
- **产出**：H5 CDN 字体（CSS 条件编译，MP 跳过；specs/45 §3）；应用仅展示位
- **依赖**：无

### P10 · 页面背景装饰层 `[x]`
- **产出**：装饰层（CSS 纹理随主题变色 + emoji 贴纸散落浮动）应用到首页/答题页/结果页（specs/45 §8）
- **依赖**：P08（主题变量）
- **可选增强（不进本批门禁）**：AI 贴纸包——用户用豆包按 specs/45 §8 出图 → Kimi 抠白底压缩入 `src/static/decor/` → 追加 Codex 接线指令
