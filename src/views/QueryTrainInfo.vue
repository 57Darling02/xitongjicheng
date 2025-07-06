<template>
    <div style="flex-direction: column;flex: 1;height: 100%;display: flex;">
        <el-space :spacer="spacer" wrap>

            <el-select v-model="selectedTrainNo" filterable remote reserve-keyword placeholder="输入车次关键字查询"
                :remote-method="remoteSearch" :loading="loading">
                <template #label="{ label, value }">
                    <span>{{ label }}: </span>
                    <span style="font-weight: bold">{{ value }}</span>
                </template>
                <template #loading>
                    <svg class="circular" viewBox="0 0 50 50">
                        <circle class="path" cx="25" cy="25" r="20" fill="none" />
                    </svg>
                </template>
                <el-option v-for="(item, idx) in trainOptions" :key="idx" :label="item.station_train_code"
                    :value="item.train_no">
                    <template #default>
                        <span>{{ item.station_train_code }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">
                            {{ item.from_station }} - {{ item.to_station }}
                        </span>
                    </template>
                </el-option>
            </el-select>
            <el-date-picker v-model="selectedDate" type="datetime" placeholder="Pick a Date" format="YYYY-MM-DD"
                :default-value="new Date()" />
            <el-button type="success" @click="fetchTrainSchedule" plain>查询</el-button>
        </el-space>
        <el-auto-resizer style="width: 100%;flex: 1;">
            <template #default="{ height, width }">
                <el-table-v2 :columns="columns" :data="trainScheduleData" :width="width" :height="height"
                    v-loading="loading2" />
            </template>
        </el-auto-resizer>
    </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue';
// 存储选中的车次
const selectedTrainNo = ref('')
const selectedTrain = computed<TrainOption | undefined>(() => {
    return trainOptions.value.find(item => item.train_no === selectedTrainNo.value)
})
const spacer = h(ElDivider, { direction: 'vertical' })

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
const loading2 = ref(false);
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

const columns = [
    {
        key: 'index',
        width: 50,
        title: '站序',
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => `${rowIndex + 1}`,
        align: 'center'
    },
    {
        key: 'station_train_code',
        dataKey: 'station_train_code',
        title: '车次',
        width: 100
    },
    {
        key: 'station_name',
        dataKey: 'station_name',
        title: '车站名称',
        width: 150
    },
    {
        key: 'arrive_time',
        dataKey: 'arrive_time',
        title: '到达时间',
        width: 120
    },
    {
        key: 'start_time',
        dataKey: 'start_time',
        title: '出发时间',
        width: 120
    },
    {
        key: 'stop_duration',
        title: '停站时间',
        width: 120,
        cellRenderer: ({ rowData }: { rowData: any }) => {
            const arriveTime = rowData.arrive_time;
            const startTime = rowData.start_time;
            if (arriveTime && startTime) {
                const [arriveHour, arriveMinute] = arriveTime.split(':').map(Number);
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const arriveMinutes = arriveHour * 60 + arriveMinute;
                const startMinutes = startHour * 60 + startMinute;
                const durationMinutes = startMinutes - arriveMinutes;
                const hours = Math.floor(durationMinutes / 60);
                const minutes = durationMinutes % 60;
                let result = ''
                if (hours) result += `${hours}h`;
                if (minutes) result += `${minutes}m`;
                return result
                // return `${hours}:${minutes}`;
            }
            return '';
        }
    },
    {
        key: 'running_time',
        dataKey: 'running_time',
        title: '运行时长',
        width: 120
    },
    {
        key: 'arrive_day_str',
        dataKey: 'arrive_day_str',
        title: '到达日期',
        width: 120
    }
];

const trainScheduleData = ref([]);
const fetchTrainSchedule = async () => {
    if (!selectedTrainNo.value) return
    loading2.value = true;
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
    } finally {
        loading2.value = false
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
</style>