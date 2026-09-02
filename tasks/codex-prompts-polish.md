# tasks/codex-prompts-polish · 视觉润色批次 Codex 指令（P01–P10）

> 任务定义见 [polish-tasks.md](polish-tasks.md)；规格依据 specs/45-visual-polish.md 及 20/40/55/70/50-pages 修订。
> 按编号顺序逐条发送；每条跑完全部门禁再发下一条。P05 前必须完成 P01/P03/P04；P06 前必须完成 P01/P03/P04；P07 前必须完成 P05/P06；P10 前必须完成 P08。

---

## P01 · 立绘 H5 dev 链路修复（bug 优先）

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P01 · 立绘 H5 dev 链路修复（定义见 tasks/polish-tasks.md P01）。
背景与根因：54 张立绘在 src/pkg-characters/characters/（MP 分包 + H5 build 由 vite.config.ts 的 copyCharacterAssets 插件拷入产物，两条链路正常）；但 uni-app dev:h5 开发服务器不服务该目录——请求 /pkg-characters/characters/char-01-male.webp 命中 SPA fallback 返回 200 text/html 假成功，<image> 解码失败触发 @error，首页轮播/结果页身份证/灵魂近亲卡全部退回首字符占位（已实测确认 content-type=text/html）。
必读：vite.config.ts、src/utils/character-asset.ts、specs/70-assets.md §5。

