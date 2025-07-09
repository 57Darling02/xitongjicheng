<template>

  <el-space style="max-width: 100%;" wrap>
    <ProfieldCard :avatar="cxz" name="陈炫茱" bio="数据处理和后端设计" />
    <ProfieldCard :avatar="wyx" name="王一昕" bio="用户端UI设计" />
    <ProfieldCard :avatar="ljj" name="刘俊佳" bio="报告和PPT设计" />
    <ProfieldCard :avatar="yax" name="余安心" bio="数据库设计" />
    <ProfieldCard :avatar="crj" name="陈润均" bio="报告和PPT设计" />
    <ProfieldCard :avatar="a" name="友人A" position="." bio="其他" />
  </el-space>


</template>
<script lang='ts' setup>
import ProfieldCard from '@/components/ProfileCard.vue'
import crj from "@/assets/team/crj.jpg"
import ljj from "@/assets/team/ljj.jpg"
import wyx from "@/assets/team/wyx.jpg"
import yax from "@/assets/team/yax.jpg"
import cxz from "@/assets/team/cxz.jpg"
import a from "@/assets/team/a.png"
</script>
<style lang="scss" scoped></style>