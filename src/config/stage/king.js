const kingRouter = {
  route: null,
  name: null,
  title: '游戏管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/king/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '分类列表',
      type: 'view',
      name: 'KingCreate',
      route: '/king/list',
      filePath: 'view/king/king-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '添加分类',
      type: 'view',
      name: 'KingCreate',
      route: '/king/add',
      filePath: 'view/king/king.vue',
      inNav: true,
      icon: 'iconfont icon-add',
    },
  ],
}

export default kingRouter
