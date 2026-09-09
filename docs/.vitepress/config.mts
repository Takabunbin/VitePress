import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Redmi AX6000 OpenWrt 刷机指南',
  description: 'Redmi AX6000 从原厂系统到 OpenWrt 的分步刷机手册',
  base: '/VitePress/',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    search: { provider: 'local' },
    nav: [
      { text: '刷机流程', link: '/guide/00-start' },
      { text: '故障恢复', link: '/guide/99-recovery' }
    ],
    sidebar: [
      {
        text: 'AX6000 刷机流程',
        items: [
          { text: '00 · 开始前必读', link: '/guide/00-start' },
          { text: '01 · 准备文件与网络', link: '/guide/01-prepare' },
          { text: '02 · 固件调整到 1.2.8', link: '/guide/02-firmware' },
          { text: '03 · 获取 STOK', link: '/guide/03-stok' },
          { text: '04 · 开启开发者模式', link: '/guide/04-developer' },
          { text: '05 · 开启 Telnet / SSH', link: '/guide/05-ssh' },
          { text: '06 · 备份原厂分区', link: '/guide/06-backup' },
          { text: '07 · 刷入 OpenWrt', link: '/guide/07-flash' },
          { text: '08 · 首次启动与正式安装', link: '/guide/08-firstboot' },
          { text: '09 · LAN / WAN 基础设置', link: '/guide/09-network' },
          { text: '99 · 故障与恢复', link: '/guide/99-recovery' }
        ]
      }
    ],
    outline: { level: [2, 3], label: '本页步骤' },
    docFooter: { prev: '上一步', next: '下一步' },
    lastUpdated: { text: '最后更新' },
    footer: { message: '刷写 Flash 前必须确认当前设备、分区与备份状态。' }
  }
})
