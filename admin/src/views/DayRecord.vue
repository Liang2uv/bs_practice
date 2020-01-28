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
        <span class="fs-xs px-1">状态</span>
        <el-select v-model="query.status" placeholder="请选择" size="mini" style="width:120px;" >
          <el-option
            v-for="(item, index) in statusArr"
            :key="index"
            :label="item"
            :value="index">
          </el-option>
        </el-select>
        <span class="px-1"></span>
        <el-button @click="onSearch" type="primary" size="mini">搜索</el-button>
      </div>
    </el-header>
    <el-main>
      <!-- 表格 -->
      <el-table :data="tableData.list" :height="tableHeight" border>
        <el-table-column label="序号" type="index" align="center" width="70" />
        <el-table-column label="日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.date | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="studentInfo.username" label="学生姓名" align="center"></el-table-column>
        <el-table-column prop="studentInfo.number" label="学号" align="center"></el-table-column>
        <el-table-column prop="taskInfo.name" label="任务名称" align="center"></el-table-column>
        <el-table-column prop="clock.distance" label="签到距离（米）" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusformat(statusArr) }}</span>
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
  name: 'day-record',
  data() {
    return {
      resource: 'day_records',
      tableData: { total: 0, list: [] },
      tableHeight: 0,
      query: {
        teaId: null,
        stuSearch: '',
        status: 0,
        page: 1,
        size: 30
      },
      statusArr: ['待签到', '已签到', '已请假', '缺勤']
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 获取列表
    async getList(){
      this.query.teaId = this.userInfo._id
      const [err, res] = await this.$store.dispatch('GetDayRecordList', { data: this.query })
      if (!err) {
        this.tableData = res
      }
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
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = document.body.clientHeight - 180
    })
  }
}
</script>
<style lang="scss" scoped>
.link {
  text-decoration: underline;
  color: #606266;
  cursor: pointer;
}
</style>
