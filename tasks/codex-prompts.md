# tasks/codex-prompts · Codex 逐条派活指令集

> 用法：按顺序逐条发给 Codex（DeepSeek V4 Pro）。每条指令自包含，新会话也能直接用。
> 铁律：一条没通过门禁，不要发下一条。所有指令已内置质量门禁：
> `pnpm format && pnpm lint && pnpm typecheck && pnpm test`（缺一不可）。
> 对应任务卡与验收清单见 [v1.0-tasks.md](./v1.0-tasks.md)。

---

## P0 · 环境体检（开工前先发这条）

```
你在 /Users/work/learn/CBTI 仓库工作。这是一个 Spec-Driven 的 UniApp + Vue3 + TS 项目。
先完整阅读 AGENTS.md 和 AI-CODING-GUIDE.md，然后只做体检，不改任何代码：
1. 执行 pnpm install && pnpm lint && pnpm typecheck && pnpm test
2. 执行 pnpm build:h5 和 pnpm build:mp-weixin
3. 告诉我：哪些命令通过、哪些失败（贴报错原文）、你对仓库结构的理解（100 字内）
如果全部通过，回复"体检全绿"并等待下一条指令。
```

---

## T06 · 设计令牌落地

```
继续在这个仓库工作。任务：T06 设计令牌落地（定义见 tasks/v1.0-tasks.md）。
必读：specs/40-design-system.md。
要求：
1. 逐字核对 uno.config.ts 与 src/uni.scss 是否和 specs/40 的颜色/阴影/动效令牌一致，不一致以 spec 为准修正（不许反向改 spec）
2. 在首页临时渲染一组样例（主按钮/幽灵按钮/贴纸卡/标签胶囊），验证 shortcuts 生效
3. 禁止新增依赖，禁止修改 specs/
完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test
交付：改动清单 + 任务卡验收自查 + Spec 未覆盖决策登记（没有就写"无"）。
```

---

## T07 · 首页

```
任务：T07 首页（定义见 tasks/v1.0-tasks.md）。
必读：specs/50-pages/home.md、specs/40-design-system.md、specs/00-glossary.md。
要点：
1. 区块顺序：品牌区 → 角色轮播（≥6 张，自动 3s 轮播可手动）→ 开始按钮 → 底部说明
2. 立绘缺失时用首字符圆形占位图（specs/40 §2 轮换色），轮播角色从 src/data/characters 读取
3. 有未完成进度时按钮变「继续上次测试」+ 副入口「重新开始」（store.restore 已内置）
4. 不做计数器（spec 明确砍掉）
完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test
交付：改动清单 + home.md §3 验收清单逐条自查 + Spec 未覆盖决策。
```

---

## T08 · 答题页

```
任务：T08 答题页（定义见 tasks/v1.0-tasks.md）。
必读：specs/50-pages/quiz.md、specs/30-scoring-algorithm.md、specs/40。
要点：
1. 状态机走 src/stores/quiz.ts（已实现，先读懂再用；发现 bug 改 store 并补测试，不许绕开）
2. 每题一屏，选中 250ms 后自动进下一题，支持返回上一题修改（回改会作废后续答案，见 store）
3. 顶部进度条 N/15 + mint 色动画；选项为贴纸卡，A/B/C/D 角标
4. 严禁渲染 seedTag / designNote / 任何分流元信息
5. 答满 15 题 → store.finalize() → uni.redirectTo 到 pages/loading/index
完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test
交付：改动清单 + quiz.md §4 验收自查 + Spec 未覆盖决策。
```

---

## T09 · 加载页

```
任务：T09 加载页（定义见 tasks/v1.0-tasks.md）。
必读：specs/50-pages/loading.md、specs/40 §5。
要点：
1. 打字机轮播三句文案（40ms/字，句间停 400ms），整体 2.2–3s
2. store.result.easterLocked 为 true 时第三句替换为「检测到异常灵魂波动…？」
3. 灵魂扫描动画用纯 CSS（禁 GIF）；result 未就绪循环等待，5s 超时强制跳结果页
完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test
交付：改动清单 + loading.md §3 验收自查 + Spec 未覆盖决策。
```

