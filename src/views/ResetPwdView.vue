<template>
    <div class="login-header fade-item" style="--delay: 0.05s;">
        <img id="logo" src="@/assets/logo.svg" alt="" />
        <div class="login-title">铁路购-后台管理系统</div>
    </div>
    <div class="content" style="margin:25px 25px;flex-direction: column;width: 300px">
        <div class="content-text fade-item" style="--delay: 0.1s;">暂不开放该功能</div>
        <el-button class="fade-item" style="width: 60%;--delay: 0.1s;" type="primary" @click="$router.push({ name: 'Login' })" plain round>返回登录</el-button>
    </div>

    <p class="login-text fade-item" style="--delay: 0.2s;flex: 1;justify-content: end;align-items: center;display: flex;margin:25px 25px;">
        已有账号？<el-link type="primary" @click="$router.push({ name: 'Login' })">返回登录</el-link>
    </p>
</template>
<script lang='ts' setup>
import { reactive, useTemplateRef } from 'vue'
import type { FormInstance } from 'element-plus'
import router from '@/router'
const formRef = useTemplateRef<FormInstance>('formRef')
const form = reactive({
    username: '',
    password: '',
    role: 'merchant',
})
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
})
const onSubmit = async () => {
    if (!formRef.value) return
    formRef.value.validate((valid: boolean) => {
        if (valid) {
            ElMessage.success('登录成功');
            console.log(form)
            router.push({ name: 'DashBorad' })
        } else {
            ElMessage.error('登录失败');
        }
    });
}
</script>
<style lang="scss" scoped>
.content,
.login-header {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

#logo {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}

.login-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}
.content-text{
    font-size: 18px;
    font-weight: bold;
    color: #333;
}
</style>