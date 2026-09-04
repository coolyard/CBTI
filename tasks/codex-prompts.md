# tasks/codex-prompts · Codex 逐条派活指令集

> **v3.0 已废弃历史记录**：本文件保留 v3→v4 迁移期间的任务原文，旧题库文件名、旧档位与旧分流术语仅作历史派活记录；当前代码与规范一律以 v4.0 为准。

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

---

# v4.0 题库改版（T16–T20）

> 背景：题库已从 v3.0（性别分流 + 4 选项单维计分）升级为 v4.0（题材分流 + 6 选项双维 3×2 网格计分 + LUT 均衡匹配 + 四彩蛋归池）。内容侧已定稿：`CBTI_test_questions_categorized.md`（90 题全绿）、`CBTI_prompt_guide.md` v4.0；`CBTI_test_questions_gendered.md` 已删除。旧版 M1/M2 机制整体作废。
> 发送顺序：T16 →（你人工 review spec diff 确认）→ T17 → T18 → T19 → T20。每条完成后跑完验收再发下一条。

## T16 · 规范层改版（specs + PRD，纯文档）

```
你在 /Users/work/learn/CBTI 仓库工作。本项目题库已从 v3.0（性别分流 + 4 选项单维计分）升级为 v4.0（题材分流 + 6 选项双维 3×2 网格计分），内容侧已定稿。本任务只改文档，把规范层整体升级到 v4.0，为后续代码改版铺路。禁止修改 src/、scripts/、package.json 及任何配置文件。

必读（权威依据，全部只读）：
- CBTI_test_questions_categorized.md（v4.0 题库全文：分流题 + 6 类别 × 15 题 + 计分骨架 + 分维阈值 + 彩蛋规则 + 模式串微调记录）
- scripts/build-match-table.py（分维阈值与 LUT 的生成逻辑）

要改的文件（共 7 处）：
1. specs/00-glossary.md —— 删除 OptionBand / OPTION_SCORE / M1 / M2 / gender-split 相关词条；新增词条：题材 Category（xiuxian/jianghu/rexue/mori/gongting/dushi）、题材分流题 theme-split、维度对 pair、3×2 网格（X∈{1,5,10} × Y∈{2,9} 六组合）、分维阈值 DIMENSION_THRESHOLDS、均衡查找表 LUT、彩蛋种子 SeedTag（nezha/wukong/jingwei/nuwa）。
2. specs/20-data-schema.md —— 核心类型整体重写：
   - OptionKey = 'A'..'F'；QuestionType = 'theme-split' | 'normal' | 'easter'；SeedTag = 'nezha' | 'wukong' | 'jingwei' | 'nuwa'；新增 Category 类型与 CATEGORY_POOL 映射（xiuxian/jianghu/rexue → male，mori/gongting/dushi → female）。
   - QuestionOption：删除 band / targetPool；计分题选项带 scores: Partial<Record<Dimension, number>>（恰好 2 个维度，值 ∈ {1,2,5,9,10}）；theme-split 选项带 targetCategory: Category 且不带 scores；seedTag 仅 easter 题选项可带。
   - Question：dimension 字段改为 pair: [Dimension, Dimension]；类别题 id 1–15；theme-split 题独立定义（id 方案你定并写进规范）。
   - Character：gender 去掉 'universal'（#27/#28 改为 male）；easterKey 只允许出现在原型 #27（nezha）/#28（wukong）/#29（jingwei）/#30（nuwa）。
   - Zod 规则：计分题恰好 6 选项 A–F 各一；scores 恰好覆盖 3×2 网格 6 个分值位；每类别恰好 15 题且 pair 序列等于统一骨架 AE BD CE AB CD BE AD BC DE AC AE AB BC CD DE；theme-split 恰好 6 选项且 targetCategory 覆盖 6 类各一；角色库恰好 56 条（原型 1–26 各 m/f + 27-m/28-m + 29-f/30-f）。
   - 数据纪律：题库内容与 CBTI_test_questions_categorized.md 逐字对应；match-lut.ts 是 scripts/build-match-table.py 的生成产物，禁止手改。
3. specs/30-scoring-algorithm.md —— 流水线重写：
   ① 分流：theme-split 所选 targetCategory → Category → CATEGORY_POOL → RolePool；该题不计分。
   ② 计分：15 题所选选项的 scores 按维度累加 → 每维总分（范围 A 6–60 / B 8–58 / C 8–58 / D 9–57 / E 12–54）。
   ③ 定档：分维阈值（A ≤28→L·29-35→M·≥36→H；B ≤28→L·29-36→M·≥37→H；C ≤29→L·30-35→M·≥36→H；D ≤28→L·29-36→M·≥37→H；E ≤26→L·27-39→M·≥40→H）→ 模式串。
   ④ 匹配：模式串查 LUT（match-lut.ts，每池 243 格 → characterId）→ 主结果；灵魂近亲 = 池内排除主结果后、其自身模式串与用户模式串曼哈顿距离最小者，并列按 archetypeId 升序。
   ⑤ 彩蛋：Q7/Q11 所选选项的 seedTag 相同 → 锁定对应角色（男池 nezha/wukong，女池 jingwei/nuwa）；混合或无 → 不锁定。锁定时维度分/模式串/灵魂近亲仍正常计算展示。
   ⑥ 雷达图用户线：每维归一化 value = 1 + (total − MIN[dim]) / (MAX[dim] − MIN[dim]) × 9，保留 2 位小数；角色锚点 CHARACTER_ANCHOR L=2/M=5/H=9 不变。
   §7 测试用例清单同步重写：每维阈值 L/M/H 边界、LUT 确定性（同输入同输出）、彩蛋四角色各触发一次 + 混合不触发 + 跨池拒绝、真实题库全选 A 跑通、56 条角色 Zod 全过、1000 条随机路径对拍。
4. specs/50-pages/quiz.md —— Q1 分流语义更新：theme-split 题 6 个世界入口，选定后加载对应类别 15 题；总流程 16 屏。
5. specs/50-pages/result.md —— 彩蛋归池说明（哪吒/悟空仅男池可触发，精卫/女娲仅女池）；雷达图用户线新归一化口径。
6. specs/55-components/ 下涉及雷达图 dimensionScore 1–10 均值的描述 —— 改为新归一化口径。
7. PRD.md —— §3.2 评分制重写（3×2 网格 + 骨架 + 分维阈值 + LUT）；§四 角色表新增 #29 精卫（女，山海经，L-L-H-H-H，梗「填海」）与 #30 女娲（女，中国神话，H-H-H-M-H，梗「补天」）；§七 隐藏角色触发机制更新（Q7/Q11 双题锁定、四彩蛋归池）；§十 速查表 5 处微调：李白→M-L-M-L-H、蜡笔小新→H-M-M-L-H、宇智波鼬→L-H-M-H-M、武则天→H-H-M-M-H、灰原哀→M-H-L-H-M，并补 #29/#30 两行。

全局检查：改完后 grep specs/ 与 PRD.md，不得再出现 M1 / M2 / OPTION_SCORE / gender-split / questions.male / questions.female / CBTI_test_questions_gendered 字样（标注「v3.0 已废弃」的历史记录除外）。

交付：逐文件 diff 摘要 + 全局 grep 结果 + 待定决策清单（如 theme-split 题 id 方案），等我确认后再发 T17。
```

