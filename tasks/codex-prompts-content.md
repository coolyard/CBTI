# tasks/codex-prompts-content · 内容管线 Codex 指令集（C01–C07）

> 前置：主链路 T01–T15 全绿后才启用本指令集。用法与铁律同 [codex-prompts.md](./codex-prompts.md)（一条没通过门禁，不要发下一条）。
> 任务卡与勾选状态见 [content-tasks.md](./content-tasks.md)。
> 规模口径：54 个内容角色 = 28 组原型（#1–#26 男女双版 52 + #27/#28 通用 2；#29 占位已删除）。

## 管线总顺序（真实依赖链）

```
C01 台词 → C02 解读 → C03 平行宇宙 → C04 标签   （四条 Codex 指令，可连续发）
  → C05 立绘 Prompt（Codex）
  → 【风格确认：抽 5 条试出图，非 Codex】
  → C06-A 批量出图（图像 AI 任务，非 Codex）
  → C06-B 入库与接线（Codex）
  → C07 内容完整度校验启用（Codex，收尾）
```

---

## C01 · 经典梗台词润色（54 条）

```
你在 /Users/work/learn/CBTI 仓库工作。任务：C01 经典梗台词润色（定义见 tasks/content-tasks.md）。
必读：specs/60-content-tone.md（§2.1 规则 + §3 禁用清单 + §4 审核清单）、PRD.md §三角色表「核心梗」列、specs/20-data-schema.md §2。

第 0 步（契约对齐，允许且仅允许改这一处 spec）：specs/60 §2.1 已定 quote ≤30 字，但 specs/20 §2 的 characterSchema 未约束。先在 specs/20 §2 的 quote 行补「≤ 30 字」，再给 src/data/schemas.ts 的 quote 加 .max(30)。此为先改 spec 再改代码的标准流程，除此之外不许动其他 spec 文件。

内容要求：
1. 范围：src/data/characters.ts 全部 54 个角色
2. 优先使用角色最广为人知的原句/梗（PRD 核心梗列是起点），润色只补齐语气（标点、至多 1 个 emoji），不二创到认不出；≤30 字
3. 产出 content/quotes.md，格式逐角色：
   ## {id} {name}（{source}）
   - 候选 1：…（N 字）
   - 候选 2：…（N 字）
   - 定稿：…
   - 理由：一句话
4. 分 3 批处理（原型 1–9 / 10–18 / 19–26+27-u+28-u，每批 18 个），每批写完立即追加到 content/quotes.md，不要攒到最后一次性输出
5. 每批自查 specs/60 §4 审核清单四条 + §3 禁用清单，违禁的直接重写
6. 全部完成后把定稿回写 characters.ts 的 quote 字段——只许改 quote 的值，id/pattern/tags 等其他字段一个字符都不许动

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test
交付：改动清单 + 批次完成记录 + specs/60 §4 自查声明 + Spec 未覆盖决策登记（没有就写"无"）。
```

---

## C02 · 扎心解读（54 套 × 3–5 段）

```
你在 /Users/work/learn/CBTI 仓库工作。任务：C02 扎心解读（定义见 tasks/content-tasks.md）。
必读：specs/60-content-tone.md（§2.3 四段式骨架 + §3 + §4）、specs/00-glossary.md（五维名称与口语叫法）、PRD.md §三角色表、src/data/characters.ts。

内容要求：
1. 范围同 C01：54 个角色
2. 每角色 4 段（固定四段式骨架）：开头暴击 → 细节解剖 → 温柔一刀 → 金句收尾；每段 ≤120 字（schema 已强制，超长会直接校验失败）
3. 细节解剖必须对照该角色的模式串：挑 2–3 个 H/M 维度用日常场景翻译；温柔一刀针对 L 维度。口语叫法以 specs/00 为准（如 嚣张/心眼子/恋爱脑/轴度/血条），禁心理学术语
4. 注意视角：解读是说「你」（用户像这个角色），不是说角色本人。第二人称，像损友不像咨询师
5. 产出 content/interpretations.md，格式逐角色：
   ## {id} {name}
   1. 开头暴击：…
   2. 细节解剖：…
   3. 温柔一刀：…
   4. 金句收尾：…
6. 同样分 3 批（18/18/18），每批写完立即追加；每批过 specs/60 §4 审核清单
7. 回写 interpretation 字段（字符串数组，4 段按序），只许动这一个字段

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test
交付：改动清单 + 批次完成记录 + specs/60 §4 自查声明 + Spec 未覆盖决策登记。
```

