# 04 · 开启开发者模式

::: warning 来源说明
这一阶段依据 Hans AX6000 教程的 1.2.8 利用方法。执行前再次确认机型和版本。
:::

## 1. 用当前 STOK 打开开发者模式

把下面 URL 中的 `{token}` 替换为当前 STOK，然后在浏览器打开：

```text
http://192.168.31.1/cgi-bin/luci/;stok={token}/api/misystem/set_sys_time?timezone=%20%27%20%3B%20zz%3D%24%28dd%20if%3D%2Fdev%2Fzero%20bs%3D1%20count%3D2%202%3E%2Fdev%2Fnull%29%20%3B%20printf%20%27%A5%5A%25c%25c%27%20%24zz%20%24zz%20%7C%20mtd%20write%20-%20crash%20%3B%20
```

正确结果必须包含：

```text
code 0
```

<div class="stop-line">不是 code 0：停止，不执行重启 URL。</div>

## 2. 请求重启

仍使用当前 STOK：

```text
http://192.168.31.1/cgi-bin/luci/;stok={token}/api/misystem/set_sys_time?timezone=%20%27%20%3b%20reboot%20%3b%20
```

看到 `code 0` 后等待路由器完整重启。

## 3. 重启后重新获取 STOK

重新进入：

```text
http://192.168.31.1
```

重新登录并复制新的 STOK。

## 4. 设置 Bdata 永久开启接口

用新的 STOK：

```text
http://192.168.31.1/cgi-bin/luci/;stok={token}/api/misystem/set_sys_time?timezone=%20%27%20%3B%20bdata%20set%20telnet_en%3D1%20%3B%20bdata%20set%20ssh_en%3D1%20%3B%20bdata%20set%20uart_en%3D1%20%3B%20bdata%20commit%20%3B%20
```

必须返回：

```text
code 0
```

## 5. 再次重启

```text
http://192.168.31.1/cgi-bin/luci/;stok={token}/api/misystem/set_sys_time?timezone=%20%27%20%3b%20reboot%20%3b%20
```

<div class="step-ok"><strong>完成条件：</strong>两个设置 URL 均返回 code 0，并完成第二次重启。</div>