---

## T17 · 类型与数据层重建

```
你在 /Users/work/learn/CBTI 仓库工作。T16 已完成规范层 v4.0 改版并经我确认。本任务按新规范重建类型与数据层。禁止改 specs/、src/core/、src/pages/、src/components/；禁止新增依赖。
必读：specs/20-data-schema.md（新版）、CBTI_test_questions_categorized.md、PRD.md §十、scripts/build-match-table.py。

改动 1（类型）：src/types/index.ts 按 specs/20 重写（OptionKey A–F、Category、CATEGORY_POOL、SeedTag 四值、Question.pair、QuestionOption.scores / targetCategory、Character.gender 去 universal）。

改动 2（LUT 生成器扩展）：scripts/build-match-table.py 增加两个参数（不影响现有默认行为）：
- --emit-ts src/data/match-lut.ts：输出 TS 文件，含 DIMENSION_THRESHOLDS（分维阈值）、DIM_TOTAL_MIN / DIM_TOTAL_MAX、MATCH_LUT（male/female 两池各 243 格 pattern → characterId），文件头注释「本文件由 scripts/build-match-table.py 生成，禁止手改」。
- --emit-fixtures scripts/fixtures/random-paths.json：1000 条随机路径，每条 = { gridPath: 15 个网格位编号 1–6（G1=(10,2) G2=(10,9) G3=(5,2) G4=(5,9) G5=(1,2) G6=(1,9)），expectedPattern，expectedMainId，expectedEaster: null | 'nezha' | 'wukong' | 'jingwei' | 'nuwa' }。期望逻辑与 LUT 构建共用同一套（总分→阈值→模式串→LUT）；彩蛋期望按网格位映射：Q7(AD) G1=nezha·G4=wukong·G6=jingwei·G2=nuwa，Q11(AE) G1=nezha·G6=wukong 或 jingwei·G2=nuwa（男女池分别生成 500 条）。
- 运行生成两个产物并纳入版本控制。

改动 3（题库数据）：删除 src/data/questions.male.ts 与 questions.female.ts；新建：
- src/data/questions.theme-split.ts（Q1 分流题，6 选项逐字对应题库文档「一、题材分流题」）
- src/data/questions.xiuxian.ts / questions.jianghu.ts / questions.rexue.ts / questions.mori.ts / questions.gongting.ts / questions.dushi.ts（各 15 题，逐字对应题库文档二~七节；scene 填中文题材名；Q7/Q11 type='easter'，种子选项带 seedTag；designNote 取各题【设计说明】）
- src/data/index.ts 统一过 Zod 校验后导出（fail-fast 纪律不变）。

改动 4（角色库）：src/data/characters.ts —
- 新增 29-f 精卫、30-f 女娲：archetype/出处/pattern/quote/quoteExtra/brief/easterKey 逐字取题库文档「九、新增女性彩蛋角色档案」；tags/interpretation/parallelUniverse 暂留空（主链路阶段 assertContentComplete 允许为空，内容管线 C 系列后补）。
- 模式串微调 5 处：19-m 李白→M-L-M-L-H；26-m 蜡笔小新→H-M-M-L-H；25-m 宇智波鼬→L-H-M-H-M；20-f 武则天→H-H-M-M-H；25-f 灰原哀→M-H-L-H-M。
- 27-u → 27-m、28-u → 28-m（gender: 'male'）；grep 全仓库消除 '27-u' / '28-u' 残留引用。

改动 5（schema 与测试）：src/data/schemas.ts 按 specs/20 重写全部 Zod 规则；src/data/__tests__/ 同步重写（6 类别骨架校验、网格覆盖、theme-split 覆盖、角色库 56 条、彩蛋标记位置）。

验收（全部通过）：
- pnpm format && pnpm lint && pnpm typecheck && pnpm test
- 抽查比对：随机抽 6 类各 2 题，与 CBTI_test_questions_categorized.md 对应题块逐字比对题干与选项文本（写个临时脚本跑，附输出）
- python3 scripts/validate-questions.py（确认 MD 侧未被改动，仍全绿）

交付：改动清单 + 验收命令输出 + 抽查比对结果 + Spec 未覆盖决策登记（没有就写「无」）。
```

