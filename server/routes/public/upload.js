const expresss = require('express')
const COS = require('cos-nodejs-sdk-v5')
const fs = require('fs')
const upload = require('../../conf/upload')

const router = expresss.Router({
  mergeParams: true
})

// 上传到COS
const cos = new COS({
  SecretId: '',
  SecretKey: ''
})
const uploadCos = function (req, res, next) {
  cos.sliceUploadFile({
    Bucket: 'practice-liangbb-1300060132', /* 必须 */
    Region: 'ap-guangzhou',    /* 必须 */
    Key: req.file.filename,              /* 必须 */
    FilePath: req.file.path                /* 必须 */
  }, function (err, data) {
    // 删除临时文件
    fs.unlinkSync(req.file.path)
    if (err) {
      res.status(500).send(err)
      return
    }
    req.file.url = `https://${data.Location}`
    next()
  })
}

// 上传路由
router.post('/', upload.single('file'), uploadCos ,(req, res) => {
  res.send(req.file)
})

module.exports = router
