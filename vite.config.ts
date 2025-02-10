import vue from "@vitejs/plugin-vue"
import autoprefixer from "autoprefixer"
import { fileURLToPath, URL } from "node:url"
import tailwindcss from "tailwindcss"
import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { defineConfig } from "vite"
// https://vitejs.dev/config/
export default defineConfig({
  base: "/admin",
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  server: {
    port: 9096,
    cors: true, // 允许跨域
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
})
