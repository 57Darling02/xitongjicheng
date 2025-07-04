<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
</script>

<template>
  <el-config-provider :z-index="3000">
    <router-view/>
  </el-config-provider>
</template>

<style>
.full_container {
  /* position: absolute;
  top: 0;
  left: 0; */
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
</style>
