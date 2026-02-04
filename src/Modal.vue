<script setup lang="ts">
import { ref, watch, computed, onUnmounted, nextTick } from "vue"

interface Props {
  /** 标题，默认值为："默认标题"。如果不需要弹窗的 header ，设置 title 为 null */
  title?: string | null
  /** 弹窗宽度 */
  width?: string | number
  /** 弹窗是否在页面垂直居中，如果设置了 top 则不生效 */
  center?: boolean
  /** 弹窗距离顶部的距离，如果没有设置 top 并且 center 为 false，top 默认为 15vh */
  top?: string | number
  /** 是否允许键盘Esc关闭弹窗，默认 true */
  closeOnEsc?: boolean
  /** 是否允许点击遮罩关闭弹窗，默认 true */
  closeOnOverlay?: boolean
  /** 是否锁定 body 滚动 */
  lockScroll?: boolean
  /** 是否需要遮罩 */
  overlay?: boolean
  /** 遮罩 z-index，默认 2000 */
  zIndex?: number
  /** 关闭时是否销毁内容，默认 false */
  destroyOnClose?: boolean
  /** 是否可以拖拽弹窗，默认 false */
  draggable?: boolean
  /** 关闭弹窗是否重置拖拽位置，默认 false */
  dragCloseReset?: boolean
  /** 拖动范围是否可以超出可视区，默认 false */
  dragOverflow?: boolean
  /** 弹窗挂载到哪个 DOM 元素，默认 body */
  appendTo?: string | HTMLElement
}
const props = withDefaults(defineProps<Props>(), {
  title: "默认标题",
  width: "50%",
  center: true,
  closeOnEsc: true,
  closeOnOverlay: true,
  lockScroll: true,
  overlay: true,
  zIndex: 2000,
  destroyOnClose: false,
  draggable: false,
  dragCloseReset: false,
  dragOverflow: false,
  appendTo: "body",
})

interface Emits {
  /** 使用 Esc 关闭弹窗之前触发的回调 */
  (e: "closeOnEsc"): void
  /** 点击遮罩触发的回调 */
  (e: "clickOverlay"): void
  /** 弹窗打开的回调 */
  (e: "open"): void
  /** 弹窗打开动画完成的回调 */
  (e: "opened"): void
  /** 弹窗关闭的回调 */
  (e: "close"): void
  /** 弹窗关闭动画完成的回调 */
  (e: "closed"): void
}
const emits = defineEmits<Emits>()

const visible = defineModel<boolean>("modelValue", { required: true })
watch(visible, (val) => {
  lockScroll(val)
  if (val) {
    emits("open")
  } else {
    emits("close")
  }
})

function handleClosed() {
  emits("closed")
  if (props.draggable && props.dragCloseReset) {
    resetDragPosition()
  }
  // 清理点击位置，避免下次打开时使用旧位置
  clickPosition.value = null
}

function lockScroll(isLock: boolean) {
  if (!props.lockScroll) return
  document.body.style.overflow = isLock ? "hidden" : ""
}

/** 点击遮罩 */
function handleClickOverlay() {
  if (!props.overlay) return
  emits("clickOverlay")
  // 如果开启允许点击遮罩关闭弹窗 则关闭弹窗
  if (visible.value && props.closeOnOverlay) handleClose()
}

// 点击遮罩关闭处理，预防点击弹窗内容时触发关闭
const isOverlayMouseDown = ref(false)
/** 更新遮罩点击状态 */
function handleOverlayMouseDown() {
  isOverlayMouseDown.value = true
}
/** 清理遮罩点击状态 */
function resetOverlayMouseDown() {
  if (!isOverlayMouseDown.value) return
  isOverlayMouseDown.value = false
}
/** 遮罩鼠标抬起事件 */
function handleOverlayMouseUp() {
  if (!isOverlayMouseDown.value) return
  resetOverlayMouseDown()
  handleClickOverlay()
}

/** 键盘事件（Esc关闭弹窗） */
function handleCloseOnEsc(e: KeyboardEvent) {
  if (e.key === "Escape" && visible.value && props.closeOnEsc) {
    emits("closeOnEsc")
    handleClose()
  }
}

// 弹窗拖拽功能
const modalPosition = ref({ x: 0, y: 0 })
let dragState: {
  startX: number
  startY: number
  initialX: number
  initialY: number
  startRect?: DOMRect
} | null = null

