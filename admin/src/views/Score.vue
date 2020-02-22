<template>
  <el-container>
    <el-header class="d-flex ai-center jc-between border-bottom" height="40px">
      <div>
        <span class="fs-xs px-1">搜索</span>
        <el-input
          size="mini"
          placeholder="学生姓名或学号..."
          style="width: 200px;"
          v-model="query.stuSearch"
        ></el-input>
        <span class="fs-xs px-1">实习计划</span>
        <el-select v-model="query.mainPlan" placeholder="请选择" size="mini" style="width:250px;" >
          <el-option
            v-for="item in mainPlanList"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
        <span class="px-1"></span>
        <el-button @click="onSearch" type="primary" size="mini">搜索</el-button>
      </div>
      <el-button @click="onCalc" type="primary" size="mini">更新数据</el-button>
    </el-header>
    <el-main>
      <!-- 表格 -->
      <el-table :data="tableData.list" :height="tableHeight" border>
        <el-table-column label="序号" type="index" align="center" width="70" />
        <el-table-column prop="mainPlanInfo.name" label="实习计划" align="center"></el-table-column>
        <el-table-column prop="studentInfo.username" label="学生姓名" align="center"></el-table-column>
        <el-table-column prop="studentInfo.number" label="学号" align="center"></el-table-column>
        <el-table-column prop="studentInfo.collegeInfo.name" label="学院" align="center"></el-table-column>
        <el-table-column prop="studentInfo.majorInfo.name" label="专业" align="center"></el-table-column>
        <el-table-column prop="studentInfo.gradeInfo.name" label="年级" align="center"></el-table-column>
        <el-table-column prop="studentInfo.classInfo.name" label="班级" align="center"></el-table-column>
        <el-table-column prop="totalScore" label="总成绩" align="center"></el-table-column>
        <el-table-column prop="noteDayScore" label="实习日记成绩" align="center"></el-table-column>
        <el-table-column prop="noteWeekScore" label="实习周记成绩" align="center"></el-table-column>
        <el-table-column prop="noteMonthScore" label="实习月记成绩" align="center"></el-table-column>
        <el-table-column prop="noteSummaryScore" label="实习总结成绩" align="center"></el-table-column>
        <el-table-column prop="clockScore" label="签到成绩" align="center"></el-table-column>
        <el-table-column prop="companyScore" label="实习单位评价成绩" align="center"></el-table-column>
        <el-table-column label="更新日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updatedAt | dateformat }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;padding-top: 10px;">
        <el-pagination
          small
          background
          layout="prev, pager, next, total"
          @current-change="pageChange"
          :total="tableData.total"
          :page-size="query.size"
          :current-page="query.page"
        ></el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'score',
  data() {
    return {
      resource: 'scores',
      tableData: { total: 0, list: [] },
      tableHeight: 0,
      query: {
        mainPlan: null,
        stuSearch: '',
        page: 1,
        size: 30
      },
      mainPlanList: [],
      isInit: true
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 获取老师管理的实习计划列表
    async getMainPlanList() {
      this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const [err, res] = await this.$store.dispatch('GetMainPlanListForTeacher', { data: { teacher: this.userInfo._id } })
      if (!err) {
        this.mainPlanList = res
        if (this.isInit && this.mainPlanList.length > 0) {
          this.query.mainPlan = this.mainPlanList[0]._id
          this.isInit = false
          this.getList()
        }
      }
      this.$loading().close()
    },
    // 获取列表
    async getList(){
      this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const [err, res] = await this.$store.dispatch('GetScoreList', { data: this.query })
      if (!err) {
        this.tableData = res
      }
      this.$loading().close()
    },
    // 页码改变
    pageChange(val) {
      this.query.page = val
      this.getList()
    },
    // 搜索
    onSearch() {
      this.query.page=1
      this.getList()
    },
    // 一键统计
    async onCalc() {
      try {
        await this.$confirm(`将统计当前实习计划已完成任务的所有学生的总成绩，此操作需要一定时间，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const [err, res] = await this.$store.dispatch('CalcScoreForMainPlan', { data: { mainPlan: this.query.mainPlan } })
        if (!err) {
          this.$message.success(res.message)
          this.onSearch()
        }
        this.$loading().close()
      } catch (error) {
      }
    }
  },
  created() {
    this.getMainPlanList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = document.body.clientHeight - 180
    })
  }
}
</script>

