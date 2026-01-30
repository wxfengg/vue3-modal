import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

export default defineConfig({
  // 项目根目录（index.html 文件所在的位置）
  root: "./playground",
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Vue3Modal",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: { vue: "vue" },
      },
    },
  },
})
