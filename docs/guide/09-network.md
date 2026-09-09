# 09 · LAN / WAN 基础设置

## 1. 正式 OpenWrt 稳定后再调整 Mac 有线口

刷机阶段为了避免远控被抢路由，USB Ethernet 一直使用静态地址且不设置 Gateway。

正式 OpenWrt 已确认稳定后，可以把 Mac 的 USB Ethernet 改回：

```text
IPv4：DHCP / 自动获取
DNS：自动
```

Mac 的 Wi-Fi 远控仍保持连接，直到整个网络配置确认结束。

## 2. 如果上级路由器也是 192.168.1.1

OpenWrt 默认 LAN 常用 `192.168.1.1`，如果上级也是这个网段会冲突。

建议把 AX6000 LAN 改成：

```text
192.168.100.1
```

LuCI：

```text
网络 → 接口 → LAN → IPv4 地址
```

保存应用后，Mac 有线口重新 DHCP，之后访问：

```text
http://192.168.100.1
```

## 3. WAN 接线

```text
家里主路由 / 光猫 LAN
        │
        ▼
     AX6000 WAN

Mac USB Ethernet
        │
        ▼
     AX6000 LAN
```

WAN 默认 DHCP 时通常会自动获取上级地址。

::: warning 不要急着让远控切到 AX6000
直到 OpenWrt、LAN、WAN、DHCP 都稳定之前，Mac 的互联网仍优先走原来的 Wi-Fi。
:::

## 4. 最后再验证 AX6000 独立联网

在 LuCI 或 SSH 中检查 WAN 获得地址后，可以从 AX6000 测试：

```sh
ping -c 3 1.1.1.1
```

再确认 DNS：

```sh
nslookup openwrt.org
```

## 5. IPv6

不要因为旧教程一句“链式代理会冲突”就默认永久禁用 IPv6。

是否关闭取决于后续 OpenClash/Mihomo/PassWall 的分流和上游网络设计；刷机本身不要求关闭 IPv6。

## 6. 完成检查

- [ ] Mac USB Ethernet 可通过 DHCP 获取 AX6000 LAN 地址
- [ ] LuCI 可以打开
- [ ] WAN 获取上级地址
- [ ] LAN 与上级网段不冲突
- [ ] root 密码已设置
- [ ] AX6000 能访问公网
- [ ] Mac Wi-Fi 远控仍正常

<div class="step-ok"><strong>完成条件：</strong>AX6000 已作为正常 OpenWrt 路由器工作；此时才结束远程刷机维护窗口。</div>
