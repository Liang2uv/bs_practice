const express = require('express')
const { getList } = require('../../controller/origanization')
const middlewareAuth = require('../../middlewares/auth')

const router = express.Router()


module.exports = router