export const medbillList = [
  {
    path: '/medBillDemo1',
    component: '@/pages/medBillDemo1/index.jsx',
    name: '测试医疗单',
    icon: 'ApiOutlined',
  },
];

export default [
  {
    exact: false,
    flatMenu: true,
    path: '/',
    component: '@/layouts/index',
    headerRender: false,
    name: '医疗单',
    routes: [
      ...medbillList,
      {
        path: '/*',
        name: '404',
        icon: 'ApiOutlined',
        component: '@/pages/404',
      },
    ],
  },
  {
    path: '/',
    name: '404',
    icon: 'ApiOutlined',
    component: '@/pages/404',
  },
];
