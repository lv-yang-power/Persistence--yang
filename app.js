const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const PROFILE_KEY = "forge-profile-v1";
const CHECKIN_KEY = "forge-checkins-v1";
const EXERCISE_KEY = "forge-exercises-v2";
const MEAL_KEY = "forge-meals-v1";
const dayNames = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const dayShortNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const imagePool = [
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=85",
];
const quotes = [
  "你不需要等到有动力，先完成一个热身组。",
  "强度会波动，但你可以把出现这件事变成习惯。",
  "慢一点没有关系，停下来才会让距离归零。",
  "今天的你，不必打败昨天的你，只要回应今天。",
  "动作做稳，呼吸做深，剩下的交给重复。",
  "真正的变化，常常发生在没有人鼓掌的那几天。",
];
const exerciseLibrary = {
  home: { push: ["俯卧撑", "跪姿俯卧撑", "椅上臂屈伸"], pull: ["毛巾等长划船", "俯卧超人", "反向雪天使"], legs: ["自重深蹲", "反向弓步", "臀桥"], core: ["死虫式", "平板支撑", "鸟狗式"] },
  basic: { push: ["哑铃地板卧推", "哑铃肩推", "上斜俯卧撑"], pull: ["单臂哑铃划船", "弹力带下拉", "哑铃反向飞鸟"], legs: ["高脚杯深蹲", "哑铃罗马尼亚硬拉", "保加利亚分腿蹲"], core: ["死虫式", "侧桥", "哑铃农夫走"] },
  gym: { push: ["杠铃卧推", "坐姿器械推胸", "绳索夹胸"], pull: ["高位下拉", "坐姿划船", "面拉"], legs: ["杠铃深蹲", "罗马尼亚硬拉", "腿举"], core: ["绳索卷腹", "悬垂举膝", "侧桥"] },
};

let profile = loadJson(PROFILE_KEY, { goal: "strength", experience: "new", days: 4, duration: 45, equipment: "basic", age: 28, height: 170, weight: 65, sex: "female" });
let checkins = loadJson(CHECKIN_KEY, []);
let completedExercises = loadJson(EXERCISE_KEY, {});
let eatenMeals = loadJson(MEAL_KEY, {});
let selectedDayIndex = (new Date().getDay() + 6) % 7;
let selectedMealDate = dateKey();
let mealFilter = "all";
let quoteIndex = 1;

function loadJson(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function dateKey(date = new Date()) { const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); }
function dateFromKey(key) { const [year, month, day] = key.split("-").map(Number); return new Date(year, month - 1, day); }
function mondayOf(date = new Date()) { const copy = new Date(date); const day = copy.getDay() || 7; copy.setDate(copy.getDate() - day + 1); copy.setHours(0, 0, 0, 0); return copy; }
function todayIndex() { return (new Date().getDay() + 6) % 7; }
function formatNumber(value) { return Math.round(value).toLocaleString("zh-CN"); }
function goalLabel() { return profile.goal === "fatloss" ? "减脂 / 变轻盈" : "增肌 / 变强"; }
function strengthSets() { return profile.experience === "new" ? 2 : 3; }
function repRange() { return profile.experience === "new" ? "8–12 次" : "8–10 次"; }
function exercise(name, detail = `${strengthSets()} 组 × ${repRange()}`, rest = "60–90 秒") { return { name, detail, rest }; }

