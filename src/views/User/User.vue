<template>
  <div class="tw-flex tw-flex-col tw-gap-4 tw-bg-base">
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-text-2xl tw-font-bold tw-text-light">
        {{ t("user.title") }}
      </div>
      <el-button type="primary" @click="openUserDialog('add')" v-if="isAdmin">
        <el-icon class="tw-mr-1"><Plus /></el-icon>
        {{ t("user.button.add") }}
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
              <span>{{ t("user.alert.title") }}</span>
            </div>
          </template>
          <div class="tw-mt-2">
            {{ t("user.alert.content") }}
          </div>
        </el-alert>
      </div>
      <div class="tw-min-h-0 tw-flex-1" ref="tableRef">
        <el-table
          border
          :data="tableData"
          :height="tableHeight"
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            :label="t('user.table.id')"
            width="80"
            align="center"
          />
          <el-table-column
            width="80"
            align="center"
            :label="t('user.table.avatar')"
          >
            <template #default="scope">
              <div
                class="tw-flex tw-h-full tw-w-full tw-items-center tw-justify-center"
              >
                <div class="tw-h-8 tw-w-8 tw-overflow-hidden tw-rounded-full">
                  <el-image
                    z-index="99"
                    :teleported="true"
                    :src="scope.row.profile && scope.row.profile.avatar"
                    :preview-src-list="[
                      scope.row.profile && scope.row.profile.avatar
                    ]"
                    fit="cover"
                    class="tw-h-full tw-w-full tw-object-cover"
                  >
                    <template #error>
                      <div
                        class="tw-flex tw-w-1/3 tw-flex-col tw-items-center tw-justify-center tw-bg-gray-100 tw-text-gray-400"
                      >
                        <el-icon class="tw-mb-1 tw-text-xl"
                          ><Picture
                        /></el-icon>
                        <span class="tw-text-xs">
                          {{ t("userForm.message.imageLoadFailed") }}
                        </span>
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            :label="t('user.table.username')"
            width="150"
            align="center"
          />
          <el-table-column
            prop="loginName"
            :label="t('user.table.nickname')"
            width="150"
            align="center"
          />
          <el-table-column
            :label="t('user.table.role')"
            width="250"
            align="center"
          >
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
            :label="t('user.table.status')"
            width="100"
            align="center"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                :disabled="!isAdmin"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="lastLoginTime"
            :label="t('user.table.lastLogin')"
            width="180"
            align="center"
          />
          <el-table-column
            prop="createTime"
            :label="t('user.table.createdAt')"
            width="180"
            align="center"
          />

          <el-table-column
            :label="t('user.table.actions')"
            fixed="right"
            align="center"
            v-if="isAdmin"
          >
            <template #default="scope">
              <el-link
                @click="openUserDialog('edit', scope.row)"
                type="primary"
                class="tw-mr-2"
              >
                {{ t("user.operations.edit") }}
              </el-link>
              <el-link
                @click="openUserDialog('delete', scope.row)"
                type="danger"
              >
                {{ t("user.operations.delete") }}
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tw-mt-4 tw-flex tw-justify-end">
        <el-pagination
          background
          layout=" prev, pager, next"
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
  import {
    addUser,
    changeUserStatus,
    deleteUser,
    getUserListByPage,
    updateUser,
    type Role,
    type User
  } from "@/services/user"
  import { useAppStore } from "@/stores/app"
  import { openDeleteDialog, openDialog } from "@/utils/openDialog"
  import ChangeUserInfoForm from "@/views/User/components/ChangeUserInfoForm.vue"
  import { Plus, Warning } from "@element-plus/icons-vue"
  import { ElButton, ElMessage } from "element-plus"
  import { computed, h, onBeforeUnmount, onMounted, ref, type Ref } from "vue"
  import { USER_DIALOG_TITLE } from "./common"
  import { useI18n } from "@/hooks/useI18n"

  const { userInfo } = useAppStore()
  const { t } = useI18n()
  // table元素
  const tableRef = ref()
  // table高度
  const tableHeight = ref()

  const FormatData = (data: User[]) => {
    return data.map((i: User) => {
      return { ...i.profile, ...i }
    })
  }
  const {
    tableData,
    pageRef,
    pageSizeRef,
    getTableData,
    totalRef,
    handlePageChange,
    handlePageSizeChange
  } = useTablePagination<User>(getUserListByPage, {
    queryParams: { page: 1, size: 10 },
    FormatData,
    immediate: true
  })

  const isAdmin = computed(() => {
    return userInfo.roles && userInfo.roles.some((item: Role) => item.id === 1)
  })

  const dialogTitle = ref(USER_DIALOG_TITLE.ADD)
  const dialogTitleLabel = computed(() => t(dialogTitle.value))
  const currentFormData = ref()
  const isSubmitting = ref(false)

  const openUserDialog = (type: string, data?: any) => {
    dialogTitle.value =
      type === "add" ? USER_DIALOG_TITLE.ADD : USER_DIALOG_TITLE.EDIT
    switch (type) {
      case "add":
        dialogTitle.value = USER_DIALOG_TITLE.ADD
        break
      case "edit":
        dialogTitle.value = USER_DIALOG_TITLE.EDIT
        break
      case "delete":
        openDeleteDialog({
          title: t("user.dialog.deleteTitle"),
          content: t("user.dialog.deleteContent"),
          confirmText: t("common.confirm"),
          cancelText: t("common.cancel"),
          successMessage: t("user.message.deleteSuccess"),
          onDelete: async () => {
            await deleteUser(data.id)
          },
          onSuccess: () => {
            getTableData()
          }
        })
        break
    }
    if (type === "delete") return
    const { unMounted, instance } = openDialog(
      ChangeUserInfoForm,
      {
        currentFormData: data || currentFormData.value
      },
      {
        title: dialogTitleLabel.value,
        width: 500
      },
      {
        footer: () => {
          const confirmKey =
            dialogTitle.value === USER_DIALOG_TITLE.ADD
              ? "user.dialog.confirmAdd"
              : "user.dialog.confirmEdit"
          return h(
            "div",
            {
              class: "dialog-footer"
            },
            [
              h(
                ElButton,
                {
                  onClick: () => {
                    unMounted()
                    instance.value?.resetForm()
                  }
                },
                () => t("common.cancel")
              ),
              h(
                ElButton,
                {
                  type: "primary",
                  loading: isSubmitting.value,
                  onClick: async () => {
                    try {
                      await handleSubmit(instance)
                      unMounted()
                      instance.value?.resetForm()
                    } catch (error) {
                      console.error(error)
                    }
                  }
                },
                () => t(confirmKey)
              )
            ]
          )
        }
      }
    )
  }
  const handleSubmit = async (instance: Ref<any>) => {
    if (!instance.value) return

    try {
      const valid = await instance.value.validate()
      if (!valid) return
      isSubmitting.value = true
      const formData = instance.value.form as User

      if (dialogTitle.value === USER_DIALOG_TITLE.ADD) {
        await addUser(formData)
        ElMessage.success(t("user.message.addSuccess"))
      } else {
        await updateUser(formData.id as number, formData)
        ElMessage.success(t("user.message.updateSuccess"))
      }
      getTableData()
    } catch (error) {
      ElMessage.error(
        error instanceof Error ? error.message : t("user.message.operationFail")
      )
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  // 添加状态切换处理函数
  const handleStatusChange = async (row: User) => {
    try {
      await changeUserStatus(row.id as number)
      ElMessage.success(t("user.message.statusSuccess"))
    } catch (error) {
      ElMessage.error(t("user.message.statusFail"))
      // 恢复原状态
      row.status = row.status === 1 ? 0 : 1
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
    @apply tw-border-none tw-p-4 tw-text-base tw-transition-[0.3s];

    .el-card__body {
      @apply tw-flex tw-h-full tw-flex-col tw-p-0;
    }
  }
  :deep(.el-table__cell) {
    position: static !important;
  }
</style>
