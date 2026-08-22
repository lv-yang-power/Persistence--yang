const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const STORE_KEY = "forge-local-v4";
const quotes = ["你不需要等到有动力，先完成一个热身组。", "强度会波动，但你可以把出现这件事变成习惯。", "慢一点没有关系，停下来才会让距离归零。", "今天不追求完美，只完成下一步。", "动作做稳，呼吸做深，剩下的交给重复。"];
const dayNames = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const dayShort = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const recipeCategories = {
  dining: {
    label: "食堂版",
    recipes: [
      { meal: "早餐", name: "煮鸡蛋 + 全麦馒头 + 豆浆", detail: "煮鸡蛋 2 个 + 全麦馒头 1 个 + 豆浆 1 杯", cost: 6, difficulty: 1, minutes: 5, ingredients: ["鸡蛋 2 个", "全麦馒头 1 个", "豆浆 1 杯"] },
      { meal: "午餐", name: "米饭卤鸡腿时蔬", detail: "米饭 1 份 + 卤鸡腿 1 个 + 炒时蔬 1 份", cost: 15, difficulty: 1, minutes: 5, ingredients: ["米饭 1 份", "卤鸡腿 1 个", "炒时蔬 1 份"] },
      { meal: "晚餐", name: "杂粮粥茶叶蛋黄瓜", detail: "杂粮粥 1 碗 + 茶叶蛋 2 个 + 凉拌黄瓜", cost: 9, difficulty: 1, minutes: 5, ingredients: ["杂粮粥 1 碗", "茶叶蛋 2 个", "凉拌黄瓜 1 份"] },
    ],
  },
  dorm: {
    label: "宿舍版",
    recipes: [
      { meal: "早餐", name: "燕麦牛奶香蕉", detail: "燕麦片 30g + 牛奶 200ml + 香蕉 1 根", cost: 7, difficulty: 2, minutes: 5, ingredients: ["燕麦片 30g", "牛奶 200ml", "香蕉 1 根"] },
      { meal: "午餐", name: "金枪鱼全麦生菜", detail: "金枪鱼罐头 1 罐 + 全麦面包 2 片 + 生菜", cost: 13, difficulty: 2, minutes: 8, ingredients: ["金枪鱼罐头 1 罐", "全麦面包 2 片", "生菜 1 份"] },
      { meal: "晚餐", name: "番茄鸡蛋荞麦面", detail: "鸡蛋 2 个 + 西红柿 1 个 + 荞麦面 50g，一锅煮", cost: 10, difficulty: 2, minutes: 15, ingredients: ["鸡蛋 2 个", "西红柿 1 个", "荞麦面 50g"] },
    ],
  },
  prep: {
    label: "备餐版",
    recipes: [
      { meal: "主食", name: "蔬菜蛋炒饭", detail: "米饭 200g + 鸡蛋 3 个 + 冷冻蔬菜 100g", cost: 9, difficulty: 3, minutes: 20, ingredients: ["米饭 200g", "鸡蛋 3 个", "冷冻蔬菜 100g"] },
      { meal: "蛋白", name: "鸡胸肉分装", detail: "鸡胸肉 500g 一次性烤好，分 3–4 天吃", cost: 28, difficulty: 3, minutes: 45, ingredients: ["鸡胸肉 500g", "黑胡椒", "橄榄油"] },
      { meal: "搭配", name: "周末蔬菜盒", detail: "西兰花、玉米、胡萝卜提前焯熟，按份装盒", cost: 18, difficulty: 3, minutes: 25, ingredients: ["西兰花 300g", "玉米 2 根", "胡萝卜 2 根"] },
    ],
  },
};
const exerciseLibrary = {
  home: { push: ["俯卧撑", "跪姿俯卧撑", "椅上臂屈伸"], pull: ["毛巾等长划船", "俯卧超人", "反向雪天使"], legs: ["自重深蹲", "反向弓步", "臀桥"], core: ["死虫式", "平板支撑", "鸟狗式"] },
  basic: { push: ["哑铃地板卧推", "哑铃肩推", "上斜俯卧撑"], pull: ["单臂哑铃划船", "弹力带下拉", "哑铃反向飞鸟"], legs: ["高脚杯深蹲", "哑铃罗马尼亚硬拉", "保加利亚分腿蹲"], core: ["死虫式", "侧桥", "哑铃农夫走"] },
  gym: { push: ["杠铃卧推", "坐姿器械推胸", "绳索夹胸"], pull: ["高位下拉", "坐姿划船", "面拉"], legs: ["杠铃深蹲", "罗马尼亚硬拉", "腿举"], core: ["绳索卷腹", "悬垂举膝", "侧桥"] },
};
const achievements = [
  ["sparkles", "第一步", "完成第一次训练", (s) => s.workoutLogs.length >= 1],
  ["check", "连续出现", "连续 3 天打卡", (s) => getStreak(s) >= 3],
  ["calendar", "一周成形", "一周内完成 4 天", (s) => weekCheckins(s) >= 4],
  ["dumbbell", "容量启动", "累计容量超过 1,000kg", (s) => totalVolume(s) >= 1000],
  ["timer", "完整一课", "单次完成 10 组", (s) => s.workoutLogs.some((x) => x.totalSets >= 10)],
  ["scale", "认真记录", "记录 3 次体重", (s) => s.bodyRecords.length >= 3],
  ["ruler", "观察者", "记录 3 次体围", (s) => s.bodyRecords.filter((x) => x.waist || x.hip).length >= 3],
  ["utensils", "餐桌计划", "完成 5 个食谱标记", (s) => Object.values(s.mealLogs).flat().length >= 5],
  ["shopping", "采购完成", "完成一份采购清单", (s) => Object.values(s.shoppingDone).some((x) => x.length >= 3)],
  ["share", "分享能量", "生成一张分享卡片", (s) => s.shareCount >= 1],
  ["users", "友谊赛", "完成一次本周 PK 查看", (s) => s.pkViews >= 1],
  ["trophy", "长期主义", "累计完成 14 天", (s) => s.checkins.length >= 14],
];
const defaultState = {
  profile: { goal: "strength", experience: "new", days: 4, duration: 45, equipment: "basic", age: 28, height: 170, weight: 65, sex: "female" },
  theme: "default",
  category: "dining",
  selectedDate: null,
  checkins: [],
  workoutLogs: [],
  bodyRecords: [],
  mealLogs: {},
  shoppingDone: {},
  swaps: {},
  shareCount: 0,
  pkViews: 0,
  reminders: { training: true, meal: true, nudge: true, lastSent: {} },
};
let state = loadState();
let selectedDayIndex = todayIndex();
let selectedWorkout = null;
let training = null;
let trainingTicker = null;
let restTicker = null;
let installPrompt = null;
let quoteIndex = 0;

