<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
      <div class="sidebar-header">
        <span v-if="!isCollapsed" class="logo-text">社区运营管理系统</span>
        <span v-else class="logo-icon">社</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        background-color="#fff"
        text-color="#303133"
        active-text-color="#ff6b9d"
        class="sidebar-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/activity">
          <el-icon><Grid /></el-icon>
          <template #title>活动管理</template>
        </el-menu-item>
        
        <el-menu-item index="/data-analysis">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>数据分析</template>
        </el-menu-item>
        
        <el-menu-item index="/comment-audit">
          <el-icon><DocumentChecked /></el-icon>
          <template #title>评论审核</template>
        </el-menu-item>
        
        <el-menu-item index="/content-manage">
          <el-icon><Management /></el-icon>
          <template #title>内容管理</template>
        </el-menu-item>
        
        <el-menu-item index="/quality-check">
          <el-icon><Checked /></el-icon>
          <template #title>质检管理</template>
        </el-menu-item>
        
        <el-sub-menu index="task-center">
          <template #title>
            <el-icon><List /></el-icon>
            <span>任务中心后台</span>
          </template>
          
          <el-sub-menu index="task-config">
            <template #title>任务配置</template>
            <el-menu-item index="/task-list">任务管理</el-menu-item>
            <el-menu-item index="/task-statistics">任务情况统计</el-menu-item>
            <el-menu-item index="/prize-exchange">奖品兑换明细</el-menu-item>
            <el-menu-item index="/prize-pool">任务奖池管理</el-menu-item>
            <el-menu-item index="/task-prize">任务奖品管理</el-menu-item>
            <el-menu-item index="/coupon-manage">优惠券管理</el-menu-item>
          </el-sub-menu>
          
          <el-menu-item index="/lottery-manage">抽奖管理</el-menu-item>
          <el-menu-item index="/win-manage">中奖管理</el-menu-item>
          <el-menu-item index="/external-app">外部场景应用管理</el-menu-item>
        </el-sub-menu>
        
        <el-menu-item index="/reply-manage">
          <el-icon><ChatDotRound /></el-icon>
          <template #title>回复管理</template>
        </el-menu-item>
        
        <el-menu-item index="/operation-tools">
          <el-icon><Tools /></el-icon>
          <template #title>运营工具</template>
        </el-menu-item>
        
        <el-menu-item index="/config-manage">
          <el-icon><Setting /></el-icon>
          <template #title>配置管理</template>
        </el-menu-item>
        
        <el-menu-item index="/expert-cert">
          <el-icon><UserFilled /></el-icon>
          <template #title>达人认证管理</template>
        </el-menu-item>
        
        <el-menu-item index="/creator-manage">
          <el-icon><Avatar /></el-icon>
          <template #title>创作者管理</template>
        </el-menu-item>
        
        <el-menu-item index="/user-motivation">
          <el-icon><Trophy /></el-icon>
          <template #title>用户激励管理</template>
        </el-menu-item>
        
        <el-menu-item index="/content-distribute">
          <el-icon><Share /></el-icon>
          <template #title>内容分发</template>
        </el-menu-item>
        
        <el-menu-item index="/system-monitor">
          <el-icon><Monitor /></el-icon>
          <template #title>系统运行监控</template>
        </el-menu-item>
        
        <el-menu-item index="/my-approval">
          <el-icon><Stamp /></el-icon>
          <template #title>我的审批</template>
        </el-menu-item>
        
        <el-menu-item index="/my-export">
          <el-icon><Download /></el-icon>
          <template #title>我的导出</template>
        </el-menu-item>
      </el-menu>
      
      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="toggleCollapse">
        <el-icon v-if="isCollapsed"><Expand /></el-icon>
        <el-icon v-else><Fold /></el-icon>
      </div>
    </aside>
    
    <!-- 右侧内容区 -->
    <div class="main-container">
      <!-- 顶部导航 -->
      <header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="28" style="background: #ff6b9d;">张</el-avatar>
              <span class="username">张家敏</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      
      <!-- 内容区域 -->
      <main class="content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Grid, DataAnalysis, DocumentChecked, Management, Checked,
  List, ChatDotRound, Tools, Setting, UserFilled, Avatar,
  Trophy, Share, Monitor, Stamp, Download, Fold, Expand, ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const isCollapsed = ref(false)

// 当前激活菜单
const activeMenu = computed(() => route.path)

// 面包屑导航
const breadcrumbs = computed(() => {
  const breadcrumbMap = {
    '/task-list': [
      { title: '任务中心后台', path: '/' },
      { title: '任务配置', path: '/' },
      { title: '任务管理', path: '/task-list' }
    ],
    '/task-create': [
      { title: '任务中心后台', path: '/' },
      { title: '任务配置', path: '/' },
      { title: '任务管理', path: '/task-list' },
      { title: '新增任务', path: '/task-create' }
    ],
    '/task-edit': [
      { title: '任务中心后台', path: '/' },
      { title: '任务配置', path: '/' },
      { title: '任务管理', path: '/task-list' },
      { title: '编辑任务', path: route.path }
    ],
    '/task-view': [
      { title: '任务中心后台', path: '/' },
      { title: '任务配置', path: '/' },
      { title: '任务管理', path: '/task-list' },
      { title: '查看任务', path: route.path }
    ]
  }
  
  // 匹配路由
  for (const [key, value] of Object.entries(breadcrumbMap)) {
    if (route.path.startsWith(key)) {
      return value
    }
  }
  
  return [
    { title: '首页', path: '/' }
  ]
})

// 切换折叠
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 菜单选择
const handleMenuSelect = (index) => {
  router.push(index)
}
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

/* 侧边栏 */
.sidebar {
  width: 240px;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-collapsed {
  width: 64px;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 16px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #ff6b9d;
  white-space: nowrap;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: #ff6b9d;
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
}

.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: #e4e7ed;
  border-radius: 2px;
}

.collapse-btn {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e4e7ed;
  cursor: pointer;
  color: #909399;
  transition: all 0.3s;
}

.collapse-btn:hover {
  background: #f5f7fa;
  color: #ff6b9d;
}

/* 主内容区 */
.main-container {
  flex: 1;
  margin-left: 240px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-collapsed ~ .main-container {
  margin-left: 64px;
}

/* 顶部导航 */
.header {
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 99;
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
}
</style>
