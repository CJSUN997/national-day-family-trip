# 2026 国庆家庭旅行执行册

面向一家四口的普吉与曼谷旅行页面，集中展示逐日行程、实时天气、地点收藏、预订、预算和待办事项。

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm ci
npm run dev
```

## 验证

```bash
npm run lint
npm test
npm run pages:build
```

- `npm test` 验证 Vinext 生产构建和服务端渲染内容。
- `npm run pages:build` 验证 GitHub Pages 静态版本。

## 代码结构

- `app/page.tsx`：页面骨架和顶层交互状态。
- `app/itinerary-data.ts`：逐日行程、移动导航和待办数据。
- `app/map-data.ts`：地图点位、地点收藏与实用收藏数据。
- `app/ui-components.tsx`：标题、航班卡片和移动导航图标。
- `app/map-section.tsx`：地图、收藏筛选和收藏摘要。
- `app/weather-section.tsx`：实时天气与预报。
- `app/favorite-details.ts`：收藏条目的详细摘要资源。
- `pages/`：GitHub Pages 的轻量入口，复用 `app/` 中的页面。
- `worker/`、`build/`、`.openai/`：Sites/Vinext 构建与托管基础设施。

用户的待办勾选和地点星标只保存在当前浏览器，不会上传到服务器。
