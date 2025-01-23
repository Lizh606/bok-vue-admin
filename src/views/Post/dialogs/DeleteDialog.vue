<template>
  <el-dialog v-model="dialogVisible" title="确认删除" width="500" draggable>
    <span class="tw-text-red-500">确认要删除该博文吗</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { deletePost } from "@/services/posts"
  const dialogVisible = defineModel("show", { required: true })

  const props = defineProps({
    currentFormData: {
      type: Object,
      required: true
    }
  })
  const emit = defineEmits(["updateList"])

  const handleConfirm = async () => {
    try {
      await deletePost(props.currentFormData.id)
      dialogVisible.value = false
      emit("updateList")
    } catch (error) {
      console.error(error)
    }
  }
</script>

<style lang="scss"></style>
