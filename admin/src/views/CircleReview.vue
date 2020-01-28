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
        <el-table-column prop="userInfo.username" label="学生姓名" align="center"></el-table-column>
        <el-table-column prop="userInfo.number" label="学号" align="center"></el-table-column>
        <el-table-column prop="circleInfo.name" label="圈子名称" align="center"></el-table-column>
        <el-table-column label="申请时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updatedAt | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusformat(statusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              @click="review(scope.row, 1)"
              type="text"
              size="small"
              v-if="scope.row.status === 0"
            >同意加入</el-button>
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
  name: 'circle_review',
  data() {
    return {
      resource: 'circle_users',
      tableData: { total: 0, list: [] },
      tableHeight: 0,
      query: {
        teaId: null,
        stuSearch: '',
        status: 0,
        page: 1,
        size: 30
      },
      statusArr: ['待审核', '已加入']
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 审核
    async review(row, status) {
      const [err, res] = await this.$store.dispatch('CrudUpdate', { resource: this.resource, id: row._id, data: { status } })
      const message = {
        content: `您申请加入的圈子“${row.circleInfo.name}”管理员已同意加入，快去看看吧`,
        send: this.userInfo._id,
        receive: row.user,
        type: 'system',
        status: 0
      }
      await this.$store.dispatch('CrudAdd', { resource: 'messages', data: message })
      this.getList()
      if (!err) {
        this.$message.success('操作成功')
      }
    },
    // 获取列表
    async getList(){
      this.query.teaId = this.userInfo._id
      const [err, res] = await this.$store.dispatch('GetCricleUserList', { data: this.query })
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