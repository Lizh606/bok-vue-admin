import type { Directive, DirectiveBinding } from "vue"
import { TrackEventEnum, trackService } from "../utils/TrackService"

// 曝光埋点指令
export const vTrackExposure: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (!binding.value) {
      console.warn("[v-track-exposure] 指令需要提供事件配置")
      return
    }

    const config = binding.value
    const event = config.event || TrackEventEnum.ELEMENT_EXPOSURE
    const properties = config.properties || {}
    const once = config.once !== false // 默认只触发一次
    const threshold = config.threshold || 0.5 // 默认50%可见
    const delay = config.delay || 500 // 默认曝光持续500ms才触发

    let timer: number | null = null
    let hasTracked = false

    // 创建观察者
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 元素进入可视区域
          if (entry.isIntersecting) {
            // 设置延迟，确保不是快速滚过
            timer = window.setTimeout(() => {
              if (hasTracked && once) return

              // 动态获取可能会变化的属性
              let dynamicProps = {}
              if (typeof config.getDynamicProps === "function") {
                try {
                  dynamicProps = config.getDynamicProps(el)
                } catch (err) {
                  console.error("[v-track-exposure] 获取动态属性失败:", err)
                }
              }

              // 发送曝光埋点
              trackService.track({
                event,
                properties: {
                  ...properties,
                  ...dynamicProps,
                  visibleRatio: entry.intersectionRatio,
                  element: el.tagName.toLowerCase(),
                  elementId: el.id || undefined,
                  elementClass: el.className || undefined,
                  position: getElementPosition(el)
                }
              })

              hasTracked = true

              // 如果只需触发一次，取消观察
              if (once) {
                observer.unobserve(el)
              }
            }, delay)
          } else {
            // 元素离开可视区域，取消延迟触发
            if (timer) {
              clearTimeout(timer)
              timer = null
            }
          }
        })
      },
      {
        threshold, // 可见比例阈值
        rootMargin: config.rootMargin || "0px" // 可提前或延迟触发
      }
    )

    // 开始观察
    observer.observe(el)

    // 保存引用以便清理
    el._trackExposure = {
      observer,
      timer
    }

    // 获取元素在页面中的位置信息
    function getElementPosition(el: HTMLElement) {
      const rect = el.getBoundingClientRect()
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      return {
        x: rect.left + scrollLeft,
        y: rect.top + scrollTop,
        width: rect.width,
        height: rect.height
      }
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 如果配置变化，重新设置观察者
    if (
      el._trackExposure &&
      JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue)
    ) {
      // 清理旧的观察者
      if (el._trackExposure.observer) {
        el._trackExposure.observer.disconnect()
      }

      if (el._trackExposure.timer) {
        clearTimeout(el._trackExposure.timer)
      }

      // 删除旧的引用
      delete el._trackExposure

      // 如果组件没有被卸载，重新挂载指令
      if (el.isConnected) {
        vTrackExposure.mounted!(el, binding)
      }
    }
  },

  unmounted(el: HTMLElement) {
    // 清理资源
    if (el._trackExposure) {
      if (el._trackExposure.observer) {
        el._trackExposure.observer.disconnect()
      }

      if (el._trackExposure.timer) {
        clearTimeout(el._trackExposure.timer)
      }

      delete el._trackExposure
    }
  }
}

// 检查IntersectionObserver兼容性
if (!("IntersectionObserver" in window)) {
  console.warn(
    "[v-track-exposure] 当前浏览器不支持IntersectionObserver API，曝光埋点将不可用"
  )
}
