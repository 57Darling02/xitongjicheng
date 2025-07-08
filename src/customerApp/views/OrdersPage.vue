<template>
  <div>
    <!-- 订单分类标签 -->
    <div class="flex border-b border-border mb-4">
      <button
          v-for="(tab, index) in orderTabs"
          :key="index"
          class="flex-1 py-3 text-center"
          :class="activeOrderTab === index ? 'text-primary border-b-2 border-primary' : 'text-medium' "
          @click="activeOrderTab = index"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 订单列表 - 全部订单 -->
    <div v-if="activeOrderTab === 0">
      <div
          v-for="order in $parent.orders"
          :key="order.id"
          class="mb-4 bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div class="p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-lg">{{ order.shopName }}</h3>
              <p class="text-sm text-medium mt-1">{{ order.time }}</p>
            </div>
            <span :class="getStatusClass(order.status)">{{ order.status }}</span>
          </div>

          <div class="mt-3 flex flex-wrap gap-2">
            <span
                v-for="(product, index) in order.products"
                :key="index"
                class="text-sm bg-gray-100 px-2 py-1 rounded"
            >{{ product }}</span>
          </div>

          <div class="flex justify-between items-center mt-4 pt-4 border-t border-border">
            <div>
              <span class="text-sm text-medium">实付</span>
              <span class="text-primary font-medium ml-1">¥{{ order.amount }}</span>
            </div>
            <button class="text-primary text-sm flex items-center">
              查看详情 <i class="fa fa-angle-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单列表 - 待付款 -->
    <div v-if="activeOrderTab === 1" class="text-center py-10">
      <i class="fa fa-shopping-cart text-4xl text-light mb-3"></i>
      <p class="text-medium">暂无待付款订单</p>
    </div>

    <!-- 订单列表 - 待使用 -->
    <div v-if="activeOrderTab === 2" class="text-center py-10">
      <i class="fa fa-clock-o text-4xl text-light mb-3"></i>
      <p class="text-medium">暂无待使用订单</p>
    </div>

    <!-- 订单列表 - 待评价 -->
    <div v-if="activeOrderTab === 3" class="text-center py-10">
      <i class="fa fa-comment-o text-4xl text-light mb-3"></i>
      <p class="text-medium">暂无待评价订单</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrdersPage',
  data() {
    return {
      orderTabs: ['全部', '待付款', '待使用', '待评价'],
      activeOrderTab: 0
    }
  },
  methods: {
    getStatusClass(status) {
      const statusClasses = {
        '已完成': 'text-green-500',
        '待付款': 'text-red-500',
        '待使用': 'text-yellow-500',
        '已取消': 'text-gray-500'
      }
      return statusClasses[status] || 'text-medium'
    }
  }
}
</script>

<style scoped>
/* 可根据实际视觉需求补充订单页专属样式，比如调整卡片间距、字体大小等 */
</style>