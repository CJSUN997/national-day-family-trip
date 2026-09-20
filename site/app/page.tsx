"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

type Event = { time: string; tag: string; title: string; note: string };
type Day = {
  date: string;
  city: string;
  title: string;
  lead: string;
  pace: string;
  rule?: string;
  events: Event[];
};

type MobileView = "overview" | "days" | "map" | "booking" | "tasks";
type TaskFilter = "pending" | "done" | "all";

const mobileNavigation: {
  id: MobileView;
  label: string;
  icon: "home" | "calendar" | "pin" | "ticket" | "check";
}[] = [
  { id: "overview", label: "概览", icon: "home" },
  { id: "days", label: "行程", icon: "calendar" },
  { id: "map", label: "地图", icon: "pin" },
  { id: "booking", label: "预订", icon: "ticket" },
  { id: "tasks", label: "清单", icon: "check" },
];

const days: Day[] = [
  {
    date: "10.04 · 周日",
    city: "普吉",
    title: "向南飞，先睡个好觉",
    lead: "已订 CA581。20:30落地后只完成接机、入住和简单宵夜，不再追加夜市。",
    pace: "交通日",
    events: [
      {
        time: "12:00",
        tag: "集合",
        title: "首都机场 T3",
        note: "4人一起办理值机，逐人确认电子客票号与1×23kg托运行李。",
      },
      {
        time: "15:30—20:30",
        tag: "已预订",
        title: "CA581 · PEK → HKT",
        note: "直飞普吉；泰国时间比北京时间慢1小时。",
      },
      {
        time: "22:00",
        tag: "接机",
        title: "普吉机场 → 普吉岛卡塔度假酒店",
        note: "酒店已订，位于卡伦的Kata Road一带；预订SUV / Van并填写航班号。",
      },
    ],
  },
  {
    date: "10.05 · 周一",
    city: "普吉",
    title: "老城、寺庙与南端日落",
    lead: "4人包车走一条完整的本岛路线，上午慢出发，傍晚把神仙半岛作为全日重点。",
    pace: "适中",
    rule: "日落受天气影响；大雨时缩短南部路线，不冒险赶观景点。",
    events: [
      {
        time: "10:00",
        tag: "老城",
        title: "普吉老镇",
        note: "塔朗路与罗曼尼巷慢逛，午餐尝试福建面或泰南风味。",
      },
      {
        time: "14:30",
        tag: "文化",
        title: "查龙寺",
        note: "免费参观，注意衣着得体；现场不赶时间、不叠加过多景点。",
      },
      {
        time: "17:15",
        tag: "日落",
        title: "神仙半岛",
        note: "争取17:30前到达；天气和体力允许时顺路看风车观景点。",
      },
      {
        time: "19:30",
        tag: "晚餐",
        title: "卡伦 / 卡塔就近用餐",
        note: "全天包车结束后直接回酒店区域，不再跨区逛夜市。",
      },
    ],
  },
  {
    date: "10.06 · 周二",
    city: "普吉",
    title: "把整天留给海，也保留退路",
    lead: "首选皮皮岛、玛雅湾与竹子岛一日团；如更看重山海景观，可换攀牙湾与洞穴独木舟。",
    pace: "早出晚归",
    rule: "前一晚复核雷暴、风浪、停航与退款规则；妈妈可留在卡伦，不强制全员出海。",
    events: [
      {
        time: "前晚确认",
        tag: "二选一",
        title: "锁定正规跳岛团",
        note: "确认酒店接送、保险、午餐、登岛费、天气取消与退款规则。",
      },
      {
        time: "07:00—17:00",
        tag: "A 组",
        title: "皮皮岛＋玛雅湾＋竹子岛",
        note: "经典海岛线，行程较长；不适合晕船或不愿乘快艇的人。",
      },
      {
        time: "同步",
        tag: "B 组",
        title: "卡伦海滩＋酒店休息",
        note: "不出海成员保留房卡、现金和叫车方式，晚餐地点提前约定。",
      },
      {
        time: "18:30",
        tag: "恢复",
        title: "晚餐或泰式按摩",
        note: "视体力决定，不预约高强度项目；随后整理次日转场行李。",
      },
    ],
  },
  {
    date: "10.07 · 周三",
    city: "曼谷",
    title: "海滩收尾，转场去曼谷",
    lead: "上午只在卡伦附近活动，搭乘中午前后 HKT → BKK 直飞；晚上用美食街完成城市开场。",
    pace: "交通日",
    events: [
      {
        time: "08:30",
        tag: "海滩",
        title: "卡伦慢上午",
        note: "海边散步或看卡伦观景台，具体取决于航班时间和天气。",
      },
      {
        time: "起飞前3小时",
        tag: "退房",
        title: "卡伦 → 普吉机场",
        note: "提前预约送机；雨季道路缓冲不压缩。",
      },
      {
        time: "11:00—14:00",
        tag: "待预订",
        title: "HKT → BKK",
        note: "只筛素万那普机场直飞、含托运行李的组合；不为低价改飞DMK。",
      },
      {
        time: "16:00",
        tag: "入住",
        title: "暹罗 / 拉差贴威",
        note: "2间房，优先BTS步行500米内、明确床型、可免费取消。",
      },
      {
        time: "18:30",
        tag: "美食",
        title: "Banthat Thong 美食街",
        note: "避开18:00—20:00排队高峰；Jeh O Chula等热门店不作为必须打卡。",
      },
    ],
  },
  {
    date: "10.08 · 周四",
    city: "曼谷",
    title: "射击体验与平价火锅",
    lead: "上午安排全程有教练的正规射击体验，晚上去MBK附近吃 Suki Teenoi；中间保留休息。",
    pace: "适中",
    rule: "必须提前确认营业、年龄限制、证件要求、保险与教练陪同；任何人都可不参加。",
    events: [
      {
        time: "10:30",
        tag: "需预订",
        title: "正规射击场体验",
        note: "优先选择交通可控、可确认开放状态的场地；现场严格遵守教练指令。",
      },
      {
        time: "13:30",
        tag: "休息",
        title: "返回市区午休",
        note: "不在射击后连续叠加室外项目，给全员完整恢复时间。",
      },
      {
        time: "17:30",
        tag: "商圈",
        title: "MBK Center 随意逛",
        note: "从National Stadium站步行衔接，购物和代购单独记账。",
      },
      {
        time: "20:00",
        tag: "晚餐",
        title: "Suki Teenoi 自助小火锅",
        note: "优先MBK分店并避开饭点；若排队过长，直接换附近餐厅。",
      },
    ],
  },
  {
    date: "10.09 · 周五",
    city: "曼谷",
    title: "商场、河岸与城市夜景",
    lead: "周五不硬逛只开放部分摊位的乍都乍，改用有空调的商圈与河岸路线。",
    pace: "轻松",
    events: [
      {
        time: "10:30",
        tag: "购物",
        title: "暹罗商圈",
        note: "Siam Paragon、Siam Center、Siam Discovery按兴趣选择，不必全部逛完。",
      },
      {
        time: "15:30",
        tag: "二选一",
        title: "ICONSIAM 或酒店休息",
        note: "想看河岸与室内水上市场就去ICONSIAM；体力不足直接休息。",
      },
      {
        time: "17:30",
        tag: "可选",
        title: "Mahanakhon SkyWalk",
        note: "只在天气清晰且全员有兴趣时现场决定，不提前锁死不可退票。",
      },
      {
        time: "20:30",
        tag: "整理",
        title: "两组返程终检",
        note: "分别确认航站楼、送机时间、行李额、证件和落地日期。",
      },
    ],
  },
  {
    date: "10.10 · 周六",
    city: "返程",
    title: "两组返程，上海组厦门过夜",
    lead: "上海组已出票，10月10日晚从曼谷飞厦门、10月11日下午抵达虹桥；北京组3人仍待出票。",
    pace: "交通日",
    events: [
      {
        time: "09:00",
        tag: "条件活动",
        title: "乍都乍周末市场",
        note: "上海组航班时间允许，但仍需给BKK国际出发预留充足时间；北京组按最终航班单独判断。",
      },
      {
        time: "19:50—23:55",
        tag: "已出票 · 上海1人",
        title: "MF864 · BKK → XMN",
        note: "厦门航空，抵达厦门高崎T3；手提8kg、托运1×23kg。",
      },
      {
        time: "10.11 · 13:00—14:45",
        tag: "已出票 · 上海1人",
        title: "MF8521 · XMN → SHA",
        note: "厦门高崎T3至上海虹桥T1；须确认行李是否直挂及厦门过夜安排。",
      },
      {
        time: "待航班",
        tag: "北京 · 3人",
        title: "BKK → PEK / PKX",
        note: "查询3张同舱库存；若10月11日凌晨落地，出票前再次确认。",
      },
      {
        time: "起飞前3小时",
        tag: "送机",
        title: "酒店 → BKK",
        note: "上海组按19:50起飞倒排；北京组出票后再决定是否同车。",
      },
    ],
  },
];

