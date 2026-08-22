# FORGE / Personal Fitness OS

一个面向健身与减脂人群的个性化训练、饮食、打卡与激励网页。

## 功能

- 通过目标、训练经验、每周频率、单次时长、器械条件与身体数据生成计划
- 生成每周抗阻训练、有氧训练和主动恢复安排
- 展示每个训练日的动作、组数、次数、时长和休息建议
- 根据目标和体重生成蛋白质范围、能量估算起点和训练日/休息日食谱
- 本地保存连续打卡天数、周打卡进度和激励语录
- 无需后端，适合直接部署到 GitHub Pages

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
