import { baseURL, statusCode } from '../conf/request'
import { getToken } from '../utils/util'
export default function (method, url, data = {}, options = {}) {
  // 请求get对url进行处理
  if (method === 'get') {
    url += '?'
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        url += `${key}=${data[key]}&`
      }
    }
  }
  // 请求头
  const reqHeader = {}
  const token = getToken()
  if (token) {
    reqHeader['authorization'] = 'Bearer ' + token
  }
  if (options.contentType) {
    reqHeader['content-type'] = 'application/json'
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + url,
      method: method,
      header: reqHeader,
      data: method === 'get' ? {} : data,
      success: res => {
        if (res.statusCode === statusCode.ok) {
          return resolve(res.data)
        } else {
          return reject({status: res.statusCode, message: res.data.message  })
        }
      },
      fail: err => {
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
        return reject({ status: statusCode.wxReqErr, message: err.errMsg })
      }
    })
  })
}

