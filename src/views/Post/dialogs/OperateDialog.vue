<template>
  <el-dialog v-model="dialogShow" :title="props.title" width="500">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
        <el-input v-model="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="分类" :label-width="formLabelWidth" prop="sort">
        <el-input v-model="form.sort" type="sort" placeholder="请输入分类" />
      </el-form-item>
      <el-form-item label="标签" :label-width="formLabelWidth">
        <el-input v-model="form.tag" placeholder="请输入标签" />
      </el-form-item>
      <el-form-item label="日期" :label-width="formLabelWidth" prop="date">
        <el-date-picker
          v-model="form.date"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetime"
          placeholder="Select date and time"
        />
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="form.description" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="内容" :label-width="formLabelWidth" prop="content">
        <el-input
          v-model="form.content"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="请输入内容"
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
import { addPost, updatePost, type Post } from '@/services/posts'
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
import { POST_DIALOG_TITLE } from '../common'
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
const initData = { title: '', sort: '', tag: '', content: '', description: '', date: '' }
const form = ref<Post>(JSON.parse(JSON.stringify(initData)))

watch(
  () => props.currentFormData,
  () => {
    if (props.currentFormData) {
      form.value = JSON.parse(JSON.stringify(props.currentFormData))
    } else {
      form.value = initData
    }
  },
  {
    immediate: true
  }
)
const formRef = ref()

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入分类', trigger: 'blur' }],
  date: [{ required: true, message: '请选择更新日期', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章', trigger: 'blur' }]
}
const handleAdd = async () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (props.title === POST_DIALOG_TITLE.ADD) {
          await addPost(form.value)
        } else {
          await updatePost(form.value.id as number, form.value)
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
