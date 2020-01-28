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
        <el-select v-model="query.status" placeholder="请选择" size="mini" style="width:120px;">
          <el-option v-for="(item, index) in statusArr" :key="index" :label="item" :value="index"></el-option>
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
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">
            <span
              class="link"
              @click="onOpenContent(scope.row)"
            >点击查看</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskInfo.name" label="所属任务" align="center"></el-table-column>
        <el-table-column label="关联日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.date | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="分数(分)" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusformat(statusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click="mark(scope.row)" type="text" size="small">评分</el-button>
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
    <!-- 内容详情对话框 -->
    <el-dialog v-if="contentInfo" title="内容" :visible.sync="contentDialogVisible">
      创建日期：{{ contentInfo.createdAt | dateformat }}<br/>
      更新日期：{{ contentInfo.updatedAt | dateformat }}<br/>
      关联日期：{{ contentInfo.date | dateformat }}<br/>
      <el-card class="box-card" shadow="never">
        {{ contentInfo.content }}
        <div v-if="contentInfo.imgs" class="demo-image__preview">
          <el-image
            v-for="(img, index) in contentInfo.imgs"
            :key="index"
            style="width: 100px; height: 100px"
            :src="img"
            :preview-src-list="contentInfo.imgs"
          ></el-image>
        </div>
      </el-card>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'note-day',
  data() {
    return {
      resource: 'notes',
      tableData: { total: 0, list: [] },
      contentDialogVisible: false,
      tableHeight: 0,
      contentInfo: null,
      query: {
        teaId: null,
        stuSearch: '',
        type: 'day',
        status: 0,
        page: 1,
        size: 30
      },
      statusArr: ['待审核', '已审核']
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    onOpenContent(info) {
      this.contentInfo = info
      this.contentDialogVisible = true
    },
    // 评分
    mark(row) {
      this.$prompt('请在0-5打分（如：5）', '打分').then(async ({ value }) => {
        const score = parseInt(value)
        if (isNaN(score) || score < 0 || score > 5) {
          this.$message.error('分数不合法')
          return
        }
        const [err, res] = await this.$store.dispatch('CrudUpdate', { resource: this.resource, id: row._id, data: { status: 1, score: score } })
        this.getList()
        if (!err) {
          this.$message.success('操作成功')
        }
      }).catch(()=>{})
    },
    // 获取列表
    async getList(){
      this.query.teaId = this.userInfo._id
      const [err, res] = await this.$store.dispatch('GetNoteList', { data: this.query })
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
