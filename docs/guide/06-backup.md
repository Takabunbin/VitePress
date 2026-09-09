# 06 · 备份原厂分区

::: danger 强制停止点
**没有完成备份，不允许执行任何 `mtd write`、`ubiformat`、`sysupgrade` 或 Bootloader 写入命令。**
:::

## 1. 查看真实分区表

SSH 中执行：

```sh
cat /proc/mtd
```

重点确认名称中是否存在：

```text
Factory
Bdata
FIP
ubi
ubi1
```

::: warning 不写死 MTD 编号
不同教程会出现 `mtd8`、`mtd9` 等固定编号。这里**不照抄编号**，以你这台设备当前 `/proc/mtd` 输出为准。
:::

## 2. 保存分区表文本

```sh
cat /proc/mtd > /tmp/proc-mtd.txt
```

## 3. 备份前先确认可用空间

```sh
df -h /tmp
```

然后根据 `/proc/mtd` 中的实际编号，对关键分区做只读 `dd` 备份。

示例格式：

```sh
dd if=/dev/mtdX of=/tmp/Factory.bin bs=64k
```

其中 `mtdX` **必须替换为 Factory 对应的真实编号**。

建议至少备份：

```text
Factory
Bdata
FIP
```

如果需要最大化恢复能力，可再保存其它原厂关键分区，但不要在不知道含义时执行写回。

## 4. 下载到 Windows

先在 Windows 创建目录：

```powershell
New-Item -ItemType Directory -Force C:\AX6000-BACKUP | Out-Null
```

复制分区表：

```powershell
scp -O root@192.168.31.1:/tmp/proc-mtd.txt C:\AX6000-BACKUP\
```

复制备份文件，例如：

```powershell
scp -O root@192.168.31.1:/tmp/Factory.bin C:\AX6000-BACKUP\
```

如遇旧 RSA 算法问题：

```powershell
scp -O -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa root@192.168.31.1:/tmp/Factory.bin C:\AX6000-BACKUP\
```

## 5. Windows 本地检查

```powershell
Get-ChildItem C:\AX6000-BACKUP | Format-Table Name,Length -AutoSize
```

必须确保文件长度不是 `0`。

## 完成检查

- [ ] `/proc/mtd` 已保存
- [ ] Factory 已备份
- [ ] Bdata 已备份
- [ ] FIP 已备份
- [ ] 文件已经下载到电脑
- [ ] 文件长度均大于 0
- [ ] 最好再复制一份到其它磁盘/云盘

<div class="step-ok"><strong>完成条件：</strong>备份文件已经离开路由器，保存在电脑上。</div>
