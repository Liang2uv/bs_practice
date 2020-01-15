const BaseService = require('./baseService')
const DayRecordModel = require('../model/DayRecord')
class DayRecordService extends BaseService {
  constructor() {
    super(DayRecordModel)
  }
}

module.exports = new DayRecordService()