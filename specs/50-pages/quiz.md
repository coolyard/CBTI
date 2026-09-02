# 50-pages/quiz · 答题页规范

> 路由：`pages/quiz/index`。目标：让用户笑着答完 15 题，流失率最低。

## 1. 状态机（`src/stores/quiz.ts`）

```
idle → answering(q=1..15) → finished
```

- 进入页面：根据 store 中 Q1 答案的 `targetPool` 决定加载 `questions.male` 或 `questions.female` 题库；Q1 未答则先答 Q1（两套题库 Q1 相同）。
- 每题一屏；选中即记录 `Answer { questionId, optionKey }` 并 250ms 后自动滑入下一题；支持返回上一题修改。
- 进度条：顶部 `当前题号/15`，mint 色，宽度动画。

## 2. 页面区块

| # | 区块 | 规范 |
|---|------|------|
| 1 | 进度条 | `3/15` 数字 + 条形，置于导航下方 |
| 2 | 题干卡 | 白底贴纸卡，场景标签小胶囊（如 `修仙宗门`）+ 题干（Body，行高 1.6） |
| 3 | 选项 ×4 | 贴纸选项卡纵向排列；选中态见 specs/40 §4；选项前显示 A/B/C/D 角标 |
| 4 | 上一题 | 仅文字链接，Q1 时隐藏 |

## 3. 关键规则

- **用户永远感知不到性别分流与彩蛋**：UI 不出现「男性池/彩蛋/seed」等任何元信息；`designNote`、`seedTag` 严禁渲染。
- 答完第 15 题 → `store.computeResult()` → 跳转加载页。
- 中途退出再进：恢复进度（store 持久化到 `uni.setStorageSync`，key=`cbti:progress`）。

## 4. 验收标准

- [ ] 15 题与数据文件一一对应，选项乱序不存在（顺序即数据顺序）
- [ ] 自动进题 + 可回改，回改后得分正确重算
- [ ] 切后台再进入进度不丢
- [ ] 无元信息泄漏
