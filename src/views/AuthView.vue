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
