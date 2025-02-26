<template>
  <div class="tw-flex tw-h-full">
    <Menu />
    <div class="tw-flex tw-min-w-0 tw-flex-1 tw-flex-col">
      <Header />
      <RouterView class="tw-bg-layout tw-min-h-0 tw-flex-1 tw-p-6" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { RouterView } from "vue-router"
  import Header from "./Header.vue"

  import Menu from "./Menu.vue" /* PartiallyEnd: #3632/scriptSetup.vue */
</script>

<style lang="scss"></style>
