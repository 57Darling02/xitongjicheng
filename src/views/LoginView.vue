<template>
    <div class="login-header fade-item" style="--delay: 0.05s;">
        <img id="logo" src="@/assets/logo.svg" alt="" />
        <div class="login-title">铁路购-后台管理系统</div>
    </div>
    <el-form class="login-content fade-item" style="--delay: 0.1s;max-width: 300px;margin:25px 25px;" :model="form"
        :rules="rules" ref="formRef">
        <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名" style="--el-input-border-radius:15px">
                <template #prepend>
                    <el-icon>
                        <User />
                    </el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="form.password" @keyup.enter="onSubmit"
                style="--el-input-border-radius:15px">
                <template #prepend>
                    <el-icon>
                        <Lock />
                    </el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="登入身份">
            <el-radio-group v-model="form.role">
                <el-radio value="admin">管理员</el-radio>
                <el-radio value="merchant">商家</el-radio>
                <el-radio value="customer">顾客</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item>
            <div style="flex: 1;justify-content: center;align-items: center;display: flex;">
                <el-button style="width: 60%;" type="primary" @click="onSubmit" plain round>登录</el-button>

            </div>
        </el-form-item>
        <el-form-item>
            <el-link type="primary" @click="$router.push({ name: 'ResetPwd' })">忘记密码</el-link>
            <p class="login-text" style="flex: 1;justify-content: end;align-items: center;display: flex;">
                没有账号？<el-link type="primary" @click="$router.push({ name: 'Register' })">立即注册</el-link>
            </p>
        </el-form-item>


    </el-form>
</template>
<script lang='ts' setup>
import { reactive, useTemplateRef } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { useUserStore, roles } from '@/store/user'
const userStore = useUserStore()
const formRef = useTemplateRef<FormInstance>('formRef')
const form = reactive({
    username: '',
    password: '',
    role: 'merchant' as (typeof roles)[number],
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
            userStore.login(form.username, form.password, form.role)
            window.open('/', '_self')
        } else {
            ElMessage.error('登录失败');
        }
    });
}



</script>
<style lang="scss" scoped>
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
</style>