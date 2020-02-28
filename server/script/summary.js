/**
 * 每天01:00统计昨天的数据
 */

(async function () {
  const mongoose = require('mongoose')
  const DayRecordModel = require('../model/DayRecord')
  const MainPlanModel = require('../model/MainPlan')
  const DaySummaryModel = require('../model/DaySummary')
  const { dataSetTime } = require('../utils/utils')

  // ---------------- 数据库连接 --------------------
  mongoose.connect(`mongodb://localhost:27017/bs-practice`, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  // 监听连接
  mongoose.connection.once('open', function () {
    console.log("数据库连接成功~~~")
  })
  // 监听连接
  mongoose.connection.once('error', function () {
    console.log("数据库连接失败~~~")
  })
  // 监听断开连接
  mongoose.connection.once('close', function () {
    console.log("数据库已断开连接~~~")
  })
  // --------- 业务逻辑 -----------------
  const yesterday_s = dataSetTime(new Date((new Date()).getTime() - 24 * 3600 * 1000))
  const yesterday_e = dataSetTime(new Date((new Date()).getTime() - 24 * 3600 * 1000), '23')
  try {
    // 找出所有正在进行中的实习计划id
    const mainPlans = await MainPlanModel.find({ startAt: { $lte: yesterday_e }, endAt: { $gte: yesterday_s } })
    for (const mainPlan of mainPlans) {
      // 待插入的数据
      const model = {
        date: yesterday_s,
        mainPlan: mainPlan._id.toString(),
        mainPlanClock: { // 当前日期的所有学生出勤情况
          clockRate: 0,
          noClockNum: 0,
          clockNum: 0,
          dayOffNum: 0,
          absenceNum: 0,
        },
        classClock: []
      }
      // 查找昨天的签到记录情况
      const drs = await DayRecordModel.aggregate([
        {
          $match: { date: { $gte: yesterday_s, $lte: yesterday_e }, mainPlan: mainPlan._id.toString() }
        },
        {
          $group: { _id: { class: '$class', status: '$status' }, num: { $sum: 1 } }
        }
      ])
      // 统计
      if (drs && drs.length !== 0) {
        // 相关班级数据
        const classSummary = {}
        for (let i = 0; i < drs.length; i++) {
          if (!classSummary[drs[i]._id.class]) {
            classSummary[drs[i]._id.class] = {
              class: drs[i]._id.class,
              clockRate: 0,
              noClockNum: 0,
              clockNum: 0,
              dayOffNum: 0,
              absenceNum: 0
            }
          }
          switch (drs[i]._id.status) {
            case 0: // 某个班级待签到人数
              model.mainPlanClock.noClockNum = model.mainPlanClock.noClockNum + drs[i].num  // 待签到总人数
              classSummary[drs[i]._id.class].noClockNum = drs[i].num  // 班级待签到人数
              break;
            case 1: // 某个班级已签到人数
              model.mainPlanClock.clockNum = model.mainPlanClock.clockNum + drs[i].num  // 已签到总人数
              classSummary[drs[i]._id.class].clockNum = drs[i].num  // 班级已签到人数
              break;
            case 2: // 某个班级已请假人数
              model.mainPlanClock.dayOffNum = model.mainPlanClock.dayOffNum + drs[i].num  // 已请假总人数
              classSummary[drs[i]._id.class].dayOffNum = drs[i].num  // 班级已请假人数
              break;
            case 3: // 某个班级缺勤人数
              model.mainPlanClock.absenceNum = model.mainPlanClock.absenceNum + drs[i].num  // 缺勤总人数
              classSummary[drs[i]._id.class].absenceNum = drs[i].num  // 班级缺勤人数
              break;
            default:
              break;
          }
        }
        // 总出勤率（注：出勤率=(已签到+已请假)/总人数）
        if (drs.length !== 0) {
          model.mainPlanClock.clockRate = Number(((model.mainPlanClock.clockNum + model.mainPlanClock.dayOffNum) / drs.length).toFixed(2))
        }
        // 各个班级的出勤率
        for (const key in classSummary) {
          const totalNum = classSummary[key].clockNum + classSummary[key].dayOffNum + classSummary[key].noClockNum + classSummary[key].absenceNum
          if (totalNum !== 0) {
            classSummary[key].clockRate = Number(((classSummary[key].clockNum + classSummary[key].dayOffNum) / totalNum).toFixed(2))
          }
          model.classClock.push(classSummary[key])
        }
      }
      await DaySummaryModel.create(model)
    }
  } catch (error) {
    console.log(error)
  }
  // ---------------测试----------------
  // try {
  //   let yesterday_s = dataSetTime(new Date('2020-01-31 00:00:00'))
  //   let yesterday_e = dataSetTime(new Date('2020-02-01 00:00:00'), '23')
  //   const now = dataSetTime(new Date('2020-02-27 00:00:00'))
  //   while (yesterday_s < now) {
  //     yesterday_s.setTime(yesterday_s.getTime() + 24 * 3600 * 1000)
  //     // 找出所有正在进行中的实习计划id
  //     const mainPlans = await MainPlanModel.find({ startAt: { $lte: yesterday_e }, endAt: { $gte: yesterday_s } })
  //     for (const mainPlan of mainPlans) {
  //       // 待插入的数据
  //       const model = {
  //         date: yesterday_s,
  //         mainPlan: mainPlan._id.toString(),
  //         mainPlanClock: { // 当前日期的所有学生出勤情况
  //           clockRate: 0,
  //           noClockNum: 0,
  //           clockNum: 0,
  //           dayOffNum: 0,
  //           absenceNum: 0,
  //         },
  //         classClock: []
  //       }
  //       // 查找昨天的签到记录情况
  //       const drs = await DayRecordModel.aggregate([
  //         {
  //           $match: { date: yesterday_s, mainPlan: mainPlan._id.toString() }
  //         },
  //         {
  //           $group: { _id: { class: '$class', status: '$status' }, num: { $sum: 1 } }
  //         }
  //       ])
  //       // 统计
  //       if (drs && drs.length !== 0) {
  //         // 相关班级数据
  //         const classSummary = {}
  //         for (let i = 0; i < drs.length; i++) {
  //           if (!classSummary[drs[i]._id.class]) {
  //             classSummary[drs[i]._id.class] = {
  //               class: drs[i]._id.class,
  //               clockRate: 0,
  //               noClockNum: 0,
  //               clockNum: 0,
  //               dayOffNum: 0,
  //               absenceNum: 0
  //             }
  //           }
  //           switch (drs[i]._id.status) {
  //             case 0: // 某个班级待签到人数
  //               model.mainPlanClock.noClockNum = model.mainPlanClock.noClockNum + drs[i].num  // 待签到总人数
  //               classSummary[drs[i]._id.class].noClockNum = drs[i].num  // 班级待签到人数
  //               break;
  //             case 1: // 某个班级已签到人数
  //               model.mainPlanClock.clockNum = model.mainPlanClock.clockNum + drs[i].num  // 已签到总人数
  //               classSummary[drs[i]._id.class].clockNum = drs[i].num  // 班级已签到人数
  //               break;
  //             case 2: // 某个班级已请假人数
  //               model.mainPlanClock.dayOffNum = model.mainPlanClock.dayOffNum + drs[i].num  // 已请假总人数
  //               classSummary[drs[i]._id.class].dayOffNum = drs[i].num  // 班级已请假人数
  //               break;
  //             case 3: // 某个班级缺勤人数
  //               model.mainPlanClock.absenceNum = model.mainPlanClock.absenceNum + drs[i].num  // 缺勤总人数
  //               classSummary[drs[i]._id.class].absenceNum = drs[i].num  // 班级缺勤人数
  //               break;
  //             default:
  //               break;
  //           }
  //         }
  //         // 总出勤率（注：出勤率=(已签到+已请假)/总人数）
  //         if (drs.length !== 0) {
  //           model.mainPlanClock.clockRate = Number(((model.mainPlanClock.clockNum + model.mainPlanClock.dayOffNum) / drs.length).toFixed(2))
  //         }
  //         // 各个班级的出勤率
  //         for (const key in classSummary) {
  //           const totalNum = classSummary[key].clockNum + classSummary[key].dayOffNum + classSummary[key].noClockNum + classSummary[key].absenceNum
  //           if (totalNum !== 0) {
  //             classSummary[key].clockRate = Number(((classSummary[key].clockNum + classSummary[key].dayOffNum) / totalNum).toFixed(2))
  //           }
  //           model.classClock.push(classSummary[key])
  //         }
  //       }
  //       await DaySummaryModel.create(model)
  //     }
  //   }
  // } catch (error) {
  //   console.log(error)
  // }
  // ------------测试--------------------
  mongoose.disconnect()
}())
