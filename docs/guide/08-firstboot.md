# 08 · 首次启动与正式安装

## 1. 确认临时 OpenWrt 已启动

Windows：

```powershell
ping 192.168.1.1
```

然后尝试：

```powershell
ssh root@192.168.1.1
```

首次启动时 root 密码通常为空；如果当前镜像行为不同，以实际提示为准。

## 2. 确认设备信息

```sh
cat /etc/openwrt_release
ubus call system board
```

必须确认型号对应 Redmi AX6000。

## 3. 上传正式 sysupgrade 镜像

文件名应包含：

```text
xiaomi_redmi-router-ax6000-stock-squashfs-sysupgrade.bin
```

Windows：

```powershell
scp <你的sysupgrade.bin文件> root@192.168.1.1:/tmp/
```

路由器检查：

```sh
ls -lh /tmp/*sysupgrade.bin
```

## 4. 正式安装

::: danger 最终确认
确保上传的是 **AX6000 stock-layout sysupgrade**，不是其它机型、不是 ubootmod 镜像。
:::

执行：

```sh
sysupgrade -n /tmp/<你的sysupgrade.bin文件名>
```

之后不要断电，等待设备自行完成写入和重启。

## 5. 重新进入

```text
http://192.168.1.1
```

SSH：

```powershell
ssh root@192.168.1.1
```

## 6. 设置 root 密码

```sh
passwd
```

<div class="step-ok"><strong>完成条件：</strong>正式 OpenWrt 启动成功，root 密码已设置。</div>
