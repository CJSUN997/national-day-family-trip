"use client";

import { useMemo, useState } from "react";
import {
  FlightCard,
  Heading,
  MobileNavIcon,
} from "./ui-components";
import { TripMap } from "./map-section";
import { WeatherBoard } from "./weather-section";
import {
  MobileView,
  TaskFilter,
  mobileNavigation,
  days,
  tasks,
} from "./itinerary-data";

export default function Home() {
  const [active, setActive] = useState(0);
  const [mobileView, setMobileView] = useState<MobileView>("overview");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("pending");
  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined")
      return { outbound: true, return_sh: true, hotel_phuket: true };
    try {
      const saved = window.localStorage.getItem("thai-trip-v7-checks");
      return saved
        ? {
            ...JSON.parse(saved),
            outbound: true,
            return_sh: true,
            hotel_phuket: true,
          }
        : { outbound: true, return_sh: true, hotel_phuket: true };
    } catch {
      return { outbound: true, return_sh: true, hotel_phuket: true };
    }
  });
  const [menu, setMenu] = useState(false);
  const completed = useMemo(
    () => tasks.filter(([id]) => checks[id]).length,
    [checks],
  );
  const jump = (id: string) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const switchMobileView = (view: MobileView) => {
    setMobileView(view);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggle = (id: string) => {
    if (["outbound", "return_sh", "hotel_phuket"].includes(id)) return;
    const next = { ...checks, [id]: !checks[id] };
    setChecks(next);
    localStorage.setItem("thai-trip-v7-checks", JSON.stringify(next));
  };
  const day = days[active]!;
  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => switchMobileView("overview")}>
          <span>向</span>
          <b>
            向南，再向北<small>2026 家庭旅行执行册</small>
          </b>
        </button>
        <button className="menu" onClick={() => setMenu(!menu)}>
          目录
        </button>
        <nav className={menu ? "open" : ""}>
          {[
            ["route", "路线"],
            ["weather", "天气"],
            ["map", "收藏"],
            ["days", "每日"],
            ["booking", "预订"],
            ["budget", "预算"],
            ["tasks", "清单"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => jump(id)}>
              {label}
            </button>
          ))}
        </nav>
        <em>● 7天6晚</em>
      </header>
      <section
        className={`hero mobile-panel ${mobileView === "overview" ? "mobile-active" : ""}`}
        id="top"
      >
        <div className="hero-copy">
          <p>OCT 04 — OCT 10 · PHUKET / BANGKOK</p>
          <h1>
            2026 国庆
            <br />
            <i>泰国行程</i>
          </h1>
          <h2>
            一家四口的泰国七日：普吉3晚，曼谷3晚。去程已经确定，余下的每一步都围绕舒服、真实和可执行。
          </h2>
          <div>
            <button onClick={() => jump("days")}>查看每日安排 ↘</button>
            <button onClick={() => jump("tasks")}>先看待办</button>
          </div>
        </div>
        <article className="ticket">
          <header>
            <span>OUTBOUND · CONFIRMED</span>
            <b>已订</b>
          </header>
          <div className="airports">
            <section>
              <strong>PEK</strong>
              <small>北京 · T3</small>
            </section>
            <i>
              CA581
              <br />
              ──────── ✦
            </i>
            <section>
              <strong>HKT</strong>
              <small>普吉</small>
            </section>
          </div>
          <div className="times">
            <span>
              <b>15:30</b>10月4日
            </span>
            <span>
              <b>6h</b>直飞
            </span>
            <span>
              <b>20:30</b>当地时间
            </span>
          </div>
          <p>4人同行 · 每人1×23kg托运行李 · 以电子客票号确认出票</p>
        </article>
      </section>
      <section
        className={`shell route mobile-panel ${mobileView === "overview" ? "mobile-active" : ""}`}
        id="route"
      >
        <Heading
          index="01 · ROUTE LOGIC"
          title={<>行程概览</>}
          text="路线先满足航班与体力，再安排体验。海况改变活动，不改变城市；上海组10月10日从BKK出发，经厦门过夜后于10月11日抵沪。"
        />
        <div className="route-grid">
          {[
            ["10.04 · 已订", "北京", "CA581 直飞"],
            ["3 NIGHTS · 已订", "普吉", "普吉岛卡塔度假酒店"],
            ["3 NIGHTS · 待订", "曼谷", "美食 · 体验 · 购物"],
            ["10.10 · 分流", "上海 / 北京", "上海已订 · 北京待订"],
          ].map(([a, b, c]) => (
            <article key={b}>
              <small>{a}</small>
              <b>{b}</b>
              <p>{c}</p>
            </article>
          ))}
        </div>
        <div className="rails">
          {[
            ["01", "只换一次酒店", "10月7日从普吉转场曼谷"],
            ["02", "关键活动可退", "跳岛和高空项目不锁死"],
            ["03", "允许分组", "妈妈不被迫出海或射击"],
            ["04", "明确排除", "不去大皇宫，不看低俗演出"],
          ].map(([n, t, d]) => (
            <article key={n}>
              <span>{n}</span>
              <b>{t}</b>
              <small>{d}</small>
            </article>
          ))}
        </div>
      </section>
      <WeatherBoard mobileActive={mobileView === "overview"} />
      <TripMap mobileActive={mobileView === "map"} />
      <section
        className={`dark mobile-panel ${mobileView === "days" ? "mobile-active" : ""}`}
        id="days"
      >
        <div className="shell">
          <Heading
            light
            index="04 · DAY BY DAY"
            title={<>每日行程</>}
            text="选择日期查看时间线。安排保留交通和休息缓冲，不用景点数量衡量一天是否值得。"
          />
          <div className="tabs">
            {days.map((d, i) => (
              <button
                className={i === active ? "active" : ""}
                onClick={() => setActive(i)}
                key={d.date}
              >
                <small>{d.date.split(" · ")[0]}</small>
                <b>D{i + 1}</b>
                <span>{d.city}</span>
              </button>
            ))}
          </div>
          <div className="day">
            <aside>
              <span>
                {day.date}
                <i>{day.pace}</i>
              </span>
              <small>
                {day.city} · DAY {active + 1}
              </small>
              <h3>{day.title}</h3>
              <p>{day.lead}</p>
              {day.rule && (
                <em>
                  <b>WEATHER RULE</b>
                  {day.rule}
                </em>
              )}
            </aside>
            <div className="timeline">
              {day.events.map((e, i) => (
                <article key={e.title}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <small>
                      {e.time}
                      <i>{e.tag}</i>
                    </small>
                    <h4>{e.title}</h4>
                    <p>{e.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section
        className={`shell booking mobile-panel ${mobileView === "booking" ? "mobile-active" : ""}`}
        id="booking"
      >
        <Heading
          index="05 · BOOKING GATES"
          title={<>预订信息</>}
          text="页面仅展示执行行程需要的信息，不公开乘机人姓名、订单编号、联系方式或支付信息。"
        />
        <div className="cards">
          <FlightCard
            status="已出票"
            date="10.10—10.11"
            code="BKK → XMN → SHA"
            title="上海组 · 1人"
            items={[
              "MF864：19:50—23:55",
              "MF8521：次日13:00—14:45",
              "手提8kg、托运1×23kg",
              "确认行李直挂与厦门过夜",
            ]}
          />
          <FlightCard
            urgent
            date="10.10"
            code="BKK → PEK / PKX"
            title="北京组 · 3人"
            items={[
              "一次查询3张同舱库存",
              "直飞、含托运行李",
              "凌晨抵达须全员提前确认",
            ]}
          />
          <FlightCard
            date="10.07"
            code="HKT → BKK"
            title="城市转场 · 4人"
            items={[
              "11:00—14:00理想起飞",
              "只选BKK，避免DMK",
              "包含4人托运行李",
            ]}
          />
          <article className="rooms">
            <small>普吉已订 · 曼谷待订</small>
            <div>
              <b>普吉</b>
              <span>10.04—10.07</span>
              <em>普吉岛卡塔度假酒店 · 3晚</em>
            </div>
            <div>
              <b>曼谷</b>
              <span>10.07—10.10</span>
              <em>暹罗 / National Stadium周边 · 3晚</em>
            </div>
            <p>
              普吉订单当前显示1间房，请确认床型、入住人数及是否适住4名成人。
            </p>
          </article>
        </div>
        <div className="car-rule">
          <b>10月10日规则</b>
          <span>上海组BKK 19:50起飞 → 下午至少预留国际出发缓冲</span>
          <span>北京组出票后 → 再判断是否同车送机</span>
        </div>
      </section>
      <section
        className={`money mobile-panel ${mobileView === "booking" ? "mobile-active" : ""}`}
        id="budget"
      >
        <div className="shell">
          <Heading
            light
            index="06 · MONEY MAP"
            title={<>预算概览</>}
            text="新方案加入4人跳岛和射击体验，活动预算明显上升。购物和代购仍使用完全独立的账本。"
          />
          <div className="money-grid">
            <article className="total">
              <small>旅行主体目标 · 4人</small>
              <b>¥20,000</b>
              <p>
                不含国际机票
                <br />
                不含购物与代购
              </p>
              <span>
                当前规划区间 <strong>¥17,300—25,300</strong>
              </span>
            </article>
            <article className="bars">
              {[
                ["住宿 · 6晚2间房", "¥5,000—7,500", 31],
                ["泰国境内机票", "¥1,600—2,800", 12],
                ["接送与市内交通", "¥1,800—2,800", 12],
                ["餐饮", "¥4,000—5,500", 23],
                ["跳岛与射击", "¥3,400—4,800", 19],
                ["保险与缓冲", "¥1,500—1,900", 8],
              ].map(([n, a, w]) => (
                <div key={String(n)}>
                  <span>{n}</span>
                  <b>{a}</b>
                  <i>
                    <em style={{ width: `${w}%` }} />
                  </i>
                </div>
              ))}
            </article>
            <article className="saving">
              <small>控制在两万元的顺序</small>
              <ol>
                <li>酒店控制在每晚两间合计约¥1,000</li>
                <li>跳岛与射击不同时升级高价套餐</li>
                <li>包车只用于10月5日环岛和机场链路</li>
                <li>高空观景只在预算与天气都允许时购买</li>
              </ol>
            </article>
          </div>
        </div>
      </section>
      <section
        className={`shell tasks mobile-panel ${mobileView === "tasks" ? "mobile-active" : ""}`}
        id="tasks"
        data-task-filter={taskFilter}
      >
        <Heading
          index="07 · ACTION LIST"
          title={<>待办清单</>}
          text={`${completed}/${tasks.length} 项已完成。勾选结果只保存在当前设备。`}
        />
        <div className="progress">
          <i style={{ width: `${(completed / tasks.length) * 100}%` }} />
        </div>
        <div className="task-filter" aria-label="筛选待办清单">
          {[
            ["pending", "待办", tasks.length - completed],
            ["done", "已完成", completed],
            ["all", "全部", tasks.length],
          ].map(([id, label, count]) => (
            <button
              className={taskFilter === id ? "active" : ""}
              onClick={() => setTaskFilter(id as TaskFilter)}
              key={id}
            >
              {label} <small>{count}</small>
            </button>
          ))}
        </div>
        <div className="task-list">
          {tasks.map(([id, phase, title, note], i) => (
            <label
              className={`${checks[id] ? "done task-state-done" : "task-state-pending"}`}
              key={id}
            >
              <input
                type="checkbox"
                checked={!!checks[id]}
                disabled={["outbound", "return_sh", "hotel_phuket"].includes(
                  id,
                )}
                onChange={() => toggle(id)}
              />
              <span>{String(i + 1).padStart(2, "0")}</span>
              <em>{phase}</em>
              <b>
                {title}
                <small>{note}</small>
              </b>
              <i>✓</i>
            </label>
          ))}
        </div>
      </section>
      <section
        className={`final-band mobile-panel ${mobileView === "tasks" ? "mobile-active" : ""}`}
      >
        <div>
          <small>08 · BEFORE YOU GO</small>
          <h2>出发前提醒</h2>
        </div>
        <article>
          <small>10.01 起</small>
          <b>填写4人 TDAC</b>
          <p>仅使用泰国移民局官方免费入口。</p>
          <a href="https://tdac.immigration.go.th/" target="_blank">
            打开官网 ↗
          </a>
        </article>
        <article>
          <small>10.03</small>
          <b>值机与行李终检</b>
          <p>护照、保险、eSIM、常用药；充电宝随身携带。</p>
        </article>
        <article>
          <small>全程</small>
          <b>公开信息边界</b>
          <p>不上传证件号、完整订单号、手机号、邮箱或支付凭证。</p>
        </article>
      </section>
      <footer>
        <b>向南，再向北</b>
        <span>事实与建议分开。未知保持未知，动态信息在付款前重新核实。</span>
        <button onClick={() => jump("top")}>回到顶部 ↑</button>
      </footer>
      <nav className="mobile-bottom-nav" aria-label="手机端主导航">
        {mobileNavigation.map((item) => (
          <button
            className={mobileView === item.id ? "active" : ""}
            onClick={() => switchMobileView(item.id)}
            aria-current={mobileView === item.id ? "page" : undefined}
            key={item.id}
          >
            <MobileNavIcon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
