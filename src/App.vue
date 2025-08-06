<template>
  <div id="app">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-content">
          <div class="logo">
            <el-icon><Printer /></el-icon>
            <span>包装印刷算价系统</span>
          </div>
          <el-menu
            :default-active="$route.path"
            mode="horizontal"
            router
            class="nav-menu"
            style="flex: 1; justify-content: center;"
          >
            <el-menu-item index="/" style="margin-right: 40px;">
              <el-icon><House /></el-icon>
              <span>首页算价</span>
            </el-menu-item>
            
            <el-sub-menu index="materials" style="margin-right: 40px;">
              <template #title>
                <el-icon><Box /></el-icon>
                <span>材料数据库</span>
              </template>
              <el-menu-item index="/materials/paper">纸类</el-menu-item>
              <el-menu-item index="/materials/specialty-paper">特种纸</el-menu-item>
              <el-menu-item index="/materials/adhesive">不干胶</el-menu-item>
            </el-sub-menu>
            
            <el-sub-menu index="processes">
              <template #title>
                <el-icon><Setting /></el-icon>
                <span>工艺数据库</span>
              </template>
              <el-menu-item index="/processes/printing">印刷工艺</el-menu-item>
              <el-menu-item index="/processes/surface">表面工艺</el-menu-item>
              <el-menu-item index="/processes/finishing">后道工艺</el-menu-item>
            </el-sub-menu>
            
          </el-menu>
        </div>
      </el-header>

      <!-- 主内容区域 -->
      <el-main class="main-content">
        <router-view />
      </el-main>

      <!-- 底部信息 -->
      <el-footer class="footer">
        <div class="footer-content">
          <p>&copy; 2024 包装印刷算价系统 - 专业的印刷报价解决方案</p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  height: 60px !important;
  line-height: 60px;
}

.header-content {
  display: flex;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-right: 60px;
  white-space: nowrap;
}

.logo .el-icon {
  margin-right: 8px;
  font-size: 24px;
}

.nav-menu {
  background: transparent !important;
  border: none !important;
}

.nav-menu .el-menu-item,
.nav-menu .el-sub-menu .el-sub-menu__title {
  color: rgba(255, 255, 255, 0.8) !important;
  border-bottom: 2px solid transparent !important;
}

.nav-menu .el-menu-item:hover,
.nav-menu .el-menu-item.is-active,
.nav-menu .el-sub-menu:hover .el-sub-menu__title,
.nav-menu .el-sub-menu.is-active .el-sub-menu__title {
  color: white !important;
  border-bottom-color: white !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

.nav-menu .el-sub-menu .el-menu {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 5px;
}

.nav-menu .el-sub-menu .el-menu .el-menu-item {
  color: #333 !important;
  border-bottom: none !important;
  padding: 0 20px !important;
}

.nav-menu .el-sub-menu .el-menu .el-menu-item:hover {
  background: #f5f7fa !important;
  color: #409eff !important;
}

.main-content {
  min-height: calc(100vh - 120px);
  background: #f5f7fa;
  padding: 20px;
}

.footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  height: 60px !important;
  line-height: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>