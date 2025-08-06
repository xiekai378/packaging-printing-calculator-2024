// 模拟材料数据
export const mockMaterials = {
  categories: [
    {
      id: 'paper',
      name: '纸张类',
      specifications: [
        { id: 'paper_coated_80', name: '80g铜版纸' },
        { id: 'paper_coated_105', name: '105g铜版纸' },
        { id: 'paper_coated_128', name: '128g铜版纸' },
        { id: 'paper_coated_157', name: '157g铜版纸' },
        { id: 'paper_coated_200', name: '200g铜版纸' },
        { id: 'paper_coated_250', name: '250g铜版纸' },
        { id: 'paper_coated_300', name: '300g铜版纸' },
        { id: 'paper_art_105', name: '105g哑粉纸' },
        { id: 'paper_art_128', name: '128g哑粉纸' },
        { id: 'paper_art_157', name: '157g哑粉纸' },
        { id: 'paper_offset_70', name: '70g胶版纸' },
        { id: 'paper_offset_80', name: '80g胶版纸' }
      ]
    }
  ],
  materials: [
    // 纸类数据 - 铜版纸系列
    {
      id: 1,
      name: '80g铜版纸',
      category: 'paper',
      price: 6200,
      unit: '元/吨',
      weight: 80,
      thickness: 9,
      standardPrice: 0.44,
      largePrice: 0.54,
      supplier: '金东纸业',
      remarks: '轻量铜版纸，适用于书刊印刷',
      materialCategory: '铜版纸',
      status: 'active',
      updateTime: '2024-01-15 09:15:00'
    },
    {
      id: 2,
      name: '105g铜版纸',
      category: 'paper',
      price: 6300,
      unit: '元/吨',
      weight: 105,
      thickness: 12,
      standardPrice: 0.58,
      largePrice: 0.72,
      supplier: '金东纸业',
      remarks: '标准铜版纸，印刷效果佳',
      materialCategory: '铜版纸',
      status: 'active',
      updateTime: '2024-01-15 09:16:00'
    },
    {
      id: 3,
      name: '128g铜版纸',
      category: 'paper',
      price: 6400,
      unit: '元/吨',
      weight: 128,
      thickness: 14,
      standardPrice: 0.71,
      largePrice: 0.88,
      supplier: '金东纸业',
      remarks: '高品质铜版纸，适用于彩色印刷',
      materialCategory: '铜版纸',
      status: 'active',
      updateTime: '2024-01-15 09:17:00'
    },
    {
      id: 4,
      name: '157g铜版纸',
      category: 'paper',
      price: 6500,
      unit: '元/吨',
      weight: 157,
      thickness: 17,
      standardPrice: 0.87,
      largePrice: 1.08,
      supplier: '金东纸业',
      remarks: '厚重铜版纸，适用于画册印刷',
      materialCategory: '铜版纸',
      status: 'active',
      updateTime: '2024-01-15 09:18:00'
    },
    {
      id: 5,
      name: '200g铜版纸',
      category: 'paper',
      price: 6600,
      unit: '元/吨',
      weight: 200,
      thickness: 22,
      standardPrice: 1.10,
      largePrice: 1.36,
      supplier: '金东纸业',
      remarks: '厚重铜版纸，适用于封面印刷',
      materialCategory: '铜版纸',
      status: 'active',
      updateTime: '2024-01-15 09:19:00'
    },
    {
      id: 6,
      name: '250g铜版纸',
      category: 'paper',
      price: 6700,
      unit: '元/吨',
      weight: 250,
      thickness: 28,
      standardPrice: 1.38,
      largePrice: 1.71,
      supplier: '金东纸业',
      remarks: '超厚铜版纸，适用于高档包装',
      materialCategory: '铜版纸',
      status: 'active',
      updateTime: '2024-01-15 09:20:00'
    },
    {
      id: 7,
      name: '300g铜版纸',
      category: 'paper',
      price: 6800,
      unit: '元/吨',
      weight: 300,
      thickness: 33,
      standardPrice: 1.65,
      largePrice: 2.04,
      supplier: '金东纸业',
      remarks: '最厚铜版纸，适用于名片、卡片',
      materialCategory: '铜版纸',
      status: 'active',
      updateTime: '2024-01-15 09:21:00'
    },

    // 哑粉纸系列
    {
      id: 8,
      name: '105g哑粉纸',
      category: 'paper',
      price: 6400,
      unit: '元/吨',
      weight: 105,
      thickness: 12,
      standardPrice: 0.59,
      largePrice: 0.73,
      supplier: '华泰纸业',
      remarks: '哑光效果，无反光，适用于文字较多的印刷品',
      materialCategory: '哑粉纸',
      status: 'active',
      updateTime: '2024-01-15 09:22:00'
    },
    {
      id: 9,
      name: '128g哑粉纸',
      category: 'paper',
      price: 6500,
      unit: '元/吨',
      weight: 128,
      thickness: 14,
      standardPrice: 0.73,
      largePrice: 0.90,
      supplier: '华泰纸业',
      remarks: '标准哑粉纸，质感好',
      materialCategory: '哑粉纸',
      status: 'active',
      updateTime: '2024-01-15 09:23:00'
    },
    {
      id: 10,
      name: '157g哑粉纸',
      category: 'paper',
      price: 6600,
      unit: '元/吨',
      weight: 157,
      thickness: 17,
      standardPrice: 0.90,
      largePrice: 1.11,
      supplier: '华泰纸业',
      remarks: '厚重哑粉纸，高档质感',
      materialCategory: '哑粉纸',
      status: 'active',
      updateTime: '2024-01-15 09:24:00'
    },

    // 胶版纸系列
    {
      id: 11,
      name: '70g胶版纸',
      category: 'paper',
      price: 5800,
      unit: '元/吨',
      weight: 70,
      thickness: 8,
      standardPrice: 0.36,
      largePrice: 0.44,
      supplier: '晨鸣纸业',
      remarks: '轻量胶版纸，适用于书籍内页',
      materialCategory: '胶版纸',
      status: 'active',
      updateTime: '2024-01-15 09:25:00'
    },
    {
      id: 12,
      name: '80g胶版纸',
      category: 'paper',
      price: 5900,
      unit: '元/吨',
      weight: 80,
      thickness: 9,
      standardPrice: 0.41,
      largePrice: 0.51,
      supplier: '晨鸣纸业',
      remarks: '标准胶版纸，经济实用',
      materialCategory: '胶版纸',
      status: 'active',
      updateTime: '2024-01-15 09:26:00'
    },

    // 特种纸数据
    {
      id: 13,
      name: '120g珠光纸（白色）',
      category: 'specialty-paper',
      price: 15000,
      unit: '元/吨',
      weight: 120,
      thickness: 0,
      size1: 700,
      size2: 1000,
      supplier: '华丽纸业',
      remarks: '白色珠光纸，珠光效果明显，适用于高档包装',
      materialCategory: '珠光纸',
      status: 'active',
      updateTime: '2024-01-15 09:27:00'
    },
    {
      id: 14,
      name: '150g珠光纸（金色）',
      category: 'specialty-paper',
      price: 18000,
      unit: '元/吨',
      weight: 150,
      thickness: 0,
      size1: 700,
      size2: 1000,
      supplier: '华丽纸业',
      remarks: '金色珠光纸，豪华质感',
      materialCategory: '珠光纸',
      status: 'active',
      updateTime: '2024-01-15 09:28:00'
    },
    {
      id: 15,
      name: '200g金银卡纸',
      category: 'specialty-paper',
      price: 22000,
      unit: '元/吨',
      weight: 200,
      thickness: 0,
      size1: 787,
      size2: 1092,
      supplier: '金银卡厂',
      remarks: '金银卡纸，镜面效果，适用于烟包酒盒',
      materialCategory: '金银卡',
      status: 'active',
      updateTime: '2024-01-15 09:29:00'
    },
    {
      id: 16,
      name: '250g金银卡纸',
      category: 'specialty-paper',
      price: 24000,
      unit: '元/吨',
      weight: 250,
      thickness: 0,
      size1: 787,
      size2: 1092,
      supplier: '金银卡厂',
      remarks: '厚重金银卡纸，挺度好',
      materialCategory: '金银卡',
      status: 'active',
      updateTime: '2024-01-15 09:30:00'
    },
    {
      id: 17,
      name: '180g牛皮纸',
      category: 'specialty-paper',
      price: 8500,
      unit: '元/吨',
      weight: 180,
      thickness: 0,
      size1: 787,
      size2: 1092,
      supplier: '牛皮纸厂',
      remarks: '天然牛皮纸，环保材质，适用于包装袋',
      materialCategory: '牛皮纸',
      status: 'active',
      updateTime: '2024-01-15 09:31:00'
    },
    {
      id: 18,
      name: '250g牛皮纸',
      category: 'specialty-paper',
      price: 9000,
      unit: '元/吨',
      weight: 250,
      thickness: 0,
      size1: 787,
      size2: 1092,
      supplier: '牛皮纸厂',
      remarks: '厚重牛皮纸，强度高',
      materialCategory: '牛皮纸',
      status: 'active',
      updateTime: '2024-01-15 09:32:00'
    },

    // 不干胶数据
    {
      id: 19,
      name: '80g铜版纸不干胶',
      category: 'adhesive',
      price: 4.2,
      unit: '元/平方米',
      weight: 0,
      supplier: '艾利丹尼森',
      remarks: '铜版纸面材，适用于彩色标签印刷',
      materialCategory: '纸质不干胶',
      status: 'active',
      updateTime: '2024-01-15 09:33:00'
    },
    {
      id: 20,
      name: '100g铜版纸不干胶',
      category: 'adhesive',
      price: 4.8,
      unit: '元/平方米',
      weight: 0,
      supplier: '艾利丹尼森',
      remarks: '厚重铜版纸面材，挺度好',
      materialCategory: '纸质不干胶',
      status: 'active',
      updateTime: '2024-01-15 09:34:00'
    },
    {
      id: 21,
      name: '透明PET不干胶',
      category: 'adhesive',
      price: 6.5,
      unit: '元/平方米',
      weight: 0,
      supplier: '艾利丹尼森',
      remarks: '透明PET面材，防水防油，适用于化妆品标签',
      materialCategory: 'PET不干胶',
      status: 'active',
      updateTime: '2024-01-15 09:35:00'
    },
    {
      id: 22,
      name: '亮银PET不干胶',
      category: 'adhesive',
      price: 7.2,
      unit: '元/平方米',
      weight: 0,
      supplier: '艾利丹尼森',
      remarks: '亮银PET面材，金属质感',
      materialCategory: 'PET不干胶',
      status: 'active',
      updateTime: '2024-01-15 09:36:00'
    },
    {
      id: 23,
      name: '白色PVC不干胶',
      category: 'adhesive',
      price: 5.8,
      unit: '元/平方米',
      weight: 0,
      supplier: '艾利丹尼森',
      remarks: '白色PVC面材，柔韧性好，适用于曲面贴合',
      materialCategory: 'PVC不干胶',
      status: 'active',
      updateTime: '2024-01-15 09:37:00'
    },
    {
      id: 24,
      name: '透明PVC不干胶',
      category: 'adhesive',
      price: 6.0,
      unit: '元/平方米',
      weight: 0,
      supplier: '艾利丹尼森',
      remarks: '透明PVC面材，无色透明效果',
      materialCategory: 'PVC不干胶',
      status: 'active',
      updateTime: '2024-01-15 09:38:00'
    },
    {
      id: 25,
      name: '易碎纸不干胶',
      category: 'adhesive',
      price: 8.5,
      unit: '元/平方米',
      weight: 0,
      supplier: '3M公司',
      remarks: '易碎纸面材，防伪标签专用，撕毁后无法复原',
      materialCategory: '防伪不干胶',
      status: 'active',
      updateTime: '2024-01-15 09:39:00'
    },
    {
      id: 26,
      name: '热敏纸不干胶',
      category: 'adhesive',
      price: 3.5,
      unit: '元/平方米',
      weight: 0,
      supplier: '热敏纸厂',
      remarks: '热敏纸面材，适用于条码标签、收银小票',
      materialCategory: '热敏不干胶',
      status: 'active',
      updateTime: '2024-01-15 09:40:00'
    }
  ]
}

