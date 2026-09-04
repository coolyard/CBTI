# CONTRIBUTING · 贡献指南（宪法层）

> 本仓库是 **Spec-Driven** 项目：改代码之前，先想清楚"这改动属于哪一层"。

## 1. 改动分层与入口

| 你要改什么 | 改哪里 | 谁来改 |
|-----------|--------|--------|
| 产品意图（玩法、流程、角色增减） | `PRD.md` | **只能人类** |
| 工程/算法/页面/内容规范 | `specs/` 对应文件 | 人类发起，Agent 可代笔 |
| 题库/角色内容 | `src/data/*.ts`（结构与数据），并同步源 MD | Agent 可执行，人类审核 |
| 代码实现 | `src/`（按 specs） | Agent 执行 |
| 文案内容（台词/解读/立绘 Prompt） | `content/` → 回写 `src/data/` | Agent 生成，人类按 specs/60 审核 |
| 本文件及宪法层 | Agent 生成与更新 | 人类最终拍板 |

黄金法则：**代码不定义规则，spec 定义规则**。发现代码与 spec 不一致，要么代码错了，要么 spec 该改了——不存在"代码先跑起来 spec 以后补"。

## 2. 提交流程

```bash
pnpm lint && pnpm typecheck && pnpm test   # 提交前三连，必须全绿
```

1. 分支：`feat/xxx`、`fix/xxx`、`content/xxx`、`spec/xxx`
2. Commit：Conventional Commits（`feat: / fix: / spec: / content: / test: / chore:`）
3. PR 描述必须包含：改动对应的 spec 条目 / 影响的任务编号（tasks/）/ 验收清单自查结果
4. CI（`.github/workflows/ci.yml`）与本地三连完全等价，红了不许合

## 3. 常见场景操作手册

**改一道题**：改 `CBTI_test_questions_categorized.md` v4.0 题库 → 用 `python3 scripts/build-match-table.py --emit-ts` 重新生成 `src/data/category/*.ts` 与 `match-lut.ts` → 跑 `pnpm test`（Zod 会自动卡约束）。

**加一个角色**：先在 PRD.md 角色表登记（原型号、模式串、出处）→ 再改 `src/data/characters.ts` → 内容管线补文案 → C07 校验。

**加依赖**：默认不允许。确需时在 PR 中说明为什么 spec 需要更新，并同步 specs/10 §1 技术栈表。

**改视觉**：改 specs/40 → 同步 `uno.config.ts` / `uni.scss` → 禁止只改代码不改 spec。

## 4. AI Agent 协作

本仓库的主要"贡献者"是 AI Agent。给 Agent 派活时：

- 一律从 `tasks/` 里选任务，任务卡上标了必读 spec
- Agent 必读 [AGENTS.md](AGENTS.md)（强制规则）与 [AI-CODING-GUIDE.md](AI-CODING-GUIDE.md)（操作手册）
- Agent 交付必须附：改动清单 / 验收自查 / Spec 未覆盖决策登记
