import { post } from "@/utils/fetch"
import type { User } from "./user"

const resolveBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_APP_API
  if (!baseUrl || typeof baseUrl !== "string") {
    throw new Error(
      "[Config] Missing VITE_APP_API. Please configure the API base URL (e.g. https://api.example.com/)."
    )
  }
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
}

export const BASE_URL = resolveBaseUrl()

export const login = async (data: Partial<User>) => {
  return await post(`${BASE_URL}auth/signIn`, data)
}
