# 07 · 刷入 OpenWrt

::: danger 高风险阶段
这一页开始涉及真实 Flash 写入。**必须已经完成第 06 页备份。**
:::

## 1. 再次确认当前启动状态

SSH 中执行：

```sh
nvram get flag_last_success
nvram get flag_boot_rootfs
cat /proc/mtd
```

把输出保存下来。

<div class="stop-line">如果你无法明确确认当前运行的是哪个 UBI / rootfs 分区，停止。不要猜。</div>

## 2. 上传 stock-layout 安装镜像

OpenWrt 对 AX6000 stock layout 的首次安装镜像文件名通常包含：

```text
xiaomi_redmi-router-ax6000-stock-initramfs-factory.ubi
```

上传到 `/tmp`：

```powershell
scp -O <你的factory.ubi文件> root@192.168.31.1:/tmp/
```

上传后在路由器检查：

```sh
ls -lh /tmp/*ax6000* /tmp/*.ubi 2>/dev/null
```

## 3. 确认目标 UBI 分区

原则只有一个：

> **把 OpenWrt 写入“当前没有启动”的那个系统 UBI 分区。**

不要直接照抄网上的 `/dev/mtd8`、`/dev/mtd9`。

需要通过：

```sh
cat /proc/mtd
nvram get flag_last_success
nvram get flag_boot_rootfs
```

结合当前设备状态确定目标 MTD。

## 4. 写入格式

确认目标分区后，使用 `ubiformat` 写入安装镜像，格式类似：

```sh
ubiformat /dev/mtdX -y -f /tmp/<你的stock-initramfs-factory.ubi>
```

::: danger 最后一次确认
执行前再次检查：

- `mtdX` 是**非当前启动**的 UBI 分区
- 文件确实是 **AX6000 stock initramfs factory UBI**
- Factory / Bdata / FIP 备份已在电脑
- 电源稳定
:::

## 5. 切换启动分区

写入成功后，需要把启动标记切换到刚写入的系统分区。

这里不能脱离你第 1 步的实际 `flag_last_success` / `flag_boot_rootfs` 输出写死值。

<div class="stop-line">实际刷机时，把第 1 步输出发给 ChatGPT 核对，再生成这一步精确命令。</div>

## 6. 重启

只有前面均确认无误后：

```sh
reboot
```

重启后尝试：

```text
http://192.168.1.1
```

或：

```powershell
ping 192.168.1.1
```
