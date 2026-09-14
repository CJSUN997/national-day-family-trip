"use client";

import { useMemo, useState } from "react";

type Event = { time: string; tag: string; title: string; note: string };
type Day = { date: string; city: string; title: string; lead: string; pace: string; rule?: string; events: Event[] };

const days: Day[] = [
  { date:"10.04 · 周日", city:"普吉", title:"向南飞，先睡个好觉", lead:"已订 CA581。晚间落地不赶行程，把体力留给真正的海岛假期。", pace:"交通日", events:[
    {time:"12:00",tag:"集合",title:"首都机场 T3",note:"4人一起办理值机，逐人确认电子客票号与1×23kg托运行李。"},
    {time:"15:30—20:30",tag:"已预订",title:"CA581 · PEK → HKT",note:"直飞普吉；泰国时间比北京时间慢1小时。"},
    {time:"22:00",tag:"接机",title:"普吉机场 → 卡伦",note:"预订SUV / Van并填写航班号，预计23:15前后抵达酒店。"}]},
  { date:"10.05 · 周一", city:"普吉", title:"海风、慢午餐与 SPA", lead:"第一整天不跨岛，用海滩和休息完成从通勤状态到度假状态的切换。", pace:"很轻松", rule:"红旗或大浪时不下水，直接切换酒店泳池与咖啡馆。", events:[
    {time:"10:00",tag:"海滩",title:"卡伦海滩慢上午",note:"自然起床，海边散步或酒店泳池；不设置集合压力。"},
    {time:"12:30",tag:"美食",title:"卡伦就近午餐",note:"选择有空调、能坐下慢慢吃的餐厅，午后回酒店休息。"},
    {time:"16:00",tag:"全员高分",title:"全家按摩 / SPA",note:"提前预约4人同一时段，可以各自选择不同项目。"},
    {time:"18:30",tag:"日落",title:"卡塔或卡伦晚餐",note:"短程移动，看天气决定是否等日落。"}]},
  { date:"10.06 · 周二", city:"普吉", title:"把选择权交给海况", lead:"出海只是加分项。前一晚再决定，妈妈不坐船也能拥有完整的一天。", pace:"适中", rule:"任何雷暴预警、红旗或运营方停航，都执行本岛方案。", events:[
    {time:"前晚决定",tag:"A 组",title:"短程出海 / 简单浮潜",note:"2—3人参加，避免长距离快艇；产品必须含保险并支持天气取消。"},
    {time:"同步",tag:"B 组",title:"酒店、咖啡与海滩",note:"妈妈留在卡伦附近，独立交通与晚间会合地点提前约定。"},
    {time:"雨天替换",tag:"全家",title:"普吉老城半日",note:"放弃出海时再执行；不叠加南部环岛和多个打卡点。"},
    {time:"18:30",tag:"会合",title:"全家收官晚餐",note:"当天不再增加活动，回酒店整理转场行李。"}]},
  { date:"10.07 · 周三", city:"曼谷", title:"从海岛回到城市", lead:"优先选择中午前后的 HKT → BKK 直飞，把机场链路当作一天的主任务。", pace:"交通日", events:[
    {time:"09:30",tag:"退房",title:"卡伦 → 普吉机场",note:"至少在起飞前2.5小时离开酒店，雨天不压缩道路缓冲。"},
    {time:"11:00—14:00",tag:"待预订",title:"HKT → BKK",note:"只筛素万那普机场直飞、含托运行李的组合；不为低价改飞DMK。"},
    {time:"16:00",tag:"入住",title:"暹罗 / 拉差贴威",note:"2间房，优先BTS步行500米内、明确床型、可免费取消。"},
    {time:"晚上",tag:"留白",title:"附近晚餐",note:"不安排正式景点；有精神再逛商场或做普通按摩。"}]},
  { date:"10.08 · 周四", city:"曼谷", title:"丝绸旧宅与湄南河夜色", lead:"删除大皇宫路线，把文化、购物和河岸放在一条更舒适的城市动线上。", pace:"适中", events:[
    {time:"10:30",tag:"文化",title:"吉姆·汤普森故居",note:"主屋随导览参观；若兴趣不高，可替换为曼谷艺术文化中心。"},
    {time:"12:30",tag:"城市",title:"暹罗商圈午餐",note:"Siam Center / Paragon按兴趣选择，不为购物拆散整天。"},
    {time:"15:30",tag:"休息",title:"酒店休息或 SPA",note:"保留完整的室内恢复段，避开午后闷热。"},
    {time:"17:30",tag:"河岸",title:"ICONSIAM 与晚餐",note:"看湄南河夜景，结束后直接返回酒店。"}]},
  { date:"10.09 · 周五", city:"曼谷", title:"老街、咖啡与耀华力", lead:"最后一个完整日只走相邻街区，购物与代购独立记账。", pace:"轻松", events:[
    {time:"10:30",tag:"自由",title:"慢上午 / 补购",note:"可分组活动，午后回酒店放下购物袋并休息。"},
    {time:"15:30",tag:"街区",title:"Talat Noi",note:"看老建筑、街头艺术和咖啡馆；妈妈可减少步行后直接会合。"},
    {time:"17:30",tag:"美食",title:"耀华力路晚餐",note:"坐下吃饭为主、街头小吃为辅，避开长时间排队。"},
    {time:"20:30",tag:"整理",title:"两组返程终检",note:"分别确认航站楼、送机时间、行李额、证件和落地日期。"}]},
  { date:"10.10 · 周六", city:"返程", title:"同一座机场，两条回家路线", lead:"1人返回上海，3人返回北京。两组独立出票，以直飞和合理到达时间优先。", pace:"交通日", events:[
    {time:"待航班",tag:"上海 · 1人",title:"BKK → PVG",note:"优先10月10日当天抵沪、含托运行李的直飞航班。"},
    {time:"待航班",tag:"北京 · 3人",title:"BKK → PEK / PKX",note:"查询3张同舱库存；若10月11日凌晨落地，出票前再次确认。"},
    {time:"起飞前3小时",tag:"送机",title:"酒店 → BKK",note:"两组起飞相差不超过2小时可同车，否则分别预约。"}]},
];

