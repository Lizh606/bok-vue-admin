<template>
  <div class="blog-editor">
    <Toolbar
      class="editor-toolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
    />
    <Editor
      class="editor-content"
      v-model="innerValue"
      :defaultConfig="editorConfig"
      mode="default"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, shallowRef, watch, onBeforeUnmount } from "vue"
  // @ts-ignore
  import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
  import "@wangeditor/editor/dist/css/style.css"

  const props = defineProps<{
    modelValue: string
  }>()

  const emit = defineEmits<{
    (e: "update:modelValue", value: string): void
  }>()

  const editorRef = shallowRef()
  const innerValue = ref(props.modelValue)

  // 监听父组件传入的值
  watch(
    () => props.modelValue,
    (newVal) => {
      innerValue.value = newVal
    }
  )

  // 监听编辑器内容变化
  watch(
    () => innerValue.value,
    (newVal) => {
      emit("update:modelValue", newVal)
    }
  )

  const toolbarConfig = {
    // toolbarKeys: [
    //   "headerSelect",
    //   "blockquote",
    //   "bold",
    //   "underline",
    //   "italic",
    //   "through",
    //   "bulletedList",
    //   "numberedList",
    //   "insertLink",
    //   "insertImage",
    //   "codeBlock",
    //   "divider"
    // ]
  }

  const editorConfig = {
    placeholder: "请输入内容...",
    MENU_CONF: {
      uploadImage: {
        // 自定义图片上传配置
        server: "/api/upload", // 替换为实际的上传接口
        fieldName: "file"
      }
    }
  }

  const handleCreated = (editor: any) => {
    editorRef.value = editor
  }

  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })
</script>

<style lang="scss" scoped>
  .blog-editor {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s;
    width: 100%;

    &:hover {
      border-color: #d1d5db;
    }

    // &:focus-within {
    //   border-color: #3b82f6;
    //   box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    // }

    .editor-toolbar {
      border-bottom: 1px solid #e5e7eb;
      background-color: #f9fafb;
      padding: 8px;
    }

    .editor-content {
      min-height: 300px;
      overflow-y: auto;
      background-color: #fff;
      padding: 12px;
    }

    :deep(.w-e-toolbar) {
      border: none !important;
      background-color: transparent !important;
    }

    :deep(.w-e-text-container) {
      border: none !important;
    }

    :deep(.w-e-bar-item) {
      &:hover {
        background-color: #f3f4f6 !important;
      }
    }

    :deep(.w-e-bar-item-active) {
      background-color: #eff6ff !important;
      color: #3b82f6 !important;
    }
  }
</style>
