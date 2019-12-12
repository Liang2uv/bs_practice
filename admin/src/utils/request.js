import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui'
import { getToken, clearToken } from './auth'

const request = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api'
})
// 拦截请求
request.interceptors.request.use(function (config) {
  const token = getToken()
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

// 拦截响应
request.interceptors.response.use(res => {
  return Promise.resolve(res.data)
}, err => {
  if (err.response.data) {
    Message.error(err.response.data.message)
    if (err.response.status === 401) {
      clearToken()
      router.replace('/login')
    }
    err.response.data.status = err.response.status
    return Promise.reject(err.response.data)
  } else {
    return Promise.reject({status: err.response.status, message: '未知错误'})
  }
})
export default request