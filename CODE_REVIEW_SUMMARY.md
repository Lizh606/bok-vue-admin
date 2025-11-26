# 代码审查总结（Vue3 + Vite）

## 核心问题概览
- **启动流程**：`main.ts` 在挂载前调用 `sleep(10)` 且未 `await`，既无延时效果又可能阻塞主线程，建议移除或替换为异步逻辑。【F:src/main.ts†L5-L19】
- **路由与鉴权**：`/role` 路由仍指向登录页且元信息为“用户管理”，与实际功能不符；全局前置守卫每次导航都重新请求用户信息，并在未授权时直接 `router.push` 而不终止 `next`，容易触发重复导航警告并产生多余的网络请求。【F:src/router/index.ts†L7-L93】
- **请求封装**：
  - `post/patch` 无条件将请求体 `JSON.stringify` 并强制 `Content-Type: application/json`，传入 `FormData`（如上传文件）会丢失 multipart 边界导致后端无法解析。【F:src/utils/fetch.ts†L69-L99】
  - 加载指示器复用模块级 `loadingInstance`，并发请求时后完成的请求会关闭先前的 Loading，剩余请求无 Loading 提示，建议改为计数或局部实例管理。【F:src/utils/fetch.ts†L10-L58】
- **表格分页**：`useTablePagination` 仅通过 `@update:page-size` 触发 `getTableData`，但未同步新的 `pageSize`，分页组件的 `:page-size` 始终是初始值，导致接口请求尺寸不变（用户和文章列表均受影响）。【F:src/hooks/useTablePagination.ts†L15-L37】【F:src/views/User/User.vue†L100-L110】【F:src/views/Post/Post.vue†L99-L108】
- **全局事件管理**：用户与文章列表组件在 `onMounted` 中直接重写 `window.onresize` 且未在卸载时清理，可能覆盖其他页面的 resize 逻辑并留下悬空引用；应改为 `addEventListener` 并在 `onBeforeUnmount` 中移除。【F:src/views/User/User.vue†L313-L318】【F:src/views/Post/Post.vue†L191-L196】
- **登录体验**：登录按钮在校验前即设置 `loading`，若表单校验失败不会重置，按钮会一直处于加载态；“游客访问”路径仍执行表单校验（需要用户名密码），导致访客按钮无法使用。应在校验前处理访客逻辑并确保校验失败时复位 `loading`。【F:src/views/Login/Login.vue†L95-L129】

## 风险与建议
- 优先修复鉴权守卫和请求封装，以避免线上导航异常和接口失败。
- 对分页钩子与使用场景做一次联调，确保页码与每页大小均双向绑定。
- 为全局事件和 Loading 增加清理/计数机制，提升在多页、并发场景下的稳定性。
- 调整登录流程，确保访客快捷入口和表单校验的交互一致。
