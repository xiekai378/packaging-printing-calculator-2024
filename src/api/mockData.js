// 模拟材料数据
export const mockMaterials = {
  categories: [
    {
      id: 'paper',
      name: '纸张类',
      specifications: [
        { id: 'paper_coated_128', name: '128g铜版纸' },
        { id: 'paper_coated_157', name: '157g铜版纸' },
        { id: 'paper_coated_200', name: '200g铜版纸' },
        { id: 'paper_coated_250', name: '250g铜版纸' },
        { id: 'paper_art_105', name: '105g哑粉纸' },
        { id: 'paper_art_128', name: '128g哑粉纸' }
      ]
    },
    {
      id: 'plastic',
      name: '塑料类',
      specifications: [
        { id: 'plastic_pet_12', name: '12μ PET薄膜' },
        { id: 'plastic_pet_25', name: '25μ PET薄膜' },
        { id: 'plastic_bopp_20', name: '20μ BOPP薄膜' },
        { id: 'plastic_cpp_25', name: '25μ CPP薄膜' }
      ]
    },
    {
      id: 'metal',
      name: '金属类',
      specifications: [
        { id: 'metal_aluminum_9', name: '9μ铝箔' },
        { id: 'metal_aluminum_12', name: '12μ铝箔' }
      ]
    }
  ],
  materials: [
    // 纸类数据
    {
      id: 1,
      name: '120克铜版纸',
      category: 'paper',
      price: 6400,
      unit: '元/吨',
      weight: 120,
      thickness: 14,
      standardPrice: 0.66,
      largePrice: 0.82,
      supplier: '金东纸业',
      remarks: '高品质铜版纸，适用于彩色印刷',
      materialCategory: '书写纸',
      status: 'active',
      updateTime: '2023-09-23 19:09:05'
    },
    {
      id: 2,
      name: '100克铜版纸',
      category: 'paper',
      price: 6400,
      unit: '元/吨',
      weight: 100,
      thickness: 12,
      standardPrice: 0.55,
      largePrice: 0.68,
      supplier: '金东纸业',
      remarks: '标准铜版纸',
      materialCategory: '书写纸',
      status: 'active',
      updateTime: '2023-09-23 19:09:06'
    },
    {
      id: 3,
      name: '80克铜版纸',
      category: 'paper',
      price: 6400,
      unit: '元/吨',
      weight: 80,
      thickness: 9,
      standardPrice: 0.44,
      largePrice: 0.54,
      supplier: '金东纸业',
      remarks: '轻量铜版纸',
      materialCategory: '书写纸',
      status: 'active',
      updateTime: '2023-09-23 19:09:07'
    },
    {
      id: 4,
      name: '350克双胶纸',
      category: 'paper',
      price: 7100,
      unit: '元/吨',
      weight: 350,
      thickness: 41,
      standardPrice: 2.14,
      largePrice: 2.64,
      supplier: '双胶纸厂',
      remarks: '厚重双胶纸',
      materialCategory: '双胶纸',
      status: 'active',
      updateTime: '2023-12-29 16:27:38'
    },

    // 特种纸数据
    {
      id: 5,
      name: '64克珠光纸',
      category: 'specialty-paper',
      price: 8000,
      unit: '元/吨',
      weight: 64,
      thickness: 0,
      size1: 500,
      size2: 660,
      supplier: '华丽纸业',
      remarks: '珠光效果特种纸，适用于高档包装',
      materialCategory: '特种纸',
      status: 'active',
      updateTime: '2023-12-02 14:22:37'
    },
    {
      id: 6,
      name: '30克珠光纸',
      category: 'specialty-paper',
      price: 18500,
      unit: '元/吨',
      weight: 30,
      thickness: 0,
      size1: null,
      size2: null,
      supplier: '华丽纸业',
      remarks: '轻量珠光纸',
      materialCategory: '特种纸',
      status: 'active',
      updateTime: '2023-12-02 14:19:38'
    },
    {
      id: 7,
      name: '17克珠光纸',
      category: 'specialty-paper',
      price: 12250,
      unit: '元/吨',
      weight: 17,
      thickness: 0,
      size1: 500,
      size2: 660,
      supplier: '华丽纸业',
      remarks: '超轻珠光纸',
      materialCategory: '特种纸',
      status: 'active',
      updateTime: '2023-12-02 14:20:36'
    },

    // 不干胶数据
    {
      id: 8,
      name: '亮面7丝PET标签纸',
      category: 'adhesive',
      price: 3.8,
      unit: '元/平方',
      weight: 0,
      supplier: '艾利丹尼森',
      remarks: '透明PET不干胶标签',
      materialCategory: 'PVC不干胶',
      status: 'active',
      updateTime: '2023-12-14 16:49:15'
    },
    {
      id: 9,
      name: 'PVC面纸+铜版纸底纸',
      category: 'adhesive',
      price: 5.25,
      unit: '元/平方',
      weight: 0,
      supplier: '艾利丹尼森',
      remarks: 'PVC面纸+铜版纸底纸',
      materialCategory: 'PVC不干胶',
      status: 'active',
      updateTime: '2023-12-14 16:49:41'
    },
    {
      id: 10,
      name: '乳白PVC透明底',
      category: 'adhesive',
      price: 3.5,
      unit: '元/平方',
      weight: 0,
      supplier: '艾利丹尼森',
      remarks: '乳白PVC透明底材',
      materialCategory: 'PVC不干胶',
      status: 'active',
      updateTime: '2023-12-14 16:49:32'
    },
    {
      id: 11,
      name: '亮面双透明不干胶',
      category: 'adhesive',
      price: 4.75,
      unit: '元/平方',
      weight: 0,
      supplier: '艾利丹尼森',
      remarks: '双面透明不干胶',
      materialCategory: 'PVC不干胶',
      status: 'active',
      updateTime: '2023-12-14 16:49:21'
    }
  ]
}

