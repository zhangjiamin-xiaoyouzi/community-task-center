<template>
  <div class="page-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">{{ pageTitle }}</h2>
      <el-button @click="goBack">返回列表</el-button>
    </div>

    <div class="form-panel">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="160px"
        :disabled="isView"
      >
        <!-- 基础信息 -->
        <div class="form-section">
          <div class="form-section-title">基础信息</div>
          
          <el-form-item label="任务ID">
            <el-input v-if="isEdit || isView" v-model="formData.id" disabled style="width: 200px" />
            <span v-else class="text-muted">保存后自动生成</span>
          </el-form-item>

          <el-form-item label="任务名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入任务名称" maxlength="50" show-word-limit />
          </el-form-item>

          <el-form-item label="任务分类" prop="category">
            <el-select v-model="formData.category" placeholder="请选择任务分类" style="width: 100%">
              <el-option label="每日任务" value="daily" />
              <el-option label="成长任务" value="growth" />
              <el-option label="限时任务" value="limited" />
              <el-option label="新手任务" value="newbie" />
              <el-option label="活动任务" value="activity" />
            </el-select>
            <el-tooltip content="任务分类用于区分不同类型的任务" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="任务类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择任务类型" style="width: 100%">
              <el-option label="普通" value="normal" />
              <el-option label="系列" value="series" />
            </el-select>
          </el-form-item>

          <el-form-item label="任务状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="draft">草稿</el-radio>
              <el-radio label="online">上线</el-radio>
              <el-radio label="offline">下线</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="任务有效期" prop="dateRange">
            <el-date-picker
              v-model="formData.dateRange"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>

          <el-form-item label="前置任务">
            <el-select v-model="formData.preTask" placeholder="请选择前置任务" clearable filterable style="width: 100%">
              <el-option
                v-for="task in taskOptions"
                :key="task.value"
                :label="task.label"
                :value="task.value"
              />
            </el-select>
            <el-tooltip content="用户需先完成前置任务才能参与当前任务" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="展示系列任务">
            <el-switch v-model="formData.showSeries" active-text="开启" inactive-text="关闭" />
            <el-tooltip content="开启后将在前端展示系列任务进度" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="展示排序" prop="sort">
            <el-input-number v-model="formData.sort" :min="0" :max="9999" style="width: 200px" />
            <el-tooltip content="数值越小排序越靠前" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="结算优先级">
            <el-input-number v-model="formData.priority" :min="0" :max="9999" style="width: 200px" />
            <el-tooltip content="数值越小结算优先级越高" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>
        </div>

        <!-- 任务规则配置 -->
        <div class="form-section">
          <div class="form-section-title">任务规则配置</div>
          
          <el-form-item label="用户行为" prop="userBehavior">
            <el-select v-model="formData.userBehavior" placeholder="请选择用户行为" style="width: 100%">
              <el-option label="评论" value="comment" />
              <el-option label="点赞" value="like" />
              <el-option label="发帖" value="post" />
              <el-option label="浏览" value="view" />
              <el-option label="分享" value="share" />
              <el-option label="签到" value="signin" />
              <el-option label="弹窗" value="popup" />
              <el-option label="收藏" value="collect" />
              <el-option label="关注" value="follow" />
              <el-option label="投票" value="vote" />
            </el-select>
          </el-form-item>

          <el-form-item label="行为目标">
            <el-select v-model="formData.behaviorTarget" placeholder="请选择行为目标" style="width: 100%">
              <el-option label="任意内容" value="any" />
              <el-option label="指定圈子" value="circle" />
              <el-option label="指定话题" value="topic" />
              <el-option label="指定帖子" value="post" />
            </el-select>
            <el-tooltip content="指定用户行为的目标范围" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="累计方式" prop="accumulateType">
            <el-select v-model="formData.accumulateType" placeholder="请选择累计方式" style="width: 100%">
              <el-option label="累计次数" value="count" />
              <el-option label="累计天数" value="days" />
              <el-option label="单次完成" value="once" />
            </el-select>
          </el-form-item>

          <el-form-item label="任务目标值" prop="targetValue">
            <el-input-number v-model="formData.targetValue" :min="1" :max="99999" style="width: 200px" />
            <span class="text-muted" style="margin-left: 8px;">次/天</span>
            <el-tooltip content="用户需要完成的目标次数" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="重复周期">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>每</span>
              <el-input-number v-model="formData.cycleValue" :min="1" :max="30" style="width: 100px" />
              <el-select v-model="formData.cycleUnit" placeholder="单位" style="width: 120px">
                <el-option label="天" value="day" />
                <el-option label="周" value="week" />
                <el-option label="月" value="month" />
              </el-select>
            </div>
            <el-tooltip content="设置任务的重复周期，0表示不重复" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="参与次数限制">
            <el-switch v-model="formData.participateLimit" active-text="开启" inactive-text="关闭" />
            <el-tooltip content="开启后可限制用户参与任务的总次数" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item v-if="formData.participateLimit" label="最大参与次数">
            <el-input-number v-model="formData.maxParticipate" :min="1" :max="99999" style="width: 200px" />
          </el-form-item>
        </div>

        <!-- 任务目标人群 -->
        <div class="form-section">
          <div class="form-section-title">任务目标人群</div>
          
          <el-form-item label="适用对象">
            <div style="width: 100%">
              <el-tag
                v-for="(tag, index) in formData.targetTags"
                :key="index"
                closable
                style="margin-right: 8px; margin-bottom: 8px;"
                @close="removeTargetTag(index)"
              >
                {{ tag }}
              </el-tag>
              <el-button size="small" @click="showTargetDialog = true">
                <el-icon><Plus /></el-icon>
                添加条件
              </el-button>
            </div>
            <el-tooltip content="设置任务适用的用户群体，不设置则对所有用户开放" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="排除对象">
            <div style="width: 100%">
              <el-tag
                v-for="(tag, index) in formData.excludeTags"
                :key="index"
                closable
                type="danger"
                style="margin-right: 8px; margin-bottom: 8px;"
                @close="removeExcludeTag(index)"
              >
                {{ tag }}
              </el-tag>
              <el-button size="small" type="danger" plain @click="showExcludeDialog = true">
                <el-icon><Plus /></el-icon>
                添加排除条件
              </el-button>
            </div>
            <el-tooltip content="设置不参与任务的用户群体" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>
        </div>

        <!-- 任务奖励配置 -->
        <div class="form-section">
          <div class="form-section-title">任务奖励配置</div>
          
          <el-form-item label="奖励领取有效期">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>任务结束时间后</span>
              <el-select v-model="formData.rewardExpire" placeholder="选择有效期" style="width: 150px">
                <el-option label="立即失效" value="immediate" />
                <el-option label="7天" value="7days" />
                <el-option label="15天" value="15days" />
                <el-option label="30天" value="30days" />
                <el-option label="永久有效" value="permanent" />
              </el-select>
            </div>
            <el-tooltip content="设置用户领取奖励后的有效期限" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="奖励发放方式">
            <el-radio-group v-model="formData.rewardDelivery">
              <el-radio label="auto">自动发放</el-radio>
              <el-radio label="manual">手动领取</el-radio>
            </el-radio-group>
            <el-tooltip content="自动发放：完成任务后自动发放奖励；手动领取：用户需手动点击领取" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <!-- 奖励类型配置 -->
          <el-form-item label="奖励类型" prop="rewardType">
            <el-select v-model="formData.rewardType" placeholder="请选择奖励类型" style="width: 100%">
              <el-option label="优惠券" value="coupon" />
              <el-option label="现金红包" value="cash" />
              <el-option label="抽奖券" value="lottery" />
              <el-option label="积分" value="points" />
              <el-option label="盲盒" value="blindbox" />
              <el-option label="实物奖品" value="physical" />
              <el-option label="会员权益" value="vip" />
            </el-select>
          </el-form-item>

          <el-form-item label="奖励数量" prop="rewardAmount">
            <el-input-number v-model="formData.rewardAmount" :min="0.01" :precision="2" style="width: 200px" />
          </el-form-item>

          <el-form-item v-if="formData.rewardType === 'coupon'" label="优惠券选择">
            <el-select v-model="formData.couponId" placeholder="请选择优惠券" filterable style="width: 100%">
              <el-option label="新人专享优惠券" value="1" />
              <el-option label="满减优惠券" value="2" />
              <el-option label="折扣优惠券" value="3" />
            </el-select>
          </el-form-item>

          <el-form-item v-if="formData.rewardType === 'points'" label="积分数量">
            <el-input-number v-model="formData.pointsAmount" :min="1" :max="99999" style="width: 200px" />
          </el-form-item>

          <el-form-item v-if="formData.rewardType === 'blindbox'" label="盲盒类型">
            <el-select v-model="formData.blindboxType" placeholder="请选择盲盒类型" style="width: 100%">
              <el-option label="普通盲盒" value="normal" />
              <el-option label="稀有盲盒" value="rare" />
              <el-option label="限定盲盒" value="limited" />
            </el-select>
          </el-form-item>

          <el-form-item label="奖励库存">
            <el-input-number v-model="formData.rewardStock" :min="0" :max="999999" style="width: 200px" />
            <span class="text-muted" style="margin-left: 8px;">0表示不限</span>
            <el-tooltip content="设置奖励的总库存，0表示不限制" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="每日发放上限">
            <el-input-number v-model="formData.dailyLimit" :min="0" :max="99999" style="width: 200px" />
            <span class="text-muted" style="margin-left: 8px;">0表示不限</span>
            <el-tooltip content="设置每天最多发放的奖励数量" placement="top">
              <el-icon style="margin-left: 4px; color: #909399;"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>
        </div>

        <!-- 任务通知配置 -->
        <div class="form-section">
          <div class="form-section-title">任务通知配置</div>
          
          <el-form-item label="通知周期" prop="notifyCycle">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>每</span>
              <el-input-number v-model="formData.notifyValue" :min="1" :max="24" style="width: 100px" />
              <el-select v-model="formData.notifyUnit" placeholder="单位" style="width: 120px">
                <el-option label="小时" value="hour" />
                <el-option label="天" value="day" />
              </el-select>
            </div>
          </el-form-item>
        </div>

        <!-- 任务说明与引导 -->
        <div class="form-section">
          <div class="form-section-title">任务说明与引导</div>
          
          <el-form-item label="任务规则说明(对外)">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="4"
              placeholder="最多200字"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>

        <!-- 任务按钮与跳转地址 -->
        <div class="form-section">
          <div class="form-section-title">任务按钮与跳转地址</div>
          
          <el-form-item label="按钮文案" prop="buttonText">
            <el-select v-model="formData.buttonText" placeholder="请选择按钮文案" style="width: 100%">
              <el-option label="去完成" value="去完成" />
              <el-option label="立即参与" value="立即参与" />
              <el-option label="去看看" value="去看看" />
              <el-option label="领取奖励" value="领取奖励" />
              <el-option label="查看详情" value="查看详情" />
            </el-select>
          </el-form-item>

          <el-form-item label="跳转地址" prop="jumpUrl">
            <el-input v-model="formData.jumpUrl" placeholder="请输入跳转地址" />
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button @click="goBack">取 消</el-button>
          <el-button v-if="!isView" type="primary" @click="handleSubmit">保 存</el-button>
        </div>
      </el-form>
    </div>

    <!-- 添加条件弹窗 -->
    <el-dialog v-model="showTargetDialog" title="添加适用对象条件" width="500px">
      <el-form :model="targetForm" label-width="100px">
        <el-form-item label="条件类型">
          <el-select v-model="targetForm.type" placeholder="请选择" style="width: 100%">
            <el-option label="用户等级" value="level" />
            <el-option label="用户标签" value="tag" />
            <el-option label="注册时间" value="registerTime" />
            <el-option label="活跃天数" value="activeDays" />
            <el-option label="性别" value="gender" />
            <el-option label="年龄段" value="age" />
          </el-select>
        </el-form-item>
        <el-form-item label="条件值">
          <el-input v-model="targetForm.value" placeholder="请输入条件值" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTargetDialog = false">取消</el-button>
        <el-button type="primary" @click="addTargetTag">确定</el-button>
      </template>
    </el-dialog>

    <!-- 排除条件弹窗 -->
    <el-dialog v-model="showExcludeDialog" title="添加排除对象条件" width="500px">
      <el-form :model="excludeForm" label-width="100px">
        <el-form-item label="条件类型">
          <el-select v-model="excludeForm.type" placeholder="请选择" style="width: 100%">
            <el-option label="用户等级" value="level" />
            <el-option label="用户标签" value="tag" />
            <el-option label="注册时间" value="registerTime" />
            <el-option label="活跃天数" value="activeDays" />
            <el-option label="性别" value="gender" />
            <el-option label="年龄段" value="age" />
          </el-select>
        </el-form-item>
        <el-form-item label="条件值">
          <el-input v-model="excludeForm.value" placeholder="请输入条件值" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showExcludeDialog = false">取消</el-button>
        <el-button type="primary" @click="addExcludeTag">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { QuestionFilled, Plus } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

