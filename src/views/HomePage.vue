<template>
  <div class="home-page">
    <div class="page-header">
      <h1>包装印刷算价</h1>
      <p>填写基本信息，系统将自动计算印刷成本</p>
    </div>

    <el-row :gutter="20">
      <!-- 左侧表单区域 -->
      <el-col :span="16">
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <el-icon><Edit /></el-icon>
              <span>基本信息</span>
            </div>
          </template>

          <el-form
            ref="calculatorFormRef"
            :model="formData"
            :rules="formRules"
            label-width="120px"
            class="calculator-form"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="产品名称" prop="productName">
                  <el-input
                    v-model="formData.productName"
                    placeholder="请输入产品名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户名称" prop="customerName">
                  <el-input
                    v-model="formData.customerName"
                    placeholder="请输入客户名称"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="长度(mm)" prop="length">
                  <el-input-number
                    v-model="formData.length"
                    :min="1"
                    :max="10000"
                    placeholder="长度"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="宽度(mm)" prop="width">
                  <el-input-number
                    v-model="formData.width"
                    :min="1"
                    :max="10000"
                    placeholder="宽度"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="数量(张)" prop="quantity">
                  <el-input-number
                    v-model="formData.quantity"
                    :min="1"
                    :max="1000000"
                    placeholder="数量"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="材料类型" prop="materialType">
                  <el-select
                    v-model="formData.materialType"
                    placeholder="请选择材料类型"
                    style="width: 100%"
                    @change="onMaterialChange"
                  >
                    <el-option
                      v-for="material in materialOptions"
                      :key="material.id"
                      :label="material.name"
                      :value="material.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="材料规格" prop="materialSpec">
                  <el-select
                    v-model="formData.materialSpec"
                    placeholder="请选择材料规格"
                    style="width: 100%"
                    :disabled="!formData.materialType"
                  >
                    <el-option
                      v-for="spec in materialSpecs"
                      :key="spec.id"
                      :label="spec.name"
                      :value="spec.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="印刷工艺" prop="printProcess">
                  <el-select
                    v-model="formData.printProcess"
                    placeholder="请选择印刷工艺"
                    style="width: 100%"
                    multiple
                  >
                    <el-option
                      v-for="process in processOptions"
                      :key="process.id"
                      :label="process.name"
                      :value="process.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="印刷颜色" prop="printColors">
                  <el-select
                    v-model="formData.printColors"
                    placeholder="请选择印刷颜色"
                    style="width: 100%"
                  >
                    <el-option label="单色" value="1" />
                    <el-option label="双色" value="2" />
                    <el-option label="四色" value="4" />
                    <el-option label="专色" value="spot" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="备注信息">
              <el-input
                v-model="formData.remarks"
                type="textarea"
                :rows="3"
                placeholder="请输入备注信息"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="calculatePrice" :loading="calculating">
                <el-icon><Calculator /></el-icon>
                计算价格
              </el-button>
              <el-button @click="resetForm">
                <el-icon><Refresh /></el-icon>
                重置表单
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧结果区域 -->
      <el-col :span="8">
        <el-card class="result-card">
          <template #header>
            <div class="card-header">
              <el-icon><Money /></el-icon>
              <span>报价结果</span>
            </div>
          </template>

          <div class="price-result" v-if="priceResult">
            <div class="total-price">
              <span class="label">总价：</span>
              <span class="price">¥{{ priceResult.totalPrice }}</span>
            </div>
            
            <el-divider />
            
            <div class="price-breakdown">
              <h4>价格明细</h4>
              <div class="breakdown-item">
                <span>材料费用：</span>
                <span>¥{{ priceResult.materialCost }}</span>
              </div>
              <div class="breakdown-item">
                <span>印刷费用：</span>
                <span>¥{{ priceResult.printCost }}</span>
              </div>
              <div class="breakdown-item">
                <span>工艺费用：</span>
                <span>¥{{ priceResult.processCost }}</span>
              </div>
              <div class="breakdown-item">
                <span>人工费用：</span>
                <span>¥{{ priceResult.laborCost }}</span>
              </div>
            </div>

            <el-divider />

            <div class="unit-price">
              <span class="label">单价：</span>
              <span class="price">¥{{ priceResult.unitPrice }}</span>
            </div>

            <div class="price-chart" ref="chartRef" v-if="priceResult"></div>

            <el-button type="success" class="export-btn" @click="exportQuote">
              <el-icon><Download /></el-icon>
              导出报价单
            </el-button>
          </div>

          <div class="no-result" v-else>
            <el-empty description="请填写信息并计算价格" />
          </div>
        </el-card>

        <!-- 历史报价记录 -->
        <el-card class="history-card" v-if="quoteHistory.length > 0">
          <template #header>
            <div class="card-header">
              <el-icon><List /></el-icon>
              <span>历史报价</span>
            </div>
          </template>

          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in quoteHistory"
              :key="index"
              :timestamp="item.timestamp"
              :type="index === 0 ? 'primary' : ''"
            >
              <div class="history-item">
                <div class="history-title">
                  <span>{{ item.productName }}</span>
                  <span class="history-price">¥{{ item.totalPrice }}</span>
                </div>
                <div class="history-detail">
                  <span>{{ item.length }}×{{ item.width }}mm</span>
                  <span>{{ item.quantity }}张</span>
                </div>
                <div class="history-actions">
                  <el-button type="text" size="small" @click="loadHistoryQuote(item)">
                    加载此报价
                  </el-button>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockMaterials, mockProcesses, mockApi } from '../api/mockData'

