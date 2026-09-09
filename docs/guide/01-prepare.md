# 01 · Mac / 网线 / 文件准备

## 1. 固定本次角色

```text
远端操作者：你
现场协助：妹妹
刷机主机：Mac
远控网络：Mac Wi-Fi
刷机网络：Mac USB-C → RJ45 → AX6000 LAN
备用主机：老 Windows 10（暂不参与）
```

老 Windows 10 本身完全能运行 SSH、PuTTY、WinSCP，但它目前只有一张有线网卡且靠该网卡联网，**不适合作为本次远程刷机主机**。路由器重启时它会一起失联。

## 2. 准备硬件

- Redmi AX6000
- Mac + 电源
- USB-C → RJ45 转接器/扩展坞（100M 足够）
- 一根可靠网线
- 牙签/卡针（只用于现场明确要求的 Reset）
- 家里现有 Wi-Fi，且不依赖本次要刷的 AX6000

## 3. 提前准备官方固件

本指南只走：

```text
Xiaomi stock bootloader
→ OpenWrt stock layout initramfs
→ OpenWrt stock layout sysupgrade
```

**不刷 hanwckf 第三方 U-Boot，不转 ubootmod。**

截至本指南复核时，OpenWrt 官方 Techdata 为 AX6000 提供稳定版 `25.12.2`：

```text
openwrt-25.12.2-mediatek-filogic-xiaomi_redmi-router-ax6000-stock-initramfs-factory.ubi
openwrt-25.12.2-mediatek-filogic-xiaomi_redmi-router-ax6000-stock-squashfs-sysupgrade.bin
```

官方设备数据页：

- https://openwrt.org/toh/hwdata/xiaomi/xiaomi_redmi_ax6000

官方安装页：

- https://openwrt.org/toh/xiaomi/redmi_ax6000

::: danger 文件名必须逐字确认
首次写入只允许 `stock-initramfs-factory.ubi`。

正式安装只允许 `stock-squashfs-sysupgrade.bin`。

看到 `ubootmod` 立即停止；那不是本教程的布局。
:::

## 4. 小米 1.2.8 固件

社区长期实践中，AX6000 的调试/Telnet 漏洞在多版原厂固件上可用；Hans、喵二、xiabee 等教程使用 `1.2.8`，这是本指南固定的可复现路线。

因此：

```text
若当前不是 1.2.8
→ 先走下一页调整到 1.2.8
```

不要使用来源不明、被重新打包的 1.2.8。

## 5. 在 Mac 建本地目录

建议：

```bash
mkdir -p ~/Desktop/AX6000/{firmware,backup,logs}
```

把所有固件提前放进 `firmware`。

## 6. 校验下载文件

Mac：

```bash
cd ~/Desktop/AX6000/firmware
shasum -a 256 *
```

把 SHA256 结果保存到：

```bash
shasum -a 256 * > ../logs/firmware-sha256.txt
```

官方 OpenWrt 镜像应与官方下载站对应版本的 SHA256 校验文件一致。

## 7. Mac 网络初始状态

先保持：

```text
Wi-Fi：正常联网，默认路由走 Wi-Fi
USB Ethernet：连接 AX6000 LAN
```

原厂阶段 USB Ethernet 使用：

```text
192.168.31.10 / 255.255.255.0
Gateway：空
DNS：空
```

## 8. 本次不依赖在线脚本

远程刷机中不要设计成：

```text
刷到一半 → 再去 TG / GitHub / CDN 下载关键脚本
```

能提前准备的全部提前准备。真正写 Flash 时，只使用已经在 Mac 本地并校验过的固件。

## 完成检查

- [ ] Mac Wi-Fi 远控独立稳定
- [ ] USB Ethernet 直连 AX6000 LAN
- [ ] `192.168.31.10/24` 配在 USB Ethernet
- [ ] USB Ethernet 没有 Gateway / DNS
- [ ] 两个官方 stock-layout OpenWrt 镜像已下载
- [ ] SHA256 已保存
- [ ] 已建立 `backup` 目录
- [ ] 明确不刷第三方 U-Boot

<div class="step-ok"><strong>完成条件：</strong>远控不依赖 AX6000，固件与工具已经全部在 Mac 本地。</div>