---

## T18 · core 重建 + 千路径对拍

```
你在 /Users/work/learn/CBTI 仓库工作。T16（规范）/ T17（类型与数据）已完成。本任务重建 src/core/ 全部计分匹配逻辑并对拍验证。禁止改 specs/、src/data/、src/pages/、src/components/；禁止新增依赖。
必读：specs/30-scoring-algorithm.md（新版）、src/data/match-lut.ts、scripts/fixtures/random-paths.json。

改动 1（scoring.ts）：删除 OPTION_SCORE / bandToFinal / bandOf(avg) / averageScore；新增 bandOfTotal(dim, total)（按 match-lut.ts 的 DIMENSION_THRESHOLDS）与 radarValue(dim, total)（specs/30 §⑥ 归一化公式）；保留 BAND_CODE / CHARACTER_ANCHOR / patternFromBands。

改动 2（matcher.ts）：matchCharacters 改为 LUT 查表定主结果（MATCH_LUT[pool][pattern]，缺格抛 DataIntegrityError）；灵魂近亲 = 池内排除主结果后曼哈顿距离最小者（并列 archetypeId 升序）；保留 DataIntegrityError 与 patternToBands / manhattan。

改动 3（easter.ts）：彩蛋题 = type='easter' 的 Q7/Q11；两题所选 seedTag 相同 → 锁定；不同或缺失 → null；锁定前校验该 tag 属于当前池（male: nezha/wukong，female: jingwei/nuwa），跨池数据错误抛 DataIntegrityError。

改动 4（engine.ts）：computeResult 改为 (category, answers, characters) 新签名新流水线（specs/30 §1）；TestResult 增加 category 字段；dimensionScores 改为维度总分（整数）；用户雷达值走 radarValue；characterRadarValues 不变。src/core/ 下其余引用旧类型的文件（home.ts / dominant-dimension.ts / loading.ts 等）通读并一并适配。

改动 5（测试）：src/core/__tests__/ 按 specs/30 §7 新用例重写；新增对拍测试：读 scripts/fixtures/random-paths.json，逐条把 gridPath 经数据层映射为对应类别（任选 xiuxian 即可）的选项字母，跑 computeResult，pattern / 主结果 / 彩蛋锁定与期望完全一致（1000/1000）；再加一条数据属性测试：同一 gridPath 在 6 个类别下计算结果完全一致（验证换皮不换骨）。

验收（全部通过）：pnpm format && pnpm lint && pnpm typecheck && pnpm test（含 specs/90 覆盖率门禁）
交付：改动清单 + 对拍结果（1000/1000）+ 覆盖率报告 + Spec 未覆盖决策登记（没有就写「无」）。
```

