# 10 · 技术架构与工程规范

> 本文件是工程实施的顶层约束。目标：**一套代码同时产出 H5 与微信小程序，纯前端零后端，无 SSR/SSG**。
> 本文件中的目录结构、命名、代码规范为未来所有同类项目的标准模板。

## 1. 技术栈（已锁定）

| 层 | 选型 | 版本基线 | 说明 |
|----|------|---------|------|
| 跨端框架 | UniApp（Vue3 + Vite 路线） | `@dcloudio/*` = `3.0.0-alpha-5020520260824002`（vue3 dist-tag） | 一套代码 → H5 + mp-weixin |
| 视图框架 | Vue 3 Composition API + `<script setup>` | ^3.5.42 | 禁用 Options API |
| 语言 | TypeScript **strict** | ^5.x（经 vue-tsc 校验） | `strict: true`，禁 `any`（显式标注除外） |
| 状态管理 | Pinia | ^4.0.3 | 答题进度/得分/结果 |
| 样式 | AI 直写 + UnoCSS 原子化 | ^66.x | 不使用成品 UI 组件库 |
| 数据 | `src/data/*.ts` 静态模块 + Zod 校验 | zod ^4.x | 数据即代码，启动时校验 |
| 雷达图 | 自研 Canvas 2D 五边形组件 | — | 禁 ECharts（体积与小程序适配成本） |
| 分享海报 | 统一 Canvas 2D 绘制 | — | H5/MP 同一套绘制函数 |
| 测试 | Vitest | ^4.x | 核心算法 + 数据校验 |
| 包管理 | pnpm（`pnpm-lock.yaml` 入库） | ^11.x，node ≥ 20 | 本地与 CI 统一 pnpm；构建脚本白名单见 `pnpm-workspace.yaml` |
| 后端 | **无** | — | 计数器/二维码用静态方案，见 specs/80 |

**版本纪律**：`@dcloudio/*` 全家桶版本必须严格一致（同一 alpha 时间戳），升级用 `npx @dcloudio/uvm` 整体升级，禁止单独升级某一个包。

**pnpm 注记**：uni 编译器依赖根路径解析，`pnpm-workspace.yaml` 必须保留 `publicHoistPattern: ['*']`；pnpm 11 的构建脚本白名单（`allowBuilds`）与发布年龄门禁（`minimumReleaseAgeExclude`）改动需谨慎并在 PR 说明。

## 2. 目录结构

```
CBTI/
├── PRD.md                      # 产品意图唯一来源（人类维护）
├── AGENTS.md                   # AI Agent 工作总则
├── specs/                      # 全部 Spec（代码的唯一依据）
├── tasks/                      # 任务拆解
├── content/                    # 内容资产（梗台词/解读/立绘 Prompt）
├── index.html                  # H5 入口
├── package.json
├── vite.config.ts
├── tsconfig.json
├── uno.config.ts
├── eslint.config.js
├── .github/workflows/ci.yml
└── src/
    ├── main.ts                 # createSSRApp 入口
    ├── App.vue
    ├── pages.json              # 路由与全局样式
    ├── manifest.json           # 应用清单（mp appid 等）
    ├── uni.scss                # 全局 SCSS 变量（桥接设计令牌）
    ├── types/index.ts          # 全部领域类型
    ├── data/
    │   ├── schemas.ts          # Zod schema（与 specs/20 逐字一致）
    │   ├── theme-split.ts      # 题材分流题（id=0）
    │   ├── questions/          # 6 类别题库，每类 15 题
    │   ├── match-lut.ts        # LUT（scripts/build-match-table.py 生成，禁手改）
    │   ├── characters.ts       # 30 组原型（56 条）
    │   └── index.ts            # 聚合 + 启动时校验导出
    ├── core/                   # 纯函数领域逻辑（零 UI 依赖，可单测）
    │   ├── scoring.ts          # 3×2 网格累加与分维阈值
    │   ├── matcher.ts          # 曼哈顿距离匹配
    │   ├── easter.ts           # 彩蛋锁定
    │   └── engine.ts           # computeResult 编排
    ├── stores/quiz.ts          # Pinia 答题状态机
    ├── components/             # 自研组件（RadarChart 等）
    ├── pages/                  # home / quiz / loading / result / poster
    ├── utils/                  # canvas、平台判断等
    └── static/                 # 静态资源（小程序码占位图等）
```

