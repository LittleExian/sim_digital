import { createRouter, createWebHistory } from 'vue-router'
import DataDashboard from '../components/DataDashboard.vue'
import OperationOptimization from '../components/OperationOptimization.vue'
import FaultDiagnosis from '../components/FaultDiagnosis.vue'

// 定义路由
const routes = [
  {
    path: '/',
    name: 'DataDashboard',
    component: DataDashboard
  },
  {
    path: '/optimization',
    name: 'OperationOptimization',
    component: OperationOptimization
  },
  {
    path: '/fault-diagnosis',
    name: 'FaultDiagnosis',
    component: FaultDiagnosis
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router