---

## T19 · store 与页面适配

```
你在 /Users/work/learn/CBTI 仓库工作。T16–T18 已完成。本任务把 store 与页面接到新 core 上。禁止改 specs/、src/core/、src/data/；禁止新增依赖。
必读：specs/50-pages/quiz.md（新版）、specs/50-pages/result.md（新版）、src/stores/quiz.ts、src/pages/ 全部页面。

改动 1（store）：src/stores/quiz.ts —— Q1 答案记录 targetCategory；选定后加载对应类别题库；答题流 16 屏（1 分流 + 15 计分）；finishQuiz 调 computeResult(category, answers, characters)；结果页「切换性别版」入口：新分流模型下规范未覆盖，保留 forcePool 能力但隐藏入口，登记决策。
改动 2（答题页）：Q1 渲染 6 个世界入口卡片（题材名 + 一句话梗，逐字取 questions.theme-split.ts 的选项文本）；计分题渲染 6 选项布局（在现有 4 选项布局上扩展，设计令牌/动效/自动进题/可回改语义全部保持）；进度文案改为 x/16。
改动 3（结果页/海报/加载页）：适配 TestResult 新字段（category、维度总分、radarValue）；彩蛋角色归池后展示逻辑不变（哪吒/悟空男池、精卫/女娲女池）；灵魂近亲接新数据来源。
改动 4（首页）：人格轮播数据源不变（characters 全库）；如有 '27-u' / '28-u' 引用残留则改为 '27-m' / '28-m'。
改动 5：引用旧题库文件名（questions.male / questions.female）的页面与测试全部适配。

验收（全部通过）：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 6 个类别在 H5 端各跑通一次（Q1→结果页）的截图 + Spec 未覆盖决策登记（没有就写「无」）。
```

---

## T20 · 集成自检 + 文档收尾

```
你在 /Users/work/learn/CBTI 仓库工作。T16–T19 已完成。本任务做 v4.0 改版总验收与文档收尾。除文档与测试外不动代码；禁止新增依赖。
1. 通读 specs/50-pages/ 全部验收清单，逐条核对当前实现，列出未达标项。
2. 跑 pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin，确认全绿。
3. 禁项检查：ECharts / html2canvas / UI 组件库 / 未批准依赖 / 旧版 createCanvasContext / 散落的 platform 判断。
4. 残留检查：grep 全仓库（含 specs/、README.md、ARCHITECTURE.md、AI-CODING-GUIDE.md、tasks/、src/），不得再有 M1 / M2 / OPTION_SCORE / gender-split / questions.male / questions.female / CBTI_test_questions_gendered / 27-u / 28-u（标注「v3.0 已废弃」的历史记录除外）。
5. 文档收尾：README.md / ARCHITECTURE.md / AI-CODING-GUIDE.md 中 v3.0 题库与计分描述更新为 v4.0 口径；tasks/v1.0-tasks.md 增补 v4.0 改版记录（T16–T20 摘要）。
6. 输出 6 类别 × 双端（H5/小程序）人工冒烟操作清单给我，我来跑。
交付：未达标项清单 + 全门禁输出 + 残留 grep 结果 + 文档改动清单 + 冒烟操作清单。
```

