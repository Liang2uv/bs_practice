const EXPIRESIN = '2 days' // token过期时间
const BASE_URL = process.env.NODE_ENV === 'dev' ? 'http://127.0.0.1:3002/' : 'https://bs.liangbb.top/' // 服务器地址

module.exports = {
  EXPIRESIN,
  BASE_URL
}