function loadState() {
  try { return { ...defaultState, ...JSON.parse(localStorage.getItem(STORE_KEY)) }; } catch { return structuredClone(defaultState); }
}
function saveState() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); updateSyncStatus(); }
function updateSyncStatus() { const el = $("#syncStatus"); if (el) el.textContent = "LOCAL SYNC"; }
function dateKey(date = new Date()) { const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); }
function dateFromKey(key) { const [year, month, day] = key.split("-").map(Number); return new Date(year, month - 1, day); }
function todayIndex() { return (new Date().getDay() + 6) % 7; }
function mondayOf(date = new Date()) { const copy = new Date(date); const day = copy.getDay() || 7; copy.setDate(copy.getDate() - day + 1); copy.setHours(0, 0, 0, 0); return copy; }
function formatNumber(value) { return Math.round(value || 0).toLocaleString("zh-CN"); }
function goalLabel() { return state.profile.goal === "fatloss" ? "减脂 / 变轻盈" : "增肌 / 变强"; }
function targetProtein() { const weight = state.profile.weight || 65; return `${formatNumber(weight * 1.4)}–${formatNumber(weight * 2)}g`; }
function icon(name) { return `<svg class="icon"><use href="#i-${name}"></use></svg>`; }
function showToast(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400); }
function closeSidebar() { $("#sidebar").classList.remove("open"); }

