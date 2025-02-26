<script setup lang="ts">
  import { useThemeStore } from "@/stores/theme"
  import { RouterView } from "vue-router"
  const themeStore = useThemeStore()
  themeStore.initTheme()
</script>

<template>
  <RouterView />
</template>

<style>
  html,
  body {
    height: 100%;
    margin: auto;
    @apply tw-text-base;
  }
</style>
