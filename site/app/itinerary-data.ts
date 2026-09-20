export type Event = { time: string; tag: string; title: string; note: string };
export type Day = {
  date: string;
  city: string;
  title: string;
  lead: string;
  pace: string;
  rule?: string;
  events: Event[];
};

export type MobileView = "overview" | "days" | "map" | "booking" | "tasks";
export type TaskFilter = "pending" | "done" | "all";

export const mobileNavigation: {
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

export const days: Day[] = [
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

export const tasks = [
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

