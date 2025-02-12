import { del, get, patch, post } from "@/utils/fetch"
import { BASE_URL } from "."

export interface ApiResult<T> {
  data: T[]
  total: number
}
export type Post = {
  id?: number
  userId?: number
  userName?: string
  title: string
  content: string
  tag: string
  sort: string
  date: string
  description: string
}
export type Posts = Post[]
export type SortStatistics = {
  sort: string
  count: number
}
export type PostStatistics = {
  total: number
  sortStatistics: SortStatistics[]
}
export const addPost = async (params: Post, loadingTarget?: HTMLElement) => {
  return await post(
    `${BASE_URL}posts/create`,
    params,
    {
      "Content-Type": "application/json"
    },
    { target: loadingTarget || document.body }
  )
}

export const getPostList = async (
  params: { page: number; size: number },
  loadingTarget?: HTMLElement
) => {
  return await get<ApiResult<Post>>(
    `${BASE_URL}posts/list?page=${params.page}&size=${params.size}`,
    {},
    { target: loadingTarget || document.body }
  )
}

export const updatePost = async (
  id: number,
  params: Post,
  loadingTarget?: HTMLElement
) => {
  return await patch(
    `${BASE_URL}posts/${id}`,
    params,
    {
      "Content-Type": "application/json"
    },
    { target: loadingTarget || document.body }
  )
}

export const deletePost = async (id: number, loadingTarget?: HTMLElement) => {
  return await del(
    `${BASE_URL}posts/${id}`,
    {},
    { target: loadingTarget || document.body }
  )
}

export const getPostDetail = async (
  id: number,
  loadingTarget?: HTMLElement
) => {
  return await get<Post>(
    `${BASE_URL}posts/${id}`,
    {},
    { target: loadingTarget || document.body }
  )
}

export const getPostStatistics = async () => {
  return await get<PostStatistics>(`${BASE_URL}posts/statistics`)
}
