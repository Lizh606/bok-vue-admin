<template>
  <div class="tw-flex tw-flex-col tw-gap-4 tw-bg-base tw-py-4">
    <div class="tw-flex tw-items-center tw-justify-center tw-px-4">
      <div class="tw-flex tw-w-full tw-items-center tw-gap-2 tw-px-2">
        <el-icon size="20"><Setting class="tw-text-primary" /></el-icon>
        <span
          class="tw-text-2xl tw-font-bold tw-text-primary"
          v-show="!isCollapse"
          >{{ t("menu.title") }}</span
        >
      </div>
    </div>
    <el-menu
      class="tw-min-h-0 tw-w-[220px] tw-flex-1"
      :default-active="menuActive"
      :collapse="isCollapse"
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
        <span>{{ t(item.nameKey) }}</span>
      </el-menu-item>
    </el-menu>

    <div class="tw-flex tw-items-center tw-gap-2 tw-px-4">
      <div
        class="tw-flex tw-h-8 tw-w-8 tw-items-center tw-overflow-hidden tw-rounded-full tw-border tw-border-solid tw-border-base tw-shadow-sm"
      >
        <img
          src="@/assets/ava.jpg"
          class="tw-h-full tw-w-full tw-object-cover"
        />
      </div>
      <span v-show="!isCollapse">{{ t("menu.welcomeBack") }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import router from "@/router"
  import { Document, Histogram, Setting, User } from "@element-plus/icons-vue"
  import { computed } from "vue"
  import { useRoute } from "vue-router"
  import { useI18n } from "@/hooks/useI18n"
  const route = useRoute()
  const { t } = useI18n()
  const isCollapse = defineModel<boolean>("isCollapse", {
    required: true,
    default: false
  })
  const menuList = [
    {
      nameKey: "menu.items.dashboard",
      value: "dashboard",
      icon: Histogram
    },
    {
      nameKey: "menu.items.article",
      value: "article",
      icon: Document
    },
    {
      nameKey: "menu.items.user",
      value: "user",
      icon: User
    }
  ]

  const menuActive = computed(() => {
    return route.matched[1].name
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
