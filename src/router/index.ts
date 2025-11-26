import { getUserInfo } from "@/services/user"
import { useAppStore } from "@/stores/app"
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/Layout/Layout.vue"),
      redirect: { name: "dashboard" },
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/views/Dashboard/Dashboard.vue"),
          meta: {
            title: "仪表盘"
          }
        },
        {
          path: "/user",
          name: "user",
          component: () => import("@/views/User/User.vue"),
          meta: {
            title: "用户管理"
          }
        },
        {
          path: "/role",
          name: "role",
          component: () => import("@/views/Role/Role.vue"),
          meta: {
            title: "角色管理"
          }
        },
        {
          path: "/article",
          name: "article",
          component: () => import("@/views/Post/PostLayout.vue"),
          meta: {
            title: "博文管理"
          },
          redirect: { name: "list" },
          children: [
            {
              path: "list",
              name: "list",
              component: () => import("@/views/Post/Post.vue"),
              meta: {
                title: "博文列表"
              }
            },
            {
              path: "edit",
              name: "edit",
              component: () => import("@/views/Post/PostEditor.vue"),
              meta: {
                title: "博文编辑"
              }
            }
          ]
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login")
    }
  ]
})
router.beforeEach(async (to, from, next) => {
  const store = useAppStore()
  if (to.name === "login") {
    next()
    return
  }

  if (!store.token) {
    next({ name: "login" })
    return
  }

  if (store.userInfo?.loginName) {
    next()
    return
  }

  try {
    const userInfo = await getUserInfo()
    if (userInfo) {
      store.$patch({ userInfo: userInfo })
      next()
      return
    } else {
      next({ name: "login" })
    }
  } catch (error) {
    next({ name: "login" })
  }
})
export default router
