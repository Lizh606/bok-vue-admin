<template>
  <el-dialog v-model="dialogShow" :title="props.title" width="500">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item
        label="用户名"
        :label-width="formLabelWidth"
        prop="username"
      >
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth" prop="roles">
        <el-select
          v-model="form.roles"
          multiple
          placeholder="请选择角色"
          :loading="isRolesLoading"
        >
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth">
        <el-radio-group v-model="form.profile.gender">
          <el-radio label="男" />
          <el-radio label="女" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地址" :label-width="formLabelWidth">
        <el-input
          v-model="form.profile.address"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="请输入地址"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="isSubmitting"
          v-if="isAdmin"
        >
          {{ props.title === USER_DIALOG_TITLE.ADD ? "确认添加" : "确认更新" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import type { Role, User } from "@/services/user"
  import { addUser, getRoleList, updateUser } from "@/services/user"
  import { useAppStore } from "@/stores/app"
  import { ElMessage } from "element-plus"
  import { computed, onMounted, ref, watch } from "vue"
  import { USER_DIALOG_TITLE } from "../common"

  interface FormData extends Omit<User, "roles"> {
    roles: number[]
    profile: {
      gender: string
      address: string
    }
  }

  // Props 类型定义
  interface Props {
    title: string
    currentFormData?: User
  }

  const dialogShow = defineModel("show", { required: true })
  const props = defineProps<Props>()
  const emit = defineEmits<{
    updateList: []
  }>()
  const isAdmin = computed(() => {
    const userInfo = useAppStore().userInfo
    return userInfo.roles && userInfo.roles.some((item: Role) => item.id === 1)
  })
  // 状态管理
  const formLabelWidth = ref(80)
  const isRolesLoading = ref(false)
  const isSubmitting = ref(false)
  const roleList = ref<Role[]>([])
  const formRef = ref()

  // 表单初始值
  const initialForm: FormData = {
    username: "",
    password: "",
    profile: {
      gender: "",
      address: ""
    },
    roles: []
  }

  const form = ref<FormData>({ ...initialForm })

  // 表单验证规则
  const rules = {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    roles: [{ required: true, message: "请选择角色", trigger: "change" }]
  }

  // 方法
  const resetForm = () => {
    form.value = { ...initialForm }
    formRef.value?.resetFields()
  }

  const closeDialog = () => {
    dialogShow.value = false
    resetForm()
  }

  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      const valid = await formRef.value.validate()
      if (!valid) return

      isSubmitting.value = true

      if (props.title === USER_DIALOG_TITLE.ADD) {
        await addUser(form.value as unknown as User)
        ElMessage.success("添加用户成功")
      } else {
        await updateUser(form.value.id as number, form.value as unknown as User)
        ElMessage.success("更新用户成功")
      }

      emit("updateList")
      closeDialog()
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : "操作失败")
    } finally {
      isSubmitting.value = false
    }
  }

  // 加载角色列表
  const loadRoleList = async () => {
    try {
      isRolesLoading.value = true
      roleList.value = await getRoleList()
    } catch (error) {
      ElMessage.error("获取角色列表失败")
    } finally {
      isRolesLoading.value = false
    }
  }

  // 监听表单数据变化
  watch(
    () => props.currentFormData,
    (newData) => {
      if (!newData) {
        resetForm()
        return
      }

      const roleIds = newData.roles?.map((role: Role) => role.id) || []
      form.value = {
        ...JSON.parse(JSON.stringify(newData)),
        password: "",
        roles: roleIds,
        profile: newData.profile || { gender: "", address: "" }
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    loadRoleList()
  })
</script>

<style lang="scss"></style>
