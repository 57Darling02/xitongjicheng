<template>
  <el-descriptions title="商家信息" direction="vertical" :column="2" border>
    
    <el-descriptions-item label="店铺编号">
      <el-input v-model="form.shopId" disabled />
    </el-descriptions-item>
    <el-descriptions-item :rowspan="4" label="头像" align="center">
      <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 100px; height: 100px" />
        <el-icon v-else class="avatar-uploader-icon" style="width: 100px; height: 100px">
          <Plus />
        </el-icon>
      </el-upload>
    </el-descriptions-item>
    <el-descriptions-item label="店铺名称">
      <el-input v-model="form.shopName" />
    </el-descriptions-item>
    
    <el-descriptions-item label="地理位置">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-select v-model="form.province" placeholder="选择省份">
            <el-option v-for="item in provinceList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select v-model="form.city" placeholder="选择城市">
            <el-option v-for="item in cityList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="form.address" placeholder="具体位置" />
        </el-col>
      </el-row>
    </el-descriptions-item>
    <el-descriptions-item label="对应站点">
      <el-select v-model="form.station" placeholder="选择站点">
        <el-option v-for="item in stationList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="联系方式">
      <el-input v-model="form.contact" />
    </el-descriptions-item>
    <el-descriptions-item label="营业时间">
      <el-row :gutter="10">
        <el-col :span="11">
          <el-time-select v-model="form.businessTimeStart" :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30'
          }" placeholder="开始时间" />
        </el-col>
        <el-col :span="2">
          <div style="text-align: center; line-height: 32px;">至</div>
        </el-col>
        <el-col :span="11">
          <el-time-select v-model="form.businessTimeEnd" :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30'
          }" placeholder="结束时间" />
        </el-col>
      </el-row>
    </el-descriptions-item>
    <el-descriptions-item label="预计配送时间（min）">
      <el-select v-model="form.deliveryTime" placeholder="选择时间">
        <el-option v-for="item in deliveryTimeList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="详细介绍">
      <el-input v-model="form.description" type="textarea" :rows="3" />
    </el-descriptions-item>
    <el-descriptions-item label="上传图片">
      <el-upload class="upload-demo" action="#" :on-preview="handlePreview" :on-remove="handleRemove"
        :file-list="fileList" list-type="picture">
        <el-button type="primary">点击上传</el-button>
      </el-upload>
    </el-descriptions-item>
    <el-descriptions-item label="操作" :span="3">
      <el-button type="primary" @click="handleSave">
        保存
      </el-button>
      <el-button @click="handleBack">
        返回
      </el-button>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadFile, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 表单数据
const form = ref({
  shopId: 'xxxxxx', // 店铺编号（不可修改）
  shopName: 'xxx', // 店铺名称
  province: 'xx省', // 省份
  city: 'xx市', // 城市
  address: '', // 具体位置
  station: 'xx站', // 对应站点
  contact: '1xxxxxxxxx', // 联系方式
  businessTimeStart: '00:00', // 营业时间开始
  businessTimeEnd: '23:59', // 营业时间结束
  deliveryTime: '30', // 预计配送时间
  description: 'xxx' // 详细介绍
})

// 省份列表（可根据实际需求扩展）
const provinceList = ref([
  { label: 'xx省', value: 'xx省' },
  { label: 'yy省', value: 'yy省' }
])

// 城市列表（可根据实际需求扩展）
const cityList = ref([
  { label: 'xx市', value: 'xx市' },
  { label: 'yy市', value: 'yy市' }
])

// 对应站点列表（可根据实际需求扩展）
const stationList = ref([
  { label: 'xx站', value: 'xx站' },
  { label: 'yy站', value: 'yy站' }
])

// 预计配送时间列表（可根据实际需求扩展）
const deliveryTimeList = ref([
  { label: '30', value: '30' },
  { label: '45', value: '45' },
  { label: '60', value: '60' }
])

// 上传文件列表
const fileList = ref<UploadFile[]>([])

// 图片预览事件
const handlePreview = (file: UploadFile) => {
  console.log('预览文件：', file)
  // 可实现图片预览逻辑
}

// 移除图片事件
const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  console.log('移除文件：', file, '当前文件列表：', fileList)
  // 可实现移除图片逻辑
}

// 保存按钮事件
const handleSave = () => {
  console.log('表单数据：', form.value)
  // 可实现保存逻辑，如调用接口提交表单数据
}

// 返回按钮事件
const handleBack = () => {
  console.log('返回操作')
  // 可实现返回逻辑，如路由跳转
}

// 头像上传相关
const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('头像图片必须为 JPG 格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过 2MB！')
    return false
  }
  return true
}
</script>

<style scoped>
.upload-demo {
  width: 200px;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
</style>