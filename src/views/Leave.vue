<template>
  <div>
    <!-- 查询表单 -->
    <div class="query-form">
      <el-form :model="queryForm" ref="queryForm" :inline="true">
        <el-form-item label="审批状态" prop="applyState">
          <el-select
            v-model="queryForm.applyState"
            value-key=""
            placeholder=""
            clearable
            filterable
            @change="null"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="待审批" :value="1"></el-option>
            <el-option label="审批中" :value="2"></el-option>
            <el-option label="审批拒绝" :value="3"></el-option>
            <el-option label="审批通过" :value="4"></el-option>
            <el-option label="作废" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset(queryForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 展示表单 -->
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="applyList" border>
        <el-table-column
          v-for="col in columns"
          :prop="col.id"
          :key="col.id"
          :label="col.label"
          :width="col.width"
          :formatter="col.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button @click="handleDetail(scope.row)">查看</el-button>
            <el-button type="danger" @click="handleDelete(scope.row._id)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹框 -->
    <el-dialog title="申请休假" width="70%" v-model="showModal" ref="diagForm">
      <el-form :rules="rules" :model="leaveForm" ref="diagForm" label-width="80px" :inline="false">
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType" clearable filterable>
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="leaveForm.startTime"
                  type="date"
                  placeholder="请选择开始时期"
                  @change="handleChangeTime('startTime')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="2">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime">
                <el-date-picker
                  v-model="leaveForm.endTime"
                  type="date"
                  placeholder="请选择结束时期"
                  @change="handleChangeTime('endTime')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长">{{ leaveForm.leaveTime }}天</el-form-item>

        <el-form-item label="休假原因" prop="reasons">
          <el-input
            type="textarea"
            :row="3"
            v-model="leaveForm.reasons"
            placeholder="请输入请假原因"
            clearable
            @change=""
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(diagForm)">Cancel</el-button>
          <el-button @click="handleSubmit(diagForm)" type="primary">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, inject, ref, toRaw, nextTick } from 'vue'
import utils from '../utils/utils'
const $api = inject('$api')
import message from '../utils/message'

onMounted(_ => {
  getApplyList()
})

const applyList = ref([]) // 休假列表

const queryForm = reactive({
  applyState: '',
})

// 弹框 申请列表
const leaveForm = reactive({
  applyType: '1',
  startTime: '',
  endTime: '',
  leaveTime: '',
  reasons: '',
})
const showModal = ref(false)
const action = ref('create') // createe创建
const diagForm = ref() // 弹框实例
// 分页
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 10,
})

// 列名
const columns = reactive([
  {
    label: '单号',
    prop: 'orderNo',
  },
  {
    label: '休假时间',
    prop: '',
    formatter(row) {
      return (
        utils.formateDate(new Date(row.startTime), 'yyyy-MM-dd') +
        '到' +
        utils.formateDate(new Date(row.endTime), 'yyyy-MM-dd')
      )
    },
  },
  {
    label: '休假时长',
    prop: 'leaveTime',
  },
  {
    label: '休假类型',
    prop: 'applyType',
    formatter(row, column, value) {
      return {
        1: '事假',
        2: '调休',
        3: '年假',
      }[value]
    },
  },
  {
    label: '休假原因',
    prop: 'reasons',
  },
  {
    label: '申请时间',
    prop: 'createTime',
    width: 180,
    formatter: (row, column, value) => {
      return utils.formateDate(new Date(value))
    },
  },
  {
    label: '审批人',
    prop: 'auditUsers',
  },
  {
    label: '当前审批人',
    prop: 'curAuditUserName',
  },
  {
    label: '审批状态',
    prop: 'applyState',
    formatter: (row, column, value) => {
      // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
      return {
        1: '待审批',
        2: '审批中',
        3: '审批拒绝',
        4: '审批通过',
        5: '作废',
      }[value]
    },
  },
])
const rules = reactive({
  startTime: [
    {
      type: 'date',
      required: true,
      message: '请输入开始日期',
      trigger: 'change',
    },
  ],
  endTime: [
    {
      type: 'date',
      required: true,
      message: '请输入结束日期',
      trigger: 'change',
    },
  ],
  reasons: [
    {
      required: true,
      message: '请输入休假原因',
      trigger: 'blur',
    },
  ],
})
const getApplyList = async _ => {
  let params = { ...queryForm, ...pager }
  const { list, page } = await $api.getLeaveList(params)
  applyList.value = list
  pager.total = page.total
}

// 申请休假弹框
const handleApply = _ => {
  showModal.value = true
  action.value = 'create'
}

// 查询
const handleQuery = () => {}

// 重置
const handleReset = formRef => {
  formRef.resetFields()
}

//关闭提交弹框
const handleClose = diagForm => {
  showModal.value = false
  handleReset(diagForm)
}

const handleChangeTime = (key, val) => {
  let { startTime, endTime } = leaveForm
  if (!startTime || !endTime) return
  if (endTime < startTime) {
    message.error('开始日期不能晚于结束日期')
    leaveForm.leaveTime = '0天'
    setTimeout(() => {
      leaveForm[key] = ''
    }, 0)
  } else {
    leaveForm.leaveTime = (endTime - startTime) / (24 * 60 * 60 * 1000) + 1
  }
}

//
const handleSubmit = async diagForm => {
  diagForm.validate(valid => {
    if (valid) {
      let params = { ...leaveForm, action: action.value }
      let res = $api.leaveOperate(params)
      handleClose(diagForm)
      message.success('休假成功')
    }
  })
}
</script>
