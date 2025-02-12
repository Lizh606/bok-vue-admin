import { useAppStore } from "@/stores/app"
import { ElLoading, type LoadingOptions } from "element-plus"

const TOKEN = "access_token"
interface RequestOptions {
  method: string
  body?: string | FormData
  headers?: Record<string, string>
}
let loadingInstance: any
export const request = async (
  url: string,
  options: RequestOptions = { method: "GET" },
  loadingOptions?: LoadingOptions | false
): Promise<any> => {
  const isShowLoading = loadingOptions !== false
  if (isShowLoading) {
    const baseOptions = {
      target: document.body,
      text: "Loading……",
      fullscreen: false
    }
    loadingInstance = ElLoading.service({
      ...baseOptions,
      ...loadingOptions
    })
  }

  const appStore = useAppStore()
  try {
    const headers = options.headers || {
      "Content-Type": "application/json"
      // 您可以添加其他请求头
    }
    if (appStore.token) {
      headers.Authorization = `Bearer ${appStore.token}`
    }
    const response = await fetch(url, {
      method: options.method,
      headers,
      body: options.body
    })
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message)
    }

    if (result[TOKEN]) {
      const token = result[TOKEN]
      appStore.$patch({ token })
    }
    return result
  } catch (error: any) {
    throw error
  } finally {
    isShowLoading && loadingInstance.close()
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
  const defaultHeaders = {
    "Content-Type": "application/json"
  }
  return request(
    url,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: { ...defaultHeaders, ...headers }
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
  return request(
    url,
    { method: "PATCH", body: JSON.stringify(body), headers },
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
  body: string | FormData,
  headers?: Record<string, string>,
  loadingOptions?: LoadingOptions | false
): Promise<T> => {
  return request(url, { method: "PUT", body, headers }, loadingOptions)
}
