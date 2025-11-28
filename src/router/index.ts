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
            title: "route.dashboard"
          }
        },
        {
          path: "/user",
          name: "user",
          component: () => import("@/views/User/User.vue"),
          meta: {
            title: "route.user"
          }
        },
        {
          path: "/role",
          name: "role",
          component: () => import("@/views/Role/Role.vue"),
          meta: {
            title: "route.role"
          }
        },
        {
          path: "/article",
          name: "article",
          component: () => import("@/views/Post/PostLayout.vue"),
          meta: {
            title: "route.article"
          },
          redirect: { name: "list" },
          children: [
            {
              path: "list",
              name: "list",
              component: () => import("@/views/Post/Post.vue"),
              meta: {
                title: "route.list"
              }
            },
            {
              path: "edit",
              name: "edit",
              component: () => import("@/views/Post/PostEditor.vue"),
              meta: {
                title: "route.edit"
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
