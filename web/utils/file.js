import { statusCode, baseURL } from '../conf/request'
import { getToken } from '../utils/util'
export function downloadFile(fileurl, filename) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: fileurl,
      filePath: wx.env.USER_DATA_PATH + "/" + filename,
      success: res => {
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject({
            status: res.statusCode,
            message: '下载出错'
          })
        }
      },
      fail: err => {
        reject({
          status: statusCode.wxReqErr,
          message: '下载出错'
        })
      }
    })
  })
}
export function uploadImage(count = 1) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count,
      success: res => {
        wx.uploadFile({
          filePath: res.tempFilePaths[0],
          name: 'file',
          url: `${baseURL}/public/upload`,
          header: {
            authorization: `Beare ${getToken()}`
          },
          success: res2 => {
            if (res2.data) {
              const data = JSON.parse(res2.data)
              resolve(data)
            } else {
              reject({
                status: statusCode.wxReqErr,
                message: '上传出错'
              })
            }
          },
          fail: err => {
            reject({
              status: statusCode.wxReqErr,
              message: '上传出错'
            })
          }
        })
      },
      fail: err => {
        if (err.errMsg !== 'chooseImage:fail cancel') {
          reject({
            status: statusCode.wxReqErr,
            message: '读取图片出错'
          })
        }
      }
    })
  })
}