// 模拟工艺数据
export const mockProcesses = {
  processes: [
    // 印刷工艺
    { id: 'offset_printing', name: '胶印', category: 'printing' },
    { id: 'flexo_printing', name: '柔印', category: 'printing' },
    { id: 'gravure_printing', name: '凹印', category: 'printing' },
    { id: 'digital_printing', name: '数码印刷', category: 'printing' },
    { id: 'screen_printing', name: '丝网印刷', category: 'printing' },
    // 表面工艺
    { id: 'uv_coating', name: 'UV上光', category: 'surface' },
    { id: 'lamination', name: '覆膜', category: 'surface' },
    { id: 'varnishing', name: '上光', category: 'surface' },
    { id: 'aqueous_coating', name: '水性上光', category: 'surface' },
    // 后道工艺
    { id: 'hot_stamping', name: '烫金', category: 'finishing' },
    { id: 'embossing', name: '压凹凸', category: 'finishing' },
    { id: 'die_cutting', name: '模切', category: 'finishing' },
    { id: 'folding', name: '折页', category: 'finishing' },
    { id: 'binding', name: '装订', category: 'finishing' },
    { id: 'perforation', name: '打孔', category: 'finishing' }
  ],
  processDetails: [
    // 印刷工艺类
    {
      id: 1,
      name: '单色胶印',
      category: 'printing',
      description: '单色平版胶印，适用于文字印刷',
      priceType: 'coefficient',
      price: 0.8,
      unit: '元/平方米',
      difficulty: 1,
      requirements: '适合大批量文字印刷，成本低',
      status: 'active',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      name: '四色胶印',
      category: 'printing',
      description: '四色平版胶印，适用于彩色印刷',
      priceType: 'coefficient',
      price: 1.5,
      unit: '元/平方米',
      difficulty: 2,
      requirements: 'CMYK四色印刷，色彩还原度高',
      status: 'active',
      updateTime: '2024-01-15 10:31:00'
    },
    {
      id: 3,
      name: '六色胶印',
      category: 'printing',
      description: '六色胶印，色彩更丰富',
      priceType: 'coefficient',
      price: 2.2,
      unit: '元/平方米',
      difficulty: 3,
      requirements: 'CMYK+专色，高端印刷品',
      status: 'active',
      updateTime: '2024-01-15 10:32:00'
    },
    {
      id: 4,
      name: '柔版印刷',
      category: 'printing',
      description: '柔性版印刷，适用于包装材料',
      priceType: 'coefficient',
      price: 1.8,
      unit: '元/平方米',
      difficulty: 3,
      requirements: '适合薄膜、纸张等柔性材料印刷',
      status: 'active',
      updateTime: '2024-01-15 10:33:00'
    },
    {
      id: 5,
      name: '凹版印刷',
      category: 'printing',
      description: '凹版印刷，印刷质量极高',
      priceType: 'coefficient',
      price: 3.0,
      unit: '元/平方米',
      difficulty: 4,
      requirements: '制版成本高，适合超大批量高质量印刷',
      status: 'active',
      updateTime: '2024-01-15 10:34:00'
    },
    {
      id: 6,
      name: '数码印刷',
      category: 'printing',
      description: '数字印刷，适合小批量个性化',
      priceType: 'fixed',
      price: 1.2,
      unit: '元/张',
      difficulty: 1,
      requirements: '无需制版，起印量小，可变数据印刷',
      status: 'active',
      updateTime: '2024-01-15 10:35:00'
    },
    {
      id: 7,
      name: '丝网印刷',
      category: 'printing',
      description: '丝网印刷，墨层厚实',
      priceType: 'coefficient',
      price: 2.5,
      unit: '元/平方米',
      difficulty: 3,
      requirements: '适合特殊材料和厚墨层印刷',
      status: 'active',
      updateTime: '2024-01-15 10:36:00'
    },

    // 表面工艺类
    {
      id: 8,
      name: 'UV局部上光',
      category: 'surface',
      description: 'UV光油局部上光，突出重点区域',
      priceType: 'coefficient',
      price: 1.5,
      unit: '元/平方米',
      difficulty: 2,
      requirements: '需要UV固化设备，可做局部效果',
      status: 'active',
      updateTime: '2024-01-15 10:37:00'
    },
    {
      id: 9,
      name: 'UV满版上光',
      category: 'surface',
      description: 'UV光油满版上光，整体保护',
      priceType: 'coefficient',
      price: 1.2,
      unit: '元/平方米',
      difficulty: 2,
      requirements: '整版UV上光，增加光泽和保护性',
      status: 'active',
      updateTime: '2024-01-15 10:38:00'
    },
    {
      id: 10,
      name: '亮膜覆膜',
      category: 'surface',
      description: '亮光薄膜覆膜，增加光泽',
      priceType: 'coefficient',
      price: 1.8,
      unit: '元/平方米',
      difficulty: 2,
      requirements: '提高表面光泽度和耐磨性',
      status: 'active',
      updateTime: '2024-01-15 10:39:00'
    },
    {
      id: 11,
      name: '哑膜覆膜',
      category: 'surface',
      description: '哑光薄膜覆膜，质感高档',
      priceType: 'coefficient',
      price: 1.9,
      unit: '元/平方米',
      difficulty: 2,
      requirements: '哑光效果，手感好，档次高',
      status: 'active',
      updateTime: '2024-01-15 10:40:00'
    },
    {
      id: 12,
      name: '水性上光',
      category: 'surface',
      description: '水性光油上光，环保经济',
      priceType: 'coefficient',
      price: 0.8,
      unit: '元/平方米',
      difficulty: 1,
      requirements: '环保水性光油，成本较低',
      status: 'active',
      updateTime: '2024-01-15 10:41:00'
    },
    {
      id: 13,
      name: '油性上光',
      category: 'surface',
      description: '油性光油上光，光泽度高',
      priceType: 'coefficient',
      price: 1.0,
      unit: '元/平方米',
      difficulty: 1,
      requirements: '传统油性光油，光泽效果好',
      status: 'active',
      updateTime: '2024-01-15 10:42:00'
    },

    // 后道工艺类
    {
      id: 14,
      name: '电化铝烫金',
      category: 'finishing',
      description: '电化铝烫金，金属质感',
      priceType: 'fixed',
      price: 0.18,
      unit: '元/张',
      difficulty: 3,
      requirements: '需要制作烫金版，金属光泽效果',
      status: 'active',
      updateTime: '2024-01-15 10:43:00'
    },
    {
      id: 15,
      name: '烫银',
      category: 'finishing',
      description: '银色烫印，银色金属效果',
      priceType: 'fixed',
      price: 0.16,
      unit: '元/张',
      difficulty: 3,
      requirements: '银色电化铝烫印',
      status: 'active',
      updateTime: '2024-01-15 10:44:00'
    },
    {
      id: 16,
      name: '击凸',
      category: 'finishing',
      description: '击凸工艺，立体浮雕效果',
      priceType: 'fixed',
      price: 0.15,
      unit: '元/张',
      difficulty: 3,
      requirements: '需要制作击凸版，立体效果明显',
      status: 'active',
      updateTime: '2024-01-15 10:45:00'
    },
    {
      id: 17,
      name: '压凹',
      category: 'finishing',
      description: '压凹工艺，凹陷效果',
      priceType: 'fixed',
      price: 0.12,
      unit: '元/张',
      difficulty: 2,
      requirements: '压印凹陷效果，增加层次感',
      status: 'active',
      updateTime: '2024-01-15 10:46:00'
    },
    {
      id: 18,
      name: '圆角模切',
      category: 'finishing',
      description: '圆角模切，圆润边角',
      priceType: 'fixed',
      price: 0.08,
      unit: '元/张',
      difficulty: 2,
      requirements: '制作圆角模切刀版',
      status: 'active',
      updateTime: '2024-01-15 10:47:00'
    },
    {
      id: 19,
      name: '异形模切',
      category: 'finishing',
      description: '异形模切，特殊造型',
      priceType: 'fixed',
      price: 0.15,
      unit: '元/张',
      difficulty: 4,
      requirements: '复杂异形模切，需要精密刀版',
      status: 'active',
      updateTime: '2024-01-15 10:48:00'
    },
    {
      id: 20,
      name: '对折',
      category: 'finishing',
      description: '对折工艺，简单折页',
      priceType: 'fixed',
      price: 0.03,
      unit: '元/张',
      difficulty: 1,
      requirements: '简单对折，可机器或手工完成',
      status: 'active',
      updateTime: '2024-01-15 10:49:00'
    },
    {
      id: 21,
      name: '三折页',
      category: 'finishing',
      description: '三折页工艺，宣传册常用',
      priceType: 'fixed',
      price: 0.06,
      unit: '元/张',
      difficulty: 2,
      requirements: '三等分折页，需要精确定位',
      status: 'active',
      updateTime: '2024-01-15 10:50:00'
    },
    {
      id: 22,
      name: '风琴折',
      category: 'finishing',
      description: '风琴折页，多层折叠',
      priceType: 'fixed',
      price: 0.10,
      unit: '元/张',
      difficulty: 3,
      requirements: '多层折叠，工艺复杂',
      status: 'active',
      updateTime: '2024-01-15 10:51:00'
    },
    {
      id: 23,
      name: '骑马钉装订',
      category: 'finishing',
      description: '骑马钉装订，适合薄册子',
      priceType: 'fixed',
      price: 0.12,
      unit: '元/本',
      difficulty: 1,
      requirements: '适合页数较少的册子装订',
      status: 'active',
      updateTime: '2024-01-15 10:52:00'
    },
    {
      id: 24,
      name: '胶装',
      category: 'finishing',
      description: '无线胶装，适合厚册子',
      priceType: 'fixed',
      price: 0.25,
      unit: '元/本',
      difficulty: 2,
      requirements: '适合页数较多的书籍装订',
      status: 'active',
      updateTime: '2024-01-15 10:53:00'
    },
    {
      id: 25,
      name: '打孔',
      category: 'finishing',
      description: '打孔工艺，便于装订',
      priceType: 'fixed',
      price: 0.02,
      unit: '元/张',
      difficulty: 1,
      requirements: '标准圆孔或方孔',
      status: 'active',
      updateTime: '2024-01-15 10:54:00'
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
