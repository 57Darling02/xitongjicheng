<template>
  <div style="padding: 16px;">
    <!-- 查询条件区域 -->
    <el-space wrap :size="12">
      <el-input v-model="goodsNo" placeholder="商品编号" style="width: 160px;" />
      <el-input v-model="goodsName" placeholder="商品名称" style="width: 200px;" />
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button type="primary" @click="handleAddGood">新增商品</el-button>
    </el-space>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%; margin-top: 16px;" v-loading="loading" border>
      <!-- 多选框列 -->
      <el-table-column type="selection" width="55" />
      <!-- 使用接口字段更新列 -->
      <el-table-column prop="commodity_id" label="商品编号" width="120" />
      <el-table-column prop="image_url" label="商品图片" width="120">
        <template #default="scope">
          <el-image v-if="scope.row.image_url" :src="scope.row.image_url" style="width: 80px; height: 80px"
            fit="cover" />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="commodity_name" label="商品名称" width="120" />
      <el-table-column prop="commodity_stock" label="商品库存" width="100" />
      <el-table-column prop="commodity_situation" label="商品描述" width="200" />
      <el-table-column prop="commodity_price" label="商品价格" width="100" />
      <el-table-column prop="safety_stock" label="安全库存" width="100" />
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <el-button @click="handleAddStock(scope.row)">增加库存</el-button>
          <el-button @click="handleShelve(scope.row)">下架商品</el-button>
          <el-button @click="handleMore(scope.row)">更多</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
const loading = ref(false);
// 查询条件绑定变量
const goodsNo = ref('');
const goodsName = ref('');

interface commodity {
  c_id: number;
  commodity_id: string;
  commodity_situation: string;
  commodity_name: string;
  commodity_price: number;
  commodity_stock: number;
  image_url: string;
  safety_stock: number;
}

const tableData = ref<commodity[]>([
  {
    c_id: 1,
    commodity_id: 'G001',
    commodity_situation: '商品1的描述',
    commodity_name: '商品1',
    commodity_price: 20.00,
    commodity_stock: 10,
    image_url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    safety_stock: 5,
  },
  {
    c_id: 2,
    commodity_id: 'G002',
    commodity_situation: '商品2的描述',
    commodity_name: '商品2',
    commodity_price: 15.00,
    commodity_stock: 5,
    image_url: '',
    safety_stock: 3,
  },
  // 可继续添加更多模拟数据...
]);

// 查询按钮事件
const handleQuery = async () => {
  loading.value = true;
  try {
    let response;
    response = await axios.get(`/api/commodity/list`);
    // if (goodsName.value){

    // }else if (goodsNo.value){

    // }else{

    // }
    if (response && response.data) {
      tableData.value = response.data.commodities as commodity[];
    }
  } finally {
    loading.value = false;

  }

};

// 新增商品按钮事件
const handleAddGood =async () => {
  console.log('执行新增商品操作');
  // 可结合当前行数据，调用接口增加库存，例如：
  // const row = scope.row; （若在循环中需拿到对应行数据，这里示例简化，实际需调整）
  // 调用 addStockApi(row.goodsNo, 增加的数量)
};

// 下架商品按钮事件
const handleShelve = () => {
  console.log('执行下架商品操作');
  // 可结合当前行数据，调用接口下架商品，例如：
  // const row = scope.row; 
  // 调用 shelveGoodsApi(row.goodsNo)
};

// 更多按钮事件
const handleMore = () => {
  console.log('执行更多操作');
  // 可展开更多功能，如查看商品详情、编辑商品信息等
};
onMounted(async () => {
  await handleQuery();
});
</script>

<style scoped>
/* 可根据需要自定义样式，比如图片容器样式等 */
.el-image {
  border: 1px solid #eee;
}
</style>