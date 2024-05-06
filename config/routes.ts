﻿export default [
  { path: '/user', layout: false,
    routes: [
      {path: '/user/login', component: './User/Login' },
      {path: '/user/register', component: './User/Register'}
    ]
  },
  { path: '/', redirect: '/first' },
  { path: '/add_chart', name: '智能分析', icon: 'barChart', component: './AddChart' },
  {path: '/first', component: './Welcome'},
  {path: '/account/center', component: './UpdateUser'},
  { path: '/add_chart_async', name: '智能分析（异步）', icon: 'barChart', component: './AddChartAsync' },
  { path: '/my_chart', name: '我的图表', icon: 'pieChart', component: './MyChart' },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: 'table', path: '/admin/user', component: './Admin/User', name: '用户管理' },
      {path:'/admin',redirect:'/admin/notification'},
      {
        icon: 'table',
        path: '/admin/notification',
        component: './Admin/Notification',
        name: '动态公告管理',
      },
    ],
  },
//   {
//     path:'/admin',
//     icon:'crown',
//     name:'动态公告管理页',
//     access:'canAdmin',
//
// },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