const tasks = [
  [
    "outbound",
    "已完成",
    "确认 CA581 全员出票",
    "逐人检查电子客票号和1×23kg托运行李。",
  ],
  [
    "return_sh",
    "已完成",
    "上海组返程已出票",
    "10月10日MF864至厦门，10月11日MF8521抵达上海虹桥。",
  ],
  [
    "return_bj",
    "现在",
    "锁定北京组返程",
    "10月10日：3人BKK→PEK/PKX，优先直飞和含托运行李。",
  ],
  [
    "domestic",
    "现在",
    "锁定普吉到曼谷",
    "10月7日HKT→BKK，直飞、含行李、中午前后起飞。",
  ],
  [
    "hotel_phuket",
    "已完成",
    "普吉酒店已订",
    "普吉岛卡塔度假酒店，10月4日至7日，3晚；订单显示1间房。",
  ],
  [
    "hotel_bangkok",
    "现在",
    "预订曼谷酒店",
    "10月7日至10日，优先暹罗或National Stadium周边。",
  ],
  [
    "island",
    "尽快",
    "筛选10月6日跳岛团",
    "比较皮皮岛线与攀牙湾线，重点核对保险、接送及天气退款。",
  ],
  [
    "shooting",
    "出发前",
    "预订正规射击体验",
    "确认当天开放、证件要求、教练陪同、保险和取消政策。",
  ],
  [
    "transfer",
    "出发前2周",
    "建立机场接送订单",
    "同行段用SUV/Van；返程按航班差值决定是否分车。",
  ],
  [
    "insurance",
    "出发前2周",
    "购买旅行保险",
    "覆盖医疗、航班延误和水上活动，核对免责条款。",
  ],
  [
    "tdac",
    "10月1日起",
    "提交4人 TDAC",
    "仅使用泰国移民局免费官方入口，保存确认信息。",
  ],
  [
    "sim",
    "出发前",
    "准备4人流量方案",
    "比较eSIM、实体卡和国际漫游，保存离线订单与酒店地址。",
  ],
  [
    "weather",
    "10月5日晚",
    "决定10月6日出海方案",
    "海况不安全即取消出海，不以已付款为理由冒险。",
  ],
  [
    "final",
    "10月9日晚",
    "完成返程终检",
    "两组分别确认航站楼、送机时间、行李额和抵达日期。",
  ],
] as const;

