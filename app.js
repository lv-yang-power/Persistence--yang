const STORAGE_KEY = "forge-profile-v1";
const CHECKIN_KEY = "forge-checkins-v1";
const QUOTE_KEY = "forge-quote-index-v1";

const daysOfWeek = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const quotes = [
  ["强度会波动，但你可以把出现这件事变成习惯。", "FORGE NOTE / 01"],
  ["你不需要等到有动力，先完成一个热身组。", "FORGE NOTE / 02"],
  ["慢一点没有关系，停下来才会让距离归零。", "FORGE NOTE / 03"],
  ["今天的你，不必打败昨天的你，只要回应今天。", "FORGE NOTE / 04"],
  ["动作做稳，呼吸做深，剩下的交给重复。", "FORGE NOTE / 05"],
  ["真正的变化，常常发生在没有人鼓掌的那几天。", "FORGE NOTE / 06"],
];

const equipmentNames = { home: "居家徒手", basic: "家用基础器械", gym: "健身房" };
const experienceNames = { new: "新手起步", early: "初阶积累", steady: "稳定训练", advanced: "进阶训练" };

const exerciseLibrary = {
  home: {
    push: ["俯卧撑", "跪姿俯卧撑", "椅上臂屈伸"],
    pull: ["毛巾等长划船", "俯卧超人", "反向雪天使"],
    legs: ["自重深蹲", "反向弓步", "臀桥"],
    core: ["死虫式", "平板支撑", "鸟狗式"],
  },
  basic: {
    push: ["哑铃地板卧推", "哑铃肩推", "上斜俯卧撑"],
    pull: ["单臂哑铃划船", "弹力带下拉", "哑铃反向飞鸟"],
    legs: ["高脚杯深蹲", "哑铃罗马尼亚硬拉", "保加利亚分腿蹲"],
    core: ["死虫式", "侧桥", "哑铃农夫走"],
  },
  gym: {
    push: ["杠铃卧推", "坐姿器械推胸", "绳索夹胸"],
    pull: ["高位下拉", "坐姿划船", "面拉"],
    legs: ["杠铃深蹲", "罗马尼亚硬拉", "腿举"],
    core: ["绳索卷腹", "悬垂举膝", "侧桥"],
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

let profile = loadProfile();
let checkins = loadCheckins();
let activeMeal = "day1";

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultProfile();
  } catch {
    return defaultProfile();
  }
}

function defaultProfile() {
  return {
    goal: "strength",
    experience: "new",
    days: 4,
    duration: 45,
    equipment: "basic",
    age: 28,
    height: 170,
    weight: 65,
    sex: "female",
  };
}

function loadCheckins() {
  try {
    return JSON.parse(localStorage.getItem(CHECKIN_KEY)) || [];
  } catch {
    return [];
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(checkins));
}

