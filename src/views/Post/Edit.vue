<template>
  <div class="tw-h-full tw-overflow-auto">
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
          :autosize="{ minRows: 20 }"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { type Post } from '@/services/posts'
import { ref } from 'vue'
const formLabelWidth = ref(80)
const initData = { title: '', sort: '', tag: '', content: '', description: '', date: '' }
const form = ref<Post>(JSON.parse(JSON.stringify(initData)))
const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入分类', trigger: 'blur' }],
  date: [{ required: true, message: '请选择更新日期', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章', trigger: 'blur' }]
}
</script>

<style lang="scss"></style>
