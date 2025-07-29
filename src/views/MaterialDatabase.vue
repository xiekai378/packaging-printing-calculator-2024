<template>
  <div class="material-database">
    <div class="page-header">
      <h1>{{ pageTitle }}</h1>
      <p>管理{{ pageTitle }}信息和价格数据</p>
    </div>

    <el-card class="database-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-icon><Box /></el-icon>
            <span>{{ cardTitle }}</span>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="showAddDialog">
              <el-icon><Plus /></el-icon>
              添加材料
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

      <!-- 材料品类标签管理 -->
      <div class="category-tags-section" v-if="route.params.category === 'paper'">
        <div class="tags-header">
          <span class="tags-title">材料品类：</span>
          <el-button type="primary" size="small" @click="manageCategoriesDialog">
            <el-icon><Setting /></el-icon>
            品类管理
          </el-button>
        </div>
        <div class="tags-container">
          <el-tag
            v-for="category in materialCategoryTags"
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
              placeholder="搜索材料名称"
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

      <!-- 材料列表表格 -->
      <el-table
        :data="filteredMaterials"
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
            <el-button type="text" @click="editMaterial(scope.row)">
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
        <el-table-column prop="weight" label="克重" width="80" v-if="showWeightColumn" />
        <el-table-column prop="thickness" label="厚度" width="80" v-if="showThicknessColumn" />
        <el-table-column prop="standardPrice" label="正度价格" width="100" v-if="showPriceColumns">
          <template #default="scope">
            <span v-if="scope.row.standardPrice">{{ scope.row.standardPrice }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="largePrice" label="大度价格" width="100" v-if="showPriceColumns">
          <template #default="scope">
            <span v-if="scope.row.largePrice">{{ scope.row.largePrice }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="size1" label="尺寸1" width="80" v-if="showSizeColumns" />
        <el-table-column prop="size2" label="尺寸2" width="80" v-if="showSizeColumns" />
        <el-table-column prop="remarks" label="备注" min-width="150" />
        <el-table-column prop="updateTime" label="修改日期" width="150" />
        <el-table-column prop="materialCategory" label="材料品类" width="120">
          <template #default="scope">
            <el-tag :type="getCategoryTagType(scope.row.materialCategory)" size="small">
              {{ scope.row.materialCategory }}
            </el-tag>
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

    <!-- 添加/编辑材料对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="materialFormRef"
        :model="materialForm"
        :rules="materialRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="材料名称" prop="name">
              <el-input v-model="materialForm.name" placeholder="请输入材料名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="materialForm.unit" placeholder="请选择单位">
                <el-option label="元/张" value="元/张" />
                <el-option label="元/平方" value="元/平方" />
                <el-option label="元/千克" value="元/千克" />
                <el-option label="元/米" value="元/米" />
                <el-option label="元/吨" value="元/吨" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单价" prop="price">
              <el-input-number
                v-model="materialForm.price"
                :min="0"
                :precision="2"
                placeholder="请输入单价"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="showWeightColumn">
            <el-form-item label="克重" prop="weight">
              <el-input-number
                v-model="materialForm.weight"
                :min="0"
                placeholder="请输入克重"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 纸类显示正度价格和大度价格 -->
        <el-row :gutter="20" v-if="showPriceColumns">
          <el-col :span="12">
            <el-form-item label="正度价格" prop="standardPrice">
              <el-input-number
                v-model="materialForm.standardPrice"
                :min="0"
                :precision="2"
                placeholder="请输入正度价格"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="大度价格" prop="largePrice">
              <el-input-number
                v-model="materialForm.largePrice"
                :min="0"
                :precision="2"
                placeholder="请输入大度价格"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 特种纸显示尺寸 -->
        <el-row :gutter="20" v-if="showSizeColumns">
          <el-col :span="12">
            <el-form-item label="尺寸1" prop="size1">
              <el-input-number
                v-model="materialForm.size1"
                :min="0"
                placeholder="请输入尺寸1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="尺寸2" prop="size2">
              <el-input-number
                v-model="materialForm.size2"
                :min="0"
                placeholder="请输入尺寸2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier">
              <el-input v-model="materialForm.supplier" placeholder="请输入供应商" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材料品类" prop="materialCategory">
              <el-select v-model="materialForm.materialCategory" placeholder="请选择材料品类" filterable>
                <el-option
                  v-for="category in materialCategoryTags"
                  :key="category.id"
                  :label="category.name"
                  :value="category.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注">
          <el-input
            v-model="materialForm.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveMaterial" :loading="saving">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 品类管理对话框 -->
    <el-dialog
      v-model="manageCategoriesDialogVisible"
      title="材料品类管理"
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
        <el-table :data="materialCategoryTags" style="width: 100%">
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockMaterials } from '../api/mockData'

export default {
  name: 'MaterialDatabase',
  setup() {
    const route = useRoute()
    
    // 响应式数据
    const loading = ref(false)
    const saving = ref(false)
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const manageCategoriesDialogVisible = ref(false)
    const selectedCategoryId = ref(null)
    
    const searchForm = reactive({
      keyword: '',
      supplier: ''
    })
    
    const materials = ref([])
    const filteredMaterials = ref([])
    const selectedMaterials = ref([])
    
    // 从localStorage加载材料品类标签，如果没有则使用默认数据
    const getStoredCategoryTags = () => {
      const stored = localStorage.getItem('materialCategoryTags')
      if (stored) {
        return JSON.parse(stored)
      }
      return [
        { id: 1, name: '书写纸', type: 'primary', description: '用于书写的纸张', createTime: '2024-01-01 10:00:00' },
        { id: 2, name: '双胶纸', type: 'success', description: '双面胶版印刷纸', createTime: '2024-01-01 10:00:00' },
        { id: 3, name: '新闻纸', type: 'info', description: '用于印刷报纸的纸张', createTime: '2024-01-01 10:00:00' },
        { id: 4, name: '包装纸', type: 'warning', description: '用于包装的纸张', createTime: '2024-01-01 10:00:00' }
      ]
    }
    
    const materialCategoryTags = ref(getStoredCategoryTags())
    
    const pagination = reactive({
      currentPage: 1,
      pageSize: 20,
      total: 0
    })
    
    const categoryForm = reactive({
      name: '',
      description: '',
      type: 'primary'
    })
    
    const materialForm = reactive({
      id: null,
      name: '',
      category: '',
      unit: '',
      price: null,
      weight: null,
      thickness: null,
      standardPrice: null,
      largePrice: null,
      size1: null,
      size2: null,
      supplier: '',
      remarks: '',
      materialCategory: ''
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
    
    const materialRules = {
      name: [
        { required: true, message: '请输入材料名称', trigger: 'blur' }
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
      return isEdit.value ? '编辑材料' : '添加材料'
    })
    
    const pageTitle = computed(() => {
      const categoryMap = {
        'paper': '纸张数据库',
        'specialty-paper': '特种纸数据库',
        'adhesive': '不干胶数据库'
      }
      const category = route.params.category
      return categoryMap[category] || '材料数据库'
    })
    
    const cardTitle = computed(() => {
      const categoryMap = {
        'paper': '纸类管理',
        'specialty-paper': '特种纸管理',
        'adhesive': '不干胶管理'
      }
      const category = route.params.category
      return categoryMap[category] || '材料管理'
    })
    
    const showWeightColumn = computed(() => {
      const category = route.params.category
      return ['paper', 'specialty-paper'].includes(category)
    })
    
    const showThicknessColumn = computed(() => {
      const category = route.params.category
      return ['paper', 'specialty-paper'].includes(category)
    })
    
    const showPriceColumns = computed(() => {
      const category = route.params.category
      return category === 'paper'
    })
    
    const showSizeColumns = computed(() => {
      const category = route.params.category
      return category === 'specialty-paper'
    })
    
    // 从localStorage加载材料数据
    const getStoredMaterials = (category) => {
      const storageKey = `materials_${category}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
      // 如果localStorage中没有数据，使用mockData的默认数据
      return mockMaterials.materials.filter(item => item.category === category)
    }
    
    // 保存材料数据到localStorage
    const saveMaterialsToStorage = (category, materialsData) => {
      const storageKey = `materials_${category}`
      localStorage.setItem(storageKey, JSON.stringify(materialsData))
    }
    
    // 保存品类标签到localStorage
    const saveCategoryTagsToStorage = (tags) => {
      localStorage.setItem('materialCategoryTags', JSON.stringify(tags))
    }
    
    // 方法
    const loadMaterials = () => {
      loading.value = true
      setTimeout(() => {
        const category = route.params.category
        materials.value = getStoredMaterials(category)
        filteredMaterials.value = [...materials.value]
        pagination.total = materials.value.length
        loading.value = false
      }, 500)
    }
    
    const handleSearch = () => {
      let filtered = [...materials.value]
      
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
      
      filteredMaterials.value = filtered
      pagination.total = filtered.length
      pagination.currentPage = 1
    }
    
    const resetSearch = () => {
      searchForm.keyword = ''
      searchForm.supplier = ''
      filteredMaterials.value = [...materials.value]
      pagination.total = materials.value.length
      pagination.currentPage = 1
    }
    
    const showAddDialog = () => {
      isEdit.value = false
      dialogVisible.value = true
      resetForm()
    }
    
    const editMaterial = (material) => {
      isEdit.value = true
      Object.assign(materialForm, material)
      dialogVisible.value = true
    }
    
    const saveMaterial = () => {
      saving.value = true
      setTimeout(() => {
        if (isEdit.value) {
          const index = materials.value.findIndex(item => item.id === materialForm.id)
          if (index !== -1) {
            materials.value[index] = { ...materialForm, updateTime: new Date().toLocaleString() }
          }
          ElMessage.success('材料更新成功')
        } else {
          const newMaterial = {
            ...materialForm,
            id: Date.now(),
            category: route.params.category,
            updateTime: new Date().toLocaleString()
          }
          materials.value.push(newMaterial)
          ElMessage.success('材料添加成功')
        }
        
        // 保存到localStorage
        saveMaterialsToStorage(route.params.category, materials.value)
        
        handleSearch()
        dialogVisible.value = false
        saving.value = false
      }, 1000)
    }
    
    const resetForm = () => {
      Object.assign(materialForm, {
        id: null,
        name: '',
        category: '',
        unit: '',
        price: null,
        weight: null,
        thickness: null,
        standardPrice: null,
        largePrice: null,
        size1: null,
        size2: null,
        supplier: '',
        remarks: '',
        materialCategory: ''
      })
    }
    
    const handleSizeChange = (size) => {
      pagination.pageSize = size
    }
    
    const handleCurrentChange = (page) => {
      pagination.currentPage = page
    }
    
    const handleSelectionChange = (selection) => {
      selectedMaterials.value = selection
    }
    
    const batchEdit = () => {
      if (selectedMaterials.value.length === 0) {
        ElMessage.warning('请先选择要编辑的材料')
        return
      }
      ElMessage.info('批量编辑功能开发中...')
    }
    
    const batchDelete = () => {
      if (selectedMaterials.value.length === 0) {
        ElMessage.warning('请先选择要删除的材料')
        return
      }
      ElMessageBox.confirm(`确定要删除选中的 ${selectedMaterials.value.length} 个材料吗？`, '批量删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        selectedMaterials.value.forEach(material => {
          const index = materials.value.findIndex(item => item.id === material.id)
          if (index !== -1) {
            materials.value.splice(index, 1)
          }
        })
        
        // 保存到localStorage
        saveMaterialsToStorage(route.params.category, materials.value)
        
        handleSearch()
        ElMessage.success(`成功删除 ${selectedMaterials.value.length} 个材料`)
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }
    
    const exportData = () => {
      ElMessage.info('数据导出功能开发中...')
    }
    
    const resetAllData = () => {
      ElMessageBox.confirm('确定要重置所有数据吗？这将清空所有自定义的材料和品类数据，恢复到初始状态。', '重置确认', {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        // 清空localStorage中的所有相关数据
        localStorage.removeItem('materialCategoryTags')
        localStorage.removeItem('materials_paper')
        localStorage.removeItem('materials_specialty-paper')
        localStorage.removeItem('materials_adhesive')
        
        // 重新加载默认数据
        materialCategoryTags.value = getStoredCategoryTags()
        loadMaterials()
        
        ElMessage.success('数据已重置为初始状态')
      }).catch(() => {
        ElMessage.info('已取消重置')
      })
    }
    
    const manageCategoriesDialog = () => {
      manageCategoriesDialogVisible.value = true
    }
    
    const addCategory = () => {
      // 检查品类名称是否已存在
      const exists = materialCategoryTags.value.some(item => item.name === categoryForm.name)
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
      materialCategoryTags.value.push(newCategory)
      
      // 保存到localStorage
      saveCategoryTagsToStorage(materialCategoryTags.value)
      
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
        warningMessage = `注意：该品类正在被 ${usageCount} 个材料使用，删除后这些材料的品类信息将被清空。`
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
        // 如果有材料在使用这个品类，清空它们的品类信息
        if (usageCount > 0) {
          materials.value.forEach(material => {
            if (material.materialCategory === category.name) {
              material.materialCategory = ''
            }
          })
          // 保存更新后的材料数据
          saveMaterialsToStorage(route.params.category, materials.value)
        }
        
        const index = materialCategoryTags.value.findIndex(item => item.id === category.id)
        if (index !== -1) {
          materialCategoryTags.value.splice(index, 1)
          
          // 保存更新后的品类数据
          saveCategoryTagsToStorage(materialCategoryTags.value)
          
          ElMessage.success(`品类删除成功${usageCount > 0 ? `，已清空 ${usageCount} 个材料的品类信息` : ''}`)
          handleSearch() // 刷新列表
        }
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }
    
    const filterByCategory = (category) => {
      selectedCategoryId.value = category.id
      let filtered = materials.value.filter(item => item.materialCategory === category.name)
      filteredMaterials.value = filtered
      pagination.total = filtered.length
      pagination.currentPage = 1
    }
    
    const clearCategoryFilter = () => {
      selectedCategoryId.value = null
      filteredMaterials.value = [...materials.value]
      pagination.total = materials.value.length
      pagination.currentPage = 1
    }
    
    const getCategoryUsageCount = (categoryName) => {
      return materials.value.filter(item => item.materialCategory === categoryName).length
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
      const category = materialCategoryTags.value.find(item => item.name === categoryName)
      return category ? category.type : 'default'
    }
    
    const resetCategoryForm = () => {
      categoryForm.name = ''
      categoryForm.description = ''
      categoryForm.type = 'primary'
    }
    
    // 生命周期
    onMounted(() => {
      loadMaterials()
    })
    
    return {
      // 响应式数据
      route,
      loading,
      saving,
      dialogVisible,
      isEdit,
      manageCategoriesDialogVisible,
      selectedCategoryId,
      searchForm,
      materials,
      filteredMaterials,
      selectedMaterials,
      materialCategoryTags,
      pagination,
      categoryForm,
      materialForm,
      categoryRules,
      materialRules,
      
      // 计算属性
      dialogTitle,
      pageTitle,
      cardTitle,
      showWeightColumn,
      showThicknessColumn,
      showPriceColumns,
      showSizeColumns,
      
      // 方法
      // 方法
      loadMaterials,
      handleSearch,
      resetSearch,
      showAddDialog,
      editMaterial,
      saveMaterial,
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
      resetCategoryForm
    }
  }
}
</script>

<style scoped>
.material-database {
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
  color: #059669;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .material-database {
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
  
  .tags-container {
    justify-content: center;
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
