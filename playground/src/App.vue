<script setup lang="ts">
import { ref } from "vue"
import { Modal } from "../../src/index.ts"

const visible1 = ref(false)
const visible2 = ref(false)
const visible3 = ref(false)
const visible4 = ref(false)
const visible5 = ref(false)
const visible6 = ref(false)
const visible7 = ref(false)
const visible8 = ref(false)
const visible9 = ref(false)
const visible10 = ref(false)
const visible11 = ref(false)
const visible12 = ref(false)
const visible13 = ref(false)
</script>

<template>
  <div class="app">
    <button class="button" @click="visible1 = true">基础弹窗</button>
    <button class="button" @click="visible2 = true">无遮罩</button>
    <button class="button" @click="visible3 = true">拖拽</button>
    <button class="button" @click="visible4 = true">拖拽-关闭复位</button>
    <button class="button" @click="visible5 = true">关闭方式</button>
    <button class="button" @click="visible6 = true">center</button>
    <div style="cursor: pointer" @click="visible7 = true">文字触发</div>

    <!-- 四角按钮 -->
    <button class="button corner-btn" style="left: 10px; top: 10px" @click="visible8 = true">左上</button>
    <button class="button corner-btn" style="right: 10px; top: 10px" @click="visible10 = true">右上</button>
    <button class="button corner-btn" style="left: 10px; bottom: 10px" @click="visible11 = true">左下</button>
    <button class="button corner-btn" style="right: 10px; bottom: 10px" @click="visible9 = true">右下</button>

    <!-- 边缘中间按钮 -->
    <button
      class="button corner-btn"
      style="left: 50%; top: 10px; transform: translateX(-50%)"
      @click="visible12 = true"
    >
      上中
    </button>
    <button
      class="button corner-btn"
      style="left: 50%; bottom: 10px; transform: translateX(-50%)"
      @click="visible13 = true"
    >
      下中
    </button>

    <Modal v-model="visible1" title="基础弹窗" @cancel="visible1 = false" @confirm="visible1 = false">
      <h4>基础的弹窗演示</h4>
      <div>这是一个基础的弹窗，它很普通</div>
      <div>它预设了 footerButtons ，你如果不需要可以通过 footer 插槽覆盖或者设置 footerButtons 为 false去掉</div>
    </Modal>

    <Modal
      v-model="visible2"
      title="无遮罩弹窗"
      width="500"
      :overlay="false"
      :lock-scroll="false"
      :footer-buttons="false"
    >
      <h4>无遮罩弹窗演示</h4>
      <div>没有遮罩，像是一个悬浮窗。遮罩相关的API不生效</div>
    </Modal>

    <Modal v-model="visible3" title="拖拽弹窗" draggable>
      <h4>拖拽弹窗演示</h4>
      <div>可以在头部进行拖拽，如果没有 header 那么拖拽也无法使用</div>
    </Modal>

    <Modal v-model="visible4" title="拖拽弹窗" draggable drag-close-reset>
      <h4>拖拽弹窗演示</h4>
      <div>设置 dragCloseReset 关闭弹窗之后回到初始位置，否则保留上次拖拽的位置</div>
    </Modal>

    <Modal v-model="visible5" title="关闭方式" :close-on-overlay="false">
      <h4>关闭方式演示</h4>
      <div>默认可以点击 x / 遮罩 / Esc 关闭，遮罩和 Esc 可以配置为 false</div>
    </Modal>

    <Modal v-model="visible6" title="center" :center="false">
      <div>默认 center 为 true，弹窗会页面垂直居中，如果设置 top(默认15vh) 会覆盖 center</div>
      <div>如果 center 为 false 并且没有设置 top 默认也会设置 top(默认15vh)</div>
      <div style="height: 1800px; background-color: plum">占位</div>
    </Modal>

    <Modal v-model="visible7" title="文字触发" width="300" top="10vh" :footer-buttons="false" :close-on-esc="false">
      <div>如果 center 为 false 并且没有设置 top 默认也会设置 top(默认15vh)</div>
    </Modal>

    <Modal v-model="visible8" title="左上角" width="600">
      <div>弹窗自动从点击位置展开，关闭时收回到该位置</div>
      <div style="height: 300px; background-color: skyblue">占位</div>
    </Modal>

    <Modal v-model="visible9" title="右下角" width="500">
      <div>弹窗自动从点击位置展开，关闭时收回到该位置</div>
      <div style="height: 300px; background-color: darkgray">占位</div>
    </Modal>

    <Modal v-model="visible10" title="右上角" width="600">
      <div>弹窗自动从点击位置展开，关闭时收回到该位置</div>
      <div style="height: 300px; background-color: lightgreen">占位</div>
    </Modal>

    <Modal v-model="visible11" title="左下角" width="600">
      <div>弹窗自动从点击位置展开，关闭时收回到该位置</div>
      <div style="height: 300px; background-color: lightsalmon">占位</div>
    </Modal>

    <Modal v-model="visible12" title="上方中间" width="600" draggable>
      <div>弹窗自动从点击位置展开，关闭时收回到该位置</div>
      <div style="height: 300px; background-color: lightcoral">占位</div>
    </Modal>

    <Modal v-model="visible13" title="下方中间" width="600">
      <div>弹窗自动从点击位置展开，关闭时收回到该位置</div>
      <div style="height: 300px; background-color: mediumpurple">占位</div>
    </Modal>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  background-color: #edf2fa;
  overflow-x: hidden;
}

.app {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100vw;
  height: 100vh;
}

.button {
  padding: 12px 24px;
  border: none;
  background-color: #333;
  border-radius: 18px;
  color: white;
  cursor: pointer;
  transition: opacity 0.12s ease;
  font-size: 16px;
}

.button:hover {
  opacity: 0.8;
}
.button:active {
  opacity: 0.6;
}

.corner-btn {
  position: fixed;
  padding: 8px 16px;
  font-size: 14px;
}
</style>
