<template>
  <el-dialog v-model="dialogShow" :title="props.title" width="500">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth">
        <el-select v-model="form.roles" multiple placeholder="请选择角色">
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
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
        <el-button @click="dialogShow = false">Cancel</el-button>
        <el-button type="primary" @click="handleAdd"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Profile, Role, User } from '@/services'
import { addUser, getRoleList, updateUser } from '@/services'
import { ElMessage } from 'element-plus'
import { onMounted, ref, watch } from 'vue'
import { USER_DIALOG_TITLE } from '../common'
const dialogShow = defineModel('show', { required: true })
const props = defineProps({
  title: {
    type: String,
    default: '新建用户'
  },
  currentFormData: {
    type: Object
  }
})
const emit = defineEmits(['updateList'])
const formLabelWidth = ref(80)
const form = ref<User>({
  username: '',
  password: '',
  profile: {
    gender: '',
    address: ''
  } as Profile,
  roles: []
})

watch(
  () => props.currentFormData,
  () => {
    if (props.currentFormData) {
      form.value = JSON.parse(JSON.stringify(props.currentFormData))
      form.value.password = ''
      if (!form.value.profile) {
        form.value.profile = {
          gender: '',
          address: ''
        } as Profile
      }
      const roleIds: number[] = []
      if (form.value.roles) {
        form.value.roles.forEach((i: Role) => {
          roleIds.push(i.id)
        })
      }
      form.value.roles = roleIds as any
    }
  },
  {
    immediate: true
  }
)
const roleList = ref<Role[]>([])
const formRef = ref()
onMounted(async () => {
  roleList.value = await getRoleList()
})
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const handleAdd = async () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (props.title === USER_DIALOG_TITLE.ADD) {
          await addUser(form.value)
        } else {
          await updateUser(form.value.id as number, form.value)
        }
        emit('updateList')
        dialogShow.value = false
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}
</script>

<style lang="scss"></style>