要点：
1. vite.config.ts 新增 dev-only 插件（apply: 'serve'）：configureServer 中用 node:fs / node:path 把 /pkg-characters/* 映射到项目内 src/pkg-characters/* 并流式返回；Content-Type 按扩展名（.webp→image/webp，.png→image/png，.jpg/.jpeg→image/jpeg）；路径穿越防护（resolve 结果必须 startsWith 目标根目录，否则 403）；文件不存在必须 next()，绝不允许返回 index.html
2. 不新增任何依赖；不改 src/utils/character-asset.ts（路径契约不变）；不动 copyCharacterAssets（build 链路保持现状）
3. 验证：起 pnpm dev:h5 → curl -s -o /dev/null -w '%{content_type}' http://localhost:<端口>/pkg-characters/characters/char-01-male.webp 必须输出 image/webp（端口从 dev 启动日志取）→ 验证完杀掉 dev 进程，不留后台
4. 目视验收：dev 模式下首页轮播立绘、结果页身份证立绘、灵魂近亲卡立绘均真实渲染（不再是圆形首字符占位）

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + curl 验证输出原文 + 三处立绘渲染确认 + Spec 未覆盖决策登记。
```

---

## P02 · 雷达图标签溢出修复（bug）

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P02 · 雷达图标签溢出修复（定义见 tasks/polish-tasks.md P02）。
根因：src/components/radar/draw-radar.ts 的 LABEL_MARGIN=44 固定，维度标签按象限 left/right 对齐绘制时，长标签（如「锋芒度 10.0」约 6 个全角位）伸出画布边缘被裁。用户实测截图：左侧分数与右侧标签各被裁掉一半。
必读：specs/55-components/radar-chart.md（§2/§3/§8 已更新为「标签必须完整落在画布内」）、src/components/radar/draw-radar.ts、src/components/radar/RadarChart.vue、src/components/radar/__tests__/。

要点：
1. 把标签 + 图例布局抽成纯函数（如 computeRadarLayout(size, labels, characterName)）：输入画布边长与文案，输出每个标签/图例的锚点、对齐与包围盒；宽度用 ctx.measureText 量取（纯函数内注入量宽函数，测试时 mock）
2. labelMargin 自适应：默认 44；若侧向最宽标签 + 12px 余量更大则取大者，重算 radius = size/2 − labelMargin；再 clamp 标签锚点兜底，保证每个包围盒完整落在 [0, size] 内
3. 单测：覆盖 size ∈ {280, 320} 与最长文案（量词名 3 字 + 分数 10.0），断言 5 个标签与图例包围盒全部 ∈ [0, size]
4. 不改视觉样式（颜色/线宽/层序/动画一律不变）；海报复用 drawRadar 的路径同步受益，确认海报页无回归
5. 目视验收：H5 结果页 320px 画布下，五维标签 + 分数 + 图例完整可见，无裁切

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 修复前后标签锚点/包围盒对比说明 + 单测覆盖点 + 目视确认。
```

---

## P03 · 角色字段扩展：brief + quoteExtra

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P03 · 角色字段扩展 brief + quoteExtra（定义见 tasks/polish-tasks.md P03）。
必读：specs/20-data-schema.md §1–§2（已含新字段契约）、specs/60-content-tone.md、src/types/index.ts、src/data/schemas.ts、src/data/characters.ts、src/data/__tests__/。

要点：
1. src/types/index.ts Character 增加：brief: string（一句话简介，≤24 字）、quoteExtra: string（副台词/第二句梗，≤30 字）——与 specs/20 §1 逐字一致
2. src/data/schemas.ts characterSchema 同步加 Zod 校验（brief: z.string().min(1).max(24)；quoteExtra: z.string().min(1).max(30)）；assertContentComplete 纳入两字段非空校验
3. src/data/characters.ts 54 个角色全量回写（原子交付，不留半填充状态）：
   - brief = 16personalities 类型描述式的一句人设，≤24 字，旁观视角，带梗感（语气见 specs/60）
   - quoteExtra = 该角色另一句名台词或梗延展，≤30 字，不与 quote 语义重复
4. 修通所有受影响的测试与 fixtures；pnpm test 必须 54 角色内容完整度全绿
5. 不许改动 pattern / archetypeId / 匹配引擎相关字段

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + brief 与 quoteExtra 各抽 5 条示例 + 「54 角色两字段全绿」确认 + Spec 未覆盖决策登记。
```

---

## P04 · QuoteBubble 台词气泡组件

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P04 · QuoteBubble 台词气泡组件（定义见 tasks/polish-tasks.md P04；组件契约：specs/45-visual-polish.md §4）。
前置：P03 已完成并全绿。必读：specs/45 §4、specs/40-design-system.md §2/§4、src/pages/result/index.vue（现有 .quote-bubble 样式是蓝本）、uno.config.ts。

要点：
1. 新建 src/components/quote-bubble/QuoteBubble.vue：props { quote: string; quoteExtra?: string; placement?: 'top-right' | 'bottom'，默认 'bottom' }
2. 样式 = 漫画对话框：白底 + 2px ink 描边 + 圆角 24rpx + 硬阴影（复用 card-sticker 体系）；主台词 28rpx/700；quoteExtra 存在时第二行 24rpx cbti-pink；尾巴用 CSS 旋转方块（抽自已有的 quote-bubble__tail 实现）：placement=top-right 时尾巴在气泡左下指向立绘，bottom 时尾巴朝上居中
3. 边界：max-width 560rpx；word-break: break-all；主台词最多 2 行、副台词 1 行，超出省略号
4. 本任务只做组件 + 把结果页现有独立气泡替换为 QuoteBubble（placement=bottom）验证视觉一致；「叠立绘」布局属于 P05/P06，不做
5. 文案为空时的「绝赞撰写中…」占位逻辑保留在页面侧，不进组件

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 两种 placement 的视觉描述 + 30 字长文案不溢出自查 + Spec 未覆盖决策登记。
```

---

## P05 · 首页轮播卡改版（16personalities 式）

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P05 · 首页轮播卡改版（定义见 tasks/polish-tasks.md P05；结构契约：specs/45-visual-polish.md §5）。
前置：P01/P03/P04 已完成并全绿。必读：specs/45 §5、specs/50-pages/home.md、src/pages/home/index.vue、src/core/home.ts、src/components/quote-bubble/QuoteBubble.vue。

参考 16personalities.com/personality-types 的类型卡——立绘为绝对主角，文字层级 = 类型名 → 一句描述。要点：
1. 轮播卡改竖版贴纸卡（高 560rpx，margin 16rpx 24rpx），自上而下：立绘区（白底贴纸方卡：ink 描边 + 硬阴影 + -1.5deg 微倾，立绘 aspectFill 充满，高 300rpx）→ 灵魂原型名（H2 级，如「逆袭枭雄」）→ 角色名 · 出处（Caption 级，如「甄嬛 · 甄嬛传」）→ brief 一句简介（Body 级一行，≤24 字）
2. QuoteBubble（placement=top-right，quote + quoteExtra）叠在立绘区右上角，与立绘交叠 -16rpx，z-index 高于立绘
3. 立绘 <image> 的 @error 首字符占位降级逻辑迁移保留，不许删
4. swiper 属性（autoplay 3s / circular / indicator-dots）与 getHomeCarouselCharacters 选取逻辑不变；首页品牌区 / 按钮区 / 底部说明不动
5. 小屏（320px 宽）不溢出：原型名 + 简介单行省略兜底

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + H5/MP 两端轮播卡视觉描述（立绘/气泡/文字层级）+ Spec 未覆盖决策登记。
```

---

## P06 · 结果页身份证区改版

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P06 · 结果页身份证区改版（定义见 tasks/polish-tasks.md P06；契约：specs/45-visual-polish.md §6）。
前置：P01/P03/P04 已完成并全绿。必读：specs/45 §6、specs/50-pages/result.md §1（第 1 行已更新）、src/pages/result/index.vue。

要点：
1. 身份证区立绘从 200rpx 加大到 320rpx（圆形 + 4rpx ink 描边不变；@error 首字符占位降级保留）
2. 现有气泡改为 QuoteBubble placement=top-right，叠放在立绘右上（交叠 -16rpx，z-index 高于立绘）；quoteExtra 作为副台词第二行显示
3. 灵魂原型 / 角色名 / 出处的层级与文案不变；揭晓动效（identity-reveal）保留
4. 页面其余 7 个区块与全部交互（切换性别版/近亲弹窗/分享）一律不动
5. 小屏（320px 宽）气泡不超出视口

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + H5/MP 身份证区视觉描述 + 小屏不溢出自查 + Spec 未覆盖决策登记。
```

---

## P07 · 立绘 CSS 动画库

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P07 · 立绘 CSS 动画库（定义见 tasks/polish-tasks.md P07；契约：specs/45-visual-polish.md §7）。
前置：P05/P06 已完成并全绿。必读：specs/45 §7、specs/40-design-system.md §5、uno.config.ts、src/pages/home/index.vue、src/pages/result/index.vue。

要点：
1. uno.config.ts 沉淀 3 个 shortcuts：anim-pop-in（scale 0.8 + rotate -3deg → 归位，500ms ease-cbti-bounce both）、anim-float（translateY 0→-8rpx→0，3s ease-in-out infinite）、anim-wiggle（hover 时 rotate ±2deg，200ms）
2. 只用 transform/opacity（MP 兼容）；H5 端加 @media (prefers-reduced-motion: reduce) 关闭 float/wiggle 循环（pop-in 保留静帧）
3. 应用：首页轮播立绘 = anim-pop-in + anim-float；结果页身份证立绘 = pop-in 完成后接 float（animation-delay 或类叠加实现，与现有 identity-reveal 不冲突）；灵魂近亲卡立绘 = anim-float
4. 禁止新增任何滚动触发动效；Canvas 动画（雷达图/海报）不在本任务范围
5. MP 端逐条确认动画生效（transform 动画在小程序 <view>/<image> 上可用）

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 动画在三处的应用说明 + MP 兼容性确认 + Spec 未覆盖决策登记。
```

---

## P08 · 维度主题系统

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P08 · 维度主题系统（定义见 tasks/polish-tasks.md P08；契约：specs/45-visual-polish.md §1–§2）。
必读：specs/45 §1–§2、specs/40-design-system.md §2、uno.config.ts、src/types/index.ts、src/pages/quiz/index.vue、src/pages/result/index.vue、src/core/（模式串与计分）。

要点：
1. 落地 5 套 data-theme 主题（presence/cognition/emotion/order/endurance）+ 默认主题：CSS 变量 --cbti-bg / --cbti-theme 定义在全局样式，:root[data-theme='xx'] 覆盖；新令牌 cbti-orange #FF8A4C 注册进 uno.config.ts
2. 新纯函数 src/core/dominant-dimension.ts：dominantDimensionOf(pattern: string): Dimension，规则 = specs/45 §2（H 最多者胜 → 并列按 DIMENSIONS 固定顺序取首 → 无 H 看 M → 全 L 取 presence）；配单测（含并列、无 H、全 L 用例）
3. 答题页：页面根 view 绑定 data-theme = 当前题 dimension，换题 background-color 300ms 过渡
4. 结果页：data-theme = dominantDimensionOf(result.main.pattern)
5. 首页/加载页/海报页保持默认主题；海报 canvas 绘制色不改；雷达图双线颜色不改
6. 页面背景消费 var(--cbti-bg)，组件内不写死主题色；现有 bg-cbti-paper 页面背景用法逐个替换为变量消费（卡片白底等不依赖页面背景的保持不变）

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 五套主题在答题/结果页的视觉描述 + dominantDimensionOf 单测用例清单 + Spec 未覆盖决策登记。
```

---

## P09 · 漫画字体 ZCOOL KuaiLe

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P09 · 漫画字体 ZCOOL KuaiLe 接入（定义见 tasks/polish-tasks.md P09；契约：specs/45-visual-polish.md §3）。
必读：specs/45 §3、specs/40-design-system.md §3（已更新）、App.vue、uno.config.ts、src/pages/home/index.vue、src/pages/result/index.vue。

要点：
1. H5 端加载 ZCOOL KuaiLe：用 CSS 条件编译 /* #ifdef H5 */ … /* #endif */ 包裹 @import url('https://fonts.loli.net/css2?family=ZCOOL+KuaiLe&display=swap')；MP 端不得打包/请求该字体
2. 定义字体栈 shortcut（如 font-display-cbti）：'ZCOOL KuaiLe', -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif
3. 应用范围仅限展示位：首页品牌 Logo、轮播卡灵魂原型名、结果页角色名、QuoteBubble 台词、页面 H1；正文/题干/按钮保持系统字体
4. 先 curl 验证镜像可达：https://fonts.loli.net/css2?family=ZCOOL+KuaiLe&display=swap 返回 200 才开工；不可达则登记偏差并改用 Google Fonts 原始域名 fonts.googleapis.com
5. 字体加载失败/加载中布局不崩（font-display: swap；字号行高不依赖字体）

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 字体生效/回退两种状态说明 + MP 无字体网络请求确认 + 镜像可达性验证输出。
```

---

## P10 · 页面背景装饰层

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P10 · 页面背景装饰层（定义见 tasks/polish-tasks.md P10；契约：specs/45-visual-polish.md §8）。
前置：P08 已完成并全绿（主题变量可用）。必读：specs/45 §8、specs/40-design-system.md §1/§6、src/pages/home/index.vue、src/pages/quiz/index.vue、src/pages/result/index.vue。

要点：
1. 新建可复用装饰层（组件或 shortcut 组合）：position absolute inset-0、pointer-events none、z-index 0（内容层 z-index 1）、页面 overflow hidden 防横向滚动
2. 纹理用 CSS 绘制：radial-gradient 波点或 repeating-linear-gradient 斜纹，颜色 = var(--cbti-theme) 8–10% 透明度（换肤自动跟随，不用图片资源）
3. 贴纸层：每页 3–5 个 emoji（首页 🎭⚡🧠；答题页 💭🎯；结果页 🎉✨💥；可从 specs/40 §6 清单调整），48–72rpx，绝对定位散落四周、±15deg 旋转、anim-float 错峰 animation-delay、透明度 0.5–0.7；落位避开内容区
4. 应用到首页、答题页、结果页；加载页/海报页不动
5. 不得遮挡文字与按钮、不得降低可读性；AI 贴纸包不在本任务范围（后续可选增强，另行指令）

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 三页装饰层视觉描述 + 无遮挡/可读性自查 + Spec 未覆盖决策登记。
```

