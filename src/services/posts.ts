import { del, get, patch, post } from '@/utils/fetch'
import { BASE_URL } from '.'
export type Post = {
  id?: number
  title: string
  content: string
  tag: string
  sort: string
  date: string
  description: string
}
export const addPost = async (params: Post) => {
  return await post(`${BASE_URL}posts`, params)
}

export const getPostList = async (params: { page: number; size: number }) => {
  return await get(`${BASE_URL}posts?page=${params.page}&size=${params.size}`)
}

export const updatePost = async (id: number, params: Post) => {
  return await patch(`${BASE_URL}posts/${id}`, params)
}

export const deletePost = async (id: number) => {
  return await del(`${BASE_URL}posts/${id}`)
}
