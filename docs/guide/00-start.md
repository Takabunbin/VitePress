# 00 · 开始前必读

::: danger 刷机风险
刷写 Bootloader、MTD、UBI 分区时断电、写错分区或使用错误镜像，都可能导致设备无法启动。**没有完成备份前，不进入写盘阶段。**
:::

## 本指南采用的路线

本指南优先采用：

```text
小米原厂系统
→ 调整到可利用的 1.2.8
→ 开启 Telnet / SSH
→ 备份原厂关键分区
→ 保留 stock layout
→ 安装 OpenWrt
```

不把第三方 U-Boot 作为默认路线。

## 你需要准备

- Redmi AX6000 一台
- Windows 电脑一台
- 一根可靠网线
- 稳定电源
- 浏览器
- Windows PowerShell / Terminal
- PuTTY 或 Windows Telnet（用于原厂阶段）
- OpenSSH `ssh/scp`（Windows 10/11 通常自带）

## 开始前检查

- [ ] 机型确认是 **Redmi Router AX6000**，不是 AX6 / AX3000 / Xiaomi AX6000
- [ ] 电脑通过网线连接路由器 LAN 口
- [ ] 刷机过程中不会断电
- [ ] 已知道小米后台管理密码
- [ ] 不在刷写 Flash 时拔线、重启或 Reset

<div class="step-ok">
<strong>完成条件：</strong>以上 5 项全部满足，再进入下一页。
</div>

## 网络地址变化

原厂阶段通常：

```text
192.168.31.1
```

OpenWrt 首次启动通常：

```text
192.168.1.1
```

后续如果与上级路由冲突，可以改成例如：

```text
192.168.100.1
```