---

## ✅ 可选增强已落地：AI 贴纸包（2026-09-02）

16 张贴纸已入库 `src/static/decor/`（透明底 WebP 320×320，q=85，总计 221.8KB ≤ 300KB 预算）：
burst / star / bubble / bolt / tape / bang / dots / arrow / question / think / target / bulb / pencil / check / sweat / fire。
豆包「AI生成」水印按合规口径保留（specs/70 §5 注 2）。出图 prompts 见 content/illustration-prompts.md 装饰贴纸包章节；入库脚本 scripts/compress-decor.py（抠白底→裁边→320 画布→质量自降，白名单校验）。

---

## P11 · AI 贴纸包接线（替换 emoji 装饰层）

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P11 · AI 贴纸包接线，把 P10 的 emoji 背景贴纸层替换为 AI 贴纸图（契约：specs/45-visual-polish.md §8 可选增强，采用其中允许的「替换」方案；资产规格：specs/70-assets.md §5 装饰贴纸行）。
前置：P10 已完成并全绿；16 张贴纸已入库 src/static/decor/，命名 decor-{name}.webp，320×320 透明底，name ∈ burst / star / bubble / bolt / tape / bang / dots / arrow / question / think / target / bulb / pencil / check / sweat / fire。
必读：specs/45 §8、src/components/background/BackgroundDecor.vue、src/pages/home/index.vue、src/pages/quiz/index.vue、src/pages/result/index.vue、src/data/__tests__/character-assets.test.ts（资产清单测试模式参考）。

