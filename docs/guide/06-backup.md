# 06 · 备份原厂分区

::: danger 强制停止点
**没有完成离机备份，不允许执行 `ubiformat`、`sysupgrade` 或任何 Bootloader 写入。**
:::

## 1. 保存真实状态

SSH 中执行：

```sh
cat /proc/cmdline
cat /proc/mtd
nvram get flag_boot_rootfs
nvram get flag_last_success
```

保存到 `/tmp`：

```sh
cat /proc/cmdline > /tmp/proc-cmdline.txt
cat /proc/mtd > /tmp/proc-mtd.txt
{
  echo -n 'flag_boot_rootfs='; nvram get flag_boot_rootfs
  echo -n 'flag_last_success='; nvram get flag_last_success
} > /tmp/boot-flags.txt
```

## 2. 确认 stock layout

重点检查分区名称。正常 stock layout 应包含关键项目，例如：

```text
Nvram
Bdata
Factory / factory
FIP / fip
ubi
ubi1
```

名称大小写以实际输出为准。

如果 `/proc/mtd` 明显与官方 stock layout 不同：**停止，不刷。**

## 3. 备份前检查 `/tmp` 空间

```sh
df -h /tmp
```

不要为了“完整备份所有大分区”把 `/tmp` 塞满。

远程安全优先，先备份体积较小但不可替代的关键分区和状态文件。

## 4. 根据真实分区编号做只读备份

先从 `/proc/mtd` 找到对应编号，再执行 `dd`。

格式：

```sh
dd if=/dev/mtdX of=/tmp/Factory.bin bs=64k
```

至少备份：

```text
Factory / factory
Bdata
FIP / fip
Nvram（如果分区表存在）
```

::: danger 不允许猜编号
`mtdX` 必须来自这台设备刚刚的 `/proc/mtd`。不要根据别人的教程手填。
:::

每个 `dd` 完成后：

```sh
ls -lh /tmp/*.bin /tmp/*.txt
sha256sum /tmp/*.bin
```

## 5. 立刻复制到 Mac

Mac：

```bash
mkdir -p ~/Desktop/AX6000/backup
scp -O root@192.168.31.1:/tmp/proc-cmdline.txt ~/Desktop/AX6000/backup/
scp -O root@192.168.31.1:/tmp/proc-mtd.txt ~/Desktop/AX6000/backup/
scp -O root@192.168.31.1:/tmp/boot-flags.txt ~/Desktop/AX6000/backup/
scp -O root@192.168.31.1:/tmp/'*.bin' ~/Desktop/AX6000/backup/
```

如果旧 RSA 被拒绝：

```bash
scp -O -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa root@192.168.31.1:/tmp/proc-mtd.txt ~/Desktop/AX6000/backup/
```

## 6. Mac 本地验证

```bash
ls -lh ~/Desktop/AX6000/backup
shasum -a 256 ~/Desktop/AX6000/backup/*.bin
```

确认：

- 文件不是 0 字节
- 文件数量符合刚才备份内容
- SHA256 能正常计算

## 7. 再复制第二份

至少再复制到另一个位置，例如外置盘、NAS 或可信云盘。

目标是：

```text
路由器 /tmp（临时）
Mac 本地（第一份）
独立位置（第二份）
```

真正写 Flash 前，**必须已经存在后两份**。

## 8. 不在本教程里执行“恢复写回”

备份命令是只读 `dd if=/dev/mtdX`。

恢复时的 `mtd write` / `dd of=/dev/mtdX` 属于另一套高风险救砖流程，除非明确确认分区、镜像和恢复场景，否则不要执行。

## 完成检查

- [ ] `/proc/cmdline` 已保存
- [ ] `/proc/mtd` 已保存
- [ ] boot flags 已保存
- [ ] Factory 已备份
- [ ] Bdata 已备份
- [ ] FIP 已备份
- [ ] Nvram（若存在）已备份
- [ ] 备份已下载到 Mac
- [ ] 所有文件大于 0 字节
- [ ] SHA256 已计算
- [ ] 第二份独立副本已完成

<div class="step-ok"><strong>完成条件：</strong>关键原厂数据已经离开 AX6000，并至少有两份独立副本。</div>
