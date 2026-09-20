import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the updated family travel planner", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /向南，再向北/);
  assert.match(html, /CA581/);
  assert.match(html, /普吉3晚/);
  assert.match(html, /曼谷3晚/);
  assert.match(html, /上海组 · 1人/);
  assert.match(html, /北京组 · 3人/);
  assert.match(html, /LIVE WEATHER/);
  assert.match(html, /Open-Meteo/);
  assert.match(html, /FAVORITES/);
  assert.match(html, /手机端主导航/);
  assert.match(html, /地点收藏/);
  assert.match(html, /实用收藏/);
  assert.match(html, /帖子文字速览/);
  assert.match(html, /炒面约 70 THB/);
  assert.match(html, /13 kg (档)?温水洗/);
  assert.match(html, /6 层老楼/);
  assert.match(html, /地图与地点列表合并展示/);
  assert.match(html, /普吉默认位置/);
  assert.match(html, /区域锚点/);
  assert.match(html, /个精确点/);
  assert.match(html, /个区域锚点/);
  assert.match(html, /个城市默认点/);
  assert.match(html, /小红书：/);
  assert.match(html, /展开小红书摘要/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /小红书原帖/);
  assert.match(html, /收藏更新注意事项/);
  assert.match(html, /打开泰国专辑/);
  assert.match(html, /43篇笔记已整理/);
  assert.match(html, /xiaohongshu\.com\/explore\/6aa76ff7000000000b00d5a2/);
  assert.match(html, /查看5日预报/);
  assert.match(html, /筛选待办清单/);
  assert.match(html, /仅看星标/);
  assert.match(html, /咖啡酒吧/);
  assert.match(html, /地图 ↗/);
  assert.match(html, /MF864/);
  assert.match(html, /普吉岛卡塔度假酒店/);
  assert.match(html, /10月10日/);
  assert.match(html, /不去大皇宫/);
  assert.doesNotMatch(html, /人妖秀|乌布|努沙杜瓦|巴厘岛|SUNCHANG/);
  assert.doesNotMatch(html, /地图查看|分类查看|路线点列表/);
  assert.doesNotMatch(html, /xsec_token|share_id|appuid/);
  assert.doesNotMatch(
    html,
    /codex-preview|Your site is taking shape|react-loading-skeleton/i,
  );
});