要点：
1. 新建 src/utils/decor.ts：导出 DECOR_NAMES（16 个贴纸名 as const 元组）、类型 DecorName、纯函数 decorAssetUrl(name: DecorName) 返回 `/static/decor/decor-${name}.webp`
2. BackgroundDecor.vue 改造：prop 由 emojis: string[] 改为贴纸名数组（DecorName[]）；<text> emoji 改为 <image :src="decorAssetUrl(name)" mode="aspectFit">，宽高沿用原 fontSize 档位（48–72rpx）；STICKER_SPOTS 落位/旋转/anim-float/错峰 animation-delay/透明度全部保留；@error 时隐藏该张贴纸即可（本地资产 + 测试兜底，不做 emoji 回退）；纹理层与容器样式不动
3. 三页调用方映射更新——首页 ['burst','star','arrow']；答题页 ['question','think','bulb','pencil','sweat']；结果页 ['bang','bolt','fire','check','dots']
4. 新建 src/data/__tests__/decor-assets.test.ts：遍历 DECOR_NAMES 断言文件存在且单张 ≤60KB（参考 character-assets.test.ts 模式）
5. 贴纸右下角浅色「AI生成」水印为合规保留（specs/70 §5 注 2），不得遮盖/裁剪；被替换掉的 emoji 装饰代码清理干净
6. z-index 0 + pointer-events none + 不遮挡文字按钮 + 不引入横向滚动：P10 的约束全部维持

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 三页贴纸落位描述 + H5/MP 双端 image 加载确认 + Spec 未覆盖决策登记。
```

---

## P12 · Review 修复包（贴纸落位 / 气泡遮挡 / 雷达图 / 答题护栏）

> 来源：2026-09-02 P11 后视觉走查（H5 宽屏截图，mobile 等比渲染）。四个问题各自独立，一次修完。

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P12 · Review 修复包，修复视觉走查发现的 4 个问题。逐项修复、逐项自验。
必读：specs/45-visual-polish.md §5/§6/§8、src/components/background/BackgroundDecor.vue、src/components/quote-bubble/QuoteBubble.vue、src/pages/quiz/index.vue、src/pages/result/index.vue、雷达图组件（src/components/radar/）及其单测。

【问题 1 · 答题页贴纸被遮挡】
现状：BackgroundDecor 的 STICKER_SPOTS 是全局固定 5 位（4%,10% / 82%,8% / 6%,72% / 80%,64% / 88%,40%）。答题页内容是全宽卡片流（题卡+4 选项卡），slot1/slot2（y=10%/8%）被题卡完全压在白底下不可见，slot5（88%,40%）被选项卡遮大半。5 张贴纸实际仅 2 张完整可见。
修复：STICKER_SPOTS 改为可被页面级 prop 覆盖（如 spots?: Spot[]，缺省用现有 5 位）。答题页传入专属落位：全部避开前 50% 的题卡/选项区，布置在选项区之下的空白带与两侧边缝，且避开底部 footer（高 64rpx + safe-area）。首页/结果页沿用默认位（首页已验证无遮挡，不动）。
自验：H5 分别在 375×667 与 390×844 视口截图，答题页 5 张贴纸全部完整可见、不压题卡/选项/按钮/进度条/「上一题」。

【问题 2 · 结果页台词气泡遮挡立绘（未按 spec 实现）】
现状：结果页 QuoteBubble 实际渲染在立绘正上方居中，且遮挡到立绘头顶/额头（目测交叠远超 spec 的 -16rpx）。specs/45 §6 要求：placement=top-right，气泡锚在立绘右上、尾巴在气泡左下指向立绘、与立绘交叠 -16rpx。
修复：结果页身份证区恢复 placement=top-right 实现；交叠严格 -16rpx；气泡 max-width 560rpx 不变。立绘脸部（头顶以下）不得被遮挡。首页轮播卡的 top-right 气泡已是正确示范，可对照。
自验：375×667 视口截图，气泡位于立绘右上、仅圆轮廓顶端背景区有 ≤16rpx 交叠，脸部完全无遮挡。

【问题 3 · 五维雷达图渲染异常】
现状：宽屏 H5（3840×1772 物理 / 1920 CSS px）下雷达区崩坏：维度标签以超大字号散落，五边形图形缩成一小块挤在右侧，「坚韧值 2」等 canvas 内文字巨大。用户此前在手机上也曾反馈「雷达图显示不完整」，疑似同一根因未根治或回归。
排查方向：canvas 位图尺寸（canvas.width/height）与 CSS 尺寸、以及 dpr 缩放的换算是否一致；标签/顶点坐标系与 canvas 实际像素坐标系是否同一套；uni.canvas 在 H5 的 width/height 属性赋值时机。修复目标：canvas 位图 = CSS 尺寸 × dpr，所有绘制在逻辑坐标系完成后统一 scale(dpr)。
自验：375×667 视口截图——五边形完整居中、5 个维度标签完整不裁切、双线（数值线+基准线）清晰；再补 750×1334 视口复验。现有 draw-radar 单测全绿，如改绘制函数签名需同步更新单测。

【问题 4 · 答题页进度显示/状态护栏】
现状（自动化点选暴露）：页面级 currentIndex 无上限保护，selectOption 对非当前题的 questionId 也会响应并推进显示进度，实测可出现 33/15 这种进度越过总题数的漂移状态（swiper current 越界 → 页面空白卡死）。真实用户因 swiper 裁剪 + disable-touch 大概率点不到非当前题，属加固项而非线上 P0。
修复（防御式，三处小改）：
a. selectOption 开头：questionId !== questions[currentIndex].id 时直接 return（只响应当前题）；
b. 推进时 currentIndex 封顶 questions.length - 1；quiz.isComplete 时只走 finishQuiz 分支；
c. 进度文本与进度条用 min(currentIndex + 1, questions.length) 封顶展示。
自验：为 quiz store/页面逻辑补单测（或现有 quiz.test.ts 加用例）：重复点击同一选项不膨胀、答满 15 题后 selectOption 不再改变状态；手工连点冒烟进度不超过 15/15。

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：4 个问题的改动清单与根因说明 + 375×667 与 390×844 两种视口下首页/答题页/结果页截图（答题页贴纸全可见、结果页气泡不遮脸、雷达图完整）+ 新增/更新单测清单 + Spec 未覆盖决策登记。
```

