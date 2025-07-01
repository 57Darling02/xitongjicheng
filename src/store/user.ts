import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
const roles = ['admin', 'merchant', 'consumer'] as const
export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    username: '',
    role: 'merchant' as typeof roles[number]
  })

  const isLoggedIn = computed(() => !!userInfo.value.username)
  const userRole = computed(() => userInfo.value.role)

  function login(username: string, password: string) {

    // 模拟登录验证
    const mockUsers = {
      admin: { role: 'admin' },
      merchant: { role: 'merchant' },
      consumer: { role: 'consumer' }
    } as Record<string, { role: typeof roles[number] }>
    
    if (mockUsers[username]) {
      userInfo.value = {
        username,
        role: mockUsers[username].role
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return true
    }
    return false
  }

  function logout() {
    userInfo.value = { username: '', role: 'merchant' }
    localStorage.removeItem('userInfo')
  }

  function initUser() {
    const storedUser = localStorage.getItem('userInfo')
    if (storedUser) {
      userInfo.value = JSON.parse(storedUser)
    }
  }

  return {
    userInfo,
    isLoggedIn,
    userRole,
    login,
    logout,
    initUser
  }
})  