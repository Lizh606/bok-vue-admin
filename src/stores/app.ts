import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAPPStore = defineStore(
  'app',
  () => {
    const token = ref('')

    return { token }
  },
  { persist: true }
)