---

## P13 · 视觉迭代第二轮（气泡位置 / 立绘完整显示 / 贴纸加大加量 / 雷达图 / 注释样式）

> 来源：2026-09-02 用户移动端截图反馈（11 条）。本指令覆盖其中 8 条视觉改动；头部立绘资产管线见 P14。
> 注意：本指令对 P12 的两处决策做了**覆盖**——① 气泡不再用 top-right 交叠，改为立绘框上方独立行；② 答题页贴纸改为流内贴纸条（而非绝对定位落位）。同时需把 specs/45-visual-polish.md §4/§5/§6/§8 同步更新为新契约。

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P13 · 视觉迭代第二轮（定义见 tasks/polish-tasks.md 或本指令自包含执行；需同步更新 specs/45-visual-polish.md §4/§5/§6/§8 为新契约）。
必读：src/components/quote-bubble/QuoteBubble.vue、src/components/background/BackgroundDecor.vue、src/pages/home/index.vue、src/pages/quiz/index.vue、src/pages/result/index.vue、src/components/radar/（雷达组件与单测）、specs/45 §4-§8。

【1 · QuoteBubble 副台词样式统一 + 新增 placement='top'】
- 用户反馈：副台词（quoteExtra）粉色且字体与主台词不一致。改为：副台词与主台词完全相同样式——font-display-cbti（ZCOOL KuaiLe）、cbti-ink、28rpx/700；行数规则不变（主台词最多 2 行、副台词 1 行省略号）。
- 新增 placement='top'：气泡作为立绘框上方的独立行渲染，不与立绘/立绘卡交叠（gap 16rpx），尾巴朝下居中指向立绘；气泡宽度自适应内容、max-width 560rpx 不变。
- specs/45 §4 的 top-right 交叠方案作废，首页轮播与结果页统一切换为 placement='top'；top-right 实现保留与否由你决定（建议直接移除，避免死代码）。

