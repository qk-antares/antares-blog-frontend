export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },
  {
    path: '/user',
    routes: [
      { name: '个人中心', path: '/user/:uid', component: './User/Center' },
      { name: '帐号设置', path: '/user/settings', component: './User/Settings' },
    ]
  },
  {
    path: '/note',
    name: '博客',
    icon: 'fileText',
    component: './Home'
  },
  {
    path: '/note',
    routes: [
      { name: '创建文章', path: '/note/create', component: './Note/Create', hideInMenu: true},
      { name: '编辑文章', path: '/note/edit/:id', component: './Note/Edit', hideInMenu: true},
      { name: '配置文章', path: '/note/settings/:id', component: './Note/Settings', hideInMenu: true},
      { name: '文章详情页', path: '/note/:id', component: './Note/Detail', hideInMenu: true}
    ],
  },
  {
    path: '/updates', name: '动态', icon: 'appstore', component: './Updates'
  },
  { path: '/search', component: './Search', hideInMenu:true },
  { path: '/notification',component: './Notification', hideInMenu:true },
  {
    path: '/search/:category',
    name: '搜索',
    component: './Welcome',
    hideInMenu:true
  },
  { path: '/', redirect: '/note' },
  { path: '*', layout: false, component: './404' },
];
