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
                @change="calculateQuote"
              >
                <el-option
                  v-for="material in materials"
                  :key="material.id"
                  :label="`${material.name} - ¥${material.standardPrice}/张`"
                  :value="material.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 印刷工艺选择 -->
            <el-form-item label="印刷工艺">
              <el-select
                v-model="quoteForm.printingProcess"
                placeholder="请选择印刷工艺"
                style="width: 100%"
                @change="onPrintingProcessChange"
              >
                <el-option
                  v-for="process in printingProcesses"
                  :key="process.id"
                  :label="process.name"
                  :value="process.id"
                >
                </el-option>
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
                clearable
                @change="calculateQuote"
              >
                <el-option
                  v-for="process in surfaceProcesses"
                  :key="process.id"
                  :label="`${process.name} - ¥${process.price}/张`"
                  :value="process.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 后道工艺选择 -->
            <el-form-item label="后道工艺">
              <el-select
                v-model="quoteForm.finishingProcess"
                placeholder="请选择后道工艺（可选）"
                style="width: 100%"
                clearable
                @change="calculateQuote"
              >
                <el-option
                  v-for="process in finishingProcesses"
                  :key="process.id"
                  :label="`${process.name} - ¥${process.price}/张`"
                  :value="process.id"
                >
                </el-option>
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

    // 价格明细表格数据
    const priceDetails = computed(() => {
      const details = []
      
      if (quoteResult.materialCost > 0) {
        const material = materials.value.find(m => m.id === quoteForm.materialId)
        if (material) {
          details.push({
            item: '材料',
            specification: material.name,
            unitPrice: material.standardPrice.toFixed(2),
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
            unitPrice: process.price.toFixed(2),
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
            unitPrice: process.price.toFixed(2),
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
          quoteResult.materialCost = material.standardPrice * quoteForm.quantity
        }
      }

      // 计算印刷费用
      if (quoteForm.printingProcess && quoteForm.printingSize && quoteForm.printingColor) {
        const printingPrice = calculatePrintingPrice()
        quoteResult.printingCost = printingPrice * quoteForm.quantity / 1000 // 转换为实际数量
      }

      // 计算表面工艺费用
      if (quoteForm.surfaceProcess) {
        const process = surfaceProcesses.value.find(p => p.id === quoteForm.surfaceProcess)
        if (process) {
          quoteResult.surfaceCost = process.price * quoteForm.quantity
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

    // 计算印刷价格（基于之前的价格逻辑）
    const calculatePrintingPrice = () => {
      const colorName = printingColors.value.find(c => c.id === quoteForm.printingColor)?.name
      const quantity = quoteForm.quantity

      // 基础价格
      const basePrices = {
        '单色': 260,
        '双色': 380,
        '四色': 520,
        '六色': 680
      }

      const basePrice = basePrices[colorName] || 260
      const incrementPer1000 = 30
      const pricePerSheetAfter10000 = 0.04

      if (quantity <= 1200) {
        return basePrice
      } else if (quantity >= 10000) {
        return Math.round(pricePerSheetAfter10000 * 1000 * (basePrices[colorName] / 260))
      } else {
        const rangeIndex = Math.floor((quantity - 1200) / 1000)
        return basePrice + rangeIndex * incrementPer1000
      }
    }

    // 保存报价
    const saveQuote = () => {
      if (quoteResult.total <= 0) {
        ElMessage.warning('请先完成报价计算')
        return
      }
      ElMessage.success('报价已保存')
    }

    // 导出报价单
    const exportQuote = () => {
      if (quoteResult.total <= 0) {
        ElMessage.warning('请先完成报价计算')
        return
      }
      ElMessage.success('报价单导出成功')
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

    // 初始化数据
    onMounted(() => {
      materials.value = mockMaterials.materials
      printingProcesses.value = [
        { id: 1, name: '胶印', description: '平版胶印，适用于大批量印刷' },
        { id: 2, name: '丝网印刷', description: '丝网印刷，适用于特殊材料' },
        { id: 3, name: 'UV印刷', description: 'UV固化印刷，色彩鲜艳' }
      ]
      printingSizes.value = [
        { id: 1, categoryId: 1, name: '全开', specification: '1194×889mm' },
        { id: 2, categoryId: 1, name: '对开', specification: '597×889mm' },
        { id: 3, categoryId: 1, name: '四开', specification: '597×444mm' },
        { id: 4, categoryId: 2, name: '小幅面', specification: '400×300mm' },
        { id: 5, categoryId: 3, name: 'UV全开', specification: '1194×889mm' }
      ]
      surfaceProcesses.value = mockProcesses.processDetails.filter(p => p.category === 'surface').map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price) || 1.0
      }))
      finishingProcesses.value = mockProcesses.processDetails.filter(p => p.category === 'finishing').map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price) || 0.1
      }))
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