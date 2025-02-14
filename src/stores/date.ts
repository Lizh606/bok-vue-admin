// 日期格式化 具体时间年-月-日 时:分:秒
export const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}
