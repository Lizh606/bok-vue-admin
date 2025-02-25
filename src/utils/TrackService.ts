// 埋点事件类型枚举
export enum TrackEventEnum {
  // 页面相关
  PAGE_ENTER = "page_enter",
  PAGE_LEAVE = "page_leave",

  // 用户相关
  USER_LOGIN = "user_login",
  USER_LOGOUT = "user_logout",
  USER_REGISTER = "user_register",

  // 交互相关
  BUTTON_CLICK = "button_click",
  LINK_CLICK = "link_click",
  MENU_CLICK = "menu_click",
  TAB_SWITCH = "tab_switch",

  // 内容相关
  ELEMENT_EXPOSURE = "element_exposure",
  CONTENT_VIEW = "content_view",
  VIDEO_PLAY = "video_play",
  VIDEO_PAUSE = "video_pause",

  // 表单相关
  FORM_SUBMIT = "form_submit",
  INPUT_CHANGE = "input_change"
}

// 埋点数据接口
export interface TrackEvent {
  event: TrackEventEnum | string
  properties: Record<string, any>
}

// 埋点批处理配置
interface BatchConfig {
  enable: boolean // 是否启用批处理
  maxSize: number // 最大批量大小
  interval: number // 发送间隔(ms)
}

export class TrackService {
  private queue: TrackEvent[] = []
  private timer: number | null = null
  private batchConfig: BatchConfig

  constructor(options?: {
    batchConfig?: Partial<BatchConfig>
    debug?: boolean
  }) {
    this.batchConfig = {
      enable: true,
      maxSize: 10,
      interval: 5000,
      ...options?.batchConfig
    }

    this.debug = options?.debug || false

    // 页面隐藏或关闭时发送数据
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flush()
      }
    })

    window.addEventListener("beforeunload", () => {
      this.flush()
    })
  }

  private debug: boolean

  /**
   * 追踪事件
   */
  public track(event: TrackEvent): void {
    if (!event.event) {
      console.warn("[TrackService] 埋点事件名称不能为空")
      return
    }

    // 添加公共属性
    const trackData: TrackEvent = {
      ...event,
      properties: {
        ...event.properties,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        referrer: document.referrer || ""
      }
    }

    if (this.debug) {
      console.log("[TrackService] 埋点事件:", trackData)
    }

    // 批处理逻辑
    if (this.batchConfig.enable) {
      this.queue.push(trackData)

      if (this.queue.length >= this.batchConfig.maxSize) {
        this.flush()
      } else if (!this.timer) {
        this.timer = window.setTimeout(
          () => this.flush(),
          this.batchConfig.interval
        )
      }
    } else {
      this.sendData([trackData])
    }
  }

  /**
   * 立即发送队列中的所有事件
   */
  public flush(): void {
    if (this.queue.length === 0) return

    const data = [...this.queue]
    this.queue = []

    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    this.sendData(data)
  }

  /**
   * 发送数据到服务器
   */
  private sendData(events: TrackEvent[]): void {
    if (events.length === 0) return

    // 首选 sendBeacon API
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(events)], {
        type: "application/json"
      })
      const success = navigator.sendBeacon("/api/track", blob)

      if (success) {
        if (this.debug) {
          console.log("[TrackService] 使用 sendBeacon 发送成功")
        }
        return
      }
    }

    // 降级方案：使用 fetch API
    fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(events),
      keepalive: true // 确保请求在页面关闭后继续
    }).catch((err) => {
      if (this.debug) {
        console.error("[TrackService] 发送埋点数据失败:", err)
      }

      // 极端情况下使用图片请求
      const img = new Image()
      img.src = `/api/track-fallback?data=${encodeURIComponent(JSON.stringify(events))}&t=${Date.now()}`
    })
  }

  /**
   * 页面进入埋点
   */
  public trackPageEnter(pageInfo: Record<string, any> = {}): void {
    this.track({
      event: TrackEventEnum.PAGE_ENTER,
      properties: {
        title: document.title,
        path: window.location.pathname,
        ...pageInfo
      }
    })
  }

  /**
   * 页面离开埋点
   */
  public trackPageLeave(pageInfo: Record<string, any> = {}): void {
    const duration = performance.now()

    this.track({
      event: TrackEventEnum.PAGE_LEAVE,
      properties: {
        title: document.title,
        path: window.location.pathname,
        duration, // 页面停留时间(ms)
        ...pageInfo
      }
    })
  }
}

// 导出单例
export const trackService = new TrackService({
  debug: import.meta.env.NODE_ENV !== "production",
  batchConfig: {
    enable: true,
    maxSize: 10,
    interval: 5000
  }
})

// 自动记录页面进入
window.addEventListener("load", () => {
  trackService.trackPageEnter()
})

// 自动记录页面离开
window.addEventListener("beforeunload", () => {
  trackService.trackPageLeave()
})
