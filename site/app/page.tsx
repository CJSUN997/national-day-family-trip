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
      weather: "10月上旬海况有波动，路线不依赖出海",
      route: ["北京", "曼谷", "普吉本岛", "上海"],
      strengths: ["泰国美食与SPA全员5分", "城市和海边兼得", "仅换一次主要住宿地"],
      risks: ["普吉仍处季风尾声", "境内飞行会占用半天", "浮潜必须允许分组"],
      days: [
        { day: 1, date: "10.04", title: "抵达曼谷 · 先休息", route: "北京 → 曼谷", summary: "抵达后只安排入住和附近晚餐，不把第一天排成赶场日。", activities: [
          { time: "航班待核", type: "交通", title: "北京出发", note: "PEK/PKX均可比较；按4人含必要托运行李总价核算。" },
          { time: "抵达后", type: "住宿", title: "曼谷酒店入住", note: "优先安静、位置方便，默认2间房。" },
          { time: "晚上", type: "美食", title: "酒店附近欢迎晚餐", note: "避免跨城奔波，为第二天保留体力。" },
        ] },
        { day: 2, date: "10.05", title: "曼谷人文 · 河岸 · 美食", route: "老城 → 湄南河", summary: "精选代表性文化景点，不做密集寺庙打卡。", activities: [
          { time: "09:30", type: "文化", title: "老城代表景点", note: "在大皇宫、卧佛寺、郑王庙中精选组合，控制台阶和暴晒。" },
          { time: "午后", type: "休闲", title: "午餐与河岸休息", note: "预留室内休息，不连续步行。" },
          { time: "傍晚", type: "体验", title: "湄南河与特色晚餐", note: "游船不是必须，可根据天气与妈妈感受替换。" },
        ] },
        { day: 3, date: "10.06", title: "商圈 · SPA · 夜市", route: "Siam商圈 → 夜市", summary: "把购物、餐饮、按摩放在同一区域，减少无效移动。", activities: [
          { time: "10:30", type: "城市", title: "商圈与午餐", note: "购物不是全家主线，安排一次集中窗口即可。" },
          { time: "下午", type: "SPA", title: "全家按摩 / SPA", note: "全员5分项目，建议提前预约。" },
          { time: "晚上", type: "市场", title: "夜市或当地市场", note: "优先交通方便、餐饮选择丰富的区域。" },
        ] },
        { day: 4, date: "10.07", title: "转场普吉 · 酒店半日", route: "曼谷 → 普吉", summary: "从容退房和转场，抵达后让酒店本身成为行程。", activities: [
          { time: "上午", type: "交通", title: "曼谷境内机场", note: "BKK/DMK需与前后酒店位置一起判断。" },
          { time: "航班待核", type: "飞行", title: "飞往普吉", note: "含行李总价计入旅行主体预算。" },
          { time: "傍晚", type: "住宿", title: "Kata / Karon方向入住", note: "优先安静、海滩与泳池，不住芭东夜生活核心。" },
        ] },
        { day: 5, date: "10.08", title: "普吉本岛 · 海岸与老城", route: "西海岸 → 普吉老城", summary: "即使不坐船，也能完成有内容的本岛日。", activities: [
          { time: "10:00", type: "海滩", title: "西海岸慢上午", note: "沙滩、咖啡和酒店设施自由组合。" },
          { time: "下午", type: "包车", title: "本岛半日包车", note: "4人核算包车总价，减少换乘。" },
          { time: "傍晚", type: "城市", title: "普吉老城与晚餐", note: "避开烈日时段，保留拍照和餐饮。" },
        ] },
        { day: 6, date: "10.09", title: "可选分组日", route: "海况决定 · A/B计划", summary: "让喜欢浮潜的人尽兴，也让妈妈不用被迫坐快艇。", activities: [
          { time: "海况良好", type: "可选", title: "2—3人短程出海 / 简单浮潜", note: "只选可因天气改期或退款、可不上水的正规产品。" },
          { time: "同步", type: "休闲", title: "1—2人酒店 / 海滩 / SPA", note: "与出海集合点保持交通便利。" },
          { time: "晚上", type: "美食", title: "全家会合晚餐", note: "交换当天体验，不安排额外赶场。" },
        ] },
        { day: 7, date: "10.10", title: "天气缓冲 · 海边收尾", route: "普吉本岛", summary: "为前几天因雨调整的内容留出补位，也可以纯休息。", activities: [
          { time: "10:30", type: "弹性", title: "本岛备选 / 酒店休闲", note: "根据天气补做海滩、老城、观景点或SPA。" },
          { time: "下午", type: "整理", title: "行李与购物核对", note: "购物独立记账，检查回程行李额。" },
          { time: "晚上", type: "美食", title: "旅行收官晚餐", note: "不安排太晚，保障返程。" },
        ] },
        { day: 8, date: "10.11", title: "返程上海 · 当天必须抵达", route: "普吉 → 上海", summary: "所有候选航班必须满足10月11日23:59前抵达PVG/SHA。", activities: [
          { time: "按航班", type: "交通", title: "酒店送机", note: "至少预留国际航班所需时间和普吉道路拥堵缓冲。" },
          { time: "硬约束", type: "飞行", title: "10月11日当天抵沪", note: "不接受10月12日凌晨到达的组合。" },
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
    { id: "route", phase: "现在", title: "并行核实两条候选", note: "航班、7晚住宿、当地交通、天气风险按同一口径比较。" },
    { id: "flight", phase: "第一优先", title: "锁定10月11日当天抵沪组合", note: "比较PEK/PKX出发、PVG/SHA到达和4人含行李总价。" },
    { id: "rooms", phase: "订票前", title: "确认2间房与床型", note: "同步比较合适的两卧套房，但不默认选择民宿。" },
    { id: "policy", phase: "目的地确定后", title: "核实入境政策与官方入口", note: "只采用官方来源，并记录查询日期。" },
    { id: "weather", phase: "可退期内", title: "检查季节风险和取消条款", note: "普吉出海必须可改退；巴厘岛关注陆地交通和降雨。" },
    { id: "final", phase: "出发前72小时", title: "完成最终复核", note: "航班、接送、酒店、天气、行李、保险、SIM与支付。" },
  ],
};

const STORAGE_KEY = "national-day-family-trip-v1";
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
          <p className="hero-lead">巴厘岛与曼谷＋普吉本岛并列候选。先用问卷守住每个人的愿望，再用航班、天气和4人总价做最后决定。</p>
          <div className="hero-buttons">
            <a className="primary-cta" href="#compare">开始比较 <span>↘</span></a>
            <a className="text-cta" href="#profile">查看家庭画像</a>
          </div>
        </div>
        <div className="hero-board" aria-label="已确认旅行约束">
          <div className="board-stamp">已确认</div>
          <div className="board-row"><span>出发</span><strong>10.04 · 北京</strong></div>
          <div className="board-row"><span>返程</span><strong>10.11 · 当天抵沪</strong></div>
          <div className="board-row"><span>人数</span><strong>4人 · 默认2间房</strong></div>
          <div className="board-row"><span>主体预算</span><strong>约 ¥20,000</strong></div>
          <div className="board-note">不含国际机票与购物 / 代购</div>
        </div>
        <div className="hero-route" aria-hidden="true">
          <span>PEK / PKX</span><i /><span>海岛</span><i /><span>PVG / SHA</span>
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
            <p>现在不设主备。先看哪条路线能在10月11日当天抵沪，再比较航班、住宿、天气与不出海时的完整度。</p>
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
            <b>一票否决：</b> 任何无法在 <strong>10月11日当天抵达上海</strong> 的航班组合，不进入后续比价。
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

      <section className="budget" id="budget">
        <div className="section-shell">
          <div className="section-heading light-heading">
            <div><p className="section-index">04 · MONEY RULES</p><h2>先分账，<br />再谈性价比。</h2></div>
            <p>¥20,000是4人旅行主体目标，不含中国往返目的地的国际机票，也不含购物和代购。</p>
          </div>
          <div className="budget-layout">
            <article className="budget-main">
              <div className="budget-total"><span>旅行主体目标</span><strong>¥20,000</strong><small>约 ¥5,000 / 人</small></div>
              <div className="allocation">
                {[
                  ["住宿 · 2间房", "35%", "¥7,000"],
                  ["境内与当地交通", "25%", "¥5,000"],
                  ["餐饮", "25%", "¥5,000"],
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
          <div><p className="section-index">05 · BOOKING TIMELINE</p><h2>从现在到出发，<br />一件件锁定。</h2></div>
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
