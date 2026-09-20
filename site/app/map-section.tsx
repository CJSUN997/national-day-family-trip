"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  placeFavoriteDetails,
  practicalFavoriteDetails,
  type FavoriteDigest,
} from "./favorite-details";
import {
  SpotCategory,
  MapSpot,
  PracticalFavorite,
  spotCategories,
  mapSpots,
  placeFavorites,
  mappedFavoriteSpots,
  mergedMapSpots,
  defaultLocationCount,
  verifiedLocationCount,
  regionalLocationCount,
  spotSummary,
  practicalFavorites,
} from "./map-data";
import { Heading } from "./ui-components";

function googlePlaceUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function googleRouteUrl(spots: MapSpot[]) {
  if (spots.length < 2) return googlePlaceUrl(spots[0]?.query || "Thailand");
  const origin = encodeURIComponent(spots[0]!.query);
  const destination = encodeURIComponent(spots[spots.length - 1]!.query);
  const middle = spots
    .slice(1, -1)
    .map((x) => x.query)
    .join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${middle ? `&waypoints=${encodeURIComponent(middle)}` : ""}&travelmode=driving`;
}

function FavoriteDigestPanel({
  digest,
  sourceUrl,
  secondaryUrl,
  secondaryLabel,
}: {
  digest?: FavoriteDigest;
  sourceUrl: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
}) {
  if (!digest) return null;

  return (
    <details className="favorite-digest">
      <summary>
        <span>帖子文字速览</span>
        <small>留在当前页查看</small>
      </summary>
      <div className="favorite-digest-body">
        <small>原帖主题</small>
        <h4>{digest.sourceTitle}</h4>
        <ul>
          {digest.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <p>
          <b>本次怎么用</b>
          {digest.tripUse}
        </p>
        {digest.verify && (
          <p className="digest-verify">
            <b>临行核验</b>
            {digest.verify}
          </p>
        )}
        <div className="digest-links">
          <a
            className="xhs-link"
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            小红书原帖 ↗
          </a>
          {secondaryUrl && (
            <a
              href={secondaryUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {secondaryLabel || "补充笔记"} ↗
            </a>
          )}
        </div>
      </div>
    </details>
  );
}

function InlineFavoriteDigest({
  digest,
  locationNote,
  sourceUrl,
}: {
  digest: FavoriteDigest;
  locationNote?: string;
  sourceUrl?: string;
}) {
  return (
    <div className="spot-digest-drawer">
      <small>小红书原帖摘要</small>
      <h4>{digest.sourceTitle}</h4>
      <ul>
        {digest.facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
      <p>
        <b>本次怎么用</b>
        {digest.tripUse}
      </p>
      {digest.verify && (
        <p className="digest-verify">
          <b>临行核验</b>
          {digest.verify}
        </p>
      )}
      {locationNote && (
        <p className="digest-location">
          <b>位置说明</b>
          {locationNote}
        </p>
      )}
      {digest.screenshot && (
        <figure className="rednote-screenshot">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={digest.screenshot.src}
              alt={digest.screenshot.alt}
              width={digest.screenshot.width}
              height={digest.screenshot.height}
              loading="lazy"
            />
          </a>
          <figcaption>
            原帖内容截图
            {digest.screenshot.capturedAt
              ? ` · 保存于 ${digest.screenshot.capturedAt}`
              : ""}
          </figcaption>
        </figure>
      )}
    </div>
  );
}

export function TripMap({ mobileActive = false }: { mobileActive?: boolean }) {
  const holder = useRef<HTMLDivElement | null>(null);
  const [collectionView, setCollectionView] = useState<"map" | "practical">(
    "map",
  );
  const [mapScope, setMapScope] = useState<
    "全部" | "行程点" | "普吉收藏" | "曼谷收藏"
  >("全部");
  const [activeDay, setActiveDay] = useState("全部");
  const [activeCategory, setActiveCategory] = useState<"全部" | SpotCategory>(
    "全部",
  );
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [expandedSpotId, setExpandedSpotId] = useState<string | null>(null);
  const [practicalStage, setPracticalStage] = useState<
    "全部" | PracticalFavorite["stage"]
  >("全部");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(
        localStorage.getItem("thai-trip-map-favorites") || "[]",
      );
    } catch {
      return [];
    }
  });
  const scopeFiltered = useMemo(
    () =>
      mergedMapSpots.filter((spot) => {
        const favoriteKey = spot.favoriteId || spot.id;
        const scopeMatched =
          mapScope === "全部" ||
          (mapScope === "行程点" && !spot.sourceKind) ||
          (mapScope === "普吉收藏" &&
            spot.sourceKind === "收藏点" &&
            spot.city === "普吉") ||
          (mapScope === "曼谷收藏" &&
            spot.sourceKind === "收藏点" &&
            spot.city === "曼谷");
        const dayMatched =
          mapScope !== "行程点" ||
          activeDay === "全部" ||
          spot.day === activeDay;
        return (
          scopeMatched &&
          dayMatched &&
          (!favoritesOnly || favorites.includes(favoriteKey))
        );
      }),
    [activeDay, favoritesOnly, favorites, mapScope],
  );
  const filtered = useMemo(
    () =>
      scopeFiltered.filter(
        (spot) =>
          activeCategory === "全部" || spot.category === activeCategory,
      ),
    [activeCategory, scopeFiltered],
  );
  const filteredPractical = useMemo(
    () =>
      practicalFavorites.filter(
        (item) =>
          (practicalStage === "全部" || item.stage === practicalStage) &&
          (!favoritesOnly || favorites.includes(item.id)),
      ),
    [favorites, favoritesOnly, practicalStage],
  );
  const dates = ["全部", ...Array.from(new Set(mapSpots.map((x) => x.day)))];
  const mapFavoriteCount = mergedMapSpots.filter((spot) =>
    favorites.includes(spot.favoriteId || spot.id),
  ).length;

  useEffect(() => {
    if (!holder.current || collectionView !== "map") return;
    const isMobile = window.matchMedia("(max-width: 540px)").matches;
    if (isMobile && !mobileActive) return;
    let cancelled = false;
    let map: import("leaflet").Map | undefined;
    void import("leaflet").then((L) => {
      if (cancelled || !holder.current) return;
      map = L.map(holder.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const bounds: [number, number][] = [];
      filtered.forEach((spot, index) => {
        const point: [number, number] = [spot.lat, spot.lon];
        bounds.push(point);
        const color =
          spotCategories.find((x) => x.name === spot.category)?.color ||
          "#173a35";
        const icon = L.divIcon({
          className: "trip-marker",
          html: `<span style="background:${color}"><i>${index + 1}</i></span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });
        const sourceLink = spot.sourceUrl
          ? `<br><a href="${spot.sourceUrl}" target="_blank" rel="noopener noreferrer">小红书原帖 ↗</a>`
          : "";
        const sourceLabel = spot.sourceKind || "行程点";
        const locationLabel = spot.locationStatus
          ? ` · ${spot.locationStatus}`
          : "";
        const locationNote = spot.locationNote
          ? `<br><small>位置说明：${spot.locationNote}</small>`
          : "";
        L.marker(point, { icon })
          .addTo(map!)
          .bindPopup(
            `<b>${spot.name}</b><br><small>${sourceLabel} · ${spot.category} · ${spot.city}${locationLabel} · ${spotSummary(spot)}</small>${locationNote}<br><a href="${googlePlaceUrl(spot.query)}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a>${sourceLink}`,
          );
      });
      if (bounds.length === 0) map.setView([10.7, 99.5], 6);
      else if (bounds.length === 1) map.setView(bounds[0]!, 12);
      else map.fitBounds(bounds, { padding: [28, 28] });
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [collectionView, filtered, mobileActive]);

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];
    setFavorites(next);
    localStorage.setItem("thai-trip-map-favorites", JSON.stringify(next));
  };

  return (
    <section
      className={`trip-map-section mobile-panel ${mobileActive ? "mobile-active" : ""}`}
      id="map"
    >
      <div className="shell">
        <Heading
          index="03 · FAVORITES"
          title={<>地点收藏</>}
          text="地图与地点列表合并展示；小红书地点直接补充帖子摘要。星标仅保存在当前设备。"
        />
        <div className="collection-meta">
          <span>43篇笔记已整理</span>
          <span>2026.09.20 核验</span>
          <a
            href="https://www.xiaohongshu.com/board/6aa5053a000000002402ea22"
            target="_blank"
            rel="noopener noreferrer"
          >
            打开泰国专辑 ↗
          </a>
        </div>
        <div className="collection-switch" aria-label="收藏夹分类">
          <button
            className={collectionView === "map" ? "active" : ""}
            onClick={() => setCollectionView("map")}
            aria-pressed={collectionView === "map"}
          >
            <b>地点收藏</b>
            <small>{placeFavorites.length}</small>
          </button>
          <button
            className={collectionView === "practical" ? "active" : ""}
            onClick={() => setCollectionView("practical")}
            aria-pressed={collectionView === "practical"}
          >
            <b>实用收藏</b>
            <small>{practicalFavorites.length}</small>
          </button>
        </div>

        <div
          className={`collection-panel ${collectionView === "map" ? "active" : ""}`}
          aria-hidden={collectionView !== "map"}
        >
          <div className="map-scope-filter" aria-label="地图点位来源">
            {(["全部", "行程点", "普吉收藏", "曼谷收藏"] as const).map(
              (scope) => (
                <button
                  className={mapScope === scope ? "active" : ""}
                  onClick={() => setMapScope(scope)}
                  key={scope}
                >
                  {scope}
                </button>
              ),
            )}
            <small>
              {mapSpots.length} 个行程点 + {mappedFavoriteSpots.length} 个收藏点 · {verifiedLocationCount} 个精确点 / {regionalLocationCount} 个区域锚点 / {defaultLocationCount} 个城市默认点
            </small>
          </div>
          {mapScope === "行程点" && (
            <div className="map-filters day-filter">
              {dates.map((date) => (
                <button
                  className={activeDay === date ? "active" : ""}
                  onClick={() => setActiveDay(date)}
                  key={date}
                >
                  {date}
                </button>
              ))}
              {activeDay !== "全部" && filtered.length > 0 && (
                <a
                  href={googleRouteUrl(filtered)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Maps 当日路线 ↗
                </a>
              )}
            </div>
          )}
          <div className="category-filters">
            {spotCategories.map((category) => (
              <button
                className={activeCategory === category.name ? "active" : ""}
                onClick={() => setActiveCategory(category.name)}
                key={category.name}
              >
                <i style={{ background: category.color }} />
                {category.name}
                <small>
                  {category.name === "全部"
                    ? scopeFiltered.length
                    : scopeFiltered.filter(
                        (x) => x.category === category.name,
                      )
                        .length}
                </small>
              </button>
            ))}
            <button
              className={`favorite-filter ${favoritesOnly ? "active" : ""}`}
              onClick={() => setFavoritesOnly(!favoritesOnly)}
            >
              ★ 仅看收藏 <small>{mapFavoriteCount}</small>
            </button>
          </div>
          <div className="map-layout">
            <div className="map-canvas" ref={holder} />
            <div className="spot-list">
              {filtered.length === 0 ? (
                <div className="empty-favorites">
                  <b>
                    {favoritesOnly ? "暂时没有收藏路线点" : "当前筛选没有地点"}
                  </b>
                  <span>
                    {favoritesOnly
                      ? "切换到地点收藏添加星标"
                      : "换一个日期或分类看看"}
                  </span>
                </div>
              ) : (
                filtered.map((spot, index) => {
                  const digest = spot.favoriteId
                    ? placeFavoriteDetails[
                        spot.favoriteId as keyof typeof placeFavoriteDetails
                      ]
                    : undefined;
                  const digestExpanded = expandedSpotId === spot.id;
                  return (
                  <article
                    className={`compact-spot-card ${digestExpanded ? "digest-open" : ""}`}
                    key={spot.id}
                  >
                    {digest && (
                      <button
                        type="button"
                        className="card-toggle"
                        onClick={() =>
                          setExpandedSpotId(
                            digestExpanded ? null : spot.id,
                          )
                        }
                        aria-expanded={digestExpanded}
                        aria-label={`${spot.name}，${digestExpanded ? "收起" : "展开"}小红书摘要`}
                      />
                    )}
                    <span
                      style={{
                        color: spotCategories.find(
                          (x) => x.name === spot.category,
                        )?.color,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="spot-card-body">
                      <div className="spot-card-primary">
                        <b>{spot.name}</b>
                        <small>
                          {spot.sourceKind || `行程 · ${spot.day}`} · {spot.city}
                        </small>
                        <i
                          className="spot-category"
                          style={{
                            background: spotCategories.find(
                              (x) => x.name === spot.category,
                            )?.color,
                          }}
                        >
                          {spot.category}
                        </i>
                        {spot.locationStatus &&
                          spot.locationStatus !== "已核验位置" && (
                          <em>{spot.locationStatus}</em>
                        )}
                      </div>
                      <div className="spot-card-secondary">
                        <p>{spotSummary(spot)}</p>
                        <div className="spot-actions">
                          <a
                            href={googlePlaceUrl(spot.query)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                          >
                            地图 ↗
                          </a>
                          {digest && (
                            <span className="digest-hint" aria-hidden="true">
                              摘要 {digestExpanded ? "⌃" : "⌄"}
                            </span>
                          )}
                          {spot.sourceUrl && (
                            <a
                              className="xhs-link"
                              href={spot.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(event) => event.stopPropagation()}
                            >
                              原帖 ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      className={
                        `spot-save ${
                          favorites.includes(spot.favoriteId || spot.id)
                            ? "saved"
                            : ""
                        }`
                      }
                      onClick={() =>
                        toggleFavorite(spot.favoriteId || spot.id)
                      }
                      aria-label={
                        favorites.includes(spot.favoriteId || spot.id)
                          ? "取消收藏"
                          : "收藏地点"
                      }
                    >
                      {favorites.includes(spot.favoriteId || spot.id)
                        ? "★"
                        : "☆"}
                    </button>
                    {digestExpanded && digest && (
                      <InlineFavoriteDigest
                        digest={digest}
                        locationNote={spot.locationNote}
                        sourceUrl={spot.sourceUrl}
                      />
                    )}
                  </article>
                  );
                })
              )}
            </div>
          </div>
          <p className="map-privacy">
            地图不读取Google账号或个人位置。{mappedFavoriteSpots.length} 个小红书地点均已加入：{verifiedLocationCount} 个对上公开地图地点，{regionalLocationCount} 个只定位到街区、道路或机场范围，{defaultLocationCount} 个缺少稳定地址而使用所属城市默认点。区域锚点和默认点都不是精确导航终点。
          </p>
        </div>

        <div
          className={`collection-panel ${collectionView === "practical" ? "active" : ""}`}
          aria-hidden={collectionView !== "practical"}
        >
          <div className="collection-toolbar compact">
            <p>不生成地图标记；按使用时机整理成可快速打开的操作卡。</p>
            <button
              className={favoritesOnly ? "active" : ""}
              onClick={() => setFavoritesOnly(!favoritesOnly)}
            >
              ★ 仅看星标
            </button>
          </div>
          <div className="collection-filter" aria-label="实用收藏筛选">
            {(
              ["全部", "出发前", "抵达日", "普吉", "曼谷", "现场"] as const
            ).map((stage) => (
              <button
                className={practicalStage === stage ? "active" : ""}
                onClick={() => setPracticalStage(stage)}
                key={stage}
              >
                {stage}
              </button>
            ))}
            <small>{filteredPractical.length} 张卡片</small>
          </div>
          <div className="collection-grid practical-grid">
            {filteredPractical.length === 0 ? (
              <div className="collection-empty">
                <b>还没有星标实用卡</b>
                <span>关闭“仅看星标”后选择需要置顶的内容</span>
              </div>
            ) : (
              filteredPractical.map((item, index) => (
                <article className="practical-card" key={item.id}>
                  <header>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <small>{item.stage}</small>
                    <button
                      className={favorites.includes(item.id) ? "saved" : ""}
                      onClick={() => toggleFavorite(item.id)}
                      aria-label={
                        favorites.includes(item.id)
                          ? "取消收藏"
                          : "收藏实用卡"
                      }
                    >
                      {favorites.includes(item.id) ? "★" : "☆"}
                    </button>
                  </header>
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                  <FavoriteDigestPanel
                    digest={
                      practicalFavoriteDetails[
                        item.id as keyof typeof practicalFavoriteDetails
                      ]
                    }
                    sourceUrl={item.sourceUrl}
                    secondaryUrl={item.secondaryUrl}
                    secondaryLabel={item.secondaryLabel}
                  />
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="collection-maintenance">
          <header>
            <div>
              <small>UPDATE NOTES</small>
              <b>收藏更新注意事项</b>
            </div>
            <span>上次整理 · 2026.09.20</span>
          </header>
          <div>
            <article>
              <b>出发前一周</b>
              <p>复核预约、营业日、交通班次、跳岛保险与天气取消条款。</p>
            </article>
            <article>
              <b>出发前一晚</b>
              <p>检查天气、航班、机场、TDAC和当天置顶卡；户外项目只降级，不删除。</p>
            </article>
            <article>
              <b>先看文字速览</b>
              <p>卡片内保留原帖重点、价格线索和本次用法；需要看评论或画面时再跳转小红书。</p>
            </article>
          </div>
          <p>
            摘要来自公开笔记整理，并非全文转载；原帖打不开时可按卡片中的标题从公开专辑查找。价格、低消、营业时间和优惠都属于动态信息。页面不保存乘机人、订单号、证件号、手机号或邮箱。
          </p>
        </aside>
      </div>
    </section>
  );
}

