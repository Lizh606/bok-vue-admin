<template>
  <div class="tw-h-full tw-space-y-4 tw-overflow-auto">
    <el-empty
      v-if="!loading && (!comments || comments.length === 0)"
      description="暂无评论"
    />
    <el-skeleton v-else-if="loading" :rows="3" animated />
    <template v-else>
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="tw-flex tw-gap-3 tw-border-b tw-border-base tw-pb-3 last:tw-border-0"
      >
        <el-avatar
          :size="40"
          :src="comment.author.avatarUrl"
          :alt="comment.author.login"
        />
        <div class="tw-flex-1">
          <div class="tw-flex tw-items-center tw-justify-between">
            <span class="tw-text-base tw-font-bold">{{
              comment.author.login
            }}</span>
            <span class="tw-text-base tw-text-sm">
              {{ formatDate(comment.createdAt) }}
            </span>
          </div>
          <div class="tw-mt-1 tw-line-clamp-2 tw-text-base">
            {{ comment.body }}
          </div>
          <div class="tw-mt-1 tw-text-base tw-text-sm">
            来自:
            <a
              :href="comment.discussionUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:tw-text-primary-hover tw-text-primary hover:tw-underline"
            >
              {{ comment.discussionTitle }}
            </a>
            <el-tag size="small" class="tw-ml-2">{{
              comment.category.name
            }}</el-tag>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { formatDate } from "@/utils/date"

  defineProps<{
    comments: any[]
    loading: boolean
  }>()
</script>
