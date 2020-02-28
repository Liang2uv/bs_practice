import * as echarts from '../../components/ec-canvas/echarts';
import {
  getOneDayClock,
  getSevenDayClock
} from '../../api/daySummary'
import {
  getMainPlanListForTeacher
} from '../../api/mainPlan'
import {
  getGlobalData,
  dateFormat,
  clearGlobalData
} from '../../utils/util'
// 折线图
let lineChart = null;
let lineOptions = {
  color: ['#37a2da'],
  tooltip: {
    trigger: 'item',
    formatter: '{c} %'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [],
    type: 'line'
  }]
}
function initLineChart(canvas, width, height) {
  lineChart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(lineChart);
  lineChart.setOption(lineOptions);
  return lineChart;
}
// 饼图
let pieChart = null;
let pieOptions = {
  backgroundColor: '#fff',
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c}人 ({d}%)'
  },
  series: [{
    name: '出勤情况',
    type: 'pie',
    radius: '55%',
    center: ['50%', '50%'],
    data: [],
    roseType: 'radius',
    label: {
      color: 'rgba(0, 0, 0, 0.3)'
    },
    labelLine: {
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.3)'
      },
      smooth: 0.2,
      length: 10,
      length2: 20
    },
    itemStyle: {
      color: '#4eacdd',
      shadowBlur: 200,
      shadowColor: 'rgba(0, 0, 0, 0.5)'
    },
    animationType: 'scale',
    animationEasing: 'elasticOut',
    animationDelay: function (idx) {
      return Math.random() * 200;
    }
  }]
}
function initPieChart(canvas, width, height) {
  pieChart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(pieChart);
  pieChart.setOption(pieOptions);
  return pieChart;
}
// 柱状图
let barChart = null;
let barOptions = {
  color: ['#37a2da'],
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [],
    type: 'bar'
  }]
}
function initBarChart(canvas, width, height) {
  barChart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(barChart);
  barChart.setOption(barOptions);
  return barChart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    ecLine: {
      onInit: initLineChart
    },
    ecPie: {
      onInit: initPieChart
    },
    ecBar: {
      onInit: initBarChart
    },
    lineShow: false,
    pieShow: false,
    barShow: false,
    mainPlanList: [],
    mainPlanDisplay: '请选择',
    dateDisplay: '请选择',
    query: {
      mainPlan: null,
      date: []
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    const now = new Date()
    this.setData({
      userInfo: getGlobalData('userInfo') || {},
      ['query.date']: [now.getFullYear(), now.getMonth(), now.getDate()],
      dateDisplay: dateFormat(now, 'yyyy-MM-dd')
    })
    this.getMainPlanList()
  },
  // 获取老师管理的实习计划列表
  getMainPlanList() {
    getMainPlanListForTeacher({
      data: {
        teacher: this.data.userInfo._id
      }
    }).then(res => {
      if (res.length > 0) {
        this.setData({
          ['query.mainPlan']: res[0]._id,
          mainPlanDisplay: res[0].name,
          mainPlanList: res.map(v => ({
            title: v.name,
            value: v._id
          }))
        })
        this.getSevenDayClock()
        this.getOneDayClock()
      }
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  // 实习计划选择改变
  pickerMainPlanChange(e) {
    this.setData({
      ['query.mainPlan']: e.detail.selectedValue,
      mainPlanDisplay: e.detail.displayValue
    })
    this.getSevenDayClock()
    this.getOneDayClock()
  },
  // 日期选择改变
  pickerDateChange(e) {
    this.setData({
      ['query.date']: e.detail.selectedValue,
      dateDisplay: e.detail.label
    })
    this.getOneDayClock()
  },
  // 获取近七日出勤率
  getSevenDayClock() {
    getSevenDayClock({
      data: {
        mainPlan: this.data.query.mainPlan
      }
    }).then(res => {
      const xData = []
      const yData = []
      res.map(item => {
        xData.push(dateFormat(item.date, 'yyyy-MM-dd'))
        yData.push(item.clockRate * 100)
      })
      if (xData.length > 0) {
        lineOptions.xAxis.data = xData
        lineOptions.series[0].data = yData
        if (lineChart) {
          lineChart.setOption(lineOptions)
        }
        this.setData({
          lineShow: true
        })
      } else {
        this.setData({
          lineShow: false
        })
      }
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
      this.setData({
        lineShow: false
      })
    })
  },
  // 获取当前日期的出勤情况
  getOneDayClock() {
    const params = {
      mainPlan: this.data.query.mainPlan,
      date: this.data.dateDisplay + ' 00:00:00'
    }
    getOneDayClock({
      data: params
    }).then(res => {
      // 饼图
      pieOptions.series[0].data = [{
          value: res.mainPlanClock.clockNum,
          name: '已签到'
        },
        {
          value: res.mainPlanClock.noClockNum,
          name: '待签到'
        },
        {
          value: res.mainPlanClock.dayOffNum,
          name: '已请假'
        },
        {
          value: res.mainPlanClock.absenceNum,
          name: '缺勤'
        }
      ].sort(function (a, b) {
        return a.value - b.value;
      })
      if (pieChart) {
        pieChart.setOption(pieOptions)
      }
      this.setData({
        pieShow: true
      })
      // 柱状图
      const xData = []
      const yData = []
      res.classClock.map(item => {
        xData.push(item.classInfo.name)
        yData.push(item.clockRate * 100)
      })
      if (xData.length > 0) {
        barOptions.xAxis.data = xData
        barOptions.series[0].data = yData
        if (barChart) {
          barChart.setOption(barOptions)
        }
        this.setData({
          barShow: true
        })
      } else {
        this.setData({
          barShow: false
        })
      }
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
      this.setData({
        pirShow: false,
        barShow: false
      })
    })
  }
})