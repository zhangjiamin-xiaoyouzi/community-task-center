<template>
  <div class="page-container">
    <!-- 搜索筛选区 -->
    <div class="search-panel">
      <el-form :model="searchForm" class="search-form">
        <el-form-item label="ID">
          <el-input v-model="searchForm.id" placeholder="请输入ID" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="searchForm.name" placeholder="请输入名称" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable style="width: 140px">
            <el-option label="普通" value="normal" />
            <el-option label="系列" value="series" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 140px">
            <el-option label="待生效" value="pending" />
            <el-option label="生效中" value="active" />
            <el-option label="已下线" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择" clearable style="width: 140px">
            <el-option label="每日任务" value="daily" />
            <el-option label="成长任务" value="growth" />
            <el-option label="限时任务" value="limited" />
          </el-select>
        </el-form-item>
        <el-form-item label="重复周期">
          <el-select v-model="searchForm.cycle" placeholder="请选择" clearable style="width: 140px">
            <el-option label="每天" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
            <el-option label="仅一次" value="once" />
          </el-select>
        </el-form-item>
        <div class="search-actions">
          <el-button type="primary" @click="handleSearch">查 询</el-button>
          <el-button @click="handleReset">重 置</el-button>
          <el-button type="primary" @click="handleAdd">添 加</el-button>
        </div>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <div class="table-panel">
      <el-table :data="tableData" v-loading="loading" stripe border style="width: 100%">
        <el-table-column label="基本信息" width="200">
          <template #default="{ row }">
            <div class="info-cell">
              <div class="info-row">
                <span class="info-label">ID :</span>
                <span class="info-value">{{ row.id }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">分类 :</span>
                <span class="info-value">{{ row.categoryLabel }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">类型 :</span>
                <span class="info-value">{{ row.typeLabel }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="名称" width="180">
          <template #default="{ row }">
            <el-link type="primary" @click="handleView(row)">{{ row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span :class="['status-tag', getStatusClass(row.status)]">{{ row.statusLabel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="奖励" width="150">
          <template #default="{ row }">
            <span>{{ row.rewardLabel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序/结算优先级" width="180">
          <template #default="{ row }">
            <div class="info-cell">
              <div class="info-row">
                <span class="info-label">排序 :</span>
                <span class="info-value">{{ row.sort }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">结算优先级 :</span>
                <span class="info-value">{{ row.priority }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="有效期" width="220">
          <template #default="{ row }">
            <span>{{ row.startDate }} - {{ row.endDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间/人" width="180">
          <template #default="{ row }">
            <div class="info-cell">
              <div class="info-row">
                <span class="info-value">{{ row.updateTime }}</span>
              </div>
              <div class="info-row">
                <span class="info-value">{{ row.updateUser }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320" fixed="right">
          <template #default="{ row }">
            <div class="action-links">
              <el-link type="primary" @click="handleEdit(row)">编辑</el-link>
              <el-link type="primary" @click="handleCopy(row)">复制</el-link>
              <el-link type="primary" @click="handleStatistics(row)">查看数据</el-link>
              <el-link v-if="row.rewardType === 'coupon'" type="primary" @click="handleViewCoupon(row)">查看优惠券</el-link>
              <el-link v-if="row.rewardType === 'lottery'" type="primary" @click="handleViewLottery(row)">查看抽奖券</el-link>
              <el-link v-if="row.status === 'active'" type="danger" @click="handleOffline(row)">下线</el-link>
              <el-link type="primary" @click="handleLog(row)">日志</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  id: '',
  name: '',
  type: '',
  dateRange: null,
  status: '',
  category: '',
  cycle: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 模拟数据
const mockData = [
  {
    id: 973,
    name: '评论获得盲盒',
    category: 'daily',
    categoryLabel: '每日任务',
    type: 'normal',
    typeLabel: '普通',
    status: 'active',
    statusLabel: '生效中',
    rewardType: 'coupon',
    rewardLabel: '优惠券+1',
    sort: 7,
    priority: 0,
    startDate: '2026-06-05 13:56',
    endDate: '2027-01-01 09:44',
    updateTime: '2026-06-05 14:04:23',
    updateUser: '卢伟燕'
  },
  {
    id: 972,
    name: '弹窗',
    category: 'daily',
    categoryLabel: '每日任务',
    type: 'normal',
    typeLabel: '普通',
    status: 'active',
    statusLabel: '生效中',
    rewardType: 'coupon',
    rewardLabel: '优惠券+1',
    sort: 1,
    priority: 0,
    startDate: '2026-05-01 10:07',
    endDate: '2026-07-12 10:07',
    updateTime: '2026-06-05 10:10:36',
    updateUser: '刘香'
  },
  {
    id: 958,
    name: '点赞获得优惠券-兑换',
    category: 'daily',
    categoryLabel: '每日任务',
    type: 'normal',
    typeLabel: '普通',
    status: 'active',
    statusLabel: '生效中',
    rewardType: 'cash',
    rewardLabel: '现金红包+0.01',
    sort: 1,
    priority: 0,
    startDate: '2026-03-04 17:54',
    endDate: '2027-02-25 17:54',
    updateTime: '2026-05-09 13:36:40',
    updateUser: '崔文林'
  },
  {
    id: 934,
    name: '现金',
    category: 'growth',
    categoryLabel: '成长任务',
    type: 'normal',
    typeLabel: '普通',
    status: 'active',
    statusLabel: '生效中',
    rewardType: 'cash',
    rewardLabel: '现金红包+0.02',
    sort: 100,
    priority: 0,
    startDate: '2025-11-18 11:46',
    endDate: '2026-09-01 00:00',
    updateTime: '2026-03-02 14:44:04',
    updateUser: '张杰'
  },
  {
    id: 933,
    name: '现金1',
    category: 'growth',
    categoryLabel: '成长任务',
    type: 'normal',
    typeLabel: '普通',
    status: 'active',
    statusLabel: '生效中',
    rewardType: 'cash',
    rewardLabel: '现金红包+0.02',
    sort: 100,
    priority: 0,
    startDate: '2025-11-18 11:46',
    endDate: '2026-09-01 00:00',
    updateTime: '2026-03-02 14:31:05',
    updateUser: '张杰'
  },
  {
    id: 786,
    name: '测试现金任务-勿动',
    category: 'daily',
    categoryLabel: '每日任务',
    type: 'normal',
    typeLabel: '普通',
    status: 'active',
    statusLabel: '生效中',
    rewardType: 'lottery',
    rewardLabel: '抽奖券+1',
    sort: 11,
    priority: 0,
    startDate: '2025-11-19 11:48',
    endDate: '2026-11-29 15:54',
    updateTime: '2025-11-20 10:39:55',
    updateUser: '杨昌太'
  },
  {
    id: 785,
    name: '现金',
    category: 'growth',
    categoryLabel: '成长任务',
    type: 'normal',
    typeLabel: '普通',
    status: 'active',
    statusLabel: '生效中',
    rewardType: 'cash',
    rewardLabel: '现金红包+0.02',
    sort: 100,
    priority: 0,
    startDate: '2025-11-18 11:46',
    endDate: '2026-09-01 00:00',
    updateTime: '2026-01-15 11:27:18',
    updateUser: '张杰'
  },
  {
    id: 778,
    name: '测试评论',
    category: 'daily',
    categoryLabel: '每日任务',
    type: 'normal',
    typeLabel: '普通',
    status: 'active',
    statusLabel: '生效中',
    rewardType: 'cash',
    rewardLabel: '现金红包+0.2',
    sort: 100,
    priority: 0,
    startDate: '2025-11-13 18:25',
    endDate: '2026-09-01 00:00',
    updateTime: '2025-11-13 18:25:01',
    updateUser: '肖永常'
  }
]

// 表格数据
const loading = ref(false)
const tableData = ref([])

// 获取状态样式
const getStatusClass = (status) => {
  const map = {
    active: 'status-active',
    pending: 'status-pending',
    inactive: 'status-inactive'
  }
  return map[status] || ''
}

// 加载数据
const loadData = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    tableData.value = mockData
    pagination.total = mockData.length
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    id: '',
    name: '',
    type: '',
    dateRange: null,
    status: '',
    category: '',
    cycle: ''
  })
  handleSearch()
}

// 添加
const handleAdd = () => {
  router.push('/task-create')
}

// 编辑
const handleEdit = (row) => {
  router.push(`/task-edit/${row.id}`)
}

// 查看
const handleView = (row) => {
  router.push(`/task-view/${row.id}`)
}

// 复制
const handleCopy = (row) => {
  ElMessage.success(`已复制任务: ${row.name}`)
}

// 查看数据
const handleStatistics = (row) => {
  ElMessage.info(`查看任务数据: ${row.name}`)
}

// 查看优惠券
const handleViewCoupon = (row) => {
  ElMessage.info(`查看优惠券: ${row.name}`)
}

// 查看抽奖券
const handleViewLottery = (row) => {
  ElMessage.info(`查看抽奖券: ${row.name}`)
}

// 下线
const handleOffline = (row) => {
  ElMessageBox.confirm(`确定要下线任务「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('下线成功')
    loadData()
  }).catch(() => {})
}

// 日志
const handleLog = (row) => {
  ElMessage.info(`查看日志: ${row.name}`)
}

// 分页
const handleSizeChange = (size) => {
  pagination.pageSize = size
  loadData()
}

const handlePageChange = (page) => {
  pagination.page = page
  loadData()
}

onMounted(() => {
  loadData()
})
</script>