function strengthSession(type, index = 0) {
  const lib = exerciseLibrary[profile.equipment]; const set = strengthSets();
  const map = {
    full: [exercise(lib.legs[0]), exercise(lib.push[0]), exercise(lib.pull[0]), exercise(lib.legs[2], `${set} 组 × 10–12 次`), exercise(lib.core[1], `${set} 组 × 30–45 秒`)],
    upper: [exercise(lib.push[index % 2]), exercise(lib.pull[index % 2]), exercise(lib.push[2], `${set} 组 × 10–12 次`), exercise(lib.pull[2], `${set} 组 × 12–15 次`), exercise(lib.core[0], `${set} 组 × 10–12 次/侧`)],
    lower: [exercise(lib.legs[0]), exercise(lib.legs[1], `${set} 组 × 8–10 次`), exercise(lib.legs[2], `${set} 组 × 8–10 次/侧`), exercise("站姿提踵", `${set} 组 × 12–15 次`), exercise(lib.core[1], `${set} 组 × 30–45 秒`)],
    push: [exercise(lib.push[0]), exercise(lib.push[1]), exercise(lib.push[2], `${set} 组 × 10–12 次`), exercise("哑铃侧平举", `${set} 组 × 12–15 次`), exercise(lib.core[0], `${set} 组 × 10–12 次`)],
    pull: [exercise(lib.pull[0]), exercise(lib.pull[1]), exercise(lib.pull[2], `${set} 组 × 12–15 次`), exercise("哑铃弯举", `${set} 组 × 10–12 次`), exercise(lib.core[2], `${set} 组 × 30–45 秒`)],
  };
  const titles = { full: "全身力量", upper: "上肢力量", lower: "下肢力量", push: "推训练", pull: "拉训练" };
  return { kind: "strength", title: titles[type], subtitle: `${set} 组为主 · 每组保留 2–3 次余力`, duration: profile.duration, exercises: map[type] };
}
function cardioSession(type = "zone2") {
  if (type === "interval") return { kind: "cardio", title: "间歇有氧", subtitle: "热身 5 分钟 + 8 轮快慢交替 + 冷身 5 分钟", duration: 26, exercises: [exercise("热身", "5 分钟", "逐步提速"), exercise("快速段", "8 × 30 秒", "高努力，可说短句"), exercise("恢复段", "8 × 90 秒", "慢走或轻松骑行"), exercise("冷身", "5 分钟", "回到轻松呼吸")] };
  return { kind: "cardio", title: "中等强度有氧", subtitle: "保持能说完整句子的节奏，优先选择快走、骑行或椭圆机", duration: profile.goal === "fatloss" ? 30 : 25, exercises: [exercise("热身", "5 分钟", "轻松节奏"), exercise("稳定有氧", `${profile.goal === "fatloss" ? 20 : 15} 分钟`, "谈话测试强度"), exercise("冷身", "5 分钟", "逐步降速")] };
}
function recoverySession() { return { kind: "recovery", title: "主动恢复", subtitle: "轻松走动与关节活动，让身体为下一次训练做好准备", duration: 20, exercises: [exercise("轻松步行", "15 分钟", "能轻松对话"), exercise("关节活动", "5 分钟", "肩、髋、踝各 30 秒")] }; }
function combine(session, cardioType) { const cardio = cardioSession(cardioType); return { ...session, title: `${session.title} + ${cardio.title}`, subtitle: `${session.subtitle} · 加 ${cardio.duration} 分钟${cardioType === "interval" ? "间歇" : "中等强度"}有氧`, duration: session.duration + cardio.duration, exercises: [...session.exercises, exercise(cardio.title, `${cardio.duration} 分钟`, cardioType === "interval" ? "30 秒快 / 90 秒慢" : "谈话测试")] }; }
function buildSchedule() {
  const days = profile.days; const schedule = Array.from({ length: 7 }, (_, index) => ({ dayIndex: index, day: dayNames[index], short: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][index], date: new Date(mondayOf().getTime() + index * 86400000), session: recoverySession() }));
  const types = days === 3 ? ["full", "full", "full"] : days === 4 ? ["upper", "lower", "upper", "lower"] : ["push", "pull", "lower", "upper", "lower"];
  const indexes = days === 3 ? [0, 1, 2] : [0, 1, 2, 3, 4]; const map = days === 3 ? [0, 2, 4] : days === 4 ? [0, 1, 3, 5] : [0, 1, 2, 3, 5];
  map.forEach((day, index) => { let session = strengthSession(days === 3 && profile.goal === "fatloss" ? "full" : types[index], indexes[index]); if (profile.goal === "fatloss" && (index === 0 || index === map.length - 1)) session = combine(session, "zone2"); if (profile.goal === "fatloss" && days >= 4 && index === 2) session = combine(session, "interval"); schedule[day].session = session; });
  if (profile.goal === "strength" && days >= 4) schedule[2].session = cardioSession("zone2");
  if (profile.goal === "strength" && days === 5) schedule[4].session = cardioSession("zone2");
  return schedule;
}
function calculateNutrition() {
  const { age, height, weight, sex, goal } = profile; const bmr = sex === "male" ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161; const maintenance = bmr * (1.38 + (profile.days - 3) * .05);
  return { calories: Math.max(1400, goal === "fatloss" ? maintenance - 350 : maintenance + 220), proteinLow: weight * 1.4, proteinHigh: weight * 2 };
}

