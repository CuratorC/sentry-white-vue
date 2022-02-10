import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/setting',
    children: [{
      path: 'setting',
      name: 'Setting',
      component: () => import('@/views/setting/index'),
      meta: { title: '项目设置', icon: 'dashboard' }
    }]
  },

  {
    path: '/originals',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '组织信息',
        component: () => import('@/views/originals/index'),
        meta: { title: '组织信息', icon: 'el-icon-office-building' }
      },
      {
        path: '/originals/:original_id/projects',
        component: () => import('@/views/projects/index'),
        name: 'OriginalsShow',
        hidden: true
      }
    ]
  },
  {
    path: '/responsible_people',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '负责人',
        component: () => import('@/views/responsible_people/index'),
        meta: { title: '负责人', icon: 'el-icon-user-solid' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
