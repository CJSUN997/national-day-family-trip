# 开发说明

本文档描述旅行执行册的代码结构、数据维护方式、验证流程和两条发布链路。

## 1. 技术栈

- React 19 + TypeScript
- Vinext / Vite
- Leaflet + OpenStreetMap 地图
- Open-Meteo 天气接口
- Cloudflare Worker 兼容构建
- GitHub Pages 静态发布
- OpenAI Sites 私有发布

项目使用 npm 和 `package-lock.json`。不要混用其他包管理器，也不要手动编辑构建产物。

## 2. 目录结构

```text
site/
├─ app/
│  ├─ layout.tsx              全局 HTML、SEO 和分享元数据
│  ├─ page.tsx                页面骨架与顶层交互状态
│  ├─ itinerary-data.ts       行程、导航和待办数据
│  ├─ map-data.ts             地图点位、分类和收藏资源
│  ├─ favorite-details.ts     收藏条目的详细摘要
│  ├─ ui-components.tsx       通用展示组件
│  ├─ map-section.tsx         地图、筛选和收藏交互
│  ├─ weather-section.tsx     实时天气与预报
│  └─ globals.css             全站样式
├─ pages/
│  ├─ index.html              GitHub Pages HTML 入口与静态元数据
│  └─ main.tsx                客户端入口，复用 app/page.tsx
├─ public/                    图标和分享图片
├─ tests/                     服务端渲染测试
├─ worker/                    Vinext Worker 入口
├─ build/                     Sites 构建辅助代码
├─ .openai/hosting.json       Sites 项目与资源声明
├─ vite.config.ts             Vinext / Sites 构建配置
└─ vite.pages.config.ts       GitHub Pages 构建配置
```

`dist/`、`pages-dist/`、`.next/`、`.wrangler/` 和 `node_modules/` 均为生成目录，不应直接修改或提交。

## 3. 模块依赖

```text
layout.tsx
 └─ globals.css

page.tsx
 ├─ itinerary-data.ts
 ├─ ui-components.tsx
 ├─ map-section.tsx
 │   ├─ map-data.ts
 │   │   └─ favorite-details.ts
 │   └─ ui-components.tsx
 └─ weather-section.tsx
     └─ ui-components.tsx

pages/main.tsx
 └─ app/page.tsx
```

`page.tsx` 只负责页面编排和跨区块状态。功能内部状态应留在对应模块，静态内容应留在数据文件中。

## 4. 本地开发

### 环境要求

- Node.js `>=22.13.0`
- npm（使用仓库内锁文件）

### 首次安装

```bash
cd site
npm ci
```

### 启动开发环境

```bash
npm run dev
```

### 可用脚本

| 脚本 | 用途 | 输出 |
| --- | --- | --- |
| `npm run dev` | 启动 Vinext 开发环境 | 本地服务 |
| `npm run build` | 构建 Vinext / Sites 版本 | `dist/` |
| `npm start` | 启动生产构建 | 使用 `dist/` |
| `npm run lint` | 检查 TypeScript 和 React 代码 | 无 |
| `npm test` | 构建并运行服务端渲染测试 | `dist/` |
| `npm run pages:build` | 构建 GitHub Pages 版本 | `pages-dist/` |

## 5. 内容和资源维护

### 修改逐日行程

编辑 `app/itinerary-data.ts` 中的 `days`。每一天包含日期、城市、标题、节奏、说明和时间线事件。

同时检查以下位置是否需要同步：

- `app/page.tsx` 中的首页摘要、路线卡片和预订信息。
- 根目录 `计划/行程.md`。
- `tests/rendered-html.test.mjs` 中与关键文案有关的断言。

### 修改待办事项

编辑 `app/itinerary-data.ts` 中的 `tasks`。任务 ID 必须稳定，因为完成状态以 ID 保存在浏览器中。

以下三个任务在页面中被视为已确认且不可取消：

- `outbound`
- `return_sh`
- `hotel_phuket`

如果业务规则改变，需要同步修改 `app/page.tsx` 中的默认值和禁用逻辑。

### 修改地图地点

编辑 `app/map-data.ts`：

