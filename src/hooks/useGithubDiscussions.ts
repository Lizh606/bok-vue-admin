import { getGithubToken } from "@/services/user"
import { ref } from "vue"

// GitHub API 相关配置和类型定义
interface Author {
  login: string
  avatarUrl: string
}

interface Category {
  name: string
}

export interface Comment {
  id: string
  body: string
  createdAt: string
  author: Author
  discussionTitle: string
  category: Category
  discussionUrl: string
}
const GITHUB_API_URL = "https://api.github.com/graphql"
export function useGithubDiscussions() {
  const token = ref<string | null>(null)
  const discussions = ref<Comment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDiscussions = async () => {
    if (!token.value) {
      const res = await getGithubToken()
      token.value = res.data
    }
    loading.value = true
    error.value = null

    try {
      const query = `
        query {
          repository(owner: "lizh606", name: "bok-next-client") {
            discussions(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
              nodes {
                id
                title
                number
                comments(first: 10) {
                  nodes {
                    id
                    body
                    createdAt
                    author {
                      login
                      avatarUrl
                    }
                  }
                }
                category {
                  name
                }
              }
            }
          }
        }
      `
      const response = await fetch(GITHUB_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Vue-App"
        },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        throw new Error(`GitHub API 响应错误: ${response.status}`)
      }

      const data = await response.json()
      console.log(data)

      // 处理并扁平化评论数据
      const allComments = data.data.repository.discussions.nodes
        .filter((discussion: any) => !discussion.title.includes("[DEV]"))
        .flatMap((discussion: any) =>
          discussion.comments.nodes.map((comment: any) => ({
            ...comment,
            discussionTitle: discussion.title,
            category: discussion.category,
            discussionUrl: `https://github.com/lizh606/bok-next-client/discussions/${discussion.number}`
          }))
        )

      // 按时间排序并只取最新的10条评论
      discussions.value = allComments
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10)
    } catch (e) {
      error.value = e instanceof Error ? e.message : "获取评论列表失败"
    } finally {
      loading.value = false
    }
  }

  return {
    discussions,
    loading,
    error,
    fetchDiscussions
  }
}
