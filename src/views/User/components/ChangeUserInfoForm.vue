<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="formRef"
    class="tw-max-h-[60vh] tw-overflow-auto"
  >
    <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
      <el-input v-model="form.username" autocomplete="off" />
    </el-form-item>
    <el-form-item label="昵称" :label-width="formLabelWidth" prop="loginName">
      <el-input v-model="form.loginName" autocomplete="off" />
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
    <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
      <el-input v-model="form.profile.phone" placeholder="请输入联系方式" />
    </el-form-item>
    <el-form-item label="地址" :label-width="formLabelWidth">
      <el-input
        v-model="form.profile.address"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="请输入地址"
      />
    </el-form-item>

    <el-form-item label="头像" :label-width="formLabelWidth" prop="avatar">
      <div class="tw-flex tw-w-full tw-flex-col tw-gap-3">
        <el-input
          v-model="form.profile.avatar"
          placeholder="请输入头像链接"
          class="tw-min-w-0 tw-flex-1"
        />
        <el-image
          v-if="form.profile.avatar"
          :src="form.profile.avatar"
          :preview-src-list="[form.profile.avatar]"
          fit="cover"
          class="tw-w-1/5 tw-cursor-pointer tw-rounded-full"
        >
          <template #error>
            <div
              class="tw-flex tw-w-1/3 tw-flex-col tw-items-center tw-justify-center tw-bg-gray-100 tw-text-gray-400"
            >
              <el-icon class="tw-mb-1 tw-text-xl"><Picture /></el-icon>
              <span class="tw-text-xs">加载失败</span>
            </div>
          </template>
        </el-image>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import type { Role, User, UserStatus } from "@/services/user"
  import { getRoleList } from "@/services/user"
  import { Picture } from "@element-plus/icons-vue"
  import { ElMessage } from "element-plus"
  import { onMounted, ref, watch } from "vue"

  interface FormData extends Omit<User, "roles"> {
    roles: number[]
    profile: {
      gender: string
      address: string
      avatar: string
      phone: string
    }
    loginName: string
    status: keyof typeof UserStatus
  }

  interface Props {
    currentFormData?: User
  }

  const props = defineProps<Props>()

  // 状态管理
  const formLabelWidth = ref(80)
  const isRolesLoading = ref(false)
  const roleList = ref<Role[]>([])
  const formRef = ref()

  // 表单初始值
  const initialForm: FormData = {
    username: "",
    password: "",
    loginName: "",
    status: 1,
    profile: {
      gender: "",
      address: "",
      avatar: "",
      phone: ""
    },
    roles: []
  }

  const form = ref<FormData>({ ...initialForm })

  // 表单验证规则
  const rules = {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    loginName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
    roles: [{ required: true, message: "请选择角色", trigger: "change" }]
  }

  // 方法
  const resetForm = () => {
    form.value = { ...initialForm }
    formRef.value?.resetFields()
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
        profile: newData.profile || {
          gender: "",
          address: "",
          avatar: "",
          phone: ""
        }
      }
    },
    { immediate: true }
  )

  // 向外暴露方法
  defineExpose({
    validate: () => formRef.value?.validate(),
    resetForm,
    form
  })

  onMounted(() => {
    loadRoleList()
  })
</script>