/** 弹窗开始移动（仅从 header 区域触发） */
function startDrag(e: MouseEvent) {
  if (!props.draggable) return

  const container = (e.target as HTMLElement).closest(".modal-container") as HTMLElement
  if (!container) return

  e.preventDefault()
  dragState = {
    startX: e.clientX,
    startY: e.clientY,
    initialX: modalPosition.value.x,
    initialY: modalPosition.value.y,
    startRect: !props.dragOverflow ? container.getBoundingClientRect() : undefined,
  }

  // 添加拖拽中的样式类（禁止文本选择）
  document.body.classList.add("modal-dragging")
  // 绑定 window 事件，确保鼠标移出弹窗也能继续拖拽
  window.addEventListener("mousemove", onDrag)
  window.addEventListener("mouseup", stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!dragState) return
  e.preventDefault()

  let moveX = e.clientX - dragState.startX
  let moveY = e.clientY - dragState.startY

  if (!props.dragOverflow) {
    const { left, right, top, bottom } = dragState.startRect as DOMRect

    const maxLeftMove = -left
    const maxRightMove = Math.max(0, window.innerWidth - right)
    const maxTopMove = -top
    const maxBottomMove = Math.abs(window.innerHeight - bottom)

    moveX = Math.min(Math.max(moveX, maxLeftMove), maxRightMove)
    moveY = Math.min(Math.max(moveY, maxTopMove), maxBottomMove)
  }

  modalPosition.value = {
    x: dragState.initialX + moveX,
    y: dragState.initialY + moveY,
  }
}

/** 弹窗停止移动 */
function stopDrag() {
  if (!dragState) return
  dragState = null
  document.body.classList.remove("modal-dragging")
  window.removeEventListener("mousemove", onDrag)
  window.removeEventListener("mouseup", stopDrag)
}

/** 弹窗内容区鼠标按下事件（阻止冒泡到遮罩） */
function handleModalMouseDown() {
  resetOverlayMouseDown()
}

/** 重置拖拽位置 */
function resetDragPosition() {
  const notInitial = modalPosition.value.x !== 0 || modalPosition.value.y !== 0
  if (props.draggable && notInitial) {
    modalPosition.value = { x: 0, y: 0 }
  }
}

/** 弹窗关闭入口 */
function handleClose() {
  visible.value = false
}

const width = computed(() => convertStringProps(props.width) || "50%")
const top = computed(() => convertStringProps(props.top))
function convertStringProps(prop: string | number | undefined) {
  let result = prop
  if (typeof result === "string") result = convertToNumber(result)
  return result
}

const overlayStyle = computed(() => {
  return props.overlay
    ? {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(4px)",
      }
    : {
        // 没有遮罩时，允许背景滚动且不阻挡点击事件
        backgroundColor: "transparent",
        pointerEvents: "none" as const,
      }
})

const modalStyle = computed(() => {
  const style: Record<string, string | number> = {
    width: typeof width.value === "number" ? `${width.value}px` : width.value,
  }

  // 优先级：top > center > default
  if (top.value) {
    style.marginTop = typeof top.value === "number" ? `${top.value}px` : top.value
  } else if (props.center) {
    style.margin = "auto 0"
  } else {
    style.marginTop = "15vh"
  }

  // 拖拽位置使用 CSS 变量，避免与动画 transform 冲突
  if (props.draggable) {
    style["--modal-x"] = `${modalPosition.value.x}px`
    style["--modal-y"] = `${modalPosition.value.y}px`
  }

  return style
})

/**
 * 将字符串转换成数字，如果失败/非纯数字返回原字符串
 * @param value 需要转换的字符串
 */
function convertToNumber(value: string) {
  if (typeof value !== "string") return value

  const str = value.trim()
  if (!str) return value

  const num = Number(str)
  return !Number.isNaN(num) && num.toString() === value ? num : value
}

// 点击位置，用于动画起点（自动捕获全局点击位置）
const clickPosition = ref<{ x: number; y: number } | null>(null)

/** 全局点击事件：记录每次点击的位置 */
function captureClickPosition(e: MouseEvent) {
  if (visible.value) return
  clickPosition.value = { x: e.clientX, y: e.clientY }
}

// 监听全局点击，捕获点击位置用于弹窗动画（passive 提升滚动性能）
window.addEventListener("click", captureClickPosition, { capture: true, passive: true })

/**
 * 打开弹窗（可选传入坐标覆盖自动捕获的位置）
 * @param position 可选的坐标对象，不传则使用自动捕获的点击位置
 */
function open(position?: { x: number; y: number }) {
  if (position) {
    clickPosition.value = { x: position.x, y: position.y }
  }
  visible.value = true
}

/**
 * 关闭弹窗
 */
function close() {
  visible.value = false
}

/**
 * 计算弹窗最终位置（用于动画 transform-origin 计算）
 */
function calcModalFinalPosition(containerWidth: number, containerHeight: number) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // 水平居中
  let finalLeft = (viewportWidth - containerWidth) / 2

  // 垂直位置：top > center > default(15vh)
  let finalTop: number
  if (top.value) {
    finalTop = typeof top.value === "number" ? top.value : Number.parseFloat(top.value as string) || 0
    if (typeof props.top === "string" && props.top.includes("vh")) {
      finalTop = (viewportHeight * Number.parseFloat(props.top)) / 100
    }
  } else if (props.center) {
    finalTop = (viewportHeight - containerHeight) / 2
  } else {
    finalTop = viewportHeight * 0.15
  }

  // 如果有拖拽偏移，需要加上偏移量
  if (props.draggable) {
    finalLeft += modalPosition.value.x
    finalTop += modalPosition.value.y
  }

  return { left: finalLeft, top: finalTop }
}

/**
 * 计算并设置 transform-origin，使动画从点击位置展开/收回
 * @param el overlay 元素
 * @param isEnter 是否是进入动画（进入时需要预计算最终位置）
 */
