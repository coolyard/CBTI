# 80 · 平台差异规范（H5 / 微信小程序）

> 所有跨端差异的**唯一登记处**。新增差异必须登记在本文件，禁止散落在代码注释里。

## 1. 差异总表

| 能力 | H5 | MP（微信小程序） | 实现位置 |
|------|----|------------------|---------|
| 分享 | 复制链接（`navigator.clipboard`，fallback `document.execCommand`） | `onShareAppMessage` + `open-type="share"` 按钮 | `src/utils/share.ts` |
| 海报保存 | `canvas.toDataURL` → `<a download>` | `uni.canvasToTempFilePath` → `uni.saveImageToPhotosAlbum` + 授权引导 | `src/components/poster/` |
| Canvas 图片加载 | `new Image()` | `canvas.createImage()` | `src/utils/canvas-image.ts` |
| RAF | `requestAnimationFrame` | canvas node 的 `requestAnimationFrame`，兜底 `setTimeout(16ms)` | `src/utils/raf.ts` |
| 本地存储 | `uni.setStorageSync`（localStorage） | 同 API（微信存储，上限 10MB） | store 内统一用 uni API |
| 路由 | hash 模式（静态托管免服务端 rewrite） | 页面栈 | `manifest.json` |
| 字体 | 系统栈 | 系统栈（小程序不支持本地字体文件入包外的自定义字体，MVP 不引网络字体） | specs/40 §3 |

## 2. 条件编译约定

- 只允许两种写法：`// #ifdef H5 / #ifdef MP-WEIXIN` 块，或 `src/utils/` 下的能力封装函数。
- 禁止在业务代码里直接判断 `uni.getSystemInfoSync().platform`。

## 3. 包体积预算（MP）

| 项 | 预算 |
|----|------|
| 主包 | ≤ 2MB（微信硬限制） |
| MP 主包立绘 | `src/static/characters/` 448 JPG（q70），56 张实测约 1.45MB；不再创建 pkg-characters/pkg-heads 子包 |
| H5 母版 | `src/pkg-characters/characters/` 640 WebP，仅 H5 构建/开发服务使用 |
| 决策 | MP 真机资源必须进主包；本地图片使用 JPG/PNG，避免 iOS 真机 WebP `getLocalImgData` 失败 |

## 4. 静态资源清单

| 资源 | 路径 | 状态 |
|------|------|------|
| 小程序码占位图 | `src/static/mp-code.png` | MVP 占位，发布前替换真实静态码 |
| MP 主包立绘 | `src/static/characters/` | 448 JPG，56 张 |
| H5 立绘母版 | `src/pkg-characters/characters/` | 640 WebP，56 张 |

## 5. 发布检查单

- [ ] `build:h5` 产物可纯静态部署（hash 路由，无 SSR）
- [ ] `build:mp-weixin` 在微信开发者工具无警告通过
- [ ] 真机（iOS + Android 微信）跑通完整流程
- [ ] manifest.json 已填真实小程序 AppID
- [ ] mp-code.png 已替换真实小程序码
