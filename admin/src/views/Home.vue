<template>
  <div class="p-3">
    <!-- 审核卡片 -->
    <div class="d-flex jc-between">
      <router-link tag="span" to="/task" class="bg-white p-3 d-flex ai-center jc-between d-card">
        <i class="el-icon-s-check text-cyan" style="font-size:37px;"></i>
        <div>
          <div class="fs-xs my-1">实习任务</div>
          <div class="fs-sm">待审核：{{ reviewSum.taskReviewNum }}</div>
        </div>
      </router-link>
      <router-link tag="span" to="/day-off" class="bg-white p-3 d-flex ai-center jc-between d-card">
        <i class="el-icon-data-line text-blue" style="font-size:37px;"></i>
        <div>
          <div class="fs-xs my-1">请假审核</div>
          <div class="fs-sm">待审核：{{ reviewSum.dayOffReviewNum }}</div>
        </div>
      </router-link>
      <router-link tag="span" to="/circle_review" class="bg-white p-3 d-flex ai-center jc-between d-card">
        <i class="el-icon-orange text-orange" style="font-size:37px;"></i>
        <div>
          <div class="fs-xs my-1">进圈审核</div>
          <div class="fs-sm">待审核：{{ reviewSum.circleReviewNum }}</div>
        </div>
      </router-link>
    </div>
    <!-- 图表 -->
    <div class="select-con d-flex ai-center">
      <span>实习计划：</span>
      <el-select v-model="query.mainPlan" placeholder="请选择" size="mini" style="width:250px;" >
        <el-option
          v-for="item in mainPlanList"
          :key="item._id"
          :label="item.name"
          :value="item._id">
        </el-option>
      </el-select>
      <span class="ml-2">日期：</span>
      <el-date-picker
        v-model="query.date"
        type="date"
        size="mini"
        placeholder="选择日期">
      </el-date-picker>
      <el-button class="ml-2" @click="onSearch" type="primary" size="mini">查询</el-button>
    </div>
    <!-- 近七日出勤率 -->
    <div class="title">近七日出勤率%（注：出勤率=(已签到+已请假)/总人数）</div>
    <div style="width: 100%; height: 400px;">
      <v-chart theme="light" :options="lineOptions"/>
    </div>
    <!-- 今日出勤情况 -->
    <div style="display: inline-block; width: 50%;">
      <div class="title">出勤情况（{{ query.date | dateformat('YYYY-MM-DD') }}）</div>
      <div style="height: 300px;">
        <v-chart theme="light" :options="pieOptions"/>
      </div>
    </div>
    <!-- 各班出勤对比 -->
    <div style="display: inline-block; width: 50%;">
      <div class="title">各班出勤率对比%（{{ query.date | dateformat('YYYY-MM-DD') }}）</div>
      <div style="height: 300px;">
        <v-chart theme="light" :options="barOptions"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dateformat } from '../filters/index'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'

export default {
  name: 'home',
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      resource: 'day_summaries',
      reviewSum: {
        taskReviewNum: 0,
        dayOffReviewNum: 0,
        circleReviewNum: 0
      },
      query: {
        mainPlan: null,
        date: new Date(new Date().getTime() - 24 * 3600 * 1000)
      },
      isInit: true,
      mainPlanList: [],
      lineOptions: {
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
      },
      pieOptions: {
        backgroundColor: '#f1f1f2',
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}人 ({d}%)'
        },
        series: [
          {
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
          }
        ]
      },
      barOptions: {
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
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 获取待审核情况
    async getReviewSum() {
      const [err, res] = await this.$store.dispatch('GetReviewSum')
      if (!err) {
        this.reviewSum = res
      }
    },
    // 获取老师管理的实习计划列表
    async getMainPlanList() {
      const [err, res] = await this.$store.dispatch('GetMainPlanListForTeacher', { data: { teacher: this.userInfo._id } })
      if (!err) {
        this.mainPlanList = res
        if (this.mainPlanList.length > 0 && this.isInit) {
          this.query.mainPlan = this.mainPlanList[0]._id
          this.getSevenDayClock()
          this.getOneDayClock()
          this.isInit = false
        }
      }
    },
    // 获取近七日出勤率
    async getSevenDayClock() {
      const [err, res] = await this.$store.dispatch('GetSevenDayClock', { data: { mainPlan: this.query.mainPlan } })
      if (!err) {
        const xData = []
        const yData = []
        res.map(item => {
          xData.push(dateformat(item.date, 'YYYY-MM-DD'))
          yData.push(item.clockRate * 100)
        })
        this.lineOptions.xAxis.data = xData
        this.lineOptions.series[0].data = yData
      }
    },
    // 获取当前日期的出勤情况
    async getOneDayClock() {
      const [err, res] = await this.$store.dispatch('GetOneDayClock', { data: this.query })
      if (!err) {
        this.pieOptions.series[0].data = [
          {value: res.mainPlanClock.clockNum, name: '已签到'},
          {value: res.mainPlanClock.noClockNum, name: '待签到'},
          {value: res.mainPlanClock.dayOffNum, name: '已请假'},
          {value: res.mainPlanClock.absenceNum, name: '缺勤'}
        ].sort(function (a, b) { return a.value - b.value; })
        const xData = []
        const yData = []
        res.classClock.map(item => {
          xData.push(item.classInfo.name)
          yData.push(item.clockRate * 100)
        })
        this.barOptions.xAxis.data = xData
        this.barOptions.series[0].data = yData
      }
    },
    // 搜索
    onSearch() {
      this.getSevenDayClock()
      this.getOneDayClock()
    }
  },
  created() {
    this.getMainPlanList()
    this.getReviewSum()
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variable.scss";
.d-card {
  width: 30%;
  box-shadow: 0px 0px 10px #aaa;
  cursor: pointer;
  transition: all 0.3s;
}
.d-card:hover {
  transform: scale(1.1);
}
.select-con {
  border-bottom: 1px solid #ccc;
  padding: 20px 0px 10px 0px;
  font-size: 14px;
}
.echarts {
  width: 100%;
  height: 100%;
}
.title {
  font-size: 14px;
  padding: 10px 0px;
  text-indent: 10px;
  position: relative;
}
.title::before{
  content: '';
  display: block;
  width: 4px;
  height: 20px;
  border-radius: 2px;
  background-color: #f37b1d;
  position: absolute;
}
</style>