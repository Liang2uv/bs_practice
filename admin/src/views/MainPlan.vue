<template>
  <el-container class="con-mainplan">
    <el-header class="d-flex ai-center jc-between border-bottom" height="40px">
      <div>
        <el-input
          size="mini"
          placeholder="实习计划名称..."
          suffix-icon="el-icon-search"
          style="width: 200px;margin-right:20px;"
          v-model="query.name"
        ></el-input>
        <el-button @click="onSearch" type="primary" size="mini">搜索</el-button>
      </div>
      <el-button @click="onAdd" type="primary" size="mini">新建计划</el-button>
    </el-header>
    <el-main>
      <!-- 表格 -->
      <el-table :data="tableData.list" :height="tableHeight" border>
        <el-table-column label="序号" type="index" align="center" width="70" />
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="startAt" label="开始时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.startAt | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endAt" label="截止时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.endAt | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="times" label="至少实习天数(天)" align="center"></el-table-column>
        <el-table-column prop="createAt" label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createAt | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click="onDelete(scope.row._id)" type="text" size="small">删除</el-button>
            <el-button @click="onEdit(scope.row._id)" type="text" size="small">编辑</el-button>
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
    <!-- 对话框 -->
    <el-dialog
      title="详细信息"
      :visible.sync="dialogVisible"
      center
      :close-on-click-modal="false"
      width="60%"
      @close="dialogClose"
    >
      <el-form :model="model" :rules="rules" ref="el-form" label-width="100px" inline>
        <el-tabs type="border-card" value="basic">
          <!-- 基础信息 -->
          <el-tab-pane label="基础信息" name="basic">
            <el-form-item prop="name" label="计划名称：">
              <el-input v-model="model.name" style="width:400px" />
            </el-form-item>
            <el-form-item prop="datespan" label="起始日期：">
              <el-date-picker
                v-model="model.datespan"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="times" label="实习天数：">
              至少
              <el-input-number
                v-model="model.times"
                controls-position="right"
                :min="1"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>天
              <el-tooltip class="item" effect="dark" content="该天数将用作签到，所有应排除周末与节假日" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="teacher" label="指导老师：">
              <el-select v-model="model.teacher" multiple>
                <el-option
                  v-for="item in teacherList"
                  :key="item._id"
                  :label="item.username"
                  :value="item._id"
                >
                  <span style="float: left">{{ item.username }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px"
                  >{{ item.collegeInfo.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <!-- 实习材料 -->
          <el-tab-pane label="实习材料" name="files">
            <el-button size="small" @click="model.files.push({})">
              <i class="el-icon-plus"></i>添加材料
            </el-button>
            <el-row type="flex" style="flex-wrap: wrap;">
              <el-col :span="24" v-for="(item,index) in model.files" :key="index" class="file-item">
                <el-form-item
                  :prop="`files[${index}].name`"
                  :rules="[{ required: true, message: '材料名不能为空'}]"
                  label="名称："
                >
                  <el-input v-model="item.name" />
                </el-form-item>
                <el-form-item label="文件：">
                  <el-upload
                    class="upload-demo"
                    :action="uploadUrl"
                    :headers="getAuthHeaders()"
                    :show-file-list="false"
                    :disabled="item.filename !== undefined"
                    :on-success="res => {$set(item, 'fileurl',res.url);$set(item, 'filename',res.originalname)}"
                    :on-error="err => $message.error(err.message)"
                  >
                    <el-button size="mini" v-if="!item.filename">点击上传</el-button>
                    <span @click="onDownload(item.fileurl, item.filename)">{{ item.filename }}</span>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button size="mini" type="danger" @click="model.files.splice(index, 1)">删除</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- 考评机制 -->
          <el-tab-pane label="考评机制" name="rate">
            <!-- 总分 -->
            <el-form-item
              :prop="'rate.totalScore'"
              :rules="[
                { required: true, message: '总分不能为空'},
                { type: 'number', message: '总分必须为数字'}
              ]"
              label="总分："
            >
              <el-input-number
                v-model="model.rate.totalScore"
                controls-position="right"
                :min="0"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>
              <el-tooltip class="item" effect="dark" content="如果不需要开启，请填写0" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <!-- 签到占比 -->
            <el-form-item
              :prop="'rate.clockRate'"
              :rules="[
              { required: true, message: '签到占比不能为空'},
              { type: 'number', message: '签到占比必须为数字'}
            ]"
              label="签到占比："
              label-width="150px"
            >
              <el-input-number
                v-model="model.rate.clockRate"
                controls-position="right"
                :min="0"
                :max="100"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>%
              <el-tooltip class="item" effect="dark" content="如果不需要开启，请填写0" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <!-- 实习日记 -->
            <el-form-item
              :prop="'rate.noteDayNum'"
              :rules="[
                { required: true, message: '实习日记篇数不能为空'},
                { type: 'number', message: '实习日记篇数必须为数字'}
              ]"
              label="实习日记："
            >
              至少
              <el-input-number
                v-model="model.rate.noteDayNum"
                controls-position="right"
                :min="0"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>篇
              <el-tooltip class="item" effect="dark" content="如果不需要开启，请填写0" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <!-- 实习日记占比 -->
            <el-form-item
              :prop="'rate.noteDayRate'"
              :rules="[
              { required: true, message: '实习日记占比不能为空'},
              { type: 'number', message: '实习日记占比必须为数字'}
            ]"
              label="实习日记占比："
              label-width="130px"
            >
              <el-input-number
                v-model="model.rate.noteDayRate"
                controls-position="right"
                :min="0"
                :max="100"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>%
              <el-tooltip class="item" effect="dark" content="如果不需要开启，请填写0" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <!-- 实习周记 -->
            <el-form-item
              :prop="'rate.noteWeekNum'"
              :rules="[
                { required: true, message: '实习周记篇数不能为空'},
                { type: 'number', message: '实习周记篇数必须为数字'}
              ]"
              label="实习周记："
            >
              至少
              <el-input-number
                v-model="model.rate.noteWeekNum"
                controls-position="right"
                :min="0"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>篇
              <el-tooltip class="item" effect="dark" content="如果不需要开启，请填写0" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <!-- 实习周记占比 -->
            <el-form-item
              :prop="'rate.noteWeekRate'"
              :rules="[
              { required: true, message: '实习周记占比不能为空'},
              { type: 'number', message: '实习周记占比必须为数字'}
            ]"
              label="实习周记占比："
              label-width="130px"
            >
              <el-input-number
                v-model="model.rate.noteWeekRate"
                controls-position="right"
                :min="0"
                :max="100"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>%
              <el-tooltip class="item" effect="dark" content="如果不需要开启，请填写0" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <!-- 实习月记 -->
            <el-form-item
              :prop="'rate.noteMonthNum'"
              :rules="[
              { required: true, message: '实习月记篇数不能为空'},
              { type: 'number', message: '实习月记篇数必须为数字'}
            ]"
              label="实习月记："
            >
              至少
              <el-input-number
                v-model="model.rate.noteMonthNum"
                controls-position="right"
                :min="0"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>篇
              <el-tooltip class="item" effect="dark" content="如果不需要开启，请填写0" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <!-- 实习月记占比 -->
            <el-form-item
              :prop="'rate.noteMonthRate'"
              :rules="[
              { required: true, message: '实习月记占比不能为空'},
              { type: 'number', message: '实习月记占比必须为数字'}
            ]"
              label="实习月记占比："
              label-width="130px"
            >
              <el-input-number
                v-model="model.rate.noteMonthRate"
                controls-position="right"
                :min="0"
                :max="100"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>%
              <el-tooltip class="item" effect="dark" content="如果不需要开启，请填写0" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <!-- 实习总结 -->
            <el-form-item
              :prop="'rate.noteSummaryNum'"
              :rules="[
              { required: true, message: '实习总结篇数不能为空'},
              { type: 'number', message: '实习总结篇数必须为数字'}
            ]"
              label="实习总结："
            >
              至少
              <el-input-number
                v-model="model.rate.noteSummaryNum"
                controls-position="right"
                :min="0"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>篇
              <el-tooltip class="item" effect="dark" content="如果不需要开启，请填写0" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <!-- 实习总结占比 -->
            <el-form-item
              :prop="'rate.noteSummaryRate'"
              :rules="[
              { required: true, message: '实习总结占比不能为空'},
              { type: 'number', message: '实习总结占比必须为数字'}
            ]"
              label="实习总结占比："
              label-width="130px"
            >
              <el-input-number
                v-model="model.rate.noteSummaryRate"
                controls-position="right"
                :min="0"
                :max="100"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>%
              <el-tooltip class="item" effect="dark" content="如果不需要开启，请填写0" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <!-- 实习单位评价占比 -->
            <el-form-item
              :prop="'rate.companyRate'"
              :rules="[
              { required: true, message: '实习单位评价占比不能为空'},
              { type: 'number', message: '实习单位评价占比必须为数字'}
            ]"
              label="实习单位评价占比："
              label-width="150px"
            >
              <el-input-number
                v-model="model.rate.companyRate"
                controls-position="right"
                :min="0"
                :max="100"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>%
              <el-tooltip class="item" effect="dark" content="如果不需要开启，请填写0" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" style="margin-right:20px;">取 消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDateDiff } from 'utils/index.js'
