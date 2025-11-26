<template>
  <div class="tw-flex tw-flex-col tw-gap-4">
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-text-2xl tw-font-bold tw-text-light">文章管理</div>
      <el-button type="primary" @click="openPostDialog('add')" v-if="isAdmin">
        <el-icon class="tw-mr-1"><Plus /></el-icon>新增文章
      </el-button>
    </div>

    <el-card class="tw-min-h-0 tw-flex-1" shadow="never">
      <div class="tw-mb-4">
        <el-alert
          v-if="!isAdmin"
          type="warning"
          :closable="false"
          class="tw-mb-4"
        >
          <template #title>
            <div class="tw-flex tw-items-center tw-gap-2">
              <el-icon><Warning /></el-icon>
              <span>访客提示</span>
            </div>
          </template>
          <div class="tw-mt-2">
            当前为游客访问模式，暂无查看编辑权限。您可以访问
            <el-link href="https://wanyue.me/" target="_blank" type="primary">
              🔗博客
            </el-link>
            查看已发布的文章。
          </div>
        </el-alert>
      </div>
      <div class="tw-min-h-0 tw-flex-1" ref="tableRef">
        <el-table
          :data="tableData"
          :height="tableHeight"
          stripe
          border
          style="width: 100%"
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
              <el-link
                @click="openPostDialog('edit', scope.row)"
                type="primary"
                class="tw-mr-2"
              >
                编辑
              </el-link>
              <el-link
                @click="openPostDialog('delete', scope.row)"
                type="danger"
              >
                删除
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tw-mt-4 tw-flex tw-justify-end">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalRef"
          v-model:page-size="pageSizeRef"
          v-model:current-page="pageRef"
          @update:current-page="handlePageChange"
          @update:page-size="handlePageSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import useTablePagination from "@/hooks/useTablePagination"
  import type { Post } from "@/services/posts"
  import { deletePost, getPostList } from "@/services/posts"
  import { getUserProfile, type Role } from "@/services/user"
  import { useAppStore } from "@/stores/app"
  import { openDeleteDialog } from "@/utils/openDialog"
  import { Plus, Warning } from "@element-plus/icons-vue"
  import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
  import { useRouter } from "vue-router"
  const { userInfo } = useAppStore()
  // table元素
  const tableRef = ref()
  // table高度
  const tableHeight = ref()

  const {
    tableData,
    pageRef,
    pageSizeRef,
    getTableData,
    totalRef,
    handlePageChange,
    handlePageSizeChange
  } = useTablePagination<Post>(getPostList, {
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
  const currentFormData = ref()
  const router = useRouter()
  const isAdmin = computed(() => {
    return userInfo.roles && userInfo.roles.some((item: Role) => item.id === 1)
  })
  const openPostDialog = (type: string, data?: any) => {
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
        openDeleteDialog({
          content: "确定删除该博文吗？",
          onDelete: async () => {
            await deletePost(data.id)
          },
          onSuccess: () => {
            getTableData()
          }
        })
        break
      default:
        break
    }
  }

  const updateTableHeight = () => {
    tableHeight.value = tableRef.value?.offsetHeight
  }

  onMounted(() => {
    updateTableHeight()
    window.addEventListener("resize", updateTableHeight)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateTableHeight)
  })
</script>

<style lang="scss" scoped>
  :deep(.el-card) {
    @apply tw-border-none tw-bg-base tw-p-4 tw-text-base tw-transition-[0.3s];
    .el-card__body {
      @apply tw-flex tw-h-full tw-flex-col tw-p-0;
    }
  }

  // :deep(.el-table) {
  //   @apply tw-overflow-hidden tw-rounded-lg;

  //   .el-table__header-wrapper {
  //     @apply tw-border-b tw-border-solid tw-border-base;
  //   }

  //   .el-button--link {
  //     @apply tw-px-2 tw-py-1 tw-font-bold;
  //   }
  // }

  :deep(.el-pagination) {
    .el-pagination__sizes {
      @apply tw-mr-4;
    }

    .el-pager li {
      @apply tw-rounded-md;

      &.is-active {
        @apply tw-bg-primary;
      }
    }
  }
</style>
