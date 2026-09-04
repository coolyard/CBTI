# CBTI · 角色人格指标

> MBTI 测的是人格，CBTI 测的是灵魂角色。

CBTI（Character-Based Type Indicator）是一个纯前端的娱乐人格测试：先选择穿越世界，再答该题材 15 道双维情境题，生成 5 维灵魂数据指纹，经分维阈值与均衡 LUT 匹配 30 组灵魂原型（56 条角色记录），最终给你一张可截图、可分享的「灵魂角色身份证」。

一套 UniApp + Vue3 + TypeScript 代码同时产出 H5 与微信小程序，零后端、无 SSR/SSG。

## 功能

- 首页：品牌区、热门角色自动轮播、开始/继续测试
- 答题页：1 屏题材分流 + 15 屏类别计分题、250ms 自动进题、可回改、进度持久化
- 加载页：打字机文案 + 纯 CSS 灵魂扫描动画 + 5s 超时兜底
- 结果页：灵魂身份证、自研五维雷达图、数值条、标签、扎心解读、平行宇宙、灵魂近亲、操作区
- 分享海报：Canvas 2D 自研绘制，H5 下载 PNG，小程序保存相册
- 分享链路：H5 复制链接，小程序 `onShareAppMessage` + `open-type="share"`
- 彩蛋：题 7/11 双题同种子可锁定哪吒、悟空、精卫或女娲（按题材归池）

## 技术栈

| 层 | 选型 |
| --- | --- |
| 跨端框架 | UniApp（Vue3 + Vite 路线） |
| 视图 | Vue 3 Composition API + `<script setup>` |
| 语言 | TypeScript（strict，禁 `any`） |
| 状态管理 | Pinia |
| 样式 | 手写 CSS + UnoCSS 原子类，自研设计令牌 |
| 数据校验 | Zod，启动时 fail-fast |
| 测试 | Vitest（核心算法、数据校验、资产清单） |
| 图表/海报 | 自研 Canvas 2D，禁 ECharts / html2canvas / 成品 UI 库 |

## 环境要求

- Node.js ≥ 22.13（`pnpm@11.24.0` 的最低要求）
- pnpm ≥ 11.24

## 快速开始

```bash
pnpm install
```

开发：

```bash
pnpm dev:h5          # H5 开发
pnpm dev:mp-weixin   # 微信小程序开发
```

构建：

```bash
pnpm build:h5        # 产物：dist/build/h5
pnpm build:mp-weixin # 产物：dist/build/mp-weixin
```

质量门禁：

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test
```

## 项目结构

```text
src/
├── core/                # 纯函数领域逻辑：计分、匹配、彩蛋、编排
├── data/                # 题库、角色库、Zod schema、资产清单
├── stores/              # Pinia 答题状态机
├── components/          # 自研组件：RadarChart、drawPoster
├── pages/               # home / quiz / loading / result / poster
├── pkg-characters/      # 微信分包：54 张立绘 + 分包占位页
├── utils/               # 跨端封装：图片加载、分享、资产路径
├── static/              # 小程序码占位图等静态资源
├── pages.json
├── manifest.json
└── uni.scss             # 设计令牌 CSS 变量桥接

content/                 # 内容管线产物：台词、解读、平行宇宙、标签、立绘 Prompt
specs/                   # 全部 Spec，代码与内容的唯一依据
tasks/                   # 主链路与内容管线任务卡
```

## 核心流程

1. 用户先选题材世界，再答该题材 15 道题；每题 6 个选项，分值来自 3×2 双维网格
2. 每维度 6 次得分累加为原始总分，再按各维 MIN/MAX 归一化到 `dimensionScore`
3. 原始总分对照分维阈值生成 5 位模式串，例如 `H-H-M-L-H`
4. 主结果查 `match-lut.ts` 均衡 LUT；灵魂近亲取池内曼哈顿距离次近角色
5. 题 7/11 同选同一种子时触发对应彩蛋角色

## 页面

| 页面 | 说明 |
| --- | --- |
| 首页 | 品牌区 + 热门角色轮播 + 开始/继续测试 |
| 答题页 | 15 题一屏一题，自动进题，可回改 |
| 加载页 | 2.2–3s 打字机文案 + 扫描动画 + 分包预下载 |
| 结果页 | 8 个区块：身份证 → 雷达图 → 数值条 → 标签 → 解读 → 平行宇宙 → 近亲 → 操作区 |
| 海报页 | 750×1334 Canvas 海报预览与导出 |

## 内容管线

当前仓库已完成 52 个常规角色与 27/28 男池隐藏角色的内容定稿；精卫/女娲内容字段待内容管线补充：

- `content/quotes.md`：经典梗台词
- `content/interpretations.md`：四段式扎心解读
- `content/parallel-universes.md`：现代平行宇宙
- `content/tags.md`：灵魂标签
- `content/illustration-prompts.md`：立绘 Prompt

内容已回写 `src/data/characters.ts`；内容完整度校验在内容管线阶段单独启用。

## 立绘与分包

- 54 张在库 WebP 立绘位于 `src/pkg-characters/characters/`；#29/#30 资产待补
- 命名规则：`char-{原型两位补零}-{male|female}.webp`
- 微信小程序按分包 `pkg-characters` 打包，当前总量约 1.83MB，低于 2MB 上限
- 加载页进入时在 MP 端预下载分包，H5 不执行
- 首页/海报均有「立绘失败回退首字符占位」的降级逻辑；结果页按 specs/45 采用白底贴纸卡立绘

## 任务状态

- 主链路 T01–T15：`[x]` 完成
- v4.0 改版 T16–T20：`[x]` 完成（摘要见 `tasks/v1.0-tasks.md`）
- 内容管线 C01–C07：`[x]` 完成

详细验收见：

- [tasks/v1.0-tasks.md](tasks/v1.0-tasks.md)
- [tasks/content-tasks.md](tasks/content-tasks.md)
- [PRD.md](PRD.md)

## 文档

- 术语表：[specs/00-glossary.md](specs/00-glossary.md)
- 架构规范：[specs/10-architecture.md](specs/10-architecture.md)
- 数据契约：[specs/20-data-schema.md](specs/20-data-schema.md)
- 计分算法：[specs/30-scoring-algorithm.md](specs/30-scoring-algorithm.md)
- 设计系统：[specs/40-design-system.md](specs/40-design-system.md)
- 页面规范：[specs/50-pages](specs/50-pages)
- 雷达图组件：[specs/55-components/radar-chart.md](specs/55-components/radar-chart.md)
- 内容语气：[specs/60-content-tone.md](specs/60-content-tone.md)
- 视觉资产：[specs/70-assets.md](specs/70-assets.md)
- 跨端差异：[specs/80-platform-notes.md](specs/80-platform-notes.md)
