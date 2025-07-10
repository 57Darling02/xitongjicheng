<template>
  <div style="padding: 16px;">
    <!-- 查询条件区域 -->
    <el-space wrap :size="12">
      <el-input v-model="userName" placeholder="用户真名" style="width: 120px;" />
      <el-input v-model="phoneNumber" placeholder="用户手机号" style="width: 140px;" />
      <el-input v-model="trainNo" placeholder="车次" style="width: 120px;" />
      <el-input v-model="userAccount" placeholder="用户名" style="width: 120px;" />
      <el-input v-model="currentPage" type="number" placeholder="页码" style="width: 100px;" />
      <el-input v-model="perPage" type="number" placeholder="每页数量" style="width: 100px;" />
      <el-button type="primary" @click="handleQuery">查询</el-button>
    </el-space>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%; margin-top: 16px;" v-loading="loading" border>
      <!-- 多选框列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="customer_id" label="用户 ID" width="160" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="pnumber" label="用户手机号" width="140" />
      <el-table-column prop="train" label="车次" width="100" />
      <el-table-column prop="sits" label="座位" width="80" />
      <el-table-column label="操作" width="280">
        <template #default="scope">
          <el-button @click="handleViewDetail(scope.row.customer_id)">查看详情</el-button>
          <el-button>更多</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="detailDialogVisible" title="用户详情" width="30%">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户 ID">{{ currentCustomerDetail.customer_id }}</el-descriptions-item>
        <el-descriptions-item label="用户真名">{{ currentCustomerDetail.customer_name }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ currentCustomerDetail.username }}</el-descriptions-item>
        <el-descriptions-item label="用户手机号">{{ currentCustomerDetail.pnumber }}</el-descriptions-item>
        <el-descriptions-item label="车次">{{ currentCustomerDetail.train }}</el-descriptions-item>
        <el-descriptions-item label="座位">{{ currentCustomerDetail.sits }}</el-descriptions-item>
        <el-descriptions-item label="支付信息">
          {{ currentCustomerDetail.pay || '无' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
const loading = ref(false)
// 查询条件绑定变量
const userName = ref('');
const phoneNumber = ref('');
const trainNo = ref('');
const userAccount = ref('');
const currentPage = ref(1);
const perPage = ref(5);

// 表格数据
const tableData = ref([]);
// 详情弹窗相关
const detailDialogVisible = ref(false);
const currentCustomerDetail = ref({
  customer_id: '',
  customer_name: '',
  pay: null,
  pnumber: '',
  sits: '',
  train: '',
  username: ''
});
// 查询按钮事件
const handleQuery = async () => {
  loading.value = true
  const params = {
    customer_name: userName.value,
    pnumber: phoneNumber.value,
    train: trainNo.value,
    username: userAccount.value,
    page: currentPage.value,
    per_page: perPage.value
  };

  try {
    const response = await axios.get('/api/admin/customers', { params });
    if (response.data && Array.isArray(response.data.customers)) {
      tableData.value = response.data.customers;
    }
  } catch (error) {
    ElMessage.error('查询用户数据失败');
    console.error(error);
  } finally {
    loading.value = false
  }
};

// 查看详情事件
const handleViewDetail = async (customerId: string) => {
  try {
    const response = await axios.get(`/api/admin/customers/${customerId}`);
    if (response.data) {
      currentCustomerDetail.value = response.data;
      detailDialogVisible.value = true;
      ElMessage.success('获取用户详情成功');
    }
  } catch (error) {
    ElMessage.error('获取用户详情失败');
    console.error(error);
  }
};

onMounted(() => {
  handleQuery();
})
</script>

<style></style>