# ARCHITECTURE · 架构总览（宪法层）

> 本文件是架构的**人类可读入口**。可执行的细节约束在 [specs/10-architecture.md](specs/10-architecture.md)；两者冲突时以 spec 为准。
> 维护规则：由 AI Agent 依据 specs/ 生成与更新；人类通过修改 PRD/specs 间接驱动它变更。

## 1. 架构原则（不可妥协）

| # | 原则 | 含义 |
|---|------|------|
| 1 | **零后端** | 纯前端静态应用；无服务器、无数据库、运行时零 AI 调用 |
| 2 | **Spec 是唯一真实源** | 代码必须可追溯到某条 spec；spec 未覆盖的决策最小惊讶并登记 |
| 3 | **core 纯净** | 业务逻辑只存在于 `src/core/` 纯函数，不依赖 vue/uni，100% 可单测 |
| 4 | **双端同构** | 一套代码出 H5 + 微信小程序；差异只在 specs/80 登记处内处理 |
| 5 | **数据即代码** | 题库/角色库为 TS 静态模块 + Zod 启动校验，fail-fast |

## 2. 系统结构

```
┌─────────────── pages（home/quiz/loading/result/poster）──────────────┐
│  只负责渲染与交互，禁止内嵌业务计算                                     │
└───────────────┬──────────────────────────────────┬─────────────────┘
                │                                  │
        stores/quiz.ts                     components/
        答题状态机、进度持久化              RadarChart / drawPoster
                │                          （纯绘制函数与宿主组件分离）
                ▼                                  │
        ┌──────────── core（纯函数）───────────────▼────────────┐
        │  scoring 计分阈值 → matcher LUT/近亲 → easter 彩蛋锁定  │
        │  engine.computeResult 编排                              │
        └──────────────────────▲────────────────────────────────┘
                               │
        ┌──────────────────────┴────────────────────────────────┐
        │  data：theme-split + category/{xiuxian..dushi} + LUT     │
        │  + characters + index.ts 顶层 Zod 校验                   │
        │  index.ts 顶层 Zod 校验，非法数据启动即崩                │
        └─────────────────────────────────────────────────────────┘
```

## 3. 模块职责

| 模块 | 职责 | 禁止 |
|------|------|------|
| `src/pages/` | 页面渲染、交互、跳转 | 业务计算 |
| `src/stores/` | 状态机、持久化、调用 core | 计分/匹配规则本身 |
| `src/core/` | 计分、匹配、彩蛋（纯函数） | 任何 vue/uni/DOM 依赖 |
| `src/data/` | 静态数据 + schema 校验 | 逻辑 |
| `src/components/` | 自研组件；绘制逻辑抽纯函数 | 直接写死文案数据 |
| `src/utils/` | 跨端能力封装（share/canvas/raf/logger） | 业务规则 |

## 4. 关键机制速查

| 机制 | 规范位置 | 实现位置 |
|------|---------|---------|
| 计分与匹配算法 | specs/30 | `src/core/` |
| 数据契约 | specs/20 | `src/data/schemas.ts` |
| 雷达图 | specs/55 | `src/components/radar/`（T10） |
| 海报绘制 | specs/50-pages/poster.md | `src/components/poster/`（T12） |
| 跨端差异 | specs/80 | `src/utils/` + 条件编译 |
| 错误处理 | specs/92 | 全链路 |

## 5. 技术栈基线

UniApp（Vue3 + Vite 5.2.8）+ TypeScript strict + Pinia + UnoCSS + Zod + Vitest + pnpm。
版本纪律与完整命令见 specs/10 §1/§5。

## 6. 立绘资产策略

- MP 主包：`src/static/characters/` 存放 448×448 JPG（q70），微信真机只允许引用主包资源，且本地图不使用 WebP（iOS 真机 `getLocalImgData` 失败）。
- H5 母版：`src/pkg-characters/characters/` 保留 640×640 WebP，作为 H5 高清资源；`vite.config.ts` 只向 H5 产物拷贝，不进入 MP。
- 路径分流：`src/utils/character-asset.ts` 用条件编译返回 `/static/characters/*.jpg`（MP）或 `/pkg-characters/characters/*.webp`（H5）。
- 圆形头像：不再生成 `pkg-heads` 头图；结果页灵魂近亲使用整立绘 + `src/utils/head-crop.ts` 的 CSS 裁切，裁切参数与历史脚本同源。