## 3. 命名规范

| 对象 | 规则 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `radar-chart.vue`、`theme-split.ts` |
| 组件名 | PascalCase | `<RadarChart />` |
| 类型/接口 | PascalCase | `Question`、`TestResult` |
| 变量/函数 | camelCase | `computeResult` |
| 常量 | SCREAMING_SNAKE | `DIMENSION_THRESHOLDS` |
| 维度/档位等领域词汇 | **只用** specs/00 定义的 key | `presence`，禁止 `presenceValue` 之外再造词 |
| CSS 类 | UnoCSS 原子类优先；自定义类用 `cbti-` 前缀 | `cbti-card` |

## 4. 代码规范（标准化模板）

- **ESLint flat config**（`eslint.config.js`）+ `@vue/tsconfig`；提交前必须 `npm run lint` 与 `npm run typecheck` 通过。
- import 顺序：node 内置 → 第三方 → `@/` 别名 → 相对路径；组间空行。
- 组件内顺序：`<script setup>`（类型 import → props/emits 定义 → store → 响应式状态 → computed → watch → 函数 → 生命周期）→ `<template>` → `<style scoped>`。
- 领域逻辑**只允许**写在 `src/core/`，且必须是纯函数（不 import vue/uni API），保证可单测、可被 AI 安全重写。
- 页面/组件只负责渲染与交互，禁止内嵌业务计算（计分、匹配、彩蛋判定一律走 core）。
- 跨端差异只允许通过 `// #ifdef H5 / #ifdef MP-WEIXIN` 条件编译或 `src/utils/platform.ts` 封装，禁止散落各处的 `uni.xxx` 能力探测。
- 注释：只为"为什么"写注释，不为"是什么"写注释；Spec 已说明的约束不重复注释，引用 spec 编号即可（如 `// 见 specs/30 §3`）。
- 禁止引入 Spec 未批准的依赖；新增依赖必须在对应 task 的验收记录里写明理由。
- Git commit 采用 Conventional Commits：`feat/fix/chore/content/spec/test: 摘要`。

## 5. 命令

```bash
pnpm dev:h5          # H5 开发
pnpm dev:mp-weixin   # 微信小程序开发（微信开发者工具打开 dist/dev/mp-weixin）
pnpm build:h5        # H5 构建（纯静态，可挂任意静态托管）
pnpm build:mp-weixin # 小程序构建
pnpm test            # Vitest（core 单测 + 数据校验）
pnpm typecheck       # vue-tsc --noEmit
pnpm lint            # ESLint
pnpm format          # Prettier 格式化
```

## 6. 平台矩阵与降级策略

| 能力 | H5 | MP | 策略 |
|------|----|----|------|
| 分享 | 复制链接 + 下载海报图 | `onShareAppMessage` + 保存海报到相册 | 见 specs/50-pages/poster.md |
| 海报二维码 | 静态小程序码图片 | 同左 | MVP 不做动态码，见 specs/80 |
| 计数器 | 不展示真实数字 | 同左 | MVP 砍掉，见 specs/50-pages/home.md |
| 立绘体积 | 本地 WebP | CDN 或分包 | 主包 ≤ 2MB，见 specs/80 |

## 7. 设计令牌单一来源

设计令牌（颜色/字号/间距/动效）的唯一来源是 **specs/40-design-system.md**；
`uno.config.ts` 与 `src/uni.scss` 必须与该文件逐字同步，改色先改 spec。
