export type FavoriteDigest = {
  sourceTitle: string;
  facts: string[];
  tripUse: string;
  verify?: string;
};

export const placeFavoriteDetails = {
  "central-phuket": {
    sourceTitle: "Phuket Life 06🏝️超市觅食记",
    facts: [
      "Tops 位于 Central Phuket 地下一层，可集中补水果、饮料和简餐。",
      "属于商场内补给点，天气不好时也容易执行。",
    ],
    tripUse: "放在 10 月 6 日普吉镇行程里；确有补给需求再去，不单独跨区。",
    verify: "临行查看商场与超市当日营业时间。",
  },
  "lamit-bounty": {
    sourceTitle: "普吉岛卡伦海滩餐厅（谷歌高分）！夯👍",
    facts: [
      "笔记把它列为卡伦海滩附近的高性价比泰餐候选。",
      "冬阴功价格据笔记约为国内平台推荐店的三分之一，但没有可长期沿用的固定价格。",
    ],
    tripUse: "皇帝岛回程或卡伦晚餐时二选一，不为餐厅跨区。",
    verify: "英文店名拼写、地图位置、菜单价格和当日营业状态仍需复核。",
  },
  "karon-circle-food": {
    sourceTitle: "普吉岛卡伦沙滩最夯的大排档推荐👍附位置",
    facts: [
      "笔记价格线索：炒面约 70 THB、空心菜约 60 THB、鸡全翅约 20 THB。",
      "摊位只收现金；不想吃偏甜可在点餐时说 no sugar。",
    ],
    tripUse: "作为酒店附近的低成本晚餐候选，到现场按原帖画面辨认。",
    verify: "摊位位置、价格和营业时间可能变化，先备少量现金。",
  },
  banzaan: {
    sourceTitle: "普吉岛班赞海鲜市场，成品图在最后一张",
    facts: [
      "笔记推荐一楼 M433 海鲜档口，采购金额约 1700 THB。",
      "二楼 11 号加工档口约 900 THB；金额只作当时消费参考。",
    ],
    tripUse: "只有当天走芭东方向且全员想吃海鲜时再加入。",
    verify: "现场先确认称重、加工费、税费与做法，再付款。",
  },
  "hong-khao-tom-pla": {
    sourceTitle: "普吉镇米其林｜好吃到瞬间光盘的泰式海鲜",
    facts: [
      "笔记推荐炸蒜糖醋大虾和咖喱蟹。",
      "冬阴功评价相对一般，可把预算留给招牌海鲜。",
    ],
    tripUse: "10 月 6 日普吉镇午餐首选，与老镇步行行程组合。",
    verify: "临行确认排队情况、当日营业与海鲜时价。",
  },
  "phuket-old-town-favorite": {
    sourceTitle: "普吉岛｜闯进彩色普吉镇",
    facts: [
      "核心看点是彩色建筑、老街和集中餐饮，适合慢走拍照。",
      "半日已经足够覆盖主街，不需要再叠加多个远距离景点。",
    ],
    tripUse: "10 月 6 日安排半日，并与 Hong Khao Tom Pla、Central Phuket 组合。",
    verify: "周日夜市与本次抵达时间不匹配，不作为 10 月 4 日计划。",
  },
  "racha-island": {
    sourceTitle: "看完通透了！皇帝岛一日游到底怎么选船？",
    facts: [
      "选团顺序应是天气与海况、船型、晕船风险、保险、接送范围，再看价格。",
      "专辑里的低价一日游只作为价格线索，不能据此判断费用已全包。",
    ],
    tripUse: "天气允许时放在 10 月 5 日；不适合出海就与普吉镇日互换。",
    verify: "付款前逐项确认登岛费、保险、接送、取消和天气退款条款。",
  },
  "laem-sai-cup": {
    sourceTitle: "卡塔三家悬崖咖啡厅对比",
    facts: [
      "成人低消线索约 100 THB。",
      "有秋千和吊床，偏轻松休息型。",
    ],
    tripUse: "三家只选一家；想轻松坐一会儿时再选它。",
    verify: "低消、座位规则和雨天开放区域临行确认。",
  },
  "the-commune": {
    sourceTitle: "卡塔三家悬崖咖啡厅对比",
    facts: [
      "成人低消线索约 200 THB。",
      "有泳池和餐饮区，笔记认为三家中最适合拍照。",
    ],
    tripUse: "10 月 6 日傍晚的悬崖咖啡首选，天气好再执行。",
    verify: "确认日落时段座位、低消和泳池使用规则。",
  },
  "blanket-pillow": {
    sourceTitle: "卡塔三家悬崖咖啡厅对比",
    facts: [
      "成人低消线索约 90 THB，可沿楼梯下到礁石看日落。",
      "笔记记录了一次水果奶昔体验不佳，饮品可现场换选。",
    ],
    tripUse: "想看礁石日落且体力允许时作为 The Commune 的备选。",
    verify: "下雨、浪大或路滑时不要下礁石。",
  },
  "phuket-airport-supper": {
    sourceTitle: "普吉岛机场附近的夜宵摊子！巨便宜！",
    facts: [
      "多数餐食价格线索约 25–35 THB。",
      "位置主要依赖原帖画面辨认，不适合当作精确地图点。",
    ],
    tripUse: "10 月 4 日落地后明显饥饿、摊位顺路且不用排队时才吃。",
    verify: "酒店入住优先，不为夜宵延迟接机与休息。",
  },
  "kata-laundry": {
    sourceTitle: "夯！普吉岛卡塔海滩洗衣服，真实无广",
    facts: [
      "13 kg 档温水洗价格线索约 70 THB。",
      "烘干 40 分钟约 70 THB；洗衣液和柔顺剂各约 5 THB。",
    ],
    tripUse: "入住中途确有换洗需求再用，不提前占用行程时间。",
    verify: "按原帖图片核对门店，准备零钱并重新查看机器标价。",
  },
  "karon-old-town-bus": {
    sourceTitle: "卡伦海滩到普吉镇只要 10 块钱",
    facts: [
      "笔记给出的车费线索约 50 THB，可能为双条车或公共巴士。",
      "站点、班次和末班车并未达到可直接执行的核验程度。",
    ],
    tripUse: "10 月 6 日可体验；4 人同行时先与 Grab/包车总价和耗时比较。",
    verify: "当天向酒店或站点确认上车处、末班车和预计耗时。",
  },
  "laypang-durian": {
    sourceTitle: "普吉岛 5 家榴莲店",
    facts: ["位于普吉北部，是合集中的候选之一。", "原帖未提供足以锁定采购的稳定价格。"],
    tripUse: "只有北部路线顺路才买，不从卡塔专程前往。",
    verify: "现场比较品种、成熟度、称重方式和价格。",
  },
  "khun-nai-durian": {
    sourceTitle: "普吉岛 5 家榴莲店",
    facts: ["位于普吉中西部，笔记认为价格与品质相对均衡。", "属于路线型候选，不是必打卡点。"],
    tripUse: "从卡塔前往中西部时顺路比较。",
    verify: "现场比较品种、成熟度、称重方式和价格。",
  },
  "mr-tuang-durian": {
    sourceTitle: "普吉岛 5 家榴莲店",
    facts: ["位于普吉中南部，原帖列为高评分候选。", "没有必要为了评分单独横跨全岛。"],
    tripUse: "南部或中南部路线顺路时优先查看。",
    verify: "重新核对地图店名、当天库存和价格。",
  },
  "durian-heaven": {
    sourceTitle: "普吉岛 5 家榴莲店",
    facts: ["位于普吉南部，原帖主打品种选择较多。", "购买价值取决于当天品种和成熟度。"],
    tripUse: "只有南部路线顺路时考虑。",
    verify: "先试吃或确认成熟度，再决定购买数量。",
  },
  "rawai-durian": {
    sourceTitle: "普吉岛 5 家榴莲店",
    facts: ["拉威附近，原帖称营业时间相对较晚。", "对卡塔住宿并非默认顺路。"],
    tripUse: "神仙半岛或拉威方向结束后顺路查看。",
    verify: "营业时间和库存属于动态信息。",
  },
  "bang-krachao": {
    sourceTitle: "在曼谷巨肺騎自行車",
    facts: [
      "邦克拉昭被称为曼谷绿肺，适合骑行和低密度自然体验。",
      "码头附近自行车/电动车租金线索约 50–100 THB/天。",
    ],
    tripUse: "10 月 9 日周五上午骑行，下午回城休息和逛商圈。",
    verify: "当天看降雨、路况、车辆押金和还车时间。",
  },
  "bang-nam-phueng": {
    sourceTitle: "在曼谷巨肺騎自行車",
    facts: [
      "市场营业线索为周六、周日及节假日约 08:00–16:00。",
      "非周末仍可骑行，但不能把市场当核心目的。",
    ],
    tripUse: "本次周五大概率不开，只作为路线知识保留。",
    verify: "若日期再调整到周末，临行确认当天是否营业。",
  },
  "khlong-toei-pier": {
    sourceTitle: "在曼谷巨肺騎自行車",
    facts: ["先到 MRT Khlong Toei，再转车前往码头。", "从码头乘渡船进入邦克拉昭。"],
    tripUse: "住宿靠近 MRT 或曼谷中心西侧时考虑这条进岛路线。",
    verify: "当天核对码头名称、渡船运营时间与返程方式。",
  },
  "bang-na-pier": {
    sourceTitle: "在曼谷巨肺騎自行車",
    facts: ["先到 BTS Bang Na，再转车前往 Wat Bang Na Nok Pier。", "从码头乘渡船进入邦克拉昭。"],
    tripUse: "若要顺路 Samrong 或住宿靠东，可选这条路线。",
    verify: "当天核对渡船运营时间与最后返程时间。",
  },
  "soi-prachum": {
    sourceTitle: "曼谷市区最大的早市一条街（人均15+）",
    facts: [
      "评论区确认英文定位为 Soi Prachum Market，靠近帕蓬一带。",
      "笔记称早晨营业，人均约 15 元起；价格只作参考。",
    ],
    tripUse: "放在 10 月 8 日早餐，吃完再去湄南河一线。",
    verify: "临行确认营业日、早餐时段和当前摊位情况。",
  },
  "sathorn-pier": {
    sourceTitle: "在曼谷花的最值的 8 元（附路线）",
    facts: [
      "傍晚约 17:30 上船可看日落，线路经过 ICONSIAM、郑王庙一带。",
      "低价票信息只作线索，不默认所有船线和票种同价。",
    ],
    tripUse: "10 月 8 日从 Sathorn Pier 上船，衔接 Tha Tien、唐人街或 Asiatique。",
    verify: "上船前确认船旗颜色、方向、末班时间和票价。",
  },
  "mitr-street": {
    sourceTitle: "曼谷老楼里的绝美寺庙景",
    facts: [
      "Tha Tien 老城区的 6 层老楼，顶层可看卧佛寺与湄南河。",
      "原帖营业时间线索为 11:00–22:00；交通为 MRT Sanam Chai 1 号口。",
    ],
    tripUse: "10 月 8 日日落前到达；符合不去大皇宫但想看老城河景的偏好。",
    verify: "临行确认营业、订位、楼层开放与最低消费。",
  },
  "samrong-market": {
    sourceTitle: "9 月泰国 9 种水果可以吃",
    facts: ["原帖按 9 月时令水果给出选购灵感。", "Samrong Center Market 位于曼谷偏东。"],
    tripUse: "只有走 Bang Na 渡口且体力允许时顺路购买。",
    verify: "品种、价格与成熟度以当天摊位为准。",
  },
  "chatuchak-favorite": {
    sourceTitle: "曼谷跳蚤市场",
    facts: ["专辑中的跳蚤市场对应 Chatuchak Weekend Market。", "10 月 10 日是周六，日期匹配周末市场。"],
    tripUse: "返程日上午最多停留 2–3 小时，并提前回酒店取行李。",
    verify: "先以 19:50 国际航班倒推，约 16:00–16:30 离开市区。",
  },
  "kodtalay-rca": {
    sourceTitle: "曼谷活虾海鲜自助",
    facts: ["评论区确认地点为 RCA Rama 9 店。", "笔记称营业到较晚时段，适合预约后前往。"],
    tripUse: "10 月 9 日晚与 Banthat Thong 二选一。",
    verify: "预约、用餐时限、价格档位、税费和当日营业都需复核。",
  },
  yaowarat: {
    sourceTitle: "曼谷夜市盘点（2026）",
    facts: ["唐人街适合夜间集中吃饭和逛街。", "与湄南河、Tha Tien 老城区组合最顺路。"],
    tripUse: "10 月 8 日晚餐首选之一，与 Asiatique 二选一。",
    verify: "按当天体力选少量店铺，不追求整条清单。",
  },
  asiatique: {
    sourceTitle: "曼谷夜市盘点（2026）",
    facts: ["河滨夜市可从湄南河行程自然衔接。", "更偏旅游型体验，景观优先、性价比次之。"],
    tripUse: "10 月 8 日想继续看河景时使用，与唐人街二选一。",
    verify: "查看返酒店交通与末班船/车时间。",
  },
  "jodd-fairs": {
    sourceTitle: "曼谷夜市盘点（2026）",
    facts: ["专辑把 JODD FAIRS Ratchada 列为夜市候选。", "夜市地址和品牌运营位置可能调整。"],
    tripUse: "只有曼谷酒店靠近拉差达时才选。",
    verify: "临行重新确认当前地址、营业日和交通。",
  },
  "banthat-favorite": {
    sourceTitle: "曼谷夜市盘点（2026）",
    facts: ["原帖称其为朱拉隆功夜市，更适合作为一条餐饮街理解。", "店铺密集，没必要预设每一家。"],
    tripUse: "10 月 7 日抵达曼谷后的晚餐，或 10 月 9 日晚餐候选。",
    verify: "按酒店位置和排队情况现场选店。",
  },
  "bonchon-bkk": {
    sourceTitle: "素万那普机场炸鸡",
    facts: ["位于素万那普机场范围，适合作为候机餐饮线索。", "不值得为单店提前很久到机场。"],
    tripUse: "完成值机与安检后、确有时间再吃。",
    verify: "以所在航站区域、安检内外位置和营业状态为准。",
  },
} satisfies Record<string, FavoriteDigest>;