export default {
  name: 'HomePage',
  setup() {
    const calculatorFormRef = ref(null)
    const chartRef = ref(null)
    
    // 响应式数据
    const calculating = ref(false)
    const materialOptions = ref([])
    const materialSpecs = ref([])
    const processOptions = ref([])
    const priceResult = ref(null)
    const quoteHistory = ref([])
    
    const formData = reactive({
      productName: '',
      customerName: '',
      length: null,
      width: null,
      quantity: null,
      materialType: '',
      materialSpec: '',
      printProcess: [],
      printColors: '',
      remarks: ''
    })
    
    const formRules = {
      productName: [
        { required: true, message: '请输入产品名称', trigger: 'blur' }
      ],
      length: [
        { required: true, message: '请输入长度', trigger: 'blur' }
      ],
      width: [
        { required: true, message: '请输入宽度', trigger: 'blur' }
      ],
      quantity: [
        { required: true, message: '请输入数量', trigger: 'blur' }
      ],
      materialType: [
        { required: true, message: '请选择材料类型', trigger: 'change' }
      ],
      materialSpec: [
        { required: true, message: '请选择材料规格', trigger: 'change' }
      ],
      printProcess: [
        { required: true, message: '请选择印刷工艺', trigger: 'change' }
      ],
      printColors: [
        { required: true, message: '请选择印刷颜色', trigger: 'change' }
      ]
    }
    
    // 方法
    const loadMockData = () => {
      materialOptions.value = mockMaterials.categories
      processOptions.value = mockProcesses.processes
    }
    
    const loadFormData = () => {
      const savedData = localStorage.getItem('printingCalculatorForm')
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          Object.assign(formData, parsedData)
          // 如果有材料类型，加载对应规格
          if (formData.materialType) {
            onMaterialChange(formData.materialType)
          }
        } catch (error) {
          console.error('加载表单数据失败:', error)
        }
      }
      
      // 加载保存的报价结果
      const savedResult = localStorage.getItem('printingCalculatorResult')
      if (savedResult) {
        try {
          priceResult.value = JSON.parse(savedResult)
        } catch (error) {
          console.error('加载报价结果失败:', error)
        }
      }
      
      // 加载历史报价记录
      const savedHistory = localStorage.getItem('printingCalculatorHistory')
      if (savedHistory) {
        try {
          quoteHistory.value = JSON.parse(savedHistory)
        } catch (error) {
          console.error('加载历史报价失败:', error)
        }
      }
    }
    
    const saveFormData = (data) => {
      try {
        localStorage.setItem('printingCalculatorForm', JSON.stringify(data))
      } catch (error) {
        console.error('保存表单数据失败:', error)
      }
    }
    
    const onMaterialChange = (materialId) => {
      const material = materialOptions.value.find(m => m.id === materialId)
      materialSpecs.value = material ? material.specifications : []
      formData.materialSpec = ''
    }
    
    const calculatePrice = async () => {
      if (!calculatorFormRef.value) return
      
      try {
        await calculatorFormRef.value.validate()
        calculating.value = true
        
        // 使用模拟API计算价格
        mockApi.calculatePrice(formData).then(response => {
          if (response.code === 200) {
            priceResult.value = response.data
            
            // 保存报价结果
            localStorage.setItem('printingCalculatorResult', JSON.stringify(priceResult.value))
            
            // 添加到历史记录
            const historyItem = {
              productName: formData.productName,
              customerName: formData.customerName,
              length: formData.length,
              width: formData.width,
              quantity: formData.quantity,
              totalPrice: priceResult.value.totalPrice,
              timestamp: new Date().toLocaleString()
            }
            
            // 将新记录添加到历史记录的开头
            quoteHistory.value.unshift(historyItem)
            
            // 限制历史记录数量为10条
            if (quoteHistory.value.length > 10) {
              quoteHistory.value = quoteHistory.value.slice(0, 10)
            }
            
            // 保存历史记录
            localStorage.setItem('printingCalculatorHistory', JSON.stringify(quoteHistory.value))
            
            // 渲染价格分布图表
            nextTick(() => {
              renderPriceChart()
            })
            
            ElMessage.success('价格计算完成')
          } else {
            ElMessage.error('计算失败，请重试')
          }
          calculating.value = false
        }).catch(error => {
          ElMessage.error('计算过程中发生错误')
          calculating.value = false
        })
      } catch (error) {
        ElMessage.error('请完善必填信息')
      }
    }
    
    const renderPriceChart = () => {
      if (!chartRef.value || !priceResult.value) return
      
      // 这里可以使用echarts等图表库渲染价格分布图
      // 由于没有引入图表库，这里只是一个占位函数
      console.log('渲染价格分布图表')
    }
    
    const resetForm = () => {
      if (calculatorFormRef.value) {
        calculatorFormRef.value.resetFields()
      }
      
      Object.assign(formData, {
        productName: '',
        customerName: '',
        length: null,
        width: null,
        quantity: null,
        materialType: '',
        materialSpec: '',
        printProcess: [],
        printColors: '',
        remarks: ''
      })
      
      priceResult.value = null
      materialSpecs.value = []
      
      // 清除保存的数据
      localStorage.removeItem('printingCalculatorForm')
      localStorage.removeItem('printingCalculatorResult')
    }
    
    const exportQuote = () => {
      if (!priceResult.value) {
        ElMessage.warning('请先计算价格')
        return
      }
      
      ElMessage.success('报价单导出功能开发中...')
    }
    
    const loadHistoryQuote = (item) => {
      ElMessageBox.confirm('确定要加载此历史报价吗？当前未保存的数据将被覆盖。', '加载历史报价', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 根据历史记录中的基本信息恢复表单
        Object.assign(formData, {
          productName: item.productName,
          customerName: item.customerName,
          length: item.length,
          width: item.width,
          quantity: item.quantity
        })
        
        ElMessage.success('历史报价已加载')
      }).catch(() => {
        ElMessage.info('已取消加载')
      })
    }
    
    // 监听表单数据变化，自动保存
    watch(formData, (newVal) => {
      saveFormData(newVal)
    }, { deep: true })
    
    // 生命周期
    onMounted(() => {
      loadMockData()
      loadFormData()
    })
    
    return {
      calculatorFormRef,
      chartRef,
      calculating,
      materialOptions,
      materialSpecs,
      processOptions,
      priceResult,
      quoteHistory,
      formData,
      formRules,
      
      // 方法
      loadMockData,
      loadFormData,
      onMaterialChange,
      calculatePrice,
      resetForm,
      exportQuote,
      loadHistoryQuote
    }
  }
}
</script>

