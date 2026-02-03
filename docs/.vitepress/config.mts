import { defineConfig } from "vitepress"

const repo = "https://github.com/wxfengg/vue3-modal"

export default defineConfig({
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }]],
  lastUpdated: true,
  cleanUrls: true,
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      title: "vue3-modal",
      description: "基于 Vue 3 的轻量模态框组件，带有优雅的点击展开/收起动画与可选拖拽能力。",
      themeConfig: {
        logo: "/logo.svg",
        nav: [{ text: "指南", link: "/guide/getting-started" }],
        sidebar: {
          "/guide/": [
            {
              text: "指南",
            },
          ],
        },
        socialLinks: [{ icon: "github", link: repo }],
        editLink: {
          pattern: `${repo}/edit/main/docs/:path`,
          text: "在 GitHub 上编辑此页",
        },
        footer: {
          message: "Released under the MIT License.",
          copyright: `Copyright © ${new Date().getFullYear()} XFeng`,
        },
      },
    },
    en: {
      label: "English",
      lang: "en-US",
      title: "vue3-modal",
      description: "A lightweight Vue 3 modal with elegant click-origin animations and optional dragging.",
      themeConfig: {
        logo: "/logo.svg",
        nav: [{ text: "Guide", link: "/en/guide/getting-started" }],
        sidebar: {
          "/en/guide/": [
            {
              text: "Guide",
              link: "/en/guide/getting-started",
            },
          ],
        },
        socialLinks: [{ icon: "github", link: repo }],
        editLink: {
          pattern: `${repo}/edit/main/docs/:path`,
          text: "Edit this page on GitHub",
        },
        footer: {
          message: "Released under the MIT License.",
          copyright: `Copyright © ${new Date().getFullYear()} XFeng`,
        },
      },
    },
  },
})
