<template>
  <el-container>
    <el-header class="d-flex ai-center jc-between border-bottom" height="40px">
      <div>
        <span class="fs-xs px-1">任务名称</span>
        <el-input
          size="mini"
          placeholder="任务名称..."
          style="width: 200px;"
          v-model="query.name"
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
        <el-table-column prop="name" label="任务名称" align="center"></el-table-column>
        <el-table-column label="申请人" align="center">
          <template slot-scope="scope">
            <span
              class="link"
              @click="onOpenApplicant(scope.row.applicantInfo)"
              title="点击查看申请人信息"
            >{{ scope.row.applicantInfo.username }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="company" label="公司名称" align="center"></el-table-column>
        <el-table-column prop="address.address" label="工作地点" align="center"></el-table-column>
        <el-table-column label="所属计划" align="center">
          <template slot-scope="scope">
            <span
              class="link"
              @click="onOpenMainPlan(scope.row.mainPlanInfo)"
              title="点击查看计划信息"
            >{{ scope.row.mainPlanInfo.name }}</span>
          </template>
        </el-table-column>
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
        <el-table-column prop="workDays" label="实习有效天数" align="center"></el-table-column>
        <el-table-column label="实习材料" align="center">
          <template slot-scope="scope">
            <span class="link" @click="onOpenFiles(scope.row.files)">点击查看</span>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="单位联系人" align="center"></el-table-column>
        <el-table-column prop="contactPhone" label="联系人电话" align="center"></el-table-column>
        <el-table-column prop="post" label="岗位" align="center"></el-table-column>
        <el-table-column prop="salary" label="薪资(元)" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusformat(statusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click="review(scope.row, 'pass')" type="text" size="small" v-if="scope.row.status === 0">通过</el-button>
            <el-button @click="review(scope.row, 'return')" type="text" size="small" v-if="scope.row.status === 0">驳回</el-button>
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
    <!-- 申请人详情对话框 -->
    <el-dialog v-if="applicantInfo" title="详细信息" :visible.sync="applicantDialogVisible">
      <el-card class="box-card" shadow="never">
        姓名：{{ applicantInfo.username }}
        <br />
        学号：{{ applicantInfo.number }}
        <br />
        学院：{{ applicantInfo.collegeInfo.name }}
        <br />
        年级：{{ applicantInfo.gradeInfo.name }}
        <br />
        专业：{{ applicantInfo.majorInfo.name }}
        <br />
        班级：{{ applicantInfo.classInfo.name }}
        <br />
      </el-card>
    </el-dialog>
    <!-- 实习计划详情对话框 -->
    <el-dialog v-if="mainPlanInfo" title="详细信息" :visible.sync="mainPlanDialogVisible">
      <el-card class="box-card" shadow="never">
        计划名称：{{ mainPlanInfo.name }}
        <br />
        开始时间：{{ mainPlanInfo.startAt | dateformat }}
        <br />
        截止时间：{{ mainPlanInfo.endAt | dateformat }}
        <br />
        至少实习天数：{{ mainPlanInfo.times }}
        <br />实习材料：
        <span
          class="link"
          style="font-size:12px;color:#999;"
          v-for="item in mainPlanInfo.files"
          :key="item.fileurl"
          @click="onDownload(item.fileurl, item.filename)"
        >
          {{ item.name }}
          <br />
        </span>
      </el-card>
    </el-dialog>
    <!-- 实习材料详情对话框 -->
    <el-dialog v-if="filesInfo" title="详细信息" :visible.sync="filesDialogVisible">
      <el-tabs v-model="tabFile" tab-position="left">
        <el-tab-pane
          v-for="item in filesInfo"
          :key="item._id"
          :label="item.name"
          :name="item._id"
        >
          <div v-if="item.filename" class="link" @click="onDownload(item.fileurl, item.filename)">
            {{ item.filename }}
            <br />
          </div>
          <div v-if="item.imgs" class="demo-image__preview">
            <el-image 
              v-for="img in item.imgs"
              :key="img.imgurl"
              style="width: 100px; height: 100px"
              :src="img.imgurl" 
              :preview-src-list="item.imgs.map(v => v.imgurl)">
            </el-image>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { download } from 'utils/download.js'
import { getDateIn } from 'utils/index.js'
export default {
  name: 'task',
  data() {
    return {
      resource: 'tasks',
      tableData: { total: 0, list: [] },
      mainPlanDialogVisible: false,
      applicantDialogVisible: false,
      filesDialogVisible: false,
      tableHeight: 0,
      mainPlanInfo: null,
      applicantInfo: null,
      filesInfo: null,
      query: {
        name: '',
        teacher: '',
        refs: 'mainPlanInfo|applicantInfo',
        status: 0,
        page: 1,
        size: 30
      },
      tabFile: '',
      statusArr: ['未审核', '审核未通过', '未开始', '进行中', '已结束']
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  filters: {
    statusformat(val, statusArr) {
      return statusArr[val]
    }
  },
  methods: {
    async onOpenApplicant(info) {
      const [err, res] = await this.$store.dispatch('CrudOneByIdAndRefs', { resource: 'admin_users', id: info._id, data: { refs: 'collegeInfo|gradeInfo|majorInfo|classInfo' } })
      if (!err) {
        this.applicantInfo = res
        this.applicantDialogVisible = true
      }
    },
    onOpenFiles(info) {
      this.filesInfo = info
      if (info.length > 0) {
        this.tabFile = info[0]._id
      }
      this.filesDialogVisible = true
    },
    onOpenMainPlan(info) {
      this.mainPlanInfo = info
      this.mainPlanDialogVisible = true
    },
    // 获取列表
    async getList(){
      this.query.teacher = this.userInfo._id
      const [err, res] = await this.$store.dispatch('CrudListByFilterAndRefsPaging', { resource: this.resource, data: this.query })
      if (!err) {
        this.tableData = res
      }
    },
    // 审核
    review(row, handle) {
      let status = 1  // 默认是未通过
      if (handle === 'pass') {  // 点击通过的操作
        const ret = getDateIn(new Date() ,[row.startAt, row.endAt])
        switch (ret) {
          case 0:
            status = 2
            break
          case 1:
            status = 3
          break
          case 2:
            status = 4
          break
        }
      }
      this.$prompt('请输入理由（可空）', '确认消息').then(async ({ value }) => {
        const [err, res] = await this.$store.dispatch('CrudUpdate', { resource: this.resource, id: row._id, data: { status } })
        this.getList()
        if (!err) {
          this.$message.success('操作成功')
        }
      })
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
    // 下载文件
    onDownload(url, name) {
      download(url, name)
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
