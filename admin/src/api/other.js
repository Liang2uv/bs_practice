import request from '@/utils/request'

const uri = '/admin/other'

// 获取待审核个数（后台首页展示需要）
export function getReviewSum() {
  return request.get(`${uri}/review_sum`)
}

