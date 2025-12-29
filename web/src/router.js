import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/my-maps'
  },
  {
    path: '/edit',
    name: 'Edit',
    component: () => import(`./pages/Edit/Index.vue`),
    meta: { requiresAuth: true }
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
    component: () => import(`./pages/MyMaps/Index.vue`),
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (store.state.user && store.state.user.role === 'admin') {
          next()
        } else {
          next('/')
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
