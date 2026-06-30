import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/task-list'
  },
  {
    path: '/task-list',
    name: 'TaskList',
    component: () => import('@/views/TaskList.vue'),
    meta: { title: '任务管理' }
  },
  {
    path: '/task-create',
    name: 'TaskCreate',
    component: () => import('@/views/TaskForm.vue'),
    meta: { title: '新增任务' }
  },
  {
    path: '/task-edit/:id',
    name: 'TaskEdit',
    component: () => import('@/views/TaskForm.vue'),
    meta: { title: '编辑任务' }
  },
  {
    path: '/task-view/:id',
    name: 'TaskView',
    component: () => import('@/views/TaskForm.vue'),
    meta: { title: '查看任务' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
