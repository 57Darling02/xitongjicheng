<template>
    <el-container style="height: 100vh;">
        <el-header>
            <div class="header-left">
                <img class="logo" src="@/assets/logo.svg" alt="" />
                <div class="web-title">轨易购--后台管理系统</div>
            </div>
            <div class="title">
                <el-popover :width="300"
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                    <template #reference>
                        <el-avatar :src="avatarurl" />
                    </template>
                    
                    <template #default>
                        
                        <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column">
                            <el-avatar :size="60" :src="avatarurl" style="margin-bottom: 8px" />
                            <div>
                                <p class="demo-rich-content__name" style="margin: 0; font-weight: 500">
                                    {{ userStore.userInfo.username }}
                                </p>
                                <p class="demo-rich-content__mention"
                                    style="margin: 0; font-size: 14px; color: var(--el-color-info)">
                                    @{{ userStore.userInfo.role }}
                                </p>
                            </div>
                            <p class="demo-rich-content__desc" style="display: flex;gap:2px">
                                可访问模块: <el-tag type="success" v-for="(perm, idx) in permissions">{{ perm }}</el-tag>
                            </p>
                            <el-button @click="userStore.logout">退出</el-button>
                        </div>
                        
                    </template>
                </el-popover>
            </div>
        </el-header>
        <el-container id="main-container">
            <div id="aside">
                <div id="aside-collapse-btn">
                    <el-button @click="isCollapse = !isCollapse;">
                        <el-icon class="fa-solid fa-ellipsis-vertical" :class="{ 'rotate-90': !isCollapse }"></el-icon>
                    </el-button>
                </div>
                <el-scrollbar style="height: calc(100% - var(--el-menu-item-height));">
                    <el-menu :default-active="showRoute?.path" :collapse="isCollapse" router id="aside_menu">
                        <template v-for="route in filteredRoutes" :key="route.name">
                            <el-menu-item v-if="!route.children" :route="{ name: route.name }" :index="route.path">
                                <el-icon :class="route.meta?.icon ?? `fa-solid fa-ellipsis-vertical`" />
                                <template #title>
                                    <span>{{ route.meta?.title || route.name }}</span>
                                </template>
                            </el-menu-item>
                            <el-sub-menu v-else :index="route.path">
                                <template #title>
                                    <el-icon :class="route.meta?.icon ?? `fa-solid fa-ellipsis-vertical`" />
                                    <span>{{ route.meta?.title || route.name }}</span>
                                </template>
                                <template v-for="child in route.children" :key="child.name">
                                    <el-menu-item :route="{ name: child.name }" :index="child.path"
                                        :disabled="child.meta?.permission && !permissions.includes(child.meta?.permission as string)">
                                        <template #title>
                                            <el-icon :class="child.meta?.icon ?? `fa-solid fa-ellipsis-vertical`" />
                                            <span>{{ child.meta?.title || child.name }}</span>
                                        </template>
                                    </el-menu-item>
                                </template>
                            </el-sub-menu>
                        </template>
                    </el-menu>
                </el-scrollbar>
            </div>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>


</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import router from '@/router'
import { useUserStore } from '@/store/user'

import avatarurl from '@/assets/img/avatar.png'
const userStore = useUserStore()
const permissions = ref<string[]>([])
const showRoute = ref();
const isCollapse = ref(true)
const routes = router.getRoutes().find(route => route.name === 'Manager')?.children || []
const filteredRoutes = computed(() => {
    return routes.filter(route => {
        if (!route.meta) return true
        if (!route.meta.permission) return true
        // 检查 permission 是否包含于 permissions
        return permissions.value.includes(route.meta.permission as string)
    })
})

onMounted(async () => {
    permissions.value = await userStore.getPermissions()
    if (filteredRoutes.value.length > 0) {
        showRoute.value = filteredRoutes.value.find(item => item.name === router.currentRoute.value.name)
        if (showRoute.value) return
        if (filteredRoutes.value[0].children && filteredRoutes.value[0].children.length > 0) {
            showRoute.value = filteredRoutes.value[0].children[0];
        } else {
            showRoute.value = filteredRoutes.value[0];
        }
    }
    router.push({ name: showRoute.value.name })
    console.log('filteredRoutes after fetch', filteredRoutes.value)
})






</script>
<style lang="scss" scoped>
$header_height: 55px;
$menu-bg-color: #545c64;
$menu-text-color: #fff;
$menu-active-color: #ffd04b;

.rotate-90 {
    rotate: 90deg;
}

.rotate-180 {
    rotate: 180deg;
}

.el-header {
    height: $header_height;
    background-color: $menu-bg-color;
    color: $menu-text-color;
    display: flex;
    justify-content: space-between;
    // 子元素在交叉轴上居中对齐
    align-items: center;

    .header-left {
        display: flex;
        align-items: center;
        height: 100%;

        .logo {
            width: 35px;
        }

        .web-title {
            margin: 0 40px 0 10px;
            font-size: 22px;
        }
    }

}

#aside-collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    .el-button {
        width: 100%;
        height: var(--el-menu-item-height);
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 0 var(--el-menu-base-level-padding);
        background-color: transparent;

        span,
        .el-icon {
            color: var(--el-menu-text-color);
            transition-duration: 0.5s;
        }
    }
}

.el-main {
    background-color: #f5f5f5;
    padding: 20px;
    flex: 1
}


#main-container {
    display: flex;
    flex-direction: row;
    height: calc(100vh - #{$header_height});
}

#aside {
    background-color: $menu-bg-color;
    overflow-y: hidden;
    --el-menu-bg-color: #545c64;
    --el-menu-text-color: #fff;
    --el-menu-active-color: #ffd04b;

}

.el-menu {
    width: 250px;
}

.el-menu--collapse {
    width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding)* 2);
}
</style>