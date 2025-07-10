import router from '@/router'
import axios from "axios";

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const roles = ['admin', 'merchant', 'customer'] as const
export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    username: '',
    id: '',
    role: 'merchant' as typeof roles[number]
  })
  const isLoggedIn = computed(() => !!userInfo.value.username)
  const getPermissions = async () => {
    try {
      if (!isLoggedIn.value) return []
      const permissions = {
        admin: ['1', '1-1', '1-2'],
        merchant: ['1', '1-3'],
        customer: ['2']
      }
      return permissions[userInfo.value.role] || []
    } catch {
      return []
    }

  }
  const hasPermission = async (permission: string) => {
    const permissions: string[] = await getPermissions()
    if (!permissions.length) return false
    return permissions.includes(permission)
  }


  async function login(username: string, password: string, role: (typeof roles)[number]) {
    try {
      let options;
      let response;
      switch (role) {
        case 'admin':
          options = {
            method: 'POST',
            url: '/api/admin/login',
            headers: {
              'Content-Type': 'application/json',
            },
            data: { username, password }
          };
          response = await axios.request(options);
          ElMessage.success('登录成功');
          userInfo.value = {
            username: username,
            id: 'admin',
            role: role
          }
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
          window.open('/', '_self')
          return true
        case 'merchant':
          options = {
            method: 'POST',
            url: '/api/commercial/login',
            headers: {
              'Content-Type': 'application/json',
            },
            data: { username, password }
          };
          response = await axios.request(options);
          ElMessage.success('登录成功');
          userInfo.value = {
            username: response.data.username,
            id: response.data.commercial_id,
            role: role
          }
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
          window.open('/', '_self')
          return true
        case 'customer':
          userInfo.value = {
            username: username,
            id: 'admin',
            role: role
          }
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))

          window.open('/', '_self')
          return true
        default:
          break;
      }
    } catch {
      ElMessage.error('登录失败');
      return false
    }

  }
    async function register(username: string, password: string, role: (typeof roles)[number]) {
    try {
      let options;
      let response;
      switch (role) {
        case 'admin':
          options = {
            method: 'POST',
            url: '/api/admin/login',
            headers: {
              'Content-Type': 'application/json',
            },
            data: { username, password }
          };
          response = await axios.request(options);
          ElMessage.success('登录成功');
          userInfo.value = {
            username: username,
            id: 'admin',
            role: role
          }
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
          window.open('/', '_self')
          return true
        case 'merchant':
          options = {
            method: 'POST',
            url: '/api/commercial/register',
            headers: {
              'Content-Type': 'application/json',
            },
            data: { username, password }
          };
          response = await axios.request(options);
          ElMessage.success(response.data.message);
          userInfo.value = {
            username: response.data.username,
            id: response.data.commercial_id,
            role: role
          }
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
          window.open('/', '_self')
          return true
        case 'customer':
          userInfo.value = {
            username: username,
            id: 'admin',
            role: role
          }
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
          window.open('/', '_self')
          return true
        default:
          break;
      }
    } catch {
      ElMessage.error('登录失败');
      return false
    }

  }

  
  function logout() {
    userInfo.value = { username: '', id: '', role: 'merchant' }
    localStorage.removeItem('userInfo')
    router.push({ name: 'Login' })
  }

  function initUser() {
    const storedUser = localStorage.getItem('userInfo')
    if (storedUser) {
      userInfo.value = JSON.parse(storedUser)
    }
  }
  initUser()
  return {
    userInfo,
    isLoggedIn,
    login,
    logout,
    initUser,
    getPermissions,
    hasPermission,
    register
  }
})  