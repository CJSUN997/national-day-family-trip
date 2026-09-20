import { placeFavoriteDetails } from "./favorite-details";

export type SpotCategory =
  "美食" | "咖啡酒吧" | "景点" | "玩乐" | "购物" | "住宿" | "交通" | "备选";
export type MapSpot = {
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
  locationStatus?:
    | "已核验位置"
    | "区域锚点"
    | "普吉默认位置"
    | "曼谷默认位置";
  locationNote?: string;
};

export type PlaceFavorite = {
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

export type PracticalFavorite = {
  id: string;
  stage: "出发前" | "抵达日" | "普吉" | "曼谷" | "现场";
  name: string;
  note: string;
  sourceUrl: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
};

export const spotCategories: { name: "全部" | SpotCategory; color: string }[] = [
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

export const mapSpots: MapSpot[] = [
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

export const placeFavorites: PlaceFavorite[] = [
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

export type FavoriteLocation = {
  coordinates: [number, number];
  status: "已核验位置" | "区域锚点";
  note?: string;
};

// “已核验位置”只用于能与公开地图 POI 对上的地点；只有道路、街区、岛屿或
// 机场范围线索的收藏标为“区域锚点”。其余仍落到所属城市默认点，避免伪精确。
export const favoriteLocations: Record<string, FavoriteLocation> = {
  "central-phuket": {
    coordinates: [7.8911739, 98.3668714],
    status: "已核验位置",
  },
  "lamit-bounty": {
    coordinates: [7.8479, 98.2937],
    status: "区域锚点",
    note: "只确认到卡伦海滩片区，店名仍需在 Google Maps 复核。",
  },
  "karon-circle-food": {
    coordinates: [7.8489471, 98.2929395],
    status: "区域锚点",
    note: "定位到卡伦转盘；大排档摊位需按原帖画面现场辨认。",
  },
  banzaan: {
    coordinates: [7.8912856, 98.3017412],
    status: "已核验位置",
  },
  "hong-khao-tom-pla": {
    coordinates: [7.87667, 98.3932184],
    status: "已核验位置",
  },
  "phuket-old-town-favorite": {
    coordinates: [7.8845565, 98.3920742],
    status: "区域锚点",
    note: "定位到塔朗路核心街区，不代表单一入口。",
  },
  "racha-island": {
    coordinates: [7.6024486, 98.3654233],
    status: "区域锚点",
    note: "岛屿中心点；实际上下船码头由一日团确认。",
  },
  "laem-sai-cup": {
    coordinates: [7.8279, 98.2926],
    status: "区域锚点",
    note: "定位到 Soi Laem Sai 一带；导航前按店名确认入口。",
  },
  "the-commune": {
    coordinates: [7.8286674, 98.2931434],
    status: "已核验位置",
  },
  "blanket-pillow": {
    coordinates: [7.8093371, 98.2993862],
    status: "区域锚点",
    note: "按公开地址定位到 Kata Noi Road 路段，入口仍需复核。",
  },
  "phuket-airport-supper": {
    coordinates: [8.1132, 98.3069],
    status: "区域锚点",
    note: "只有机场附近线索，非具体摊位。",
  },
  "kata-laundry": {
    coordinates: [7.8214, 98.2992],
    status: "区域锚点",
    note: "只有卡塔海滩片区线索，门店需按原帖图片确认。",
  },
  "karon-old-town-bus": {
    coordinates: [7.8489471, 98.2929395],
    status: "区域锚点",
    note: "以卡伦转盘作上车片区参考，不代表已核验站点。",
  },
  "bang-krachao": {
    coordinates: [13.682, 100.565],
    status: "区域锚点",
    note: "绿肺片区中心点；骑行起点应以实际过河码头为准。",
  },
  "bang-nam-phueng": {
    coordinates: [13.6801412, 100.5742607],
    status: "已核验位置",
  },
  "khlong-toei-pier": {
    coordinates: [13.7072028, 100.5635823],
    status: "已核验位置",
  },
  "bang-na-pier": {
    coordinates: [13.6766314, 100.5873694],
    status: "已核验位置",
  },
  "soi-prachum": {
    coordinates: [13.7250253, 100.5228855],
    status: "已核验位置",
  },
  "sathorn-pier": {
    coordinates: [13.7183726, 100.5125661],
    status: "已核验位置",
  },
  "mitr-street": {
    coordinates: [13.7456, 100.4905],
    status: "区域锚点",
    note: "公开资料确认在 Tha Tien / Soi Tha Suphan 一带，精确入口待地图复核。",
  },
  "samrong-market": {
    coordinates: [13.6492199, 100.5961735],
    status: "区域锚点",
    note: "定位到 Samrong 市场群，原帖所指具体摊位未锁定。",
  },
  "chatuchak-favorite": {
    coordinates: [13.8002651, 100.5511228],
    status: "已核验位置",
  },
  "kodtalay-rca": {
    coordinates: [13.7535, 100.575],
    status: "区域锚点",
    note: "只确认到 RCA / Rama 9 片区；门店与营业状态需复核。",
  },
  yaowarat: {
    coordinates: [13.7411515, 100.5083113],
    status: "区域锚点",
    note: "定位到耀华力路核心路段，不代表单一店铺。",
  },
  asiatique: {
    coordinates: [13.7041568, 100.5027137],
    status: "已核验位置",
  },
  "jodd-fairs": {
    coordinates: [13.7681679, 100.5709179],
    status: "已核验位置",
  },
  "banthat-favorite": {
    coordinates: [13.7374014, 100.5219028],
    status: "区域锚点",
    note: "定位到 Banthat Thong Road 南段，按现场排队选择餐厅。",
  },
  "bonchon-bkk": {
    coordinates: [13.69, 100.75],
    status: "区域锚点",
    note: "以素万那普机场为锚点，尚未确认具体航站楼店位。",
  },
};

export const cityDefaultCoordinates: Record<PlaceFavorite["city"], [number, number]> = {
  普吉: [7.8804, 98.3923],
  曼谷: [13.7563, 100.5018],
};

export const mappedFavoriteSpots: MapSpot[] = placeFavorites.map((favorite) => {
  const location = favoriteLocations[favorite.id];
  const coordinates =
    location?.coordinates || cityDefaultCoordinates[favorite.city];
  return {
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
    locationStatus: location?.status || `${favorite.city}默认位置`,
    locationNote:
      location?.note ||
      "原帖未提供可稳定复核的地址，当前仅以所属城市作为地图占位。",
  };
});

export const mergedMapSpots = [...mapSpots, ...mappedFavoriteSpots];
export const defaultLocationCount = mappedFavoriteSpots.filter(
  (spot) => spot.locationStatus?.includes("默认位置"),
).length;
export const verifiedLocationCount = mappedFavoriteSpots.filter(
  (spot) => spot.locationStatus === "已核验位置",
).length;
export const regionalLocationCount = mappedFavoriteSpots.filter(
  (spot) => spot.locationStatus === "区域锚点",
).length;

export const itineraryRednoteSummaries: Record<string, string> = {
  "old-town": "彩色建筑与老街适合半日慢逛，可衔接普吉镇午餐。",
  hkt: "入境、取行李后按机场标识前往 Grab 上车点。",
  banthat: "把这里当作集中餐饮街，抵达曼谷后按排队情况选店。",
  iconsiam: "适合河岸、室内购物和雨天备用，可与湄南河船线衔接。",
  chatuchak: "周末市场适合返程日上午短逛，必须预留去机场时间。",
};

export function spotSummary(spot: MapSpot) {
  if (spot.favoriteId) {
    const digest =
      placeFavoriteDetails[
        spot.favoriteId as keyof typeof placeFavoriteDetails
      ];
    if (digest?.facts[0]) return `小红书：${digest.facts[0]}`;
  }
  const itinerarySummary = itineraryRednoteSummaries[spot.id];
  if (spot.sourceUrl && itinerarySummary)
    return `小红书：${itinerarySummary}`;
  return spot.note;
}

export const practicalFavorites: PracticalFavorite[] = [
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
