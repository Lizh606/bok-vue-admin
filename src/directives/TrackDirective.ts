import type { Directive, DirectiveBinding } from "vue"
import { TrackEvent, trackService } from "../utils/TrackService"

// 节流函数
function throttle(fn: Function, delay: number): Function {
  let lastCall = 0
  return function (...args: any[]) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn.apply(this, args)
    }
  }
}

// 点击埋点指令
export const vTrack: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (!binding.value) {
      console.warn("[v-track] 指令需要提供事件配置")
      return
    }

    const trackConfig = binding.value as TrackEvent | any
    const event =
      typeof trackConfig === "object" ? trackConfig.event : trackConfig
    const properties =
      typeof trackConfig === "object" ? trackConfig.properties || {} : {}
    const delay =
      typeof trackConfig === "object" ? trackConfig.delay || 300 : 300

    if (!event) {
      console.warn("[v-track] 埋点事件名称不能为空")
      return
    }

    // 创建埋点处理函数
    const handler = throttle(() => {
      // 动态获取可能会变化的属性
      let dynamicProps = {}

      // 如果配置了动态属性函数
      if (typeof trackConfig.getDynamicProps === "function") {
        try {
          dynamicProps = trackConfig.getDynamicProps(el)
        } catch (err) {
          console.error("[v-track] 获取动态属性失败:", err)
        }
      }

      // 合并所有属性
      const mergedProps = {
        ...properties,
        ...dynamicProps,
        element: el.tagName.toLowerCase(),
        elementId: el.id || undefined,
        elementClass: el.className || undefined,
        text: el.textContent?.trim().substring(0, 50) || undefined
      }

      trackService.track({
        event,
        properties: mergedProps
      })
    }, delay)

    // 绑定事件
    const eventType = binding.arg || "click"
    el.addEventListener(eventType, handler)

    // 保存引用以便清理
    el._trackHandler = {
      eventType,
      handler
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 如果埋点配置变化，更新处理
    if (
      el._trackHandler &&
      JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue)
    ) {
      // 移除旧的事件监听
      el.removeEventListener(
        el._trackHandler.eventType,
        el._trackHandler.handler
      )

      // 重新挂载
      const eventType = binding.arg || "click"
      const trackConfig = binding.value
      const event =
        typeof trackConfig === "object" ? trackConfig.event : trackConfig
      const properties =
        typeof trackConfig === "object" ? trackConfig.properties || {} : {}
      const delay =
        typeof trackConfig === "object" ? trackConfig.delay || 300 : 300

      // 创建新的处理函数
      const handler = throttle(() => {
        trackService.track({
          event,
          properties: {
            ...properties,
            element: el.tagName.toLowerCase(),
            text: el.textContent?.trim().substring(0, 50) || undefined
          }
        })
      }, delay)

      el.addEventListener(eventType, handler)

      // 更新引用
      el._trackHandler = {
        eventType,
        handler
      }
    }
  },

  unmounted(el: HTMLElement) {
    // 清理事件监听
    if (el._trackHandler) {
      el.removeEventListener(
        el._trackHandler.eventType,
        el._trackHandler.handler
      )
      delete el._trackHandler
    }
  }
}
