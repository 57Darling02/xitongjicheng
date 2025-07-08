<template>
  <div>
    <!-- 分类导航 -->
    <section class="mb-6">
      <h2 class="text-lg font-semibold mb-4">快速分类</h2>
      <div class="grid grid-cols-5 gap-4">
        <!-- 分类项 -->
        <div v-for="category in $parent.categories" :key="category.id"
             class="card-hover flex flex-col items-center p-3 bg-white rounded-lg shadow-sm"
             @click="$parent.navigateToCategory(category)">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <i :class="category.icon" class="text-xl"></i>
          </div>
          <span class="mt-2 text-sm font-medium">{{ category.name }}</span>
        </div>
      </div>
    </section>

    <!-- 优惠活动轮播 -->
    <section class="mb-6">
      <h2 class="text-lg font-semibold mb-4">热门活动</h2>
      <div class="relative overflow-hidden rounded-xl shadow-sm">
        <div class="flex space-x-4 scrollbar-hide overflow-x-auto pb-2">
          <div v-for="(promo, index) in $parent.promotions" :key="promo.id"
               class="flex-shrink-0 w-[90%] md:w-[48%] lg:w-[32%] rounded-lg overflow-hidden shadow-sm">
            <img :src="promo.image" alt="促销活动" class="w-full h-40 object-cover">
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <h3 class="text-white font-medium text-shadow">{{ promo.title }}</h3>
              <p class="text-white/80 text-sm text-shadow">{{ promo.description }}</p>
            </div>
          </div>
        </div>

        <!-- 轮播指示器 -->
        <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <span v-for="(_, index) in $parent.promotions" :key="index"
                :class="['w-2', 'h-2', 'rounded-full', $parent.currentSlide === index ? 'bg-primary' : 'bg-white/50']"></span>
        </div>
      </div>
    </section>

    <!-- 热门商家 -->
    <section class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">热门商家</h2>
        <a href="#" class="text-primary text-sm flex items-center">
          查看更多 <i class="fa fa-angle-right ml-1"></i>
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 商家卡片 -->
        <div v-for="shop in hotShops" :key="shop.id"
             class="card-hover bg-white rounded-xl shadow-sm overflow-hidden"
             @click="$parent.viewShopDetails(shop)">
          <div class="relative">
            <img :src="shop.image" alt="商家图片" class="w-full h-40 object-cover">
            <span v-if="shop.tag" class="absolute top-2 left-2"
                  :class="['bg-primary', 'text-white', 'text-xs', 'px-2', 'py-1', 'rounded-full']">
              {{ shop.tag }}
            </span>
          </div>

          <div class="p-4">
            <div class="flex justify-between items-start">
              <h3 class="font-medium text-lg">{{ shop.name }}</h3>
              <div class="flex items-center">
                <i class="fa fa-star text-secondary text-xs"></i>
                <span class="ml-1 text-sm font-medium">{{ shop.rating }}</span>
              </div>
            </div>

            <div class="flex items-center mt-2 text-sm text-medium">
              <span>{{ shop.category }}</span>
              <span class="mx-2">·</span>
              <span>{{ shop.reviewCount }}条评价</span>
            </div>

            <div class="flex items-center mt-2 text-sm text-medium">
              <i class="fa fa-map-marker text-light mr-1"></i>
              <span>{{ shop.distance }}km</span>
              <span class="mx-2">·</span>
              <span>人均¥{{ shop.averagePrice }}</span>
            </div>

            <div class="mt-3">
              <span v-for="(discount, index) in shop.discounts" :key="index"
                    class="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded mr-2 mb-1">
                  {{ discount }}
                </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐商品 -->
    <section>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">为你推荐</h2>
        <a href="#" @click.prevent="$parent.refreshRecommendations"
           class="text-primary text-sm flex items-center">
          换一批 <i class="fa fa-refresh ml-1"></i>
        </a>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- 商品卡片 -->
        <div v-for="product in recommendedProducts" :key="product.id"
             class="card-hover bg-white rounded-xl shadow-sm overflow-hidden"
             @click="$parent.viewProductDetails(product)">
          <div class="relative">
            <img :src="product.image" alt="商品图片" class="w-full h-32 object-cover">
            <span v-if="product.tag" class="absolute top-2 left-2"
                  :class="['bg-primary', 'text-white', 'text-xs', 'px-2', 'py-1', 'rounded-full']">
              {{ product.tag }}
            </span>
          </div>

          <div class="p-3">
            <h3 class="font-medium text-base line-clamp-1">{{ product.name }}</h3>
            <p class="text-xs text-medium mt-1 line-clamp-1">{{ product.shopName }}</p>

            <div class="flex justify-between items-center mt-3">
              <div>
                <span class="text-primary font-medium">¥{{ product.price }}</span>
                <span v-if="product.originalPrice" class="text-light text-xs line-through ml-1">¥{{ product.originalPrice }}</span>
              </div>
              <span class="text-xs text-light">已售{{ product.soldCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      hotShops: [
        {
          id: 1,
          name: '肯德基',
          image: 'https://picsum.photos/seed/shop1/600/300',
          tag: '新店特惠',
          rating: '4.8',
          category: '快餐',
          reviewCount: '3862',
          distance: '2.3',
          averagePrice: '35',
          discounts: ['满30减5', '满50减10', '第二份半价']
        },
        {
          id: 2,
          name: '海底捞',
          image: 'https://picsum.photos/seed/shop2/600/300',
          tag: '人气爆款',
          rating: '4.9',
          category: '火锅',
          reviewCount: '12864',
          distance: '4.7',
          averagePrice: '128',
          discounts: ['满100减20', '免费小吃']
        },
        {
          id: 3,
          name: '星巴克',
          image: 'https://picsum.photos/seed/shop3/600/300',
          rating: '4.7',
          category: '咖啡',
          reviewCount: '5642',
          distance: '1.5',
          averagePrice: '45',
          discounts: ['买一送一', '新品上市']
        },
        {
          id: 4,
          name: '喜茶',
          image: 'https://picsum.photos/seed/shop4/600/300',
          tag: '新店特惠',
          rating: '4.6',
          category: '茶饮',
          reviewCount: '7895',
          distance: '3.2',
          averagePrice: '28',
          discounts: ['满25减3', '第二杯半价']
        }
      ],
      recommendedProducts: [
        {
          id: 1,
          name: '宫保鸡丁套餐',
          image: 'https://picsum.photos/seed/food1/400/300',
          tag: '热销',
          shopName: '肯德基',
          price: '28.9',
          originalPrice: '39.9',
          soldCount: '1286'
        },
        {
          id: 2,
          name: '招牌汉堡套餐',
          image: 'https://picsum.photos/seed/food2/400/300',
          tag: '爆款',
          shopName: '麦当劳',
          price: '32.5',
          originalPrice: '45.0',
          soldCount: '2451'
        },
        {
          id: 3,
          name: '经典拿铁咖啡',
          image: 'https://picsum.photos/seed/food3/400/300',
          shopName: '星巴克',
          price: '25.0',
          originalPrice: '32.0',
          soldCount: '895'
        },
        {
          id: 4,
          name: '霸气草莓冰沙',
          image: 'https://picsum.photos/seed/food4/400/300',
          tag: '新品',
          shopName: '喜茶',
          price: '29.0',
          originalPrice: '33.0',
          soldCount: '562'
        },
        {
          id: 5,
          name: '番茄火锅双人餐',
          image: 'https://picsum.photos/seed/food5/400/300',
          shopName: '海底捞',
          price: '198.0',
          originalPrice: '268.0',
          soldCount: '1024'
        },
        {
          id: 6,
          name: '羊肉串10串',
          image: 'https://picsum.photos/seed/food6/400/300',
          tag: '爆款',
          shopName: '北疆烧烤',
          price: '39.9',
          originalPrice: '49.9',
          soldCount: '1568'
        },
        {
          id: 7,
          name: '珍珠奶茶大杯',
          image: 'https://picsum.photos/seed/food7/400/300',
          shopName: 'CoCo都可',
          price: '12.0',
          originalPrice: '15.0',
          soldCount: '2895'
        },
        {
          id: 8,
          name: '经典寿司拼盘',
          image: 'https://picsum.photos/seed/food8/400/300',
          tag: '热销',
          shopName: '元气寿司',
          price: '58.0',
          originalPrice: '72.0',
          soldCount: '786'
        }
      ]
    }
  }
}
</script>