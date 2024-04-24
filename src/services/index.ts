import { del, get, post } from '@/utils/fetch'
// export const BASE_URL = 'http://106.54.47.60:13000/'
console.log(import.meta.env)

export const BASE_URL = import.meta.env.VITE_APP_API
export interface Profile {
  id: number
  gender: string
  address: string
}
export interface Role {
  id: number
  name: string
}
export interface User {
  id?: number
  username: string
  password: string
  roles?: Role[]
  profile: Profile
}
export const login = async (data: User) => {
  return await post(`${BASE_URL}auth/signIn`, data)
}

export const getUserListByPage = async (params: { page: number; size: number }) => {
  return await get(`${BASE_URL}v1/user/page?page=${params.page}&size=${params.size}`)
}

export const addUser = async (params: User) => {
  return await post(`${BASE_URL}v1/user`, params)
}

export const updateUser = async (id: number, params: User) => {
  return await post(`${BASE_URL}v1/user/${id}`, params)
}

export const deleteUser = async (id: number) => {
  return await del(`${BASE_URL}v1/user/${id}`)
}
export const getRoleList = async () => {
  return await get(`${BASE_URL}roles`)
}