type SpotCategory =
  "美食" | "咖啡酒吧" | "景点" | "玩乐" | "购物" | "住宿" | "交通" | "备选";
type MapSpot = {
  id: string;
  day: string;
  city: "普吉" | "曼谷";
  category: SpotCategory;
  name: string;
  note: string;
  lat: number;
  lon: number;
  query: string;
};

const spotCategories: { name: "全部" | SpotCategory; color: string }[] = [
  { name: "全部", color: "#173a35" },
  { name: "美食", color: "#e76545" },
  { name: "咖啡酒吧", color: "#9b6a4a" },
  { name: "景点", color: "#2f7d68" },
  { name: "玩乐", color: "#7f5aa2" },
  { name: "购物", color: "#d49a2f" },
  { name: "住宿", color: "#315d9b" },
  { name: "交通", color: "#59636f" },
  { name: "备选", color: "#8a8a82" },
];

const mapSpots: MapSpot[] = [
  {
    id: "phuket-hotel",
    day: "10.04",
    city: "普吉",
    category: "住宿",
    name: "普吉岛卡塔度假酒店",
    note: "10月4日至7日 · 已订",
    lat: 7.8203,
    lon: 98.2977,
    query: "Phuket Kata Resort Kata Road Karon Phuket",
  },
  {
    id: "old-town",
    day: "10.05",
    city: "普吉",
    category: "景点",
    name: "普吉老镇",
    note: "塔朗路与罗曼尼巷",
    lat: 7.884,
    lon: 98.3891,
    query: "Phuket Old Town Thalang Road",
  },
  {
    id: "wat-chalong",
    day: "10.05",
    city: "普吉",
    category: "景点",
    name: "查龙寺",
    note: "下午文化行程",
    lat: 7.8469,
    lon: 98.3369,
    query: "Wat Chalong Phuket",
  },
  {
    id: "promthep",
    day: "10.05",
    city: "普吉",
    category: "景点",
    name: "神仙半岛",
    note: "日落重点",
    lat: 7.7626,
    lon: 98.305,
    query: "Promthep Cape Phuket",
  },
  {
    id: "karon-viewpoint",
    day: "10.07",
    city: "普吉",
    category: "景点",
    name: "卡伦观景台",
    note: "航班时间允许才去",
    lat: 7.7974,
    lon: 98.3021,
    query: "Karon Viewpoint Phuket",
  },
  {
    id: "hkt",
    day: "10.07",
    city: "普吉",
    category: "交通",
    name: "普吉国际机场",
    note: "HKT → BKK · 待订",
    lat: 8.1132,
    lon: 98.3169,
    query: "Phuket International Airport",
  },
  {
    id: "bkk",
    day: "10.07",
    city: "曼谷",
    category: "交通",
    name: "素万那普机场",
    note: "曼谷进出机场",
    lat: 13.69,
    lon: 100.7501,
    query: "Suvarnabhumi Airport",
  },
  {
    id: "banthat",
    day: "10.07",
    city: "曼谷",
    category: "美食",
    name: "Banthat Thong 美食街",
    note: "抵达曼谷后的晚餐",
    lat: 13.7432,
    lon: 100.5224,
    query: "Banthat Thong Road Bangkok",
  },
  {
    id: "mbk",
    day: "10.08",
    city: "曼谷",
    category: "美食",
    name: "MBK Center",
    note: "Suki Teenoi与晚间商圈",
    lat: 13.7445,
    lon: 100.529,
    query: "MBK Center Bangkok",
  },
  {
    id: "siam",
    day: "10.09",
    city: "曼谷",
    category: "购物",
    name: "Siam Paragon",
    note: "暹罗商圈起点",
    lat: 13.7462,
    lon: 100.5347,
    query: "Siam Paragon Bangkok",
  },
  {
    id: "iconsiam",
    day: "10.09",
    city: "曼谷",
    category: "购物",
    name: "ICONSIAM",
    note: "河岸与室内活动",
    lat: 13.7265,
    lon: 100.51,
    query: "ICONSIAM Bangkok",
  },
  {
    id: "mahanakhon",
    day: "10.09",
    city: "曼谷",
    category: "玩乐",
    name: "Mahanakhon SkyWalk",
    note: "天气清晰时可选",
    lat: 13.7237,
    lon: 100.5285,
    query: "King Power Mahanakhon SkyWalk",
  },
  {
    id: "chatuchak",
    day: "10.10",
    city: "曼谷",
    category: "购物",
    name: "乍都乍周末市场",
    note: "只在航班时间允许时执行",
    lat: 13.7999,
    lon: 100.5501,
    query: "Chatuchak Weekend Market",
  },
];

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
            ["map", "地图"],
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

