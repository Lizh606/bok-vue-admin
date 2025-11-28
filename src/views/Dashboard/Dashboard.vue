<template>
  <div class="tw-flex tw-flex-col tw-gap-6">
    <!-- 标题栏 -->
    <div class="tw-flex tw-items-center">
      <div class="tw-text-light tw-text-2xl tw-font-bold">
        {{ t("dashboard.title") }}
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="tw-grid tw-grid-cols-4 tw-gap-6">
      <el-card
        v-for="stat in statistics"
        :key="stat.titleKey"
        shadow="always"
        class="tw-relative tw-overflow-hidden tw-rounded-xl"
      >
        <div class="tw-flex tw-items-center tw-gap-4">
          <div :class="['tw-rounded-lg tw-p-3']">
            <el-icon class="tw-text-2xl">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div>
            <div class="tw-text-base tw-text-sm">
              {{ t(stat.titleKey) }}
            </div>
            <div class="tw-mt-1 tw-text-2xl tw-text-base tw-font-bold">
              {{ stat.value }}
            </div>
          </div>
        </div>
        <div
          class="tw-absolute tw-bottom-0 tw-right-0 tw-translate-x-2 tw-translate-y-2 tw-opacity-10"
        >
          <component :is="stat.icon" class="tw-text-6xl" /></div
      ></el-card>
    </div>

    <div class="tw-min-h-0 tw-flex-1 tw-overflow-auto">
      <div class="tw-flex tw-h-full tw-flex-col tw-gap-4">
        <!-- 图表区域 -->
        <div class="tw-grid tw-h-full tw-grid-cols-2 tw-gap-4">
          <el-card shadow="always" class="tw-flex tw-flex-col">
            <template #header>
              <div class="tw-flex tw-items-center tw-justify-between">
                <span class="tw-font-medium">
                  {{ t("dashboard.charts.categories") }}
                </span>
              </div>
            </template>
            <div class="tw-h-full" ref="categoryChartRef"></div>
          </el-card>
          <el-card shadow="always" class="tw-flex tw-flex-col">
            <template #header>
              <div class="tw-font-medium">
                {{ t("dashboard.charts.recentComments") }}
              </div>
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
  import { useThemeStore } from "@/stores/theme"
  import { Comment, Document, Star, View } from "@element-plus/icons-vue"
  import { useI18n } from "@/hooks/useI18n"
  import * as echarts from "echarts"
  import { storeToRefs } from "pinia"
  import { onMounted, ref, watch } from "vue"

  const categoryChartRef = ref()
  const { t } = useI18n()

  // 统计数据
  const statistics = ref([
    {
      titleKey: "dashboard.statistics.posts",
      value: 0,
      icon: Document,
      iconColor: "tw-text-blue-500 dark:tw-text-blue-400",
      iconBg: "tw-bg-blue-500/10 dark:tw-bg-blue-400/10",
      bgColor:
        "tw-bg-white dark:tw-bg-[#2a3b57] tw-shadow-lg tw-shadow-blue-500/5 dark:tw-shadow-blue-400/5 tw-border tw-border-blue-100/50 dark:tw-border-blue-500/10 tw-backdrop-blur-sm"
    },
    {
      titleKey: "dashboard.statistics.views",
      value: "0k",
      icon: View,
      iconColor: "tw-text-emerald-500 dark:tw-text-emerald-400",
      iconBg: "tw-bg-emerald-500/10 dark:tw-bg-emerald-400/10",
      bgColor:
        "tw-bg-white dark:tw-bg-[#2a3b57] tw-shadow-lg tw-shadow-emerald-500/5 dark:tw-shadow-emerald-400/5 tw-border tw-border-emerald-100/50 dark:tw-border-emerald-500/10 tw-backdrop-blur-sm"
    },
    {
      titleKey: "dashboard.statistics.comments",
      value: 0,
      icon: Comment,
      iconColor: "tw-text-amber-500 dark:tw-text-amber-400",
      iconBg: "tw-bg-amber-500/10 dark:tw-bg-amber-400/10"
    },
    {
      titleKey: "dashboard.statistics.favorites",
      value: 0,
      icon: Star,
      iconColor: "tw-text-violet-500 dark:tw-text-violet-400",
      iconBg: "tw-bg-violet-500/10 dark:tw-bg-violet-400/10"
    }
  ])

  const initCategoryChart = (data: { value: number; name: string }[]) => {
    const chart = echarts.init(categoryChartRef.value)
    // 清除之前的图表实例数据
    chart.clear()
    chart.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        orient: "horizontal",
        left: "center",
        bottom: "bottom",
        icon: "circle",
        textStyle: {
          color: theme.value === "dark" ? "#fff" : "#000"
        }
      },
      series: [
        {
          name: t("dashboard.seriesName"),
          type: "pie",
          radius: ["40%", "70%"], // 改成环形图
          center: ["50%", "45%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 1
          },
            label: {
              show: true,
              position: "outside",
              formatter: (params: { name: string; value: number }) => {
                const unit = t("dashboard.chart.postUnit")
                return `${params.name}\n${params.value} ${unit}`
              }
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

    window.addEventListener("resize", () => {
      const categoryChart = echarts.getInstanceByDom(categoryChartRef.value)
      categoryChart?.resize()
    })
  })
  const { theme } = storeToRefs(useThemeStore())
  watch(
    theme,
    async () => {
      await getStatistics()
    },
    {
      immediate: true
    }
  )
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
    @apply tw-shadow-lg tw-transition-all tw-duration-300;

    &:hover {
      @apply tw-translate-y-[-2px] tw-shadow-2xl;
    }
  }
</style>