- `mapSpots`：正式行程点。
- `placeFavorites`：地点收藏。
- `favoriteLocations`：收藏坐标和坐标精度。
- `spotCategories`：地图分类和颜色。
- `practicalFavorites`：交通、支付、购物等实用收藏。

新增地点时至少检查：唯一 ID、城市、分类、坐标、Google Maps 查询词和来源链接。无法精确核验坐标时，应明确使用区域锚点或城市默认点，不要伪造精确位置。

### 修改收藏摘要

编辑 `app/favorite-details.ts`。摘要资源与地图数据通过收藏 ID 对应。若添加截图，只能引用 `public/` 下的本地资源，并补充替代文本、尺寸、来源和保存日期。

### 修改天气地点

编辑 `app/weather-section.tsx` 中的 `weatherPlaces`。天气请求使用 Open-Meteo，无需 API Key。修改字段时同时检查 `WeatherResponse` 类型和错误状态。

### 修改样式

样式目前集中在 `app/globals.css`。新增样式优先放在所属区块附近，并保持桌面端、`540px` 以下移动端和触控状态一致。

## 6. 浏览器本地状态

站点只使用浏览器本地存储保存个人操作：

| Key | 内容 | 使用位置 |
| --- | --- | --- |
| `thai-trip-v7-checks` | 待办完成状态 | `app/page.tsx` |
| `thai-trip-map-favorites` | 地图收藏 ID | `app/map-section.tsx` |

修改 Key 会让现有用户的本地状态失效。除非确实需要迁移，不要随意更名。

## 7. 验证要求

提交前依次运行：

```bash
npm run lint
npm test
npm run pages:build
```

最低验收标准：

1. lint 无错误和警告。
2. Vinext 生产构建成功。
3. 服务端渲染测试通过。
4. GitHub Pages 静态构建成功。
5. `git diff --check` 不报告空白错误。

当前自动化测试主要验证关键内容能够服务端渲染，并防止敏感分享参数进入页面。新增复杂交互时，应补充针对筛选、收藏或本地状态的测试。

## 8. 发布流程

### GitHub Pages 正式站点

推送 `main` 后，`.github/workflows/pages.yml` 会执行：

1. 安装锁定依赖。
2. 运行 `npm run pages:build`。
3. 上传 `site/pages-dist`。
4. 发布到 GitHub Pages。

正式地址：<https://cjsun997.github.io/national-day-family-trip/>

当前工作流只执行静态构建，因此本地仍须完成 lint 和 `npm test`。

### OpenAI Sites

`.openai/hosting.json` 保存 Sites 项目标识及可选资源声明。当前 `d1` 和 `r2` 均为 `null`，站点不使用数据库或对象存储。

Sites 构建使用 `npm run build`，产物位于 `dist/`。不要手动修改项目标识，也不要在配置文件中保存密钥或运行时变量。

## 9. 代码维护约定

- 页面组件不要重新混入大段静态数据。
- 跨模块共享的类型应定义在最接近数据源的位置。
- 不复制 GitHub Pages 专用页面；`pages/main.tsx` 必须继续复用 `app/page.tsx`。
- 不提交构建产物、缓存、个人附件或敏感信息。
- 删除代码前先确认没有被 Vinext、GitHub Pages 或 Worker 构建链路引用。
- 依赖变更必须同步更新 `package.json` 和 `package-lock.json`。
- 重要数据更新应在提交说明中写明影响范围，例如“更新曼谷酒店与接送信息”。

## 10. 常见问题

### 地图没有显示

确认 Leaflet 依赖已安装，并检查地点坐标是否为有效的 `[纬度, 经度]`。地图模块只在对应移动面板激活后初始化。

### 天气没有加载

天气依赖浏览器访问 Open-Meteo。网络失败时页面会显示可恢复的错误提示，不应阻塞其余行程内容。

### GitHub Pages 路径错误

静态构建的基础路径固定为 `/national-day-family-trip/`。仓库名或 Pages 路径变化时，需要同步修改 `vite.pages.config.ts` 和静态分享元数据。

### 本地构建正常但正式站点未更新

检查 GitHub Actions 中 `Deploy travel planner to GitHub Pages` 工作流，并确认最新运行对应当前 `main` 提交。