const tasks = [
  ["outbound","已完成","确认 CA581 全员出票","逐人检查电子客票号和1×23kg托运行李。"],
  ["return","现在","锁定两组返程","10月10日：1人BKK→PVG，3人BKK→PEK/PKX。"],
  ["domestic","现在","锁定普吉到曼谷","10月7日HKT→BKK，直飞、含行李、中午前后起飞。"],
  ["rooms","出票后","预订两地2间房","普吉10.04—10.07；曼谷10.07—10.10。"],
  ["transfer","出发前2周","建立机场接送订单","同行段用SUV/Van；返程按航班差值决定是否分车。"],
  ["insurance","出发前2周","购买旅行保险","覆盖医疗、航班延误和水上活动，核对免责条款。"],
  ["tdac","10月1日起","提交4人 TDAC","仅使用泰国移民局免费官方入口，保存确认信息。"],
  ["weather","10月5日晚","决定10月6日 A/B 方案","海况不安全即取消出海，执行本岛方案。"],
  ["final","10月9日晚","完成返程终检","两组分别确认航站楼、送机时间、行李额和抵达日期。"],
] as const;

export default function Home() {
  const [active, setActive] = useState(0);
  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return { outbound: true };
    try {
      const saved = window.localStorage.getItem("thai-trip-v7-checks");
      return saved ? { outbound: true, ...JSON.parse(saved) } : { outbound: true };
    } catch {
      return { outbound: true };
    }
  });
  const [menu, setMenu] = useState(false);
  const completed=useMemo(()=>tasks.filter(([id])=>checks[id]).length,[checks]);
  const jump=(id:string)=>{setMenu(false);document.getElementById(id)?.scrollIntoView({behavior:"smooth"})};
  const toggle=(id:string)=>{if(id==="outbound")return;const next={...checks,[id]:!checks[id]};setChecks(next);localStorage.setItem("thai-trip-v7-checks",JSON.stringify(next))};
  const day=days[active]!;
  return <main>
    <header className="topbar"><button className="brand" onClick={()=>jump("top")}><span>向</span><b>向南，再向北<small>2026 家庭旅行执行册</small></b></button><button className="menu" onClick={()=>setMenu(!menu)}>目录</button><nav className={menu?"open":""}>{[["route","路线"],["days","每日"],["booking","预订"],["budget","预算"],["tasks","清单"]].map(([id,label])=><button key={id} onClick={()=>jump(id)}>{label}</button>)}</nav><em>● 7天6晚</em></header>
    <section className="hero" id="top"><div className="hero-copy"><p>OCT 04 — OCT 10 · PHUKET / BANGKOK</p><h1>先去海边，<br/><i>再回城市。</i></h1><h2>一家四口的泰国七日：普吉3晚，曼谷3晚。去程已经确定，余下的每一步都围绕舒服、真实和可执行。</h2><div><button onClick={()=>jump("days")}>查看每日安排 ↘</button><button onClick={()=>jump("tasks")}>先看待办</button></div></div><article className="ticket"><header><span>OUTBOUND · CONFIRMED</span><b>已订</b></header><div className="airports"><section><strong>PEK</strong><small>北京 · T3</small></section><i>CA581<br/>──────── ✦</i><section><strong>HKT</strong><small>普吉</small></section></div><div className="times"><span><b>15:30</b>10月4日</span><span><b>6h</b>直飞</span><span><b>20:30</b>当地时间</span></div><p>4人同行 · 每人1×23kg托运行李 · 以电子客票号确认出票</p></article></section>
    <section className="shell route" id="route"><Heading index="01 · ROUTE LOGIC" title={<>六晚，两个落脚点。<br/>没有多余的折返。</>} text="路线先满足航班与体力，再安排体验。海况改变活动，不改变城市；返程分流，但都从素万那普机场出发。"/><div className="route-grid">{[["10.04 · 已订","北京","CA581 直飞"],["3 NIGHTS","普吉","海滩 · SPA · 天气窗口"],["3 NIGHTS","曼谷","文化 · 美食 · 河岸"],["10.10 · 待订","上海 / 北京","1人 PVG · 3人 PEK/PKX"]].map(([a,b,c])=><article key={b}><small>{a}</small><b>{b}</b><p>{c}</p></article>)}</div><div className="rails">{[["01","少换酒店","只在10月7日转场一次"],["02","不赶早","完整活动日10点后开始"],["03","允许分组","妈妈不被迫参加水上活动"],["04","明确排除","不去大皇宫，不看低俗演出"]].map(([n,t,d])=><article key={n}><span>{n}</span><b>{t}</b><small>{d}</small></article>)}</div></section>
    <section className="dark" id="days"><div className="shell"><Heading light index="02 · DAY BY DAY" title={<>每天只做一件<br/>真正重要的事。</>} text="选择日期查看时间线。安排保留交通和休息缓冲，不用景点数量衡量一天是否值得。"/><div className="tabs">{days.map((d,i)=><button className={i===active?"active":""} onClick={()=>setActive(i)} key={d.date}><small>{d.date.split(" · ")[0]}</small><b>D{i+1}</b><span>{d.city}</span></button>)}</div><div className="day"><aside><span>{day.date}<i>{day.pace}</i></span><small>{day.city} · DAY {active+1}</small><h3>{day.title}</h3><p>{day.lead}</p>{day.rule&&<em><b>WEATHER RULE</b>{day.rule}</em>}</aside><div className="timeline">{day.events.map((e,i)=><article key={e.title}><span>{String(i+1).padStart(2,"0")}</span><div><small>{e.time}<i>{e.tag}</i></small><h4>{e.title}</h4><p>{e.note}</p></div></article>)}</div></div></div></section>
    <section className="shell booking" id="booking"><Heading index="03 · BOOKING GATES" title={<>先锁交通，<br/>再让酒店落位。</>} text="动态价格不写成事实。这里只固定筛选条件和决策顺序，最终信息以付款页与电子客票为准。"/><div className="cards"><FlightCard urgent date="10.10" code="BKK → PVG" title="上海组 · 1人" items={["直飞且含托运行李","优先10月10日当天抵沪","独立出票，不等待北京组同价"]}/><FlightCard urgent date="10.10" code="BKK → PEK / PKX" title="北京组 · 3人" items={["一次查询3张同舱库存","直飞、含托运行李","凌晨抵达须全员提前确认"]}/><FlightCard date="10.07" code="HKT → BKK" title="城市转场 · 4人" items={["11:00—14:00理想起飞","只选BKK，避免DMK","包含4人托运行李"]}/><article className="rooms"><small>出票后24小时 · 2间房</small><div><b>普吉</b><span>10.04—10.07</span><em>卡伦 · 3晚</em></div><div><b>曼谷</b><span>10.07—10.10</span><em>暹罗 / 拉差贴威 · 3晚</em></div><p>明确床型、BTS步行距离、电梯、早餐、税费和免费取消截止日。</p></article></div><div className="car-rule"><b>送机规则</b><span>两组航班相差 ≤ 2小时 → 一起乘Van去BKK</span><span>相差 ＞ 2小时 → 分别预约车辆</span></div></section>
    <section className="money" id="budget"><div className="shell"><Heading light index="04 · MONEY MAP" title={<>国际机票另算，<br/>两万元只服务体验。</>} text="这是控制线，不是伪装成实时价格的报价。购物和代购仍使用完全独立的账本。"/><div className="money-grid"><article className="total"><small>旅行主体目标 · 4人</small><b>¥20,000</b><p>不含国际机票<br/>不含购物与代购</p><span>建议区间 <strong>¥15,300—22,200</strong></span></article><article className="bars">{[["住宿 · 6晚2间房","¥4,400—6,500",31],["泰国境内机票","¥1,600—2,800",14],["接送与市内交通","¥1,500—2,200",12],["餐饮","¥4,000—5,000",25],["SPA与活动","¥1,500—2,500",13],["保险与缓冲","¥2,300—3,200",16]].map(([n,a,w])=><div key={String(n)}><span>{n}</span><b>{a}</b><i><em style={{width:`${w}%`}}/></i></div>)}</article><article className="saving"><small>省钱顺序</small><ol><li>不升级过度昂贵的曼谷酒店</li><li>出海选择短线且可取消产品</li><li>接送提前预约，不临时议价</li><li>一次高品质SPA＋一次普通按摩</li></ol></article></div></div></section>
    <section className="shell tasks" id="tasks"><Heading index="05 · ACTION LIST" title={<>从现在开始，<br/>一件件锁定。</>} text={`${completed}/${tasks.length} 项已完成。勾选结果只保存在当前设备。`}/><div className="progress"><i style={{width:`${completed/tasks.length*100}%`}}/></div><div className="task-list">{tasks.map(([id,phase,title,note],i)=><label className={checks[id]?"done":""} key={id}><input type="checkbox" checked={!!checks[id]} disabled={id==="outbound"} onChange={()=>toggle(id)}/><span>{String(i+1).padStart(2,"0")}</span><em>{phase}</em><b>{title}<small>{note}</small></b><i>✓</i></label>)}</div></section>
    <section className="final-band"><div><small>06 · BEFORE YOU GO</small><h2>三个不能忘的<br/>出发前节点。</h2></div><article><small>10.01 起</small><b>填写4人 TDAC</b><p>仅使用泰国移民局官方免费入口。</p><a href="https://tdac.immigration.go.th/" target="_blank">打开官网 ↗</a></article><article><small>10.03</small><b>值机与行李终检</b><p>护照、保险、eSIM、常用药；充电宝随身携带。</p></article><article><small>全程</small><b>公开信息边界</b><p>不上传证件号、完整订单号、手机号、邮箱或支付凭证。</p></article></section>
    <footer><b>向南，再向北</b><span>事实与建议分开。未知保持未知，动态信息在付款前重新核实。</span><button onClick={()=>jump("top")}>回到顶部 ↑</button></footer>
  </main>
}

function Heading({index,title,text,light=false}:{index:string;title:React.ReactNode;text:string;light?:boolean}){return <header className={`heading ${light?"light":""}`}><div><small>{index}</small><h2>{title}</h2></div><p>{text}</p></header>}
function FlightCard({urgent=false,date,code,title,items}:{urgent?:boolean;date:string;code:string;title:string;items:string[]}){return <article className={`flight-card ${urgent?"urgent":""}`}><header><span>{urgent?"最高优先级":"同步锁定"}</span><small>{date}</small></header><p>{code}</p><h3>{title}</h3><ul>{items.map(x=><li key={x}>{x}</li>)}</ul><a href="https://www.google.com/travel/flights" target="_blank">打开航班搜索 ↗</a></article>}