function buildExercise(name, detail, rest = "60–90 秒") { return { name, detail, rest }; }
function strengthSession(type, index = 0) {
  const lib = exerciseLibrary[state.profile.equipment]; const sets = state.profile.experience === "new" ? 2 : 3; const reps = state.profile.experience === "new" ? "8–12 次" : "8–10 次";
  const groups = {
    upper: [buildExercise(lib.push[index % 2], `${sets} 组 × ${reps}`), buildExercise(lib.pull[index % 2], `${sets} 组 × ${reps}`), buildExercise(lib.push[2], `${sets} 组 × 10–12 次`), buildExercise(lib.pull[2], `${sets} 组 × 12–15 次`), buildExercise(lib.core[0], `${sets} 组 × 10–12 次/侧`)],
    lower: [buildExercise(lib.legs[0], `${sets} 组 × ${reps}`), buildExercise(lib.legs[1], `${sets} 组 × 8–10 次`), buildExercise(lib.legs[2], `${sets} 组 × 8–10 次/侧`), buildExercise("站姿提踵", `${sets} 组 × 12–15 次`), buildExercise(lib.core[1], `${sets} 组 × 30–45 秒`)],
    full: [buildExercise(lib.legs[0], `${sets} 组 × ${reps}`), buildExercise(lib.push[0], `${sets} 组 × ${reps}`), buildExercise(lib.pull[0], `${sets} 组 × ${reps}`), buildExercise(lib.legs[2], `${sets} 组 × 10–12 次`), buildExercise(lib.core[1], `${sets} 组 × 30–45 秒`)],
    push: [buildExercise(lib.push[0], `${sets} 组 × ${reps}`), buildExercise(lib.push[1], `${sets} 组 × ${reps}`), buildExercise(lib.push[2], `${sets} 组 × 10–12 次`), buildExercise("哑铃侧平举", `${sets} 组 × 12–15 次`), buildExercise(lib.core[0], `${sets} 组 × 10–12 次`)],
    pull: [buildExercise(lib.pull[0], `${sets} 组 × ${reps}`), buildExercise(lib.pull[1], `${sets} 组 × ${reps}`), buildExercise(lib.pull[2], `${sets} 组 × 12–15 次`), buildExercise("哑铃弯举", `${sets} 组 × 10–12 次`), buildExercise(lib.core[2], `${sets} 组 × 30–45 秒`)],
  };
  const titles = { upper: "上肢力量", lower: "下肢力量", full: "全身力量", push: "推训练", pull: "拉训练" };
  return { type: "strength", title: titles[type], duration: state.profile.duration, subtitle: `${sets} 组为主 · 保留 2–3 次余力`, exercises: groups[type] };
}
function cardioSession() { return { type: "cardio", title: "中等强度有氧", duration: 30, subtitle: "保持能说完整句子的节奏", exercises: [buildExercise("热身", "5 分钟", "逐步提速"), buildExercise("稳定有氧", "20 分钟", "谈话测试强度"), buildExercise("冷身", "5 分钟", "逐步降速")] }; }
function recoverySession() { return { type: "recovery", title: "主动恢复", duration: 20, subtitle: "轻松走动与关节活动", exercises: [buildExercise("轻松步行", "15 分钟", "能轻松对话"), buildExercise("关节活动", "5 分钟", "肩、髋、踝各 30 秒")] }; }
function buildSchedule() {
  const days = state.profile.days; const schedule = Array.from({ length: 7 }, (_, index) => ({ index, day: dayNames[index], short: dayShort[index], date: new Date(mondayOf().getTime() + index * 86400000), session: recoverySession() }));
  const types = days === 3 ? ["full", "full", "full"] : days === 4 ? ["upper", "lower", "upper", "lower"] : ["push", "pull", "lower", "upper", "lower"];
  const map = days === 3 ? [0, 2, 4] : days === 4 ? [0, 1, 3, 5] : [0, 1, 2, 3, 5];
  map.forEach((day, i) => { schedule[day].session = strengthSession(types[i], i); });
  if (state.profile.goal === "fatloss") schedule[2].session = cardioSession();
  if (state.profile.goal === "strength" && days >= 4) schedule[2].session = cardioSession();
  return schedule;
}
function nutritionEstimate() {
  const p = state.profile; const bmr = p.sex === "male" ? 10 * p.weight + 6.25 * p.height - 5 * p.age + 5 : 10 * p.weight + 6.25 * p.height - 5 * p.age - 161; const base = bmr * (1.38 + (p.days - 3) * .05);
  return { calories: Math.max(1400, base + (p.goal === "fatloss" ? -350 : 220)), protein: targetProtein() };
}
function weekCheckins(s = state) { const schedule = buildSchedule(); return schedule.filter((x) => s.checkins.includes(dateKey(x.date))).length; }
function getStreak(s = state) { let count = 0; const cursor = new Date(); while (s.checkins.includes(dateKey(cursor))) { count += 1; cursor.setDate(cursor.getDate() - 1); } return count; }
function totalVolume(s = state) { return s.workoutLogs.reduce((sum, log) => sum + (log.totalVolume || 0), 0); }
function latestLog() { return state.workoutLogs[state.workoutLogs.length - 1]; }

