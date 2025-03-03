import { usePreferredDark } from "@vueuse/core"
import { defineStore } from "pinia"
import { ref, watch } from "vue"

export enum SupportModeEnum {
  Light = "light",
  Dark = "dark",
  System = "system"
}
export const THEME_KEY = "data-theme"
export const useThemeStore = defineStore(
  "theme",
  () => {
    const theme = ref<SupportModeEnum>(SupportModeEnum.Light)
    const isDark = usePreferredDark()

    const updateDOMTheme = (currentTheme: SupportModeEnum) => {
      document.documentElement.setAttribute(THEME_KEY, currentTheme)
      document.documentElement.classList.toggle(
        "dark",
        currentTheme === SupportModeEnum.Dark
      )
    }

    const changeTheme = (value: SupportModeEnum) => {
      theme.value = value
      let currentTheme = value
      if (theme.value === SupportModeEnum.System) {
        currentTheme = isDark.value
          ? SupportModeEnum.Dark
          : SupportModeEnum.Light
      }
      updateDOMTheme(currentTheme)
    }

    // 监听系统主题变化
    watch(isDark, () => {
      if (theme.value === SupportModeEnum.System) {
        changeTheme(SupportModeEnum.System)
      }
    })

    const initTheme = () => {
      changeTheme(theme.value)
    }

    return { theme, changeTheme, initTheme }
  },
  {
    persist: true
  }
)
