import type { User } from "@/services/user"
import { defineStore } from "pinia"
import { ref } from "vue"
type UserInfo = Pick<User, "username" | "roles" | "profile" | "loginName">
export const useAppStore = defineStore(
  "app",
  () => {
    const token = ref("")
    const userInfo = ref<UserInfo>({
      username: "",
      roles: [],
      loginName: "",
      profile: {
        avatar: ""
      }
    })
    return { token, userInfo }
  },
  { persist: true }
)
