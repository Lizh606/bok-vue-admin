<template>
  <div
    class="tw-flex tw-h-full tw-flex-col tw-gap-6 tw-bg-base"
    ref="containerRef"
  >
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-font-serif tw-text-2xl tw-text-light">
        {{ isEdit ? "编辑文章" : "写文章" }}
      </div>
      <div class="tw-flex tw-gap-3">
        <el-button @click="$router.back()">返回</el-button>
        <el-button
          class="tw-border-none tw-bg-primary tw-font-bold hover:tw-bg-primary-alpha10"
          @click="handleSubmit"
          type="primary"
          v-if="isAdmin"
        >
          <el-icon class="tw-mr-1"><DocumentAdd /></el-icon>发布
        </el-button>
      </div>
    </div>

    <el-card
      class="tw-min-h-0 tw-flex-1 tw-overflow-auto tw-rounded-lg tw-border tw-border-solid tw-border-base tw-bg-base tw-text-base tw-shadow-lg tw-transition-[0.3s]"
      shadow="hover"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入文章标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <div class="tw-flex tw-gap-6">
          <el-form-item label="文章分类" prop="category" class="tw-flex-1">
            <el-select
              v-model="formData.category"
              placeholder="请选择或输入文章分类"
              class="tw-w-full"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="发布日期" prop="date" class="tw-flex-1">
            <el-date-picker
              v-model="formData.date"
              type="datetime"
              placeholder="选择发布日期"
              class="tw-w-full"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </div>

        <div class="tw-flex tw-gap-6">
          <el-form-item label="文章标签" prop="tags" class="tw-flex-1">
            <el-select
              v-model="formData.tags"
              multiple
              placeholder="请选择或输入文章标签"
              class="tw-w-full"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in tagOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="文章描述" prop="description" class="tw-flex-1">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="1"
              placeholder="请输入文章描述"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>

        <el-form-item label="文章内容" prop="content">
          <!-- <BlogEditor v-model="formData.content" class="tw-mb-4" /> -->
          <el-input v-model="formData.content" type="textarea" :rows="15" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { addPost, getPostDetail, updatePost } from "@/services/posts"
  import type { Role } from "@/services/user"
  import { useAppStore } from "@/stores/app"
  import { DocumentAdd } from "@element-plus/icons-vue"
  import type { FormInstance, FormRules } from "element-plus"
  import { ElMessage } from "element-plus"
  import { computed, onMounted, reactive, ref } from "vue"
  import { useRoute, useRouter } from "vue-router"
  const router = useRouter()
  const route = useRoute()
  const formRef = ref<FormInstance>()
  const isEdit = ref(false)
  const isAdmin = computed(() => {
    const userInfo = useAppStore().userInfo
    return userInfo.roles && userInfo.roles.some((item: Role) => item.id === 1)
  })

  const containerRef = ref<HTMLElement>()
  const formData = reactive({
    id: undefined as number | undefined,
    title: "",
    category: "",
    tags: [] as string[],
    content: "",
    description: "",
    date: new Date().toISOString()
  })

  const rules = reactive<FormRules>({
    title: [
      { required: true, message: "请输入文章标题", trigger: "blur" },
      {
        min: 2,
        max: 100,
        message: "标题长度在 2 到 100 个字符",
        trigger: "blur"
      }
    ],
    category: [
      { required: true, message: "请选择文章分类", trigger: "change" }
    ],
    tags: [{ required: true, message: "请选择文章标签", trigger: "change" }],
    content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
    date: [{ required: true, message: "请选择发布日期", trigger: "change" }],
    description: [
      { required: true, message: "请输入文章描述", trigger: "blur" },
      { max: 200, message: "描述最多200个字符", trigger: "blur" }
    ]
  })

  // 模拟分类和标签数据，实际应该从API获取
  const categoryOptions = [
    { value: "frontend", label: "前端开发" },
    { value: "backend", label: "后端开发" },
    { value: "devops", label: "DevOps" }
  ]

  const tagOptions = [
    { value: "vue", label: "Vue" },
    { value: "react", label: "React" },
    { value: "nodejs", label: "Node.js" },
    { value: "typescript", label: "TypeScript" }
  ]

  // 初始化表单数据
  const initFormData = async () => {
    const id = route.query.id
    if (id) {
      isEdit.value = true
      try {
        const detail = await getPostDetail(Number(id), containerRef.value)
        Object.assign(formData, {
          id: detail.id,
          title: detail.title,
          category: detail.sort,
          tags: detail.tag ? detail.tag.split(",") : [],
          content: detail.content,
          description: detail.description,
          date: detail.date
        })
      } catch (error) {
        ElMessage.error("获取文章详情失败")
        router.push("/post")
      }
    }
  }

  onMounted(() => {
    initFormData()
  })

  const handleSubmit = async () => {
    if (!formRef.value) return
    // const content = convertHtmlToJsx(
    //   JSON.parse(JSON.stringify(formData.content))
    // )
    // const turndownService = new TurndownService()
    // const markdown = turndownService.turndown(
    //   JSON.parse(JSON.stringify(formData.content))
    // )
    // console.log(markdown)
    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          const postData = {
            title: formData.title,
            sort: formData.category,
            tag: formData.tags.join(","),
            content: formData.content,
            description: formData.description,
            date: formData.date
          }

          if (isEdit.value) {
            await updatePost(
              formData.id as number,
              postData,
              containerRef.value
            )
          } else {
            await addPost(postData, containerRef.value)
          }

          ElMessage.success(isEdit.value ? "文章更新成功" : "文章发布成功")
          router.push("/article")
        } catch (error) {
          ElMessage.error("操作失败")
        }
      }
    })
  }
</script>

<style lang="scss" scoped>
  :deep(.el-card) {
    @apply tw-overflow-auto #{!important};
  }
</style>
