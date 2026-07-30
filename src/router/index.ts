import { createRouter, createWebHistory } from 'vue-router'

const routes = [

  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    component: () => import('../components/Login.vue')
  },

  {
    path: '/register',
    component: () => import('../components/Register.vue')
  },

  {
    path: '/home',
    component: () => import('../pages/home.vue')
  },

  {
  path: '/productos',
  component: () => import('../pages/productos.vue')
},

{
  path: '/almacenes',
  component: () =>
    import('../pages/almacenes.vue')
}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;
