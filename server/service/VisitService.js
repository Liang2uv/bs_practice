const BaseService = require('./BaseService')
const VisitModel = require('../model/Visit')
class VisitService extends BaseService {
  constructor() {
    super(VisitModel)
  }
}

module.exports = new VisitService()