// 判断页面模式
const isEdit = computed(() => route.name === 'TaskEdit')
const isView = computed(() => route.name === 'TaskView')

// 页面标题
const pageTitle = computed(() => {
  if (isEdit.value) return '编辑任务'
  if (isView.value) return '查看任务'
  return '新增任务'
})

// 表单数据 - 使用 ref 而非 reactive 以修复 el-select 响应式问题
const formData = ref({
  id: '',
  name: '',
  category: '',
  type: 'normal',
  status: 'draft',
  dateRange: null,
  preTask: '',
  showSeries: false,
  sort: 0,
  priority: 0,
  userBehavior: '',
  behaviorTarget: 'any',
  accumulateType: '',
  targetValue: 1,
  cycleValue: 1,
  cycleUnit: 'day',
  participateLimit: false,
  maxParticipate: 1,
  targetTags: [],
  excludeTags: [],
  rewardExpire: '7days',
  rewardDelivery: 'auto',
  rewardType: '',
  rewardAmount: 0.01,
  couponId: '',
  pointsAmount: 10,
  blindboxType: 'normal',
  rewardStock: 0,
  dailyLimit: 0,
  notifyValue: 1,
  notifyUnit: 'hour',
  description: '',
  buttonText: '去完成',
  jumpUrl: ''
})

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择任务分类', trigger: 'change' }],
  type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择任务状态', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择任务有效期', trigger: 'change' }],
  sort: [{ required: true, message: '请输入展示排序', trigger: 'blur' }],
  userBehavior: [{ required: true, message: '请选择用户行为', trigger: 'change' }],
  accumulateType: [{ required: true, message: '请选择累计方式', trigger: 'change' }],
  targetValue: [{ required: true, message: '请输入任务目标值', trigger: 'blur' }],
  rewardType: [{ required: true, message: '请选择奖励类型', trigger: 'change' }],
  rewardAmount: [{ required: true, message: '请输入奖励数量', trigger: 'blur' }],
  buttonText: [{ required: true, message: '请选择按钮文案', trigger: 'change' }],
  jumpUrl: [{ required: true, message: '请输入跳转地址', trigger: 'blur' }]
}

