<template>
  <div class="home-page">
    <div class="page-header">
      <h1 class="page-title">
        <el-icon class="title-icon"><Calculator /></el-icon>
        包装印刷报价系统
      </h1>
      <p class="page-subtitle">输入尺寸和数量，选择材料和工艺，快速获取精准报价</p>
    </div>

    <el-row :gutter="24" class="main-content">
      <!-- 左侧：输入区域 -->
      <el-col :span="10">
        <el-card class="input-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><Edit /></el-icon>
              <span>基础信息</span>
            </div>
          </template>

          <el-form :model="quoteForm" label-width="100px" size="large">
            <!-- 尺寸输入 -->
            <el-form-item label="产品尺寸">
              <div class="size-input-group">
                <el-input-number
                  v-model="quoteForm.width"
                  :min="1"
                  :max="2000"
                  placeholder="宽度"
                  class="size-input"
                  @change="calculateQuote"
                />
                <span class="size-separator">×</span>
                <el-input-number
                  v-model="quoteForm.height"
                  :min="1"
                  :max="2000"
                  placeholder="高度"
                  class="size-input"
                  @change="calculateQuote"
                />
                <span class="size-unit">mm</span>
              </div>
            </el-form-item>

            <!-- 数量输入 -->
            <el-form-item label="印刷数量">
              <el-input-number
                v-model="quoteForm.quantity"
                :min="1"
                :max="1000000"
                placeholder="请输入数量"
                style="width: 100%"
                @change="calculateQuote"
              />
              <span class="quantity-unit">张</span>
            </el-form-item>

            <!-- 材料选择 -->
            <el-form-item label="选择材料">
              <el-select
                v-model="quoteForm.materialId"
                placeholder="请选择材料"
                style="width: 100%"
                filterable
                @change="calculateQuote"
              >
                <el-option-group
                  v-for="category in materialCategories"
                  :key="category.name"
                  :label="category.name"
                >
                  <el-option
                    v-for="material in category.materials"
                    :key="material.id"
                    :label="`${material.name} - ¥${material.price}/${material.unit}`"
                    :value="material.id"
                  >
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span>{{ material.name }}</span>
                      <el-tag size="small" :type="getCategoryTagType(material.materialCategory)">
                        {{ material.materialCategory }}
                      </el-tag>
                    </div>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>

            <!-- 印刷工艺选择 -->
            <el-form-item label="印刷工艺">
              <el-select
                v-model="quoteForm.printingProcess"
                placeholder="请选择印刷工艺"
                style="width: 100%"
                filterable
                @change="onPrintingProcessChange"
              >
                <el-option-group
                  v-for="category in printingCategories"
                  :key="category.name"
                  :label="category.name"
                >
                  <el-option
                    v-for="process in category.processes"
                    :key="process.id"
                    :label="`${process.name} - ¥${process.price}/${process.unit || '平方米'}`"
                    :value="process.id"
                  >
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span>{{ process.name }}</span>
                      <span style="color: #999; font-size: 12px;">{{ process.description }}</span>
                    </div>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>

            <!-- 印刷规格选择 -->
            <el-form-item label="印刷规格" v-if="availableSizes.length > 0">
              <el-select
                v-model="quoteForm.printingSize"
                placeholder="请选择印刷规格"
                style="width: 100%"
                @change="calculateQuote"
              >
                <el-option
                  v-for="size in availableSizes"
                  :key="size.id"
                  :label="`${size.name} (${size.specification})`"
                  :value="size.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 印刷颜色选择 -->
            <el-form-item label="印刷颜色" v-if="quoteForm.printingSize">
              <el-select
                v-model="quoteForm.printingColor"
                placeholder="请选择印刷颜色"
                style="width: 100%"
                @change="calculateQuote"
              >
                <el-option
                  v-for="color in printingColors"
                  :key="color.id"
                  :label="color.name"
                  :value="color.id"
                >
                  <template #default>
                    <el-tag :type="color.type" size="small">{{ color.name }}</el-tag>
                  </template>
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 表面工艺选择 -->
            <el-form-item label="表面工艺">
              <el-select
                v-model="quoteForm.surfaceProcess"
                placeholder="请选择表面工艺（可选）"
                style="width: 100%"
                filterable
                clearable
                @change="calculateQuote"
              >
                <el-option-group
                  v-for="category in surfaceCategories"
                  :key="category.name"
                  :label="category.name"
                >
                  <el-option
                    v-for="process in category.processes"
                    :key="process.id"
                    :label="`${process.name} - ¥${process.price}/${process.unit || '平方米'}`"
                    :value="process.id"
                  >
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span>{{ process.name }}</span>
                      <el-tag size="small" type="success">{{ process.processCategory }}</el-tag>
                    </div>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>

            <!-- 后道工艺选择 -->
            <el-form-item label="后道工艺">
              <el-select
                v-model="quoteForm.finishingProcess"
                placeholder="请选择后道工艺（可选）"
                style="width: 100%"
                filterable
                clearable
                @change="calculateQuote"
              >
                <el-option-group
                  v-for="category in finishingCategories"
                  :key="category.name"
                  :label="category.name"
                >
                  <el-option
                    v-for="process in category.processes"
                    :key="process.id"
                    :label="`${process.name} - ¥${process.price}/${process.unit || '张'}`"
                    :value="process.id"
                  >
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span>{{ process.name }}</span>
                      <el-tag size="small" type="warning">{{ process.processCategory }}</el-tag>
                    </div>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧：报价结果 -->
      <el-col :span="14">
        <el-card class="result-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><Money /></el-icon>
              <span>报价结果</span>
            </div>
          </template>

          <!-- 产品预览 -->
          <div class="product-preview" v-if="quoteForm.width && quoteForm.height">
            <h3>产品预览</h3>
            <div class="preview-box">
              <div 
                class="product-shape"
                :style="{
                  width: Math.min(200, quoteForm.width / 5) + 'px',
                  height: Math.min(150, quoteForm.height / 5) + 'px'
                }"
              >
                <span class="size-label">
                  {{ quoteForm.width }} × {{ quoteForm.height }} mm
                </span>
              </div>
            </div>
          </div>

          <!-- 价格明细 -->
          <div class="price-breakdown" v-if="quoteResult.total > 0">
            <h3>价格明细</h3>
            <el-table :data="priceDetails" border size="small">
              <el-table-column prop="item" label="项目" width="120"></el-table-column>
              <el-table-column prop="specification" label="规格/说明"></el-table-column>
              <el-table-column prop="unitPrice" label="单价" width="80" align="right">
                <template #default="scope">
                  ¥{{ scope.row.unitPrice }}
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" width="80" align="right"></el-table-column>
              <el-table-column prop="subtotal" label="小计" width="100" align="right">
                <template #default="scope">
                  <span class="price-text">¥{{ scope.row.subtotal }}</span>
                </template>
              </el-table-column>
            </el-table>

            <!-- 总价显示 -->
            <div class="total-price">
              <div class="price-row">
                <span class="label">材料费用：</span>
                <span class="value">¥{{ quoteResult.materialCost.toFixed(2) }}</span>
              </div>
              <div class="price-row">
                <span class="label">印刷费用：</span>
                <span class="value">¥{{ quoteResult.printingCost.toFixed(2) }}</span>
              </div>
              <div class="price-row" v-if="quoteResult.surfaceCost > 0">
                <span class="label">表面工艺：</span>
                <span class="value">¥{{ quoteResult.surfaceCost.toFixed(2) }}</span>
              </div>
              <div class="price-row" v-if="quoteResult.finishingCost > 0">
                <span class="label">后道工艺：</span>
                <span class="value">¥{{ quoteResult.finishingCost.toFixed(2) }}</span>
              </div>
              <el-divider></el-divider>
              <div class="price-row total">
                <span class="label">总计：</span>
                <span class="value total-amount">¥{{ quoteResult.total.toFixed(2) }}</span>
              </div>
              <div class="price-row unit">
                <span class="label">单张成本：</span>
                <span class="value">¥{{ (quoteResult.total / quoteForm.quantity).toFixed(4) }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="saveQuote">
                <el-icon><DocumentAdd /></el-icon>
                保存报价
              </el-button>
              <el-button type="success" size="large" @click="exportQuote">
                <el-icon><Download /></el-icon>
                导出报价单
              </el-button>
              <el-button size="large" @click="resetForm">
                <el-icon><Refresh /></el-icon>
                重新计算
              </el-button>
            </div>
          </div>

          <!-- 空状态 -->
          <el-empty 
            v-else
            description="请填写完整信息以获取报价"
            :image-size="120"
          >
            <template #image>
              <el-icon size="120" color="#e6e8eb"><Calculator /></el-icon>
            </template>
          </el-empty>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { mockMaterials, mockProcesses } from '../api/mockData'

export default {
  name: 'HomePage',
  setup() {
    // 表单数据
    const quoteForm = reactive({
      width: null,
      height: null,
      quantity: null,
      materialId: null,
      printingProcess: null,
      printingSize: null,
      printingColor: null,
      surfaceProcess: null,
      finishingProcess: null
    })

    // 报价结果
    const quoteResult = reactive({
      materialCost: 0,
      printingCost: 0,
      surfaceCost: 0,
      finishingCost: 0,
      total: 0
    })

    // 数据源
    const materials = ref([])
    const printingProcesses = ref([])
    const surfaceProcesses = ref([])
    const finishingProcesses = ref([])
    const printingSizes = ref([])
    const printingColors = ref([
      { id: 1, name: '单色', type: 'info' },
      { id: 2, name: '双色', type: 'primary' },
      { id: 3, name: '四色', type: 'success' },
      { id: 4, name: '六色', type: 'warning' }
    ])

    // 可用的印刷规格
    const availableSizes = computed(() => {
      if (!quoteForm.printingProcess) return []
      return printingSizes.value.filter(size => 
        size.categoryId === quoteForm.printingProcess
      )
    })

    // 材料分组
    const materialCategories = computed(() => {
      const categories = {}
      materials.value.forEach(material => {
        const categoryName = material.materialCategory || '其他'
        if (!categories[categoryName]) {
          categories[categoryName] = {
            name: categoryName,
            materials: []
          }
        }
        categories[categoryName].materials.push(material)
      })
      return Object.values(categories)
    })

    // 印刷工艺分组
    const printingCategories = computed(() => {
      const categories = {}
      printingProcesses.value.forEach(process => {
        const categoryName = process.processCategory || '其他工艺'
        if (!categories[categoryName]) {
          categories[categoryName] = {
            name: categoryName,
            processes: []
          }
        }
        categories[categoryName].processes.push(process)
      })
      return Object.values(categories)
    })

    // 表面工艺分组
    const surfaceCategories = computed(() => {
      const categories = {}
      surfaceProcesses.value.forEach(process => {
        const categoryName = process.processCategory || '其他工艺'
        if (!categories[categoryName]) {
          categories[categoryName] = {
            name: categoryName,
            processes: []
          }
        }
        categories[categoryName].processes.push(process)
      })
      return Object.values(categories)
    })

    // 后道工艺分组
    const finishingCategories = computed(() => {
      const categories = {}
      finishingProcesses.value.forEach(process => {
        const categoryName = process.processCategory || '其他工艺'
        if (!categories[categoryName]) {
          categories[categoryName] = {
            name: categoryName,
            processes: []
          }
        }
        categories[categoryName].processes.push(process)
      })
      return Object.values(categories)
    })

    // 获取品类标签类型
    const getCategoryTagType = (categoryName) => {
      const typeMap = {
        '铜版纸': 'primary',
        '哑粉纸': 'success',
        '胶版纸': 'info',
        '珠光纸': 'warning',
        '金银卡': 'danger',
        '牛皮纸': 'info',
        '纸质不干胶': 'primary',
        'PET不干胶': 'success',
        'PVC不干胶': 'warning',
        '防伪不干胶': 'danger',
        '热敏不干胶': 'info'
      }
      return typeMap[categoryName] || 'default'
    }

    // 价格明细表格数据
    const priceDetails = computed(() => {
      const details = []
      
      if (quoteResult.materialCost > 0) {
        const material = materials.value.find(m => m.id === quoteForm.materialId)
        if (material) {
          details.push({
            item: '材料',
            specification: material.name,
            unitPrice: (material.price / 1000).toFixed(4),
            quantity: quoteForm.quantity,
            subtotal: quoteResult.materialCost.toFixed(2)
          })
        }
      }

      if (quoteResult.printingCost > 0) {
        const process = printingProcesses.value.find(p => p.id === quoteForm.printingProcess)
        const size = printingSizes.value.find(s => s.id === quoteForm.printingSize)
        const color = printingColors.value.find(c => c.id === quoteForm.printingColor)
        if (process && size && color) {
          details.push({
            item: '印刷',
            specification: `${process.name} ${size.name} ${color.name}`,
            unitPrice: (quoteResult.printingCost / quoteForm.quantity).toFixed(4),
            quantity: quoteForm.quantity,
            subtotal: quoteResult.printingCost.toFixed(2)
          })
        }
      }

      if (quoteResult.surfaceCost > 0) {
        const process = surfaceProcesses.value.find(p => p.id === quoteForm.surfaceProcess)
        if (process) {
          details.push({
            item: '表面工艺',
            specification: process.name,
            unitPrice: process.price.toFixed(4),
            quantity: quoteForm.quantity,
            subtotal: quoteResult.surfaceCost.toFixed(2)
          })
        }
      }

      if (quoteResult.finishingCost > 0) {
        const process = finishingProcesses.value.find(p => p.id === quoteForm.finishingProcess)
        if (process) {
          details.push({
            item: '后道工艺',
            specification: process.name,
            unitPrice: process.price.toFixed(4),
            quantity: quoteForm.quantity,
            subtotal: quoteResult.finishingCost.toFixed(2)
          })
        }
      }

      return details
    })

    // 印刷工艺变化处理
    const onPrintingProcessChange = () => {
      quoteForm.printingSize = null
      quoteForm.printingColor = null
      calculateQuote()
    }

    // 计算报价
    const calculateQuote = () => {
      // 重置结果
      Object.assign(quoteResult, {
        materialCost: 0,
        printingCost: 0,
        surfaceCost: 0,
        finishingCost: 0,
        total: 0
      })

      if (!quoteForm.quantity || quoteForm.quantity <= 0) return

      // 计算材料费用
      if (quoteForm.materialId) {
        const material = materials.value.find(m => m.id === quoteForm.materialId)
        if (material) {
          // 根据单位计算材料费用
          if (material.unit === '元/吨') {
            // 假设每张纸重量为克重/1000000 * 面积(平方米)
            const area = (quoteForm.width * quoteForm.height) / 1000000 // 转换为平方米
            const weight = (material.weight || 80) / 1000 // 转换为千克
            const materialWeight = area * weight * quoteForm.quantity / 1000 // 转换为吨
            quoteResult.materialCost = material.price * materialWeight
          } else if (material.unit === '元/平方米') {
            const area = (quoteForm.width * quoteForm.height) / 1000000 // 转换为平方米
            quoteResult.materialCost = material.price * area * quoteForm.quantity
          } else {
            // 默认按张计算
            quoteResult.materialCost = (material.price / 1000) * quoteForm.quantity
          }
        }
      }

      // 计算印刷费用
      if (quoteForm.printingProcess && quoteForm.printingColor) {
        const process = printingProcesses.value.find(p => p.id === quoteForm.printingProcess)
        if (process) {
          const area = (quoteForm.width * quoteForm.height) / 1000000 // 转换为平方米
          quoteResult.printingCost = process.price * area * quoteForm.quantity
        }
      }

      // 计算表面工艺费用
      if (quoteForm.surfaceProcess) {
        const process = surfaceProcesses.value.find(p => p.id === quoteForm.surfaceProcess)
        if (process) {
          if (process.unit && process.unit.includes('平方米')) {
            const area = (quoteForm.width * quoteForm.height) / 1000000
            quoteResult.surfaceCost = process.price * area * quoteForm.quantity
          } else {
            quoteResult.surfaceCost = process.price * quoteForm.quantity
          }
        }
      }

      // 计算后道工艺费用
      if (quoteForm.finishingProcess) {
        const process = finishingProcesses.value.find(p => p.id === quoteForm.finishingProcess)
        if (process) {
          quoteResult.finishingCost = process.price * quoteForm.quantity
        }
      }

      // 计算总价
      quoteResult.total = quoteResult.materialCost + quoteResult.printingCost + 
                         quoteResult.surfaceCost + quoteResult.finishingCost
    }

    // 保存报价
    const saveQuote = () => {
      if (quoteResult.total <= 0) {
        ElMessage.warning('请先完成报价计算')
        return
      }
      
      // 保存报价到localStorage
      const quoteData = {
        id: Date.now(),
        form: { ...quoteForm },
        result: { ...quoteResult },
        details: priceDetails.value,
        createTime: new Date().toLocaleString()
      }
      
      const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]')
      savedQuotes.unshift(quoteData)
      localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes.slice(0, 50))) // 只保留最近50条
      
      ElMessage.success('报价已保存')
    }

    // 导出报价单
    const exportQuote = () => {
      if (quoteResult.total <= 0) {
        ElMessage.warning('请先完成报价计算')
        return
      }
      ElMessage.success('报价单导出功能开发中...')
    }

    // 重置表单
    const resetForm = () => {
      Object.assign(quoteForm, {
        width: null,
        height: null,
        quantity: null,
        materialId: null,
        printingProcess: null,
        printingSize: null,
        printingColor: null,
        surfaceProcess: null,
        finishingProcess: null
      })
      
      Object.assign(quoteResult, {
        materialCost: 0,
        printingCost: 0,
        surfaceCost: 0,
        finishingCost: 0,
        total: 0
      })
    }

    // 从localStorage加载数据
    const loadDataFromStorage = () => {
      // 加载材料数据（合并所有分类）
      const paperMaterials = JSON.parse(localStorage.getItem('materials_paper') || '[]')
      const specialtyMaterials = JSON.parse(localStorage.getItem('materials_specialty-paper') || '[]')
      const adhesiveMaterials = JSON.parse(localStorage.getItem('materials_adhesive') || '[]')
      
      // 如果localStorage中没有数据，使用默认数据
      if (paperMaterials.length === 0 && specialtyMaterials.length === 0 && adhesiveMaterials.length === 0) {
        materials.value = mockMaterials.materials.map(material => ({
          ...material,
          displayName: `${material.name} (${material.materialCategory})`
        }))
      } else {
        materials.value = [...paperMaterials, ...specialtyMaterials, ...adhesiveMaterials].map(material => ({
          ...material,
          displayName: `${material.name} (${material.materialCategory})`
        }))
      }

      // 加载印刷工艺数据
      const printingData = JSON.parse(localStorage.getItem('processes_printing') || '[]')
      if (printingData.length === 0) {
        printingProcesses.value = mockProcesses.processDetails
          .filter(p => p.category === 'printing')
          .map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: parseFloat(p.price) || 1.0,
            unit: p.unit,
            processCategory: p.processCategory
          }))
      } else {
        printingProcesses.value = printingData.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || p.requirements,
          price: parseFloat(p.price) || 1.0,
          unit: p.unit,
          processCategory: p.processCategory
        }))
      }

      // 加载表面工艺数据
      const surfaceData = JSON.parse(localStorage.getItem('processes_surface') || '[]')
      if (surfaceData.length === 0) {
        surfaceProcesses.value = mockProcesses.processDetails
          .filter(p => p.category === 'surface')
          .map(p => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price) || 1.0,
            unit: p.unit,
            processCategory: p.processCategory
          }))
      } else {
        surfaceProcesses.value = surfaceData.map(p => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price) || 1.0,
          unit: p.unit,
          processCategory: p.processCategory
        }))
      }

      // 加载后道工艺数据
      const finishingData = JSON.parse(localStorage.getItem('processes_finishing') || '[]')
      if (finishingData.length === 0) {
        finishingProcesses.value = mockProcesses.processDetails
          .filter(p => p.category === 'finishing')
          .map(p => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price) || 0.1,
            unit: p.unit,
            processCategory: p.processCategory
          }))
      } else {
        finishingProcesses.value = finishingData.map(p => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price) || 0.1,
          unit: p.unit,
          processCategory: p.processCategory
        }))
      }

      // 印刷规格数据
      printingSizes.value = [
        { id: 1, categoryId: 1, name: '全开', specification: '1194×889mm' },
        { id: 2, categoryId: 1, name: '对开', specification: '597×889mm' },
        { id: 3, categoryId: 1, name: '四开', specification: '597×444mm' },
        { id: 4, categoryId: 1, name: '八开', specification: '297×444mm' },
        { id: 5, categoryId: 1, name: '十六开', specification: '297×222mm' }
      ]
    }

    // 初始化数据
    onMounted(() => {
      loadDataFromStorage()
    })

    return {
      quoteForm,
      quoteResult,
      materials,
      printingProcesses,
      surfaceProcesses,
      finishingProcesses,
      printingColors,
      availableSizes,
      priceDetails,
      materialCategories,
      printingCategories,
      surfaceCategories,
      finishingCategories,
      getCategoryTagType,
      onPrintingProcessChange,
      calculateQuote,
      saveQuote,
      exportQuote,
      resetForm
    }
  }
}
</script>

