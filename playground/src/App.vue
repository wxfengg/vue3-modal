<script setup lang="ts">
import { ref } from "vue"
import { Modal } from "../../src/index.ts"

const visible1 = ref(false)
</script>

<template>
  <div class="app">
    <button class="button" @click="visible1 = true">基础弹窗</button>

    <Modal v-model="visible1" title="基础弹窗">
      <div>基础的弹窗</div>
    </Modal>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: system-ui, sans-serif;
}

.app {
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

.button:active {
  opacity: 0.7;
}
</style>
