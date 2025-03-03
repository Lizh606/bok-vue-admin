<template>
  <div class="tw-flex tw-h-full">
    <Menu v-model:isCollapse="isCollapse" />
    <div class="tw-flex tw-min-w-0 tw-flex-1 tw-flex-col">
      <Header v-model:isCollapse="isCollapse" />
      <RouterView class="tw-min-h-0 tw-flex-1 tw-bg-layout tw-p-6" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { RouterView } from "vue-router"
  import Header from "./Header.vue"

  import { ref } from "vue"
  import Menu from "./Menu.vue"
  const isCollapse = ref(false)
</script>

<style lang="scss"></style>