<style scoped>
.home-page {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  color: white;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.title-icon {
  font-size: 40px;
}

.page-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
}

.input-card,
.result-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

/* 尺寸输入组 */
.size-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.size-input {
  flex: 1;
}

.size-separator {
  font-size: 18px;
  font-weight: 600;
  color: #666;
}

.size-unit,
.quantity-unit {
  color: #666;
  font-size: 14px;
  margin-left: 8px;
}

/* 产品预览 */
.product-preview {
  margin-bottom: 24px;
}

.preview-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 12px;
}

.product-shape {
  border: 2px dashed #409eff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(64, 158, 255, 0.1);
  position: relative;
}

.size-label {
  font-size: 12px;
  color: #409eff;
  font-weight: 600;
}

/* 价格明细 */
.price-breakdown {
  margin-top: 24px;
}

.price-breakdown h3 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 18px;
}

.price-text {
  color: #e74c3c;
  font-weight: 600;
}

/* 总价显示 */
.total-price {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.price-row.total {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.price-row.unit {
  font-size: 14px;
  color: #666;
  margin-bottom: 0;
}

.total-amount {
  color: #e74c3c;
  font-size: 24px;
}

/* 操作按钮 */
.action-buttons {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content .el-col {
    margin-bottom: 24px;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .size-input-group {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
