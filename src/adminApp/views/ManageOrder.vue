<template>
  <div style="padding: 16px;">
    <!-- 查询条件区域 -->
    <el-space wrap :size="12">
      <el-input v-model="orderNo" placeholder="订单编号" style="width: 160px;" />
      <el-input v-model="trainNo" placeholder="车次" style="width: 120px;" />
      <el-input v-model="station" placeholder="车站" style="width: 120px;" />
      <el-input v-model="userId" placeholder="用户ID" style="width: 120px;" />
      <el-date-picker v-model="departureDate" type="date" placeholder="出发日期" style="width: 160px;" />
      <el-input v-model="shopName" placeholder="店铺名称" style="width: 160px;" />
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button type="primary" @click="handleStatistics">统计</el-button>
    </el-space>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%; margin-top: 16px;" border>
      <!-- 多选框列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orderNo" label="订单编号" width="120" />
      <el-table-column prop="orderTime" label="下单时间" width="140" />
      <el-table-column prop="userId" label="用户ID" width="100" />
      <el-table-column prop="trainNo" label="车次" width="100" />
      <el-table-column prop="seat" label="座位" width="80" />
      <el-table-column prop="shopName" label="店铺名称" width="120" />
      <el-table-column prop="productName" label="商品名称" width="120" />
      <el-table-column prop="orderPrice" label="订单价格" width="100" />
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
import { ref } from 'vue';

// 查询条件绑定变量
const orderNo = ref('');
const trainNo = ref('');
const station = ref('');
const userId = ref('');
const departureDate = ref<Date | null>(null);
const shopName = ref('');

// 表格数据
const tableData = ref([
  {
    orderNo: '10001',
    orderTime: '2025-07-06 10:00',
    userId: 'U12345',
    trainNo: 'G123',
    seat: 'A1',
    shopName: '便利店',
    productName: '矿泉水',
    orderPrice: '5.00',
  },
  {
    orderNo: '10002',
    orderTime: '2025-07-06 10:10',
    userId: 'U54321',
    trainNo: 'G456',
    seat: 'B2',
    shopName: '快餐店',
    productName: '汉堡套餐',
    orderPrice: '25.00',
  },
  // 可继续添加更多模拟数据...
]);

// 查询按钮事件
const handleQuery = () => {
  console.log('查询条件：', {
    orderNo: orderNo.value,
    trainNo: trainNo.value,
    station: station.value,
    userId: userId.value,
    departureDate: departureDate.value
      ? departureDate.value.toLocaleDateString()
      : '',
    shopName: shopName.value,
  });
  // 实际可根据条件向后端请求数据，更新 tableData
};

// 统计按钮事件
const handleStatistics = () => {
  console.log('执行统计逻辑，当前选中数据：', tableData.value);
  // 可实现具体统计逻辑，比如统计选中订单的总价等
};
</script>

<style scoped>
/* 可根据需要自定义样式 */
</style>