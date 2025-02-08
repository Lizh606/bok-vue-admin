<template>
  <div class="tw-flex tw-flex-col tw-gap-4">
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-text-xl tw-font-bold">文章管理</div>
      <el-button type="primary" @click="openDialog('add')" v-if="isAdmin">
        <el-icon class="tw-mr-1"><Plus /></el-icon>新增文章
      </el-button>
    </div>

    <el-card class="tw-min-h-0 tw-flex-1" shadow="never">
      <div class="tw-min-h-0 tw-flex-1" ref="tableRef">
        <el-table
          :data="tableData"
          :height="tableHeight"
          stripe
          border
          style="width: 100%"
          :header-cell-style="{
            background: '#f8f9fa',
            color: '#495057',
            fontWeight: '600'
          }"
        >
          <el-table-column prop="id" label="序号" width="80" align="center" />
          <el-table-column
            prop="title"
            label="文章标题"
            min-width="300"
            align="left"
          />
          <el-table-column
            prop="userName"
            label="作者"
            width="160"
            align="center"
          />
          <el-table-column prop="sort" label="分类" width="160" align="center">
            <template #default="scope">
              <el-tag type="success" effect="light" round>
                {{ scope.row.sort }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="tag" label="标签" width="160" align="center">
            <template #default="scope">
              <el-tag type="warning" effect="light" round>
                {{ scope.row.tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="发布日期"
            width="180"
            align="center"
          />
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="180"
          >
            <template #default="scope">
              <el-button
                link
                type="primary"
                @click="openDialog('edit', scope.row)"
                >编辑</el-button
              >
              <el-button
                link
                type="danger"
                @click="openDialog('delete', scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tw-mt-4 tw-flex tw-justify-end">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalRef"
          :page-size="pageSizeRef"
          v-model:current-page="pageRef"
          @update:current-page="getTableData"
          @update:page-size="getTableData"
        />
      </div>
    </el-card>

    <DeleteDialog
      v-model:show="deleteDialog"
      :currentFormData="currentFormData"
      @updateList="getTableData"
    ></DeleteDialog>
  </div>
</template>

<script setup lang="ts">
  import useTablePagination from "@/hooks/useTablePagination"
  import type { Post } from "@/services/posts"
  import { getPostList } from "@/services/posts"
  import { onMounted, ref, computed, watch } from "vue"
  import DeleteDialog from "./dialogs/DeleteDialog.vue"
  import { Plus } from "@element-plus/icons-vue"
  import { useRouter } from "vue-router"
  import { useAppStore } from "@/stores/app"
  import { getUserProfile, type User } from "@/services"

  // table元素
  const tableRef = ref()
  // table高度
  const tableHeight = ref()

  const { tableData, pageRef, pageSizeRef, getTableData, totalRef } =
    useTablePagination<Post>(getPostList, {
      queryParams: { page: 1, size: 15 },
      immediate: true
    })
  watch(
    tableData,
    async (newVal) => {
      if (newVal.length === 0) return
      const userIds = [
        ...new Set(newVal.map((item) => item.userId))
      ] as number[]
      const userInfoMap = new Map()
      const userInfoList = await Promise.all(
        userIds.map((id) => getUserProfile(id))
      )
      userInfoList.forEach((user) => {
        userInfoMap.set(user.id, user)
      })
      newVal.forEach((item) => {
        item.userName = userInfoMap.get(item.userId)?.username || "未知用户"
      })
    },
    {
      deep: true,
      immediate: true
    }
  )
  const deleteDialog = ref(false)
  const currentFormData = ref()
  const router = useRouter()
  const isAdmin = computed(() => {
    const userInfo = useAppStore().userInfo
    return userInfo.roles && userInfo.roles.some((item) => item.id === 1)
  })
  const openDialog = (type: string, data?: any) => {
    currentFormData.value = data
    switch (type) {
      case "add":
        router.push("/article/edit")
        break
      case "edit":
        router.push({
          path: "/article/edit",
          query: { id: data.id }
        })
        break
      case "delete":
        deleteDialog.value = true
        break
      default:
        break
    }
  }

  onMounted(() => {
    tableHeight.value = tableRef.value.offsetHeight
    window.onresize = () => {
      tableHeight.value = tableRef.value.offsetHeight
    }
  })
</script>

<style lang="scss" scoped>
  :deep(.el-card) {
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    transition: 0.3s;
    padding: 16px;

    .el-card__body {
      padding: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .blog-btn {
    background-color: #3b82f6;
    border: none;
    padding: 10px 20px;
    font-weight: 500;

    &:hover {
      background-color: #2563eb;
    }
  }

  :deep(.el-table) {
    border-radius: 8px;
    overflow: hidden;

    .el-table__header-wrapper {
      border-bottom: 1px solid #e5e7eb;
    }

    .el-button--link {
      font-weight: 500;
      padding: 4px 8px;
    }
  }

  :deep(.el-pagination) {
    .el-pagination__sizes {
      margin-right: 16px;
    }

    .el-pager li {
      border-radius: 4px;

      &.is-active {
        background-color: #3b82f6;
      }
    }
  }
</style>
