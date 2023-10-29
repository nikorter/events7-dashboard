import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/new',
      name: 'new',
      component: () => import('../views/NewView.vue')
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import('../views/NewView.vue')
    },
    {
      path: '/',
      name: 'list',
      component: () => import('../views/ListView.vue')
    }
  ]
})

export default router
