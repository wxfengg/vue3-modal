---
layout: home
hero:
  image:
    src: /logosvg
    alt: vue3-modal
  name: vue3-modal
  text: A lightweight Vue 3 modal
  tagline: Elegant click-origin animations, Teleport support, and optional dragging.
  actions:
    - theme: brand
      text: Quick Start
      link: /en/guide/getting-started
    - theme: alt
      text: API
      link: /en/guide/getting-started#api
features:
  - title: Click-origin animations
    details: Captures your last click position (before opening) and uses it as transform-origin.
  - title: Configurable Teleport target
    details: Mount to body by default, or any container via appendTo.
  - title: Optional dragging
    details: Dragging starts from the header only, with optional viewport bounds.
  - title: Practical defaults
    details: Overlay click handling, scroll locking, destroyOnClose, zIndex, etc.
---

## Install

- `pnpm add vue3-modal`
- `npm i vue3-modal`
- `yarn add vue3-modal`

## What you’ll likely use

- `v-model:modelValue` (required)
- `appendTo` for Teleport
- `overlay` / `closeOnOverlay`
- `draggable` / `dragOverflow` / `dragCloseReset`

Next:

- [Quick Start](/en/guide/getting-started)
- [API](/en/guide/getting-started#api)
- [Animations](/en/guide/getting-started#animations)
