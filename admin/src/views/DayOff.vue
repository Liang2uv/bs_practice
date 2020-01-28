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
        <el-table-column prop="studentInfo.username" label="学生姓名" align="center"></el-table-column>
        <el-table-column prop="studentInfo.number" label="学号" align="center"></el-table-column>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.startAt | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.endAt | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskInfo.name" label="关联任务" align="center"></el-table-column>
        <el-table-column label="请假理由" align="center">
          <template slot-scope="scope">
            <span class="link" @click="onOpenReason(scope.row.reason)">点击查看</span>
          </template>
        </el-table-column>
        <el-table-column label="证明材料" align="center">
          <template slot-scope="scope">
            <span class="link" @click="onOpenFiles(scope.row.files)">点击查看</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusformat(statusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click="review(scope.row, 1)" type="text" size="small" v-if="scope.row.status === 0">通过</el-button>
            <el-button @click="review(scope.row, 2)" type="text" size="small" v-if="scope.row.status === 0">驳回</el-button>
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
    <!-- 申请理由详情对话框 -->
    <el-dialog v-if="reasonInfo" title="详细信息" :visible.sync="reasonDialogVisible">
      <el-card class="box-card" shadow="never">
        申请理由：<br/>{{ reasonInfo }}
      </el-card>
    </el-dialog>
    <!-- 申请材料详情对话框 -->
    <el-dialog v-if="filesInfo" title="详细信息" :visible.sync="filesDialogVisible">
      <el-card class="box-card" shadow="never">
        申请材料：<br/>
        <div class="demo-image__preview">
          <el-image 
            v-for="file in filesInfo"
            :key="file.fileurl"
            style="width: 100px; height: 100px"
            :src="file.fileurl" 
            :preview-src-list="filesInfo.map(v => v.fileurl)">
          </el-image>
        </div>
      </el-card>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'day-off',
  data() {
    return {
      resource: 'day_offs',
      tableData: { total: 0, list: [] },
      reasonDialogVisible: false,
      filesDialogVisible: false,
      tableHeight: 0,
      reasonInfo: null,
      filesInfo: null,
      query: {
        teaId: null,
        stuSearch: '',
        status: 0,
        page: 1,
        size: 30
      },
      statusArr: ['待审核', '已通过', '不通过']
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    onOpenReason(info) {
      this.reasonInfo = info
      this.reasonDialogVisible = true
    },
    onOpenFiles(info) {
      this.filesInfo = info
      this.filesDialogVisible = true
    },
    // 审核
    review(row, status) {
      this.$prompt('请输入理由（可空）', '确认消息').then(async ({ value }) => {
        const [err, res] = await this.$store.dispatch('UpdateDayOff', { id: row._id, data: { status } })
        this.getList()
        if (!err) {
          this.$message.success('操作成功')
        }
      })
    },
    // 获取列表
    async getList(){
      this.query.teaId = this.userInfo._id
      const [err, res] = await this.$store.dispatch('GetDayOffList', { data: this.query })
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
