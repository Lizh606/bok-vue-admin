<template>
  <div class="tw-h-12 tw-flex tw-items-center tw-justify-between tw-p-2">
    <div class="tw-flex tw-gap-2 tw-items-center">
      <el-icon size="20"><HomeFilled /></el-icon>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="breadCrumbItem in breadCrumbList"
          :key="breadCrumbItem.path"
          :to="breadCrumbItem.path"
        >
          {{ breadCrumbItem.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tw-flex tw-gap-4 tw-items-center">
      <el-icon size="20"><ChatDotRound /></el-icon>
      <el-icon size="20"><Share /></el-icon>
      <div class="tw-w-10 tw-h-10 tw-rounded-full tw-overflow-hidden">
        <img src="@/assets/ava.jpg" class="tw-w-full tw-h-full tw-object-cover" />
      </div>
    </div>
  </div>
  <div class="tw-w-full tw-h-[1px] tw-bg-gray-200"></div>
</template>

<script setup lang="ts">
import { ChatDotRound, HomeFilled, Share } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const breadCrumbList = computed(() => {
  return route.matched.filter((i) => i.meta.title)
})
console.log(route)
</script>

<style lang="scss"></style>
