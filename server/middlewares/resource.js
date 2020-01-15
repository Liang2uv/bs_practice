const inflection = require('inflection')
const assert = require('http-assert')

const middleWareResource = options => {
  return (req, res, next) => {
    // 以下是处理请求Model的中间件
    const serviceName = inflection.classify(req.params.resource)
    try {
      const Service = require(`../service/${serviceName}Service`)
      // 挂载到req上，方便后续操作使用
      req.Service = Service
      next()
    } catch (error) {
      assert(false, 404, 'Not Found Service')
    }
  }
}
module.exports = middleWareResource