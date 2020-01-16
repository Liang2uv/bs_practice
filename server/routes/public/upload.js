const expresss = require('express')
const multer = require('multer')
const path = require('path')
const COS = require('cos-nodejs-sdk-v5')
const fs = require('fs')

const router = expresss.Router({
  mergeParams: true
})

// 上传文件类型限制
const mimes = ['.png', 'gif', '.jpg', '.jpeg', '.txt', '.zip', '.rar' ,'.doc', '.docx', '.ppt', '.pptx', 'xls', '.xlsx', '.pdf']
const fileFilter = function (req, file, cb) {
  const type = file.originalname.slice(file.originalname.lastIndexOf('.'))
  if (mimes.includes(type)) {
    cb(null, true);
  } else {
    cb(new Error('不支持该文件类型上传'), false);
  }
}
// 上传大小限制
const limits = {
  fileSize: 1024 * 1024 * 10  // 10M
}

// 定义storage 
const temp = path.resolve(__dirname, '../../tmp')
const storage = multer.diskStorage({
  destination(req,res,cb){
    cb(null, temp);
  }
})
// 创建multer实例
const upload = multer({
  storage,
  fileFilter,
  limits
})
// 上传到COS
const cos = new COS({
  SecretId: 'AKIDRg7KHyQhgPt87IQyUklW1ZruhEW29GzT',
  SecretKey: 'OXRHtFRO5yaw5zf4E9rLZaMzNWR7XigO'
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