function MobileNavIcon({
  name,
}: {
  name: "home" | "calendar" | "pin" | "ticket" | "check";
}) {
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1Z" />
      </svg>
    );
  }
  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4m8-4v4M4 10h16" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  if (name === "ticket") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-3a2 2 0 0 0 0-4Z" />
        <path d="M12 7v2m0 2v2m0 2v2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16.5 9" />
    </svg>
  );
}

function Heading({
  index,
  title,
  text,
  light = false,
}: {
  index: string;
  title: React.ReactNode;
  text: string;
  light?: boolean;
}) {
  return (
    <header className={`heading ${light ? "light" : ""}`}>
      <div>
        <small>{index}</small>
        <h2>{title}</h2>
      </div>
      <p>{text}</p>
    </header>
  );
}
function FlightCard({
  urgent = false,
  status,
  date,
  code,
  title,
  items,
}: {
  urgent?: boolean;
  status?: string;
  date: string;
  code: string;
  title: string;
  items: string[];
}) {
  return (
    <article className={`flight-card ${urgent ? "urgent" : ""}`}>
      <header>
        <span>{status || (urgent ? "最高优先级" : "同步锁定")}</span>
        <small>{date}</small>
      </header>
      <p>{code}</p>
      <h3>{title}</h3>
      <ul>
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      {!status && (
        <a href="https://www.google.com/travel/flights" target="_blank">
          打开航班搜索 ↗
        </a>
      )}
    </article>
  );
}

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

