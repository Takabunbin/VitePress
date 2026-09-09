# 08 · Initramfs → 正式 OpenWrt

::: danger 第二个最高风险页
这一页会把临时 OpenWrt 变成正式安装。**不要跳过设备身份和 boot env 检查。**
:::

## 1. 确认你真的进入了 OpenWrt initramfs

Mac USB Ethernet：

```text
IP：192.168.1.10
掩码：255.255.255.0
Gateway：空
DNS：空
```

测试：

```bash
ping 192.168.1.1
ssh root@192.168.1.1
```

进入后执行：

```sh
cat /etc/openwrt_release
ubus call system board
mount | head
```

必须确认：

- 设备是 **Xiaomi Redmi Router AX6000 (stock layout)**
- 当前是临时 initramfs / tmpfs 环境

如果型号不对，停止。

## 2. 设置官方 stock-layout boot env

OpenWrt 官方 AX6000 页面给出的设置：

```sh
fw_setenv boot_wait on
fw_setenv uart_en 1
fw_setenv flag_boot_rootfs 0
fw_setenv flag_last_success 1
fw_setenv flag_boot_success 1
fw_setenv flag_try_sys1_failed 8
fw_setenv flag_try_sys2_failed 8
fw_setenv mtdparts "nmbm0:1024k(bl2),256k(Nvram),256k(Bdata),2048k(factory),2048k(fip),256k(crash),256k(crash_log),30720k(ubi),30720k(ubi1),51200k(overlay)"
```

然后**读取回来验证**：

```sh
fw_printenv boot_wait uart_en flag_boot_rootfs flag_last_success flag_boot_success flag_try_sys1_failed flag_try_sys2_failed mtdparts
```

应与上面设置一致。

::: danger 读取结果不一致就停止
不要在 `fw_setenv` 报错、`fw_printenv` 读不到或 `mtdparts` 不一致时继续 `sysupgrade`。
:::

## 3. 上传正式 sysupgrade 镜像

Mac：

```bash
cd ~/Desktop/AX6000/firmware
scp openwrt-25.12.2-mediatek-filogic-xiaomi_redmi-router-ax6000-stock-squashfs-sysupgrade.bin root@192.168.1.1:/tmp/
```

路由器：

```sh
ls -lh /tmp/openwrt-*-ax6000-stock-squashfs-sysupgrade.bin
sha256sum /tmp/openwrt-25.12.2-mediatek-filogic-xiaomi_redmi-router-ax6000-stock-squashfs-sysupgrade.bin
```

再次与 Mac 本地 SHA256 对比。

## 4. 最终四项确认

执行 `sysupgrade` 之前口头再确认一次：

```text
[ ] 型号 = Redmi AX6000 stock layout
[ ] 文件 = stock-squashfs-sysupgrade.bin
[ ] SHA256 一致
[ ] fw_printenv 与官方值一致
```

全部通过才执行：

```sh
sysupgrade -n /tmp/openwrt-25.12.2-mediatek-filogic-xiaomi_redmi-router-ax6000-stock-squashfs-sysupgrade.bin
```

SSH 被主动关闭是正常现象。

## 5. 远程情况下的等待纪律

执行后：

- **至少等待 5 分钟**
- 不断电
- 不按 Reset
- 不让妹妹自行处理
- 保持 Mac Wi-Fi 远控在线

之后：

```bash
ping 192.168.1.1
```

再：

```bash
ssh root@192.168.1.1
```

## 6. 正式系统身份确认

```sh
cat /etc/openwrt_release
ubus call system board
cat /proc/cmdline
```

确认正常后设置 root 密码：

```sh
passwd
```

## 7. 为什么不刷 U-Boot

OpenWrt 官方现在同时提供 stock layout 与 ubootmod；官方设备数据明确注明 **stock layout 可直接安装，U-Boot layout 是可选项**。

本项目是远程刷机，因此主动放弃第三方 U-Boot 路线，原因：

- 多改一层 bootloader 就多一个不可远程恢复的风险面
- 某些第三方 U-Boot 会改变 Xiaomi OEM recovery/TFTP 的预期行为
- stock layout 已由 OpenWrt 官方支持，没有必要为“能刷”而再改 bootloader

## 本页来源

- https://openwrt.org/toh/xiaomi/redmi_ax6000
- https://openwrt.org/toh/hwdata/xiaomi/xiaomi_redmi_ax6000
- OpenWrt 当前 mediatek/filogic upgrade 代码中的 Xiaomi 初始化逻辑

<div class="step-ok"><strong>完成条件：</strong>正式 OpenWrt 可通过 192.168.1.1 登录，设备身份正确，root 密码已设置。</div>
