import { post } from "@/utils/fetch"
import type { User } from "./user"

export const BASE_URL = import.meta.env.VITE_APP_API

export const login = async (data: User) => {
  return await post(`${BASE_URL}auth/signIn`, data)
}