function setTransformOrigin(el: Element, isEnter = false) {
  const container = (el as HTMLElement).querySelector(".modal-container") as HTMLElement
  if (!container || !clickPosition.value) {
    container?.style.setProperty("transform-origin", "center center")
    return
  }

  let originX: number
  let originY: number

  if (isEnter) {
    // 进入动画：预计算弹窗最终位置
    const { left, top } = calcModalFinalPosition(container.offsetWidth, container.offsetHeight)
    originX = clickPosition.value.x - left
    originY = clickPosition.value.y - top
  } else {
    // 离开动画：使用当前实际位置
    const rect = container.getBoundingClientRect()
    originX = clickPosition.value.x - rect.left
    originY = clickPosition.value.y - rect.top
  }

  container.style.transformOrigin = `${originX}px ${originY}px`
}

/** Transition before-enter 钩子：设置动画起点 */
function handleBeforeEnter(el: Element) {
  nextTick(() => setTransformOrigin(el, true))
}

/** Transition before-leave 钩子：确保关闭动画使用相同的起点 */
function handleBeforeLeave(el: Element) {
  setTransformOrigin(el, false)
}

window.addEventListener("keydown", handleCloseOnEsc)
onUnmounted(() => {
  window.removeEventListener("keydown", handleCloseOnEsc)
  window.removeEventListener("click", captureClickPosition, { capture: true })
  // 确保拖拽相关事件也被清理
  stopDrag()
})

defineExpose({ open, close })
</script>

<template>
  <Teleport :to="appendTo">
    <Transition
      name="modal-fade"
      @before-enter="handleBeforeEnter"
      @after-enter="emits('opened')"
      @before-leave="handleBeforeLeave"
      @after-leave="handleClosed"
    >
      <div
        v-if="visible || !destroyOnClose"
        v-show="visible"
        class="overlay"
        :style="{ ...overlayStyle, zIndex }"
        @mousedown.self="handleOverlayMouseDown"
        @mouseup.self="handleOverlayMouseUp"
      >
        <div ref="modalRef" class="modal-container" :style="modalStyle" @mousedown="handleModalMouseDown">
          <header
            v-if="$slots.header || title"
            class="modal-header"
            :style="{ cursor: draggable ? 'move' : 'default' }"
            @mousedown="startDrag"
          >
            <slot name="header">
              <slot name="title">
                <div class="title">{{ title }}</div>
              </slot>

              <div class="close-button" @click="handleClose">
                <slot name="closeButton">
                  <svg
                    t="1769795459616"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="1931"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M572.91974805 512l242.82096754-242.82096757c16.30246778-16.30246778 16.30246778-43.75925563 0-60.91974802-16.30246778-16.30246778-43.75925563-16.30246778-60.91974802 0L512 451.08025195 269.17903243 208.25928441c-16.30246778-16.30246778-43.75925563-16.30246778-60.91974802 0-16.30246778 16.30246778-16.30246778 43.75925563 0 60.91974802L451.08025195 512l-242.82096754 242.82096757c-16.30246778 16.30246778-16.30246778 43.75925563 0 60.91974802 16.30246778 16.30246778 43.75925563 16.30246778 60.91974802 0l242.82096757-242.82096754 242.82096757 242.82096754c16.30246778 16.30246778 43.75925563 16.30246778 60.91974802 0 16.30246778-16.30246778 16.30246778-43.75925563 0-60.91974802L572.91974805 512z"
                      fill="#3A414B"
                      p-id="1932"
                    ></path>
                  </svg>
                </slot>
              </div>
            </slot>
          </header>
          <main class="modal-main">
            <slot />
          </main>
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-dragging {
  user-select: none;
  cursor: move !important;
}

.modal-dragging * {
  cursor: move !important;
}
</style>

<style scoped>
.overlay {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.modal-container {
  border-radius: 12px;
  background-color: #fff;
  pointer-events: auto;
  height: fit-content;
  margin-bottom: 50px;
  will-change: transform, opacity;
  /* 使用 CSS 变量实现拖拽位移，默认为 0 */
  --modal-x: 0px;
  --modal-y: 0px;
  transform: translate(var(--modal-x), var(--modal-y));
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 12px 12px 0 0;
}

.modal-header .title {
  font-size: 16px;
  font-weight: bold;
}

.modal-header .close-button {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
}

.modal-header .close-button:hover {
  color: #333;
  background-color: #ddd;
}

.modal-main {
  padding: 12px;
}

/* 动画样式 (Vue Transition) */
.modal-fade-enter-active {
  transition: opacity 0.25s ease-out;

  .modal-container {
    /* 弹性展开动画 */
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.modal-fade-leave-active {
  transition: opacity 0.2s ease-in;

  .modal-container {
    /* 收缩动画稍快，更干脆 */
    transition: transform 0.2s cubic-bezier(0.4, 0, 1, 1);
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-container {
    /* 组合 translate（拖拽位置）和 scale（动画缩放） */
    transform: translate(var(--modal-x), var(--modal-y)) scale(0.3);
  }
}
</style>
