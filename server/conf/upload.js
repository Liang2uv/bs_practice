const multer = require('multer')
const path = require('path')
// 上传文件类型限制
const mimes = ['.png', 'gif', '.jpg', '.jpeg', '.txt', '.zip', '.rar', '.doc', '.docx', '.ppt', '.pptx', 'xls', '.xlsx', '.pdf']
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
const temp = path.resolve(__dirname, '../tmp')
const storage = multer.diskStorage({
  destination(req, res, cb) {
    cb(null, temp);
  }
})
// 创建multer实例
const upload = multer({
  storage,
  fileFilter,
  limits
})

module.exports = upload