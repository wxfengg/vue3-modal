import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  // 项目根目录（index.html 文件所在的位置）
  root: "./playground",
  plugins: [vue()],
})
