# Quick Start

`vue3-modal` is a lightweight Vue 3 modal focused on a natural “expand/collapse from click position” animation, with Teleport support, safe overlay handling, and optional dragging.

## Install

- `pnpm add vue3-modal`
- `npm i vue3-modal`
- `yarn add vue3-modal`

## Basic usage

`Modal` is controlled by `v-model:modelValue` (required):

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

## Closing behaviors

- Click the close button
- Press `Esc` (`closeOnEsc`, default `true`)
- Click the overlay (`closeOnOverlay`, default `true`, and `overlay` must be `true`)
- Programmatically: `visible = false`

If you keep the default footer buttons (see `footerButtons` below), a common pattern is:

```vue
<Modal v-model="visible" @cancel="visible = false" @confirm="visible = false" />
```

## Teleport (appendTo)

By default the modal is teleported to `body`. You can target a selector or an element:

```vue
<Modal v-model="visible" append-to="#modal-root" />
```

## Open/close via exposed methods

The component exposes `open(position?)` and `close()`:

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
  <button @click="modalRef?.open({ x: 100, y: 100 })">Open from a fixed point</button>
  <button @click="modalRef?.close()">Close</button>

  <Modal ref="modalRef" v-model="visible" />
</template>
```

If you don’t pass `position`, the modal will try to use the last click position captured before opening (see “Animations” below).

## Animations

### What it does

- Open: expands from the click position that triggered opening
- Close: collapses back to the same point

### How it works (high level)

- Captures global click coordinates (only while the modal is closed)
- Computes `transform-origin` as “click point relative to the modal container”
- Uses Vue `Transition` + CSS `scale()` for the expand/collapse effect

### Customizing

Override these classes in your app:

- `.modal-fade-enter-active`
- `.modal-fade-leave-active`
- `.modal-fade-enter-from`
- `.modal-fade-leave-to`

For best performance, keep changes focused on `opacity` and `transform`.

---

## API

### Import

```ts
import { Modal } from "vue3-modal"
```

### v-model

- `v-model:modelValue`: `boolean` (required)

### Props

| Name             | Type                    | Default      | Description                                                                     |
| ---------------- | ----------------------- | ------------ | ------------------------------------------------------------------------------- |
| `title`          | `string \| null`        | `'默认标题'` | Title. Set to `null` to remove the header (or use `#header` to fully customize) |
| `width`          | `string \| number`      | `'50%'`      | Width; numbers are treated as px                                                |
| `center`         | `boolean`               | `true`       | Vertically centered unless `top` is provided                                    |
| `top`            | `string \| number`      | `undefined`  | Distance from top; when not set and `center=false`, defaults to `15vh`          |
| `closeOnEsc`     | `boolean`               | `true`       | Allow closing via `Escape`                                                      |
| `closeOnOverlay` | `boolean`               | `true`       | Allow closing by clicking overlay (only meaningful when `overlay=true`)         |
| `lockScroll`     | `boolean`               | `true`       | Lock body scrolling while open (`document.body.style.overflow`)                 |
| `overlay`        | `boolean`               | `true`       | Show overlay; when `false`, overlay won’t block pointer events                  |
| `zIndex`         | `number`                | `2000`       | Overlay z-index                                                                 |
| `destroyOnClose` | `boolean`               | `false`      | Destroy content when closed                                                     |
| `draggable`      | `boolean`               | `false`      | Enable dragging (header-only)                                                   |
| `dragCloseReset` | `boolean`               | `false`      | Reset position after close (requires `draggable=true`)                          |
| `dragOverflow`   | `boolean`               | `false`      | Allow dragging beyond viewport                                                  |
| `appendTo`       | `string \| HTMLElement` | `'body'`     | Teleport target (selector or element)                                           |
| `footerButtons`  | `boolean`               | `true`       | Show the default footer buttons                                                 |

### Emits

| Event          | Payload | When                                     |
| -------------- | ------- | ---------------------------------------- |
| `open`         | —       | When `modelValue` becomes `true`         |
| `opened`       | —       | After enter transition finishes          |
| `close`        | —       | When `modelValue` becomes `false`        |
| `closed`       | —       | After leave transition finishes          |
| `closeOnEsc`   | —       | Right before closing due to `Esc`        |
| `clickOverlay` | —       | When overlay is clicked (`overlay=true`) |
| `cancel`       | —       | Clicking the default “Cancel” button     |
| `confirm`      | —       | Clicking the default “Confirm” button    |

### Slots

| Name          | Description                                     |
| ------------- | ----------------------------------------------- |
| `default`     | Main content                                    |
| `header`      | Replace the entire header                       |
| `title`       | Replace the title area inside default header    |
| `closeButton` | Replace close button content                    |
| `footer`      | Custom footer (replaces default footer buttons) |

> Note: the footer renders when `#footer` is provided OR `footerButtons=true`. If `footerButtons=false` and no `#footer` is provided, the footer is not rendered.

### Expose

- `open(position?: { x: number; y: number })`
- `close()`

---

## FAQ

### 1) `closeOnOverlay=true`, but clicking outside doesn’t close

Check:

- `overlay` must be `true` (default `true`)

When `overlay=false`, the overlay uses `pointer-events: none` to allow background interaction, so there’s nothing to click.

### 2) What if `center` and `top` are both set?

`top` wins:

- If `top` is set: it uses `top`
- Otherwise: if `center=true` it vertically centers; else defaults to `15vh`

### 3) Multiple modals and `lockScroll`

`lockScroll` directly writes `document.body.style.overflow`.

If multiple modals can be open at once:

- Prefer enabling `lockScroll` only on the top-most modal
- Or implement a global counter in your app

### 4) SSR compatibility

This component touches `window` / `document` during setup (global listeners + body scroll lock).

So it may throw in SSR (`window is not defined`) if rendered on the server.

Workarounds:

- Use it on client only (e.g. ClientOnly)
- Or dynamically import it in the browser

### 5) Drag position doesn’t reset after closing

Enable:

- `draggable=true`
- `dragCloseReset=true`
