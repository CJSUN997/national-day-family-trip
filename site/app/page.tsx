"use client";

import { ChangeEvent, type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

type DayPlan = {
  day: number;
  date: string;
  title: string;
  route: string;
  summary: string;
  activities: { time: string; type: string; title: string; note: string }[];
};

type Candidate = {
  id: "phuket" | "bali";
  label: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  weather: string;
  route: string[];
  strengths: string[];
  risks: string[];
  days: DayPlan[];
};

type SiteData = {
  candidates: Candidate[];
  checklist: { id: string; phase: string; title: string; note: string }[];
};

const initialData: SiteData = {
  candidates: [
    {
      id: "phuket",
      label: "候选 A",
      eyebrow: "THAILAND · CITY + ISLAND",
      title: "曼谷 × 普吉本岛",
      subtitle: "用曼谷满足美食、夜市与城市体验，用普吉完成海滩、SPA与度假酒店。",
      accent: "#ea6b45",
      weather: "10月仍在季风尾声：每天按本岛方案成立，出海只在海况良好时加选",
      route: ["北京", "曼谷", "普吉本岛", "上海 / 北京"],
      strengths: ["往返均有直飞组合可筛选", "泰国美食、SPA和海边覆盖全员高分项", "曼谷3晚＋普吉4晚，仅换一次酒店"],
      risks: ["国庆票价与2间房需尽快锁定", "普吉道路拥堵需给接送留足缓冲", "浮潜必须允许分组且可无损取消"],
      days: [
        { day: 1, date: "10.04", title: "国航直飞曼谷 · 轻量落地", route: "北京首都 PEK → 曼谷 BKK", summary: "去程锁定国航直飞方向；首选当前计划中的CA555白天班，抵达后只入住和吃饭。", activities: [
          { time: "09:15—13:35", type: "国航", title: "CA555 北京直飞曼谷", note: "国航官网已核：PEK T3起飞、BKK落地，A330-300；经济舱未税¥460起，建议优先核对2件托运行李档。" },
          { time: "抵达后", type: "接送", title: "机场 → 拉差贴威 / 暹罗", note: "预订固定价接机或正规平台车型，4人＋行李确认可装下。" },
          { time: "就近", type: "美食", title: "酒店附近欢迎晚餐", note: "不跨城、不排夜市；若晚到可直接叫餐，为第二天保留体力。" },
        ] },
        { day: 2, date: "10.05", title: "王城精选 · 河岸慢行", route: "大皇宫 → 卧佛寺 → 河岸", summary: "只选两个相邻的人文核心点，午后进入室内休息，全天控制在约6000—8000步。", activities: [
          { time: "09:30", type: "文化", title: "大皇宫", note: "提前核实开放与着装要求；上午完成主景点，不叠加三座寺庙。" },
          { time: "11:30", type: "文化", title: "卧佛寺＋附近午餐", note: "与大皇宫相邻，减少车辆换乘；若体力不足可只保留大皇宫。" },
          { time: "15:00后", type: "休闲", title: "河岸商场 / 酒店休息＋晚餐", note: "短程摆渡船完全可选，妈妈可直接乘车到达，不把坐船设为必选。" },
        ] },
        { day: 3, date: "10.06", title: "暹罗 · SPA · 唐人街", route: "暹罗商圈 → 按摩 → 耀华力路", summary: "购物、美食和SPA集中在一条顺路动线上；购物费用单独记账。", activities: [
          { time: "10:30", type: "城市", title: "暹罗商圈＋午餐", note: "可选吉姆·汤普森故居或商场二选一；不为购物拆散整天。" },
          { time: "15:00", type: "SPA", title: "全家按摩 / SPA", note: "全员5分项目，选择正规门店并提前预约4人同一时段。" },
          { time: "18:30", type: "美食", title: "耀华力路晚餐", note: "以坐下吃饭为主、街头小吃为辅；逛累即可叫车返回。" },
        ] },
        { day: 4, date: "10.07", title: "泰航转场普吉 · 海边入住", route: "曼谷 BKK → 普吉 HKT → 卡伦", summary: "采用10:50起飞的泰航直飞作为当前首选，午后入住，不浪费完整度假日。", activities: [
          { time: "07:15", type: "接送", title: "酒店 → BKK机场", note: "预订Grab Van / SUV，目标08:30前到达BKK国内出发层；确认航站楼与行李空间。" },
          { time: "10:50—12:20", type: "泰航", title: "BKK直飞HKT", note: "9月9日公开含税参考价¥486/人、4人¥1,944；付款前确认托运行李与退改条款。" },
          { time: "13:20左右", type: "接机", title: "HKT → 卡伦酒店", note: "按4人＋托运行李选Van / SUV，预留约75—100分钟道路时间。" },
        ] },
        { day: 5, date: "10.08", title: "海滩恢复 · 全家SPA", route: "酒店 → 卡伦 / 卡塔海滩", summary: "先兑现全员喜欢的海边和SPA，不在抵达普吉后的第一整天跨岛赶路。", activities: [
          { time: "10:00", type: "海滩", title: "西海岸慢上午", note: "根据红旗和降雨决定下水；海况不佳就改为泳池、咖啡和酒店休闲。" },
          { time: "15:00", type: "SPA", title: "第二次按摩 / SPA", note: "与曼谷SPA形成一次放松主线；预算紧时改为正规按摩店。" },
          { time: "傍晚", type: "美食", title: "卡伦 / 卡塔就近晚餐", note: "步行或短程叫车，保留体力，不去芭东夜生活核心。" },
        ] },
        { day: 6, date: "10.09", title: "天气窗口 · A/B分组", route: "海况决定 · 出海组 / 本岛组", summary: "这一天是加分项，不是路线成败点；前一晚依据官方预警、海滩旗帜和运营方通知决定。", activities: [
          { time: "仅海况良好", type: "A组", title: "2—3人短程出海 / 简单浮潜", note: "不选长距离快艇硬核路线；产品必须可因天气改期或退款，并含保险与救生装备。" },
          { time: "同步", type: "B组", title: "妈妈：酒店 / 海滩 / 咖啡 / SPA", note: "不要求坐船，活动范围留在酒店附近；独立交通和会合地点提前约定。" },
          { time: "18:30", type: "会合", title: "全家晚餐", note: "当天不再增加景点；若取消出海，全家直接执行酒店＋本岛轻松版。" },
        ] },
        { day: 7, date: "10.10", title: "普吉老城 · 天气缓冲", route: "卡伦 / 卡塔 → 普吉老城 → 酒店", summary: "把老城留到最后作为雨天也能成立的本岛内容，并为前几天调整留出补位。", activities: [
          { time: "10:30", type: "弹性", title: "酒店上午 / 补做海滩", note: "不早起；若前一天取消出海，也不强行补订不安全的船。" },
          { time: "14:30", type: "包车", title: "普吉老城半日", note: "看街区建筑、咖啡馆和小店；当天是周六，不把周日步行街写入计划。" },
          { time: "19:00前", type: "整理", title: "返程核对＋收官晚餐", note: "核对航班、接机、行李额和证件；购物独立记账，晚上不过度延长。" },
        ] },
        { day: 8, date: "10.11", title: "返程分流 · 1人上海 / 3人北京", route: "卡伦 → HKT → 上海 PVG / 北京 PEK", summary: "1人乘10月11日凌晨直飞上海，06:30落地；3人乘国航CA822，10月12日凌晨落地北京。", activities: [
          { time: "10.10 · 19:45", type: "上海 · 1人送机", title: "卡伦酒店 → HKT", note: "对应次日00:05航班；单人＋行李可选正规平台普通轿车，预约日期必须填10月10日。" },
          { time: "00:05—06:30", type: "上海航空 · 1人", title: "HKT直飞PVG", note: "9月9日公开含税参考价¥2,181，明确满足10月11日当天抵沪；付款页再次确认落地日期。" },
          { time: "15:00 / 19:25—02:25+1", type: "北京 · 3人国航", title: "送机＋CA822直飞北京", note: "3人15:00从卡伦出发；优先SUV / Van装下行李，10月12日02:25到PEK T3。" },
        ] },
      ],
    },
    {
      id: "bali",
      label: "候选 B",
      eyebrow: "BALI · CULTURE + RESORT",
      title: "乌布 × 努沙杜瓦",
      subtitle: "乌布承载自然、人文与SPA，努沙杜瓦提供安静海滩和高质量酒店休闲。",
      accent: "#2f8f83",
      weather: "10月通常仍在旱季尾声，路线不依赖离岛快艇",
      route: ["北京", "乌布", "努沙杜瓦", "上海"],
      strengths: ["自然、人文、海边结构均衡", "4人包车便利", "酒店度假价值突出"],
      risks: ["直飞与到达时间待核", "乌布道路拥堵", "住宿升级可能挤压预算"],
      days: [
        { day: 1, date: "10.04", title: "抵达巴厘岛 · 前往乌布", route: "北京 → DPS → 乌布", summary: "航班落地后直接前往乌布，只安排入住与休息。", activities: [
          { time: "航班待核", type: "交通", title: "北京出发", note: "必须核实实际可售航班、行李与抵达时间。" },
          { time: "抵达后", type: "包车", title: "DPS机场接机", note: "4人优先Van或合适车型，避免临时议价。" },
          { time: "晚上", type: "住宿", title: "乌布入住", note: "优先安静、车辆可达，避免只看景观忽略交通。" },
        ] },
        { day: 2, date: "10.05", title: "乌布慢生活 · 市场 · SPA", route: "乌布中心", summary: "第一整天保持轻松，适应气候和节奏。", activities: [
          { time: "10:00", type: "文化", title: "乌布中心与市场", note: "步行区控制暴晒，购物不占整天。" },
          { time: "下午", type: "SPA", title: "全家SPA", note: "优先接送方便、环境安静的正规门店。" },
          { time: "晚上", type: "美食", title: "当地特色晚餐", note: "需补确认全家对印尼餐饮的兴趣和忌口。" },
        ] },
        { day: 3, date: "10.06", title: "寺庙 · 稻田 · 山林", route: "乌布北部包车", summary: "一天只抓两个核心点，车辆负责连接。", activities: [
          { time: "09:30", type: "包车", title: "乌布北部出发", note: "避免过早，路线按实时交通优化。" },
          { time: "上午", type: "自然", title: "梯田或短程自然步道", note: "选择短线、少台阶、可随时折返。" },
          { time: "下午", type: "文化", title: "代表性寺庙", note: "精选一处，不堆叠相似寺庙。" },
        ] },
        { day: 4, date: "10.07", title: "乌布弹性自然日", route: "瀑布 / 村落 / 酒店", summary: "根据前一日体力和天气决定，不预设高强度项目。", activities: [
          { time: "10:00", type: "弹性", title: "自然或村落半日", note: "瀑布需先核实台阶，不安排高难度徒步。" },
          { time: "下午", type: "休闲", title: "酒店、泳池或咖啡馆", note: "保留完整休息段。" },
          { time: "晚上", type: "体验", title: "可选文化表演", note: "根据全家兴趣与返程时间决定。" },
        ] },
        { day: 5, date: "10.08", title: "转场努沙杜瓦", route: "乌布 → 努沙杜瓦", summary: "只换一次酒店；转场日不叠加重景点。", activities: [
          { time: "上午", type: "住宿", title: "从容退房", note: "不安排早起打卡。" },
          { time: "中午", type: "包车", title: "门到门转场", note: "考虑巴厘岛堵车，按实际路况预留时间。" },
          { time: "下午", type: "海滩", title: "海边酒店入住与休息", note: "升级住宿要购买真实可用的海滩、泳池和景观。" },
        ] },
        { day: 6, date: "10.09", title: "努沙杜瓦 · 纯度假日", route: "酒店与海滩", summary: "把酒店当成正式行程，不安排为了打卡而远距离往返。", activities: [
          { time: "上午", type: "海滩", title: "海滩与泳池", note: "全家自由安排，不设集合压力。" },
          { time: "下午", type: "休闲", title: "下午茶 / SPA", note: "可按兴趣分组。" },
          { time: "晚上", type: "美食", title: "海边晚餐", note: "控制返程距离。" },
        ] },
        { day: 7, date: "10.10", title: "南部文化或酒店收尾", route: "努沙杜瓦 → 乌鲁瓦图（可选）", summary: "离岛不是必选；南部陆地路线即可完成文化与海景。", activities: [
          { time: "10:30", type: "弹性", title: "酒店上午或南部包车", note: "按天气与体力决定。" },
          { time: "傍晚", type: "文化", title: "乌鲁瓦图 / Kecak（可选）", note: "注意台阶、猴群和晚间返程。" },
          { time: "晚上", type: "整理", title: "行李与返程核对", note: "购物独立记账，确认送机时间。" },
        ] },
        { day: 8, date: "10.11", title: "返程上海 · 当天必须抵达", route: "DPS → 上海", summary: "航班是否能在10月11日当天抵沪，是巴厘岛方案的第一道筛选。", activities: [
          { time: "按航班", type: "交通", title: "努沙杜瓦送机", note: "考虑机场安检与道路缓冲。" },
          { time: "硬约束", type: "飞行", title: "10月11日当天抵沪", note: "如无可靠组合，巴厘岛候选自动降级。" },
        ] },
      ],
    },
  ],
  checklist: [
    { id: "international", phase: "第一优先", title: "锁定去程国航CA555", note: "10月4日PEK→BKK，09:15—13:35；官网未税¥460起，2件托运行李档¥690，按4成人登录后确认含税总价与库存。" },
    { id: "returns", phase: "同时确认", title: "锁定1人上海＋3人北京返程", note: "上海1人选择00:05—06:30直飞（含税¥2,181参考）；北京3人核对国航CA822的同舱库存，10月12日02:25到PEK。" },
    { id: "domestic", phase: "同期", title: "锁定10月7日泰航BKK→HKT", note: "当前首选10:50—12:20，公开含税参考¥486/人；付款前确认托运行李和退改。" },
    { id: "rooms", phase: "订票后24小时", title: "预订曼谷3晚＋普吉4晚的2间房", note: "主选Asia Hotel Bangkok＋Baan Karonburi Resort，当前含税合计¥5,036；优先免费取消，付款前复核床型、早餐与税费。" },
    { id: "transfer", phase: "出发前2周", title: "建立5张接送订单", note: "两段机场接机、一段曼谷送机、上海组和北京组各一段普吉送机；4人同行段选择Van / SUV。" },
    { id: "tdac", phase: "抵泰前3天内", title: "为4人提交泰国TDAC", note: "只使用泰国移民局官方免费入口，并保存确认邮件或二维码。" },
    { id: "spa", phase: "出发前1周", title: "预约两次SPA / 按摩", note: "确认4人同一时段、正规门店、取消条款和接送范围。" },
    { id: "weather", phase: "出海前24小时", title: "决定是否执行A/B分组", note: "核对官方预警、海滩旗帜和运营方通知；任何一项不安全就执行本岛版。" },
    { id: "final", phase: "返程前一天", title: "完成10月11日返程复核", note: "确认落地日期、送机时间、行李、保险、证件、SIM与支付。" },
  ],
};

const STORAGE_KEY = "national-day-family-trip-v5";
const CHECK_KEY = "national-day-family-trip-checks-v1";

export default function Home() {
  const [data, setData] = useState<SiteData>(initialData);
  const [candidateId, setCandidateId] = useState<Candidate["id"]>("phuket");
  const [dayIndex, setDayIndex] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [editorError, setEditorError] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        const savedChecks = window.localStorage.getItem(CHECK_KEY);
        if (saved) setData(JSON.parse(saved));
        if (savedChecks) setChecks(JSON.parse(savedChecks));
      } catch {
        // Ignore invalid local data and keep the public default.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const candidate = useMemo<Candidate>(
    () => data.candidates.find((item) => item.id === candidateId) ?? data.candidates[0] ?? initialData.candidates[0]!,
    [candidateId, data],
  );
  const day = candidate.days[dayIndex] ?? candidate.days[0]!;
  const completed = Object.values(checks).filter(Boolean).length;

  function chooseCandidate(id: Candidate["id"]) {
    setCandidateId(id);
    setDayIndex(0);
    document.getElementById("itinerary")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleCheck(id: string) {
    const next = { ...checks, [id]: !checks[id] };
    setChecks(next);
    window.localStorage.setItem(CHECK_KEY, JSON.stringify(next));
  }

  function openEditor() {
    setEditorValue(JSON.stringify(data, null, 2));
    setEditorError("");
    setEditorOpen(true);
  }

  function saveEditor() {
    try {
      const parsed = JSON.parse(editorValue) as SiteData;
      if (!Array.isArray(parsed.candidates) || !Array.isArray(parsed.checklist)) {
        throw new Error("数据必须包含 candidates 和 checklist。");
      }
      setData(parsed);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      setEditorOpen(false);
      setDayIndex(0);
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : "JSON格式不正确。");
    }
  }

  function resetLocalData() {
    window.localStorage.removeItem(STORAGE_KEY);
    setData(initialData);
    setEditorValue(JSON.stringify(initialData, null, 2));
    setEditorError("");
    setDayIndex(0);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `国庆家庭旅行_${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as SiteData;
        if (!Array.isArray(parsed.candidates) || !Array.isArray(parsed.checklist)) throw new Error();
        setData(parsed);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        setDayIndex(0);
      } catch {
        setEditorError("导入失败：文件不是有效的旅行数据。");
        setEditorOpen(true);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="回到首页">
          <span className="brand-mark">十一</span>
          <span><b>向海而行</b><small>2026 家庭旅行决策册</small></span>
        </a>
        <nav aria-label="页面导航">
          <a href="#compare">候选对比</a>
          <a href="#itinerary">逐日行程</a>
          <a href="#booking">核价与预订</a>
          <a href="#budget">预算</a>
          <a href="#checklist">清单</a>
        </nav>
        <div className="top-actions">
          <button className="ghost-button" onClick={exportData}>导出</button>
          <button className="solid-button" onClick={openEditor}>编辑本机数据</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-copy">
          <p className="kicker">OCT 04 — OCT 11 · 8 DAYS / 7 NIGHTS</p>
          <h1>一家四口，<br /><em>在两片海之间做选择。</em></h1>
          <p className="hero-lead">曼谷＋普吉已推进到可下单版本：航班、2间房含税价、五段接送与返程分流都已落到具体选择。</p>
          <div className="hero-buttons">
            <a className="primary-cta" href="#compare">开始比较 <span>↘</span></a>
            <a className="text-cta" href="#profile">查看家庭画像</a>
          </div>
        </div>
        <div className="hero-board" aria-label="已确认旅行约束">
          <div className="board-stamp">已确认</div>
          <div className="board-row"><span>出发</span><strong>10.04 · 北京</strong></div>
          <div className="board-row"><span>返程</span><strong>1人当天抵沪 · 3人国航回北京</strong></div>
          <div className="board-row"><span>人数</span><strong>4人同行 · 2间房</strong></div>
          <div className="board-row"><span>主体预算</span><strong>约 ¥20,000</strong></div>
          <div className="board-note">不含国际机票与购物 / 代购</div>
        </div>
        <div className="hero-route" aria-hidden="true">
          <span>PEK</span><i /><span>曼谷 · 普吉</span><i /><span>PVG / PEK</span>
        </div>
      </section>

      <section className="profile section-shell" id="profile">
        <div className="section-heading compact-heading">
          <div><p className="section-index">01 · FAMILY SIGNALS</p><h2>问卷不是投票，<br />是行程的护栏。</h2></div>
          <p>全员共同喜欢海岛、美食与SPA；差异最大的浮潜、坐船和早起，则用分组与备选保护。</p>
        </div>
        <div className="score-grid">
          {[
            ["5.00", "海岛 · 沙滩 · 海景", "4人全部满分"],
            ["5.00", "当地美食", "每天都应有亮点"],
            ["5.00", "按摩 · SPA", "至少安排1—2次"],
            ["4.75", "夜市与酒店休闲", "稳定公共体验"],
          ].map(([score, label, note]) => (
            <article className="score-card" key={label}>
              <strong>{score}</strong><h3>{label}</h3><p>{note}</p>
            </article>
          ))}
        </div>
        <div className="people-strip">
          <article><span>妈妈</span><b>海岛 · 人文 · 舒服不赶</b><small>不浮潜，对坐船较担心；5000—8000步更舒适</small></article>
          <article><span>姐夫</span><b>浮潜 · 玩水 · 全家舒服</b><small>喜欢坐船，但讨厌搬行李</small></article>
          <article><span>我</span><b>海岛 · 美食 · 特色体验</b><small>偏轻松，可尝试简单浮潜</small></article>
          <article><span>姐姐</span><b>人文 · 美食 · 特色体验</b><small>最好9点后出发，愿为好体验加预算</small></article>
        </div>
      </section>

      <section className="comparison" id="compare">
        <div className="section-shell">
          <div className="section-heading light-heading">
            <div><p className="section-index">02 · TWO EQUAL CANDIDATES</p><h2>两条路线，<br />同一把尺子。</h2></div>
            <p>1人必须在10月11日当天抵沪；另外3人由普吉乘国航直飞北京。再比较航班、住宿、天气与不出海时的完整度。</p>
          </div>
          <div className="candidate-grid">
            {data.candidates.map((item, index) => (
              <article className={`candidate-card candidate-${item.id}`} key={item.id} style={{ "--accent": item.accent } as CSSProperties}>
                <div className="candidate-number">0{index + 1}</div>
                <p className="candidate-eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p className="candidate-subtitle">{item.subtitle}</p>
                <div className="mini-route">
                  {item.route.map((stop, stopIndex) => <span key={stop}>{stop}{stopIndex < item.route.length - 1 && <i>→</i>}</span>)}
                </div>
                <div className="candidate-columns">
                  <div><h4>为什么成立</h4>{item.strengths.map(text => <p key={text}>＋ {text}</p>)}</div>
                  <div><h4>需要验证</h4>{item.risks.map(text => <p key={text}>— {text}</p>)}</div>
                </div>
                <div className="weather-note"><span>季节判断</span>{item.weather}</div>
                <button onClick={() => chooseCandidate(item.id)}>查看这条逐日路线 <span>↘</span></button>
              </article>
            ))}
          </div>
          <div className="decision-rule">
            <b>返程规则：</b> 1人必须在 <strong>10月11日当天抵达上海</strong>；其余3人乘国航直飞，并接受10月12日凌晨到京。
          </div>
        </div>
      </section>

      <section className="itinerary section-shell" id="itinerary">
        <div className="section-heading compact-heading">
          <div><p className="section-index">03 · DAY BY DAY</p><h2>{candidate.title}<br />8天草案</h2></div>
          <p>这是可编辑的规划骨架，不把尚未核实的航班、价格和政策写成事实。</p>
        </div>
        <div className="route-selector" role="tablist" aria-label="选择候选路线">
          {data.candidates.map(item => (
            <button role="tab" aria-selected={candidateId === item.id} className={candidateId === item.id ? "active" : ""} key={item.id} onClick={() => { setCandidateId(item.id); setDayIndex(0); }}>
              <span style={{ background: item.accent }} />{item.title}
            </button>
          ))}
        </div>
        <div className="day-tabs" role="tablist" aria-label="选择日期">
          {candidate.days.map((item, index) => (
            <button role="tab" aria-selected={dayIndex === index} className={dayIndex === index ? "active" : ""} key={`${candidate.id}-${item.day}`} onClick={() => setDayIndex(index)}>
              <b>D{item.day}</b><span>{item.date}</span>
            </button>
          ))}
        </div>
        <div className="day-layout" style={{ "--accent": candidate.accent } as CSSProperties}>
          <div className="day-copy">
            <p className="day-label">DAY {day.day} · {day.date}</p>
            <h3>{day.title}</h3>
            <p className="day-route">⌁ {day.route}</p>
            <p className="day-summary">{day.summary}</p>
            <div className="timeline-list">
              {day.activities.map((activity, index) => (
                <article className="timeline-item" key={`${activity.time}-${activity.title}`}>
                  <div className="timeline-time">{activity.time}</div>
                  <div className="timeline-pin"><span>{index + 1}</span></div>
                  <div className="timeline-card"><small>{activity.type}</small><h4>{activity.title}</h4><p>{activity.note}</p></div>
                </article>
              ))}
            </div>
          </div>
          <div className={`route-map map-${candidate.id}`}>
            <div className="map-caption"><span>ROUTE BOARD</span><b>{day.route}</b></div>
            <div className="map-contours contour-a" /><div className="map-contours contour-b" />
            <div className="map-line line-a" /><div className="map-line line-b" />
            {day.activities.map((activity, index) => (
              <div className={`map-node node-${index + 1}`} key={activity.title}>
                <span>{index + 1}</span><b>{activity.title}</b>
              </div>
            ))}
            <p>示意图 · 实际经纬度与路网将在目的地确认后补充</p>
          </div>
        </div>
      </section>

      <section className="booking" id="booking">
        <div className="section-shell">
          <div className="section-heading light-heading">
            <div><p className="section-index">04 · LIVE BOOKING BOARD</p><h2>价格有时效，<br />决策有红线。</h2></div>
            <p>以下为2026年9月9日查询的4成人、2间房公开价格快照。机票按每人展示，酒店为全部入住人的含税总价；动态价格以付款页为准。</p>
          </div>

          <div className="price-summary">
            <div><span>已核主体价格</span><strong>¥6,980</strong><small>泰国境内机票4人＋主选酒店7晚</small></div>
            <div><span>主选酒店</span><strong>¥5,036</strong><small>2间房 · 曼谷3晚＋普吉4晚</small></div>
            <div><span>国际票已知价格基数</span><strong>¥11,421</strong><small>推荐行李档 · 另加国航税费</small></div>
          </div>

          <div className="booking-block">
            <div className="booking-title"><span>01</span><div><h3>航班锁定表</h3><p>先锁国际段，再订两间可免费取消的房。</p></div></div>
            <div className="flight-grid">
              <article className="booking-card recommended">
                <div className="status-row"><span className="status-pill">国航首选</span><small>10月4日</small></div>
                <h4>CA555 · PEK → BKK</h4><strong className="card-time">09:15—13:35</strong>
                <p><b>官网未税¥460/人起</b>；¥690档含2件托运行李、退改¥0起。登录前无法确认4张库存与含税总价，建议先核¥690档。</p>
                <a href="https://www.airchina.com.cn/" target="_blank" rel="noreferrer">去国航复核价格 ↗</a>
              </article>
              <article className="booking-card">
                <div className="status-row"><span className="status-pill live">当前可售</span><small>10月7日</small></div>
                <h4>泰国航空 · BKK → HKT</h4><strong className="card-time">10:50—12:20</strong>
                <p><b>¥486/人 · 4人¥1,944</b>。时间比廉航早班更适合全家，付款前确认托运行李、选座与退改是否计入。</p>
                <a href="https://www.google.com/travel/flights" target="_blank" rel="noreferrer">重新比较同日航班 ↗</a>
              </article>
              <article className="booking-card recommended">
                <div className="status-row"><span className="status-pill live">上海组刚性选择</span><small>10月11日</small></div>
                <h4>上海航空 · HKT → PVG</h4><strong className="card-time">00:05—06:30</strong>
                <p><b>1人 · 含税参考¥2,181</b>。目前找到的直飞中，明确满足10月11日当天抵沪；送机需预订在10月10日晚。</p>
                <a href="https://www.google.com/travel/flights" target="_blank" rel="noreferrer">付款前复核到达日期 ↗</a>
              </article>
              <article className="booking-card">
                <div className="status-row"><span className="status-pill">国航首选</span><small>10月11日</small></div>
                <h4>CA822 · HKT → PEK</h4><strong className="card-time">19:25—02:25+1</strong>
                <p><b>3人 · 官网未税¥2,010/人起</b>；推荐¥2,160档，3人未税¥6,480，含2件托运行李、退改¥0起。登录后确认3张同舱库存。</p>
                <a href="https://www.airchina.com.cn/" target="_blank" rel="noreferrer">去国航复核价格 ↗</a>
              </article>
            </div>
            <div className="formula-note"><b>按推荐行李档的已知价格基数：</b> CA555 ¥690 × 4人 ＋ 上海航空 ¥2,181 × 1人 ＋ CA822 ¥2,160 × 3人 ＝ <b>¥11,421＋两段国航税费</b>。输入4人去程、3人返程并登录后，才能得到最终含税总价。</div>
          </div>

          <div className="booking-block">
            <div className="booking-title"><span>02</span><div><h3>酒店二选一</h3><p>优先床型、位置与可取消，不被“看起来便宜”带偏。</p></div></div>
            <div className="hotel-grid">
              <article className="hotel-card picked"><div className="hotel-top"><span>曼谷首选</span><small>10.04—10.07 · 3晚</small></div><h4>Asia Hotel Bangkok</h4><p>近轨道交通 · 2间行政双床/双人房 · 可免费取消</p><strong>¥2,570 <small>含税总价</small></strong><em>约¥428 / 间夜</em></article>
              <article className="hotel-card"><div className="hotel-top"><span>曼谷备选</span><small>10.04—10.07 · 3晚</small></div><h4>Maitria Hotel Rama 9</h4><p>2间花园景高级双床房 · 免费取消 · 到店付款</p><strong>¥2,616 <small>含税总价</small></strong><em>位置离中心较远</em></article>
              <article className="hotel-card"><div className="hotel-top"><span>普吉预算备选</span><small>10.07—10.11 · 4晚</small></div><h4>The Front Village</h4><p>卡伦 · 距海滩约250米 · 2间海景房 · 可免费取消</p><strong>¥1,465 <small>含税总价</small></strong><em>仅在床型、税费与取消条款全部复核无误后考虑</em></article>
              <article className="hotel-card picked"><div className="hotel-top"><span>普吉最终主选</span><small>10.07—10.11 · 4晚</small></div><h4>Baan Karonburi Resort</h4><p>距海滩约50米 · 2间豪华房 · 含早餐</p><strong>¥2,466 <small>含税总价</small></strong><em>早餐06:30—10:30 · 多¥1,001换取更稳妥的家庭体验</em></article>
            </div>
            <div className="hotel-actions"><a href="https://www.booking.com/" target="_blank" rel="noreferrer">在Booking按4成人、2间房复核 ↗</a><p>主选组合¥5,036；若改用预算备选可省¥1,001。下单前截图保存：房型、早餐、税费、取消截止时间和付款币种。</p></div>
          </div>

          <div className="booking-block transfer-block">
            <div className="booking-title"><span>03</span><div><h3>五段接送预约卡</h3><p>同行段选Van / SUV；返程分流后分别建立订单。</p></div></div>
            <div className="transfer-timeline">
              {[
                ["10.04 · 15:00后", "BKK → Asia Hotel", "4人同行 · Van / SUV", "落地后按航班动态调整；BKK Grab上车点为1层4号出口附近。"],
                ["10.07 · 07:15", "Asia Hotel → BKK", "4人同行 · Van / SUV", "10:50国内航班；备注4件托运行李，目标08:30前进航站楼。"],
                ["10.07 · 13:20", "HKT → 卡伦酒店", "4人同行 · Van / SUV", "按12:20落地＋60分钟取行李设置；道路预留75—100分钟。"],
                ["10.10 · 19:45", "卡伦酒店 → HKT", "上海1人 · 普通轿车", "对应10月11日00:05航班；1人＋行李，预约日期必须填10月10日。"],
                ["10.11 · 15:00", "卡伦酒店 → HKT", "北京3人 · SUV / Van", "对应CA822 19:25起飞；备注3件托运行李，雨天不向后压缩。"],
              ].map(([time, route, car, note], index) => (
                <article key={route + time}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{time}</small><h4>{route}</h4><b>{car}</b><p>{note}</p></div></article>
              ))}
            </div>
            <div className="transfer-guide">
              <div><h4>推荐操作</h4><ol><li>在Grab“出行”中选择提前预约；普吉接机可选“预约机场接机”。</li><li>填写真实航班号、酒店英文名、乘客数与行李数；4人同行不要选普通轿车。</li><li>确认固定价、等候时间、上车点与取消规则；保存订单截图和司机聊天。</li><li>上车核对车牌与司机，付款只走平台；不要向陌生个人二维码预付。</li></ol></div>
              <div className="transfer-budget"><span>五段接送控制价</span><strong>THB 4,400—6,200</strong><small>约¥970—1,370 · 这是预算区间，不是实时叫车价</small><a href="https://www.grab.com/th/en/transport/advance-booking/" target="_blank" rel="noreferrer">查看Grab提前预约说明 ↗</a></div>
            </div>
          </div>

          <div className="booking-block execution-block">
            <div className="booking-title"><span>04</span><div><h3>出发执行手册</h3><p>把容易忘的节点写成当天可以直接照做的动作。</p></div></div>
            <div className="execution-grid">
              <article><small>出票当天</small><h4>按4人去、1＋3人返核价</h4><p>CA555查询4人同舱并优先看¥690档；CA822查询3人同舱并优先看¥2,160档。上海航空单独为1人出票，保存三段票价、行李和退改截图。</p><a href="https://www.airchina.com.cn/" target="_blank" rel="noreferrer">打开国航官网 ↗</a></article>
              <article><small>酒店下单</small><h4>主选两家一次核完</h4><p>曼谷选Asia Hotel，普吉选Baan Karonburi；确认2间房的床型、早餐、税费、取消期限，并把英文酒店名和地址发进家庭群。</p><div className="mini-links"><a href="https://www.asiahotel.co.th/asia_bangkok/contact/" target="_blank" rel="noreferrer">曼谷酒店资料 ↗</a><a href="https://www.karonburi.com/facilities" target="_blank" rel="noreferrer">普吉酒店资料 ↗</a></div></article>
              <article><small>10月6日 · 15:00</small><h4>曼谷SPA先预约4人</h4><p>Let&apos;s Relax Siam Square One交通最顺，营业至23:00；按已公开项目，肩颈60分钟THB750、香薰60分钟THB1,300，可按预算分项目。</p><a href="https://letsrelaxspa.com/branches/bangkok-siam-square-1/" target="_blank" rel="noreferrer">查看门店与预约 ↗</a></article>
              <article><small>10月8日 · 15:00</small><h4>普吉SPA保留可取消</h4><p>若选Oasis Spa，至少提前2小时预约并提前15分钟到店；天气不佳时可把海滩时段与SPA对调。</p><a href="https://oasisspa.net/en/FAQs/" target="_blank" rel="noreferrer">查看预约说明 ↗</a></article>
            </div>
            <div className="ops-timeline">
              {[
                ["现在", "锁定三段国际机票", "返程已确认1人上海、3人北京；分别核1张与3张返程库存，去程核4张同舱。"],
                ["出票后24小时", "下单两家主选酒店", "选择可取消方案，把订单号、英文地址和取消截止日记入家庭群。"],
                ["9月27—30日", "预约接送与SPA", "建立5张车单，备注4人及行李数；返程两组分别下单。"],
                ["10月1日起", "提交4人TDAC", "抵泰前3天内用官方免费入口填写，并保存4份确认信息。"],
                ["10月3日", "值机与行李终检", "检查护照、保险、eSIM、药品；充电宝随身携带、每人最多2块，机上禁用。"],
                ["10月8日晚", "决定10月9日A/B方案", "看官方预警、海滩红旗和运营方通知；不安全就全员执行本岛雨天版。"],
              ].map(([date, title, note]) => <article key={date}><time>{date}</time><div><h4>{title}</h4><p>{note}</p></div></article>)}
            </div>
            <div className="rain-plan"><b>雨天替换原则：</b>10月8日海况差就改酒店泳池/咖啡＋SPA；10月9日取消出海则改普吉老城＋Central Phuket，10月10日留作海滩或休息补位。任何红旗、雷暴或运营方停航都不硬上船。</div>
          </div>

          <div className="booking-warning"><b>下单顺序：</b>先同时打开CA555、上海组直飞和CA822付款页，确认三段都能接受后再支付；随后24小时内下单两家可取消酒店，最后建立接送提醒。任何页面若出现日期、机场或行李不一致，先停在付款前。</div>
        </div>
      </section>

      <section className="budget" id="budget">
        <div className="section-shell">
          <div className="section-heading light-heading">
            <div><p className="section-index">05 · MONEY RULES</p><h2>先分账，<br />再谈性价比。</h2></div>
            <p>¥20,000是4人旅行主体目标，不含中国往返目的地的国际机票，也不含购物和代购。</p>
          </div>
          <div className="budget-layout">
            <article className="budget-main">
              <div className="budget-total"><span>旅行主体目标</span><strong>¥20,000</strong><small>约 ¥5,000 / 人</small></div>
              <div className="allocation">
                {[
                  ["住宿 · 2间房", "35%", "¥7,000"],
                  ["曼谷→普吉境内机票", "12.5%", "¥2,500"],
                  ["接送、Grab与包车", "15%", "¥3,000"],
                  ["餐饮", "22.5%", "¥4,500"],
                  ["活动与SPA", "10%", "¥2,000"],
                  ["应急缓冲", "5%", "¥1,000"],
                ].map(([name, pct, amount]) => <div key={name}><span>{name}</span><i style={{ width: pct }} /><b>{amount}</b></div>)}
              </div>
              <p>以上是规划分配，不是实时价格；核价后允许在类别间调整，但总额需要解释。</p>
            </article>
            <article className="budget-separate">
              <p className="section-index">SEPARATE LEDGER</p>
              <h3>购物与代购<br />完全独立</h3>
              <p>零食、美妆、香薰、免税商品和亲友代购单独记录，不挤占住宿、餐饮与交通。</p>
              <ul><li>个人购物</li><li>亲友代购</li><li>回程行李增量</li><li>退税与海关</li></ul>
            </article>
          </div>
        </div>
      </section>

      <section className="checklist section-shell" id="checklist">
        <div className="section-heading compact-heading">
          <div><p className="section-index">06 · BOOKING TIMELINE</p><h2>从现在到出发，<br />一件件锁定。</h2></div>
          <p>勾选状态只保存在这台设备。当前完成 {completed}/{data.checklist.length} 项。</p>
        </div>
        <div className="progress-track"><span style={{ width: `${(completed / data.checklist.length) * 100}%` }} /></div>
        <div className="check-list">
          {data.checklist.map((item, index) => (
            <label className={checks[item.id] ? "checked" : ""} key={item.id}>
              <input type="checkbox" checked={Boolean(checks[item.id])} onChange={() => toggleCheck(item.id)} />
              <span className="check-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="check-phase">{item.phase}</span>
              <span className="check-copy"><b>{item.title}</b><small>{item.note}</small></span>
              <span className="check-mark">✓</span>
            </label>
          ))}
        </div>
      </section>

      <footer>
        <div><b>向海而行 · 2026</b><p>事实与建议分开，未知保持未知，所有动态信息在预订前重新核实。</p></div>
        <div className="privacy-note"><span>公开版规则</span>不记录证件号、完整订单号、支付凭证、联系方式或账号密码。</div>
      </footer>

      <input ref={importRef} type="file" accept="application/json" hidden onChange={importData} />
      {editorOpen && (
        <div className="editor-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false); }}>
          <section className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="editor-title">
            <div className="editor-head"><div><p className="section-index">LOCAL EDITOR</p><h2 id="editor-title">编辑旅行数据</h2></div><button aria-label="关闭编辑器" onClick={() => setEditorOpen(false)}>×</button></div>
            <div className="editor-warning">仅保存在当前浏览器；分享网址不会同步你的修改。请勿写入证件、订单号或支付信息。</div>
            <textarea aria-label="旅行JSON数据" value={editorValue} onChange={(event) => setEditorValue(event.target.value)} spellCheck={false} />
            {editorError && <p className="editor-error">{editorError}</p>}
            <div className="editor-actions">
              <button onClick={() => importRef.current?.click()}>导入JSON</button>
              <button onClick={resetLocalData}>恢复公开默认</button>
              <span />
              <button onClick={() => setEditorOpen(false)}>取消</button>
              <button className="save-button" onClick={saveEditor}>保存并应用</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
