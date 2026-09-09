# 03 · 获取 STOK

登录小米后台后，观察浏览器地址栏。

常见形式：

```text
http://192.168.31.1/cgi-bin/luci/;stok=xxxxxxxxxxxxxxxx/web/home
```

其中：

```text
xxxxxxxxxxxxxxxx
```

就是当前会话的 STOK。

::: warning STOK 会变化
路由器重启或重新登录后，STOK 可能变化。**每次重启后重新获取，不要继续使用旧值。**
:::

## 示例

地址栏：

```text
.../;stok=4b2f9abcdef12345/web/home
```

则：

```text
STOK=4b2f9abcdef12345
```

## 完成检查

- [ ] 当前页面确实来自 `192.168.31.1`
- [ ] 已找到 `;stok=`
- [ ] 只复制 `stok=` 后、下一个 `/` 前的内容

<div class="step-ok"><strong>完成条件：</strong>当前有效 STOK 已保存，下一步再使用。</div>