export const practicalFavoriteDetails = {
  "practical-hkt-grab": {
    sourceTitle: "普吉岛入境指南和 Grab 打车指南 51 秒无废话",
    facts: ["原帖用于快速确认入境、离开航站楼和网约车上车点的顺序。", "它是抵达操作资料，不是景点收藏。"],
    tripUse: "10 月 4 日飞机落地后置顶打开，按现场指示完成入境、取行李和叫车。",
    verify: "机场上车点可能调整，以 Grab 应用和现场标识为准。",
  },
  "practical-tdac": {
    sourceTitle: "泰国最新版入境卡中文版",
    facts: ["TDAC 标记为出发前必办事项。", "社交平台图解只帮助理解字段，最终要求必须看泰国移民局官方页面。"],
    tripUse: "四人分别完成并保存确认信息，出发前再逐人核对。",
    verify: "只使用官方免费入口，不通过陌生付费代填网站提交证件信息。",
  },
  "practical-passport-benefit": {
    sourceTitle: "来泰国旅行，中国护照有“隐藏福利”",
    facts: ["原帖整理中国护照可能适用的商户礼遇。", "优惠具有活动期限、参与门店和领取条件。"],
    tripUse: "购物日前快速查看，能顺路领取就用，不为了优惠改变路线。",
    verify: "以品牌或商场当日官方规则为准，截图不作为最终凭证。",
  },
  "practical-tuktuk": {
    sourceTitle: "曼谷坐嘟嘟车不怕被坑了",
    facts: ["原帖提供正规嘟嘟车软件线索，目标是先看价格与车辆信息。", "覆盖范围可能有限，不能替代 Grab/Bolt。"],
    tripUse: "曼谷短途体验时比较一次价格，长距离仍优先轨道交通或网约车。",
    verify: "下载前核对应用名称、开发者、付款方式和覆盖区。",
  },
  "practical-laundry": {
    sourceTitle: "夯！普吉岛卡塔海滩洗衣服，真实无广",
    facts: ["13 kg 温水洗约 70 THB。", "烘干 40 分钟约 70 THB；洗衣液、柔顺剂各约 5 THB。"],
    tripUse: "普吉住宿中途确有需要时使用，带零钱并留出取衣时间。",
    verify: "重新核对门店位置、机器容量和现场价格。",
  },
  "practical-delivery": {
    sourceTitle: "没想到在普吉岛点外卖竟然这么好吃",
    facts: ["原帖证明普吉外卖可作为低体力用餐方案。", "实际可选店铺取决于酒店地址、配送距离和当时天气。"],
    tripUse: "10 月 4 日晚到、雨天或跳岛后疲劳时使用。",
    verify: "下单前确认酒店是否允许送到大堂、配送费和预计时间。",
  },
  "practical-bus": {
    sourceTitle: "卡伦海滩到普吉镇只要 10 块钱",
    facts: ["车费线索约 50 THB。", "站点、班次、末班车和耗时需要当天确认。"],
    tripUse: "10 月 6 日四人同时出发时，先与 Grab/包车总价和节省时间比较。",
    verify: "请酒店或站点工作人员确认上车处，不凭截图猜站点。",
  },
  "practical-boat": {
    sourceTitle: "皇帝岛一日游到底怎么选船",
    facts: ["先看船型与晕船风险，再核对保险、接送范围和天气取消。", "“56 元一日游”只作低价线索，可能不含完整费用。"],
    tripUse: "预订 10 月 5 日项目时逐项对照，不以最低价为决策依据。",
    verify: "确认登岛费、保险责任、接送区域、退改和海况停航处理。",
  },
  "practical-rules": {
    sourceTitle: "带家人出门旅行前务必宣誓",
    facts: ["三篇同类内容合并为一张同行规则卡。", "核心议题是集合、预算、体力、临时分组和迟到处理。"],
    tripUse: "出发前四人达成共识；有人不想出海或射击时允许分组。",
    verify: "每天只约定关键集合点，不把临时变化理解为违约。",
  },
  "practical-photo": {
    sourceTitle: "旅游拍照，两个动作够用 100 年",
    facts: ["两篇拍照笔记合并为现场动作提示。", "作用是快速找姿势，不在景点反复刷视频。"],
    tripUse: "普吉老镇、悬崖咖啡和河边拍照前快速打开。",
    verify: "以安全为先，礁石、路边和码头不为动作冒险。",
  },
  "practical-snacks": {
    sourceTitle: "希望在泰国旅游的上飞机前能刷到",
    facts: ["便利店食品和街头烤肠都属于机会型收藏。", "适合行程间隙补充，不值得为单品跨区。"],
    tripUse: "看到顺路、卫生状况合适再试，保留正餐胃口。",
    verify: "注意过敏原、辣度、保存温度和现场卫生。",
  },
} satisfies Record<string, FavoriteDigest>;