const meals = {
  strength: [
    [["柚香酸奶燕麦碗", "燕麦、希腊酸奶、香蕉、核桃", 480, ["蛋白 28g", "10 分钟"]], ["照烧鸡肉藜麦盘", "鸡胸、藜麦、西兰花、芝麻", 620, ["蛋白 46g", "备餐友好"]], ["训练前香蕉吐司", "全麦吐司、香蕉、低脂牛奶", 330, ["训练前", "碳水"]], ["味噌三文鱼土豆", "三文鱼、土豆、菠菜、味噌汁", 590, ["蛋白 38g", "Omega-3"]]],
    [["鸡蛋牛油果开放吐司", "鸡蛋、牛油果、酸种面包、番茄", 450, ["蛋白 25g", "高纤维"]], ["黑椒牛肉糙米碗", "瘦牛肉、糙米、彩椒、蘑菇", 610, ["蛋白 42g", "铁元素"]], ["莓果蛋白酸奶", "高蛋白酸奶、蓝莓、南瓜籽", 240, ["蛋白 22g", "5 分钟"]], ["虾仁豆腐蔬菜锅", "虾仁、北豆腐、白菜、玉米", 490, ["蛋白 39g", "一锅出"]]],
    [["苹果肉桂蛋白粥", "燕麦、乳清蛋白、苹果、肉桂", 430, ["蛋白 31g", "暖胃"]], ["金枪鱼鹰嘴豆沙拉", "金枪鱼、鹰嘴豆、混合生菜、橄榄油", 520, ["蛋白 36g", "免开火"]], ["可可香蕉奶昔", "牛奶、香蕉、可可、花生酱", 300, ["训练前", "5 分钟"]], ["鸡腿南瓜烤盘", "去皮鸡腿、南瓜、芦笋、酸奶酱", 575, ["蛋白 41g", "烤箱菜"]]],
    [["菠菜蘑菇蛋卷", "鸡蛋、菠菜、蘑菇、全麦面包", 390, ["蛋白 27g", "低负担"]], ["番茄牛肉意面", "瘦牛肉、全麦意面、番茄、芝士", 640, ["蛋白 43g", "高碳训练日"]], ["毛豆小食盒", "毛豆、橙子、无糖茶", 220, ["蛋白 19g", "高纤维"]], ["鳕鱼番茄豆泥盘", "鳕鱼、白芸豆、番茄、芝麻菜", 510, ["蛋白 42g", "清爽"]]],
    [["豆乳奇亚籽布丁", "无糖豆乳、奇亚籽、浆果、燕麦", 410, ["蛋白 24g", "隔夜准备"]], ["香煎猪里脊杂粮饭", "猪里脊、杂粮饭、青豆、胡萝卜", 625, ["蛋白 44g", "维生素 B"]], ["芝士火鸡卷", "全麦卷饼、火鸡胸、芝士、生菜", 295, ["蛋白 24g", "便携"]], ["咖喱鸡胸扁豆汤", "鸡胸、扁豆、番茄、椰奶", 550, ["蛋白 40g", "暖身"]]],
    [["无糖豆浆鸡蛋碗", "鸡蛋、豆浆、玉米、黄瓜", 400, ["蛋白 28g", "10 分钟"]], ["三文鱼荞麦冷面", "三文鱼、荞麦面、黄瓜、海苔", 590, ["蛋白 36g", "夏日清爽"]], ["坚果水果杯", "苹果、酸奶、杏仁", 260, ["轻加餐", "5 分钟"]], ["麻辣虾仁花菜饭", "虾仁、花菜、糙米、青椒", 530, ["蛋白 39g", "高饱腹"]]],
    [["香蕉花生隔夜燕麦", "燕麦、酸奶、香蕉、花生酱", 470, ["蛋白 26g", "隔夜准备"]], ["鸡肉凯撒土豆盘", "鸡胸、小土豆、生菜、酸奶凯撒酱", 600, ["蛋白 45g", "高饱腹"]], ["可可蛋白奶", "低脂奶、可可、乳清蛋白", 220, ["蛋白 25g", "3 分钟"]], ["牛肉蔬菜乌冬", "瘦牛肉、乌冬、青菜、香菇", 610, ["蛋白 40g", "一锅出"]]],
    [["番茄鸡蛋燕麦杯", "鸡蛋、燕麦、番茄、菠菜", 390, ["蛋白 25g", "烤箱菜"]], ["鸡肉咖喱糙米饭", "鸡胸、糙米、胡萝卜、咖喱", 620, ["蛋白 44g", "一锅出"]], ["酸奶葡萄小碗", "高蛋白酸奶、葡萄、南瓜籽", 230, ["蛋白 20g", "5 分钟"]], ["牛肉蔬菜粉丝锅", "瘦牛肉、粉丝、青菜、菌菇", 570, ["蛋白 38g", "高饱腹"]]],
  ],
  fatloss: [
    [["莓果希腊酸奶杯", "无糖酸奶、浆果、燕麦、奇亚籽", 340, ["蛋白 27g", "高纤维"]], ["鸡肉大份沙拉", "鸡胸、混合生菜、玉米、全麦面包", 500, ["蛋白 43g", "大体积"]], ["豆浆半根香蕉", "无糖豆浆、香蕉半根", 150, ["训练前", "3 分钟"]], ["鳕鱼杂粮蔬菜盘", "鳕鱼、杂粮饭、西兰花、菌菇", 470, ["蛋白 42g", "低脂"]]],
    [["蔬菜鸡蛋碗", "鸡蛋、蛋清、玉米、菠菜、蘑菇", 350, ["蛋白 28g", "低负担"]], ["牛肉荞麦面", "瘦牛肉、荞麦面、青菜、海带", 480, ["蛋白 36g", "一锅出"]], ["低脂奶橙子", "低脂牛奶、小橙子", 160, ["轻加餐", "5 分钟"]], ["豆腐虾仁白菜锅", "虾仁、北豆腐、白菜、小土豆", 450, ["蛋白 39g", "高饱腹"]]],
    [["苹果肉桂蛋白粥", "燕麦、低脂奶、苹果、肉桂", 320, ["蛋白 24g", "暖胃"]], ["金枪鱼豆泥沙拉", "金枪鱼、白芸豆、生菜、番茄", 440, ["蛋白 34g", "免开火"]], ["水煮蛋小番茄", "水煮蛋、番茄、无糖茶", 130, ["轻加餐", "3 分钟"]], ["鸡腿南瓜蔬菜盘", "去皮鸡腿、南瓜、芦笋、酸奶酱", 490, ["蛋白 39g", "烤箱菜"]]],
    [["菠菜蘑菇蛋卷", "鸡蛋、菠菜、蘑菇、全麦面包半片", 300, ["蛋白 24g", "10 分钟"]], ["番茄牛肉意面", "瘦牛肉、全麦意面、番茄、芝士少量", 520, ["蛋白 36g", "控量碳水"]], ["毛豆小食盒", "毛豆、橙子、无糖茶", 190, ["蛋白 16g", "高纤维"]], ["鳕鱼番茄豆泥盘", "鳕鱼、白芸豆、番茄、芝麻菜", 430, ["蛋白 39g", "清爽"]]],
    [["豆乳奇亚籽布丁", "无糖豆乳、奇亚籽、浆果", 310, ["蛋白 20g", "隔夜准备"]], ["猪里脊杂粮饭", "猪里脊、杂粮饭、青豆、胡萝卜", 520, ["蛋白 39g", "高饱腹"]], ["芝士火鸡卷半份", "全麦卷饼、火鸡胸、生菜", 220, ["蛋白 20g", "便携"]], ["咖喱鸡胸扁豆汤", "鸡胸、扁豆、番茄、椰奶少量", 460, ["蛋白 38g", "暖身"]]],
    [["无糖豆浆鸡蛋碗", "鸡蛋、豆浆、玉米半根、黄瓜", 300, ["蛋白 25g", "10 分钟"]], ["三文鱼荞麦冷面", "三文鱼、荞麦面、黄瓜、海苔", 500, ["蛋白 34g", "清爽"]], ["坚果水果小杯", "苹果、酸奶、杏仁少量", 180, ["轻加餐", "5 分钟"]], ["麻辣虾仁花菜饭", "虾仁、花菜、糙米少量、青椒", 430, ["蛋白 38g", "高饱腹"]]],
    [["香蕉花生燕麦", "燕麦、无糖酸奶、香蕉半根、花生酱", 360, ["蛋白 23g", "隔夜准备"]], ["鸡肉土豆生菜盘", "鸡胸、小土豆、生菜、酸奶酱", 490, ["蛋白 42g", "高饱腹"]], ["可可蛋白奶", "低脂奶、可可、乳清蛋白", 190, ["蛋白 23g", "3 分钟"]], ["牛肉蔬菜乌冬半份", "瘦牛肉、乌冬少量、青菜、香菇", 480, ["蛋白 37g", "一锅出"]]],
  ],
};