---

## ⚠️ 修订：T17-R 取代原 T17 + T18（Codex 反馈类型/数据/core 接口原子性，拆分必留红中间态）

- **T17-R（本文件下方全文）= 类型 + 数据层 + core + 消费方最小适配**，验收含完整门禁 + 对拍，一次到位。
- **T19 范围收窄为纯视觉/交互精修**：Q1 世界入口卡片化设计、6 选项布局视觉精修、进度与结果页/海报展示细节优化（原 T19 中的功能性适配已并入 T17-R）。
- **T20 不变**。

## T17-R · 类型 + 数据 + core + 最小适配（取代原 T17/T18）

```
你在 /Users/work/learn/CBTI 仓库工作。T16 已完成规范层 v4.0 改版并经我确认。经评估，类型/数据/core 的接口是原子性的，本任务为 T17 修订版（取代原 T17+T18 两条）：范围 = 类型 + 数据层 + core + 消费方最小适配，目标是完整门禁全绿、不留中间态。禁止改 specs/；禁止新增依赖。
必读：specs/20-data-schema.md（新版）、specs/30-scoring-algorithm.md（新版）、CBTI_test_questions_categorized.md、PRD.md §十、scripts/build-match-table.py。

一、类型与数据层
1. src/types/index.ts 按 specs/20 重写（OptionKey A–F、Category、CATEGORY_POOL、SeedTag 四值、Question.pair、QuestionOption.scores / targetCategory、Character.gender 去 universal）。
2. scripts/build-match-table.py 增加两个参数（不影响现有默认行为）：
   - --emit-ts src/data/match-lut.ts：含 DIMENSION_THRESHOLDS、DIM_TOTAL_MIN / DIM_TOTAL_MAX、MATCH_LUT（male/female 各 243 格 pattern → characterId），文件头注释「本文件由 scripts/build-match-table.py 生成，禁止手改」。
   - --emit-fixtures scripts/fixtures/random-paths.json：1000 条随机路径（男/女池各 500），每条 = { gridPath: 15 个网格位编号 1–6（G1=(10,2) G2=(10,9) G3=(5,2) G4=(5,9) G5=(1,2) G6=(1,9)），expectedPattern，expectedMainId，expectedEaster: null | 'nezha' | 'wukong' | 'jingwei' | 'nuwa' }；彩蛋网格位映射：Q7(AD) G1=nezha·G4=wukong·G6=jingwei·G2=nuwa，Q11(AE) G1=nezha·G6=wukong 或 jingwei·G2=nuwa。
   - 运行生成两个产物并纳入版本控制。
3. 删除 src/data/questions.male.ts / questions.female.ts；新建 src/data/questions.theme-split.ts（逐字对应题库文档「一、题材分流题」）+ src/data/questions.{xiuxian,jianghu,rexue,mori,gongting,dushi}.ts（各 15 题，逐字对应题库文档二~七节；scene 填中文题材名；Q7/Q11 type='easter' 且种子选项带 seedTag；designNote 取各题【设计说明】）；src/data/index.ts 统一过 Zod 校验后导出（fail-fast 纪律不变）。
4. src/data/characters.ts：新增 29-f 精卫、30-f 女娲（archetype/出处/pattern/quote/quoteExtra/brief/easterKey 逐字取题库文档「九、新增女性彩蛋角色档案」，tags/interpretation/parallelUniverse 暂留空）；模式串微调 5 处（19-m 李白→M-L-M-L-H、26-m 蜡笔小新→H-M-M-L-H、25-m 宇智波鼬→L-H-M-H-M、20-f 武则天→H-H-M-M-H、25-f 灰原哀→M-H-L-H-M）；27-u→27-m、28-u→28-m（gender: 'male'）；grep 全仓库消除 '27-u' / '28-u' 残留引用。
5. src/data/schemas.ts 按 specs/20 重写全部 Zod 规则；src/data/__tests__/ 同步重写（6 类别骨架校验、网格覆盖、theme-split 覆盖、角色库 56 条、彩蛋标记位置）。

二、core 重建
6. src/core/scoring.ts：删除 OPTION_SCORE / bandToFinal / bandOf(avg) / averageScore；新增 bandOfTotal(dim, total)（按 match-lut.ts 的 DIMENSION_THRESHOLDS）与 radarValue(dim, total)（specs/30 §⑥ 归一化公式）；保留 BAND_CODE / CHARACTER_ANCHOR / patternFromBands。
7. src/core/matcher.ts：主结果改 LUT 查表（MATCH_LUT[pool][pattern]，缺格抛 DataIntegrityError）；灵魂近亲 = 池内排除主结果后曼哈顿距离最小者（并列 archetypeId 升序）；保留 patternToBands / manhattan。
8. src/core/easter.ts：彩蛋题 = type='easter' 的 Q7/Q11；两题所选 seedTag 相同 → 锁定；不同或缺失 → null；锁定前校验 tag 属于当前池（male: nezha/wukong，female: jingwei/nuwa），跨池抛 DataIntegrityError。
9. src/core/engine.ts：computeResult 改为 (category, answers, characters) 新签名新流水线（specs/30 §1）；TestResult 增加 category 字段；dimensionScores 为维度总分（整数）；用户雷达值走 radarValue；characterRadarValues 不变。src/core/ 下其余引用旧类型的文件（home.ts / dominant-dimension.ts / loading.ts 等）通读并一并适配。

三、消费方最小适配（只做「能编译、行为正确」的改动；视觉精修留给 T19）
10. src/stores/quiz.ts：Q1 答案记录 targetCategory → 加载对应类别题库；答题流 16 屏（1 分流 + 15 计分）；finishQuiz 调新 computeResult；forcePool 能力保留但入口隐藏（登记决策）。
11. src/pages/：选项按数据渲染（6 选项自然渲染即可，不做卡片化精修）；进度按实际题数显示；结果页/海报/加载页接新 TestResult 字段；首页轮播数据源不变。
12. 引用旧题库文件名（questions.male / questions.female）与旧类型的全部代码/测试适配。

四、测试
13. src/core/__tests__/ 按 specs/30 §7 新用例重写；对拍测试：读 scripts/fixtures/random-paths.json，逐条把 gridPath 经数据层映射为选项字母（用 xiuxian 类别），跑 computeResult，pattern / 主结果 / 彩蛋锁定与期望完全一致（1000/1000）；数据属性测试：同一 gridPath 在 6 个类别下计算结果完全一致（验证换皮不换骨）。

验收（全部通过，缺一不可）：
- pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
- 对拍 1000/1000
- 抽查比对：随机抽 6 类各 2 题，与 CBTI_test_questions_categorized.md 对应题块逐字比对题干与选项文本（写个临时脚本跑，附输出）
- python3 scripts/validate-questions.py 全绿（确认 MD 未被改动）

交付：改动清单 + 全门禁输出 + 对拍结果 + 抽查比对结果 + Spec 未覆盖决策登记（没有就写「无」）。
```