import { download } from 'utils/download.js'
export default {
  name: 'main-plan',
  data() {
    return {
      resource: 'main_plans',
      tableData: { total: 0, list: [] },
      model: { 
        files: [], 
        rate: {
          totalScore: 0,
          noteDayNum: 0,
          noteWeekNum: 0,
          noteMonthNum: 0,
          noteSummaryNum: 0,
          clockRate: 0,
          noteDayRate: 0,
          noteWeekRate: 0,
          noteMonthRate: 0,
          noteSummaryRate: 0,
          companyRate: 0
        } 
      },
      dialogVisible: false,
      tableHeight: 0,
      rules: {
        name: [
          {required: true, message: '请输入计划名称', trigger: 'blur'}
        ],
        datespan: [
          {required: true, message: '请选择开始日期和截止日期', trigger: 'blur'}
        ],
        times: [
          {required: true, message: '请输入至少实习天数', trigger: 'blur'}
        ],
        teacher: [
          {required: true, message: '请选择指导老师', trigger: 'blur'}
        ],
      },
      query: {
        name: '',
        page: 1,
        size: 30
      },
      teacherList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 获取指导老师列表
    async getTeacherList() {
      const params = { school: `^${this.userInfo.school}$`, role: '^teacher$', refs: 'collegeInfo' }
      const [err, res] = await this.$store.dispatch('CrudListByFilterAndRefs', { resource: 'admin_users', data: params })
      if (!err) {
        this.teacherList = res
      }
    },
    // 获取列表
    async getList(){
      const [err, res] = await this.$store.dispatch('CrudListByFilterAndPaging', { resource: this.resource, data: this.query })
      if (!err) {
        this.tableData = res
      }
    },
    // 获取详情
    async getDetail(id) {
      const [err, res] = await this.$store.dispatch('CrudOneById', { resource: this.resource, id })
      if (!err) return res
    },
    // 删除
    async onDelete(id) {
      try {
        await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const [err, res] = await this.$store.dispatch('CrudDelete', { resource: this.resource, id })
        if (!err) {
          this.$message.success('删除成功')
          if (this.tableData.list.length === 1) {
            this.query.page = this.query.page === 1 ? 1 : this.query.page - 1
          }
          this.getList()
        }
      } catch (error) {
      }
    },
    // 编辑
    async onEdit(id) {
      const res = await this.getDetail(id)
      if (res) {
        this.model = Object.assign({}, this.model, res)
        this.model.datespan = [res.startAt, res.endAt]
        this.dialogVisible = true
      }
    },
    // 添加
    onAdd() {
      this.model = { 
        files: [], 
        rate: {
          totalScore: 0,
          noteDayNum: 0,
          noteWeekNum: 0,
          noteMonthNum: 0,
          noteSummaryNum: 0,
          clockRate: 0,
          noteDayRate: 0,
          noteWeekRate: 0,
          noteMonthRate: 0,
          noteSummaryRate: 0,
          companyRate: 0
        } 
      }
      this.dialogVisible = true
    },
    // 保存
    onSave() {
      this.$refs['el-form'].validate(async (valid) => {
        if (!valid || !this.formValidate()) {
          return false
        }
        this.model.startAt = this.model.datespan[0]
        this.model.endAt = this.model.datespan[1]
        this.model.school = this.userInfo.school
        delete this.model.datespan
        const [err, res] = await this.$store.dispatch(this.model._id ? 'CrudUpdate' : 'CrudAdd', { resource: this.resource, id: this.model._id, data: this.model })
        if (!err) {
          this.$message.success('保存成功')
          this.getList()
          this.dialogVisible = false
        }
      })
    },
    // 表单校验
    formValidate() {
      if (this.model.times > getDateDiff(this.model.datespan[0], this.model.datespan[1], 'days')) {
        this.$message.error('实习天数不能大于起始时间天数')
        return false
      }
      const totalRate = this.model.rate.clockRate + this.model.rate.noteDayRate + this.model.rate.noteWeekRate + this.model.rate.noteMonthRate + this.model.rate.noteSummaryRate + this.model.rate.companyRate
      if (totalRate !== 0 && totalRate !== 100) {
        this.$message.error('占比分配不合法，请重新分配')
        return false
      }
      return true
    },
    // 对话框关闭
    dialogClose() {
      this.$refs['el-form'].clearValidate()
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
    this.getTeacherList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = document.body.clientHeight - 180
    })
  }
}
</script>

<style lang="scss" scoped>
.con-mainplan {
  .file-item {
    padding-top: 15px;
    &:nth-of-type(n + 2) {
      border-top: 1px dashed #ccc;
    }
  }
}
</style>