---

## C03 · 现代平行宇宙（54 条）

```
你在 /Users/work/learn/CBTI 仓库工作。任务：C03 现代平行宇宙（定义见 tasks/content-tasks.md）。
必读：specs/60-content-tone.md（§2.4 + §3 + §4）、PRD.md §三角色表、src/data/characters.ts。

内容要求：
1. 范围同 C01：54 个角色
2. 「如果 TA 活在 2026」：一个现代职业 + 一个反差细节，≤150 字（schema 已强制）
3. 职业要和角色模式串气质自洽（例：H 存在感角色给「被围观」的职业场景才有反差笑点）；参考 specs/60 §2.4 高启强示例的味儿
4. 产出 content/parallel-universes.md，格式逐角色：
   ## {id} {name}
   - 定稿：…（N 字）
   - 备选：…（可选 1 条）
5. 分 3 批（18/18/18），每批写完立即追加；每批过 specs/60 §4 审核清单
6. 回写 parallelUniverse 字段，只许动这一个字段

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test
交付：改动清单 + 批次完成记录 + specs/60 §4 自查声明 + Spec 未覆盖决策登记。
```

---

## C04 · 灵魂标签（54 套 × 3–5 个）

```
你在 /Users/work/learn/CBTI 仓库工作。任务：C04 灵魂标签（定义见 tasks/content-tasks.md）。
必读：specs/60-content-tone.md（§2.2 + §3 + §4）、specs/00-glossary.md、src/data/characters.ts。

内容要求：
1. 范围同 C01：54 个角色
2. 每角色 3–5 个标签（C07 校验会强制此区间），结构 = 1 个身份梗 + 1–2 个五维特征梗 + 1 个反转/自嘲梗；`#` 开头，单个标签尽量 ≤8 字
3. 标签会同时出现在结果页和分享海报底部，要短、要适合截图传播
4. 产出 content/tags.md，格式逐角色：
   ## {id} {name}
   - 定稿：#… #… #…
   - 结构自查：身份梗=… 维度梗=… 反转梗=…
5. 分 3 批（18/18/18），每批写完立即追加；每批过 specs/60 §4 审核清单
6. 回写 tags 字段（字符串数组），只许动这一个字段

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test
交付：改动清单 + 批次完成记录 + specs/60 §4 自查声明 + Spec 未覆盖决策登记。
```

---

## C05 · 立绘 Prompt 全套（54 条）

```
你在 /Users/work/learn/CBTI 仓库工作。任务：C05 立绘 Prompt 全套（定义见 tasks/content-tasks.md）。
必读：specs/70-assets.md（§1 风格圣经 + §4 模板，逐字遵守）、src/data/characters.ts、C01 定稿后的 quote（content/quotes.md，用于把握角色气质，但不写进图）。

内容要求：
1. 范围：54 个角色
2. 采用 specs/70 §2 方案 A（图文分离）：Prompt 中禁止出现任何台词气泡/文字要求
3. 每条 Prompt = 风格前缀（specs/70 §1 整段逐字复制，一个标点都不许改）+ 角色专属 1–2 句（身份符号 + 标志性道具/动作）+ 夸张表情 1 句。参考 specs/70 §4 的三个示例
4. 版权安全线：只描述角色气质与符号，禁止出现真实演员姓名、「和某某长得一样」这类表述
5. 产出 content/illustration-prompts.md，格式逐角色：
   ## {id} {name}
   {完整 Prompt，单行}
6. 54 条一次产出即可（纯文本无门禁风险），写完自查：54 条的风格前缀逐字一致

