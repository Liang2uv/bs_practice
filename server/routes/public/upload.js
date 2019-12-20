const expresss = require('express')
const multer = require('multer')
const fs = require('fs')

const router = expresss.Router({
  mergeParams: true
})

const upload = multer({ dest: __dirname + '/../../uploads' })

router.post('/', upload.single('file'), (req, res) => {
  const file = req.file
  file.url = `http://127.0.0.1:3002/uploads/${file.filename}`
  res.send(file)
})

module.exports = router