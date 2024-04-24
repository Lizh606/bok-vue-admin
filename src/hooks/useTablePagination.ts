import { computed, onMounted, ref } from 'vue'
interface ApiResult<T> {
  data: T[]
  total: number
}
interface QueryParams {
  page: number
  size: number
  [key: string]: string | number
}
type TableOptions<T> = {
  FormatData?: (data: T[]) => any
  immediate?: boolean
  queryParams: QueryParams
}
type api<T> = (params: QueryParams) => Promise<ApiResult<T>>
export default function <T>(api: api<T>, options: TableOptions<T>) {
  const { queryParams, FormatData, immediate } = options || {}
  const tableData = ref<T[]>([])
  const pageRef = ref(queryParams.page || 1)
  const pageSizeRef = ref(queryParams.size || 10)
  const totalRef = ref(0)
  const params = computed(() => {
    return {
      page: pageRef.value,
      size: pageSizeRef.value
    }
  })
  const getTableData = async () => {
    try {
      const { data, total } = await api({ ...queryParams, ...params.value })
      totalRef.value = total
      tableData.value = FormatData ? FormatData(data) : data
    } catch (error) {
      throw new Error('请求失败')
    }
  }
  immediate && onMounted(getTableData)
  return {
    getTableData,
    pageRef,
    pageSizeRef,
    tableData,
    totalRef
  }
}
