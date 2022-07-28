<template>
  <div class="">
    <div class="query-form">
      <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="80px">
        <el-form-item label="审批状态" prop="applyState">
          <el-select
            v-model="queryForm.applyState"
            value-key=""
            placeholder=""
            clearable
            filterable
            @change=""
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

    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="applyList" border stripe>
        <el-table-column
          v-for="col in columns"
          :prop="col.id"
          :key="col.id"
          :label="col.label"
          :width="col.width"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="mini" @click="handleDetail(scope.row)">查看</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row._id)"
            >
              作废
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRaw, nextTick } from 'vue'

onMounted(() => {})

const queryForm = reactive({
  applyState: '',
})

const handleApply = () => {}

// 查询
const handleQuery = () => {}

// 重置
const handleReset = formRef => {}
</script>
