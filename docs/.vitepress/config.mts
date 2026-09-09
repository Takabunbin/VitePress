import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Redmi AX6000 远程刷 OpenWrt',
  description: 'Mac + USB-C 有线网卡远程刷 Redmi AX6000 的分步安全手册',
  base: '/VitePress/',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    search: { provider: 'local' },
    nav: [
      { text: '远程刷机流程', link: '/guide/00-remote-preflight' },
      { text: '最终安全审查', link: '/guide/10-review' },
      { text: '故障恢复', link: '/guide/99-recovery' }
    ],
    sidebar: [
      {
        text: 'AX6000 远程刷机 SOP',
        items: [
          { text: '00 · 远程环境验收', link: '/guide/00-remote-preflight' },
          { text: '01 · Mac / 网线 / 文件准备', link: '/guide/01-prepare' },
          { text: '02 · 固件调整到 1.2.8', link: '/guide/02-firmware' },
          { text: '03 · 获取 STOK', link: '/guide/03-stok' },
          { text: '04 · 开启开发者模式', link: '/guide/04-developer' },
          { text: '05 · 开启 Telnet / SSH', link: '/guide/05-ssh' },
          { text: '06 · 备份原厂分区', link: '/guide/06-backup' },
          { text: '07 · 官方 stock-layout 写入', link: '/guide/07-flash' },
          { text: '08 · Initramfs → 正式 OpenWrt', link: '/guide/08-firstboot' },
          { text: '09 · LAN / WAN 基础设置', link: '/guide/09-network' },
          { text: '10 · 最终安全审查', link: '/guide/10-review' },
          { text: '99 · 故障与恢复', link: '/guide/99-recovery' }
        ]
      }
    ],
    outline: { level: [2, 3], label: '本页步骤' },
    docFooter: { prev: '上一步', next: '下一步' },
    lastUpdated: { text: '最后更新' },
    footer: { message: '远程刷写 Flash：先保证远控链路独立，再确认设备、镜像、分区与备份。' }
  }
})
