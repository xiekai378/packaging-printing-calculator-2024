import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import HomePage from './views/HomePage.vue'
import MaterialDatabase from './views/MaterialDatabase.vue'
import ProcessDatabase from './views/ProcessDatabase.vue'

// 路由配置
const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/materials/:category', name: 'MaterialsByCategory', component: MaterialDatabase },
  { path: '/processes/:category', name: 'ProcessesByCategory', component: ProcessDatabase },
  // 重定向默认路由
  { path: '/materials', redirect: '/materials/paper' },
  { path: '/processes', redirect: '/processes/printing' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.mount('#app')