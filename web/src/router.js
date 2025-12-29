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
    name: 'Register',
    component: () => import(`./pages/Register/Index.vue`)
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
  }
]

const router = new VueRouter({
  routes
})

export default router
