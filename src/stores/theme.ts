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

    const changeTheme = (value: SupportModeEnum) => {
      theme.value = value
      let currentTheme = value
      // 先判断是否跟随系统
      if (theme.value === SupportModeEnum.System) {
        currentTheme = isDark.value
          ? SupportModeEnum.Dark
          : SupportModeEnum.Light
      }
      document.documentElement.setAttribute(THEME_KEY, currentTheme)
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
