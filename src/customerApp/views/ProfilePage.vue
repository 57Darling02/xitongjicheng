<template>
  <div>
    <!-- 用户信息卡片 -->
    <div class="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-b-3xl shadow-lg mb-6">
      <div class="flex items-center">
        <img :src="$parent.userInfo.avatar" alt="用户头像" class="w-16 h-16 rounded-full border-2 border-white shadow-md">
        <div class="ml-4">
          <h3 class="font-bold text-lg">{{ $parent.userInfo.name }}</h3>
          <p class="text-white/80 text-sm mt-1">{{ $parent.userInfo.level }} · {{ $parent.userInfo.points }}积分</p>
        </div>
        <button class="ml-auto bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors">
          <i class="fa fa-cog"></i>
        </button>
      </div>
    </div>

    <!-- 快捷功能 -->
    <div class="grid grid-cols-4 gap-3 mb-6">
      <div class="bg-white rounded-xl p-4 text-center shadow-sm card-hover">
        <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
          <i class="fa fa-ticket text-xl"></i>
        </div>
        <p class="text-xs">我的订单</p>
      </div>
      <div class="bg-white rounded-xl p-4 text-center shadow-sm card-hover">
        <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
          <i class="fa fa-gift text-xl"></i>
        </div>
        <p class="text-xs">优惠券</p>
      </div>
      <div class="bg-white rounded-xl p-4 text-center shadow-sm card-hover">
        <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
          <i class="fa fa-heart text-xl"></i>
        </div>
        <p class="text-xs">收藏</p>
      </div>
      <div class="bg-white rounded-xl p-4 text-center shadow-sm card-hover">
        <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
          <i class="fa fa-question-circle text-xl"></i>
        </div>
        <p class="text-xs">帮助中心</p>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="space-y-1">
      <div v-for="menu in $parent.profileMenu" :key="menu.id"
           class="bg-white p-4 flex items-center justify-between shadow-sm card-hover">
        <div class="flex items-center">
          <i :class="menu.icon" class="text-primary mr-3"></i>
          <span>{{ menu.name }}</span>
        </div>
        <i class="fa fa-angle-right text-light"></i>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="mt-6">
      <button class="w-full bg-white text-red-500 py-3 rounded-xl shadow-sm flex items-center justify-center" @click="userStore.logout">
        <i class="fa fa-sign-out mr-2"></i>
        <span>退出登录</span>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
</script>