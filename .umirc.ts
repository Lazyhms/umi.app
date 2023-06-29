import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '后台管理',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: '@/pages',
    },
    {
      exact: true,
      name: "系统设置",
      path: "/core",
      routes: [{
        exact: true,
        name: "用户管理",
        path: "/core/user",
        component: '@/pages/Core/User',
      }, {
        exact: true,
        name: "权限管理",
        path: "/core/role",
        component: '@/pages/Core/Role',
      }, {
        exact: true,
        name: "页面管理",
        path: "/core/setting",
        component: '@/pages/Core/Setting',
      }]
    }
  ],
  fastRefresh: true,
  npmClient: 'pnpm',
});

