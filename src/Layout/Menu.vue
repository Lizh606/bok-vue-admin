<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="tw-h-full"
    :default-active="menuActive"
    text-color="#fff"
    @select="handleOpen"
  >
    <el-menu-item index="dashboard">
      <el-icon><setting /></el-icon>
      <span>控制台</span>
    </el-menu-item>
    <el-menu-item index="user">
      <el-icon><setting /></el-icon>
      <span>用户管理</span>
    </el-menu-item>
    <el-menu-item index="role">
      <el-icon><setting /></el-icon>
      <span>角色管理</span>
    </el-menu-item>
    <el-menu-item index="article">
      <el-icon><setting /></el-icon>
      <span>文章管理</span>
    </el-menu-item>
    <!-- <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <span>内容管理</span>
    </el-menu-item> -->
  </el-menu>
</template>

<script setup lang="ts">
import router from '@/router'
import { Setting } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  router.push({ name: key })
}
const menuActive = computed(() => {
  return route.name
})
</script>

<style lang="scss"></style>
