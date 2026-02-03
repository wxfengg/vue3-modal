# vue3-modal

基于 Vue 3 的轻量模态框（Modal）组件，主打**优雅的点击展开/收起动画**，同时提供 Teleport、遮罩交互防误触、可选拖拽等能力。

- 仓库：<https://github.com/wxfengg/vue3-modal>
- License：MIT

## 特性

- **点击位置作为动画起点**：从你触发打开的点击处弹性展开
- **Teleport 挂载目标可配置**：`appendTo` 支持选择器或 DOM 元素
- **遮罩点击关闭防误触**：使用 `mousedown/mouseup` 组合，避免点到内容误关
- **可选拖拽**：仅从 header 触发，支持限制不超出可视区
- 常用能力：`zIndex`、`destroyOnClose`、`lockScroll`、`closeOnEsc` 等

## 安装

```bash
pnpm add vue3-modal
# or
npm i vue3-modal
# or
yarn add vue3-modal
```

## 快速开始

```vue
<script setup lang="ts">
import { ref } from "vue"
import { Modal } from "vue3-modal"

const visible = ref(false)
</script>

<template>
  <button @click="visible = true">打开</button>

  <Modal v-model="visible" title="Hello Modal">
    <div>这里是内容</div>
  </Modal>
</template>
```

## 文档

- 本地启动文档：`pnpm docs:dev`
- 文档内容位于：[`docs/`](./docs)

## Playground（演示）

该仓库自带演示页面（Vite root 指向 `playground/`）：

- 启动演示：`pnpm play`

> 说明：`pnpm dev` 当前用于组件库的打包 watch（tsdown），不是演示页。

---

## English

A lightweight Vue 3 Modal component featuring **elegant click-origin open/close animations**, plus Teleport support, safe overlay interactions, and optional dragging.

- Repo: <https://github.com/wxfengg/vue3-modal>
- License: MIT

### Features

- **Click-origin animations**: expands from where you clicked
- **Teleport target**: `appendTo` supports selector or HTMLElement
- **Safe overlay click-to-close**: `mousedown/mouseup` combo to prevent accidental closes
- **Optional dragging**: header-only, with optional viewport bounds
- Practical props: `zIndex`, `destroyOnClose`, `lockScroll`, `closeOnEsc`, etc.

### Install

```bash
pnpm add vue3-modal
# or
npm i vue3-modal
# or
yarn add vue3-modal
```

### Quick Start

```vue
<script setup lang="ts">
import { ref } from "vue"
import { Modal } from "vue3-modal"

const visible = ref(false)
</script>

<template>
  <button @click="visible = true">Open</button>

  <Modal v-model="visible" title="Hello Modal">
    <div>Content goes here</div>
  </Modal>
</template>
```

### Documentation

- Run docs locally: `pnpm docs:dev`
- Docs source: [`docs/`](./docs)

### Playground

This repo includes a playground app (Vite root is `playground/`):

- Start it: `pnpm play`

> Note: `pnpm dev` is currently used for library bundling watch (tsdown), not the playground.
