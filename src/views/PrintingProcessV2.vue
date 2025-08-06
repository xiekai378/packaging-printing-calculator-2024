<template>
  <div class="printing-process-tabs">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-icon class="header-icon"><Printer /></el-icon>
            <span class="header-title">印刷工艺价格管理</span>
          </div>
          <div class="header-actions">
            <el-button type="primary" @click="showAddCategoryDialog">
              <el-icon><Plus /></el-icon>
              添加分类
            </el-button>
            <el-button type="success" @click="showAddSizeDialog">
              <el-icon><Plus /></el-icon>
              添加尺寸
            </el-button>
          </div>
        </div>
      </template>

      <!-- 第一层选项卡：印刷分类 -->
      <el-tabs 
        v-model="activeCategory" 
        type="border-card" 
        @tab-click="handleCategoryChange"
        class="category-tabs"
      >
        <el-tab-pane 
          v-for="category in categories" 
          :key="category.id"
          :name="category.id.toString()"
          :label="category.name"
        >
          <!-- 第二层选项卡：尺寸规格 -->
          <el-tabs 
            v-model="activeSize" 
            type="card" 
            @tab-click="handleSizeChange"
            class="size-tabs"
          >
            <el-tab-pane 
              v-for="size in getCurrentSizes()" 
              :key="size.id"
              :name="size.id.toString()"
              :label="size.name"
            >
              <!-- 价格表格内容 -->
              <div class="price-content">
                <div class="content-header">
                  <h3>{{ getCurrentCategory()?.name }} - {{ getCurrentSize()?.name }} 价格表</h3>
                  <div class="content-actions">
                    <el-button type="info" size="small" @click="batchSetPrice">
                      <el-icon><Setting /></el-icon>
                      批量设置
                    </el-button>
                    <el-button type="warning" size="small" @click="resetPrices">
                      <el-icon><Refresh /></el-icon>
                      重置价格
                    </el-button>
                    <el-button type="danger" size="small" @click="deleteSize">
                      <el-icon><Delete /></el-icon>
                      删除尺寸
                    </el-button>
                  </div>
                </div>

                <el-table 
                  :data="priceTableData" 
                  border 
                  stripe
                  class="price-table"
                  :header-cell-style="{ 
                    background: '#f0f9ff', 
                    color: '#1f2937', 
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600'
                  }"
                  size="default"
                >
                  <el-table-column prop="colorName" label="颜色" width="100" fixed="left">
                    <template #default="scope">
                      <el-tag :type="getColorType(scope.row.colorName)" size="small">
                        {{ scope.row.colorName }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  
                  <el-table-column 
                    v-for="range in quantityRanges" 
                    :key="range.key"
                    :label="range.name"
                    width="110"
                    align="center"
                  >
                    <template #default="scope">
                      <div class="price-cell">
                        <el-input-number
                          v-model="scope.row.prices[range.key]"
                          :min="0"
                          :precision="2"
                          size="small"
                          :controls="false"
                          @change="updatePrice(scope.row.colorId, range.key, scope.row.prices[range.key])"
                          class="price-input"
                        />
                        <span class="unit">元/千张</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>

            <!-- 添加尺寸的占位选项卡 -->
            <el-tab-pane name="add-size" disabled>
              <template #label>
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="showAddSizeDialog"
                  class="add-size-btn"
                >
                  <el-icon><Plus /></el-icon>
                  添加尺寸
                </el-button>
              </template>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <!-- 添加分类的占位选项卡 -->
        <el-tab-pane name="add-category" disabled>
          <template #label>
            <el-button 
              type="success" 
              size="small" 
              @click="showAddCategoryDialog"
              class="add-category-btn"
            >
              <el-icon><Plus /></el-icon>
              添加分类
            </el-button>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog v-model="addCategoryVisible" title="添加印刷分类" width="400px">
      <el-form :model="categoryForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" placeholder="如：胶印、丝网印刷等" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="categoryForm.description" placeholder="分类描述" />
        </el-form-item>
        <el-form-item label="标签颜色">
          <el-select v-model="categoryForm.type">
            <el-option label="蓝色" value="primary" />
            <el-option label="绿色" value="success" />
            <el-option label="橙色" value="warning" />
            <el-option label="红色" value="danger" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addCategoryVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加尺寸对话框 -->
    <el-dialog v-model="addSizeVisible" title="添加尺寸规格" width="400px">
      <el-form :model="sizeForm" label-width="80px">
        <el-form-item label="尺寸名称">
          <el-input v-model="sizeForm.name" placeholder="如：全开、对开等" />
        </el-form-item>
        <el-form-item label="尺寸规格">
          <el-input v-model="sizeForm.specification" placeholder="如：1194×889mm" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="sizeForm.description" placeholder="尺寸描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addSizeVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSize">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'PrintingProcessTabs',
  setup() {
    const activeCategory = ref('1')
    const activeSize = ref('1')
    const addCategoryVisible = ref(false)
    const addSizeVisible = ref(false)
    
    const categories = ref([
      { id: 1, name: '胶印', description: '平版胶印，适用于大批量印刷', type: 'primary' },
      { id: 2, name: '丝网印刷', description: '丝网印刷，适用于特殊材料', type: 'success' },
      { id: 3, name: 'UV印刷', description: 'UV固化印刷，色彩鲜艳', type: 'warning' }
    ])
    
    const sizes = ref([
      { id: 1, categoryId: 1, name: '全开', specification: '1194×889mm', description: '全开印刷机，适用于大幅面印刷' },
      { id: 2, categoryId: 1, name: '对开', specification: '597×889mm', description: '对开印刷机，常用规格' },
      { id: 3, categoryId: 1, name: '四开', specification: '597×444mm', description: '四开印刷机，中等规格' },
      { id: 4, categoryId: 2, name: '小幅面', specification: '400×300mm', description: '丝网印刷小幅面' },
      { id: 5, categoryId: 3, name: 'UV全开', specification: '1194×889mm', description: 'UV印刷全开规格' }
    ])
    
    const colors = ref([
      { id: 1, name: '单色', type: 'info' },
      { id: 2, name: '双色', type: 'primary' },
      { id: 3, name: '四色', type: 'success' },
      { id: 4, name: '六色', type: 'warning' }
    ])
    
    const quantityRanges = ref([
      { key: 'range1', name: '起步价 1-1200', minQty: 1, maxQty: 1200 },
      { key: 'range2', name: '1200-2200', minQty: 1200, maxQty: 2200 },
      { key: 'range3', name: '2200-3200', minQty: 2200, maxQty: 3200 },
      { key: 'range4', name: '3200-4200', minQty: 3200, maxQty: 4200 },
      { key: 'range5', name: '4200-5200', minQty: 4200, maxQty: 5200 },
      { key: 'range6', name: '5200-6200', minQty: 5200, maxQty: 6200 },
      { key: 'range7', name: '6200-7200', minQty: 6200, maxQty: 7200 },
      { key: 'range8', name: '7200-8200', minQty: 7200, maxQty: 8200 },
      { key: 'range9', name: '8200-9200', minQty: 8200, maxQty: 9200 },
      { key: 'range10', name: '9200-10000', minQty: 9200, maxQty: 10000 },
      { key: 'range11', name: '10000+', minQty: 10000, maxQty: null }
    ])
    
    const categoryForm = reactive({
      name: '',
      description: '',
      type: 'primary'
    })
    
    const sizeForm = reactive({
      name: '',
      specification: '',
      description: ''
    })
    
    // 获取当前分类
    const getCurrentCategory = () => {
      return categories.value.find(cat => cat.id.toString() === activeCategory.value)
    }
    
    // 获取当前分类下的尺寸
    const getCurrentSizes = () => {
      const categoryId = parseInt(activeCategory.value)
      return sizes.value.filter(size => size.categoryId === categoryId)
    }
    
    // 获取当前尺寸
    const getCurrentSize = () => {
      return sizes.value.find(size => size.id.toString() === activeSize.value)
    }
    
    // 计算价格的函数
    const calculatePrice = (colorName, range) => {
      // 不同颜色的起步价
      const basePrices = {
        '单色': 260,
        '双色': 380,
        '四色': 520,
        '六色': 680
      }
      
      const basePrice = basePrices[colorName] || 260
      const incrementPer1000 = 30 // 每1000张增加30元
      const pricePerSheetAfter10000 = 0.04 // 1万张以上每张0.04元
      
      if (range.key === 'range1') {
        // 起步价 1-1200张
        return basePrice
      } else if (range.key === 'range11') {
        // 10000+ 按每张0.04元计算，转换为每千张价格
        return Math.round(pricePerSheetAfter10000 * 1000 * (basePrices[colorName] / 260))
      } else {
        // 中间区间：起步价 + 每1000张增加30元
        const rangeIndex = parseInt(range.key.replace('range', '')) - 1
        const additionalPrice = (rangeIndex - 1) * incrementPer1000
        return basePrice + additionalPrice
      }
    }
    
    // 价格表格数据
    const priceTableData = computed(() => {
      return colors.value.map(color => {
        const prices = {}
        
        quantityRanges.value.forEach(range => {
          prices[range.key] = calculatePrice(color.name, range)
        })
        
        return {
          colorId: color.id,
          colorName: color.name,
          prices
        }
      })
    })
    
    // 处理分类切换
    const handleCategoryChange = (tab) => {
      if (tab.name === 'add-category') return
      
      activeCategory.value = tab.name
      // 切换分类时，选择该分类下的第一个尺寸
      const currentSizes = getCurrentSizes()
      if (currentSizes.length > 0) {
        activeSize.value = currentSizes[0].id.toString()
      } else {
        activeSize.value = ''
      }
    }
    
    // 处理尺寸切换
    const handleSizeChange = (tab) => {
      if (tab.name === 'add-size') return
      
      activeSize.value = tab.name
    }
    
    // 监听分类变化，确保尺寸选择正确
    watch(activeCategory, () => {
      const currentSizes = getCurrentSizes()
      if (currentSizes.length > 0) {
        // 检查当前选中的尺寸是否属于当前分类
        const currentSize = getCurrentSize()
        if (!currentSize || currentSize.categoryId !== parseInt(activeCategory.value)) {
          activeSize.value = currentSizes[0].id.toString()
        }
      } else {
        activeSize.value = ''
      }
    })
    
    // 初始化时确保选择正确的尺寸
    onMounted(() => {
      const currentSizes = getCurrentSizes()
      if (currentSizes.length > 0) {
        activeSize.value = currentSizes[0].id.toString()
      }
    })
    
    const getColorType = (colorName) => {
      const color = colors.value.find(c => c.name === colorName)
      return color ? color.type : 'default'
    }
    
    const updatePrice = (colorId, rangeKey, price) => {
      console.log('更新价格:', colorId, rangeKey, price)
    }
    
    const showAddCategoryDialog = () => {
      addCategoryVisible.value = true
    }
    
    const showAddSizeDialog = () => {
      addSizeVisible.value = true
    }
    
    const saveCategory = () => {
      if (!categoryForm.name) {
        ElMessage.error('请输入分类名称')
        return
      }
      
      const newCategory = {
        id: Date.now(),
        name: categoryForm.name,
        description: categoryForm.description,
        type: categoryForm.type
      }
      
      categories.value.push(newCategory)
      addCategoryVisible.value = false
      
      Object.assign(categoryForm, {
        name: '',
        description: '',
        type: 'primary'
      })
      
      ElMessage.success('分类添加成功')
    }
    
    const saveSize = () => {
      if (!sizeForm.name) {
        ElMessage.error('请输入尺寸名称')
        return
      }
      
      const newSize = {
        id: Date.now(),
        categoryId: parseInt(activeCategory.value),
        name: sizeForm.name,
        specification: sizeForm.specification,
        description: sizeForm.description
      }
      
      sizes.value.push(newSize)
      addSizeVisible.value = false
      
      Object.assign(sizeForm, {
        name: '',
        specification: '',
        description: ''
      })
      
      ElMessage.success('尺寸添加成功')
    }
    
    const batchSetPrice = () => {
      ElMessage.info('批量设置价格功能开发中...')
    }
    
    const resetPrices = () => {
      ElMessage.info('重置价格功能开发中...')
    }
    
    const deleteSize = () => {
      const currentSize = getCurrentSize()
      if (!currentSize) return
      
      ElMessageBox.confirm(`确定要删除尺寸"${currentSize.name}"吗？`, '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = sizes.value.findIndex(size => size.id === currentSize.id)
        if (index !== -1) {
          sizes.value.splice(index, 1)
          ElMessage.success('尺寸删除成功')
          
          // 切换到该分类下的第一个尺寸
          const currentSizes = getCurrentSizes()
          if (currentSizes.length > 0) {
            activeSize.value = currentSizes[0].id.toString()
          }
        }
      }).catch(() => {})
    }
    
    return {
      activeCategory,
      activeSize,
      addCategoryVisible,
      addSizeVisible,
      categories,
      categoryForm,
      sizeForm,
      getCurrentCategory,
      getCurrentSizes,
      getCurrentSize,
      priceTableData,
      quantityRanges,
      handleCategoryChange,
      handleSizeChange,
      getColorType,
      updatePrice,
      showAddCategoryDialog,
      showAddSizeDialog,
      saveCategory,
      saveSize,
      batchSetPrice,
      resetPrices,
      deleteSize
    }
  }
}
</script>

<style scoped>
.printing-process-tabs {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.main-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 20px;
  color: #409eff;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 选项卡样式 */
.category-tabs {
  margin-bottom: 0;
}

.size-tabs {
  margin-top: 16px;
}

/* 价格内容区域 */
.price-content {
  padding: 20px 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.content-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.content-actions {
  display: flex;
  gap: 8px;
}

/* 价格表格样式 */
.price-table {
  border-radius: 8px;
  overflow: hidden;
}

.price-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.price-input {
  width: 90px;
}

.unit {
  font-size: 11px;
  color: #6b7280;
}

/* 添加按钮样式 */
.add-size-btn,
.add-category-btn {
  border: 2px dashed #d1d5db;
  background: transparent;
  color: #6b7280;
}

.add-size-btn:hover,
.add-category-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .printing-process-tabs {
    padding: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .content-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

/* 选项卡样式优化 */
:deep(.el-tabs__header) {
  margin: 0 0 16px 0;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0 4px;
}

:deep(.el-tabs__item) {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}

:deep(.el-tabs--border-card .el-tabs__item) {
  border-radius: 6px 6px 0 0;
}

:deep(.el-tabs--card .el-tabs__item) {
  border-radius: 6px 6px 0 0;
  margin-right: 4px;
}
</style>