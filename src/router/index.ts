import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../store/user'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'Auth' },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/AuthView.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue')
      },
      {
        path: 'reset-pwd',
        name: 'ResetPwd',
        component: () => import('@/views/ResetPwdView.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'Customer',
    component: () => import('@/customerApp/views/AboutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    name: 'Manager',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      requiresAuth: true,
      permission: '1'
    },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/adminApp/views/Dashboard.vue'),
        meta: {
          requiresAuth: true,
          title: '总览',
          icon: 'fa-solid fa-grid-horizontal'
        },
      },
      {
        path: 'queryTrainInfo',
        name: 'queryTrainInfo',
        component: () => import('@/views/QueryTrainInfo.vue'),
        meta: {
          title: '查询车次信息',
          icon: 'fa-solid fa-train'
        }
      },
      {
        path: 'manageMerchant',
        name: 'ManageMerchant',
        component: () => import('@/adminApp/views/ManageMerchant.vue'),
        meta: {
          requiresAuth: true,
          permission: '1-2',
          title: '商家管理',
        }
      },
      {
        path: 'manageOrder',
        name: 'adminManageOrder',
        component: () => import('@/adminApp/views/ManageOrder.vue'),
        meta: {
          requiresAuth: true,
          permission: '1-2',
          title: '订单管理',
        }
      },
      {
        path: 'manageOrder',
        name: 'merchantManageOrder',
        component: () => import('@/merchantApp/views/ManageOrder.vue'),
        meta: {
          requiresAuth: true,
          permission: '1-3',
          title: '订单管理',
        }
      },
      {
        path: 'manageCustomer',
        name: 'ManageCustomer',
        component: () => import('@/adminApp/views/ManageCustomer.vue'),
        meta: {
          requiresAuth: true,
          permission: '1-2',
          title: '用户管理',
        }
      },
      {
        path: 'manageGoods',
        name: 'ManageGoods',
        component: () => import('@/merchantApp/views/ManageGoods.vue'),
        meta: {
          requiresAuth: true,
          permission: '1-3',
          title: '商品管理',
        }
      },
      {
        path: 'modifyMerchantInformation',
        name: 'ModifyMerchantInformation',
        component: () => import('@/merchantApp/views/ModifyMerchantInformation.vue'),
        meta: {
          requiresAuth: true,
          permission: '1-3',
          title: '商家信息管理',
        }
      },
      {
        path: 'more',
        name: 'More',
        meta: {
          title: '更多',
        },
        children: [
          {
            path: 'about',
            name: 'About',
            component: () => import('@/views/AboutView.vue'),
            meta: {
              title: '关于本软件',
            },
          },
        ],
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  const permissions = await userStore.getPermissions()
  console.log('Navigating to:', to.name, 'from:', from.name, 'Permissions:', permissions)
  if (to.meta.requiresAuth && !permissions.length) {
    return { name: 'Auth' }
  }
  if (to.meta.permission && !permissions.includes(to.meta.permission as string)) {
    return { name: 'NotFound' }
  }
})
export default router
