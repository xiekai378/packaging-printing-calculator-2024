<template>
  <div class="process-database">
    <div class="page-header">
      <h1>{{ pageTitle }}</h1>
      <p>管理{{ pageTitle }}信息和价格数据</p>
    </div>

    <el-card class="database-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-icon><Setting /></el-icon>
            <span>{{ cardTitle }}</span>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="showAddDialog">
              <el-icon><Plus /></el-icon>
              添加工艺
            </el-button>
            <el-button type="success" @click="batchEdit">
              <el-icon><Edit /></el-icon>
              批量编辑
            </el-button>
            <el-button type="danger" @click="batchDelete">
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
            <el-button type="info" @click="exportData">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
            <el-button type="warning" @click="resetAllData">
              <el-icon><RefreshLeft /></el-icon>
              重置数据
            </el-button>
          </div>
        </div>
      </template>

      <!-- 工艺品类标签管理 -->
      <div class="category-tags-section">
        <div class="tags-header">
          <span class="tags-title">工艺品类：</span>
          <el-button type="primary" size="small" @click="manageCategoriesDialog">
            <el-icon><Setting /></el-icon>
            品类管理
          </el-button>
        </div>
        <div class="tags-container">
          <el-tag
            v-for="category in processCategoryTags"
            :key="category.id"
            :type="getTagTypeByUsage(category)"
            @click="filterByCategory(category)"
            class="category-tag"
            :class="{ 'active-tag': selectedCategoryId === category.id }"
          >
            {{ category.name }}
            <span class="usage-count">({{ getCategoryUsageCount(category.name) }})</span>
          </el-tag>
        </div>
        <div class="category-actions" v-if="selectedCategoryId">
          <el-button size="small" @click="clearCategoryFilter">
            <el-icon><Close /></el-icon>
            清除筛选
          </el-button>
        </div>
      </div>

      <!-- 搜索筛选区域 -->
      <div class="search-section">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索工艺名称"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="searchForm.supplier"
              placeholder="搜索供应商"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 工艺列表表格 -->
      <el-table
        :data="filteredProcesses"
        style="width: 100%"
        v-loading="loading"
        stripe
        border
        :header-cell-style="{ background: '#f0f9ff', color: '#1f2937' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名称" min-width="120" fixed="left">
          <template #default="scope">
            <el-button type="text" @click="editProcess(scope.row)">
              {{ scope.row.name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            <span class="price-text">{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="supplier" label="供应商" width="120" />
        <el-table-column prop="remarks" label="备注" min-width="150" />
        <el-table-column prop="updateTime" label="修改日期" width="150" />
        <el-table-column prop="processCategory" label="工艺品类" width="120">
          <template #default="scope">
            <el-tag :type="getCategoryTagType(scope.row.processCategory)" size="small">
              {{ scope.row.processCategory }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-text="启用"
              inactive-text="停用"
              @change="(val) => handleStatusChange(scope.row, val)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑工艺对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="processFormRef"
        :model="processForm"
        :rules="processRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工艺品类" prop="processCategory">
              <el-select 
                v-model="processForm.processCategory" 
                placeholder="请选择工艺品类" 
                filterable
                @change="generateProcessName"
              >
                <el-option
                  v-for="category in processCategoryTags"
                  :key="category.id"
                  :label="category.name"
                  :value="category.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价" prop="price">
              <el-input-number
                v-model="processForm.price"
                :min="0"
                :precision="2"
                placeholder="请输入单价"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="processForm.unit" placeholder="请选择单位">
                <el-option label="元/次" value="元/次" />
                <el-option label="元/平方米" value="元/平方米" />
                <el-option label="元/千克" value="元/千克" />
                <el-option label="元/米" value="元/米" />
                <el-option label="元/小时" value="元/小时" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier">
              <el-input v-model="processForm.supplier" placeholder="请输入供应商" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="工艺名称" prop="name">
          <el-input
            v-model="processForm.name"
            placeholder="系统将自动生成名称，也可手动修改"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="processForm.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="processForm.status"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProcess" :loading="saving">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 品类管理对话框 -->
    <el-dialog
      v-model="manageCategoriesDialogVisible"
      title="工艺品类管理"
      width="800px"
    >
      <!-- 添加新品类区域 -->
      <div class="add-category-section">
        <h4>添加新品类</h4>
        <el-form ref="categoryFormRef" :model="categoryForm" :rules="categoryRules" inline>
          <el-form-item label="品类名称" prop="name">
            <el-input
              v-model="categoryForm.name"
              placeholder="请输入品类名称"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="categoryForm.description"
              placeholder="请输入描述（可选）"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="标签颜色" prop="type">
            <el-select v-model="categoryForm.type" placeholder="选择颜色" style="width: 100px">
              <el-option label="蓝色" value="primary" />
              <el-option label="绿色" value="success" />
              <el-option label="橙色" value="warning" />
              <el-option label="红色" value="danger" />
              <el-option label="灰色" value="info" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addCategory">
              <el-icon><Plus /></el-icon>
              添加品类
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-divider />

      <!-- 现有品类列表 -->
      <div class="existing-categories-section">
        <h4>现有品类列表</h4>
        <el-table :data="processCategoryTags" style="width: 100%">
          <el-table-column prop="name" label="品类名称" width="120" />
          <el-table-column prop="description" label="描述" min-width="180" />
          <el-table-column prop="type" label="标签颜色" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.type" size="small">{{ getTypeLabel(scope.row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="使用数量" width="100">
            <template #default="scope">
              <span :class="{ 'usage-warning': getCategoryUsageCount(scope.row.name) > 0 }">
                {{ getCategoryUsageCount(scope.row.name) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="150">
            <template #default="scope">
              <span>{{ scope.row.createTime || '系统默认' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="editCategory(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="confirmDeleteCategory(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="manageCategoriesDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockProcesses } from '../api/mockData'

export default {
  name: 'ProcessDatabase',
  setup() {
    const route = useRoute()
    
    // 响应式数据
    const loading = ref(false)
    const saving = ref(false)
    const dialogVisible = ref(false)
    const manageCategoriesDialogVisible = ref(false)
    const isEdit = ref(false)
    const selectedCategoryId = ref(null)
    const processFormRef = ref(null)
    const categoryFormRef = ref(null)
    
    const searchForm = reactive({
      keyword: '',
      supplier: ''
    })
    
    const processes = ref([])
    const filteredProcesses = ref([])
    const selectedProcesses = ref([])
    const processCategoryTags = ref([])
    
    const pagination = reactive({
      currentPage: 1,
      pageSize: 20,
      total: 0
    })
    
    const processForm = reactive({
      id: null,
      name: '',
      category: '',
      unit: '',
      price: null,
      supplier: '',
      remarks: '',
      processCategory: '',
      status: true
    })
    
    const categoryForm = reactive({
      name: '',
      description: '',
      type: 'primary'
    })
    
    // 表单验证规则
    const categoryRules = {
      name: [
        { required: true, message: '请输入品类名称', trigger: 'blur' },
        { min: 2, max: 10, message: '品类名称长度在 2 到 10 个字符', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择标签颜色', trigger: 'change' }
      ]
    }
    
    const processRules = {
      processCategory: [
        { required: true, message: '请选择工艺品类', trigger: 'change' }
      ],
      name: [
        { required: true, message: '请输入工艺名称', trigger: 'blur' }
      ],
      unit: [
        { required: true, message: '请选择单位', trigger: 'change' }
      ],
      price: [
        { required: true, message: '请输入单价', trigger: 'blur' }
      ]
    }
    
    // 计算属性
    const dialogTitle = computed(() => {
      return isEdit.value ? '编辑工艺' : '添加工艺'
    })
    
    const pageTitle = computed(() => {
      const categoryMap = {
        'printing': '印刷工艺数据库',
        'surface': '表面工艺数据库',
        'finishing': '后道工艺数据库'
      }
      const category = route.params.category
      return categoryMap[category] || '工艺数据库'
    })
    
    const cardTitle = computed(() => {
      const categoryMap = {
        'printing': '印刷工艺管理',
        'surface': '表面工艺管理',
        'finishing': '后道工艺管理'
      }
      const category = route.params.category
      return categoryMap[category] || '工艺管理'
    })
    
    // 从实际数据中提取品类标签
    const generateCategoryTagsFromData = (currentCategory) => {
      const categoryProcesses = mockProcesses.processes.filter(item => item.category === currentCategory)
      const uniqueCategories = [...new Set(categoryProcesses.map(item => item.processCategory).filter(Boolean))]
      const colors = ['primary', 'success', 'warning', 'danger', 'info']
      
      return uniqueCategories.map((categoryName, index) => ({
        id: index + 1,
        name: categoryName,
        type: colors[index % colors.length],
        description: `${categoryName}相关工艺`,
        createTime: '2024-01-15 10:00:00'
      }))
    }
    
    // 从localStorage加载工艺品类标签
    const getStoredCategoryTags = (currentCategory) => {
      const storageKey = `processCategoryTags_${currentCategory}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
      return generateCategoryTagsFromData(currentCategory)
    }
    
    // 从localStorage加载工艺数据
    const getStoredProcesses = (category) => {
      const storageKey = `processes_${category}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
      return mockProcesses.processes.filter(item => item.category === category)
    }
    
    // 保存工艺数据到localStorage
    const saveProcessesToStorage = (category, processesData) => {
      const storageKey = `processes_${category}`
      localStorage.setItem(storageKey, JSON.stringify(processesData))
    }
    
    // 保存品类标签到localStorage
    const saveCategoryTagsToStorage = (currentCategory, tags) => {
      const storageKey = `processCategoryTags_${currentCategory}`
      localStorage.setItem(storageKey, JSON.stringify(tags))
    }
    
    // 智能生成工艺名称
    const generateProcessName = () => {
      const { processCategory } = processForm
      
      if (!processCategory) {
        processForm.name = ''
        return
      }
      
      const isAutoGenerated = !processForm.name || 
        processForm.name === processCategory
      
      if (isAutoGenerated) {
        processForm.name = processCategory
      }
    }
    
    // 方法
    const loadProcesses = () => {
      loading.value = true
      setTimeout(() => {
        const category = route.params.category
        processes.value = getStoredProcesses(category)
        filteredProcesses.value = [...processes.value]
        pagination.total = processes.value.length
        processCategoryTags.value = getStoredCategoryTags(category)
        loading.value = false
      }, 500)
    }
    
    const handleSearch = () => {
      let filtered = [...processes.value]
      
      if (searchForm.keyword) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(searchForm.keyword.toLowerCase())
        )
      }
      
      if (searchForm.supplier) {
        filtered = filtered.filter(item =>
          item.supplier.toLowerCase().includes(searchForm.supplier.toLowerCase())
        )
      }
      
      filteredProcesses.value = filtered
      pagination.total = filtered.length
      pagination.currentPage = 1
    }
    
    const resetSearch = () => {
      searchForm.keyword = ''
      searchForm.supplier = ''
      filteredProcesses.value = [...processes.value]
      pagination.total = processes.value.length
      pagination.currentPage = 1
    }
    
    const showAddDialog = () => {
      isEdit.value = false
      dialogVisible.value = true
      resetForm()
    }
    
    const editProcess = (process) => {
      isEdit.value = true
      Object.assign(processForm, process)
      dialogVisible.value = true
    }
    
    const saveProcess = () => {
      saving.value = true
      setTimeout(() => {
        if (isEdit.value) {
          const index = processes.value.findIndex(item => item.id === processForm.id)
          if (index !== -1) {
            processes.value[index] = { ...processForm, updateTime: new Date().toLocaleString() }
          }
          ElMessage.success('工艺更新成功')
        } else {
          const newProcess = {
            ...processForm,
            id: Date.now(),
            category: route.params.category,
            updateTime: new Date().toLocaleString()
          }
          processes.value.push(newProcess)
          ElMessage.success('工艺添加成功')
        }
        
        saveProcessesToStorage(route.params.category, processes.value)
        handleSearch()
        dialogVisible.value = false
        saving.value = false
      }, 1000)
    }
    
    const handleStatusChange = (process, value) => {
      const index = processes.value.findIndex(item => item.id === process.id)
      if (index !== -1) {
        processes.value[index].status = value
        saveProcessesToStorage(route.params.category, processes.value)
        ElMessage.success(`工艺状态已${value ? '启用' : '停用'}`)
      }
    }
    
    const resetForm = () => {
      Object.assign(processForm, {
        id: null,
        name: '',
        category: '',
        unit: '',
        price: null,
        supplier: '',
        remarks: '',
        processCategory: '',
        status: true
      })
    }
    
    const handleSizeChange = (size) => {
      pagination.pageSize = size
    }
    
    const handleCurrentChange = (page) => {
      pagination.currentPage = page
    }
    
    const handleSelectionChange = (selection) => {
      selectedProcesses.value = selection
    }
    
    const batchEdit = () => {
      if (selectedProcesses.value.length === 0) {
        ElMessage.warning('请先选择要编辑的工艺')
        return
      }
      ElMessage.info('批量编辑功能开发中...')
    }
    
    const batchDelete = () => {
      if (selectedProcesses.value.length === 0) {
        ElMessage.warning('请先选择要删除的工艺')
        return
      }
      ElMessageBox.confirm(`确定要删除选中的 ${selectedProcesses.value.length} 个工艺吗？`, '批量删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        selectedProcesses.value.forEach(process => {
          const index = processes.value.findIndex(item => item.id === process.id)
          if (index !== -1) {
            processes.value.splice(index, 1)
          }
        })
        
        saveProcessesToStorage(route.params.category, processes.value)
        handleSearch()
        ElMessage.success(`成功删除 ${selectedProcesses.value.length} 个工艺`)
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }
    
    const exportData = () => {
      ElMessage.info('数据导出功能开发中...')
    }
    
    const resetAllData = () => {
      ElMessageBox.confirm('确定要重置所有数据吗？这将清空所有自定义的工艺和品类数据，恢复到初始状态。', '重置确认', {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        const category = route.params.category
        localStorage.removeItem(`processCategoryTags_${category}`)
        localStorage.removeItem(`processes_${category}`)
        loadProcesses()
        ElMessage.success('数据已重置为初始状态')
      }).catch(() => {
        ElMessage.info('已取消重置')
      })
    }
    
    const manageCategoriesDialog = () => {
      manageCategoriesDialogVisible.value = true
    }
    
    const addCategory = () => {
      // 先进行表单验证
      if (!categoryForm.name) {
        ElMessage.error('请输入品类名称')
        return
      }
      
      // 检查品类名称是否已存在
      const exists = processCategoryTags.value.some(item => item.name === categoryForm.name)
      if (exists) {
        ElMessage.error('该品类名称已存在，请使用其他名称')
        return
      }
      
      const newCategory = {
        id: Date.now(),
        name: categoryForm.name,
        description: categoryForm.description,
        type: categoryForm.type,
        createTime: new Date().toLocaleString()
      }
      processCategoryTags.value.push(newCategory)
      
      // 保存到localStorage
      saveCategoryTagsToStorage(route.params.category, processCategoryTags.value)
      
      resetCategoryForm()
      ElMessage.success('品类添加成功')
    }
    
    const editCategory = (category) => {
      Object.assign(categoryForm, category)
    }
    
    const confirmDeleteCategory = (category) => {
      const usageCount = getCategoryUsageCount(category.name)
      
      let confirmMessage = `确定要删除品类"${category.name}"吗？`
      let warningMessage = ''
      
      if (usageCount > 0) {
        warningMessage = `注意：该品类正在被 ${usageCount} 个工艺使用，删除后这些工艺的品类信息将被清空。`
        confirmMessage = `${confirmMessage}\n\n${warningMessage}\n\n此操作不可恢复，请谨慎操作！`
      } else {
        confirmMessage = `${confirmMessage}\n\n此操作不可恢复。`
      }
      
      ElMessageBox.confirm(confirmMessage, '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
        dangerouslyUseHTMLString: false
      }).then(() => {
        // 如果有工艺在使用这个品类，清空它们的品类信息
        if (usageCount > 0) {
          processes.value.forEach(process => {
            if (process.processCategory === category.name) {
              process.processCategory = ''
            }
          })
          // 保存更新后的工艺数据
          saveProcessesToStorage(route.params.category, processes.value)
        }
        
        const index = processCategoryTags.value.findIndex(item => item.id === category.id)
        if (index !== -1) {
          processCategoryTags.value.splice(index, 1)
          saveCategoryTagsToStorage(route.params.category, processCategoryTags.value)
          ElMessage.success(`品类删除成功${usageCount > 0 ? `，已清空 ${usageCount} 个工艺的品类信息` : ''}`)
          handleSearch()
        }
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }
    
    const filterByCategory = (category) => {
      selectedCategoryId.value = category.id
      let filtered = processes.value.filter(item => item.processCategory === category.name)
      filteredProcesses.value = filtered
      pagination.total = filtered.length
      pagination.currentPage = 1
    }
    
    const clearCategoryFilter = () => {
      selectedCategoryId.value = null
      filteredProcesses.value = [...processes.value]
      pagination.total = processes.value.length
      pagination.currentPage = 1
    }
    
    const getCategoryUsageCount = (categoryName) => {
      return processes.value.filter(item => item.processCategory === categoryName).length
    }
    
    const getTagTypeByUsage = (category) => {
      const usageCount = getCategoryUsageCount(category.name)
      if (usageCount === 0) return 'info'
      if (usageCount <= 2) return 'warning'
      return category.type
    }
    
    const getTypeLabel = (type) => {
      const typeMap = {
        'primary': '蓝色',
        'success': '绿色',
        'warning': '橙色',
        'danger': '红色',
        'info': '灰色'
      }
      return typeMap[type] || '默认'
    }
    
    const getCategoryTagType = (categoryName) => {
      const category = processCategoryTags.value.find(item => item.name === categoryName)
      return category ? category.type : 'default'
    }
    
    const resetCategoryForm = () => {
      categoryForm.name = ''
      categoryForm.description = ''
      categoryForm.type = 'primary'
    }
    
    // 监听路由变化
    watch(() => route.params.category, () => {
      loadProcesses()
    })
    
    // 生命周期
    onMounted(() => {
      loadProcesses()
    })
    
    return {
      // 响应式数据
      route,
      processFormRef,
      categoryFormRef,
      loading,
      saving,
      dialogVisible,
      manageCategoriesDialogVisible,
      isEdit,
      searchForm,
      processCategoryTags,
      processes,
      filteredProcesses,
      selectedProcesses,
      selectedCategoryId,
      pagination,
      categoryForm,
      processForm,
      categoryRules,
      processRules,
      
      // 计算属�?
      dialogTitle,
      pageTitle,
      cardTitle,
      
      // 方法
      loadProcesses,
      handleSearch,
      resetSearch,
      showAddDialog,
      editProcess,
      saveProcess,
      handleStatusChange,
      resetForm,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      batchEdit,
      batchDelete,
      exportData,
      resetAllData,
      manageCategoriesDialog,
      addCategory,
      editCategory,
      confirmDeleteCategory,
      filterByCategory,
      clearCategoryFilter,
      getCategoryUsageCount,
      getTagTypeByUsage,
      getTypeLabel,
      getCategoryTagType,
      resetCategoryForm,
      generateProcessName
    }
  }
}
</script>

<style scoped>
.process-database {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.database-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.header-left .el-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #409eff;
}

.header-right {
  display: flex;
  gap: 12px;
}

.category-tags-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.tags-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tags-title {
  font-weight: 600;
  color: #374151;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.category-tag {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.category-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.category-tag.active-tag {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.usage-count {
  margin-left: 4px;
  font-size: 12px;
  opacity: 0.8;
}

.category-actions {
  display: flex;
  justify-content: flex-end;
}

.search-section {
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.price-text {
  font-weight: 600;
  color: #e6a23c;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.add-category-section {
  margin-bottom: 20px;
}

.add-category-section h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 16px;
  font-weight: 600;
}

.existing-categories-section h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 16px;
  font-weight: 600;
}

.usage-warning {
  color: #f59e0b;
  font-weight: 600;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
