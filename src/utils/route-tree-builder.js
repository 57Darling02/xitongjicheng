/**
 * 从Vue Router中查找指定name的路由，并构建其所有子路由的树形结构
 * @param {Array} routes - Vue Router的路由配置数组
 * @param {string} targetName - 目标路由的name
 * @param {number} maxDepth - 最大递归深度，默认为2（两级子路由）
 * @returns {Object|null} - 返回树形结构或null（如果未找到目标路由）
 */
export function buildRouteTree(routes, targetName, maxDepth = 2) {
  // 查找目标路由
  function findTargetRoute(routeList) {
    for (const route of routeList) {
      if (route.name === targetName) {
        return route
      }
      if (route.children && route.children.length > 0) {
        const found = findTargetRoute(route.children)
        if (found) return found
      }
    }
    return null
  }

  // 递归构建子路由树
  function buildTree(route, currentDepth) {
    if (!route.children || route.children.length === 0 || currentDepth > maxDepth) {
      return null
    }

    return route.children
      .map((child) => {
        const node = {
          name: child.name || '未命名路由',
          path: child.path,
          meta: child.meta || {},
          children: buildTree(child, currentDepth + 1),
        }
        return node
      })
      .filter((node) => node !== null) // 过滤掉没有子路由的节点
  }

  // 主逻辑
  const targetRoute = findTargetRoute(routes)
  if (!targetRoute) {
    console.warn(`未找到名称为"${targetName}"的路由`)
    return null
  }

  const tree = {
    name: targetRoute.name || '未命名路由',
    path: targetRoute.path,
    meta: targetRoute.meta || {},
    children: buildTree(targetRoute, 1),
  }

  return tree
}

/**
 * 打印路由树（用于调试）
 * @param {Object} tree - 路由树对象
 * @param {number} level - 当前层级，用于缩进
 */
function printRouteTree(tree, level = 0) {
  if (!tree) return

  const indent = '  '.repeat(level)
  console.log(`${indent}├── ${tree.name} (${tree.path})`)

  if (tree.children && tree.children.length > 0) {
    tree.children.forEach((child) => {
      printRouteTree(child, level + 1)
    })
  }
}

// 示例用法
const router = [
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
        component: () => import('@/views/LoginView.vue'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
      },
      {
        path: 'reset-pwd',
        name: 'ResetPwd',
        component: () => import('@/views/ResetPwdView.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'Customer',
    component: () => import('@/customerApp/views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'Manager',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      requiresAuth: true,
      permission: '1',
    },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/adminApp/views/Dashboard.vue'),
        meta: {
          requiresAuth: true,
          permission: '1-1',
        },
        children: [
          {
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/adminApp/views/Dashboard.vue'),
            meta: {
              requiresAuth: true,
              permission: '0',
            },
          },
          {
            path: 'dashboard2',
            name: 'Dashboard2',
            component: () => import('@/adminApp/views/Dashboard.vue'),
            meta: {
              requiresAuth: true,
              permission: '0',
            },
          },
        ],
      },
      {
        path: 'manageMerchant',
        name: 'ManageMerchant',
        component: () => import('@/adminApp/views/ManageMerchant.vue'),
        meta: {
          requiresAuth: true,
          permission: '1-2',
        },
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/AboutView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
]

// 构建并打印路由树
// const tree = buildRouteTree(router, 'Manager')
// printRouteTree(tree)
// console.log(tree.children)

// 输出结果示例
/*
├── Home (/)
  ├── Dashboard (dashboard)
    ├── Overview (overview)
    ├── Analytics (analytics)
  ├── Settings (settings)
    ├── UserSettings (user)
      ├── Profile (profile)
      ├── Security (security)
    ├── SystemSettings (system)
*/
