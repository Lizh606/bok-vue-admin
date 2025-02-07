import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import { sleep } from "izeper-tool"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import "tailwindcss/tailwind.css"
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
sleep(10)
app.mount("#app")

// wangEditor支持markdown
import { Boot } from "@wangeditor/editor"
import markdownModule from "@wangeditor/plugin-md"

Boot.registerModule(markdownModule)
