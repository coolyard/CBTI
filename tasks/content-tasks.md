# tasks/content-tasks · 内容管线（主链路完成后启动）

> 内容不阻塞工程，但阻塞发布。所有产出必须过 specs/60 审核清单 + specs/20 schema 校验。
> 状态栏：`[ ]` 未开始 `[~]` 进行中 `[x]` 完成。
> 规模口径：54 个角色 = 28 组原型（#1–#26 男女双版 52 + #27/#28 通用 2）。#29 占位已于 2026-08-31 决策删除。

### C01 · 经典梗台词润色（54 条） `[x]`
- **产出**：`content/quotes.md`（每角色 2–3 候选 + 最终定稿 1 条）
- **规则**：specs/60 §2.1；优先原句，≤30 字
- **回写**：定稿填入 `src/data/characters.ts` 的 `quote`

### C02 · 扎心解读（54 套 × 3–5 段） `[x]`
- **产出**：`content/interpretations.md`
- **规则**：specs/60 §2.3 四段式骨架；每段 ≤120 字
- **回写**：`interpretation` 字段

### C03 · 现代平行宇宙（54 条） `[x]`
- **产出**：`content/parallel-universes.md`
- **规则**：specs/60 §2.4；≤150 字
- **回写**：`parallelUniverse` 字段

### C04 · 灵魂标签（54 套 × 3–5 个） `[x]`
- **产出**：`content/tags.md`
- **规则**：specs/60 §2.2；1 身份梗 + 1–2 维度梗 + 1 反转梗
- **回写**：`tags` 字段

### C05 · 立绘 Prompt 全套（54 条） `[x]`
- **产出**：`content/illustration-prompts.md`
- **规则**：specs/70 §1/§4；风格前缀逐字统一 + 角色专属 1–2 句
- **验收**：抽 5 条试出图，风格一致才批量

### C06 · 立绘生成与入库 `[x]`
- **产出**：54 张 WebP（≤200KB/张，640×640；54 张总量 <2MB 以入单分包）入 `src/pkg-characters/characters/`
- **流程**：按 C05 prompts 用豆包批量出图 → 人工筛选 → `python3 scripts/compress-characters.py` 压缩命名 → 跑 `pnpm test` 资产清单校验
- **依赖**：C05；工程 T12（海报需要立绘）

### C07 · 内容完整度校验启用 `[x]`
- **动作**：打开 `src/data/index.ts` 中 `assertContentComplete()` 的强制校验，54 角色内容全绿
- **依赖**：C01–C04 回写完成
