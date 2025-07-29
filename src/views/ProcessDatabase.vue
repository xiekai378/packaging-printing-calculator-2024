<template>
  <div class="process-database">
    <div class="page-header">
      <h1>{{ pageTitle }}</h1>
      <p>管理印刷工艺信息和价格系数</p>
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
            <el-select
              v-model="searchForm.priceType"
              placeholder="计价方式"
              clearable
              @change="handleSearch"
            >
              <el-option label="固定价格" value="fixed" />
              <el-option label="系数计价" value="coefficient" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="searchForm.status"
              placeholder="状态筛选"
              clearable
              @change="handleSearch"
            >
              <el-option label="启用" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
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
        <el-table-column prop="name" label="工艺名称" min-width="120" fixed="left">
          <template #default="scope">
            <el-button type="text" @click="editProcess(scope.row)">
              {{ scope.row.name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120">
          <template #default="scope">
            <el-tag :type="getCategoryTagType(scope.row.category)">
              {{ getCategoryLabel(scope.row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="工艺描述" min-width="180" />
        <el-table-column prop="priceType" label="计价方式" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.priceType === 'fixed' ? 'success' : 'warning'">
              {{ scope.row.priceType === 'fixed' ? '固定价格' : '系数计价' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格/系数" width="120">
          <template #default="scope">
            <span class="price-text">
              {{ scope.row.priceType === 'fixed' ? '¥' + scope.row.price : scope.row.price + 'x' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="difficulty" label="难度等级" width="120">
          <template #default="scope">
            <el-rate
              v-model="scope.row.difficulty"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="active"
              inactive-value="inactive"
              @change="() => handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="150" />
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
            <el-form-item label="工艺名称" prop="name">
              <el-input v-model="processForm.name" placeholder="请输入工艺名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺分类" prop="category">
              <el-select v-model="processForm.category" placeholder="请选择分类">
                <el-option
                  v-for="category in processCategories"
                  :key="category.value"
                  :label="category.label"
                  :value="category.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计价方式" prop="priceType">
              <el-radio-group v-model="processForm.priceType">
                <el-radio label="fixed">固定价格</el-radio>
                <el-radio label="coefficient">系数计价</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="processForm.priceType === 'fixed' ? '价格' : '系数'" prop="price">
              <el-input-number
                v-model="processForm.price"
                :min="0"
                :precision="processForm.priceType === 'fixed' ? 2 : 3"
                :placeholder="processForm.priceType === 'fixed' ? '请输入价格' : '请输入系数'"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="processForm.unit" placeholder="请选择单位">
                <el-option label="张" value="sheet" />
                <el-option label="平方米" value="sqm" />
                <el-option label="米" value="meter" />
                <el-option label="次" value="time" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难度等级" prop="difficulty">
              <el-rate
                v-model="processForm.difficulty"
                :max="5"
                show-text
                :texts="['很简单', '简单', '一般', '困难', '很困难']"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="工艺描述" prop="description">
          <el-input
            v-model="processForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入工艺描述"
          />
        </el-form-item>

        <el-form-item label="技术要求">
          <el-input
            v-model="processForm.requirements"
            type="textarea"
            :rows="2"
            placeholder="请输入技术要求"
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
    const processFormRef = ref(null)
    
    // 响应式数据
    const loading = ref(false)
    const saving = ref(false)
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const selectedProcesses = ref([])
    
    const searchForm = reactive({
      keyword: '',
      priceType: '',
      status: ''
    })
    
    const processCategories = [
      { label: '印刷工艺', value: 'printing' },
      { label: '表面工艺', value: 'surface' },
      { label: '后道工艺', value: 'finishing' },
      { label: '特殊工艺', value: 'special' },
      { label: '装订工艺', value: 'binding' }
    ]
    
    const processes = ref([])
    const filteredProcesses = ref([])
    
    const pagination = reactive({
      currentPage: 1,
      pageSize: 20,
      total: 0
    })
    
    const processForm = reactive({
      id: null,
      name: '',
      category: '',
      description: '',
      priceType: 'fixed',
      price: null,
      unit: '',
      difficulty: 1,
      requirements: '',
      status: 'active'
    })
    
    const processRules = {
      name: [
        { required: true, message: '请输入工艺名称', trigger: 'blur' }
      ],
      category: [
        { required: true, message: '请选择工艺分类', trigger: 'change' }
      ],
      description: [
        { required: true, message: '请输入工艺描述', trigger: 'blur' }
      ],
      priceType: [
        { required: true, message: '请选择计价方式', trigger: 'change' }
      ],
      price: [
        { required: true, message: '请输入价格或系数', trigger: 'blur' }
      ],
      unit: [
        { required: true, message: '请选择单位', trigger: 'change' }
      ]
    }
    
    // 计算属性
    const dialogTitle = computed(() => {
      return isEdit.value ? '编辑工艺' : '添加工艺'
    })
    
    const pageTitle = computed(() => {
      const categoryMap = {
        'printing': '印刷工艺',
        'surface': '表面工艺',
        'finishing': '后道工艺',
        'special': '特殊工艺',
        'binding': '装订工艺'
      }
      const category = route.params.category
      return categoryMap[category] || '工艺数据库'
    })
    
    const cardTitle = computed(() => {
      const categoryMap = {
        'printing': '印刷工艺管理',
        'surface': '表面工艺管理',
        'finishing': '后道工艺管理',
        'special': '特殊工艺管理',
        'binding': '装订工艺管理'
      }
      const category = route.params.category
      return categoryMap[category] || '工艺管理'
    })
    
    // 从localStorage加载工艺数据
    const getStoredProcesses = (category) => {
      const storageKey = `processes_${category}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
      // 如果localStorage中没有数据，使用mockData的默认数据
      return mockProcesses.processDetails.filter(item => item.category === category)
    }
    
    // 保存工艺数据到localStorage
    const saveProcessesToStorage = (category, processesData) => {
      const storageKey = `processes_${category}`
      localStorage.setItem(storageKey, JSON.stringify(processesData))
    }
    
    // 方法
    const loadProcesses = () => {
      loading.value = true
      setTimeout(() => {
        const category = route.params.category
        processes.value = getStoredProcesses(category)
        applyInitialFilter()
        loading.value = false
      }, 500)
    }
    
    const applyInitialFilter = () => {
      const category = route.params.category
      let filtered = [...processes.value]
      
      // 必须按分类过滤，每个模块只显示对应分类的数据
      if (category) {
        filtered = filtered.filter(item => item.category === category)
      } else {
        // 如果没有分类参数，默认显示空数据
        filtered = []
      }
      
      filteredProcesses.value = filtered
      pagination.total = filtered.length
    }
    
    const handleSearch = () => {
      const currentCategory = route.params.category
      let filtered = [...processes.value]
      
      // 首先按当前路由分类过滤
      if (currentCategory) {
        filtered = filtered.filter(item => item.category === currentCategory)
      } else {
        filtered = []
      }
      
      // 然后应用搜索条件
      if (searchForm.keyword) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(searchForm.keyword.toLowerCase())
        )
      }
      
      if (searchForm.priceType) {
        filtered = filtered.filter(item => item.priceType === searchForm.priceType)
      }
      
      if (searchForm.status) {
        filtered = filtered.filter(item => item.status === searchForm.status)
      }
      
      filteredProcesses.value = filtered
      pagination.total = filtered.length
      pagination.currentPage = 1
    }
    
    const resetSearch = () => {
      searchForm.keyword = ''
      searchForm.priceType = ''
      searchForm.status = ''
      applyInitialFilter()
    }
    
    const getCategoryLabel = (category) => {
      const categoryItem = processCategories.find(item => item.value === category)
      return categoryItem ? categoryItem.label : category
    }
    
    const getCategoryTagType = (category) => {
      const typeMap = {
        printing: 'primary',
        finishing: 'success',
        special: 'warning',
        surface: 'info',
        binding: 'default'
      }
      return typeMap[category] || 'default'
    }
    
    const showAddDialog = () => {
      isEdit.value = false
      processForm.category = route.params.category
      dialogVisible.value = true
    }
    
    const editProcess = (process) => {
      isEdit.value = true
      Object.assign(processForm, process)
      dialogVisible.value = true
    }
    
    const saveProcess = async () => {
      if (!processFormRef.value) return
      
      try {
        await processFormRef.value.validate()
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
              updateTime: new Date().toLocaleString()
            }
            processes.value.push(newProcess)
            ElMessage.success('工艺添加成功')
          }
          
          // 保存到localStorage
          saveProcessesToStorage(route.params.category, processes.value)
          
          handleSearch()
          dialogVisible.value = false
          saving.value = false
        }, 1000)
      } catch (error) {
        ElMessage.error('请完善必填信息')
      }
    }
    
    const deleteProcess = (process) => {
      ElMessageBox.confirm(`确定要删除工艺"${process.name}"吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = processes.value.findIndex(item => item.id === process.id)
        if (index !== -1) {
          processes.value.splice(index, 1)
          
          // 保存到localStorage
          saveProcessesToStorage(route.params.category, processes.value)
          
          handleSearch()
          ElMessage.success('删除成功')
        }
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }
    
    const handleStatusChange = (process) => {
      // 更新状态后保存到localStorage
      saveProcessesToStorage(route.params.category, processes.value)
      ElMessage.success(`工艺状态已${process.status === 'active' ? '启用' : '禁用'}`)
    }
    
    const resetForm = () => {
      if (processFormRef.value) {
        processFormRef.value.resetFields()
      }
      Object.assign(processForm, {
        id: null,
        name: '',
        category: route.params.category,
        description: '',
        priceType: 'fixed',
        price: null,
        unit: '',
        difficulty: 1,
        requirements: '',
        status: 'active'
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
        
        // 保存到localStorage
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
      ElMessageBox.confirm('确定要重置所有数据吗？这将清空所有自定义的工艺数据，恢复到初始状态。', '重置确认', {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        // 清空localStorage中的所有相关数据
        localStorage.removeItem('processes_printing')
        localStorage.removeItem('processes_surface')
        localStorage.removeItem('processes_finishing')
        localStorage.removeItem('processes_special')
        localStorage.removeItem('processes_binding')
        
        // 重新加载默认数据
        loadProcesses()
        
        ElMessage.success('数据已重置为初始状态')
      }).catch(() => {
        ElMessage.info('已取消重置')
      })
    }
    
    // 监听路由变化
    watch(() => route.params.category, (newCategory) => {
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
      loading,
      saving,
      dialogVisible,
      isEdit,
      searchForm,
      processCategories,
      processes,
      filteredProcesses,
      selectedProcesses,
      pagination,
      processForm,
      processRules,
      
      // 计算属性
      dialogTitle,
      pageTitle,
      cardTitle,
      
      // 方法
      loadProcesses,
      applyInitialFilter,
      handleSearch,
      resetSearch,
      getCategoryLabel,
      getCategoryTagType,
      showAddDialog,
      editProcess,
      saveProcess,
      deleteProcess,
      handleStatusChange,
      resetForm,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      batchEdit,
      batchDelete,
      exportData,
      resetAllData
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .process-database {
    padding: 10px;
  }
  
  .header-right {
    flex-direction: column;
    gap: 8px;
  }
  
  .search-section .el-row {
    flex-direction: column;
  }
  
  .search-section .el-col {
    margin-bottom: 12px;
  }
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table__header-wrapper) {
  border-radius: 8px 8px 0 0;
}

:deep(.el-table__body-wrapper) {
  border-radius: 0 0 8px 8px;
}

:deep(.el-button--text) {
  color: #409eff;
  font-weight: 500;
}

:deep(.el-button--text:hover) {
  color: #66b1ff;
  background-color: #ecf5ff;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
  border-top: 1px solid #f0f0f0;
}

/* 表单样式 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
}

/* 分页样式 */
:deep(.el-pagination) {
  justify-content: center;
}

:deep(.el-pagination .el-pager li) {
  border-radius: 4px;
  margin: 0 2px;
}

:deep(.el-pagination .el-pager li.is-active) {
  background-color: #409eff;
  color: white;
}
</style>