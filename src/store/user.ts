import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const roles = ['admin', 'merchant', 'customer'] as const
export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    username: '',
    role: 'merchant' as typeof roles[number]
  })
  const isLoggedIn = computed(() => !!userInfo.value.username)
  const getPermissions =async () => {
    try {
      // Simulate an API call to get permissions based on user role
      if (!isLoggedIn.value) return []
      const permissions = {
        admin: ['1','1-1','1-2'],
        merchant: ['1'],
        customer: ['2']
      }
      return permissions[userInfo.value.role] || []
    }catch{
      return []
    }
    
  }
  const hasPermission = async(permission: string) => {
    const permissions: string[] = await getPermissions()
    if (!permissions.length) return false
    return permissions.includes(permission)
  }


  async function login(username: string, password: string, role: (typeof roles)[number]) {
    if (username == '' || password == '') return false
    userInfo.value = {
      username,
      role: role
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    return true
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
  initUser()
  return {
    userInfo,
    isLoggedIn,
    login,
    logout,
    initUser,
    getPermissions,
    hasPermission
  }
})  