<template>
  <div class="bg-gray-50 font-sans text-dark min-h-screen flex flex-col">
    <!-- 顶部导航栏 - 仅在首页显示 -->
    <header v-if="activeTab === 'home'" class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="relative flex-1 max-w-md mx-4">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <i class="fa fa-search text-light"></i>
          </span>
          <input type="text" v-model="searchQuery" placeholder="搜索美食、酒店、景点..."
                 class="w-full pl-10 pr-4 py-2 rounded-full bg-neutral border-0 focus:ring-2 focus:ring-primary/30 focus:outline-none">
        </div>

        <div class="flex items-center">
          <div class="flex items-center mr-4">
            <i class="fa fa-wallet text-primary"></i>
            <span class="ml-1 text-sm">{{ Trainid }}</span>
          </div>
          <i class="fa fa-bell-o text-medium"></i>
        </div>
      </div>
    </header>

    <!-- 主内容区 - 根据activeTab显示不同页面 -->
    <main class="flex-grow" :class="{
      'pt-24 pb-20': activeTab === 'home',
      'pt-4 pb-20': activeTab !== 'home'
    }">
      <!-- 统一用和底部栏适配的容器，这里去掉原有的 container 嵌套，直接让内容自适应 -->
      <div class="w-full max-w-screen-xl mx-auto px-4">
        <!-- 首页内容 -->
        <home-page v-if="activeTab === 'home'"></home-page>
        <!-- 订单页面 -->
        <orders-page v-if="activeTab === 'orders'"></orders-page>
        <!-- 我的页面 -->
        <profile-page v-if="activeTab === 'profile'"></profile-page>
      </div>
    </main>

    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div class="flex justify-around">
        <a href="#" class="flex flex-col items-center py-2 px-4"
           :class="activeTab === 'home' ? 'text-primary border-t-2 border-primary' : 'text-medium'"
           @click.prevent="activeTab = 'home'">
          <i class="fa fa-home text-lg"></i>
          <span class="text-xs mt-1">首页</span>
        </a>

        <a href="#" class="flex flex-col items-center py-2 px-4"
           :class="activeTab === 'orders' ? 'text-primary border-t-2 border-primary' : 'text-medium'"
           @click.prevent="activeTab = 'orders'">
          <i class="fa fa-list text-lg"></i>
          <span class="text-xs mt-1">订单</span>
        </a>

        <a href="#" class="flex flex-col items-center py-2 px-4"
           :class="activeTab === 'profile' ? 'text-primary border-t-2 border-primary' : 'text-medium'"
           @click.prevent="activeTab = 'profile'">
          <i class="fa fa-user-o text-lg"></i>
          <span class="text-xs mt-1">我的</span>
        </a>
      </div>
    </nav>
  </div>
</template>

<script>
// 导入子页面组件
import HomePage from './HomePage.vue'
import OrdersPage from './OrdersPage.vue'
import ProfilePage from './ProfilePage.vue'

export default {
  name: 'Selection',
  components: {
    'home-page': HomePage,
    'orders-page': OrdersPage,
    'profile-page': ProfilePage
  },
  data() {
    return {
      userAvatar: 'https://picsum.photos/seed/user/100/100',
      userName: '张三',
      Trainid: 'G360',
      searchQuery: '',
      currentSlide: 0,
      activeTab: 'home',

      // 分类数据
      categories: [
        { id: 1, name: '美食', icon: 'fa fa-cutlery' },
        { id: 2, name: '周边', icon: 'fa fa-nearing' },
        { id: 3, name: '特产', icon: 'fa fa-gift' }
      ],

      // 促销活动数据
      promotions: [
        {
          id: 1,
          image: 'https://picsum.photos/seed/promo1/800/400',
          title: '新用户立减20元',
          description: '首次下单专享优惠'
        }
      ],

      // 模拟订单数据
      orders: [
        {
          id: 'ORD20250701001',
          shopName: '肯德基',
          products: ['宫保鸡丁套餐', '经典薯条'],
          status: '已完成',
          time: '2025-07-01 12:30',
          amount: 38.9
        },
        {
          id: 'ORD20250630012',
          shopName: '星巴克',
          products: ['经典拿铁咖啡', '巧克力蛋糕'],
          status: '已完成',
          time: '2025-06-30 16:45',
          amount: 52.0
        },
        {
          id: 'ORD20250629034',
          shopName: '海底捞',
          products: ['番茄火锅双人餐'],
          status: '已完成',
          time: '2025-06-29 19:10',
          amount: 198.0
        }
      ],

      // 用户信息
      userInfo: {
        avatar: 'https://picsum.photos/seed/user/100/100',
        name: '张三',
        phone: '138****5678',
        points: 1280,
        level: '白银会员'
      },

      // 功能列表
      profileMenu: [
        { id: 1, icon: 'fa fa-user', name: '个人资料' },
        { id: 2, icon: 'fa fa-credit-card', name: '我的钱包' },
        { id: 3, icon: 'fa fa-heart', name: '收藏夹' },
        { id: 4, icon: 'fa fa-comment', name: '我的评价' },
        { id: 5, icon: 'fa fa-cog', name: '设置' }
      ]
    }
  },
  mounted() {
    // 页面滚动时导航栏效果
    if (this.activeTab === 'home') {
      window.addEventListener('scroll', this.handleScroll)
    }

    // 初始化轮播图自动切换
    if (this.activeTab === 'home') {
      this.startSlideInterval()
    }
  },
  beforeDestroy() {
    // 移除事件监听器，防止内存泄漏
    window.removeEventListener('scroll', this.handleScroll)
    if (this.slideInterval) {
      clearInterval(this.slideInterval)
    }
  },
  methods: {
    // 处理页面滚动
    handleScroll() {
      const header = document.querySelector('header')
      if (header && window.scrollY > 10) {
        header.classList.add('shadow')
      } else if (header) {
        header.classList.remove('shadow')
      }
    },

    // 开始轮播图自动切换
    startSlideInterval() {
      this.slideInterval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.promotions.length
      }, 3000)
    },

    // 刷新推荐商品
    refreshRecommendations() {
      console.log('刷新推荐商品')
      // 模拟刷新推荐，实际项目中可以调用API获取新的推荐数据
      this.recommendedProducts = this.recommendedProducts.map(product => {
        return {
          ...product,
          soldCount: Math.floor(Math.random() * 3000) + 500
        }
      })
    }
  }
}
</script>

<style scoped>
/* 自定义工具类样式 */
.content-auto {
  content-visibility: auto;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.text-shadow {
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.card-hover {
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
}
.card-hover:active {
  transform: translateY(0);
}
</style>