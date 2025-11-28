<template>
  <div
    class="tw-flex tw-h-14 tw-items-center tw-justify-between tw-bg-base tw-pr-4 tw-shadow-sm"
  >
    <div class="tw-flex tw-h-full tw-items-center tw-gap-2">
      <div
        class="tw-flex tw-h-full tw-cursor-pointer tw-items-center tw-justify-center tw-border-l-0 tw-border-r tw-border-solid tw-border-r-gray-200 tw-px-3 tw-shadow-inner"
        @click="isCollapse = !isCollapse"
      >
        <el-icon size="20" class="tw-h-full">
          <Fold v-show="!isCollapse" />
          <Expand v-show="isCollapse" />
        </el-icon>
      </div>

      <el-icon size="20"><HomeFilled /></el-icon>

      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item
          v-for="breadCrumbItem in breadCrumbList"
          :key="breadCrumbItem.path"
          :to="breadCrumbItem.path"
        >
          {{ getBreadCrumbTitle(breadCrumbItem.meta.title) }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tw-flex tw-items-center tw-gap-6">
      <el-button type="success" size="small" @click="createPost">
        <el-icon><EditPen /></el-icon>
        {{ t("header.actions.createPost") }}
      </el-button>

      <el-dropdown @command="handleThemeChange">
        <el-icon size="20" class="tw-cursor-pointer">
          <component :is="themeIcon" />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="light" :icon="Sunny">
              {{ t("header.theme.light") }}
            </el-dropdown-item>
            <el-dropdown-item command="dark" :icon="Moon">
              {{ t("header.theme.dark") }}
            </el-dropdown-item>
            <el-dropdown-item command="system" :icon="Monitor">
              {{ t("header.theme.system") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-tooltip :content="t('header.tooltips.siteStats')" placement="bottom">
        <el-icon size="20" class="tw-cursor-pointer"><TrendCharts /></el-icon>
      </el-tooltip>

      <el-tooltip
        :content="t('header.tooltips.commentManagement')"
        placement="bottom"
      >
        <el-icon size="20" class="tw-cursor-pointer"><ChatDotRound /></el-icon>
      </el-tooltip>

      <el-tooltip
        :content="t('header.tooltips.visitWebsite')"
        placement="bottom"
      >
        <el-icon size="20" class="tw-cursor-pointer" @click="goToWebsite"
          ><Link
        /></el-icon>
      </el-tooltip>
      <div class="language-dropdown">
        <el-dropdown
          @command="handleLanguageSelect"
          trigger="click"
          placement="bottom-end"
        >
          <span class="language-dropdown__toggle">
            <img
              src="@/assets/translate.svg"
              alt="translate"
              class="language-dropdown__icon"
            />
            <!-- <span class="language-dropdown__label">
              {{ t("header.languageLabel") }}
            </span> -->
          </span>
          <template #dropdown>
            <el-dropdown-menu class="language-dropdown__menu">
              <el-dropdown-item
                v-for="option in languageOptions"
                :key="option.value"
                :command="option.value"
                :class="[
                  'language-dropdown__item',
                  { 'is-active': option.value === locale }
                ]"
              >
                <span class="language-dropdown__text">{{ option.label }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <el-dropdown>
        <div class="tw-flex tw-cursor-pointer tw-items-center tw-gap-2">
          <div class="tw-h-8 tw-w-8 tw-overflow-hidden tw-rounded-full">
            <img
              :src="userAvatar"
              class="tw-h-full tw-w-full tw-object-cover"
            />
          </div>
          <span class="tw-text-base">{{ loginName }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{
              t("header.dropdown.profile")
            }}</el-dropdown-item>
            <el-dropdown-item @click="logout">
              {{ t("header.dropdown.logout") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from "@/hooks/useI18n"
  import type { LocaleCode } from "@/locales/messages"
  import { useAppStore } from "@/stores/app"
  import { SupportModeEnum, useThemeStore } from "@/stores/theme"
  import {
    ArrowRight,
    ChatDotRound,
    EditPen,
    Expand,
    Fold,
    HomeFilled,
    Link,
    Monitor,
    Moon,
    Sunny,
    TrendCharts
  } from "@element-plus/icons-vue"
  import { computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  const isCollapse = defineModel<boolean>("isCollapse", {
    required: true,
    default: false
  })
  const route = useRoute()
  const router = useRouter()
  const breadCrumbList = computed(() => {
    return route.matched.filter((i) => i.meta.title)
  })
  const { t, locale, setLocale, locales } = useI18n()
  const getBreadCrumbTitle = (title?: unknown) => {
    const titleText = typeof title === "string" ? title : undefined
    if (!titleText) return ""
    return t(titleText, titleText)
  }
  const languageOptions = computed(() => {
    return locales.map((lang) => ({
      value: lang,
      label: t(`localeNames.${lang}`)
    }))
  })
  const handleLanguageSelect = (value: LocaleCode) => {
    setLocale(value)
  }
  const appStore = useAppStore()
  const userName = computed(() => {
    return appStore.userInfo.username
  })
  const loginName = computed(() => {
    return appStore.userInfo.loginName
  })
  const userAvatar = computed(() => {
    return (
      (appStore.userInfo.profile && appStore.userInfo.profile.avatar) ||
      new URL("@/assets/ava.jpg", import.meta.url).href
    )
  })
  const logout = () => {
    useAppStore().$patch({ token: undefined, userInfo: {} })
    router.push("/login")
  }
  const goToWebsite = () => {
    window.open("https://wanyue.me/", "_blank")
  }
  const createPost = () => {
    router.push("/article/edit")
  }

  // 主题相关
  const themeStore = useThemeStore()
  const themeIcon = computed(() => {
    switch (themeStore.theme) {
      case "light":
        return Sunny
      case "dark":
        return Moon
      case "system":
        return Monitor
      default:
        return Sunny
    }
  })

  const handleThemeChange = (command: SupportModeEnum) => {
    themeStore.changeTheme(command)
  }
</script>

<style lang="scss">
  .language-dropdown {
    @apply tw-flex tw-items-center tw-gap-2;

    &__toggle {
      @apply tw-flex tw-cursor-pointer tw-items-center tw-gap-1 tw-text-xs tw-font-medium tw-uppercase;
    }

    &__label {
      @apply tw-block tw-text-xs tw-font-medium;
    }

    &__icon {
      @apply tw-h-4 tw-w-4;
    }

    &__menu {
      @apply tw-rounded-lg tw-border tw-border-solid tw-border-base tw-shadow-lg;
    }

    &__item {
      @apply tw-flex tw-items-center tw-justify-between tw-gap-2;
    }

    &__item.is-active {
      @apply tw-border-l-2 tw-border-primary tw-bg-slate-50  tw-font-semibold tw-text-primary;
    }

    &__text {
      @apply tw-text-sm;
    }

    &__arrow {
      @apply tw-text-sm;
    }
  }
</style>
