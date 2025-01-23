<template>
  <div
    class="tw-flex tw-h-14 tw-items-center tw-justify-between tw-px-4 tw-shadow-sm"
  >
    <div class="tw-flex tw-items-center tw-gap-2">
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
          <span class="tw-text-gray-600">{{ userName }}</span>
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
  <div class="tw-h-[1px] tw-w-full tw-bg-gray-200"></div>
</template>

<script setup lang="ts">
  import { useAppStore } from "@/stores/app"
  import {
    ArrowRight,
    ChatDotRound,
    EditPen,
    HomeFilled,
    Link,
    TrendCharts
  } from "@element-plus/icons-vue"
  import { computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
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
    window.open("https://hang.izeper.icu/", "_blank")
  }
  const createPost = () => {
    router.push("/article/edit")
  }
</script>

<style lang="scss"></style>
