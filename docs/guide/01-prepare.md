# 01 · 准备文件与网络

## 连接方式

```text
电脑 ──网线──> AX6000 LAN
```

如果原厂系统需要联网下载脚本，再把 AX6000 WAN 接到上级路由器。

## 文件分类

至少准备：

1. 小米 AX6000 `1.2.8` 固件
2. OpenWrt 对 AX6000 stock layout 的安装镜像
3. OpenWrt 对 AX6000 stock layout 的 sysupgrade 镜像
4. 原厂 SSH 开启所需脚本（若采用离线方式）

::: warning 文件名必须看清
`factory/initramfs` 与 `sysupgrade` 用途不同。不要因为文件名都包含 AX6000 就互换使用。
:::

## Windows 网络设置

原厂系统阶段，优先保持：

```text
IPv4：自动获取
DNS：自动获取
```

只有在进入某些 Bootloader 恢复页面时，才临时手动设置固定 IP。

## 完成检查

- [ ] 网线直连 AX6000
- [ ] 能打开 `http://192.168.31.1`
- [ ] 已把刷机文件集中放进一个独立文件夹
- [ ] 文件名没有混淆

<div class="step-ok"><strong>完成条件：</strong>浏览器可以正常进入小米后台。</div>
