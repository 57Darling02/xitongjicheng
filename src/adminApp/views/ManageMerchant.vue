<template>
    <div style="flex-direction: column; flex: 1; height: 100%; display: flex;">
        <!-- 查询区域 -->
        <el-space wrap style="padding: 8px;">
            <el-input v-model="inputStationName" style="width: 240px" placeholder="车站名" />
            <el-input v-model="inputShopName" style="width: 240px" placeholder="店铺名称模糊查询" />
            <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-space>
        <!-- 表格区域，使用 el-auto-resizer 让表格自适应尺寸 -->
        <el-auto-resizer style="width: 100%; flex: 1;">
            <template #default="{ height, width }">
                <el-table :data="tableData" style="width: 100%; height: 100%" border>
                    <el-table-column fixed prop="shopName" label="店铺名称" width="150" />
                    <el-table-column prop="station" label="对应站点" width="150" />
                    <el-table-column prop="status" label="状态" width="120">
                        <template #default="scope">
                            <el-tag :type="getStatusType(scope.row.status)">
                                {{ scope.row.status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="deliveryTime" label="配送时间" />
                    <el-table-column prop="businessHours" label="营业时间" />
                    <el-table-column prop="account" label="登录账号" />
                    <el-table-column prop="position" label="位置信息"  />
                    <el-table-column fixed="right" label="操作" width="250">
                        <template #default="scope">
                            <el-button @click="handleAudit(scope.row)">
                                {{ scope.row.status === '未审核' ? '审核' : '复审' }}
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const inputStationName = ref('')
const inputShopName = ref('')

// 根据状态获取标签类型
const getStatusType = (status: string) => {
    if (status === '未审核') return 'info'
    if (status === '审核通过') return 'success'
    return 'danger'
}

// 表格数据
const tableData = ref([
    {
        shopName: '星巴克',
        station: '北京西站',
        status: '未审核',
        deliveryTime: '08:00-22:00',
        businessHours: '07:00-23:00',
        account: 'starbucks-bj',
        position: '南广场一层',
    },
    {
        shopName: '麦当劳',
        station: '北京南站',
        status: '审核通过',
        deliveryTime: '07:00-24:00',
        businessHours: '06:00-24:00',
        account: 'mcdonalds-bjn',
        position: '候车厅A区',
    },
    {
        shopName: '便利店',
        station: '上海虹桥站',
        status: '审核不通过',
        deliveryTime: '06:30-23:30',
        businessHours: '06:00-24:00',
        account: 'cstore-sh',
        position: '北进站口',
    },
])

// 查询按钮点击事件
const handleQuery = () => {
    console.log('查询参数：', {
        stationName: inputStationName.value,
        shopName: inputShopName.value
    })

    // 实际项目中这里应该调用API获取数据
    // fetchTableData({
    //   stationName: inputStationName.value,
    //   shopName: inputShopName.value
    // }).then(res => {
    //   tableData.value = res.data
    // })
}

// 审核/复审操作
const handleAudit = (row: any) => {
    console.log('审核/复审行：', row)
    // 实际项目中这里应该打开审核弹窗
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
</script>

<style scoped>
/* 自定义样式 */
</style>