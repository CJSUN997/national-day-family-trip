"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  placeFavoriteDetails,
  practicalFavoriteDetails,
  type FavoriteDigest,
} from "./favorite-details";

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
  { id: "map", label: "收藏", icon: "pin" },
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
  sourceUrl?: string;
  sourceKind?: "收藏点";
  favoriteId?: string;
};

type PlaceFavorite = {
  id: string;
  city: "普吉" | "曼谷";
  category: SpotCategory;
  name: string;
  note: string;
  query: string;
  priority: "高" | "中" | "低";
  status: "已核验" | "待核验";
  tags: string[];
  sourceUrl: string;
  pinned?: boolean;
};

type PracticalFavorite = {
  id: string;
  stage: "出发前" | "抵达日" | "普吉" | "曼谷" | "现场";
  name: string;
  note: string;
  sourceUrl: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
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
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a888cd00000000016020a40",
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
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa14770000000002601bd69",
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
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a9e2313000000002603322e",
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
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a9e2313000000002603322e",
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
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa9da35000000002b027a3f",
  },
];

const placeFavorites: PlaceFavorite[] = [
  {
    id: "central-phuket",
    city: "普吉",
    category: "购物",
    name: "Central Phuket / Tops",
    note: "补给、水果和简餐；适合与普吉老镇同日，雨天也可用。",
    query: "Tops Central Phuket",
    priority: "中",
    status: "已核验",
    tags: ["补给", "雨天"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aae3e6c000000001200251c",
  },
  {
    id: "lamit-bounty",
    city: "普吉",
    category: "美食",
    name: "Lamit Bounty Restaurant",
    note: "卡伦附近的高性价比候选；英文店名仍需在地图中复核。",
    query: "Lamit Bounty Restaurant Karon Phuket",
    priority: "高",
    status: "待核验",
    tags: ["卡伦", "正餐"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a89c94600000000180187e7",
  },
  {
    id: "karon-circle-food",
    city: "普吉",
    category: "美食",
    name: "卡伦转盘附近大排档",
    note: "现金友好型晚餐；到现场按原帖图片辨认，不专程跨区。",
    query: "Karon Circle Phuket",
    priority: "中",
    status: "待核验",
    tags: ["卡伦", "仅现金"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa93298000000002802a12d",
  },
  {
    id: "banzaan",
    city: "普吉",
    category: "美食",
    name: "Banzaan Fresh Market",
    note: "班赞海鲜市场；只有安排芭东方向时才顺路加入。",
    query: "Banzaan Fresh Market Phuket",
    priority: "中",
    status: "已核验",
    tags: ["海鲜", "市场"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa4256c000000002700839c",
  },
  {
    id: "hong-khao-tom-pla",
    city: "普吉",
    category: "美食",
    name: "Hong Khao Tom Pla",
    note: "普吉镇泰式海鲜；与老镇行程组合，优先级高。",
    query: "Hong Khao Tom Pla Restaurant Phuket",
    priority: "高",
    status: "已核验",
    tags: ["普吉镇", "海鲜"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa23a7d00000000110338d3",
    pinned: true,
  },
  {
    id: "phuket-old-town-favorite",
    city: "普吉",
    category: "景点",
    name: "Phuket Old Town",
    note: "彩色建筑与老街；适合半日慢逛并衔接午餐。",
    query: "Phuket Old Town Thalang Road",
    priority: "高",
    status: "已核验",
    tags: ["街区", "拍照"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a888cd00000000016020a40",
    pinned: true,
  },
  {
    id: "racha-island",
    city: "普吉",
    category: "玩乐",
    name: "Racha Island / 皇帝岛",
    note: "按天气、船型、保险与接送选择；不以最低价下单。",
    query: "Racha Island Phuket",
    priority: "高",
    status: "已核验",
    tags: ["海岛", "需预约"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a87296f000000003a0226a6",
    pinned: true,
  },
  {
    id: "laem-sai-cup",
    city: "普吉",
    category: "咖啡酒吧",
    name: "Laem Sai Cup Cafe",
    note: "卡塔附近悬崖咖啡；有秋千和吊床，三家只选一家。",
    query: "Laem Sai Cup Cafe Phuket",
    priority: "中",
    status: "已核验",
    tags: ["日落", "卡塔"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a871891000000003300c684",
  },
  {
    id: "the-commune",
    city: "普吉",
    category: "咖啡酒吧",
    name: "The Commune Resto Bar",
    note: "三家悬崖咖啡中的首选；有泳池与餐饮区。",
    query: "The Commune Resto Bar Phuket",
    priority: "高",
    status: "已核验",
    tags: ["日落", "出片"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a871891000000003300c684",
  },
  {
    id: "blanket-pillow",
    city: "普吉",
    category: "咖啡酒吧",
    name: "A Blanket & A Pillow",
    note: "可下到礁石看日落；水果奶昔有一次负面体验。",
    query: "A Blanket & A Pillow Phuket",
    priority: "中",
    status: "已核验",
    tags: ["日落", "礁石"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a871891000000003300c684",
  },
  {
    id: "phuket-airport-supper",
    city: "普吉",
    category: "备选",
    name: "普吉机场夜宵摊",
    note: "航班晚到且不排队时顺路；不建议为此延迟入住。",
    query: "Phuket Airport local food",
    priority: "低",
    status: "待核验",
    tags: ["机场", "夜宵"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aad6410000000000b036e04",
  },
  {
    id: "kata-laundry",
    city: "普吉",
    category: "备选",
    name: "卡塔自助洗衣",
    note: "需要时再用；具体位置与现金要求按原帖图片确认。",
    query: "self service laundry Kata Beach Phuket",
    priority: "低",
    status: "待核验",
    tags: ["生活", "洗衣"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aaab19d000000002502feb0",
  },
  {
    id: "karon-old-town-bus",
    city: "普吉",
    category: "交通",
    name: "卡伦—普吉镇公共交通",
    note: "约50 THB线索；出发前复核站点、末班车与耗时。",
    query: "Karon Beach bus to Phuket Old Town",
    priority: "高",
    status: "待核验",
    tags: ["公交", "省钱"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a9963e50000000028039723",
  },
  ...[
    ["laypang-durian", "Laypang Durian Shop", "Laypang Durian Shop Phuket", "北部榴莲候选；只在顺路时购买。"],
    ["khun-nai-durian", "Khun Nai Durian", "Khun Nai Durian Phuket", "中西部榴莲候选；价格与品质需现场比较。"],
    ["mr-tuang-durian", "Mr. Tuang Durian", "Mr. Tuang Durian Phuket", "中南部候选；原帖列为高评分店。"],
    ["durian-heaven", "Durian Heaven", "Durian Heaven Phuket", "南部品种型候选；不为水果横跨全岛。"],
    ["rawai-durian", "Rawai Durian Shop", "Rawai Durian Shop Phuket", "拉威附近、营业较晚；仅南部路线顺路。"],
  ].map(([id, name, query, note]) => ({
    id,
    city: "普吉" as const,
    category: "美食" as const,
    name,
    note,
    query,
    priority: "低" as const,
    status: "待核验" as const,
    tags: ["水果", "顺路"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa910c30000000026015e2a",
  })),
  {
    id: "bang-krachao",
    city: "曼谷",
    category: "玩乐",
    name: "Bang Krachao",
    note: "曼谷绿肺骑行；周五不把周末水上市场作为核心。",
    query: "Bang Krachao Bangkok",
    priority: "高",
    status: "已核验",
    tags: ["骑行", "自然"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a8d177900000000370305ea",
    pinned: true,
  },
  {
    id: "bang-nam-phueng",
    city: "曼谷",
    category: "购物",
    name: "Bang Nam Phueng Floating Market",
    note: "周末市场；本次周五骑行时大概率不开。",
    query: "Bang Nam Phueng Floating Market",
    priority: "中",
    status: "已核验",
    tags: ["周末", "市场"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a8d177900000000370305ea",
  },
  ...[
    ["khlong-toei-pier", "Wat Khlong Toei Nok Pier", "Wat Khlong Toei Nok Pier", "MRT Khlong Toei方向的过河码头。"],
    ["bang-na-pier", "Wat Bang Na Nok Pier", "Wat Bang Na Nok Pier", "BTS Bang Na方向的过河码头。"],
  ].map(([id, name, query, note]) => ({
    id,
    city: "曼谷" as const,
    category: "交通" as const,
    name,
    note,
    query,
    priority: "中" as const,
    status: "已核验" as const,
    tags: ["码头", "Bang Krachao"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a8d177900000000370305ea",
  })),
  {
    id: "soi-prachum",
    city: "曼谷",
    category: "美食",
    name: "Soi Prachum Market",
    note: "早餐早市；原帖评论确认英文定位，营业状态需临行复核。",
    query: "Soi Prachum Market Bangkok",
    priority: "高",
    status: "已核验",
    tags: ["早市", "早餐"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a9f84f100000000290109bd",
    pinned: true,
  },
  {
    id: "sathorn-pier",
    city: "曼谷",
    category: "交通",
    name: "Sathorn Pier / 湄南河公交船",
    note: "傍晚河上看日落；可衔接老城区或河滨夜市。",
    query: "Sathorn Pier Bangkok",
    priority: "高",
    status: "已核验",
    tags: ["轮渡", "日落"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a9ec5ca00000000260322fc",
    pinned: true,
  },
  {
    id: "mitr-street",
    city: "曼谷",
    category: "美食",
    name: "Mitr Street by Ruay Mitr",
    note: "Tha Tien老城区河景餐厅；符合不去大皇宫的路线。",
    query: "Mitr Street by Ruay Mitr Bangkok",
    priority: "高",
    status: "已核验",
    tags: ["河景", "老城区"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa76ff7000000000b00d5a2",
    pinned: true,
  },
  {
    id: "samrong-market",
    city: "曼谷",
    category: "购物",
    name: "Samrong Center Market",
    note: "偏东的水果市场；仅与Bang Na方向组合。",
    query: "Samrong Center Market Bangkok",
    priority: "中",
    status: "已核验",
    tags: ["水果", "市场"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a967147000000002a02e693",
  },
  {
    id: "chatuchak-favorite",
    city: "曼谷",
    category: "购物",
    name: "Chatuchak Weekend Market",
    note: "10月10日周六可选；必须给晚间航班留足缓冲。",
    query: "Chatuchak Weekend Market Bangkok",
    priority: "中",
    status: "已核验",
    tags: ["周末", "市场"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa9da35000000002b027a3f",
  },
  {
    id: "kodtalay-rca",
    city: "曼谷",
    category: "美食",
    name: "Kodtalay Seafood Buffet RCA",
    note: "活虾海鲜自助候选；需确认预约、税费和当日营业。",
    query: "Kodtalay Seafood Buffet RCA Rama 9",
    priority: "中",
    status: "已核验",
    tags: ["海鲜", "需预约"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a962776000000002b026d7f",
  },
  ...[
    ["yaowarat", "Chinatown / Yaowarat", "Yaowarat Road Bangkok", "老城区夜间餐饮首选；与湄南河同日最顺。", "高", "已核验"],
    ["asiatique", "Asiatique The Riverfront", "Asiatique The Riverfront", "河滨夜市；风景优先，性价比次之。", "中", "已核验"],
    ["jodd-fairs", "JODD FAIRS Ratchada", "JODD FAIRS Ratchada", "住宿靠近拉差达时再选；临行复核当前地址。", "中", "待核验"],
    ["banthat-favorite", "Banthat Thong Road", "Banthat Thong Road Bangkok", "更适合作为一条餐饮街，不按单店打卡。", "中", "已核验"],
  ].map(([id, name, query, note, priority, status]) => ({
    id,
    city: "曼谷" as const,
    category: "美食" as const,
    name,
    note,
    query,
    priority: priority as "高" | "中" | "低",
    status: status as "已核验" | "待核验",
    tags: ["夜间", "餐饮"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a9e2313000000002603322e",
  })),
  {
    id: "bonchon-bkk",
    city: "曼谷",
    category: "备选",
    name: "Bonchon Suvarnabhumi Airport",
    note: "候机顺路再吃；不为此提前到机场。",
    query: "Bonchon Suvarnabhumi Airport",
    priority: "低",
    status: "待核验",
    tags: ["机场", "候机"],
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa77602000000002a02e91d",
  },
];

// 只把名称和位置都足够明确的收藏加入地图。其余候选继续留在“待核验”分类，
// 避免因为帖子截图或旧定位而把同行人带到错误地点。
const favoriteMapCoordinates: Record<string, [number, number]> = {
  "central-phuket": [7.8913, 98.3673],
  banzaan: [7.8914, 98.3016],
  "racha-island": [7.6083, 98.3663],
  "bang-krachao": [13.682, 100.565],
  "bang-nam-phueng": [13.681, 100.5807],
  "khlong-toei-pier": [13.7065, 100.5594],
  "bang-na-pier": [13.6599, 100.5947],
  "sathorn-pier": [13.7186, 100.5142],
  "mitr-street": [13.7456, 100.4905],
  "samrong-market": [13.6472, 100.595],
  yaowarat: [13.7402, 100.5096],
  asiatique: [13.7049, 100.5031],
};

const mappedFavoriteSpots: MapSpot[] = placeFavorites.flatMap((favorite) => {
  const coordinates = favoriteMapCoordinates[favorite.id];
  if (!coordinates) return [];
  return [
    {
      id: `favorite-${favorite.id}`,
      day: "收藏",
      city: favorite.city,
      category: favorite.category,
      name: favorite.name,
      note: favorite.note,
      lat: coordinates[0],
      lon: coordinates[1],
      query: favorite.query,
      sourceUrl: favorite.sourceUrl,
      sourceKind: "收藏点",
      favoriteId: favorite.id,
    },
  ];
});

const mergedMapSpots = [...mapSpots, ...mappedFavoriteSpots];

const practicalFavorites: PracticalFavorite[] = [
  {
    id: "practical-hkt-grab",
    stage: "抵达日",
    name: "普吉机场入境与 Grab 上车点",
    note: "10月4日置顶；用于入境、出航站楼和叫车，不作为景点。",
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa14770000000002601bd69",
  },
  {
    id: "practical-tdac",
    stage: "出发前",
    name: "泰国电子入境卡 TDAC",
    note: "标记为必办；填写时间与入口最终以泰国移民局官网为准。",
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa64d02000000002a0272fa",
  },
  {
    id: "practical-passport-benefit",
    stage: "出发前",
    name: "中国护照专属礼遇",
    note: "使用前核对有效期、参与商户和领取条件；截图不作为最终凭证。",
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aacb5cc000000001000059f",
  },
  {
    id: "practical-tuktuk",
    stage: "曼谷",
    name: "正规嘟嘟车软件",
    note: "先核对应用名称、覆盖区和付款方式；不能替代全城 Grab/Bolt。",
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aae4452000000000d02c568",
  },
  {
    id: "practical-laundry",
    stage: "普吉",
    name: "卡塔自助洗衣操作卡",
    note: "需要时再用；保留位置截图、机器容量和现金要求。",
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aaab19d000000002502feb0",
  },
  {
    id: "practical-delivery",
    stage: "普吉",
    name: "普吉外卖备选",
    note: "抵达晚、下雨或疲劳时使用；配送范围以酒店地址为准。",
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aaf48f000000000260145d1",
  },
  {
    id: "practical-bus",
    stage: "普吉",
    name: "卡伦到普吉镇公交",
    note: "出发前复核站点、末班车和耗时；4人同行要与打车总价比较。",
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a9963e50000000028039723",
  },
  {
    id: "practical-boat",
    stage: "出发前",
    name: "皇帝岛选船指南",
    note: "重点核对船型、晕船风险、保险、接送范围和天气取消条款。",
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a87296f000000003a0226a6",
    secondaryUrl:
      "https://www.xiaohongshu.com/explore/6a816ecd000000003300b4e4",
    secondaryLabel: "低价线索",
  },
  {
    id: "practical-rules",
    stage: "出发前",
    name: "同行约定",
    note: "提前约定集合、预算、体力、临时分组和迟到处理。",
    sourceUrl:
      "https://www.xiaohongshu.com/explore/68dc786c0000000007015bef",
  },
  {
    id: "practical-photo",
    stage: "现场",
    name: "拍照动作参考",
    note: "现场快速查看动作摘要，避免在景点反复刷视频。",
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6a3bcc21000000001700a724",
    secondaryUrl:
      "https://www.xiaohongshu.com/explore/6aa6913a0000000012003444",
    secondaryLabel: "动作二",
  },
  {
    id: "practical-snacks",
    stage: "现场",
    name: "便利店与街头小吃",
    note: "看见顺路再试，不为单品跨区移动。",
    sourceUrl:
      "https://www.xiaohongshu.com/explore/6aa75dac000000002b001738",
    secondaryUrl:
      "https://www.xiaohongshu.com/explore/6aad2d8b00000000190300e7",
    secondaryLabel: "烤肠",
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

function TripMap({ mobileActive = false }: { mobileActive?: boolean }) {
  const holder = useRef<HTMLDivElement | null>(null);
  const [collectionView, setCollectionView] = useState<
    "map" | "places" | "practical"
  >("map");
  const [mapScope, setMapScope] = useState<
    "全部" | "行程点" | "普吉收藏" | "曼谷收藏"
  >("全部");
  const [activeDay, setActiveDay] = useState("全部");
  const [activeCategory, setActiveCategory] = useState<"全部" | SpotCategory>(
    "全部",
  );
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [placeScope, setPlaceScope] = useState<
    "全部" | "行程置顶" | "普吉" | "曼谷" | "待核验"
  >("全部");
  const [practicalStage, setPracticalStage] = useState<
    "全部" | PracticalFavorite["stage"]
  >("全部");
  const [collectionQuery, setCollectionQuery] = useState("");
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
          (activeCategory === "全部" || spot.category === activeCategory) &&
          (!favoritesOnly || favorites.includes(favoriteKey))
        );
      }),
    [activeDay, activeCategory, favoritesOnly, favorites, mapScope],
  );
  const filteredPlaces = useMemo(() => {
    const query = collectionQuery.trim().toLocaleLowerCase("zh-CN");
    return placeFavorites.filter((spot) => {
      const scopeMatched =
        placeScope === "全部" ||
        (placeScope === "行程置顶" && spot.pinned) ||
        (placeScope === "待核验" && spot.status === "待核验") ||
        spot.city === placeScope;
      const textMatched =
        !query ||
        [spot.name, spot.note, spot.category, ...spot.tags]
          .join(" ")
          .toLocaleLowerCase("zh-CN")
          .includes(query);
      return (
        scopeMatched &&
        textMatched &&
        (!favoritesOnly || favorites.includes(spot.id))
      );
    });
  }, [collectionQuery, favorites, favoritesOnly, placeScope]);
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
        L.marker(point, { icon })
          .addTo(map!)
          .bindPopup(
            `<b>${spot.name}</b><br><small>${sourceLabel} · ${spot.category} · ${spot.city} · ${spot.note}</small><br><a href="${googlePlaceUrl(spot.query)}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a>${sourceLink}`,
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
          text="地图看位置，分类看笔记摘要；星标仅保存在当前设备。"
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
            className={collectionView !== "practical" ? "active" : ""}
            onClick={() => setCollectionView("map")}
            aria-pressed={collectionView !== "practical"}
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

        {collectionView !== "practical" && (
          <div className="place-view-switch" aria-label="地点收藏查看方式">
            <button
              className={collectionView === "map" ? "active" : ""}
              onClick={() => setCollectionView("map")}
              aria-pressed={collectionView === "map"}
            >
              <b>地图查看</b>
              <small>{mergedMapSpots.length} 个已定位点</small>
            </button>
            <button
              className={collectionView === "places" ? "active" : ""}
              onClick={() => setCollectionView("places")}
              aria-pressed={collectionView === "places"}
            >
              <b>分类查看</b>
              <small>{placeFavorites.length} 个收藏</small>
            </button>
          </div>
        )}

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
              {mapSpots.length} 个行程点 + {mappedFavoriteSpots.length} 个已核验收藏点
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
                    ? mergedMapSpots.length
                    : mergedMapSpots.filter(
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
                        {spot.sourceKind || `行程点 · ${spot.day}`} · {spot.city}
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
                      <div className="spot-actions">
                        <a
                          href={googlePlaceUrl(spot.query)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Google Maps ↗
                        </a>
                        {spot.sourceUrl && (
                          <a
                            className="xhs-link"
                            href={spot.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            小红书原帖 ↗
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      className={
                        favorites.includes(spot.favoriteId || spot.id)
                          ? "saved"
                          : ""
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
                  </article>
                ))
              )}
            </div>
          </div>
          <p className="map-privacy">
            地图不读取Google账号或个人位置；合并显示 {mapSpots.length} 个行程点和 {mappedFavoriteSpots.length} 个已核验收藏点。位置不够确定的候选不会猜测落点，请在“分类查看”中按原帖与地图重新核验。
          </p>
        </div>

        <div
          className={`collection-panel ${collectionView === "places" ? "active" : ""}`}
          aria-hidden={collectionView !== "places"}
        >
          <div className="collection-toolbar">
            <label>
              <span>搜索收藏</span>
              <input
                type="search"
                value={collectionQuery}
                onChange={(event) => setCollectionQuery(event.target.value)}
                placeholder="店名、区域或标签"
              />
            </label>
            <button
              className={favoritesOnly ? "active" : ""}
              onClick={() => setFavoritesOnly(!favoritesOnly)}
            >
              ★ 仅看星标 {favorites.length > 0 && `· ${favorites.length}`}
            </button>
          </div>
          <div className="collection-filter" aria-label="地点收藏筛选">
            {(["全部", "行程置顶", "普吉", "曼谷", "待核验"] as const).map(
              (scope) => (
                <button
                  className={placeScope === scope ? "active" : ""}
                  onClick={() => setPlaceScope(scope)}
                  key={scope}
                >
                  {scope}
                </button>
              ),
            )}
            <small>{filteredPlaces.length} 个地点</small>
          </div>
          <div className="collection-grid place-collection-grid">
            {filteredPlaces.length === 0 ? (
              <div className="collection-empty">
                <b>没有匹配的地点</b>
                <span>清空搜索或切换收藏夹分类</span>
              </div>
            ) : (
              filteredPlaces.map((spot) => (
                <article className="collection-card" key={spot.id}>
                  <header>
                    <span className={`priority priority-${spot.priority}`}>
                      {spot.priority}优先级
                    </span>
                    <button
                      className={favorites.includes(spot.id) ? "saved" : ""}
                      onClick={() => toggleFavorite(spot.id)}
                      aria-label={
                        favorites.includes(spot.id) ? "取消收藏" : "收藏地点"
                      }
                    >
                      {favorites.includes(spot.id) ? "★" : "☆"}
                    </button>
                  </header>
                  <small>
                    {spot.city} · {spot.category}
                    <i className={spot.status === "待核验" ? "pending" : ""}>
                      {spot.status}
                    </i>
                  </small>
                  <h3>{spot.name}</h3>
                  <p>{spot.note}</p>
                  <div className="collection-tags">
                    {spot.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <FavoriteDigestPanel
                    digest={
                      placeFavoriteDetails[
                        spot.id as keyof typeof placeFavoriteDetails
                      ]
                    }
                    sourceUrl={spot.sourceUrl}
                  />
                  <div className="collection-actions">
                    <a
                      href={googlePlaceUrl(spot.query)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      地图导航
                    </a>
                  </div>
                </article>
              ))
            )}
          </div>
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
