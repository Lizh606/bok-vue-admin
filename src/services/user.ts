import { del, get, post } from "@/utils/fetch"
import { BASE_URL } from "."
import type { ApiResult } from "./posts"
export interface Profile {
  id?: number
  gender?: string
  address?: string
  avatar?: string
  phone?: string
}
export interface Role {
  id: number
  name: string
}

export const UserStatus = {
  0: "禁用",
  1: "启用"
} as const
export interface User {
  id?: number
  username: string
  password: string
  loginName: string
  createTime?: string
  lastLoginTime?: string
  status: keyof typeof UserStatus
  roles?: Role[]
  profile?: Profile
}

export const getUserListByPage = async (params: {
  page: number
  size: number
}) => {
  return await get<ApiResult<User>>(
    `${BASE_URL}v1/user/page?page=${params.page}&size=${params.size}`
  )
}

export const addUser = async (params: User) => {
  return await post(`${BASE_URL}v1/user/create`, params)
}

export const updateUser = async (id: number, params: User) => {
  return await post(`${BASE_URL}v1/user/${id}`, params)
}

export const deleteUser = async (id: number) => {
  return await del(`${BASE_URL}v1/user/${id}`)
}
export const getRoleList = async () => {
  return await get<Role[]>(`${BASE_URL}roles/list`, {}, false)
}

export const getUserInfo = async () => {
  return await get(`${BASE_URL}v1/user/userInfo`, {}, false)
}

export const getUserProfile = async (id: number) => {
  return await get<User>(`${BASE_URL}v1/user/profile/${id}`, {}, false)
}

export const getGithubToken = async () => {
  return await get<{ data: string }>(
    `${BASE_URL}github/token`,
    {
      "Content-Type": "application/json"
    },
    false
  )
}

export const changeUserStatus = async (id: number) => {
  return await get(`${BASE_URL}v1/user/changeStatus/${id}`)
}
