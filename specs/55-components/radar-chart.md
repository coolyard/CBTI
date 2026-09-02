# 55 · 自研组件规范：五维雷达图（RadarChart）

> 结果页核心视觉。**自研 Canvas 2D 实现，禁用 ECharts**。本文件定义到可直接实现的颗粒度。

## 1. 组件契约

```vue
<RadarChart
  :user-values="[8.5, 6, 4, 2, 9]"      <!-- number[5]，1.0–10.0，顺序见 specs/00 §2 -->
  :character-values="[9, 9, 5, 2, 9]"   <!-- number[5]，由角色模式串经 CHARACTER_ANCHOR 换算 -->
  character-name="高启强"
  :size="320"                            <!-- CSS px，正方形；默认父容器宽度，上限 320 -->
  :animate="true"                        <!-- 入场生长动画 -->
/>
```

- Props 校验：数组长度必须 5；值域 0–10，越界 clamp。
- 无外部依赖；渲染失败降级为文字列表（见 §7）。

## 2. 几何定义

- 画布为正方形，逻辑边长 `S`；中心 `C = (S/2, S/2)`。
- 标签区外边距 `labelMargin` 默认 44，但必须按 §3 层 5 的标签实际宽度**自适应放大**（侧向最宽标签 + 12px 余量为下限），重算 `R = S/2 − labelMargin`，确保标签完整落在画布内。
- 第 i 个维度（i = 0..4，顺序固定 presence→cognition→emotion→order→endurance）：
  - 轴角度 `θ(i) = (−90 + 72 × i)°`（presence 在正上方，顺时针排列）
  - 值 v 对应点：`P(v, i) = ( Cx + R·(v/10)·cosθ, Cy + R·(v/10)·sinθ )`

## 3. 绘制清单（自下而上）

| 层 | 内容 | 样式 |
|----|------|------|
| 1 | 5 个同心五边形网格，v = 2/4/6/8/10 | `stroke: ink @ 12%`，1px；最外圈 `ink @ 30%` |
| 2 | 5 条轴线（中心 → R） | `ink @ 12%`，1px |
| 3 | 角色五边形（character-values） | `stroke: accent(#FFC224)`，2.5px，虚线 `[8, 6]`；不填充；顶点不画点 |
| 4 | 用户五边形（user-values） | `fill: primary(#7C4DFF) @ 30%`；`stroke: primary`，3px，实线；顶点画 `r=4` 实心圆（白心 + primary 描边 2px） |
| 5 | 维度标签 ×5 | 文案 `存在感 8.5`（量词名+数值）；位置 = `P(R + 26, i)`；字号 24rpx 等效（`S/13.3`）；`textAlign` 按象限自适应（θ 在左半 → right，右半 → left，顶部 → center）；**标签包围盒必须完整落在 [0, S] 内**——用 `measureText` 量宽，先按 §2 自适应放大 labelMargin 重算 R，仍不足时 clamp 标签锚点兜底 |
| 6 | 图例（底部一行） | 实心紫线 = 「你」；虚线黄线 = 角色名；居中 |

## 4. 动画

- 入场：progress 0→1，600ms，`cubic-bezier(0.34, 1.56, 0.64, 1)`。
- 实现：用户/角色多边形顶点 = `P(v × progress, i)`；标签与网格不参与动画。
- `animate=false`（海报复用场景）直接画终态。
- 小程序端用 `requestAnimationFrame` 等价物（`canvas.requestAnimationFrame` 或 `setTimeout(16)` 兜底）。

## 5. Canvas 技术规范（跨端）

- 统一使用 `<canvas type="2d" :id="canvasId">` + `uni.createSelectorQuery()` 取 node；**禁用旧版 `uni.createCanvasContext` API**。
- DPR 处理：`canvas.width = S × dpr; canvas.height = S × dpr; ctx.scale(dpr, dpr)`；dpr 取 `uni.getWindowInfo().pixelRatio`。
- 尺寸监听：props.size 变化 → 重新取 node 并重绘。
- **纯绘制函数与组件分离**：`src/components/radar/draw-radar.ts` 导出
  `drawRadar(ctx: CanvasRenderingContext2D, size: number, data: RadarData, opts?: { animate?: boolean; progress?: number })`。
  组件只是它的宿主；**分享海报用同一函数在离屏 canvas 上重画**（见 specs/50-pages/poster.md）。

## 6. 数据来源

- 用户线：`TestResult.dimensionScores`（1.00–10.00，直接入图）。
- 角色线：角色 `pattern` 五位 → `CHARACTER_ANCHOR { L: 2, M: 5, H: 9 }`。

## 7. 降级与异常

- canvas node 获取失败 / 绘制抛错 → 渲染降级 UI：五行文字「维度名 + 用户值 + 角色档位数」，样式同标签（见 specs/92）。
- 数据非法（长度 ≠ 5）→ 控制台报错 + 降级 UI，不白屏。

## 8. 验收标准

1. H5 与微信小程序两端渲染**视觉一致**（同尺寸截图对比：网格、双线、标签位置、图例齐全）。
2. 动画 600ms 生长无掉帧感；`animate=false` 瞬间呈现。
3. 高分屏（dpr=2/3）线条不糊。
4. 用户线与角色线重合时仍能分辨：按 §3 层序，角色黄色虚线在下、用户紫色半透明面在上，用户面 30% 透明度保证虚线透出可见。
5. 海报 canvas 中复用 `drawRadar` 输出与组件一致。
6. 五维标签（量词名+分数）与图例在任何 S ≤ 320 下完整可见、不被画布边缘裁切；标签/图例布局抽为纯函数并配单测：断言全部包围盒 ∈ [0, S]（覆盖最长文案：量词名 3 字 + `10.0`）。
