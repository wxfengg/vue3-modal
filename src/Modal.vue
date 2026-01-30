<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from "vue"

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
// const modalRef = useTemplateRef("modalRef")
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

  // 如果拖拽则使用计算位置
  if (props.draggable) {
    style.transform = `translate(${modalPosition.value.x}px, ${modalPosition.value.y}px)`
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

window.addEventListener("keydown", handleCloseOnEsc)
onUnmounted(() => {
  window.removeEventListener("keydown", handleCloseOnEsc)
  // 确保拖拽相关事件也被清理
  stopDrag()
})
</script>

<template>
  <Teleport :to="appendTo">
    <Transition name="modal-fade" @after-enter="emits('opened')" @after-leave="handleClosed">
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
              <slot name="closeButton">
                <div class="close-button" @click="handleClose">✖</div>
              </slot>
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
}

.modal-container {
  border-radius: 12px;
  background-color: #fff;
  pointer-events: auto;
  height: fit-content;
  margin-bottom: 50px;
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
  font-weight: normal;
  font-size: 16px;
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
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease-in-out;

  .modal-container {
    transition: transform 0.3s ease-out;
  }
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.1);
  }
}
</style>
