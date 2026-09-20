import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
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
  assert.match(html, /TRIP MAP/);
  assert.match(html, /Google Maps/);
  assert.match(html, /MF864/);
  assert.match(html, /普吉岛卡塔度假酒店/);
  assert.match(html, /10月10日/);
  assert.match(html, /不去大皇宫/);
  assert.doesNotMatch(html, /人妖秀|乌布|努沙杜瓦|巴厘岛|SUNCHANG/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});
