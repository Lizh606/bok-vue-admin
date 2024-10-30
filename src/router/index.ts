import { useAppStore } from '@/stores/app'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/Layout/Layout.vue'),
      redirect: { name: 'dashboard' },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/HomeView.vue'),
          meta: {
            title: '控制台'
          }
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/User/User.vue'),
          meta: {
            title: '用户管理'
          }
        },
        {
          path: '/role',
          name: 'role',
          component: () => import('@/views/Login'),
          meta: {
            title: '用户管理'
          }
        },
        {
          path: '/article',
          name: 'article',
          component: () => import('@/views/Post/Post.vue'),
          meta: {
            title: '博文管理'
          }
        },
        {
          path: '/article/edit',
          name: 'edit',
          component: () => import('@/views/Post/Edit.vue'),
          meta: {
            title: '博文编辑'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login')
    }
  ]
})
router.beforeEach((to, from) => {
  const store = useAppStore()

  if (!store.token && to.name !== 'login') {
    router.push({ name: 'login' })
  }
})
export default router
