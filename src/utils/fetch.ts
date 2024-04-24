import { useAPPStore } from '@/stores/app'

const TOKEN = 'access_token'
interface RequestOptions {
  method: string
  body?: string | FormData
  headers?: Record<string, string>
}

export const request = async (
  url: string,
  options: RequestOptions = { method: 'GET' }
): Promise<any> => {
  const appStore = useAPPStore()
  try {
    const headers = options.headers || {
      'Content-Type': 'application/json'
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
  }
}

export const get = (url: string, headers?: Record<string, string>): Promise<any> => {
  return request(url, { method: 'GET', headers })
}

export const post = (
  url: string,
  body: string | FormData | any,
  headers?: Record<string, string>
): Promise<any> => {
  return request(url, { method: 'POST', body: JSON.stringify(body), headers })
}
export const patch = (
  url: string,
  body: string | FormData | any,
  headers?: Record<string, string>
): Promise<any> => {
  return request(url, { method: 'PATCH', body: JSON.stringify(body), headers })
}

export const del = (url: string, headers?: Record<string, string>): Promise<any> => {
  return request(url, { method: 'DELETE', headers })
}

export const put = (
  url: string,
  body: string | FormData,
  headers?: Record<string, string>
): Promise<any> => {
  return request(url, { method: 'PUT', body, headers })
}
