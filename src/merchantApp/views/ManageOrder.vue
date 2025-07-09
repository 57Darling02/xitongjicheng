<template>
  <div style="padding: 16px;">
    <!-- 查询条件区域 -->
    <el-space wrap :size="12">
      <el-input v-model="status" placeholder="状态" style="width: 160px;" />

      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button type="primary" @click="handleStatistics">统计</el-button>
    </el-space>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%; margin-top: 16px;" v-loading="loading" border>
      <!-- 多选框列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="order_time" label="订单时间" width="180" />
      <el-table-column prop="order_id" label="订单编号" width="120" />
      <el-table-column prop="train_number" label="车次" width="100" />
      <el-table-column prop="sits" label="座位" width="80" />
      <el-table-column prop="customer_id" label="用户ID" width="100" />
      <el-table-column prop="customer_name" label="用户姓名" width="120" />
      <el-table-column prop="customer_phone" label="用户电话" width="140" />
      <el-table-column prop="total_pay" label="订单价格" width="100" />
      <el-table-column label="状态" width="100">
        <!-- 根据 status 值显示不同状态文本 -->
        <template #default="scope">
          <span v-if="scope.row.status === '1'">待配货</span>
          <span v-if="scope.row.status === '2'">配送中</span>
          <span v-if="scope.row.status === '3'">已完成</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template #default="scope">
          <!-- 根据 status 值显示不同按钮 -->
          <el-button v-if="scope.row.status === '1'" @click="handleCompletePicking(scope.row)">完成配货</el-button>
          <el-button v-else @click="">查看</el-button>
          <el-button>更多</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
const loading = ref(true)
// 查询条件绑定变量
const status = ref('');

// 表格数据
interface Order {
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  order_id: string;
  sits: string;
  status: string;
  total_pay: string;
  train_number: string;
  order_time: string;
}
const tableData = ref<Order[]>([]);

// 查询按钮事件
const handleQuery = async () => {
  loading.value = true
  const options = {
    method: 'GET',
    url: '/api/orders/list' + `?status=${status.value}`,
  };
  const resp = await axios.request(options);
  console.log(resp.data.orders);
  tableData.value = resp.data.orders
  loading.value = false
  // 实际可根据条件向后端请求数据，更新 tableData
};

// 统计按钮事件
const handleStatistics = () => {
  console.log('执行统计逻辑，当前选中数据：', tableData.value);
  // 可实现具体统计逻辑，比如统计选中订单的总价等
};
// 完成配货操作
const handleCompletePicking = async (order: Order) => {
  try {
    const response = await axios.put(`/api/orders/update_status/${order.order_id}`, { status: '2' });
    ElMessage.success(response.data.message);
    handleQuery();
  } catch (error) {
    console.error('配货完成失败', error);
  }
};
onMounted(() => {
  // 初始化时加载数据
  handleQuery();
  loading.value = false
});
</script>

<style scoped>
/* 可根据需要自定义样式 */
</style>