---

## T10 · 雷达图组件（核心难点，单独一条）

```
任务：T10 自研五维雷达图（定义见 tasks/v1.0-tasks.md）。
必读：specs/55-components/radar-chart.md（逐条实现，不允许打折扣）、specs/40、specs/92。
要点：
1. 纯绘制函数 drawRadar(ctx, size, data, opts) 放 src/components/radar/draw-radar.ts，与宿主组件分离（海报要复用）
2. canvas 用 <canvas type="2d"> + uni.createSelectorQuery 取 node；禁用旧版 createCanvasContext
3. DPR 缩放、600ms 回弹生长动画、标签象限自适应对齐、降级文字 UI，全部按 spec §2–§7
4. 在结果页先挂一个临时挂载点验证渲染（正式布局在 T11）
完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test
交付：改动清单 + radar-chart.md §8 五条验收逐条自查 + H5/MP 两端渲染效果描述。
```

---

## T11 · 结果页

```
任务：T11 结果页（定义见 tasks/v1.0-tasks.md）。
必读：specs/50-pages/result.md、specs/60-content-tone.md、specs/55、specs/40。
要点：
1. 8 个区块顺序固定（身份证→雷达图→数值条→标签→扎心解读→平行宇宙→灵魂近亲→操作区）
2. interpretation/parallelUniverse 为空时显示「绝赞撰写中…」占位，不报错（内容管线未完成前是常态）
3. 「切换性别版」调 store.switchPool()；彩蛋锁定态按钮置灰，提示「隐藏角色不分性别」
4. 「再测一次」store.reset() + reLaunch 回首页
5. MP 配置 onShareAppMessage（文案见 spec §3），H5 悬浮分享按钮复制链接
完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test
交付：改动清单 + result.md §4 验收自查 + Spec 未覆盖决策。
```

---

## T12 · 分享海报

```
任务：T12 分享海报（定义见 tasks/v1.0-tasks.md）。
必读：specs/50-pages/poster.md、specs/55、specs/80-platform-notes.md、specs/92。
要点：
1. drawPoster(ctx, result, assets) 纯函数放 src/components/poster/draw-poster.ts；版面坐标按 spec §2
2. 迷你雷达复用 T10 的 drawRadar（animate:false，隐藏图例/数值）
3. 图片加载跨端封装 src/utils/canvas-image.ts（H5 new Image / MP canvas.createImage）
4. 导出：MP canvasToTempFilePath → saveImageToPhotosAlbum（含授权拒绝引导）；H5 toDataURL → a[download]
5. 小程序码用 src/static/mp-code.png 占位；立绘缺失用首字符占位不阻断导出
完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test
交付：改动清单 + poster.md §4 验收自查 + H5/MP 导出效果描述。
```

---

## T13 · 分享链路收尾

```
任务：T13 分享链路（定义见 tasks/v1.0-tasks.md）。
必读：specs/80 §1、specs/50-pages/result.md §3、specs/92。
要点：
1. 抽 src/utils/share.ts：H5 复制链接（clipboard API + execCommand 兜底），MP onShareAppMessage/open-type=share
2. 跨端差异只允许条件编译或 utils 封装（specs/10 §4）
3. 分享失败给 specs/60 语气的 toast，不弹技术错误
完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 双端分享行为描述 + Spec 未覆盖决策。
```

---

## T14 · 集成自检（发这条前，你先人工跑过双端流程）

```
任务：T14 集成自检。
1. 通读 specs/50-pages/ 五份页面规范的验收清单，逐条核对当前实现，列出未达标项
2. 跑 pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin，确认全绿
3. 检查是否有 Spec 明令禁止的实现方式（ECharts/html2canvas/UI 组件库/新增未批准依赖）
4. 输出：未达标项清单 + 修复方案，等我确认后再动手改
```

