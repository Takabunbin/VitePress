# 07 · 官方 stock-layout 写入

::: danger 最高风险页
这一页第一次真正写 NAND Flash。

**远程执行时必须满足：**

- 第 00 页远控隔离测试全部通过
- 第 06 页备份已经复制到 Mac 本地，并再保存一份
- 使用 OpenWrt 官方 `stock-initramfs-factory.ubi`
- 不使用第三方 U-Boot / ubootmod
:::

## 1. 以官方方法识别当前系统

SSH 进入原厂系统后执行：

```sh
cat /proc/cmdline
cat /proc/mtd
```

OpenWrt 官方以 `/proc/cmdline` 中的 `firmware=` 为判断依据：

```text
firmware=1 → 当前运行 ubi1
firmware=0 → 当前运行 ubi
```

同时 `/proc/mtd` 应能确认 stock layout 中：

```text
mtd8 = ubi
mtd9 = ubi1
```

::: danger 双重确认
不要只看网上编号。

只有当你这台设备自己的 `/proc/mtd` 也明确显示 `mtd8="ubi"`、`mtd9="ubi1"` 时，下面官方命令才允许执行。
:::

## 2. 先把官方 initramfs 上传到 `/tmp`

Mac：

```bash
cd ~/Desktop/AX6000/firmware
scp -O openwrt-25.12.2-mediatek-filogic-xiaomi_redmi-router-ax6000-stock-initramfs-factory.ubi root@192.168.31.1:/tmp/
```

如果现代 macOS SSH 因旧 Dropbear 拒绝 RSA，可临时这样连接：

```bash
ssh -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa root@192.168.31.1
```

SCP 同理：

```bash
scp -O -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa \
  openwrt-25.12.2-mediatek-filogic-xiaomi_redmi-router-ax6000-stock-initramfs-factory.ubi \
  root@192.168.31.1:/tmp/
```

路由器上检查：

```sh
ls -lh /tmp/openwrt-*-ax6000-stock-initramfs-factory.ubi
```

## 3. 上传后再次校验文件

Mac 本地先记下：

```bash
shasum -a 256 openwrt-25.12.2-mediatek-filogic-xiaomi_redmi-router-ax6000-stock-initramfs-factory.ubi
```

路由器若有 `sha256sum`：

```sh
sha256sum /tmp/openwrt-25.12.2-mediatek-filogic-xiaomi_redmi-router-ax6000-stock-initramfs-factory.ubi
```

两边必须一致。

## 4. 分支 A：如果 `firmware=1`

含义：

```text
当前运行 ubi1
下一次切换到 ubi
目标写入 mtd8 (ubi)
```

先设置官方要求的 NVRAM：

```sh
nvram set boot_wait=on
nvram set uart_en=1
nvram set flag_boot_rootfs=0
nvram set flag_last_success=0
nvram set flag_boot_success=1
nvram set flag_try_sys1_failed=0
nvram set flag_try_sys2_failed=0
nvram commit
```

再次确认：

```sh
nvram get flag_boot_rootfs
nvram get flag_last_success
```

应得到：

```text
0
0
```

只有 `/proc/mtd` 已确认 `mtd8="ubi"` 时，才执行：

```sh
ubiformat /dev/mtd8 -y -f /tmp/openwrt-25.12.2-mediatek-filogic-xiaomi_redmi-router-ax6000-stock-initramfs-factory.ubi
```

## 5. 分支 B：如果 `firmware=0`

含义：

```text
当前运行 ubi
下一次切换到 ubi1
目标写入 mtd9 (ubi1)
```

先设置官方要求的 NVRAM：

```sh
nvram set boot_wait=on
nvram set uart_en=1
nvram set flag_boot_rootfs=1
nvram set flag_last_success=1
nvram set flag_boot_success=1
nvram set flag_try_sys1_failed=0
nvram set flag_try_sys2_failed=0
nvram commit
```

再次确认：

```sh
nvram get flag_boot_rootfs
nvram get flag_last_success
```

应得到：

```text
1
1
```

只有 `/proc/mtd` 已确认 `mtd9="ubi1"` 时，才执行：

```sh
ubiformat /dev/mtd9 -y -f /tmp/openwrt-25.12.2-mediatek-filogic-xiaomi_redmi-router-ax6000-stock-initramfs-factory.ubi
```

## 6. `ubiformat` 成功的判断

不要因为 SSH 还能输入命令就立即重启。

必须看到 `ubiformat` 完整结束，没有 `error` / `failed`。

建议保存整个终端输出到 `~/Desktop/AX6000/logs/`。

::: danger 如果报错
**不要 reboot，不要重复 ubiformat，不要尝试另一分区。**

保留 SSH 会话和输出，先停止分析。
:::

## 7. 成功后才重启

```sh
sync
reboot
```

此时 SSH 断开是正常现象。

## 8. 远程场景如何等待

Mac 的 Wi-Fi 远控必须始终在线。

AX6000 重启后，USB Ethernet 的目标网段从：

```text
192.168.31.10/24
```

改为：

```text
192.168.1.10/24
Gateway：空
DNS：空
```

然后测试：

```bash
ping 192.168.1.1
```

成功后：

```bash
ssh root@192.168.1.1
```

::: warning 如果 192.168.1.1 不通
不要让妹妹立即按 Reset / 连续断电。

先等待至少 3–5 分钟，再检查 Mac USB Ethernet 地址、链路状态和 `192.168.31.1`。只有确认设备没有正常启动后，才进入恢复页分析。
:::

## 本页来源

- OpenWrt 官方 AX6000 安装页：https://openwrt.org/toh/xiaomi/redmi_ax6000
- OpenWrt 官方设备数据：https://openwrt.org/toh/hwdata/xiaomi/xiaomi_redmi_ax6000

<div class="step-ok"><strong>完成条件：</strong>官方 stock initramfs 已成功启动，且 Mac 仍可通过 Wi-Fi 被远程控制。</div>
