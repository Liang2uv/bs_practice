const fs = require('fs')
const path = require('path')
const axios = require('axios')

class CommonService {
  async writeHolidays(year) {
    const arr = []
    for (let i = 1; i <= 12; i++) {
      arr.push(year + (i < 10 ? ('0' + i) : i))
    }
    const query = { m: arr.join(',') }
    const api = 'http://www.easybots.cn/api/holiday.php'
    const { data } = await axios.get(api, { params: query })
    if (data.length === 0) {
      return '无数据写入'
    }
    let holiday = fs.readFileSync(path.resolve(__dirname + '/../assets/holidays.json'))
    holiday = JSON.parse(holiday)
    for (const k1 in data) {
      if (data.hasOwnProperty(k1)) {
        for (const k2 in data[k1]) {
          if (data[k1].hasOwnProperty(k2)) {
            holiday[k1.slice(0, 4) + '-' + k1.slice(4) + '-' + k2] = 1
          }
        }
      }
    }
    fs.writeFileSync(path.resolve(__dirname + '/../assets/holidays.json'), JSON.stringify(holiday))
    return '写入成功'
  }
}

module.exports = new CommonService()