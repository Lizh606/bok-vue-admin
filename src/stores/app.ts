import type { User } from '@/services'
import { defineStore } from 'pinia'
import { ref } from 'vue'
type UserInfo = Pick<User, 'username'>
export const useAppStore = defineStore(
  'app',
  () => {
    const token = ref('')
    const userInfo = ref<UserInfo>({ username: '' })
    return { token, userInfo }
  },
  { persist: true }
)
