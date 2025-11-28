import type { User } from "@/services/user"
import { defineStore } from "pinia"
import { ref } from "vue"
import { DEFAULT_LOCALE, type LocaleCode } from "@/locales/messages"
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
    const language = ref<LocaleCode>(DEFAULT_LOCALE)
    return { token, userInfo, language }
  },
  { persist: true }
)