【2 · 首页轮播卡：立绘完整显示】
- 现状：立绘 aspectFill 裁剪，部分角色头部被截断。改为 aspectFit 完整显示：立绘容器白底与立绘白底自然融合，容器高度按需加高（建议 420–480rpx，卡片总高自适应）；不再有角色被裁。
- 卡内结构自上而下：QuoteBubble(placement='top') → 立绘区 → 灵魂原型名 → 角色名·出处 → brief。立绘 anim-pop-in + anim-float 保留。

【3 · 结果页身份证区：去圆框 + 完整立绘居中】
- 移除 320rpx 圆形立绘框；改为白底贴纸卡（2px ink 描边 + 硬阴影 + -1.5deg 微倾，与轮播卡同款）居中放首屏中部，立绘 aspectFit 完整显示，卡高 ~520–560rpx。
- 结构自上而下：QuoteBubble(placement='top') → 立绘贴纸卡 → 灵魂原型 → 角色名 → 出处；揭晓动效（pop-in）保留；首字符占位降级逻辑可移除（立绘资产有测试兜底）。
- 结果页其余区块顺序与交互不动。

【4 · 贴纸加大加量（首页/结果页）】
- 贴纸尺寸整体 ×2：48–72rpx 档变为 96–144rpx 档；三页各 6 张。
- 首页 6 张：burst / star / arrow / bolt / dots / tape（沿用默认绝对定位思路，可新增第 6 个落位）。
- 结果页 6 张：bang / bolt / fire / check / dots / star（绝对定位，长页面分布在前两屏空白带）。
- 自验：375×667 与 390×844 两视口截图，两页贴纸不遮挡任何文字/按钮/立绘/雷达图、不引入横向滚动。

