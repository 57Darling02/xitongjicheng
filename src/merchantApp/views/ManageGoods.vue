<template>
  <div style="padding: 16px;">
    <!-- 查询条件区域 -->
    <el-space wrap :size="12">
      <el-input v-model="goodsNo" placeholder="商品编号" style="width: 160px;" />
      <el-input v-model="goodsName" placeholder="商品名称" style="width: 200px;" />
      <el-button type="primary" @click="handleQuery">查询</el-button>
    </el-space>
    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 16px;"
      border
    >
      <!-- 多选框列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="goodsNo" label="商品编号" width="120" />
      <el-table-column prop="goodsImg" label="商品图片" width="120">
        <template #default="scope">
          <el-image
            v-if="scope.row.goodsImg"
            :src="scope.row.goodsImg"
            style="width: 80px; height: 80px"
            fit="cover"
          />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="120" />
      <el-table-column prop="goodsStock" label="商品库存" width="100" />
      <el-table-column prop="goodsDesc" label="商品描述" width="200" />
      <el-table-column label="操作" width="300">
        <template #default>
          <el-button @click="handleAddStock">增加库存</el-button>
          <el-button @click="handleShelve">下架商品</el-button>
          <el-button @click="handleMore">更多</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 查询条件绑定变量
const goodsNo = ref('');
const goodsName = ref('');

// 表格数据，可根据实际接口返回调整字段
const tableData = ref([
  {
    goodsNo: 'G001',
    goodsImg: 'https://example.com/goods1.jpg', // 实际替换为商品图片地址
    goodsName: '商品1',
    goodsStock: 10,
    goodsDesc: '商品1的描述',
  },
  {
    goodsNo: 'G002',
    goodsImg: '',
    goodsName: '商品2',
    goodsStock: 5,
    goodsDesc: '商品2的描述',
  },
  // 可继续添加更多模拟数据...
]);

// 查询按钮事件
const handleQuery = () => {
  console.log('查询条件：', {
    goodsNo: goodsNo.value,
    goodsName: goodsName.value,
  });
  // 实际可根据条件向后端请求数据，更新 tableData
};

// 增加库存按钮事件
const handleAddStock = () => {
  console.log('执行增加库存操作');
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
</script>

<style scoped>
/* 可根据需要自定义样式，比如图片容器样式等 */
.el-image {
  border: 1px solid #eee;
}
</style>