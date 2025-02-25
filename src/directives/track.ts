import type { Directive, DirectiveBinding } from "vue"

export enum TrackEventEnum {
  // 时间相关
  PAGE_ENTER = "page_enter", // 页面进入
  PAGE_LEAVE = "page_leave", // 页面离开

  // 用户相关
  USER_LOGIN = "user_login", // 用户登录
  USER_LOGOUT = "user_logout", // 用户登出
  USER_REGISTER = "user_register", // 用户注册
  USER_PROFILE = "user_profile", // 用户信息查看

  // 点击事件描述
  BUTTON_CLICK = "button_click", // 按钮点击
  LINK_CLICK = "link_click", // 链接点击
  MENU_CLICK = "menu_click", // 菜单点击
  TAB_SWITCH = "tab_switch" // 标签切换
}

interface TrackEvent {
  event: TrackEventEnum
  properties: {
    user: string
    event: string
    time: string
  }
}

// 埋点处理函数
const handleTrack = (event: TrackEvent) => {
  // 这里可以根据实际需求调用你的埋点SDK
  console.log("Track event:", event)
}

export const track: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const value = binding.value as TrackEvent

    if (!value || !value.event) {
      console.warn("v-track directive requires an event name")
      return
    }

    el.addEventListener("click", () => {
      handleTrack(value)
    })
  },

  unmounted(el: HTMLElement, binding: DirectiveBinding) {
    // 清理事件监听器
    const value = binding.value as TrackEvent
    el.removeEventListener("click", () => {
      handleTrack(value)
    })
  }
}