## T19（修订版）· 视觉与交互精修

```
你在 /Users/work/learn/CBTI 仓库工作。T16 / T17-R 已完成，功能链路已通。本任务只做视觉与交互精修，不改任何计分/匹配/数据逻辑。禁止改 specs/、src/core/、src/data/；禁止新增依赖。
必读：specs/50-pages/quiz.md（新版）、specs/50-pages/result.md（新版）、specs/40-design-system.md、specs/45-visual-polish.md。

精修 1（Q1 世界入口）：theme-split 题从「普通选项列表」升级为 6 张世界入口卡片（题材名 + 一句话梗，逐字取 questions.theme-split.ts 选项文本；选中态/入场动效遵循 specs/40、45；小程序端不用的 H5-only API）。
精修 2（6 选项布局）：计分题 6 选项的视觉节奏精修（间距/分组/选中态），保持自动进题 + 可回改语义不变；长选项（接近 40 字）折行不溢出。
精修 3（进度与结果页细节）：进度组件视觉适配 16 屏；结果页 category 相关展示细节（如题材标签露出，若规范未提则登记决策不加）；海报新数据下的排版复核（维度总分不直接展示，仍展示档位与雷达）。
精修 4（双端一致性）：以上三项在 H5 与小程序端视觉对齐，截图对比。

验收（全部通过）：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + 6 类别 H5 端 Q1→结果页截图 + 双端对比截图 + Spec 未覆盖决策登记（没有就写「无」）。
```
