<template>
  <div style="padding: 16px;">
    <!-- 查询条件区域 -->
    <el-space wrap :size="12">
      <el-input v-model="orderId" placeholder="订单编号" style="width: 160px;" />
      <el-input v-model="trainNo" placeholder="车次" style="width: 120px;" />
      <el-date-picker v-model="timeRange" type="daterange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" style="width: 320px;" />
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button type="primary" @click="handleStatistics">统计</el-button>
    </el-space>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%; margin-top: 16px;" v-loading="loading" border>
      <!-- 多选框列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="order_id" label="订单编号" width="160" />
      <el-table-column prop="order_time" label="下单时间" width="160" />
      <el-table-column prop="customer_id" label="用户ID" width="140" />
      <el-table-column prop="train" label="车次" width="100" />
      <el-table-column prop="sits" label="座位" width="80" />
      <el-table-column prop="commercial_name" label="店铺名称" width="120" />
      <el-table-column prop="total_pay" label="订单价格" width="100" />
      <el-table-column label="操作" width="180">
        <template #default>
          <el-button>查看</el-button>
          <el-button>更多</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
const loading = ref(false)
// 查询条件绑定变量
const orderId = ref('');
const trainNo = ref('');
const timeRange = ref<Date[] | null>(null);

// 表格数据
const tableData = ref([]);

// 查询按钮事件
const handleQuery = async () => {
  const params: Record<string, string | undefined> = {};
  loading.value = true
  if (orderId.value) {
    params.order_id = orderId.value;
  }

  if (trainNo.value) {
    params.train = trainNo.value;
  }

  if (timeRange.value && timeRange.value.length === 2) {
    params.start_time = timeRange.value[0].toISOString().slice(0, 19).replace('T', ' ');
    params.end_time = timeRange.value[1].toISOString().slice(0, 19).replace('T', ' ');
  }

  try {
    const response = await axios.get('/api/admin/orders', { params });
    if (response.data && Array.isArray(response.data.orders)) {
      tableData.value = response.data.orders;
    }
  } catch (error) {
    ElMessage.error('查询订单数据失败');
    console.error(error);
  } finally {
    loading.value = false
  }
};

// 统计按钮事件
const handleStatistics = () => {
  console.log('执行统计逻辑，当前选中数据：', tableData.value);
  // 可实现具体统计逻辑，比如统计选中订单的总价等
};

onMounted(() => {
  handleQuery()
})
</script>

<style scoped>
/* 可根据需要自定义样式 */
</style>