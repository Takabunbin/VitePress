# 99 · 故障与恢复

## A. 192.168.31.1 打不开

先检查 Windows 当前地址：

```powershell
ipconfig
```

确认电脑确实连接 AX6000 的 LAN，且没有被其它网卡/VPN 抢走默认路由。

必要时临时关闭无关网络适配器后再测：

```powershell
ping 192.168.31.1
```

## B. Telnet 连不上

检查：

- 固件版本是否真的是 `1.2.8`
- Developer URL 是否返回 `code 0`
- Bdata URL 是否返回 `code 0`
- 设置 Bdata 后是否完成重启
- 重启后是否误用了旧 STOK

## C. SSH 连不上

先测试端口：

```powershell
Test-NetConnection 192.168.31.1 -Port 22
```

如果端口开但算法不兼容：

```powershell
ssh -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa root@192.168.31.1
```

## D. OpenWrt 后 192.168.31.1 消失

OpenWrt 通常使用：

```text
192.168.1.1
```

先把 Windows IPv4 改回 DHCP 自动获取，再测试：

```powershell
ipconfig /release
ipconfig /renew
ping 192.168.1.1
```

## E. 写盘后设备无法正常启动

::: danger 不要继续乱写
如果已经执行过 `ubiformat`、修改启动标记或 Bootloader 操作后失联，**不要继续根据网上随机命令写其它 MTD 分区。**
:::

先记录：

- 最后执行的完整命令
- 写入的具体 `/dev/mtdX`
- 使用的镜像完整文件名
- 写入前 `/proc/mtd`
- `flag_last_success`
- `flag_boot_rootfs`
- 当前 LED 状态
- 网卡连接/断开状态

然后根据这些信息决定：切回原启动分区、进入恢复环境、串口救援或使用备份恢复。

## F. 原厂备份为什么必须保留

至少长期保存：

```text
proc-mtd.txt
Factory.bin
Bdata.bin
FIP.bin
```

不要只放在路由器 `/tmp`；`/tmp` 重启就会丢失。