---

## T15 · Review 修复包（回改死锁 + 海报气泡 + 揭晓动效）

```
你在 /Users/work/learn/CBTI 仓库工作。T06–T14 已完成并通过全部门禁；人工 Review 发现 4 个缺陷，逐条修复。除下列改动外不动任何其他文件；禁止新增依赖，禁止修改 specs/。
必读：specs/50-pages/quiz.md、specs/50-pages/poster.md、specs/50-pages/result.md §2、specs/40-design-system.md §5。

修复 1（P2 · 答题页回改死锁）
现状：src/pages/quiz/index.vue 的 selectOption 在 isSelected 时直接 return。用户「上一题」回到已答题后，点击当前已选中的选项（= 维持原答案直接前进）无响应，而 swiper 禁手动滑动、又无其他前进入口，页面卡死。
要求：点击当前题已选中项时不再 return，也不重新写 answer（不写数据、不截断），直接走同一套 250ms 定时器前进到「下一屏」。前进目标恒为当前屏 + 1（连退两题后维持原答案前进时不得跳屏）；advanceTimer 防连点保留；quiz.isComplete 时仍走 finishQuiz。点不同选项的截断重答行为保持不变（specs/50-pages/quiz.md「自动进题 + 可回改」语义不变）。

修复 2（P3 · 海报台词气泡缺小尾巴）
specs/50-pages/poster.md §2：「漫画对话框（白底 3px ink 圆角 + 小尾巴）」。
要求：src/components/poster/draw-poster.ts 的 drawQuoteBubble 在气泡顶部中央画一个指向上方角色名的小三角尾巴（方向与结果页 DOM 版 .quote-bubble__tail 一致）：白底填充 + 3px ink 描边，只描两条斜边，底边与气泡顶边融合不留线；整体仍在 y 540–680 区间内。

修复 3（P3 · 长台词溢出风险）
气泡区域被 spec 固定在 y 540–680（高 140），下方 y 720 是迷你雷达，不允许加高气泡。当前 40px 字号 / 50px 行高 / 542px 可用宽 ≈ 13 字每行，30 字台词需 3 行 = 150px，会溢出。
要求：wrapText 后排版行数 > 2 时，字号从 40px 降到 34px（行高 42px）重新排版；降级后仍 > 3 行时在第 3 行末尾截断加「…」。保证任意长度台词完整收进气泡。在 src/components/poster/__tests__/draw-poster.test.ts 补一条用例：≥30 字台词绘制不抛错且发生字号降级（可用 fake ctx 断言最终 ctx.font 切到 34px 档）。

修复 4（P3 · 结果页缺揭晓入场动效）
specs/50-pages/result.md §2：「区块 1 按 specs/40 §5『结果揭晓』动效入场，其余区块静态呈现（禁滚动触发）」。
要求：给结果页区块 1（.identity）加纯 CSS keyframes 入场动画：500ms，transform 从 scale(0.8) rotate(-3deg) 到 scale(1) rotate(0)，缓动 cubic-bezier(0.34, 1.56, 0.64, 1)，仅播放一次。其余区块保持静态，禁止加任何滚动触发效果。

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 四个修复点逐条自查（各附关键代码行号）+ Spec 未覆盖决策登记（没有就写"无"）。
```

---

## 补充规则

- **Codex 报"测试失败"时**：先让它贴失败原文。如果是它改坏了 → 让它修；如果它声称 spec 矛盾 → 拿回来给我，不要让它自行裁决（AGENTS.md §2）。
- **它要加依赖时**：默认拒绝，把理由拿回来讨论。
- **内容管线（C01–C07）**：主链路全部完成后才发，指令集见 [codex-prompts-content.md](./codex-prompts-content.md)（基于 tasks/content-tasks.md 生成）。
