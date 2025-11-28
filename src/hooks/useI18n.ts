import { computed } from "vue"
import { useAppStore } from "@/stores/app"
import {
  DEFAULT_LOCALE,
  messages,
  supportedLocales
} from "@/locales/messages"
import type { LocaleCode } from "@/locales/messages"

const resolveMessage = (dictionary: Record<string, any>, path: string) => {
  const segments = path.split(".")
  let current: any = dictionary
  for (const segment of segments) {
    if (!current || typeof current !== "object") {
      return undefined
    }
    current = current[segment]
  }
  return typeof current === "string" ? current : undefined
}

export const useI18n = () => {
  const appStore = useAppStore()
  const locale = computed<LocaleCode>(
    () => (appStore.language || DEFAULT_LOCALE) as LocaleCode
  )

  const t = (path: string, fallback?: string) => {
    const currentLocale = locale.value
    let message =
      resolveMessage(messages[currentLocale], path) ??
      resolveMessage(messages[DEFAULT_LOCALE], path)
    if (!message) {
      return fallback ?? path
    }
    return message
  }

  const setLocale = (value: LocaleCode) => {
    appStore.language = value
  }

  return {
    t,
    locale,
    setLocale,
    locales: supportedLocales
  }
}
