<template>
  <div style="padding: 16px;">
    <!-- 查询条件区域 -->
    <el-space wrap :size="12">
      <el-date-picker v-model="departureDate" type="date" placeholder="出发日期" style="width: 160px;" />
      <el-input v-model="trainNo" placeholder="车次" style="width: 120px;" />
      <el-input v-model="seat" placeholder="座位" style="width: 100px;" />
      <el-input v-model="userAccount" placeholder="用户账号" style="width: 120px;" />
      <el-input v-model="userName" placeholder="用户姓名" style="width: 120px;" />
      <el-input v-model="phone" placeholder="手机号码" style="width: 160px;" />
      <el-button type="primary" @click="handleQuery">查询</el-button>
    </el-space>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%; margin-top: 16px;" border>
      <!-- 多选框列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="departureDate" label="出发日期" width="120" />
      <el-table-column prop="trainNo" label="车次" width="100" />
      <el-table-column prop="seat" label="座位" width="80" />
      <el-table-column prop="userAccount" label="用户账号" width="120" />
      <el-table-column prop="userName" label="用户姓名" width="120" />
      <el-table-column prop="phone" label="手机号码" width="140" />
      <el-table-column prop="nickname" label="昵称" width="100" />
      <el-table-column prop="frequentTrainNo" label="常乘车次" width="120" />
      <el-table-column label="操作" width="180">
        <template #default>
          <el-button>编辑</el-button>
          <el-button>更多</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 查询条件绑定变量
const departureDate = ref<Date | null>(null);
const trainNo = ref('');
const seat = ref('');
const userAccount = ref('');
const userName = ref('');
const phone = ref('');

// 表格数据
const tableData = ref([
  {
    departureDate: '2025-07-10',
    trainNo: 'G1001',
    seat: 'A01',
    userAccount: 'user001',
    userName: '张三',
    phone: '13800138000',
    nickname: '小张',
    frequentTrainNo: 'G1001',
  },
  {
    departureDate: '2025-07-11',
    trainNo: 'G1002',
    seat: 'B02',
    userAccount: 'user002',
    userName: '李四',
    phone: '13900139000',
    nickname: '小李',
    frequentTrainNo: 'G1002',
  },
  // 可继续添加更多模拟数据...
]);

// 查询按钮事件
const handleQuery = () => {
  console.log('查询条件：', {
    departureDate: departureDate.value
      ? departureDate.value.toLocaleDateString()
      : '',
    trainNo: trainNo.value,
    seat: seat.value,
    userAccount: userAccount.value,
    userName: userName.value,
    phone: phone.value,
  });
  // 实际可根据条件向后端请求数据，更新 tableData
};
</script>

<style scoped>
/* 可根据需要自定义样式 */
</style>