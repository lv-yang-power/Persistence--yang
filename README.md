# FORGE / Personal Fitness OS

一个模块化的健身操作系统，面向健身与减脂人群提供训练、营养、进度和个性化档案工作区。

## 当前版本

- 桌面端侧边栏 + 移动端底部导航，可点击切换五个独立工作区
- 今日总览：当前 streak、今日训练、周计划和关键指标
- 训练计划：按星期切换，逐动作完成，实时显示动作完成百分比
- 营养食谱：一周七套不同菜单，训练/减脂目标两组菜单，支持换一套、按标签筛选、餐次完成标记
- 我的进度：一致性分数、28 天热力图、最近 7 天节奏柱状图、成就徽章
- 我的档案：修改目标、经验、训练频率、时长、器械和身体数据，立即重新生成
- 浏览器 `localStorage` 保存档案、训练完成状态、餐次状态和打卡数据
- 无后端依赖，适合直接部署到 GitHub Pages

## 本地打开

直接双击 `index.html` 即可使用。页面使用浏览器 `localStorage` 保存个人数据。

## GitHub Pages

将仓库推送到 GitHub 后，在仓库设置中打开 **Settings → Pages**，选择 `Deploy from a branch`，分支选择 `master` 和 `/ (root)`，保存即可。

## 依据

- U.S. Physical Activity Guidelines: 每周 150–300 分钟中等强度有氧，并在每周至少 2 天进行肌力训练
- ACSM 2026 Resistance Training Guidelines Update: 训练频率、组数、渐进负荷和接近力竭的管理原则
- ISSN Position Stand: 对运动人群建议 1.4–2.0 g/kg/天蛋白质
- CDC Healthy Weight Guidance: 采用渐进、稳定的体重管理节奏

该工具面向一般健康成年人提供教育性起点，不替代医生、注册营养师或合格教练的个体化建议。
