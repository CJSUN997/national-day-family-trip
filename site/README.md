# 2026 国庆家庭旅行执行册

面向一家四口的普吉与曼谷旅行页面，集中展示逐日行程、实时天气、地点收藏、预订、预算和待办事项。

正式站点：<https://cjsun997.github.io/national-day-family-trip/>

## 快速开始

需要 Node.js 22.13 或更高版本。

```bash
npm ci
npm run dev
```

## 提交前验证

```bash
npm run lint
npm test
npm run pages:build
```

- `npm run lint`：检查源码规范。
- `npm test`：执行 Vinext 生产构建和服务端渲染测试。
- `npm run pages:build`：生成 GitHub Pages 静态站点。

完整的架构、数据维护、测试和发布说明见 [DEVELOPMENT.md](DEVELOPMENT.md)。

## 数据边界

待办勾选和地点星标只保存在当前浏览器。站点不上传这些状态，也不应包含证件、完整订单号或支付信息。