function dateKey(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function dateFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function mondayOf(date = new Date()) {
  const copy = new Date(date);
  const day = copy.getDay() || 7;
  copy.setDate(copy.getDate() - day + 1);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatNumber(number) {
  return Math.round(number).toLocaleString("zh-CN");
}

function getFormData() {
  const data = new FormData($("#profileForm"));
  return {
    goal: data.get("goal"),
    experience: data.get("experience"),
    days: Number(data.get("days")),
    duration: Number(data.get("duration")),
    equipment: data.get("equipment"),
    age: Number(data.get("age")),
    height: Number(data.get("height")),
    weight: Number(data.get("weight")),
    sex: data.get("sex"),
  };
}

function fillForm() {
  const form = $("#profileForm");
  Object.entries(profile).forEach(([key, value]) => {
    const field = form.elements[key];
    if (!field) return;
    if (key === "goal") {
      const radio = form.querySelector(`[name="${key}"][value="${value}"]`);
      if (radio) radio.checked = true;
    } else {
      field.value = value;
    }
  });
}

function strengthSets() {
  return profile.experience === "new" ? 2 : 3;
}

function repRange() {
  return profile.experience === "new" ? "8–12 次" : "8–10 次";
}

function exerciseLine(name, sets = strengthSets(), reps = repRange(), rest = "60–90 秒") {
  return { name, detail: `${sets} 组 × ${reps}`, rest };
}

function buildStrengthSession(type, index = 0) {
  const lib = exerciseLibrary[profile.equipment];
  const sets = strengthSets();
  const reps = repRange();
  const variations = {
    full: [
      exerciseLine(lib.legs[0], sets, reps),
      exerciseLine(lib.push[0], sets, reps),
      exerciseLine(lib.pull[0], sets, reps),
      exerciseLine(lib.legs[2], sets, "10–12 次"),
      exerciseLine(lib.core[1], sets, "30–45 秒"),
    ],
    upper: [
      exerciseLine(lib.push[index % 2], sets, reps),
      exerciseLine(lib.pull[index % 2], sets, reps),
      exerciseLine(lib.push[2], sets, "10–12 次"),
      exerciseLine(lib.pull[2], sets, "12–15 次"),
      exerciseLine(lib.core[0], sets, "10–12 次/侧"),
    ],
    lower: [
      exerciseLine(lib.legs[0], sets, reps),
      exerciseLine(lib.legs[1], sets, "8–10 次"),
      exerciseLine(lib.legs[2], sets, "8–10 次/侧"),
      exerciseLine(lib.legs[2] === "保加利亚分腿蹲" ? "站姿提踵" : "单腿提踵", sets, "12–15 次"),
      exerciseLine(lib.core[1], sets, "30–45 秒"),
    ],
    push: [
      exerciseLine(lib.push[0], sets, reps),
      exerciseLine(lib.push[1], sets, reps),
      exerciseLine(lib.push[2], sets, "10–12 次"),
      exerciseLine("哑铃侧平举", sets, "12–15 次"),
      exerciseLine(lib.core[0], sets, "10–12 次"),
    ],
    pull: [
      exerciseLine(lib.pull[0], sets, reps),
      exerciseLine(lib.pull[1], sets, reps),
      exerciseLine(lib.pull[2], sets, "12–15 次"),
      exerciseLine("哑铃弯举", sets, "10–12 次"),
      exerciseLine(lib.core[2], sets, "30–45 秒"),
    ],
  };
  return {
    kind: "strength",
    title: { full: "全身力量", upper: "上肢力量", lower: "下肢力量", push: "推训练", pull: "拉训练" }[type],
    subtitle: `${sets} 组为主 · 每组保留 2–3 次余力`,
    duration: profile.duration,
    exercises: variations[type],
  };
}

function buildCardioSession(type = "zone2") {
  if (type === "interval") {
    return {
      kind: "cardio",
      title: "间歇有氧",
      subtitle: "热身 5 分钟 + 8 轮（快 30 秒 / 慢 90 秒）+ 冷身 5 分钟",
      duration: 26,
      exercises: [
        { name: "热身", detail: "5 分钟", rest: "逐步提速" },
        { name: "快速段", detail: "8 × 30 秒", rest: "高努力，可说短句" },
        { name: "恢复段", detail: "8 × 90 秒", rest: "慢走或轻松骑行" },
        { name: "冷身", detail: "5 分钟", rest: "回到轻松呼吸" },
      ],
    };
  }
  return {
    kind: "cardio",
    title: "中等强度有氧",
    subtitle: "保持能说完整句子的节奏，优先选择快走、骑行或椭圆机",
    duration: profile.goal === "fatloss" ? 30 : 25,
    exercises: [
      { name: "热身", detail: "5 分钟", rest: "轻松节奏" },
      { name: "稳定有氧", detail: `${profile.goal === "fatloss" ? 20 : 15} 分钟`, rest: "谈话测试强度" },
      { name: "冷身", detail: "5 分钟", rest: "逐步降速" },
    ],
  };
}

function buildRecoverySession() {
  return {
    kind: "recovery",
    title: "主动恢复",
    subtitle: "不追求疲劳感，让身体为下一次训练做好准备",
    duration: 20,
    exercises: [
      { name: "轻松步行", detail: "15 分钟", rest: "能轻松对话" },
      { name: "关节活动", detail: "5 分钟", rest: "肩、髋、踝各 30 秒" },
    ],
  };
}

function buildSchedule() {
  const days = profile.days;
  const strengthTypes = days === 3
    ? ["full", "full", "full"]
    : days === 4
      ? ["upper", "lower", "upper", "lower"]
      : ["push", "pull", "lower", "upper", "lower"];
  const strengthIndexes = days === 3 ? [0, 1, 2] : [0, 1, 2, 3, 4];
  const schedule = Array.from({ length: 7 }, (_, index) => ({
    dayIndex: index,
    day: daysOfWeek[index],
    date: new Date(mondayOf().getTime() + index * 86400000),
    session: buildRecoverySession(),
  }));

  if (profile.goal === "strength") {
    const map = days === 3 ? [0, 2, 4] : days === 4 ? [0, 1, 3, 4] : [0, 1, 2, 3, 5];
    map.forEach((dayIndex, i) => { schedule[dayIndex].session = buildStrengthSession(strengthTypes[i], strengthIndexes[i]); });
    if (days >= 4) schedule[2].session = buildCardioSession("zone2");
    if (days === 5) schedule[4].session = buildCardioSession("zone2");
  } else {
    const map = days === 3 ? [0, 2, 4] : days === 4 ? [0, 1, 3, 5] : [0, 1, 2, 3, 5];
    map.forEach((dayIndex, i) => {
      schedule[dayIndex].session = buildStrengthSession(days === 3 ? "full" : strengthTypes[i], strengthIndexes[i]);
      if (i === 0 || i === map.length - 1) schedule[dayIndex].session = withCardio(schedule[dayIndex].session, "zone2");
      if (days >= 4 && i === 2) schedule[dayIndex].session = withCardio(schedule[dayIndex].session, "interval");
    });
    schedule[6].session = buildRecoverySession();
  }
  return schedule;
}

function withCardio(session, cardioType) {
  const cardio = buildCardioSession(cardioType);
  return {
    ...session,
    title: `${session.title} + ${cardio.title}`,
    subtitle: `${session.subtitle} · 加 ${cardio.duration} 分钟${cardioType === "interval" ? "间歇" : "中等强度"}有氧`,
    duration: session.duration + cardio.duration,
    exercises: [...session.exercises, { name: cardio.title, detail: `${cardio.duration} 分钟`, rest: cardioType === "interval" ? "30 秒快 / 90 秒慢" : "谈话测试" }],
  };
}

function calculateNutrition() {
  const { age, height, weight, sex, goal } = profile;
  const bmr = sex === "male" ? (10 * weight + 6.25 * height - 5 * age + 5) : (10 * weight + 6.25 * height - 5 * age - 161);
  const activity = 1.38 + (profile.days - 3) * .05;
  const maintenance = bmr * activity;
  const calories = goal === "fatloss" ? maintenance - 350 : maintenance + 220;
  const proteinLow = weight * 1.4;
  const proteinHigh = weight * 2;
  return { calories: Math.max(1400, calories), proteinLow, proteinHigh, maintenance };
}

const mealTemplates = {
  strength: {
    day1: [
      ["07:30", "燕麦酸奶碗", "燕麦 60g + 无糖希腊酸奶 200g + 香蕉半根 + 坚果 10g", "480 kcal"],
      ["12:30", "鸡胸藜麦餐盘", "鸡胸 150g + 熟藜麦 150g + 西兰花 200g + 橄榄油 1 茶匙", "620 kcal"],
      ["16:30", "训练前加餐", "全麦面包 2 片 + 低脂奶 250ml + 苹果 1 个", "330 kcal"],
      ["19:30", "三文鱼土豆盘", "三文鱼 140g + 土豆 250g + 混合蔬菜 250g", "590 kcal"],
    ],
    day2: [
      ["08:00", "鸡蛋豆浆早餐", "鸡蛋 2 个 + 全麦吐司 2 片 + 无糖豆浆 300ml + 番茄", "420 kcal"],
      ["12:30", "牛肉糙米餐盘", "瘦牛肉 140g + 熟糙米 150g + 彩椒蘑菇 250g", "570 kcal"],
      ["16:30", "高蛋白酸奶", "高蛋白酸奶 1 杯 + 蓝莓一小把", "200 kcal"],
      ["19:00", "虾仁豆腐蔬菜锅", "虾仁 150g + 嫩豆腐 200g + 绿叶菜 300g + 玉米半根", "480 kcal"],
    ],
  },
  fatloss: {
    day1: [
      ["07:30", "高蛋白隔夜燕麦", "燕麦 45g + 无糖酸奶 200g + 浆果 100g + 奇亚籽 8g", "370 kcal"],
      ["12:30", "鸡肉大份沙拉", "鸡胸 160g + 生菜/番茄/黄瓜 300g + 玉米 80g + 全麦面包 1 片", "500 kcal"],
      ["16:30", "训练前小食", "香蕉半根 + 无糖豆浆 250ml", "150 kcal"],
      ["19:00", "鳕鱼杂粮盘", "鳕鱼 180g + 熟杂粮饭 120g + 西兰花 250g + 菌菇", "470 kcal"],
    ],
    day2: [
      ["08:00", "蔬菜鸡蛋碗", "鸡蛋 2 个 + 蛋清 2 个 + 玉米半根 + 菠菜蘑菇", "350 kcal"],
      ["12:30", "牛肉荞麦面", "瘦牛肉 130g + 荞麦面 100g + 青菜 250g", "480 kcal"],
      ["16:30", "轻食加餐", "低脂奶 250ml + 小橙子 1 个", "160 kcal"],
      ["19:00", "豆腐虾仁锅", "虾仁 150g + 北豆腐 180g + 白菜/番茄 300g + 小土豆 150g", "450 kcal"],
    ],
  },
};

function renderPlan() {
  const schedule = buildSchedule();
  const todayIndex = (new Date().getDay() + 6) % 7;
  const today = schedule[todayIndex];
  const nutrition = calculateNutrition();
  const goalText = profile.goal === "fatloss" ? "减脂 / 变轻盈" : "增肌 / 变强";
  $("#planLabel").textContent = `${experienceNames[profile.experience]} · ${equipmentNames[profile.equipment]}`;
  $("#goalLabel").textContent = goalText;
  $("#avatarLetter").textContent = profile.goal === "fatloss" ? "↘" : "↗";
  $("#trainingDaysMetric").innerHTML = `${profile.days} <small>天</small>`;
  $("#todayDurationMetric").innerHTML = `${today.session.duration} <small>min</small>`;
  $("#proteinMetric").innerHTML = `${formatNumber(nutrition.proteinLow)}–${formatNumber(nutrition.proteinHigh)} <small>g</small>`;
  $("#calorieMetric").textContent = formatNumber(nutrition.calories);
  $("#executionTip").textContent = profile.goal === "fatloss"
    ? "有氧不必每次拼到极限，能稳定完成一周总量更重要。"
    : "每组结束时保留 2–3 次余力，动作质量优先于重量。";
  $("#scheduleList").innerHTML = schedule.map((item, index) => {
    const key = dateKey(item.date);
    const done = checkins.includes(key);
    return `<div class="schedule-row ${index === todayIndex ? "is-today" : ""} ${done ? "is-complete" : ""}" data-date="${key}" data-index="${index}">
      <span class="day-name">${item.day}</span>
      <span class="day-number">${item.date.getDate()}</span>
      <div class="schedule-main"><strong>${item.session.title}</strong><span>${item.session.subtitle}</span></div>
      <span class="schedule-time">${item.session.duration} MIN</span>
      <span class="schedule-status" aria-label="${done ? "已完成" : "未完成"}"></span>
    </div>`;
  }).join("");
  $("#todayTitle").textContent = `今天，${today.session.title}。`;
  $("#todaySubtitle").textContent = today.session.subtitle;
  renderSession(today.session);
  renderCalendar();
  renderCheckin();
  renderMeals();
}

function renderSession(session) {
  const warmup = { kind: "recovery", title: "热身与准备", subtitle: "动态活动 + 低强度动作，让身体进入工作状态", duration: 7, exercises: [{ name: "动态热身", detail: "5–8 分钟", rest: "肩、髋、踝活动" }] };
  const cards = [warmup, session, session.kind === "strength" ? { kind: "cardio", title: "收尾与冷身", subtitle: "轻松走动，配合 2–3 个舒适的拉伸动作", duration: 5, exercises: [{ name: "冷身", detail: "5 分钟", rest: "缓慢降心率" }] } : buildRecoverySession()];
  $("#sessionGrid").innerHTML = cards.map((card, index) => `<article class="session-card ${card.kind === "cardio" ? "card-cardio" : card.kind === "recovery" ? "card-recovery" : ""}">
    <div class="session-index"><span>0${index + 1} / ${card.kind === "strength" ? "RESISTANCE" : card.kind === "cardio" ? "CARDIO" : "RESET"}</span><span>${card.duration} MIN</span></div>
    <h3>${card.title}</h3>
    <p>${card.subtitle}</p>
    <ul class="exercise-list">${card.exercises.map((exercise) => `<li><span>${exercise.name}</span><strong>${exercise.detail}</strong><small>休息 ${exercise.rest}</small></li>`).join("")}</ul>
    <div class="session-meta"><span>${card.exercises.length} 个模块</span><span>${card.kind === "strength" ? "RPE 6–8" : "谈话测试"}</span></div>
  </article>`).join("");
  const progress = session.kind === "recovery" ? 0 : 25;
  $("#todayRing span").textContent = `${progress}%`;
}

function renderMeals() {
  const templates = mealTemplates[profile.goal][activeMeal];
  $("#mealList").innerHTML = templates.map(([time, title, detail, kcal]) => `<div class="meal-item">
    <span class="meal-time">${time}</span>
    <div><strong>${title}</strong><p>${detail}</p></div>
    <span class="meal-kcal">${kcal}</span>
  </div>`).join("");
}

function renderCalendar() {
  const monday = mondayOf();
  const todayKey = dateKey();
  const weekKeys = Array.from({ length: 7 }, (_, index) => dateKey(new Date(monday.getTime() + index * 86400000)));
  const doneCount = weekKeys.filter((key) => checkins.includes(key)).length;
  $("#weekScore").textContent = `${doneCount} / 7`;
  $("#weekRange").textContent = `${monday.getMonth() + 1}.${monday.getDate()} — ${new Date(monday.getTime() + 6 * 86400000).getMonth() + 1}.${new Date(monday.getTime() + 6 * 86400000).getDate()}`;
  $("#calendarDays").innerHTML = weekKeys.map((key, index) => {
    const date = dateFromKey(key);
    return `<div class="calendar-day ${key === todayKey ? "is-today" : ""} ${checkins.includes(key) ? "is-done" : ""}">
      <span>${daysOfWeek[index].slice(1)}</span><strong>${date.getDate()}</strong>
    </div>`;
  }).join("");
}

function renderCheckin() {
  const today = dateKey();
  const doneToday = checkins.includes(today);
  let streak = 0;
  let cursor = new Date();
  while (checkins.includes(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  const total = checkins.length;
  $("#streakCount").textContent = streak;
  $("#streakTrack").style.width = `${Math.min(streak / 7 * 100, 100)}%`;
  $("#checkinButton").innerHTML = doneToday ? "今日已完成 <span>✓</span>" : "完成今日打卡 <span>✓</span>";
  $("#checkinButton").disabled = doneToday;
  $("#checkinButton").style.opacity = doneToday ? ".6" : "1";
  $("#checkinStatus").textContent = doneToday ? `很好，今天已经为自己留下一笔。累计完成 ${total} 天。` : "今天还没有打卡，给自己一个小小的确认。";
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

$("#profileForm").addEventListener("submit", (event) => {
  event.preventDefault();
  profile = getFormData();
  saveState();
  renderPlan();
  showToast("计划已更新，去看看今天的安排吧。");
  $("#plan").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("#editProfile").addEventListener("click", () => $("#setup").scrollIntoView({ behavior: "smooth", block: "start" }));

$("#checkinButton").addEventListener("click", () => {
  const today = dateKey();
  if (!checkins.includes(today)) {
    checkins.push(today);
    checkins.sort();
    saveState();
    renderPlan();
    showToast("打卡完成。把这一小步，记在今天。");
  }
});

$("#quoteButton").addEventListener("click", () => {
  const nextIndex = (Number(localStorage.getItem(QUOTE_KEY) || 0) + 1) % quotes.length;
  localStorage.setItem(QUOTE_KEY, nextIndex);
  $("#quoteText").textContent = quotes[nextIndex][0];
  $("#quoteAuthor").textContent = quotes[nextIndex][1];
});

$$(".meal-tab").forEach((button) => button.addEventListener("click", () => {
  activeMeal = button.dataset.meal;
  $$(".meal-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
  renderMeals();
}));

$("#scheduleList").addEventListener("click", (event) => {
  const row = event.target.closest(".schedule-row");
  if (!row) return;
  const selected = buildSchedule()[Number(row.dataset.index)];
  $("#todayTitle").textContent = `${row.querySelector(".day-name").textContent}，${selected.session.title}。`;
  $("#todaySubtitle").textContent = selected.session.subtitle;
  renderSession(selected.session);
  $("#todayRing span").textContent = checkins.includes(row.dataset.date) ? "100%" : "0%";
  $$(".schedule-row").forEach((item) => item.classList.toggle("is-today", item === row));
  document.querySelector(".today-section").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("#menuButton").addEventListener("click", () => {
  const nav = $(".main-nav");
  const isOpen = nav.classList.toggle("mobile-open");
  nav.style.display = isOpen ? "flex" : "";
  nav.style.position = isOpen ? "absolute" : "";
  nav.style.top = isOpen ? "72px" : "";
  nav.style.right = isOpen ? "14px" : "";
  nav.style.flexDirection = isOpen ? "column" : "";
  nav.style.padding = isOpen ? "15px" : "";
  nav.style.background = isOpen ? "var(--paper)" : "";
  nav.style.border = isOpen ? "1px solid var(--line)" : "";
});

fillForm();
renderPlan();