function mealData() {
  const day = (dateFromKey(selectedMealDate).getDay() + 6) % 7; const offset = eatenMeals[`shuffle:${profile.goal}:${selectedMealDate}`] || 0;
  return meals[profile.goal][day].map((item, index) => ({ time: ["07:30", "12:30", "16:30", "19:30"][index], title: item[0], detail: item[1], kcal: item[2], tags: item[3], image: imagePool[(index + day + offset) % imagePool.length] }));
}

function renderProfile() {
  const form = $("#profileForm");
  Object.entries(profile).forEach(([key, value]) => { const field = form.elements[key]; if (!field) return; if (key === "goal") form.querySelector(`[name="${key}"][value="${value}"]`).checked = true; else field.value = value; });
  const avatar = profile.goal === "fatloss" ? "↘" : "↗"; $("#profileAvatar").textContent = avatar; $("#topAvatar").textContent = avatar; $("#sidebarGoal").textContent = goalLabel();
}
function renderNav(view) {
  const titles = { dashboard: "今日总览", workout: "训练计划", nutrition: "营养食谱", progress: "我的进度", profile: "我的档案" };
  $$(".nav-item, .mobile-nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  $$("[data-view-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.viewPanel === view));
  $("#breadcrumbTitle").textContent = titles[view]; window.scrollTo({ top: 0, behavior: "smooth" }); closeSidebar();
}
function renderDate() { $("#topDate").textContent = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" }).toUpperCase(); }
function getStreak() { let streak = 0; const cursor = new Date(); while (checkins.includes(dateKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); } return streak; }
function renderDashboard() {
  const schedule = buildSchedule(); const index = todayIndex(); const today = schedule[index]; const nutrition = calculateNutrition(); const streak = getStreak(); const weekDone = schedule.filter((item) => checkins.includes(dateKey(item.date))).length;
  $("#heroStreak").textContent = streak; $("#heroStreakBar").style.width = `${Math.min(streak / 7 * 100, 100)}%`; $("#heroStreakNote").textContent = streak ? `已经连续出现 ${streak} 天。` : "今天的第一步还在等你。";
  $("#heroSessionTitle").textContent = today.session.title; $("#heroSessionMeta").textContent = `${today.session.duration} 分钟 · ${today.session.subtitle}`; $("#dashboardSessionTitle").textContent = `今天，${today.session.title}。`; $("#dashboardSessionSubtitle").textContent = today.session.subtitle; $("#dashboardDuration").innerHTML = `${today.session.duration}<small> min</small>`; $("#dashboardType").textContent = today.session.kind === "strength" ? "RESISTANCE" : today.session.kind === "cardio" ? "CARDIO" : "RESET";
  $("#metricTrainingDays").innerHTML = `${profile.days}<span> DAYS</span>`; $("#metricProtein").innerHTML = `${formatNumber(nutrition.proteinLow)}–${formatNumber(nutrition.proteinHigh)}<span> G</span>`; $("#metricCalories").innerHTML = `${formatNumber(nutrition.calories)}<span> KCAL</span>`; $("#metricConsistency").innerHTML = `${Math.round(weekDone / 7 * 100)}<span>%</span>`; $("#proteinBar").style.width = `${Math.min(nutrition.proteinHigh / 180 * 100, 100)}%`; $("#consistencyBar").style.width = `${weekDone / 7 * 100}%`;
  $("#dashboardWeekStrip").innerHTML = schedule.map((item, itemIndex) => { const key = dateKey(item.date); const done = checkins.includes(key); return `<button class="week-card ${itemIndex === selectedDayIndex ? "selected" : ""} ${itemIndex === index ? "today" : ""} ${done ? "done" : ""}" type="button" data-day-index="${itemIndex}"><span class="week-card-day">${item.short}</span><strong class="week-card-date">${item.date.getDate()}</strong><strong>${item.session.title}</strong><small>${item.session.duration} min</small><i class="week-card-check"></i></button>`; }).join("");
}
function renderWorkout() {
  const schedule = buildSchedule(); const selected = schedule[selectedDayIndex]; const key = dateKey(selected.date); const completed = completedExercises[key] || []; const total = selected.session.exercises.length; const done = completed.length;
  $("#workoutStatus").textContent = done === total ? "COMPLETED" : done ? "IN PROGRESS" : "READY"; $("#workoutStatusNote").textContent = done === total ? "今天的任务已经完成" : done ? `${done} / ${total} 个模块完成` : "从今天的第一组开始";
  $("#workoutDays").innerHTML = schedule.map((item, index) => { const dayKey = dateKey(item.date); const dayDone = (completedExercises[dayKey] || []).length === item.session.exercises.length; return `<button class="workout-day ${index === selectedDayIndex ? "active" : ""} ${index === todayIndex() ? "today" : ""}" type="button" data-day-index="${index}"><span class="workout-day-number">${String(index + 1).padStart(2, "0")}</span><span class="workout-day-title"><strong>${item.day} · ${item.session.title}</strong><small>${dayDone ? "已完成" : item.session.subtitle}</small></span><span class="workout-day-time">${item.session.duration}′</span></button>`; }).join("");
  $("#workoutDetail").innerHTML = `<div class="detail-top"><div><span class="label-mono">${selected.short} / ${selected.session.kind.toUpperCase()}</span><h2>${selected.session.title}</h2><p>${selected.session.subtitle}</p></div><div class="detail-progress"><strong>${Math.round(done / total * 100) || 0}%</strong><small>${done} / ${total} MODULES</small></div></div><div class="exercise-items">${selected.session.exercises.map((item, index) => `<button class="exercise-item ${completed.includes(index) ? "completed" : ""}" type="button" data-exercise-index="${index}"><span class="exercise-check"></span><span class="exercise-main"><strong>${item.name}</strong><small>动作质量优先 · 接近力竭前保留余力</small></span><strong class="exercise-reps">${item.detail}</strong><small class="exercise-rest">休息 ${item.rest}</small></button>`).join("")}</div><div class="detail-footer"><span>建议：先完成热身，再进入第一个主动作。</span><strong>${profile.experience === "new" ? "RPE 6–7" : "RPE 7–8"} / CONTROL THE TEMPO</strong></div>`;
}
function renderNutrition() {
  const nutrition = calculateNutrition(); const selected = dateFromKey(selectedMealDate); const weekday = (selected.getDay() + 6) % 7; const dayMeals = mealData(); const start = mondayOf();
  $("#nutritionCalories").textContent = formatNumber(nutrition.calories); $("#nutritionProtein").textContent = `${formatNumber(nutrition.proteinLow)}–${formatNumber(nutrition.proteinHigh)}g protein`; $("#nutritionGoal").textContent = `for ${profile.goal === "fatloss" ? "fat loss" : "strength"}`;
  $("#dateSwitcher").innerHTML = Array.from({ length: 7 }, (_, index) => { const date = new Date(start.getTime() + index * 86400000); const key = dateKey(date); return `<button class="date-button ${key === selectedMealDate ? "active" : ""}" type="button" data-meal-date="${key}">${dayShortNames[index]}<strong>${date.getDate()}</strong></button>`; }).join("");
  $("#mealDayLabel").textContent = `${dayShortNames[weekday]} / ${profile.goal === "fatloss" ? "FAT LOSS DAY" : "TRAINING DAY"}`; $("#mealDayTitle").textContent = `${selected.getMonth() + 1} 月 ${selected.getDate()} 日 · ${dayNames[weekday]}菜单`; $("#mealDayNote").textContent = profile.goal === "fatloss" ? "用高蛋白和高体积食物控制饱腹感，让热量缺口变得更好坚持。" : "训练前后优先安排碳水与蛋白质，给今天的训练提供可用能量。";
  const eaten = eatenMeals[selectedMealDate] || [];
  $("#mealGrid").innerHTML = dayMeals.map((meal, index) => { const isHigh = meal.tags.some((tag) => tag.includes("蛋白")); const isQuick = meal.tags.some((tag) => tag.includes("分钟")); const hidden = mealFilter === "high" && !isHigh || mealFilter === "quick" && !isQuick; return `<article class="meal-card ${eaten.includes(index) ? "eaten" : ""} ${hidden ? "hidden" : ""}"><img class="meal-card-image" src="${meal.image}" alt="${meal.title}" loading="lazy" /><div class="meal-card-body"><span class="meal-time">${meal.time} / ${index === 0 ? "BREAKFAST" : index === 1 ? "LUNCH" : index === 2 ? "PREP" : "DINNER"}</span><h3>${meal.title}</h3><p>${meal.detail}</p><div class="meal-tags">${meal.tags.map((tag) => `<span class="meal-tag">${tag}</span>`).join("")}</div></div><span class="meal-kcal">${meal.kcal} kcal</span><button class="meal-check" type="button" data-meal-check="${index}" title="标记已完成">${eaten.includes(index) ? "✓" : "○"}</button></article>`; }).join("");
}
function renderProgress() {
  const schedule = buildSchedule(); const weekDone = schedule.filter((item) => checkins.includes(dateKey(item.date))).length; const total = checkins.length; const score = Math.min(weekDone * 14 + total, 100); const next = total < 3 ? 3 - total : total < 7 ? 7 - total : total < 14 ? 14 - total : 0;
  $("#progressRingValue").textContent = `${Math.round(weekDone / 7 * 100)}%`; $("#consistencyScore").textContent = score; $("#scoreTrack").style.width = `${score}%`; $("#totalCheckins").textContent = total; $("#progressMessage").textContent = total ? `你已经把 ${total} 天写进自己的节奏里。` : "第一笔记录，会让这张图开始有颜色。"; $("#nextMilestone").textContent = next; $("#milestoneMessage").textContent = next ? `再完成 ${next} 天，解锁下一个里程碑。` : "你已经完成当前阶段的全部里程碑。";
  const keys = Array.from({ length: 28 }, (_, index) => dateKey(new Date(Date.now() - (27 - index) * 86400000))); $("#checkinHeatmap").innerHTML = keys.map((key) => `<i class="heat-cell ${checkins.includes(key) ? "level-2" : ""}"></i>`).join("");
  $("#barChart").innerHTML = Array.from({ length: 7 }, (_, index) => { const date = new Date(Date.now() - (6 - index) * 86400000); const key = dateKey(date); const value = checkins.includes(key) ? 82 : index === 6 ? 28 : 8 + (index * 7) % 35; return `<div class="chart-column"><div class="chart-bar-wrap"><i class="chart-bar ${index === 6 ? "today" : ""}" style="height:${value}%"></i></div><span>${["一", "二", "三", "四", "五", "六", "日"][date.getDay() === 0 ? 6 : date.getDay() - 1]}</span></div>`; }).join("");
  const achievements = [{ icon: "↗", title: "启动者", note: "第一次完成一笔打卡", unlocked: total >= 1 }, { icon: "✦", title: "连续出现", note: "连续 3 天保持节奏", unlocked: getStreak() >= 3 }, { icon: "◎", title: "一周成形", note: "累计完成 7 天", unlocked: total >= 7 }, { icon: "◒", title: "长期主义", note: "累计完成 14 天", unlocked: total >= 14 }];
  $("#achievementList").innerHTML = achievements.map((item) => `<div class="achievement ${item.unlocked ? "" : "locked"}"><span class="achievement-icon">${item.icon}</span><div><strong>${item.title}</strong><small>${item.note}</small></div><span>${item.unlocked ? "UNLOCKED" : "LOCKED"}</span></div>`).join("");
}
function renderAll() { renderProfile(); renderDate(); renderDashboard(); renderWorkout(); renderNutrition(); renderProgress(); }
function showToast(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400); }
function closeSidebar() { $("#sidebar").classList.remove("open"); $("#modalBackdrop").classList.remove("show"); }

