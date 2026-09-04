# AI-CODING-GUIDE · AI 编码操作手册（宪法层）

> [AGENTS.md](AGENTS.md) 是强制规则（必须遵守）；本文件是操作手册（怎么做得更好）。
> 两者冲突时以 AGENTS.md 为准。

## 1. 不同任务类型的阅读顺序

| 任务类型 | 必读顺序 |
|---------|---------|
| 新页面 | AGENTS.md → specs/00 → specs/40 → 对应 specs/50-pages/*.md → specs/80 |
| 改算法/数据 | AGENTS.md → specs/20/30 → 现有 `src/core/` 与测试 |
| 视觉/样式 | DESIGN.md → specs/40 → specs/45（主题/气泡/动画/装饰）→ specs/55（如涉及雷达/海报） |
| 内容生产 | specs/60 → specs/70（立绘）→ tasks/content-tasks.md |
| 跨端问题 | specs/80 → specs/92 |
| 测试/CI | specs/90 → specs/91 |

## 2. 派活 Prompt 模板（人类复制即用）

逐条可直接发送的指令集已沉淀在 [tasks/codex-prompts.md](tasks/codex-prompts.md)（含 v3→v4 迁移 T16–T20 与总验收，每条内置质量门禁）；视觉润色批次见 [tasks/codex-prompts-polish.md](tasks/codex-prompts-polish.md)（P01–P13，对应 specs/45）。通用模板：

```
你在 CBTI 仓库工作。先读 AGENTS.md，然后完成任务 {TASK_ID}。
任务定义在 tasks/v1.0-tasks.md，必读 spec 见任务卡。
完成后：
1. 跑 pnpm lint && pnpm typecheck && pnpm test，贴结果
2. 逐条自查任务卡的验收清单
3. 列出你做的所有 Spec 未覆盖决策
不要改 specs/ 和 PRD.md；不要加新依赖；不要为了让测试通过而改测试。
```

## 3. 本项目的已知坑（踩过才登记）

| 坑 | 现象 | 解法 |
|----|------|------|
| uni 插件 CJS 导出 | `uni is not a function` | vite.config.ts 里取 `.default` 兼容（已在脚手架处理） |
| vite 版本 | uni 插件 peer 锁 `vite@5.2.8` | 不要升 vite；vitest 用 ^3（v4 要求 vite≥6） |
| vitest 与 uni 插件 | 测试不需要 uni 运行时 | 用独立 `vitest.config.ts`，不加载 uni 插件 |
| pnpm 隔离布局 | uni 编译器按根路径解析 `@dcloudio/uni-components`、pinia 找不到 `nostics` | `pnpm-workspace.yaml` 设 `publicHoistPattern: ['*']`（已配置）；构建脚本白名单 `allowBuilds` 改动需确认安全 |
| pnpm 供应链门禁 | pnpm 11 默认拦截依赖构建脚本与新发布版本 | `allowBuilds` / `minimumReleaseAgeExclude` 已在 workspace 文件登记，新增依赖报错时先查这里 |
| 题库事实源 | v4.0 以 `CBTI_test_questions_categorized.md` 为准 | 改题先改 MD，再跑 `scripts/build-match-table.py --emit-ts`；禁止手写 `src/data/category/*.ts` |
| 角色库条数 | 角色库 56 条 = 26 原型男女双版 52 + 4 归池隐藏角色 | #27/#28 为 male、#29/#30 为 female；见 specs/20 §2 |

## 4. 生成代码的口味

- 先写类型，再写实现；类型即 spec 的代码投影
- core 函数保持纯：输入输出显式，无副作用，无环境探测
- 组件里不出现魔法数字——回 specs/40/55 找令牌
- 注释只写"为什么"，并引用 spec 编号（`// 见 specs/30 §4`）

## 5. 交付说明模板

```
## 改动
- {文件}: {做了什么}
## 验收自查
- [x] 任务卡第 1 条 …（附证据：命令输出/截图描述）
## Spec 未覆盖决策
- {决策}：{理由}（建议补充到 specs/xx）
## 遗留
- {未完成项与原因}
```