【5 · 答题页贴纸：改流内贴纸条】
- 现状：绝对定位贴纸离题目太远且曾被卡片遮挡。改为流内贴纸条（不再是绝对定位覆盖层）：
  a. 题卡上方贴纸条：进度条与题卡之间插入一行（高度 ~140rpx），左中右散布 3 张：question / think / target；
  b. 选项后贴纸条：4 个选项之后紧跟一行（在 swiper-item 的可滚动区内），左中右散布 3 张：bulb / pencil / sweat。
- 贴纸 96–120rpx，anim-float 错峰保留，pointer-events none。
- 答题页的 BackgroundDecor 只保留纹理层（不再传 decorNames/spots）；首页/结果页继续用 BackgroundDecor 绝对定位贴纸。
- 自验：两种视口下 6 张贴纸全部可见、不遮挡题干/选项/按钮/进度条/「上一题」，换题时贴纸条随题卡正常布局。

【6 · 五维雷达图修复（沿用 P12 问题 3，未根治）】
- 用户移动端截图确认：结果页「五维雷达图」标题下方整块空白，雷达图本体不可见/异常。
- 排查方向：canvas 位图尺寸（width/height 属性）与 CSS 尺寸与 dpr 的换算一致性；绘制坐标系与位图像素坐标系统一（建议逻辑坐标绘制完统一 scale(dpr)）；uni.canvas H5 端尺寸赋值时机（onReady 后获取节点信息再绘制）。
- 自验：375×667 与 750×1334 两视口截图——五边形完整居中、5 个维度标签完整不裁切、双线清晰；draw-radar 现有单测保持全绿，改签名需同步更新。

【7 · 「隐藏角色不分性别」注释样式】
- result/index.vue 的 .actions__hint：改为注释样式——系统正文字体（不用 display 字体）、22rpx、灰色（cbti-ink 45% 透明度；如已有 muted token 用 token），与正文区分。

【8 · spec 同步】
- specs/45-visual-polish.md §4（QuoteBubble：副台词样式统一 + placement='top' 取代 top-right 交叠）、§5（轮播卡 aspectFit + 新结构）、§6（结果页去圆框 + 贴纸卡立绘）、§8（贴纸 ×2 尺寸档、三页各 6 张、答题页流内贴纸条）同步改写为新实现。

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 两视口（375×667 / 390×844）下首页/答题页/结果页截图（立绘完整无裁切、气泡在立绘上方不遮挡、贴纸全可见、雷达图完整）+ spec 更新清单 + Spec 未覆盖决策登记。
```

---

## P14 · 头部立绘资产接线（圆形头像框专用）

> 前置：头部立绘资产已由 Pillow 管线生成完毕——`src/pkg-heads/heads/head-{01..28}-{male|female|universal}.webp` 共 54 张（320×320，q=75，总计 701KB，单张 ≤60KB），从 640 立绘的上半部中央裁切。脚本：scripts/make-headshots.py。
> 依赖关系：与 P13 都改 result/index.vue，**必须先完成 P13 并全绿后再执行 P14**。

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P14 · 头部立绘资产接线，让圆形头像框显示清晰的头部立绘（全身立绘缩进小圆里脸太小）。
前置：P13 已完成并全绿；54 张头部立绘已入库 src/pkg-heads/heads/（命名 head-{原型两位补零}-{male|female|universal}.webp，与 char-* 命名一一对应）。
必读：src/utils/character-asset.ts、src/pages/result/index.vue（灵魂近亲卡）、src/components/poster/（海报绘制）、src/data/__tests__/character-assets.test.ts、pages.json（分包注册）、specs/70-assets.md §5。

要点：
1. pages.json 注册新分包 src/pkg-heads（参照 src/pkg-characters 的注册方式）；H5/MP 双端路径可用性自验
2. src/utils/character-asset.ts 新增纯函数：characterHeadFileName(id) 与 characterHeadPath(id)（返回 `/pkg-heads/heads/head-*.webp`），与现有 portrait 函数同模式
3. 结果页「灵魂近亲」卡的圆形头像框改用头部立绘（relative 角色的 head 图）；全项目审计其它圆形头像框用法，一并替换为头部立绘
4. 海报 canvas 的立绘圆不引入新资产：改用 drawImage 源矩形裁剪（从 640 立绘取头部区域：sx=12.5%·w 附近、sy=2%·h、边长 60%·w——与 scripts/make-headshots.py 的裁切参数 CROP_SIDE=0.60 / CROP_TOP=0.02 对齐）后再画入圆形区域
5. 资产测试：character-assets.test.ts 增加（或新建 head-assets.test.ts）54 张头部立绘存在且单张 ≤60KB 的清单校验
6. specs/70-assets.md §5 增加头部立绘行（src/pkg-heads/heads/、320×320、≤60KB、总量 ≤800KB、由 scripts/make-headshots.py 从 640 立绘生成，裁切参数变更需重跑脚本）

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 灵魂近亲卡前后对比截图（375×667）+ 海报头部区域效果说明 + 分包体积报告（pkg-characters / pkg-heads 各自占用）+ Spec 未覆盖决策登记。
```

