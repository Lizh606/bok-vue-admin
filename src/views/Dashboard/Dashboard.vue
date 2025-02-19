<template>
  <div class="tw-flex tw-flex-col tw-gap-6">
    <!-- 标题栏 -->
    <div class="tw-flex tw-items-center">
      <div class="tw-text-2xl tw-font-bold tw-text-gray-800">仪表盘</div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="tw-grid tw-grid-cols-4 tw-gap-6">
      <div
        v-for="stat in statistics"
        :key="stat.title"
        class="tw-relative tw-overflow-hidden tw-rounded-xl tw-p-6"
        :class="[stat.bgColor]"
      >
        <div class="tw-flex tw-items-center tw-gap-4">
          <div :class="['tw-rounded-lg tw-p-3']">
            <el-icon class="tw-text-2xl">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div>
            <div class="tw-text-sm tw-text-gray-600">{{ stat.title }}</div>
            <div class="tw-mt-1 tw-text-2xl tw-font-bold tw-text-gray-800">
              {{ stat.value }}
            </div>
          </div>
        </div>
        <div
          class="tw-absolute tw-bottom-0 tw-right-0 tw-translate-x-2 tw-translate-y-2 tw-opacity-10"
        >
          <component :is="stat.icon" class="tw-text-6xl" />
        </div>
      </div>
    </div>

    <div class="tw-min-h-0 tw-flex-1 tw-overflow-auto">
      <div class="tw-flex tw-h-full tw-flex-col tw-gap-4">
        <!-- 图表区域 -->
        <div class="tw-grid tw-h-full tw-grid-cols-2 tw-gap-4">
          <el-card shadow="never" class="tw-flex tw-flex-col">
            <template #header>
              <div class="tw-flex tw-items-center tw-justify-between">
                <span class="tw-font-medium">文章分类</span>
              </div>
            </template>
            <div class="tw-h-full" ref="categoryChartRef"></div>
          </el-card>
          <el-card shadow="never" class="tw-flex tw-flex-col">
            <template #header>
              <div class="tw-font-medium">最新评论</div>
            </template>
            <CommentList :comments="discussions" :loading="loading" />
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CommentList from "@/components/CommentList.vue"
  import { useGithubDiscussions } from "@/hooks/useGithubDiscussions"
  import { getPostStatistics } from "@/services/posts"
  import { Comment, Document, Star, View } from "@element-plus/icons-vue"
  import * as echarts from "echarts"
  import { onMounted, ref } from "vue"

  const categoryChartRef = ref()

  // 统计数据
  const statistics = ref([
    {
      title: "文章总数",
      value: 0,
      icon: Document,
      iconColor: "tw-text-blue-600",
      iconBg: "tw-bg-blue-100",
      bgColor: "tw-bg-gradient-to-br tw-from-blue-100 tw-to-blue-50"
    },
    {
      title: "总阅读量",
      value: "0k",
      icon: View,
      iconColor: "tw-text-green-600",
      iconBg: "tw-bg-green-100",
      bgColor: "tw-bg-gradient-to-br tw-from-green-100 tw-to-green-50"
    },
    {
      title: "评论数",
      value: 0,
      icon: Comment,
      iconColor: "tw-text-orange-600",
      iconBg: "tw-bg-orange-100",
      bgColor: "tw-bg-gradient-to-br tw-from-orange-100 tw-to-orange-50"
    },
    {
      title: "收藏数",
      value: 0,
      icon: Star,
      iconColor: "tw-text-purple-600",
      iconBg: "tw-bg-purple-100",
      bgColor: "tw-bg-gradient-to-br tw-from-purple-100 tw-to-purple-50"
    }
  ])

  const initCategoryChart = (data: { value: number; name: string }[]) => {
    const chart = echarts.init(categoryChartRef.value)
    chart.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        orient: "horizontal",
        left: "center",
        bottom: "bottom",
        icon: "circle"
      },
      series: [
        {
          name: "文章分类",
          type: "pie",
          radius: ["40%", "70%"], // 改成环形图
          center: ["50%", "45%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: true,
            position: "outside",
            formatter: "{b}\n{c}篇"
          },
          labelLine: {
            length: 15,
            length2: 0,
            maxSurfaceAngle: 80
          },
          data: data,
          emphasis: {
            scale: true,
            scaleSize: 5,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          },
          animationType: "scale",
          animationEasing: "elasticOut",
          animationDelay: function () {
            return Math.random() * 200
          }
        }
      ]
    })
  }
  const getStatistics = async () => {
    const { sortStatistics, total } = await getPostStatistics()
    statistics.value[0].value = total
    initCategoryChart(
      sortStatistics.map((item) => ({
        value: item.count,
        name: item.sort
      }))
    )
  }
  const { discussions, loading, fetchDiscussions, error, totalCount } =
    useGithubDiscussions()

  onMounted(async () => {
    try {
      await fetchDiscussions()
      statistics.value[2].value = totalCount.value
    } catch (e) {
      console.error(error.value)
    }
    await getStatistics()

    window.addEventListener("resize", () => {
      const categoryChart = echarts.getInstanceByDom(categoryChartRef.value)
      categoryChart?.resize()
    })
  })
</script>

<style lang="scss" scoped>
  :deep(.el-card) {
    @apply tw-rounded-xl tw-border-none tw-shadow-sm;

    .el-card__header {
      @apply tw-border-none tw-bg-transparent tw-px-6 tw-pt-6;
    }

    .el-card__body {
      @apply tw-min-h-0 tw-flex-1 tw-p-6;
    }
  }

  .el-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
  }
</style>
