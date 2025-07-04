import { type RouteRecordRaw } from 'vue-router';

/**
 * 路由树节点结构
 */
interface RouteTreeNode {
  name: string;
  path: string;
  meta: Record<string, any>;
  children?: RouteTreeNode[];
}

/**
 * 从Vue Router中查找指定name的路由，并构建其所有子路由的树形结构
 * @param {RouteRecordRaw[]} routes - Vue Router的路由配置数组
 * @param {string} targetName - 目标路由的name
 * @param {number} maxDepth - 最大递归深度，默认为2（两级子路由）
 * @returns {RouteTreeNode|null} - 返回树形结构或null（如果未找到目标路由）
 */
export function buildRouteTree(routes: RouteRecordRaw[], targetName: string, maxDepth = 2): RouteTreeNode | null {
  // 查找目标路由
  function findTargetRoute(routeList: RouteRecordRaw[]): RouteRecordRaw | null {
    for (const route of routeList) {
      if (route.name === targetName) {
        return route;
      }
      if (route.children && route.children.length > 0) {
        const found = findTargetRoute(route.children);
        if (found) return found;
      }
    }
    return null;
  }

  // 递归构建子路由树
  function buildTree(route: RouteRecordRaw, currentDepth: number): RouteTreeNode[] | undefined {
    if (!route.children || route.children.length === 0 || currentDepth > maxDepth) {
      return undefined;
    }

    return route.children
      .map(child => {
        const node: RouteTreeNode = {
          name: child.name ? String(child.name) : '未命名路由',
          path: child.path,
          meta: child.meta || {},
          children: buildTree(child, currentDepth + 1)
        };
        return node;
      })
      .filter(node => node.children !== undefined); // 过滤掉没有子路由的节点
  }

  // 主逻辑
  const targetRoute = findTargetRoute(routes);
  if (!targetRoute) {
    console.warn(`未找到名称为"${targetName}"的路由`);
    return null;
  }

  const tree: RouteTreeNode = {
    name: targetRoute.name as string || '未命名路由',
    path: targetRoute.path,
    meta: targetRoute.meta || {},
    children: buildTree(targetRoute, 1) || undefined
  };

  return tree;
}

/**
 * 打印路由树（用于调试）
 * @param {RouteTreeNode} tree - 路由树对象
 * @param {number} level - 当前层级，用于缩进
 */
export function printRouteTree(tree: RouteTreeNode | null, level = 0): void {
  if (!tree) return;
  
  const indent = '  '.repeat(level);
  console.log(`${indent}├── ${tree.name} (${tree.path})`);
  
  if (tree.children && tree.children.length > 0) {
    tree.children.forEach(child => {
      printRouteTree(child, level + 1);
    });
  }
}
// import router from './index'
// // 构建并打印路由树
// const tree = buildRouteTree(router.getRoutes(), 'Home');
// printRouteTree(tree);

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