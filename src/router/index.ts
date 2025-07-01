import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../store/user'
const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/AuthView.vue'),
    redirect: { name: 'Login' },
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
    redirect: '/dashboard',
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/AuthView.vue'),
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/admin',
  //   name: 'AdminPanel',
  //   component: () => import('../views/admin/AdminPanel.vue'),
  //   meta: { requiresAuth: true, requiredRole: 'admin' }
  // },
  // {
  //   path: '/editor',
  //   name: 'EditorPanel',
  //   component: () => import('../views/editor/EditorPanel.vue'),
  //   meta: { requiresAuth: true, requiredRole: 'editor' }
  // },
  // {
  //   path: '/viewer',
  //   name: 'ViewerPanel',
  //   component: () => import('../views/viewer/ViewerPanel.vue'),
  //   meta: { requiresAuth: true, requiredRole: 'viewer' }
  // },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('../views/NotFound.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach((to, from) => {
  const userStore = useUserStore()
  console.log('Navigating to:', to.name, 'from:', from.name,userStore.isLoggedIn)
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return { name: 'Auth' }
  }
  if (to.meta.requiredRole && userStore.userRole !== to.meta.requiredRole) {
    return { name: 'Dashboard' }
  }
})
export default router
