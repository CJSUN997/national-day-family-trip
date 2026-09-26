"use client";

import { useEffect, useState } from "react";
import { Heading } from "./ui-components";

type WeatherResponse = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

const weatherPlaces = [
  { name: "普吉", stay: "10.04—10.07", lat: 7.8804, lon: 98.3923 },
  { name: "曼谷", stay: "10.07—10.10", lat: 13.7563, lon: 100.5018 },
];

function weatherLabel(code: number) {
  if (code === 0) return "晴朗";
  if (code <= 3) return "多云";
  if (code <= 48) return "有雾";
  if (code <= 57) return "毛毛雨";
  if (code <= 67) return "有雨";
  if (code <= 77) return "阵雪";
  if (code <= 82) return "阵雨";
  return "雷雨";
}

function weatherIcon(code: number) {
  if (code === 0) return "☀";
  if (code <= 3) return "☁";
  if (code <= 67) return "☂";
  if (code <= 82) return "☔";
  return "ϟ";
}

function forecastDate(date: string, index: number) {
  const value = new Date(`${date}T12:00:00+07:00`);
  const day = new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(value);
  const weekday = new Intl.DateTimeFormat("zh-CN", {
    weekday: "short",
    timeZone: "Asia/Bangkok",
  }).format(value);
  return { day, weekday: index === 0 ? `今天 · ${weekday}` : weekday };
}

export function WeatherBoard({ mobileActive = false }: { mobileActive?: boolean }) {
  const [weather, setWeather] = useState<Record<string, WeatherResponse>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updated, setUpdated] = useState("");
  const [expanded, setExpanded] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(false);
    try {
      const entries = await Promise.all(
        weatherPlaces.map(async (place) => {
          const query = new URLSearchParams({
            latitude: String(place.lat),
            longitude: String(place.lon),
            timezone: "Asia/Bangkok",
            forecast_days: "7",
            current:
              "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
            daily:
              "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
          });
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?${query}`,
          );
          if (!response.ok) throw new Error("weather request failed");
          return [place.name, await response.json()] as const;
        }),
      );
      setWeather(Object.fromEntries(entries));
      setUpdated(
        new Intl.DateTimeFormat("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Bangkok",
        }).format(new Date()),
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      className={`weather mobile-panel ${mobileActive ? "mobile-active" : ""} ${expanded ? "weather-expanded" : ""}`}
      id="weather"
    >
      <div className="shell">
        <Heading
          index="02 · LIVE WEATHER"
          title={<>实时天气</>}
          text="当前展示当地实况与未来7天预报。进入旅行日期的可预报窗口后，这里会自动覆盖普吉和曼谷的实际行程日。"
        />
        <div className="weather-status">
          <span>
            <i />
            泰国当地时间 · {updated || "正在同步"}
          </span>
          <div className="weather-actions">
            <button
              className="weather-expand"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              {expanded ? "收起预报" : "查看5日预报"}
            </button>
            <button onClick={refresh} disabled={loading}>
              {loading ? "更新中…" : "刷新天气 ↻"}
            </button>
          </div>
        </div>
        {error && (
          <div className="weather-error">
            天气服务暂时不可用。行程仍按季风期规则执行，稍后可手动刷新。
          </div>
        )}
        <div className="weather-grid">
          {weatherPlaces.map((place) => {
            const data = weather[place.name];
            return (
              <article className="weather-card" key={place.name}>
                <header>
                  <div>
                    <small>{place.stay} · THAILAND</small>
                    <h3>{place.name}</h3>
                  </div>
                  {data ? (
                    <div className="now">
                      <span>{weatherIcon(data.current.weather_code)}</span>
                      <b>{Math.round(data.current.temperature_2m)}°</b>
                    </div>
                  ) : (
                    <div className="weather-skeleton" />
                  )}
                </header>
                {data ? (
                  <>
                    <div className="current-detail">
                      <span>{weatherLabel(data.current.weather_code)}</span>
                      <span>
                        体感 {Math.round(data.current.apparent_temperature)}°
                      </span>
                      <span>
                        风速 {Math.round(data.current.wind_speed_10m)} km/h
                      </span>
                    </div>
                    <div className="forecast">
                      {data.daily.time.slice(0, 5).map((date, i) => {
                        const label = forecastDate(date, i);
                        return (
                          <div key={date}>
                            <time>
                              <strong>{label.day}</strong>
                              <em>{label.weekday}</em>
                            </time>
                            <b>{weatherIcon(data.daily.weather_code[i]!)}</b>
                            <span>
                              {Math.round(data.daily.temperature_2m_max[i]!)}°{" "}
                              <i>
                                {Math.round(data.daily.temperature_2m_min[i]!)}°
                              </i>
                            </span>
                            <small>
                              雨 {data.daily.precipitation_probability_max[i]}%
                            </small>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="weather-loading">正在获取当地天气…</p>
                )}
              </article>
            );
          })}
        </div>
        <div className="weather-note">
          <b>10月6日 · 条件式出海</b>
          <span>
            页面实时数据来自Open-Meteo；9月26日初判可保留，但官方海况尚未覆盖当天。9月30日初检、10月5日晚终检；雷暴、强风浪/小船停航预警、现场红旗或运营商取消任一出现即改陆地方案。
          </span>
          <a
            href="https://www.tmd.go.th/en/forecast/shipping"
            target="_blank"
            rel="noreferrer"
          >
            官方海况 · TMD ↗
          </a>
        </div>
      </div>
    </section>
  );
}
