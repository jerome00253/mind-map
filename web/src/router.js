import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Edit',
    component: () => import(`./pages/Edit/Index.vue`)
  },
  {
    path: '/index',
    redirect: '/'
  },
  {
    path: '/doc/zh',
    component: () => import(`./pages/Doc.vue`)
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(`./pages/Login/Index.vue`)
  },
  {
    path: '/register',
    redirect: '/login'
  },
  {
    path: '/my-maps',
    name: 'MyMaps',
    component: () => import(`./pages/MyMaps/Index.vue`)
  },
  {
    path: '/share/:token',
    name: 'Share',
    component: () => import(`./pages/Share/Index.vue`)
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import(`./pages/Admin/Users.vue`),
    meta: { requiresAdmin: true }
  }
]

const router = new VueRouter({
  routes
})

export default router
