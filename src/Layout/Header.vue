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
          {{ breadCrumbItem.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tw-flex tw-items-center tw-gap-6">
      <el-button type="success" size="small" @click="createPost">
        <el-icon><EditPen /></el-icon>
        写文章
      </el-button>

      <el-dropdown @command="handleThemeChange">
        <el-icon size="20" class="tw-cursor-pointer">
          <component :is="themeIcon" />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="light" :icon="Sunny">
              亮色模式
            </el-dropdown-item>
            <el-dropdown-item command="dark" :icon="Moon">
              暗色模式
            </el-dropdown-item>
            <el-dropdown-item command="system" :icon="Monitor">
              跟随系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-tooltip content="站点统计" placement="bottom">
        <el-icon size="20" class="tw-cursor-pointer"><TrendCharts /></el-icon>
      </el-tooltip>

      <el-tooltip content="评论管理" placement="bottom">
        <el-icon size="20" class="tw-cursor-pointer"><ChatDotRound /></el-icon>
      </el-tooltip>

      <el-tooltip content="访问网站" placement="bottom">
        <el-icon size="20" class="tw-cursor-pointer" @click="goToWebsite"
          ><Link
        /></el-icon>
      </el-tooltip>

      <el-dropdown>
        <div class="tw-flex tw-cursor-pointer tw-items-center tw-gap-2">
          <div class="tw-h-8 tw-w-8 tw-overflow-hidden tw-rounded-full">
            <img
              src="@/assets/ava.jpg"
              class="tw-h-full tw-w-full tw-object-cover"
            />
          </div>
          <span class="tw-text-base">{{ userName }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  const appStore = useAppStore()
  const userName = computed(() => {
    return appStore.userInfo.username
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

<style lang="scss"></style>
