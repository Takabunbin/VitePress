# 05 · 开启 Telnet / SSH

## 1. 先确认 Telnet 端口已开

Mac 终端：

```bash
nc -vz 192.168.31.1 23
```

出现 `succeeded` / `open` 才继续。

macOS 新版通常不自带 `telnet` 命令。正式刷机前就准备好一个 Telnet 客户端；如果 Mac 已装 Homebrew，可提前安装：

```bash
brew install telnet
```

然后：

```bash
telnet 192.168.31.1
```

::: warning 不要刷到一半再装工具
Telnet、SSH、SCP 都必须在开始刷机前测试好。
:::

## 2. 设置 root 密码

进入 Telnet shell 后，不再沿用不同教程里互相冲突的 `admin` / `passwd` 固定密码。

直接交互设置：

```sh
passwd root
```

输入两次你本次明确记录好的临时强密码。

这样避免密码写进命令历史，也避免 Hans 教程中 `admin` / `passwd` 前后冲突。

## 3. 开启 SSH

执行：

```sh
nvram set ssh_en=1
nvram set telnet_en=1
nvram set uart_en=1
nvram set boot_wait=on
nvram commit
sed -i 's/channel=.*/channel="debug"/g' /etc/init.d/dropbear
/etc/init.d/dropbear restart
```

## 4. 立即从 Mac 验证 SSH

另开一个终端，不退出 Telnet：

```bash
ssh root@192.168.31.1
```

如果现代 macOS OpenSSH 拒绝旧 RSA：

```bash
ssh -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa root@192.168.31.1
```

OpenWrt 官方 AX6000 页面明确提示：OEM Dropbear 较旧，现代 SSH 客户端可能需要允许 `ssh-rsa`；现代 `scp` 还需要 `-O` 使用旧 SCP 协议。

## 5. 不追求“永久 SSH”再多改系统

本方案接下来不会在 OEM 中无必要重启很多次；我们只需要：

```text
当前 OEM 会话 SSH 稳定
→ 完成备份
→ 完成官方 stock-layout 写入
```

远程安全优先，因此不额外依赖第三方 `auto_ssh.sh` 去增加修改面。

如果后续因为异常回落 OEM 且 SSH 不再启动，先从 Telnet/Bdata 状态重新判断，不要为了“永久化”提前写更多脚本。

## 6. 保持两个终端

建议同时保留：

```text
终端 A：Telnet（若仍可保持）
终端 B：SSH
```

直到确认 SSH 稳定后再结束 Telnet。

## 完成检查

- [ ] `nc -vz 192.168.31.1 23` 成功
- [ ] Telnet 能进入 shell
- [ ] root 密码已记录
- [ ] Dropbear 已启动
- [ ] Mac 能 SSH 登录
- [ ] SSH 断开重连一次仍成功
- [ ] Mac Wi-Fi 远控全过程没有掉

<div class="step-ok"><strong>完成条件：</strong>Mac 通过 USB Ethernet 稳定 SSH 到 192.168.31.1。</div>
