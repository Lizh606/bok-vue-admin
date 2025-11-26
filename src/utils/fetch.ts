import { useAppStore } from "@/stores/app"
import { ElLoading, ElMessage, type LoadingOptions } from "element-plus"

const TOKEN = "access_token"
interface RequestOptions {
  method: string
  body?: BodyInit | null
  headers?: Record<string, string>
}
let loadingInstance: ReturnType<typeof ElLoading.service> | null = null
let loadingCount = 0
const DEFAULT_ERROR_MESSAGE = "网络异常，请稍后重试"

const createLoading = (loadingOptions?: LoadingOptions) => {
  const baseOptions = {
    target: document.body,
    text: "Loading……",
    fullscreen: false
  }
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      ...baseOptions,
      ...loadingOptions
    })
  }
  loadingCount += 1
}

const closeLoading = () => {
  if (!loadingInstance) return
  loadingCount = Math.max(loadingCount - 1, 0)
  if (loadingCount === 0) {
    loadingInstance.close()
    loadingInstance = null
  }
}

const buildBodyAndHeaders = (
  body: unknown,
  headers?: Record<string, string>
) => {
  const requestHeaders = { ...(headers || {}) }
  const isFormDataBody = body instanceof FormData
  const shouldStringify =
    body !== undefined && body !== null && !isFormDataBody && typeof body !== "string"

  if (shouldStringify && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json"
  }

  const requestBody = shouldStringify
    ? JSON.stringify(body)
    : ((body as BodyInit | null | undefined) ?? undefined)

  return { requestBody, requestHeaders }
}

const parseResponse = async (response: Response) => {
  if (response.status === 204) return null
  const rawText = await response.text()
  if (!rawText) return null

  try {
    return JSON.parse(rawText)
  } catch (error) {
    throw new Error("响应格式异常，请联系管理员")
  }
}

export const request = async (
  url: string,
  options: RequestOptions = { method: "GET" },
  loadingOptions?: LoadingOptions | false
): Promise<any> => {
  const isShowLoading = loadingOptions !== false
  if (isShowLoading) {
    createLoading(loadingOptions || undefined)
  }

  const appStore = useAppStore()
  try {
    const headers = { ...(options.headers || {}) }
    if (appStore.token) {
      headers.Authorization = `Bearer ${appStore.token}`
    }
    const response = await fetch(url, {
      method: options.method,
      headers,
      body: options.body
    })
    const result = await parseResponse(response)

    if (!response.ok) {
      const errorMessage = (result && (result.message as string)) || DEFAULT_ERROR_MESSAGE
      throw new Error(errorMessage)
    }

    if (result[TOKEN]) {
      const token = result[TOKEN]
      appStore.$patch({ token })
    }
    return result
  } catch (error: any) {
    console.error("[request] error:", error)
    ElMessage.error(error?.message || DEFAULT_ERROR_MESSAGE)
    throw error
  } finally {
    if (isShowLoading) {
      closeLoading()
    }
  }
}

export const get = <T>(
  url: string,
  headers?: Record<string, string>,
  loadingOptions?: LoadingOptions | false
): Promise<T> => {
  return request(url, { method: "GET", headers }, loadingOptions)
}

export const post = <T>(
  url: string,
  body: string | FormData | any,
  headers?: Record<string, string>,
  loadingOptions?: LoadingOptions | false
): Promise<T> => {
  const { requestBody, requestHeaders } = buildBodyAndHeaders(body, headers)
  return request(
    url,
    {
      method: "POST",
      body: requestBody,
      headers: requestHeaders
    },
    loadingOptions
  )
}
export const patch = <T>(
  url: string,
  body: string | FormData | any,
  headers?: Record<string, string>,
  loadingOptions?: LoadingOptions | false
): Promise<T> => {
  const { requestBody, requestHeaders } = buildBodyAndHeaders(body, headers)
  return request(
    url,
    { method: "PATCH", body: requestBody, headers: requestHeaders },
    loadingOptions
  )
}

export const del = <T>(
  url: string,
  headers?: Record<string, string>,
  loadingOptions?: LoadingOptions | false
): Promise<T> => {
  return request(url, { method: "DELETE", headers }, loadingOptions)
}

export const put = <T>(
  url: string,
  body: string | FormData | any,
  headers?: Record<string, string>,
  loadingOptions?: LoadingOptions | false
): Promise<T> => {
  const { requestBody, requestHeaders } = buildBodyAndHeaders(body, headers)
  return request(
    url,
    { method: "PUT", body: requestBody, headers: requestHeaders },
    loadingOptions
  )
}