function TripMap({ mobileActive = false }: { mobileActive?: boolean }) {
  const holder = useRef<HTMLDivElement | null>(null);
  const [activeDay, setActiveDay] = useState("全部");
  const [mapMode, setMapMode] = useState<"map" | "list">("map");
  const [activeCategory, setActiveCategory] = useState<"全部" | SpotCategory>(
    "全部",
  );
  const [favoritesOnly, setFavoritesOnly] = useState(false);
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
  const filtered = useMemo(
    () =>
      mapSpots.filter(
        (spot) =>
          (activeDay === "全部" || spot.day === activeDay) &&
          (activeCategory === "全部" || spot.category === activeCategory) &&
          (!favoritesOnly || favorites.includes(spot.id)),
      ),
    [activeDay, activeCategory, favoritesOnly, favorites],
  );
  const dates = ["全部", ...Array.from(new Set(mapSpots.map((x) => x.day)))];

  useEffect(() => {
    if (!holder.current) return;
    const isMobile = window.matchMedia("(max-width: 540px)").matches;
    if (isMobile && (!mobileActive || mapMode === "list")) return;
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
      const bounds: L.LatLngExpression[] = [];
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
        L.marker(point, { icon })
          .addTo(map!)
          .bindPopup(
            `<b>${spot.name}</b><br><small>${spot.category} · ${spot.day} · ${spot.note}</small><br><a href="${googlePlaceUrl(spot.query)}" target="_blank" rel="noreferrer">在 Google Maps 打开 ↗</a>`,
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
  }, [filtered, mobileActive, mapMode]);

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
          index="03 · TRIP MAP"
          title={<>地图与收藏</>}
          text="先按日期，再按吃喝玩乐分类筛选。星标保存在当前设备；你后续发来的地点会继续加入这套收藏夹。"
        />
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
            <a href={googleRouteUrl(filtered)} target="_blank" rel="noreferrer">
              在 Google Maps 打开当日路线 ↗
            </a>
          )}
        </div>
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
                  ? mapSpots.length
                  : mapSpots.filter((x) => x.category === category.name).length}
              </small>
            </button>
          ))}
          <button
            className={`favorite-filter ${favoritesOnly ? "active" : ""}`}
            onClick={() => setFavoritesOnly(!favoritesOnly)}
          >
            ★ 仅看收藏 <small>{favorites.length}</small>
          </button>
        </div>
        <div className="map-view-switch" aria-label="地图显示方式">
          <button
            className={mapMode === "map" ? "active" : ""}
            onClick={() => setMapMode("map")}
            aria-pressed={mapMode === "map"}
          >
            地图视图
          </button>
          <button
            className={mapMode === "list" ? "active" : ""}
            onClick={() => setMapMode("list")}
            aria-pressed={mapMode === "list"}
          >
            收藏点列表
          </button>
        </div>
        <div className={`map-layout mode-${mapMode}`}>
          <div className="map-canvas" ref={holder} />
          <div className="spot-list">
            {filtered.length === 0 ? (
              <div className="empty-favorites">
                <b>{favoritesOnly ? "收藏夹还是空的" : "当前筛选没有地点"}</b>
                <span>
                  {favoritesOnly
                    ? "点击地点右侧的星标即可收藏"
                    : "换一个日期或分类看看"}
                </span>
              </div>
            ) : (
              filtered.map((spot, index) => (
                <article key={spot.id}>
                  <span
                    style={{
                      color: spotCategories.find(
                        (x) => x.name === spot.category,
                      )?.color,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <small>
                      {spot.day} · {spot.city}
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
                    </small>
                    <b>{spot.name}</b>
                    <p>{spot.note}</p>
                    <a
                      href={googlePlaceUrl(spot.query)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Google Maps ↗
                    </a>
                  </div>
                  <button
                    className={favorites.includes(spot.id) ? "saved" : ""}
                    onClick={() => toggleFavorite(spot.id)}
                    aria-label={
                      favorites.includes(spot.id) ? "取消收藏" : "收藏地点"
                    }
                  >
                    {favorites.includes(spot.id) ? "★" : "☆"}
                  </button>
                </article>
              ))
            )}
          </div>
        </div>
        <p className="map-privacy">
          地图不读取Google账号或个人位置；收藏仅保存在当前浏览器。射击场和曼谷酒店尚未最终确认，因此暂不固定坐标。
        </p>
      </div>
    </section>
  );
}

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

function WeatherBoard({ mobileActive = false }: { mobileActive?: boolean }) {
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
          <b>行程联动规则</b>
          <span>
            普吉降雨概率高不等于全天有雨；出海决定仍以雷暴预警、海滩旗帜和运营方通知为准。
          </span>
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            天气数据 · Open-Meteo ↗
          </a>
        </div>
      </div>
    </section>
  );
}