完成后执行：pnpm format && pnpm lint（本任务不改代码，typecheck/test 应天然全绿，仍跑一遍确认）
交付：content/illustration-prompts.md 路径 + 风格前缀一致性自查声明。
注意：批量出图不归你。我抽 5 条试出图确认风格后，才进入 C06-A。
```

---

## C06-A · 立绘批量出图（图像 AI 任务，**不发 Codex**）

> 这一步是出图，Codex 做不了（已排除 Kimi 本机插件路线）。两个执行方式任选：

**方式 1（首选，零成本）**：豆包（doubao.com 或豆包 APP）。免费、原图 2048×2048 富余（入库统一压至 640×640 达标），与即梦同属字节 Seedream 模型系，中文 Prompt 理解一致。输出带「豆包AI生成」浅色水印——按 AI 生成内容标识合规要求**保留**，不裁不抹（结果页/海报为圆形裁剪展示，角落水印自然弱化）。每日免费额度约 10–30 张（随平台策略浮动）：把 `content/illustration-prompts.md` 按批次发给它，每角色出 2 张候选，人工筛 1 张，54 张约 2–5 天出完。

**方式 2（备选）**：即梦 AI（jimeng.jianying.com）。免费版每日 60–100 积分（≈20–30 张）但**带平台水印**——本项目立绘为居中构图 + 纯色背景，水印在角落，入库压缩时可裁剪规避，接受这一点才用免费版；想一天批量出完且官方去水印，开连续包月会员 ¥41。

**殊途同归的入库约定**（无论哪种方式）：

1. 把筛定的 54 张原图（PNG/JPG 即可，尺寸不限）放进仓库 `raw-portraits/` 目录，文件名含角色 id（如 `1-m.png`、`27-u.jpg`）
2. 告诉我一声，我用本地 Python（Pillow）统一处理：裁剪/缩放到 640×640 → 转 WebP ≤200KB → 按 `char-{原型两位补零}-{male|female|universal}.webp` 命名（`1-m` → `char-01-male.webp`，`27-u` → `char-27-universal.webp`）→ 放入 `src/pkg-characters/characters/`
3. 压缩完成后即可发 C06-B

---

## C06-B · 立绘入库与接线

```
你在 /Users/work/learn/CBTI 仓库工作。任务：C06-B 立绘入库与接线（定义见 tasks/content-tasks.md C06）。
前置确认：src/pkg-characters/characters/ 下已有 54 张 char-*.webp（我放好后你再开工；若目录不存在或数量不对，停下来告诉我，不要往下做）。
必读：specs/70-assets.md §5/§6、specs/80-platform-notes.md §3、specs/50-pages/poster.md、src/utils/canvas-image.ts、src/components/poster/draw-poster.ts。

要点：
1. pages.json 注册分包：subPackages 加 { root: 'pkg-characters' }；微信要求分包至少 1 个页面——建一个永不跳转的占位页 src/pkg-characters/pages/placeholder/index（不进 tabBar，不参与任何路由跳转）
2. 新建 src/utils/character-asset.ts（纯函数，禁 uni API）：
   - characterPortraitFileName(id)：'1-m' → 'char-01-male.webp'，'27-u' → 'char-27-universal.webp'
   - characterPortraitPath(id)：'/pkg-characters/characters/' + fileName
   - 补单测 src/utils/__tests__/character-asset.test.ts，覆盖 m/f/u 三种后缀与补零
3. 页面接线（降级逻辑不许删，立绘加载失败/加载中一律回退现有首字符占位）：
   - 首页轮播、结果页身份证、灵魂近亲卡：<image :src="characterPortraitPath(id)"> + @error 回退占位
   - 海报 src/pages/poster/index.vue 的 loadPosterAssets：portrait 从写死 null 改为按 result.main.id 加载（走 canvas-image.ts 封装），失败回退 null（drawPoster 的占位分支已存在）
4. 加载页 onLoad 时预下载分包（条件编译 #ifdef MP-WEIXIN：uni.preloadSubpackage('pkg-characters')；H5 不执行）
5. 新增资产清单测试 src/data/__tests__/character-assets.test.ts：遍历 characters 全部 54 个角色，用 characterPortraitFileName 断言 src/pkg-characters/characters/ 下对应文件存在且 ≤200KB（vitest node 环境用 node:fs 读文件）

完成后执行并全部通过：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin
交付：改动清单 + specs/70 §6 入库验收逐条自查 + H5/MP 立绘显示与降级效果描述 + Spec 未覆盖决策登记。
```

---

## C07 · 内容完整度校验启用（收尾）

```
你在 /Users/work/learn/CBTI 仓库工作。任务：C07 内容完整度校验启用（定义见 tasks/content-tasks.md）。
前置：C01–C04 回写完成（content/ 四份文件齐全），C06-B 已全绿。

1. src/data/index.ts 顶层调用 assertContentComplete(characters)（函数已从 schemas.ts export，当前未被调用；放在 characters 导出之后）
2. 跑 pnpm test：若有角色内容不全（quote 空 / tags 非 3–5 个 / interpretation 非 3–5 段 / parallelUniverse 空），启动会抛 DataIntegrityError——把缺失清单原样贴给我，不要自行补写内容
3. 全绿后跑完整门禁：pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build:h5 && pnpm build:mp-weixin

交付：改动清单 + 「54 角色内容完整度全绿」确认 + tasks/content-tasks.md 状态栏全部勾 [x]。
```
