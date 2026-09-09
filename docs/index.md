---
layout: home

hero:
  name: Redmi AX6000
  text: OpenWrt 刷机指南
  tagline: 从小米原厂系统到 OpenWrt，按检查点逐步执行。
  actions:
    - theme: brand
      text: 开始刷机
      link: /guide/00-start
    - theme: alt
      text: 故障与恢复
      link: /guide/99-recovery

features:
  - title: 每步独立
    details: 一页只处理一个阶段，避免长教程上下跳转。
  - title: 强制检查点
    details: 每个高风险步骤前后都有停止条件与验证项。
  - title: 不猜分区
    details: 涉及 MTD/UBI 写入时，以当前设备实际输出为准，不照抄固定编号。
---

::: danger 重要
任何写入 Flash 的命令都必须在完成原厂分区备份、核对当前启动分区之后执行。
:::
