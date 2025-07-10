<template>
    <div style="flex-direction: column; flex: 1; height: 100%; display: flex;">
        <!-- 查询区域 -->
        <el-space wrap style="padding: 8px;">
            <el-input v-model="inputStationName" style="width: 240px" placeholder="车站名" />
            <el-input v-model="inputShopName" style="width: 240px" placeholder="店铺名称模糊查询" />
            <el-checkbox v-model="showUnapproved" @change="handleQuery">仅查看未审核商家</el-checkbox>
            <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-space>
        <!-- 表格区域，使用 el-auto-resizer 让表格自适应尺寸 -->
        <el-auto-resizer style="width: 100%; flex: 1;">
            <template #default="{ height, width }">
                <el-table :data="filteredTableData" style="width: 100%; height: 100%" v-loading="loading" border>
                    <el-table-column fixed prop="cname" label="店铺名称" width="150" />
                    <el-table-column prop="station_name" label="对应站点" width="150" />
                    <el-table-column prop="state_text" label="状态" width="120">
                        <template #default="scope">
                            <el-tag :type="getStatusType(scope.row.state_text)">
                                {{ scope.row.state_text }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <!-- 可根据需要添加更多列，如地址、联系方式等 -->
                    <el-table-column prop="address" label="地址" />
                    <el-table-column prop="contact_way" label="联系方式" />
                    <el-table-column fixed="right" label="操作" width="250">
                        <template #default="scope">
                            <el-button @click="handleAudit(scope.row)">
                                {{ scope.row.state_text === '待审核' ? '审核' : '复审' }}
                            </el-button>
                            <el-button @click="handleEdit(scope.row)">
                                编辑
                            </el-button>
                            <el-button @click="handleMore(scope.row)">
                                更多
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-auto-resizer>
    </div>
    <el-dialog v-model="auditDialogVisible" title="商家审核" width="30%">
        <p>确定要对 {{ currentAuditMerchant.cname }} 进行审核操作吗？</p>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="auditDialogVisible = false">取消</el-button>
                <el-button type="success" @click="submitAudit('approve')">通过</el-button>
                <el-button type="danger" @click="submitAudit('reject')">拒绝</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
const showUnapproved = ref(false)
const inputStationName = ref('')
const inputShopName = ref('')

// 根据状态获取标签类型
const getStatusType = (status: string) => {
    if (status === '待审核') return 'info'
    if (status === '已通过') return 'success'
    return 'danger'
}
// 表格数据
interface Merchant {
    commercial_id: number
    cname: string
    station_name: string
    state_text: string
    address?: string
    contact_way?: string
}
const tableData = ref<Merchant[]>([])
const loading = ref(false)
const filteredTableData = computed(() => {
    let data = tableData.value
    // 按车站名过滤
    if (inputStationName.value) {
        data = data.filter(item => item.station_name.includes(inputStationName.value))
    }
    // 按店铺名称过滤
    if (inputShopName.value) {
        data = data.filter(item => item.cname.includes(inputShopName.value))
    }
    // 按未审核状态过滤
    if (showUnapproved.value) {
        data = data.filter(item => item.state_text === '待审核')
    }
    return data
})
const fetchTableData = async () => {
    loading.value = true
    try {
        const response = await axios.get('/api/admin/commercials', {
            params: {
                station_name: inputStationName.value,
                cname: inputShopName.value
            }
        })
        if (response.data && Array.isArray(response.data.commercials)) {
            tableData.value = response.data.commercials
        }
    } catch (error) {
        ElMessage.error('获取商家数据失败')
        console.error(error)
    } finally {
        loading.value = false
    }
}
// 查询按钮点击事件
const handleQuery = () => {
    fetchTableData()

    // 实际项目中这里应该调用API获取数据
    // fetchTableData({
    //   stationName: inputStationName.value,
    //   shopName: inputShopName.value
    // }).then(res => {
    //   tableData.value = res.data
    // })
}


// 编辑操作
const handleEdit = (row: any) => {
    console.log('编辑行：', row)
    // 实际项目中这里应该打开编辑表单
}

// 更多操作
const handleMore = (row: any) => {
    console.log('更多操作行：', row)
    // 实际项目中这里应该显示更多操作菜单
}
// 审核弹窗相关
const auditDialogVisible = ref(false)
const currentAuditMerchant = ref<{ commercial_id?: number; cname?: string }>({})

// 打开审核弹窗
const handleAudit = (row: any) => {
    currentAuditMerchant.value = row
    auditDialogVisible.value = true
}

// 提交审核
const submitAudit = async (action: string) => {
    try {
        const response = await axios.put(
            `/api/admin/commercials/${currentAuditMerchant.value.commercial_id}/review`,
            { action }
        )
        if (response.status === 200) {
            ElMessage.success(action === 'approve' ? '审核通过成功' : '已拒绝该商家')
            auditDialogVisible.value = false
            fetchTableData() // 刷新表格数据
        } else {
            ElMessage.error('操作失败')
        }
    } catch (error) {
        ElMessage.error('操作失败')
        console.error(error)
    }
}
onMounted(() => {
    fetchTableData()
})
</script>

<style scoped>
/* 自定义样式 */
</style>