<template>
  <div style="padding: 16px;">
    <!-- 查询条件区域 -->
    <el-space wrap :size="12">
      <el-input v-model="goodsNo" placeholder="商品编号" style="width: 160px;" />
      <el-input v-model="goodsName" placeholder="商品名称" style="width: 200px;" />
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button type="primary" @click="dialogFormVisible = true">新增商品</el-button>
    </el-space>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%; margin-top: 16px;" v-loading="loading" border>
      <!-- 多选框列 -->
      <el-table-column type="selection" width="55" />
      <!-- 使用接口字段更新列 -->
      <el-table-column prop="commodity_id" label="商品编号" width="120" />
      <el-table-column prop="image_url" label="商品图片" width="120">
        <template #default="scope">
          <el-image v-if="scope.row.image_url" :src="scope.row.image_url" style="width: 80px; height: 80px"
            fit="cover" />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="commodity_name" label="商品名称" width="120" />
      <el-table-column prop="commodity_stock" label="商品库存" width="100" />
      <el-table-column prop="commodity_situation" label="商品描述" width="200" />
      <el-table-column prop="commodity_price" label="商品价格" width="100" />
      <el-table-column prop="safety_stock" label="安全库存" width="100" />
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <el-button @click="">增加库存</el-button>
          <el-button @click="handleDownGood(scope.row)">下架商品</el-button>
          <el-button @click="">更多</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogFormVisible" title="新增商品" width="500">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="商品名称" :label-width="formLabelWidth" prop="commodity_name">
        <el-input v-model="form.commodity_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品价格" :label-width="formLabelWidth" prop="commodity_price">
        <el-input-number v-model="form.commodity_price" :min="0" />
      </el-form-item>
      <el-form-item label="商品库存" :label-width="formLabelWidth" prop="commodity_stock">
        <el-input-number v-model="form.commodity_stock" :min="0" />
      </el-form-item>
      <el-form-item label="商品描述" :label-width="formLabelWidth" prop="commodity_situation">
        <el-input v-model="form.commodity_situation" type="textarea" />
      </el-form-item>
      <el-form-item label="商品图片" :label-width="formLabelWidth" prop="image_url">
        <el-upload ref="upload" class="upload-demo" action="/api/commodity/upload_image" :limit="1"
          :on-exceed="handleExceed" :auto-upload="false" :on-success="handleUploadSuccess"
          :on-error="handleUploadError">
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <el-button class="ml-3" type="success" @click="submitUpload">
            上传到服务器
          </el-button>
          <template #tip>
            <div class="el-upload__tip text-red">
              限制 1 个文件，新文件将覆盖旧文件
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="安全库存" :label-width="formLabelWidth" prop="safety_stock">
        <el-input-number v-model="form.safety_stock" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { ElMessage, genFileId } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
const loading = ref(false);
import type { FormInstance, UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
const dialogFormVisible = ref(false);
const formRef = ref<FormInstance>();

const form = reactive({
  commodity_name: '',
  commodity_price: 0,
  commodity_stock: 0,
  commodity_situation: '',
  image_url: '',
  safety_stock: 0,
});

const formLabelWidth = '140px';

const rules = {
  commodity_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  commodity_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  commodity_stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
  commodity_situation: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
  image_url: [{ required: true, message: '请输入商品图片地址', trigger: 'blur' }],
  safety_stock: [{ required: true, message: '请输入安全库存', trigger: 'blur' }],
};

const upload = ref<UploadInstance>();
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
const submitUpload = () => {
  upload.value!.submit();
};
const handleUploadSuccess = (response: any) => {
  console.log(response.image_url)
  if (response.image_url) {
    form.image_url = response.image_url;
    ElMessage.success('图片上传成功');
  } else {
    ElMessage.error('图片上传失败，未获取到图片地址');
  }
};
const handleUploadError = () => {
  ElMessage.error('图片上传失败');
};

// 查询条件绑定变量
const goodsNo = ref('');
const goodsName = ref('');

interface commodity {
  c_id: number;
  commodity_id: string;
  commodity_situation: string;
  commodity_name: string;
  commodity_price: number;
  commodity_stock: number;
  image_url: string;
  safety_stock: number;
}

const tableData = ref<commodity[]>([]);

// 查询按钮事件
const handleQuery = async () => {
  loading.value = true;
  try {
    let response;
    response = await axios.get(`/api/commodity/list`);
    // if (goodsName.value){

    // }else if (goodsNo.value){

    // }else{

    // }
    if (response && response.data) {
      tableData.value = response.data.commodities as commodity[];
    }
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const options = {
          method: 'POST',
          url: '/api/commodity/add',
          data: form
        };
        const response = await axios.request(options);
        ElMessage.success('商品新增成功');
        dialogFormVisible.value = false;
        await handleQuery();
      } catch (error) {
        ElMessage.error('商品新增失败');
        console.error(error);
      }
    }
  });
};

// 下架商品按钮事件
const handleDownGood = async (row: commodity) => {
  try {
    const options = {
      method: 'DELETE',
      url: `/api/commodity/delete/${row.c_id}`,
    };
    const response = await axios.request(options);
    console.log(response.data);
    // 下架成功后重新查询数据
    await handleQuery();
  } catch (error) {
    ElMessage.error(error as string);
  }
};

// 更多按钮事件
const handleMore = () => {
  console.log('执行更多操作');
  // 可展开更多功能，如查看商品详情、编辑商品信息等
};
onMounted(async () => {
  await handleQuery();
});
</script>

<style scoped>
.el-image {
  border: 1px solid #eee;
}
</style>