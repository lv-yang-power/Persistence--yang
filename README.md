# FORGE / Local Fitness OS

一个免费、无需账号、无需服务器数据库的本地健身操作系统。

## 当前版本

- 桌面端侧边栏 + 移动端底部导航
- 训练开始按钮、训练计时器、组间休息倒计时
- 每组重量/次数记录、总容量、最大重量和训练小结
- 周计划完成状态和训练历史日历
- 食堂版、宿舍版、备餐版三类真实可执行食谱
- 每道菜标注成本、操作难度、烹饪时间
- 今日采购清单、完成标记和食材替换
- 体重/腰围/臀围记录与趋势图
- 12 个成就、好友 PK、本地校园排行榜、训练分享卡片
- 默认暗色、校园晨光、极简白三套主题
- 训练日、餐前、连续未打卡提醒
- PWA 安装、Service Worker 离线缓存
- 所有数据保存在当前浏览器 `localStorage`，不会上传

## 本地打开

直接双击 `index.html` 可以浏览页面；要启用完整 PWA 和浏览器通知，请通过本地 HTTP 服务或 GitHub Pages 打开。

## GitHub Pages

将仓库推送到 GitHub 后，在仓库设置中打开 **Settings → Pages**，选择 `Deploy from a branch`，分支选择 `master` 和 `/ (root)`，保存即可。

## 依据

- U.S. Physical Activity Guidelines: 每周 150–300 分钟中等强度有氧，并在每周至少 2 天进行肌力训练
- ACSM 2026 Resistance Training Guidelines Update: 训练频率、组数、渐进负荷和接近力竭的管理原则
- ISSN Position Stand: 对运动人群建议 1.4–2.0 g/kg/天蛋白质
- CDC Healthy Weight Guidance: 采用渐进、稳定的体重管理节奏

该工具面向一般健康成年人提供教育性起点，不替代医生、注册营养师或合格教练的个体化建议。
