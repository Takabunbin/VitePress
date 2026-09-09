# 10 · 最终安全审查

本页是对刷机方案的**再审查**，目的不是增加步骤，而是找出致命漏洞、逻辑冲突和远程场景最容易犯的错误。

## 审查结论

### ✅ 路线本身成立

最终路线：

```text
Mac Wi-Fi 负责远控
        │
        └──── Internet

Mac USB-C Ethernet
        │
        └──── AX6000 LAN

Xiaomi OEM 1.2.8
→ 开启 Telnet/SSH
→ 原厂分区备份
→ OpenWrt 官方 stock initramfs
→ OpenWrt 官方 stock sysupgrade
```

这条路线避免了远程环境下不必要的第三方 bootloader 修改。

## 已发现并修正的危险点

### 1. 旧方案把“判断启动分区”写得过于模糊

旧版写成：

> 看 `flag_last_success` / `flag_boot_rootfs` 后再决定。

这不够严谨。

OpenWrt 官方 AX6000 stock-layout 页面明确要求先看：

```sh
cat /proc/cmdline
```

并以：

```text
firmware=1 → 当前 ubi1 → 写 ubi (mtd8)
firmware=0 → 当前 ubi  → 写 ubi1 (mtd9)
```

作为分支逻辑。

**已在第 07 页改成官方判断方式，并要求 `/proc/mtd` 二次确认 mtd8/mtd9 标签。**

### 2. 旧方案没有把远控链路和刷机链路强制隔离

这是远程刷机最大的逻辑漏洞。

如果 Mac 的互联网通过 AX6000，第一次 `reboot` 就可能把远控一起切断。

现在强制：

```text
Wi-Fi = Internet / 远控
USB Ethernet = AX6000
```

并要求在刷机前实际做：

- AX6000 断电 30 秒测试
- AX6000 网线拔掉 30 秒测试

只要远控会掉，就禁止刷。

### 3. Mac USB Ethernet 不能抢默认路由

如果有线口配置了 Gateway，macOS 可能把互联网流量发向 AX6000。

因此强制：

```text
USB Ethernet Gateway：空
USB Ethernet DNS：空
```

原厂阶段只设 `192.168.31.10/24`；OpenWrt 阶段只改成 `192.168.1.10/24`。

### 4. 不再照 Hans 视频刷第三方 U-Boot

Hans/喵二等教程中的 U-Boot 路线在本地刷机有使用场景，但本项目目标是远程安全。

OpenWrt 官方当前已经提供：

```text
xiaomi_redmi-router-ax6000-stock
```

所以不需要先改 bootloader。

官方同时保留 `ubootmod`，但那是另一种布局，不能与本指南混用。

### 5. 不再写死“看到 mtd8/mtd9 就直接刷”

即便官方 stock layout 正常情况下是：

```text
mtd8 = ubi
mtd9 = ubi1
```

本指南仍要求每台设备现场执行：

```sh
cat /proc/mtd
```

只有标签实际吻合才允许使用官方对应命令。

这是为防止：

- 机器之前被别人改过分区
- 已刷过第三方 bootloader
- 当前并非我们假定的 stock layout

### 6. 增加镜像双重校验

远程刷机不接受“文件看起来下载完了”。

必须：

```text
Mac 本地 SHA256
=
路由器 /tmp SHA256
=
OpenWrt 官方 SHA256
```

三者一致再写入。

### 7. 备份不能只存在路由器 `/tmp`

`/tmp` 重启就会丢。

最低要求：

```text
AX6000 dump
→ Mac ~/Desktop/AX6000/backup
→ 第二份独立副本
```

Factory / Bdata / FIP 等关键分区在真正 Flash 前必须已经离开路由器。

### 8. Initramfs 到正式系统之间不能直接 sysupgrade

第 08 页现在强制先：

```sh
ubus call system board
fw_setenv ...
fw_printenv ...
```

设备身份和 boot env 都验证后才允许上传/执行 sysupgrade。

## 远程刷机最容易犯的 12 个错误

1. Mac 的 Wi-Fi 本身就是 AX6000 提供的
2. USB Ethernet 填了 Gateway
3. 路由器重启后忘记把 Mac 有线 IP 从 `31.10` 改到 `1.10`
4. STOK 重启后仍使用旧值
5. `admin` / `passwd` 密码教程混用，导致 SSH 登录判断错误
6. `scp` 在现代 macOS 上忘记 `-O`
7. 看到 SSH 断开就误以为失败并让现场人员拔电
8. 把 `ubootmod` 镜像当成 `stock` 镜像
9. 根据网上 mtd 编号直接写，不看自己的 `/proc/mtd`
10. `ubiformat` 报错后反复执行或改刷另一个分区
11. sysupgrade 后只等几十秒就断电
12. 备份还在 `/tmp` 就开始 Flash

## 现场“停止规则”

出现以下任何一项，**立即停止后续操作，但不要随意重启/断电**：

```text
/proc/cmdline 没有 firmware=0/1
/proc/mtd 与 stock layout 不一致
出现 custom bootloader 痕迹
OpenWrt 镜像文件名不匹配
SHA256 不一致
ubiformat 出现 error / failed
fw_setenv / fw_printenv 异常
ubus 显示的 board 不是 Redmi AX6000 stock layout
远控链路开始不稳定
现场停电风险明显
```

## 本指南参考来源

### 第一优先级：OpenWrt 官方

- Redmi AX6000 device page  
  https://openwrt.org/toh/xiaomi/redmi_ax6000
- Redmi AX6000 Techdata  
  https://openwrt.org/toh/hwdata/xiaomi/xiaomi_redmi_ax6000
- OpenWrt `mt7986a-xiaomi-redmi-router-ax6000-stock.dts`
- OpenWrt `target/linux/mediatek/filogic/base-files/lib/upgrade/platform.sh`

### 第二优先级：社区交叉验证

- `dqzboy/Redmi-AX6000`：Telnet/Bdata/SSH 流程
- `miaoermua/unlock-redmi-ax6000`：1.2.8、SSH/U-Boot 历史路线；仅参考 SSH 部分，不采用其第三方 U-Boot 路线
- `usrtax/ax6000`：1.2.8 + STOK/Bdata 路线交叉验证
- xiabee AX6000 OpenWrt 教程：1.2.8 实践交叉验证
- 恩山 AX6000 SSH/Telnet 帖：支持版本及恢复时区/调试模式经验

## 最终风险判断

本方案不能把刷机变成“零风险”。Flash 写入、供电故障、硬件 NAND 异常都可能造成无法远程恢复的情况。

但通过以下组合：

```text
独立远控链路
+ 现场人员
+ stock layout
+ 不改第三方 bootloader
+ 双重分区判断
+ 完整离机备份
+ SHA256 校验
+ 每次写入前 STOP gate
```

已经把本次远程条件下最明显、最可预防的致命风险压到最低。

::: danger 真正执行时
文档用于提前熟悉流程。到第 07 页真正 `ubiformat` 前，仍然应把当时这台机器的：

```sh
cat /proc/cmdline
cat /proc/mtd
nvram get flag_boot_rootfs
nvram get flag_last_success
```

实际输出再次核对后，再执行写入命令。
:::