document.addEventListener("click", (event) => {
  const viewTrigger = event.target.closest("[data-view]"); if (viewTrigger) renderNav(viewTrigger.dataset.view);
  const dayTrigger = event.target.closest("[data-day-index]"); if (dayTrigger) { selectedDayIndex = Number(dayTrigger.dataset.dayIndex); renderDashboard(); renderWorkout(); }
  const mealDateTrigger = event.target.closest("[data-meal-date]"); if (mealDateTrigger) { selectedMealDate = mealDateTrigger.dataset.mealDate; renderNutrition(); }
  const mealCheck = event.target.closest("[data-meal-check]"); if (mealCheck) { const index = Number(mealCheck.dataset.mealCheck); const selected = eatenMeals[selectedMealDate] || []; eatenMeals[selectedMealDate] = selected.includes(index) ? selected.filter((item) => item !== index) : [...selected, index]; saveJson(MEAL_KEY, eatenMeals); renderNutrition(); showToast(selected.includes(index) ? "已取消这餐的完成标记。" : "这餐已记录，继续保持。"); }
  const exerciseItem = event.target.closest("[data-exercise-index]"); if (exerciseItem) { const schedule = buildSchedule(); const key = dateKey(schedule[selectedDayIndex].date); const list = completedExercises[key] || []; const index = Number(exerciseItem.dataset.exerciseIndex); completedExercises[key] = list.includes(index) ? list.filter((item) => item !== index) : [...list, index]; saveJson(EXERCISE_KEY, completedExercises); renderDashboard(); renderWorkout(); renderProgress(); showToast(list.includes(index) ? "已取消动作完成状态。" : "动作完成，漂亮。"); }
  if (event.target.closest("#shuffleMeals")) { const key = `shuffle:${profile.goal}:${selectedMealDate}`; eatenMeals[key] = (eatenMeals[key] || 0) + 1; saveJson(MEAL_KEY, eatenMeals); renderNutrition(); showToast("菜单已换新，今天也可以吃得有期待。"); }
  const filter = event.target.closest("[data-meal-filter]"); if (filter) { mealFilter = filter.dataset.mealFilter; $$(".filter-button").forEach((button) => button.classList.toggle("active", button.dataset.mealFilter === mealFilter)); renderNutrition(); }
  if (event.target.closest("#quoteQuickButton")) { quoteIndex = (quoteIndex + 1) % quotes.length; $("#sidebarQuote").textContent = quotes[quoteIndex]; showToast("换一句，把注意力带回今天。"); }
});

function renderNav(view) { const titles = { dashboard: "今日总览", workout: "训练计划", nutrition: "营养食谱", progress: "我的进度", profile: "我的档案" }; $$(".nav-item, .mobile-nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view)); $$("[data-view-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.viewPanel === view)); $("#breadcrumbTitle").textContent = titles[view]; window.scrollTo({ top: 0, behavior: "smooth" }); closeSidebar(); }
$("#menuToggle").addEventListener("click", () => { $("#sidebar").classList.add("open"); $("#modalBackdrop").classList.add("show"); });
$("#sidebarClose").addEventListener("click", closeSidebar); $("#modalBackdrop").addEventListener("click", closeSidebar);
$("#profileForm").addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); profile = { goal: data.get("goal"), experience: data.get("experience"), days: Number(data.get("days")), duration: Number(data.get("duration")), equipment: data.get("equipment"), age: Number(data.get("age")), height: Number(data.get("height")), weight: Number(data.get("weight")), sex: data.get("sex") }; saveJson(PROFILE_KEY, profile); selectedDayIndex = todayIndex(); renderAll(); renderNav("dashboard"); showToast("档案已更新，新的计划已经生成。"); });
renderAll(); renderNav("dashboard");