function navigate(view) {
  const titles = { dashboard: "今日总览", workout: "训练计划", nutrition: "营养食谱", progress: "我的进度", social: "社交与 PK", settings: "主题与提醒" };
  $$(".nav-item, .mobile-nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  $$("[data-view-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.viewPanel === view));
  $("#breadcrumbTitle").textContent = titles[view]; closeSidebar(); window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderProfile() {
  $("#profileAvatar").textContent = state.profile.goal === "fatloss" ? "↘" : "↗";
  $("#sidebarGoal").textContent = goalLabel();
}
function renderDashboard() {
  const schedule = buildSchedule(); const today = schedule[todayIndex()]; const nutrition = nutritionEstimate(); const streak = getStreak(); const checkins = weekCheckins(); const last = latestLog();
  $("#streakCount").textContent = streak; $("#streakBar").style.width = `${Math.min(streak / 7 * 100, 100)}%`; $("#streakText").textContent = streak ? `已经连续出现 ${streak} 天。` : "今天的第一步还在等你。";
  $("#dashSessionName").textContent = today.session.title; $("#dashSessionMeta").textContent = `${today.session.duration} 分钟 · ${today.session.subtitle}`; $("#dashTitle").textContent = `今天，${today.session.title}。`; $("#dashSubtitle").textContent = today.session.subtitle; $("#dashDuration").innerHTML = `${today.session.duration}<small> min</small>`; $("#dashGoal").textContent = today.session.type === "strength" ? "力量" : today.session.type === "cardio" ? "有氧" : "恢复";
  $("#dashCheckins").innerHTML = `${checkins}<span> / 7</span>`; $("#dashProtein").innerHTML = `${nutrition.protein.replace("g", "")}<span> G</span>`; $("#dashCalories").innerHTML = `${formatNumber(nutrition.calories)}<span> KCAL</span>`; $("#dashVolume").innerHTML = `${formatNumber(last?.totalVolume || 0)}<span> KG</span>`; $("#proteinLine").style.width = `${Math.min((state.profile.weight * 2) / 180 * 100, 100)}%`; $("#volumeLine").style.width = `${Math.min((last?.totalVolume || 0) / 3000 * 100, 100)}%`; $("#dashCommandState").textContent = state.checkins.includes(dateKey(today.date)) ? "DONE" : "READY";
  $("#weekStrip").innerHTML = schedule.map((item) => { const done = state.checkins.includes(dateKey(item.date)); return `<button class="week-card ${item.index === selectedDayIndex ? "selected" : ""} ${item.index === todayIndex() ? "today" : ""} ${done ? "done" : ""}" data-day-index="${item.index}" type="button"><span class="week-card-day">${item.short}</span><strong class="week-card-date">${item.date.getDate()}</strong><strong>${item.session.title}</strong><small>${item.session.duration} min</small><i class="week-card-check"></i></button>`; }).join("");
  const reminders = []; if (state.reminders.training && !state.checkins.includes(dateKey(today.date))) reminders.push(`${icon("dumbbell")}<span><strong>训练提醒</strong> 今天安排了 ${today.session.title}。</span>`); if (state.reminders.meal) reminders.push(`${icon("utensils")}<span><strong>餐前提醒</strong> 打开营养页查看今日菜单。</span>`); if (state.reminders.nudge && getStreak() === 0 && state.checkins.length > 2) reminders.push(`${icon("sparkles")}<span><strong>给你一点鼓励</strong> 连续 3 天未出现也不代表失败。</span>`); $("#reminderList").innerHTML = reminders.map((text) => `<div class="reminder-item">${text}</div>`).join("") || `<div class="reminder-item">${icon("check")}<span><strong>今天很清爽</strong> 当前没有待处理提醒。</span></div>`;
}

function renderWorkout() {
  const schedule = buildSchedule(); const selected = schedule[selectedDayIndex]; selectedWorkout = selected; const logged = state.workoutLogs.find((x) => x.date === dateKey(selected.date)); const done = Boolean(logged || state.checkins.includes(dateKey(selected.date))); const weekDone = weekCheckins();
  $("#workoutWeekCount").textContent = `${weekDone} / 7`; $("#dayList").innerHTML = schedule.map((item) => { const itemDone = state.checkins.includes(dateKey(item.date)); return `<button class="day-card ${item.index === selectedDayIndex ? "active" : ""} ${item.index === todayIndex() ? "today" : ""}" type="button" data-day-index="${item.index}"><span class="day-number">${String(item.index + 1).padStart(2, "0")}</span><span class="day-title"><strong>${item.day} · ${item.session.title}</strong><small>${itemDone ? "已完成 · 点击查看记录" : item.session.subtitle}</small></span><span class="day-time">${item.session.duration}′</span></button>`; }).join("");
  const sets = logged?.totalSets || 0; const volume = logged?.totalVolume || 0; const max = logged?.maxWeight || 0;
  $("#workoutDetail").innerHTML = `<div class="detail-header"><div><span class="label-mono">${selected.short} / ${selected.session.type.toUpperCase()}</span><h2>${selected.session.title}</h2><p>${selected.session.subtitle}</p></div><div class="detail-progress"><strong>${done ? "100%" : "0%"}</strong><small>${done ? "COMPLETED" : "READY"}</small></div></div><div class="exercise-summary"><div><span>总组数</span><strong>${sets}</strong></div><div><span>总容量</span><strong>${formatNumber(volume)}kg</strong></div><div><span>最大重量</span><strong>${max}kg</strong></div></div><div class="exercise-preview">${selected.session.exercises.map((item, index) => `<div class="exercise-preview-row">${icon(selected.session.type === "cardio" ? "timer" : "dumbbell")}<strong>${index + 1}. ${item.name}</strong><small>${item.detail}</small></div>`).join("")}</div><button class="button button-primary button-block start-training" id="startTraining" type="button">${done ? icon("refresh") + "再次训练" : icon("play") + "开始训练"}</button>`;
  $("#trainingLive").innerHTML = training ? `<div class="training-live-inner"><div class="training-live-meta"><span>训练正在进行</span><span id="inlineTrainingTimer">00:00</span></div><h3>训练计时器已打开</h3><p>在弹窗中记录每组重量、次数，休息倒计时会自动开始。</p><button class="button button-primary" id="resumeTraining" type="button">${icon("timer")}打开计时器</button></div>` : "";
}
function startTraining() {
  const session = selectedWorkout.session; training = { date: dateKey(selectedWorkout.date), session, startedAt: Date.now(), paused: false, elapsedBeforePause: 0, exerciseSets: session.exercises.map(() => []), restLeft: 0 };
  $("#trainingModal").classList.remove("hidden"); renderTrainingModal(); clearInterval(trainingTicker); trainingTicker = setInterval(updateTrainingClock, 1000); updateTrainingClock(); showToast("训练开始，先完成热身。");
}
function updateTrainingClock() {
  if (!training || training.paused) return; const seconds = Math.floor((Date.now() - training.startedAt) / 1000) + training.elapsedBeforePause; $("#sessionTimer").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; if (training.restLeft > 0) { training.restLeft -= 1; $("#restTimerText").textContent = `组间休息 ${training.restLeft}s`; } else $("#restTimerText").textContent = "下一组，按自己的节奏";
}
function renderTrainingModal() {
  if (!training) return; $("#trainingModalTitle").textContent = training.session.title; $("#trainingExercises").innerHTML = training.session.exercises.map((item, index) => { const sets = training.exerciseSets[index] || []; return `<div class="live-exercise"><div><strong>${index + 1}. ${item.name}</strong><small>${item.detail} · 休息 ${item.rest}</small></div><input class="set-weight" data-exercise="${index}" type="number" min="0" step="0.5" placeholder="重量 kg" /><input class="set-reps" data-exercise="${index}" type="number" min="1" step="1" placeholder="次数" /><button class="button button-primary record-set" data-record-set="${index}" type="button">${icon("check")}完成一组</button><span class="set-count">${sets.length} 组 · ${formatNumber(sets.reduce((sum, x) => sum + x.weight * x.reps, 0))}kg</span></div>`; }).join("");
}
function recordSet(index, row) {
  const weight = Number(row.querySelector(".set-weight").value || 0); const reps = Number(row.querySelector(".set-reps").value || 0); if (!reps) { showToast("请先填写次数。"); row.classList.add("shake"); setTimeout(() => row.classList.remove("shake"), 400); return; } training.exerciseSets[index].push({ weight, reps }); training.restLeft = 60; renderTrainingModal(); showToast(`第 ${training.exerciseSets[index].length} 组已记录。`);
}
function finishTraining() {
  if (!training) return; const totalSets = training.exerciseSets.reduce((sum, sets) => sum + sets.length, 0); const totalVolumeValue = training.exerciseSets.flat().reduce((sum, set) => sum + set.weight * set.reps, 0); const maxWeight = Math.max(0, ...training.exerciseSets.flat().map((set) => set.weight)); const seconds = Math.floor((Date.now() - training.startedAt) / 1000) + training.elapsedBeforePause; const log = { date: training.date, title: training.session.title, duration: Math.max(1, Math.round(seconds / 60)), totalSets, totalVolume: totalVolumeValue, maxWeight, exerciseSets: training.exerciseSets };
  state.workoutLogs = [...state.workoutLogs.filter((item) => item.date !== training.date), log]; state.checkins = [...new Set([...state.checkins, training.date])]; saveState(); training = null; clearInterval(trainingTicker); $("#trainingModal").classList.add("hidden"); showSummary(log); renderAll(); showToast("训练完成，今天的记录已经保存。");
}
function showSummary(log) { $("#summaryStats").innerHTML = [["总时长", `${log.duration} min`], ["总组数", `${log.totalSets} 组`], ["最大重量", `${log.maxWeight} kg`], ["总容量", `${formatNumber(log.totalVolume)} kg`]].map(([label, value]) => `<div class="summary-stat"><strong>${value}</strong><small>${label}</small></div>`).join(""); $("#summaryModal").classList.remove("hidden"); }

function currentRecipes() {
  const category = recipeCategories[state.category]; const swaps = state.swaps[state.selectedDate || dateKey()] || {};
  return category.recipes.map((recipe) => ({ ...recipe, detail: Object.entries(swaps).reduce((text, [from, to]) => text.replaceAll(from, to), recipe.detail), ingredients: recipe.ingredients.map((item) => Object.entries(swaps).reduce((text, [from, to]) => text.replaceAll(from, to), item)) }));
}
function renderNutrition() {
  const selectedDate = state.selectedDate || dateKey(); const nutrition = nutritionEstimate(); $("#nutritionTarget").textContent = nutrition.protein; $("#nutritionCalories").textContent = formatNumber(nutrition.calories); $$(".nutrition-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.recipeCategory === state.category));
  const monday = mondayOf(); $("#nutritionDates").innerHTML = Array.from({ length: 7 }, (_, index) => { const date = new Date(monday.getTime() + index * 86400000); const key = dateKey(date); return `<button class="date-pill ${key === selectedDate ? "active" : ""}" type="button" data-nutrition-date="${key}">${dayShort[index]}<strong>${date.getDate()}</strong></button>`; }).join("");
  const recipes = currentRecipes(); $("#recipeGrid").innerHTML = recipes.map((recipe, index) => `<article class="recipe-card"><div class="recipe-card-top"><span class="meal-label">${recipe.meal}</span><span class="label-mono">0${index + 1}</span></div><h3>${recipe.name}</h3><p>${recipe.detail}</p><div class="recipe-meta"><span>¥${recipe.cost} 预估</span><span>${"⭐".repeat(recipe.difficulty)}</span><span>${recipe.minutes} 分钟</span></div><p class="recipe-note">${recipe.ingredients.join(" · ")}</p></article>`).join("");
  const items = recipes.flatMap((recipe) => recipe.ingredients); const done = state.shoppingDone[selectedDate] || []; $("#shoppingList").innerHTML = items.map((item, index) => `<label class="shopping-item ${done.includes(index) ? "done" : ""}"><input type="checkbox" data-shopping-index="${index}" ${done.includes(index) ? "checked" : ""} /><span>${item}</span></label>`).join(""); $("#shoppingProgress").textContent = `${done.length} / ${items.length} 已准备`;
}

function renderProgress() {
  const records = [...state.bodyRecords].sort((a, b) => a.date.localeCompare(b.date)); $("#recordCount").textContent = records.length; const latest = records.at(-1); const previous = records.at(-2); $("#weightTrend").textContent = latest ? `${latest.weight} kg` : "—"; $("#weightTrendNote").textContent = latest && previous ? `${(latest.weight - previous.weight).toFixed(1)} kg 相比上一条记录` : "添加两条记录后显示变化";
  if (!records.length) $("#trendChart").innerHTML = `<div class="empty-state">${icon("scale")}添加体重记录后，这里会生成趋势图。</div>`; else { const values = records.slice(-10); const min = Math.min(...values.map((x) => x.weight)); const max = Math.max(...values.map((x) => x.weight)); const range = Math.max(1, max - min); const points = values.map((x, index) => `${(index / Math.max(1, values.length - 1)) * 96 + 2},${92 - ((x.weight - min) / range) * 72}`).join(" "); $("#trendChart").innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--coral)" stop-opacity=".45"/><stop offset="1" stop-color="var(--coral)" stop-opacity="0"/></linearGradient></defs><polygon class="trend-area" points="2,100 ${points} 98,100"></polygon><polyline class="trend-line" points="${points}"></polyline>${values.map((x, index) => { const point = points.split(" ")[index].split(","); return `<circle cx="${point[0]}" cy="${point[1]}" r="1.5"></circle>`; }).join("")}</svg>`; }
  const today = new Date(); $("#historyCalendar").innerHTML = Array.from({ length: 28 }, (_, index) => { const date = new Date(today.getTime() - (27 - index) * 86400000); const key = dateKey(date); const log = state.workoutLogs.find((item) => item.date === key); return `<div class="history-day ${log ? "done" : ""} ${key === dateKey() ? "today" : ""}"><span>${date.getDate()}</span>${log ? `<small>${log.title}</small>` : ""}</div>`; }).join("");
  const unlocked = achievements.filter((item) => item[3](state)).length; $("#achievementCount").textContent = `${unlocked} / ${achievements.length}`; $("#achievementGrid").innerHTML = achievements.map(([iconName, title, note, predicate]) => `<article class="achievement-card ${predicate(state) ? "" : "locked"}">${icon(iconName)}<strong>${title}</strong><small>${note}</small></article>`).join("");
}

function renderSocial() {
  const latest = latestLog(); const streak = getStreak(); $("#shareDate").textContent = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase(); $("#shareHeadline").textContent = latest ? `完成了 ${latest.title}` : "今天完成了训练"; $("#shareStats").textContent = `${latest?.totalSets || 0} 组 · ${formatNumber(latest?.totalVolume || 0)} kg 总容量 · ${streak} 天连续`;
  const week = weekCheckins(); const friends = [["L", "林同学", 4], ["M", "Mia", 3], ["K", "Kai", 5], ["F", "我", week]]; $("#pkList").innerHTML = friends.sort((a, b) => b[2] - a[2]).map(([avatar, name, score]) => `<div class="pk-row"><span class="pk-avatar">${avatar}</span><div><strong>${name}</strong><small>${score >= 4 ? "节奏很稳" : "继续出现"}</small></div><span class="pk-score">${score} 天</span></div>`).join("");
  const people = [["01", "Mia", "设计学院", 6], ["02", "Kai", "计算机学院", 5], ["03", "林同学", "设计学院", 4], ["04", "我", "本地记录", week], ["05", "Jo", "华东地区", 2]]; $("#leaderboardList").innerHTML = people.sort((a, b) => b[3] - a[3]).map(([rank, name, group, score], index) => `<div class="leaderboard-row"><span class="leaderboard-rank">${String(index + 1).padStart(2, "0")}</span><span class="pk-avatar">${name[0]}</span><div><strong>${name}</strong><small>${group}</small></div><span class="pk-score">${score} 天</span></div>`).join("");
}
function renderSettings() {
  document.documentElement.dataset.theme = state.theme; const names = { default: "默认暗色", campus: "校园晨光", minimal: "极简白" }; $("#themeName").textContent = names[state.theme]; $$(".theme-choice").forEach((button) => button.classList.toggle("active", button.dataset.themeChoice === state.theme)); $$("[data-reminder]").forEach((input) => { input.checked = state.reminders[input.dataset.reminder]; }); $("#notificationDot").style.opacity = typeof Notification !== "undefined" && Notification.permission === "granted" ? "1" : ".45";
}
function renderAll() { renderProfile(); renderDashboard(); renderWorkout(); renderNutrition(); renderProgress(); renderSocial(); renderSettings(); $("#topDate").textContent = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" }).toUpperCase(); }

function applySwap() { const date = state.selectedDate || dateKey(); state.swaps[date] ||= {}; state.swaps[date][$("#swapFrom").value] = $("#swapTo").value; saveState(); renderNutrition(); showToast("食材替换已应用，采购清单同步更新。"); }
function shoppingText() { return currentRecipes().flatMap((recipe) => recipe.ingredients).join("\n"); }
async function copyShopping() { try { await navigator.clipboard.writeText(shoppingText()); showToast("今日采购清单已复制。"); } catch { showToast("当前浏览器不允许自动复制，请手动选择。"); } }
function setTheme(theme) { state.theme = theme; saveState(); renderSettings(); showToast("主题已切换。"); }
function requestNotifications() { if (!("Notification" in window)) return showToast("当前浏览器不支持通知。"); Notification.requestPermission().then((permission) => { renderSettings(); showToast(permission === "granted" ? "浏览器提醒已开启。" : "通知权限未开启。"); }); }
function sendReminder(title, body) { if (typeof Notification !== "undefined" && Notification.permission === "granted") new Notification(title, { body, icon: "icon.svg", tag: "forge-reminder" }); }
function checkReminders() { const now = new Date(); const key = `${dateKey()}-${now.getHours()}-${now.getMinutes()}`; if (state.reminders.training && now.getHours() === 8 && now.getMinutes() === 0 && !state.reminders.lastSent[key]) sendReminder("FORGE 训练提醒", "今天的训练安排已经准备好，先完成热身。"); if (state.reminders.meal && now.getMinutes() === 0 && [11, 17].includes(now.getHours()) && !state.reminders.lastSent[key]) sendReminder("FORGE 餐前提醒", "打开 FORGE 查看今天的食谱和采购清单。"); if (state.reminders.nudge && !state.checkins.includes(dateKey()) && getStreak() === 0 && state.checkins.length > 2 && !state.reminders.lastSent[`nudge-${dateKey()}`]) sendReminder("FORGE 给你的提醒", "已经几天没打卡了，今天只做一个小动作也算回来。"); state.reminders.lastSent[key] = true; saveState(); }
function shareCard() {
  state.shareCount += 1; saveState(); renderProgress(); const latest = latestLog(); const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 630; const ctx = canvas.getContext("2d"); const gradient = ctx.createLinearGradient(0, 0, 1200, 630); gradient.addColorStop(0, "#1a1a2e"); gradient.addColorStop(1, "#16213e"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1200, 630); ctx.fillStyle = "#a8e6cf"; ctx.fillRect(70, 72, 72, 72); ctx.fillStyle = "#101429"; ctx.font = "900 42px Arial"; ctx.fillText("F", 94, 124); ctx.fillStyle = "#ffffff"; ctx.font = "800 56px Arial"; ctx.fillText(latest ? `完成了 ${latest.title}` : "今天完成了训练", 70, 280); ctx.fillStyle = "#a8e6cf"; ctx.font = "500 25px monospace"; ctx.fillText(`${latest?.totalSets || 0} 组   ${formatNumber(latest?.totalVolume || 0)} kg 总容量   ${getStreak()} 天连续`, 70, 340); ctx.fillStyle = "#b39ddb"; ctx.font = "500 18px monospace"; ctx.fillText("FORGE / LOCAL FITNESS OS", 70, 520); canvas.toBlob(async (blob) => { const file = new File([blob], "forge-training-card.png", { type: "image/png" }); if (navigator.share && navigator.canShare?.({ files: [file] })) await navigator.share({ title: "我的 FORGE 训练记录", files: [file] }); else { const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "forge-training-card.png"; link.click(); URL.revokeObjectURL(link.href); } showToast("分享卡片已生成。"); }); }
async function installApp() { if (!installPrompt) return showToast("请从浏览器菜单选择“添加到主屏幕”。"); installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; }
function openSummaryShare() { $("#summaryModal").classList.add("hidden"); shareCard(); }
function resetData() { if (!confirm("确认清除全部本地数据吗？此操作无法恢复。")) return; localStorage.removeItem(STORE_KEY); state = structuredClone(defaultState); renderAll(); showToast("本地数据已清除。"); }

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]"); if (viewButton) navigate(viewButton.dataset.view);
  const dayButton = event.target.closest("[data-day-index]"); if (dayButton) { selectedDayIndex = Number(dayButton.dataset.dayIndex); renderDashboard(); renderWorkout(); }
  const categoryButton = event.target.closest("[data-recipe-category]"); if (categoryButton) { state.category = categoryButton.dataset.recipeCategory; saveState(); renderNutrition(); }
  const dateButton = event.target.closest("[data-nutrition-date]"); if (dateButton) { state.selectedDate = dateButton.dataset.nutritionDate; saveState(); renderNutrition(); }
  if (event.target.closest("#startTraining") || event.target.closest("#resumeTraining")) startTraining();
  const recordButton = event.target.closest("[data-record-set]"); if (recordButton) recordSet(Number(recordButton.dataset.recordSet), recordButton.closest(".live-exercise"));
  if (event.target.closest("#finishTraining")) finishTraining();
  if (event.target.closest("#pauseTraining") && training) { if (training.paused) { training.paused = false; training.startedAt = Date.now(); $("#pauseTraining").innerHTML = `${icon("pause")}暂停`; } else { training.elapsedBeforePause += Math.floor((Date.now() - training.startedAt) / 1000); training.paused = true; $("#pauseTraining").innerHTML = `${icon("play")}继续`; } }
  if (event.target.closest("#closeTraining")) { if (training && confirm("训练仍在进行，确认关闭吗？")) { clearInterval(trainingTicker); $("#trainingModal").classList.add("hidden"); } }
  if (event.target.closest("#closeSummary")) $("#summaryModal").classList.add("hidden");
  if (event.target.closest("#summaryShare") || event.target.closest("#shareCardButton")) shareCard();
  if (event.target.closest("#newQuote")) { quoteIndex = (quoteIndex + 1) % quotes.length; $("#dashQuote").textContent = quotes[quoteIndex]; $("#sideQuote").textContent = quotes[quoteIndex]; }
  if (event.target.closest("#applySwap")) applySwap();
  if (event.target.closest("#copyShopping")) copyShopping();
  if (event.target.closest("#clearShopping")) { state.shoppingDone[state.selectedDate || dateKey()] = []; saveState(); renderNutrition(); }
  if (event.target.closest("[data-theme-choice]")) setTheme(event.target.closest("[data-theme-choice]").dataset.themeChoice);
  if (event.target.closest("#enableNotifications") || event.target.closest("#notificationButton")) requestNotifications();
  if (event.target.closest("#installButton")) installApp();
  if (event.target.closest("#resetData")) resetData();
  if (event.target.closest("#refreshPk")) { state.pkViews += 1; saveState(); renderSocial(); showToast("PK 数据已刷新。"); }
});
document.addEventListener("change", (event) => {
  const reminder = event.target.closest("[data-reminder]"); if (reminder) { state.reminders[reminder.dataset.reminder] = reminder.checked; saveState(); }
  const shopping = event.target.closest("[data-shopping-index]"); if (shopping) { const date = state.selectedDate || dateKey(); const list = state.shoppingDone[date] || []; const index = Number(shopping.dataset.shoppingIndex); state.shoppingDone[date] = shopping.checked ? [...new Set([...list, index])] : list.filter((item) => item !== index); saveState(); renderNutrition(); }
});
$("#menuToggle").addEventListener("click", () => $("#sidebar").classList.add("open"));
$("#sidebarClose").addEventListener("click", closeSidebar);
$("#bodyRecordForm").addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); state.bodyRecords.push({ date: dateKey(), weight: Number(data.get("weight")), waist: Number(data.get("waist") || 0), hip: Number(data.get("hip") || 0) }); state.profile.weight = Number(data.get("weight")); saveState(); event.currentTarget.reset(); renderAll(); showToast("身体记录已保存，趋势图已更新。"); });
window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); installPrompt = event; $("#installHint").textContent = "可以直接安装到当前设备。"; });
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
setInterval(checkReminders, 60000);
renderAll();
navigate("dashboard");
