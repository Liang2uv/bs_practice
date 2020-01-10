const BaseService = require('./baseService')
const MainPlanModel = require('../model/MainPlan')
class MainPlanService extends BaseService {
  constructor() {
    super(MainPlanModel)
  }
}

module.exports = new MainPlanService()