---

## P15 · 雷达图真实浏览器不可见 + 结果页贴纸压字

> 来源：2026-09-02 用户反馈。雷达图在 Codex 自验截图（375×667）中正常，但在真实浏览器 H5 中不可见——两处走查证据（用户 754×1570 截图整块空白只剩右边缘碎片；此前 3840×1772 宽屏截图标签巨大散落）共同指向 **dpr=2（Retina）触发**。

```
你在 /Users/work/learn/CBTI 仓库工作。任务：P15 · 修复两个问题。
必读：src/components/radar/（雷达组件与 draw-radar 及单测）、src/pages/result/index.vue、src/components/background/BackgroundDecor.vue、specs/45-visual-polish.md §8。

【问题 1 · 雷达图在真实浏览器 H5 不可见（dpr=2 触发）】
现状：你的自验截图（375×667，dpr=1 环境）雷达图正常；但真实 Chrome（Mac Retina，dpr=2）打开 H5，结果页「五维雷达图」标题下方整块空白，仅右边缘有一条绘制碎片。此前 3840×1772（dpr=2）宽屏截图中雷达标签以 2 倍字号散落——两证据共同指向 canvas 位图尺寸与 dpr 缩放不一致（疑似：位图按 dpr 放大但绘制坐标未统一换算，或相反，导致内容被缩放出可视区）。
排查与修复要求：
a. 审查 canvas 的 width/height 属性、style 宽高、context.scale(dpr) 的完整链路，确保「位图尺寸 = CSS 尺寸 × dpr，且全部绘制在逻辑坐标系（scale(dpr) 之后）」；
b. 审查绘制时机：onReady / nextTick / 节点信息（SelectorQuery）返回 0 尺寸的兜底——尺寸为 0 时必须有重试或降级日志，禁止静默画出 0 尺寸位图；
c. 验收必须在真实浏览器完成：pnpm dev:h5 起服务，Chrome 开 DevTools 设备模拟，dpr=1 与 dpr=2 各验一次，且必须从答题流程导航进结果页（而非只刷新直开）各验一次——四张截图（五边形完整居中、标签完整、双线清晰）作为交付物；
d. draw-radar 现有单测保持全绿；若改函数签名同步更新单测。

【问题 2 · 结果页贴纸压文字/徽章】
现状：2 倍尺寸（96–144rpx）后，fire 贴纸压在「灵魂标签」标题文字上，check 贴纸压在五维数值条右侧的 L/M 圆形徽章上。
修复：调整结果页 6 张贴纸（bang/bolt/fire/check/dots/star）的落位——全部避开 section 标题、数值条行、徽章、卡片与按钮，只落在真正的空白带（section 之间的间隙、首屏身份证区两侧的留白）。
自验：375×667 与 390×844 两视口截图（需滚动覆盖前两屏），逐张贴纸确认不与任何文字/徽章/卡片重叠；如某视口下找不到安全位，允许结果页减到 4–5 张并登记决策。

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：两个问题各自的根因说明 + 修复 diff 摘要 + 雷达图四种条件截图 + 贴纸两视口截图 + Spec 未覆盖决策登记。
```