<style scoped>
.home-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
  text-align: center;
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

.form-card, .result-card, .history-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.card-header .el-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #409eff;
}

.calculator-form {
  padding: 20px 0;
}

.price-result {
  text-align: center;
  padding: 20px 0;
}

.total-price {
  margin-bottom: 20px;
}

.total-price .label {
  font-size: 18px;
  color: #606266;
}

.total-price .price {
  font-size: 32px;
  font-weight: bold;
  color: #e6a23c;
  margin-left: 10px;
}

.price-breakdown {
  text-align: left;
  margin: 20px 0;
}

.price-breakdown h4 {
  margin-bottom: 15px;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}

.unit-price {
  margin: 20px 0;
}

.unit-price .label {
  font-size: 16px;
  color: #606266;
}

.unit-price .price {
  font-size: 24px;
  font-weight: bold;
  color: #67c23a;
  margin-left: 10px;
}

.price-chart {
  height: 200px;
  margin: 20px 0;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.export-btn {
  width: 100%;
  margin-top: 20px;
}

.no-result {
  padding: 40px 0;
}

.history-card {
  margin-top: 20px;
}

.history-item {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
}

.history-title {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 5px;
}

.history-price {
  color: #e6a23c;
}

.history-detail {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 12px;
  margin-bottom: 5px;
}

.history-actions {
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-page {
    padding: 10px;
  }
  
  .el-row {
    flex-direction: column;
  }
  
  .el-col {
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }
}

/* 表单样式优化 */
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

:deep(.el-button) {
  border-radius: 6px;
}
</style>