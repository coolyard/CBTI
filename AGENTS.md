# AGENTS.md · AI Agent 工作总则

> 任何 AI Agent（Codex / DeepSeek / Kimi 等）在本仓库工作前**必须完整阅读本文件**。
> 本文件优先级高于 Agent 的自身习惯。

## 1. 项目速览

CBTI（Character-Based Type Indicator）：纯前端娱乐人格测试，UniApp + Vue3 + TS 一套代码出 H5 + 微信小程序。
15 道选择题 → 5 维灵魂指纹 → 曼哈顿距离匹配 28 组角色 → 结果页 + Canvas 分享海报。**零后端、无 SSR/SSG。**

## 2. 工作流（不可跳过）

```
读 PRD.md 建立产品直觉
  → 读 specs/00（术语）+ specs/10（架构）
  → 读任务指定的 spec 文件（tasks/ 中每个任务标明了必读 spec）
  → 实现 → 本地跑 pnpm lint && pnpm typecheck && pnpm test
  → 对照任务验收标准自查 → 交付说明（改了什么、哪条验收已过、哪条待人工）
```

- **Spec 是唯一依据**：Spec 与你的判断冲突时，按 Spec 执行并在交付说明中提出异议，禁止擅自偏离。
- Spec 没覆盖到的决策：选最小惊讶方案，并在交付说明中标注「此决策 Spec 未覆盖」。
- 发现 Spec 内部矛盾：停止实现，报告矛盾点，不要自己二选一。

## 3. 硬性禁令

1. 禁止引入 Spec 未批准的依赖（`package.json` 变更必须在交付说明中给出理由）。
2. 禁止把业务逻辑写进页面/组件（一律进 `src/core/` 纯函数）。
3. 禁止在 UI 层渲染题库元信息（`seedTag`、`designNote`、维度名分流逻辑）。
4. 禁止空 `catch`、禁止静默降级（见 specs/92）。
5. 禁止 `any`（确需时用 `unknown` + 收窄，并注释原因）。
6. 禁止改动 `specs/` 与 `PRD.md`（Spec 变更只能由人类发起；Agent 只能提建议）。
7. 禁止使用 ECharts / html2canvas / 成品 UI 组件库（已有自研规范）。
8. 禁止改动测试来让失败用例通过；测试失败说明实现错了或 Spec 矛盾。

## 4. 质量门槛（Definition of Done）

- `pnpm lint` / `pnpm typecheck` / `pnpm test` 全绿。
- 任务卡上的验收清单逐条自查并标注结果。
- 涉及页面/组件的任务：交付说明中附 H5 与 MP 两端的关键截图描述（或实际截图）。

## 5. 仓库地图

| 你要找… | 去哪里 |
|---------|--------|
| 产品意图 | `PRD.md` |
| 术语定义 | `specs/00-glossary.md` |
| 架构与代码规范 | `specs/10-architecture.md` |
| 数据契约 | `specs/20-data-schema.md` + `src/data/schemas.ts` |
| 算法 | `specs/30-scoring-algorithm.md` + `src/core/` |
| 视觉规范 | `specs/40-design-system.md` |
| 页面需求 | `specs/50-pages/*.md` |
| 雷达图组件 | `specs/55-components/radar-chart.md` |
| 内容语气 | `specs/60-content-tone.md` |
| 立绘 | `specs/70-assets.md` + `content/` |
| 跨端差异 | `specs/80-platform-notes.md` |
| 测试/CI/错误处理 | `specs/90 / 91 / 92` |
| 当前任务 | `tasks/v1.0-tasks.md`（主链路）、`tasks/content-tasks.md`（内容管线） |
