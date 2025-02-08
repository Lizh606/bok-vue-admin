<template>
  <div
    class="tw-flex tw-flex-col tw-gap-4 tw-bg-[#2c3e50] tw-py-4 tw-text-white"
  >
    <!-- <el-radio-group v-model="isCollapse" class="tw-absolute tw-left-24">
      <el-radio-button :value="true">expand</el-radio-button>
      <el-radio-button :value="false">collapse</el-radio-button>
    </el-radio-group> -->
    <div class="tw-flex tw-items-center tw-justify-center tw-px-4">
      <div
        class="tw-flex tw-w-full tw-items-center tw-gap-2 tw-px-2"
        v-show="!isCollapse"
      >
        <el-icon @click="isCollapse = !isCollapse">
          <WindPower class="tw-cursor-pointer tw-text-white" />
        </el-icon>
        <span class="tw-text-xl tw-font-bold">博客运维</span>
      </div>
      <el-icon @click="isCollapse = !isCollapse" v-show="isCollapse">
        <Expand class="tw-cursor-pointer tw-text-white" />
      </el-icon>
    </div>
    <el-menu
      active-text-color="#42b983"
      background-color="#2c3e50"
      class="tw-min-h-0 tw-w-[220px] tw-flex-1"
      :default-active="menuActive"
      :collapse="isCollapse"
      text-color="#fff"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="item in menuList"
        :key="item.value"
        :index="item.value"
      >
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.name }}</span>
      </el-menu-item>
    </el-menu>

    <div class="tw-flex tw-items-center tw-gap-2 tw-px-4">
      <div
        class="tw-flex tw-h-8 tw-w-8 tw-items-center tw-overflow-hidden tw-rounded-full tw-border tw-border-solid tw-border-[#eee] tw-shadow-sm"
      >
        <img
          src="@/assets/ava.jpg"
          class="tw-h-full tw-w-full tw-object-cover"
        />
      </div>
      <span v-show="!isCollapse">{{ userName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import router from "@/router"
  import { useAppStore } from "@/stores/app"
  import {
    Expand,
    WindPower,
    Histogram,
    Document,
    User
  } from "@element-plus/icons-vue"
  import { computed, ref } from "vue"
  import { useRoute } from "vue-router"
  const route = useRoute()
  const isCollapse = ref(false)
  const menuList = [
    {
      name: "仪表盘",
      value: "dashboard",
      icon: Histogram
    },
    {
      name: "博文管理",
      value: "article",
      icon: Document
    },
    {
      name: "用户管理",
      value: "user",
      icon: User
    }
    // {
    //   name: "系统设置",
    //   value: "settings",
    //   icon: "Platform"
    // }
  ]

  const menuActive = computed(() => {
    return route.matched[1].name
  })
  const appStore = useAppStore()
  const userName = computed(() => {
    return appStore.userInfo.username
  })
  const handleSelect = (index: string) => {
    router.push({ name: index })
  }
</script>

<style lang="scss">
  .el-menu {
    border: none !important;
  }
</style>
