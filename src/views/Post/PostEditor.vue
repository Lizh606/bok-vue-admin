<template>
  <div
    class="tw-flex tw-h-full tw-flex-col tw-gap-6 tw-bg-base"
    ref="containerRef"
  >
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-font-serif tw-text-2xl tw-text-light">
        {{ isEdit ? t("postEditor.title.edit") : t("postEditor.title.create") }}
      </div>
      <div class="tw-flex tw-gap-3">
        <el-button @click="$router.back()">
          {{ t("postEditor.buttons.back") }}
        </el-button>
        <el-button
          class="tw-border-none tw-bg-primary tw-font-bold hover:tw-bg-primary-alpha10"
          @click="handleSubmit"
          type="primary"
          v-if="isAdmin"
        >
          <el-icon class="tw-mr-1"><DocumentAdd /></el-icon>
          {{ t("postEditor.buttons.publish") }}
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
        <el-form-item :label="t('postEditor.form.title.label')" prop="title">
          <el-input
            v-model="formData.title"
            :placeholder="t('postEditor.form.title.placeholder')"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <div class="tw-flex tw-gap-6">
          <el-form-item
            :label="t('postEditor.form.category.label')"
            prop="category"
            class="tw-flex-1"
          >
            <el-select
              v-model="formData.category"
              :placeholder="t('postEditor.form.category.placeholder')"
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

          <el-form-item
            :label="t('postEditor.form.date.label')"
            prop="date"
            class="tw-flex-1"
          >
            <el-date-picker
              v-model="formData.date"
              type="datetime"
              :placeholder="t('postEditor.form.date.placeholder')"
              class="tw-w-full"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </div>

        <div class="tw-flex tw-gap-6">
          <el-form-item
            :label="t('postEditor.form.tags.label')"
            prop="tags"
            class="tw-flex-1"
          >
            <el-select
              v-model="formData.tags"
              multiple
              :placeholder="t('postEditor.form.tags.placeholder')"
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

        <el-form-item
          :label="t('postEditor.form.description.label')"
          prop="description"
          class="tw-flex-1"
        >
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="1"
            :placeholder="t('postEditor.form.description.placeholder')"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>

        <el-form-item :label="t('postEditor.form.content.label')" prop="content">
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
  import { useI18n } from "@/hooks/useI18n"
  import { useRoute, useRouter } from "vue-router"
  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()
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
      {
        required: true,
        message: t("postEditor.rules.titleRequired"),
        trigger: "blur"
      },
      {
        min: 2,
        max: 100,
        message: t("postEditor.rules.titleLength"),
        trigger: "blur"
      }
    ],
    category: [
      {
        required: true,
        message: t("postEditor.rules.category"),
        trigger: "change"
      }
    ],
    tags: [
      {
        required: true,
        message: t("postEditor.rules.tags"),
        trigger: "change"
      }
    ],
    content: [
      {
        required: true,
        message: t("postEditor.rules.content"),
        trigger: "blur"
      }
    ],
    date: [
      {
        required: true,
        message: t("postEditor.rules.date"),
        trigger: "change"
      }
    ],
    description: [
      {
        required: true,
        message: t("postEditor.rules.description"),
        trigger: "blur"
      },
      {
        max: 200,
        message: t("postEditor.rules.descriptionMax"),
        trigger: "blur"
      }
    ]
  })

  // 模拟分类和标签数据，实际应该从API获取
  const categoryOptions = computed(() => [
    { value: "frontend", label: t("postEditor.options.categories.frontend") },
    { value: "backend", label: t("postEditor.options.categories.backend") },
    { value: "devops", label: t("postEditor.options.categories.devops") }
  ])

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
      ElMessage.error(t("postEditor.message.fetchDetailFailed"))
        router.push({ name: "list" })
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
    const isValid = await formRef.value.validate().catch(() => false)
    if (!isValid) return

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
        await updatePost(formData.id as number, postData, containerRef.value)
      } else {
        await addPost(postData, containerRef.value)
      }

      ElMessage.success(
        isEdit.value
          ? t("postEditor.message.updateSuccess")
          : t("postEditor.message.publishSuccess")
      )
      router.push("/article")
    } catch (error) {
      ElMessage.error(t("postEditor.message.operationFailed"))
    }
  }
</script>

<style lang="scss" scoped>
  :deep(.el-card) {
    @apply tw-overflow-auto #{!important};
  }
</style>
