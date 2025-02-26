<template>
  <div class="tw-bg-base tw-flex tw-flex-col tw-gap-4">
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-text-light tw-text-2xl tw-font-bold">用户管理</div>
      <el-button type="primary" @click="openDialog('add')" v-if="isAdmin">
        <el-icon class="tw-mr-1"><Plus /></el-icon>新增用户
      </el-button>
    </div>

    <el-card class="tw-min-h-0 tw-flex-1" shadow="never">
      <div class="tw-min-h-0 tw-flex-1" ref="tableRef">
        <el-table
          border
          :data="tableData"
          :height="tableHeight"
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <!-- <el-table-column width="80" align="center">
            <template #default="scope">
              <div class="tw-h-8 tw-w-8 tw-overflow-hidden tw-rounded-full">
                <img
                  :src="scope.row.avatar || '/src/assets/ava.jpg'"
                  class="tw-h-full tw-w-full tw-object-cover"
                />
              </div>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="username"
            label="用户名"
            width="150"
            align="center"
          />
          <el-table-column label="角色" width="250" align="center">
            <template #default="scope">
              <el-tag
                v-for="role in scope.row.roles"
                :key="role.id"
                class="tw-mx-1"
                :type="role.name === '管理员' ? 'danger' : 'info'"
              >
                {{ role.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="gender"
            label="性别"
            width="100"
            align="center"
          />
          <el-table-column prop="address" label="地址" />
          <!-- <el-table-column label="状态" width="100" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
              />
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="180" align="center">
            <template #default="scope">
              <el-button
                type="primary"
                link
                @click="openDialog('edit', scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                @click="openDialog('delete', scope.row)"
                v-if="isAdmin"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tw-mt-4 tw-flex tw-justify-end">
        <el-pagination
          background
          layout=" prev, pager, next"
          :total="totalRef"
          :page-size="pageSizeRef"
          v-model:current-page="pageRef"
          @update:current-page="getTableData"
          @update:page-size="getTableData"
        />
      </div>
    </el-card>

    <OperateDialog
      v-model:show="addDialog"
      :title="dialogTitle"
      :currentFormData="currentFormData"
      @updateList="getTableData"
    />
    <DeleteDialog
      v-model:show="deleteDialog"
      :currentFormData="currentFormData"
      @updateList="getTableData"
    />
  </div>
</template>

<script setup lang="ts">
  import useTablePagination from "@/hooks/useTablePagination"
  import { getUserListByPage, type Role, type User } from "@/services/user"
  import { useAppStore } from "@/stores/app"
  import { Plus } from "@element-plus/icons-vue"
  import { computed, onMounted, ref } from "vue"
  import { USER_DIALOG_TITLE } from "./common"
  import DeleteDialog from "./dialogs/DeleteDialog.vue"
  import OperateDialog from "./dialogs/OperateDialog.vue"

  // table元素
  const tableRef = ref()
  // table高度
  const tableHeight = ref()

  const FormatData = (data: User[]) => {
    return data.map((i: User) => {
      return { ...i.profile, ...i }
    })
  }
  const { tableData, pageRef, pageSizeRef, getTableData, totalRef } =
    useTablePagination<User>(getUserListByPage, {
      queryParams: { page: 1, size: 10 },
      FormatData,
      immediate: true
    })

  const isAdmin = computed(() => {
    const userInfo = useAppStore().userInfo
    return userInfo.roles && userInfo.roles.some((item: Role) => item.id === 1)
  })
  const addDialog = ref(false)
  const deleteDialog = ref(false)
  const dialogTitle = ref(USER_DIALOG_TITLE.ADD)
  const currentFormData = ref()
  const openDialog = (type: string, data?: any) => {
    if (data) {
      currentFormData.value = data
    } else {
      currentFormData.value = null
    }
    switch (type) {
      case "add":
        dialogTitle.value = USER_DIALOG_TITLE.ADD
        addDialog.value = true
        break
      case "edit":
        dialogTitle.value = USER_DIALOG_TITLE.EDIT
        addDialog.value = true
        break
      case "delete":
        deleteDialog.value = true
        break
      default:
        break
    }
  }

  // const handleStatusChange = async (row: User) => {
  //   try {
  //     // 这里添加修改用户状态的接口调用
  //     ElMessage.success("状态修改成功")
  //   } catch (error) {
  //     ElMessage.error("状态修改失败")
  //   }
  // }

  onMounted(() => {
    tableHeight.value = tableRef.value.offsetHeight
    window.onresize = () => {
      tableHeight.value = tableRef.value.offsetHeight
    }
  })
</script>

<style lang="scss" scoped>
  :deep(.el-card) {
    @apply tw-border-none tw-p-4 tw-text-base tw-transition-[0.3s];

    .el-card__body {
      @apply tw-flex tw-h-full tw-flex-col tw-p-0;
    }
  }
</style>
