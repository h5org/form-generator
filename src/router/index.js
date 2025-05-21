import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../demo/Home.vue'
import Test from '../demo/Test.vue'

const routes  = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/test',
    component: Test
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router