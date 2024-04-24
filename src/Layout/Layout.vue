<template>
  <div class="tw-h-full tw-flex">
    <div class="tw-w-1/5">
      <Menu />
    </div>
    <div class="tw-flex tw-flex-col tw-flex-1 tw-min-w-0">
      <Header />
      <RouterView class="tw-flex-1 tw-min-h-0 tw-bg-gray-100 tw-p-4" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './Header.vue'
import Menu from './Menu.vue'
</script>

<style lang="scss"></style>