// 前置任务选项
const taskOptions = [
  { label: '签到任务', value: '1' },
  { label: '浏览任务', value: '2' },
  { label: '评论任务', value: '3' }
]

// 目标人群弹窗
const showTargetDialog = ref(false)
const targetForm = reactive({
  type: '',
  value: ''
})

// 排除对象弹窗
const showExcludeDialog = ref(false)
const excludeForm = reactive({
  type: '',
  value: ''
})

// 添加目标标签
const addTargetTag = () => {
  if (targetForm.type && targetForm.value) {
    formData.value.targetTags.push(`${targetForm.type}: ${targetForm.value}`)
    targetForm.type = ''
    targetForm.value = ''
    showTargetDialog.value = false
  }
}

// 移除目标标签
const removeTargetTag = (index) => {
  formData.value.targetTags.splice(index, 1)
}

// 添加排除标签
const addExcludeTag = () => {
  if (excludeForm.type && excludeForm.value) {
    formData.value.excludeTags.push(`${excludeForm.type}: ${excludeForm.value}`)
    excludeForm.type = ''
    excludeForm.value = ''
    showExcludeDialog.value = false
  }
}

// 移除排除标签
const removeExcludeTag = (index) => {
  formData.value.excludeTags.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    ElMessage.success(isEdit.value ? '保存成功' : '创建成功')
    router.push('/task-list')
  } catch (error) {
    ElMessage.error('请检查表单填写是否完整')
  }
}

