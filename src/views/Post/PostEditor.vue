<template>
  <div class="tw-flex tw-h-full tw-flex-col tw-gap-6">
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-font-serif tw-text-2xl tw-text-gray-800">
        {{ isEdit ? "编辑文章" : "写文章" }}
      </div>
      <div class="tw-flex tw-gap-3">
        <el-button @click="$router.back()">返回</el-button>
        <el-button class="blog-btn" @click="handleSubmit">
          <el-icon class="tw-mr-1"><DocumentAdd /></el-icon>发布
        </el-button>
      </div>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      class="tw-min-h-0 tw-flex-1"
    >
      <el-card class="blog-card" shadow="hover">
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
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onBeforeUnmount, onMounted } from "vue"
  import { DocumentAdd } from "@element-plus/icons-vue"
  import { ElMessage } from "element-plus"
  import type { FormInstance, FormRules } from "element-plus"
  import { useRouter, useRoute } from "vue-router"
  import BlogEditor from "@/components/BlogEditor.vue"
  import { addPost, getPostDetail, updatePost } from "@/services/posts"
  const router = useRouter()
  const route = useRoute()
  const formRef = ref<FormInstance>()
  const isEdit = ref(false)

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
    console.log(route)
    if (id) {
      isEdit.value = true
      try {
        const detail = await getPostDetail(Number(id))
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
  function convertHtmlToJsx(html: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    function transformNode(node: any): string {
      let jsx = ""

      if (node.nodeType === Node.TEXT_NODE) {
        // 处理文本节点
        jsx = node.textContent || ""
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase()
        let jsxTag = tagName

        // 将 class 转换为 className
        if (node.hasAttribute("class")) {
          node.setAttribute("className", node.getAttribute("class") || "")
          node.removeAttribute("class")
        }

        // 遍历节点的所有属性
        let attributes = ""
        for (const attr of node.attributes) {
          const name = attr.name
          const value = attr.value

          // 处理样式，将样式值转为对象格式（需要对 camelCase 处理）
          if (name === "style") {
            // 处理 style 属性，确保值是一个对象格式的字符串
            const styleObj = styleToObject(value)
            attributes += ` style={${JSON.stringify(styleObj)}}`
          }
          // 替换特殊的 HTML 属性为 JSX 支持的属性
          else if (name === "class") {
            attributes += ` className="${value}"`
          } else if (name === "for") {
            attributes += ` htmlFor="${value}"` // for 转换为 htmlFor
          } else if (name === "placeholder") {
            attributes += ` placeholder="${value}"`
          } else {
            // 处理其他常规属性
            attributes += ` ${name}="${value}"`
          }
        }

        // 处理自闭合标签
        if (["img", "input", "br", "hr", "meta", "link"].includes(tagName)) {
          jsx = `<${jsxTag}${attributes} />`
        } else {
          // 处理子节点
          let childrenJsx = ""
          for (let child of node.childNodes) {
            childrenJsx += transformNode(child)
          }

          jsx = `<${jsxTag}${attributes}>${childrenJsx}</${jsxTag}>`
        }
      }

      return jsx
    }

    // 辅助函数：将 style 字符串转为对象格式
    function styleToObject(styleStr: string): object {
      const styleObj: { [key: string]: string } = {}
      const styleArr = styleStr
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
      styleArr.forEach((rule) => {
        const [property, value] = rule.split(":").map((s) => s.trim())
        if (property && value) {
          styleObj[camelCase(property)] = value
        }
      })
      return styleObj
    }

    // 辅助函数：将 CSS 属性转为 camelCase
    function camelCase(str: string): string {
      return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
    }

    // 获取所有子元素，跳过 body 标签
    const bodyNode = doc.body
    let jsxContent = ""
    for (let child of bodyNode.childNodes) {
      jsxContent += transformNode(child)
    }

    return jsxContent
  }

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
            await updatePost(formData.id as number, postData)
          } else {
            await addPost(postData)
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
  .blog-card {
    border: 1px solid #ebeef5;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    color: #303133;
    transition: 0.3s;
    height: 100%;
    :deep(.el-card__body) {
      height: 100%;
      padding: 16px;
      overflow: auto;
    }
  }

  .blog-btn {
    background-color: #3b82f6;
    border: none;
    padding: 10px 20px;
    font-weight: 500;
    color: #fff;

    &:hover {
      background-color: #2563eb;
    }
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #374151;
    padding-bottom: 8px;
  }

  :deep(.el-input) {
    .el-input__wrapper {
      box-shadow: 0 0 0 1px #e5e7eb inset;

      &:hover {
        box-shadow: 0 0 0 1px #d1d5db inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 2px #3b82f6 inset;
      }
    }
  }

  :deep(.el-select) {
    .el-input__wrapper {
      box-shadow: 0 0 0 1px #e5e7eb inset;

      &:hover {
        box-shadow: 0 0 0 1px #d1d5db inset;
      }
    }
  }

  :deep(.v-md-editor) {
    border-radius: 8px;
    border-color: #e5e7eb;

    &:hover {
      border-color: #d1d5db;
    }

    &.is-focus {
      border-color: #3b82f6;
    }
  }

  :deep(.el-form-item.is-error) {
    .el-input__wrapper {
      box-shadow: 0 0 0 1px #f56c6c inset;
    }

    .v-md-editor {
      border-color: #f56c6c;
    }
  }
</style>
