# 快速开始

`vue3-modal` 是一个基于 Vue 3 的轻量模态框组件，主打“从点击位置展开/收起”的自然动画，并提供 Teleport、遮罩交互防误触、可选拖拽等常用能力。

## 安装

- `pnpm add vue3-modal`
- `npm i vue3-modal`
- `yarn add vue3-modal`

## 基础用法

`Modal` 通过 `v-model:modelValue` 控制显隐（必填）：

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

## 关闭方式

- 点击右上角关闭按钮
- `Esc` 关闭（`closeOnEsc`，默认 `true`）
- 点击遮罩关闭（`closeOnOverlay`，默认 `true`；且 `overlay` 必须为 `true`）
- 代码关闭：`visible = false`

## Teleport（appendTo）

默认挂载到 `body`。你也可以指定选择器或 DOM 元素：

```vue
<Modal v-model="visible" append-to="#modal-root" />
```

或：

```ts
const el = document.querySelector("#modal-root") as HTMLElement
// <Modal :append-to="el" ... />
```

> 提示：如果你把弹窗挂载到自定义容器，请确保容器不会被 `overflow: hidden` 裁剪。

## 通过组件方法打开/关闭（open/close）

组件暴露了 `open(position?)` 与 `close()`：

```vue
<script setup lang="ts">
import { ref } from "vue"
import { Modal } from "vue3-modal"

type ModalExpose = {
  open: (position?: { x: number; y: number }) => void
  close: () => void
}

const visible = ref(false)
const modalRef = ref<ModalExpose | null>(null)
</script>

<template>
  <button @click="modalRef?.open({ x: 100, y: 100 })">从指定坐标展开</button>
  <button @click="modalRef?.close()">关闭</button>

  <Modal ref="modalRef" v-model="visible" />
</template>
```

如果你不传 `position`，组件会尽量使用“打开前最近一次点击”的坐标作为动画起点（见下文「动画」）。

## 动画

### 动画做了什么

- 打开：从“触发打开的点击位置”弹性展开
- 关闭：向同一点击位置收回

### 实现思路（你不需要记住，但有助于调参）

- 组件在全局捕获点击坐标（仅在弹窗关闭时记录）
- 进入/离开过渡前，计算并设置 `transform-origin` 为“点击点相对弹窗容器的位置”
- CSS 里用 `scale()` 做展开/收缩，并配合透明度过渡

### 自定义动画

你可以在应用侧覆盖这些 class（Vue Transition）：

- `.modal-fade-enter-active`
- `.modal-fade-leave-active`
- `.modal-fade-enter-from`
- `.modal-fade-leave-to`

建议只动 `opacity` 和 `transform`，性能更好。

---

## API 参考

### 导入

```ts
import { Modal } from "vue3-modal"
```

### v-model

- `v-model:modelValue`: `boolean`（必填）

### Props

| 名称             | 类型                    | 默认值       | 说明                                                                |
| ---------------- | ----------------------- | ------------ | ------------------------------------------------------------------- |
| `title`          | `string \| null`        | `'默认标题'` | 标题；设为 `null` 可移除 header（也可通过 `#header` 完全自定义）    |
| `width`          | `string \| number`      | `'50%'`      | 弹窗宽度；数字会被视为 px                                           |
| `center`         | `boolean`               | `true`       | 是否垂直居中；当设置了 `top` 时不生效                               |
| `top`            | `string \| number`      | `undefined`  | 距离顶部；未设置且 `center=false` 时默认 `15vh`                     |
| `closeOnEsc`     | `boolean`               | `true`       | 是否允许 `Esc` 关闭                                                 |
| `closeOnOverlay` | `boolean`               | `true`       | 是否允许点击遮罩关闭（`overlay=true` 时才有意义）                   |
| `lockScroll`     | `boolean`               | `true`       | 打开时是否锁定 `body` 滚动（通过 `document.body.style.overflow`）   |
| `overlay`        | `boolean`               | `true`       | 是否显示遮罩；为 `false` 时遮罩不拦截点击（`pointer-events: none`） |
| `zIndex`         | `number`                | `2000`       | 遮罩层级                                                            |
| `destroyOnClose` | `boolean`               | `false`      | 关闭时是否销毁内容                                                  |
| `draggable`      | `boolean`               | `false`      | 是否允许拖拽（仅从 header 触发）                                    |
| `dragCloseReset` | `boolean`               | `false`      | 关闭时是否重置拖拽位置（需 `draggable=true`）                       |
| `dragOverflow`   | `boolean`               | `false`      | 拖拽是否允许超出可视区                                              |
| `appendTo`       | `string \| HTMLElement` | `'body'`     | Teleport 挂载目标（选择器或元素）                                   |

### Emits

| 事件名         | 参数 | 触发时机                               |
| -------------- | ---- | -------------------------------------- |
| `open`         | —    | `modelValue` 变为 `true` 时            |
| `opened`       | —    | 打开动画结束（Transition after-enter） |
| `close`        | —    | `modelValue` 变为 `false` 时           |
| `closed`       | —    | 关闭动画结束（Transition after-leave） |
| `closeOnEsc`   | —    | 即将因 `Esc` 关闭前触发                |
| `clickOverlay` | —    | 点击遮罩触发（且 `overlay=true`）      |

### Slots

| 名称          | 说明                                         |
| ------------- | -------------------------------------------- |
| `default`     | 内容区                                       |
| `header`      | 自定义整个 header（包含标题与关闭按钮区域）  |
| `title`       | 仅自定义标题区域（在默认 header 内）         |
| `closeButton` | 自定义关闭按钮内容                           |
| `footer`      | footer 内容（仅当提供该 slot 时渲染 footer） |

### Expose（组件方法）

- `open(position?: { x: number; y: number })`
- `close()`

> `open()` 可选传入坐标，覆盖自动捕获的点击位置，用于动画起点。

---

## FAQ

### 1) 为什么我设置了 `closeOnOverlay=true`，但点击背景不关闭？

请检查：

- `overlay` 是否为 `true`（默认 `true`）

当 `overlay=false` 时，遮罩层会设置 `pointer-events: none` 来允许背景交互，此时自然也无法点击遮罩触发关闭。

### 2) `center` 和 `top` 同时设置会怎样？

`top` 优先级更高：

- 设置了 `top`：按 `top` 定位
- 未设置 `top`：若 `center=true` 则垂直居中；否则默认 `15vh`

### 3) 多个弹窗同时打开时，`lockScroll` 会不会冲突？

`lockScroll` 的实现是直接写 `document.body.style.overflow`。

如果你可能同时打开多个弹窗：

- 建议只让“最顶层弹窗”启用 `lockScroll`
- 或者在你的业务层实现一个全局计数器（打开 +1，关闭 -1，归零才恢复滚动）

### 4) SSR（服务端渲染）能用吗？

当前版本在组件初始化时会访问 `window` / `document`（用于全局事件与滚动锁定）。

因此在 SSR 环境中直接渲染可能会报错（`window is not defined`）。

可选解决方案：

- 仅在客户端使用（例如在 SSR 框架中用 ClientOnly 包裹）
- 或者对该组件做动态导入（只在浏览器端加载）

### 5) 关闭后位置不重置，怎么办？

如果开启了拖拽：

- `draggable=true`

并希望关闭时重置位置：

- `dragCloseReset=true`
