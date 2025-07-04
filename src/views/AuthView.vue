<template>
  <Loading v-if="false" />
  <div class="full_container" id="login_container">
    <div class="a-card" style="background-color: whitesmoke;" id="">
      <RouterView />
    </div>
  </div>
</template>
<script lang='ts' setup>
import Loading from '@/components/Loading.vue';
import router from '@/router';
import { useUserStore } from '@/store/user';
import { onMounted } from 'vue';


const userStore = useUserStore();

onMounted(async () => {
  if (router.currentRoute.value.name === 'Auth') {
    console.log('Checking user permissions...');
    const permissions = await userStore.getPermissions();
    console.log('User permissions:', permissions);
    if (permissions.length == 0) {
      // If no permissions, redirect to login
      router.push({ name: 'Login' });
      console.log('No permissions, redirecting to login');
    } else if (permissions.includes('1')) {
      router.push({ name: 'Manager' });
      console.log('Manager');
    } else {
      router.push({ name: 'Customer' });
      console.log('Customer');
    }
  }


})



</script>
<style scoped>
#login_container {
  z-index: -1;
  background: url(@/assets/img/bg.png) center/cover no-repeat;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