// 模拟工艺数据
export const mockProcesses = {
  processes: [
    { id: 'offset_printing', name: '胶印' },
    { id: 'flexo_printing', name: '柔印' },
    { id: 'gravure_printing', name: '凹印' },
    { id: 'digital_printing', name: '数码印刷' },
    { id: 'hot_stamping', name: '烫金' },
    { id: 'embossing', name: '压凹凸' },
    { id: 'uv_coating', name: 'UV上光' },
    { id: 'lamination', name: '覆膜' },
    { id: 'die_cutting', name: '模切' },
    { id: 'folding', name: '折页' }
  ],
  processDetails: [
    {
      id: 1,
      name: '胶印',
      category: 'printing',
      description: '平版胶印，适用于大批量彩色印刷',
      priceType: 'coefficient',
      price: 1.2,
      unit: 'sqm',
      difficulty: 2,
      requirements: '需要专业胶印机，适合大批量生产',
      status: 'active',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      name: '柔印',
      category: 'printing',
      description: '柔性版印刷，适用于包装材料印刷',
      priceType: 'coefficient',
      price: 1.5,
      unit: 'sqm',
      difficulty: 3,
      requirements: '适合薄膜、纸张等柔性材料',
      status: 'active',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 3,
      name: '凹印',
      category: 'printing',
      description: '凹版印刷，印刷质量高，适合高档包装',
      priceType: 'coefficient',
      price: 2.0,
      unit: 'sqm',
      difficulty: 4,
      requirements: '制版成本高，适合大批量生产',
      status: 'active',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 4,
      name: '数码印刷',
      category: 'printing',
      description: '数字印刷，适合小批量个性化印刷',
      priceType: 'fixed',
      price: 0.8,
      unit: 'sheet',
      difficulty: 1,
      requirements: '无需制版，起印量小',
      status: 'active',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 5,
      name: '烫金',
      category: 'finishing',
      description: '热转印烫金工艺，提升产品档次',
      priceType: 'fixed',
      price: 0.15,
      unit: 'sheet',
      difficulty: 3,
      requirements: '需要制作烫金版，适合局部装饰',
      status: 'active',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 6,
      name: '压凹凸',
      category: 'finishing',
      description: '压印凹凸效果，增加触感',
      priceType: 'fixed',
      price: 0.12,
      unit: 'sheet',
      difficulty: 2,
      requirements: '需要制作凹凸版，适合纸张类材料',
      status: 'active',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 7,
      name: 'UV上光',
      category: 'surface',
      description: 'UV光油上光，增加光泽度和保护性',
      priceType: 'coefficient',
      price: 1.3,
      unit: 'sqm',
      difficulty: 2,
      requirements: '需要UV固化设备',
      status: 'active',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 8,
      name: '覆膜',
      category: 'surface',
      description: '表面覆膜处理，提高耐磨性',
      priceType: 'coefficient',
      price: 1.8,
      unit: 'sqm',
      difficulty: 2,
      requirements: '分亮膜和哑膜，需要覆膜机',
      status: 'active',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 9,
      name: '模切',
      category: 'finishing',
      description: '按指定形状切割，制作异形包装',
      priceType: 'fixed',
      price: 0.08,
      unit: 'sheet',
      difficulty: 3,
      requirements: '需要制作模切刀版',
      status: 'active',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 10,
      name: '折页',
      category: 'binding',
      description: '按要求折叠页面',
      priceType: 'fixed',
      price: 0.05,
      unit: 'sheet',
      difficulty: 1,
      requirements: '可手工或机器折页',
      status: 'active',
      updateTime: '2024-01-15 10:30:00'
    }
  ]
}

// API接口模拟
export const mockApi = {
  // 获取材料列表
  getMaterials: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let materials = [...mockMaterials.materials]
        
        // 模拟搜索过滤
        if (params.keyword) {
          materials = materials.filter(item =>
            item.name.toLowerCase().includes(params.keyword.toLowerCase())
          )
        }
        
        if (params.category) {
          materials = materials.filter(item => item.category === params.category)
        }
        
        resolve({
          code: 200,
          data: materials,
          total: materials.length
        })
      }, 300)
    })
  },
  
  // 获取工艺列表
  getProcesses: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let processes = [...mockProcesses.processDetails]
        
        // 模拟搜索过滤
        if (params.keyword) {
          processes = processes.filter(item =>
            item.name.toLowerCase().includes(params.keyword.toLowerCase())
          )
        }
        
        if (params.category) {
          processes = processes.filter(item => item.category === params.category)
        }
        
        resolve({
          code: 200,
          data: processes,
          total: processes.length
        })
      }, 300)
    })
  },
  
  // 计算价格
  calculatePrice: (formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟价格计算
        const area = (formData.length * formData.width) / 1000000 // 转换为平方米
        const quantity = formData.quantity
        
        const materialCost = area * quantity * 2.5
        const printCost = area * quantity * 1.8
        const processCost = (formData.printProcess?.length || 0) * quantity * 0.3
        const laborCost = quantity * 0.1
        
        const totalPrice = materialCost + printCost + processCost + laborCost
        const unitPrice = totalPrice / quantity
        
        resolve({
          code: 200,
          data: {
            totalPrice: totalPrice.toFixed(2),
            materialCost: materialCost.toFixed(2),
            printCost: printCost.toFixed(2),
            processCost: processCost.toFixed(2),
            laborCost: laborCost.toFixed(2),
            unitPrice: unitPrice.toFixed(2),
            area: area.toFixed(4),
            quantity: quantity
          }
        })
      }, 1000)
    })
  }
}