# 05 · 开启 Telnet / SSH

## 1. Telnet 连接

PuTTY：

```text
Host: 192.168.31.1
Port: 23
Type: Telnet
```

连接成功后应进入 AX6000 shell。

## 2. 统一设置 root 密码

Hans 原文章存在 `admin` / `passwd` 两种密码描述冲突。本指南统一按离线流程使用：

```sh
echo -e 'passwd\npasswd' | passwd root
```

随后执行：

```sh
nvram set ssh_en=1
nvram set telnet_en=1
nvram set uart_en=1
nvram set boot_wait=on
nvram commit
sed -i 's/channel=.*/channel="debug"/g' /etc/init.d/dropbear
/etc/init.d/dropbear restart
```

## 3. 立即验证 SSH

Windows PowerShell：

```powershell
ssh root@192.168.31.1
```

密码：

```text
passwd
```

如果新版 OpenSSH 因旧算法拒绝连接，可尝试：

```powershell
ssh -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa root@192.168.31.1
```

::: danger 验证优先
在 SSH 真正可登录之前，不进入备份或刷写阶段。
:::

## 完成检查

- [ ] Telnet 可进入 shell
- [ ] root 密码已经明确设置
- [ ] Dropbear 已重启
- [ ] Windows 能通过 SSH 登录 `root@192.168.31.1`

<div class="step-ok"><strong>完成条件：</strong>SSH 登录成功。</div>
