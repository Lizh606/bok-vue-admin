<template>
  <div class="tw-flex tw-flex-col tw-bg-[#73AC9A] tw-py-4 tw-gap-4 tw-text-white">
    <!-- <el-radio-group v-model="isCollapse" class="tw-absolute tw-left-24">
      <el-radio-button :value="true">expand</el-radio-button>
      <el-radio-button :value="false">collapse</el-radio-button>
    </el-radio-group> -->
    <div class="tw-flex tw-items-center tw-justify-center tw-px-4">
      <div class="tw-w-full tw-flex tw-items-center tw-gap-2 tw-px-2" v-show="!isCollapse">
        <el-icon @click="isCollapse = !isCollapse">
          <WindPower class="tw-text-white tw-cursor-pointer" />
        </el-icon>
        <span class="tw-font-bold tw-text-xl">博客管理</span>
      </div>
      <el-icon @click="isCollapse = !isCollapse" v-show="isCollapse">
        <Expand class="tw-text-white tw-cursor-pointer" />
      </el-icon>
    </div>
    <el-menu
      active-text-color="#ffd04b"
      background-color="#73AC9A"
      class="tw-flex-1 tw-min-h-0 tw-w-[15vw]"
      :default-active="menuActive"
      :collapse="isCollapse"
      text-color="#fff"
      router
    >
      <el-menu-item v-for="item in menuList" :key="item.value" :index="item.value">
        <el-icon><setting /></el-icon>
        <span>{{ item.name }}</span>
      </el-menu-item>
    </el-menu>

    <div class="tw-flex tw-items-center tw-px-4 tw-gap-2">
      <div
        class="tw-w-8 tw-h-8 tw-rounded-full tw-overflow-hidden tw-border tw-border-[#eee] tw-border-solid tw-shadow-sm"
      >
        <img src="@/assets/ava.jpg" class="tw-w-full tw-h-full tw-object-cover" />
      </div>
      <span v-show="!isCollapse">{{ userName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { Expand, Setting, WindPower } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const isCollapse = ref(false)
const menuList = [
  {
    name: '总览',
    value: 'dashboard'
  },
  {
    name: '用户管理',
    value: 'user'
  },
  {
    name: '博文管理',
    value: 'article'
  }
]

const menuActive = computed(() => {
  return route.name
})
const appStore = useAppStore()
const userName = computed(() => {
  return appStore.userInfo.username
})
</script>

<style lang="scss">
.el-menu {
  border: none !important;
}
</style>
