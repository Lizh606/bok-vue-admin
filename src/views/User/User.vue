<template>
  <div class="tw-flex tw-flex-col tw-gap-4">
    <div>
      <el-button type="primary" round @click="openDialog('add')">新增</el-button>
    </div>
    <div class="tw-flex-1 tw-min-h-0" ref="tableRef">
      <el-table :data="tableData" stripe border :height="tableHeight">
        <el-table-column prop="id" label="id" width="80" align="center" />
        <el-table-column prop="username" label="用户名" width="180" align="center" />
        <el-table-column label="角色" width="220" align="center">
          <template #default="scope">
            <div class="tw-flex tw-w-full tw-items-center tw-justify-center">
              <span>{{ scope.row.roles.map((i: Role) => i.name).join('、') }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="180" align="center" />
        <el-table-column prop="address" label="Address" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="openDialog('edit', scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="openDialog('delete', scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      layout="prev, pager, next"
      :total="totalRef"
      class="tw-flex tw-justify-end"
      v-model:page-size="pageSizeRef"
      v-model:current-page="pageRef"
      @update:current-page="getTableData"
      @update:page-size="getTableData"
    />
    <OperateDialog
      v-model:show="addDialog"
      :title="dialogTitle"
      :currentFormData="currentFormData"
      @updateList="getTableData"
    ></OperateDialog>
    <DeleteDialog
      v-model:show="deleteDialog"
      :currentFormData="currentFormData"
      @updateList="getTableData"
    ></DeleteDialog>
  </div>
</template>

<script setup lang="ts">
import useTablePagination from '@/hooks/useTablePagination'
import { getUserListByPage, type Role, type User } from '@/services'
import { onMounted, ref } from 'vue'
import { USER_DIALOG_TITLE } from './common'
import DeleteDialog from './dialogs/DeleteDialog.vue'
import OperateDialog from './dialogs/OperateDialog.vue'
// table元素
const tableRef = ref()
// table高度
const tableHeight = ref()

const FormatData = (data: User[]) => {
  return data.map((i: User) => {
    return { ...i.profile, ...i }
  })
}
const { tableData, pageRef, pageSizeRef, getTableData, totalRef } = useTablePagination<User>(
  getUserListByPage,
  { queryParams: { page: 1, size: 10 }, FormatData, immediate: true }
)
const addDialog = ref(false)
const deleteDialog = ref(false)
const dialogTitle = ref(USER_DIALOG_TITLE.ADD)
const currentFormData = ref()
const openDialog = (type: string, data?: any) => {
  if (data) {
    currentFormData.value = data
  }
  switch (type) {
    case 'add':
      dialogTitle.value = USER_DIALOG_TITLE.ADD
      addDialog.value = true
      break
    case 'edit':
      dialogTitle.value = USER_DIALOG_TITLE.EDIT
      addDialog.value = true
      break
    case 'delete':
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

<style lang="scss"></style>
