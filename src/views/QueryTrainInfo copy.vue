<template>
    <div class="" style="flex-direction: column;flex: 1;height: 100%;display: flex;">
        <el-date-picker v-model="selectedDate" type="datetime" placeholder="Pick a Date" format="YYYY-MM-DD" />
        <el-select v-model="selectedTrainNo" filterable remote reserve-keyword placeholder="请输入车次关键字"
            :remote-method="remoteSearch">
            <el-option v-for="(item, idx) in trainOptions" :key="idx" :label="item.station_train_code"
                :value="item.train_no" >
                <template #default>
                    <span>{{ item.station_train_code }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ item.from_station }} - {{ item.to_station }}
                    </span>
                </template>
            </el-option>
        </el-select>
        <el-button type="success" @click="fetchTrainSchedule" plain>查询</el-button>
        <el-table :data="trainScheduleData" style="width: 100%;flex: 1;" border stripe>
            <el-table-column fixed type="index" label="站序" />
            <el-table-column prop="station_train_code" label="车次" />
            <el-table-column prop="station_name" label="车站名称" />
            <el-table-column prop="arrive_time" label="到达时间" />
            <el-table-column prop="start_time" label="出发时间" />
            <el-table-column prop="running_time" label="运行时长" />
            <el-table-column prop="arrive_day_str" label="到达日期" />
        </el-table>

    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
// 存储选中的车次
const selectedTrainNo = ref('')
const selectedTrain = computed<TrainOption | undefined>(() => {
    return trainOptions.value.find(item => item.train_no === selectedTrainNo.value)
})
// 定义车次选项的类型
interface TrainOption {
    station_train_code: string;
    train_no: string;
    from_station: string;
    to_station: string;
    label?: string;
    value?: string;
}
// 存储搜索结果选项
const trainOptions = ref<TrainOption[]>([]);
// 控制加载状态
const loading = ref(false);

// 获取当前日期，格式为 YYYYMMDD
const selectedDate = ref()
const getDate = (sp = '') => {
    const time = selectedDate.value ? new Date(selectedDate.value) : new Date();
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const day = String(time.getDate()).padStart(2, '0');
    return `${year}${sp}${month}${sp}${day}`;
}


// 远程搜索方法
const remoteSearch = async (queryString: string) => {
    if (queryString.length === 0) {
        trainOptions.value = [];
        return;
    }
    loading.value = true;
    try {
        const date = getDate();
        const response = await fetch(
            `/search_12306/search/v1/train/search?keyword=${encodeURIComponent(
                queryString
            )}&date=${date}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status) {
            trainOptions.value = data.data.map((item: TrainOption) => ({
                ...item,
                label: item.station_train_code,
                value: item.train_no,
            }));
        }
    } catch (error) {
        console.error('请求出错:', error);
        trainOptions.value = [];
    } finally {
        loading.value = false;
    }
};

const columns = ['a','b']

const trainScheduleData = ref([]);
const fetchTrainSchedule = async () => {
    console.log('开始', getDate('-'))
    if (!selectedTrainNo.value) return
    try {
        const response = await fetch(
            `/kyfw_12306/otn/queryTrainInfo/query?leftTicketDTO.train_no=${selectedTrainNo.value}&leftTicketDTO.train_date=${getDate('-')}&rand_code=`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status && data.data && data.data.data) {
            trainScheduleData.value = data.data.data;
        }
    } catch (error) {
        console.error('请求列车时刻表出错:', error);
    }
};
</script>

<style>
.el-select-dropdown__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 20px;
}

.circular {
    display: inline;
    height: 30px;
    width: 30px;
    animation: loading-rotate 2s linear infinite;
}

.path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: var(--el-color-primary);
    stroke-linecap: round;
}

@keyframes loading-rotate {
    to {
        transform: rotate(360deg);
    }
}

@keyframes loading-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px;
    }

    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px;
    }
}
</style>