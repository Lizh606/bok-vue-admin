<template>
  <div class="tw-flex tw-flex-col tw-gap-4">
    <!-- 标题栏 -->
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-text-xl tw-font-bold">仪表盘</div>
    </div>
    <!-- 统计卡片区域 -->
    <div class="tw-grid tw-grid-cols-4 tw-gap-4">
      <el-card
        v-for="stat in statistics"
        :key="stat.title"
        shadow="never"
        :class="[stat.bgColor, stat.borderColor]"
        class="!tw-border !tw-border-solid"
      >
        <div class="tw-flex tw-items-center tw-gap-4">
          <el-icon class="tw-text-2xl" :class="stat.iconColor">
            <component :is="stat.icon" />
          </el-icon>
          <div>
            <div class="tw-text-gray-600">{{ stat.title }}</div>
            <div class="tw-text-xl tw-font-bold tw-text-gray-800">
              {{ stat.value }}
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="tw-min-h-0 tw-flex-1 tw-overflow-auto">
      <div class="tw-flex tw-flex-col tw-gap-4">
        <!-- 图表区域 -->
        <div class="tw-grid tw-grid-cols-2 tw-gap-4">
          <!-- 访问趋势图 -->
          <el-card shadow="never" class="tw-h-80">
            <template #header>
              <div class="tw-flex tw-items-center tw-justify-between">
                <span class="tw-font-medium">访问趋势</span>
                <el-radio-group v-model="visitTimeRange" size="small">
                  <el-radio-button label="week">本周</el-radio-button>
                  <el-radio-button label="month">本月</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div class="tw-h-full" ref="visitChartRef"></div>
          </el-card>

          <!-- 文章分类统计 -->
          <el-card shadow="never" class="tw-h-80">
            <template #header>
              <div class="tw-flex tw-items-center tw-justify-between">
                <span class="tw-font-medium">文章分类</span>
              </div>
            </template>
            <div class="tw-h-full" ref="categoryChartRef"></div>
          </el-card>
        </div>

        <!-- 热门文章和最新评论 -->
        <div class="tw-grid tw-grid-cols-2 tw-gap-4">
          <!-- 热门文章 -->
          <el-card shadow="never" class="tw-min-h-[400px]">
            <template #header>
              <div class="tw-font-medium">热门文章</div>
            </template>
            <div class="tw-space-y-4">
              <div
                v-for="(article, index) in hotArticles"
                :key="index"
                class="tw-flex tw-items-center tw-justify-between tw-py-2"
              >
                <div class="tw-flex tw-items-center tw-gap-2">
                  <div
                    :class="index < 3 ? 'tw-text-red-500' : 'tw-text-gray-400'"
                    class="tw-w-6 tw-text-center tw-font-bold"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="tw-line-clamp-1">{{ article.title }}</div>
                </div>
                <div class="tw-text-gray-500">
                  <el-icon class="tw-mr-1"><View /></el-icon>
                  {{ article.views }}
                </div>
              </div>
            </div>
          </el-card>

          <!-- 最新评论 -->
          <el-card shadow="never" class="tw-min-h-[400px]">
            <template #header>
              <div class="tw-font-medium">最新评论</div>
            </template>
            <div class="tw-space-y-4">
              <div
                v-for="comment in recentComments"
                :key="comment.id"
                class="tw-flex tw-gap-3 tw-border-b tw-border-gray-100 tw-pb-3"
              >
                <el-avatar :size="40" :src="comment.avatar" />
                <div class="tw-flex-1">
                  <div class="tw-flex tw-items-center tw-justify-between">
                    <span class="tw-font-medium">{{ comment.username }}</span>
                    <span class="tw-text-sm tw-text-gray-500">{{
                      comment.time
                    }}</span>
                  </div>
                  <div class="tw-mt-1 tw-text-gray-600">
                    {{ comment.content }}
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue"
  import { Plus, Document, View, Comment, Star } from "@element-plus/icons-vue"
  import { useRouter } from "vue-router"
  import * as echarts from "echarts"

  const router = useRouter()
  const visitTimeRange = ref("week")
  const visitChartRef = ref()
  const categoryChartRef = ref()

  // 统计数据
  const statistics = ref([
    {
      title: "文章总数",
      value: 125,
      icon: Document,
      iconColor: "tw-text-blue-600",
      bgColor: "tw-bg-gradient-to-r tw-from-blue-100 tw-to-blue-200",
      borderColor: "!tw-border-blue-300"
    },
    {
      title: "总阅读量",
      value: "12.5k",
      icon: View,
      iconColor: "tw-text-green-600",
      bgColor: "tw-bg-gradient-to-r tw-from-green-100 tw-to-green-200",
      borderColor: "!tw-border-green-300"
    },
    {
      title: "评论数",
      value: 358,
      icon: Comment,
      iconColor: "tw-text-orange-600",
      bgColor: "tw-bg-gradient-to-r tw-from-orange-100 tw-to-orange-200",
      borderColor: "!tw-border-orange-300"
    },
    {
      title: "收藏数",
      value: 86,
      icon: Star,
      iconColor: "tw-text-purple-600",
      bgColor: "tw-bg-gradient-to-r tw-from-purple-100 tw-to-purple-200",
      borderColor: "!tw-border-purple-300"
    }
  ])

  // 热门文章数据
  const hotArticles = ref([
    { title: "2024年前端开发趋势解析", views: 2341 },
    { title: "Vue3 + TypeScript 实战指南", views: 1834 },
    { title: "深入理解React Hooks", views: 1562 },
    { title: "前端性能优化最佳实践", views: 1203 },
    { title: "CSS Grid 布局完全指南", views: 986 }
  ])

  // 最新评论数据
  const recentComments = ref([
    {
      id: 1,
      username: "张三",
      avatar: "/src/assets/ava.jpg",
      content: "这篇文章写得很好，收获很多！",
      time: "10分钟前"
    },
    {
      id: 2,
      username: "李四",
      avatar: "/src/assets/ava.jpg",
      content: "期待更多相关内容的分享。",
      time: "30分钟前"
    },
    {
      id: 3,
      username: "王五",
      avatar: "/src/assets/ava.jpg",
      content: "解决了我的很多疑惑，感谢分享。",
      time: "1小时前"
    }
  ])

  const navigateToNewPost = () => {
    router.push("/article/edit")
  }

  const initVisitChart = () => {
    const chart = echarts.init(visitChartRef.value)
    chart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: {
        type: "category",
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
      },
      yAxis: { type: "value" },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          smooth: true,
          areaStyle: {}
        }
      ]
    })
  }

  const initCategoryChart = () => {
    const chart = echarts.init(categoryChartRef.value)
    chart.setOption({
      tooltip: { trigger: "item" },
      legend: { left: "center", bottom: "bottom" },
      series: [
        {
          type: "pie",
          radius: "50%",
          data: [
            { value: 35, name: "前端开发" },
            { value: 20, name: "后端技术" },
            { value: 15, name: "数据库" },
            { value: 25, name: "开发工具" },
            { value: 5, name: "其他" }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    })
  }

  onMounted(() => {
    initVisitChart()
    initCategoryChart()

    window.addEventListener("resize", () => {
      const visitChart = echarts.getInstanceByDom(visitChartRef.value)
      const categoryChart = echarts.getInstanceByDom(categoryChartRef.value)
      visitChart?.resize()
      categoryChart?.resize()
    })
  })
</script>

<style lang="scss" scoped>
  :deep(.el-card) {
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    transition: 0.3s;
    padding: 1rem;
    display: flex;
    flex-direction: column;

    .el-card__body {
      padding: 0.5rem;
      flex: 1;
      min-height: 0;
    }

    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
</style>
