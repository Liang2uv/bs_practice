const path = require('path')
const config = require('./src/conf/config')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? config.build.assetsPublicPath
    : config.env.assetsPublicPath,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('utils', resolve('src/utils'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}