// 返回
const goBack = () => {
  router.push('/task-list')
}

// 加载编辑数据
const loadEditData = () => {
  if (isEdit.value || isView.value) {
    const id = route.params.id
    // 模拟加载数据
    Object.assign(formData.value, {
      id: '10001',
      name: '评论获得盲盒',
      category: 'daily',
      type: 'normal',
      status: 'online',
      dateRange: ['2026-06-05 13:56:00', '2027-01-01 09:44:00'],
      preTask: '',
      showSeries: false,
      sort: 7,
      priority: 0,
      userBehavior: 'comment',
      behaviorTarget: 'any',
      accumulateType: 'count',
      targetValue: 5,
      cycleValue: 1,
      cycleUnit: 'day',
      participateLimit: false,
      maxParticipate: 1,
      targetTags: ['用户等级: Lv3以上'],
      excludeTags: [],
      rewardExpire: '7days',
      rewardDelivery: 'auto',
      rewardType: 'blindbox',
      rewardAmount: 1,
      couponId: '',
      pointsAmount: 10,
      blindboxType: 'normal',
      rewardStock: 10000,
      dailyLimit: 500,
      notifyValue: 1,
      notifyUnit: 'day',
      description: '完成评论任务即可获得盲盒奖励，每日最多可获得1个盲盒',
      buttonText: '去完成',
      jumpUrl: 'meiyou://community/task'
    })
  }
}

onMounted(() => {
  loadEditData()
})
</script>
