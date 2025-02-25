import type { App } from "vue"
import { trackService } from "../utils/TrackService"
import { vTrack } from "./TrackDirective"
import { vTrackExposure } from "./TrackExposureDirective"

// 导出埋点服务
export { trackService }

// 注册所有指令
export function registerTrackDirectives(app: App) {
  app.directive("track", vTrack)
  app.directive("track-exposure", vTrackExposure)

  return app
}
