import { isAuthenticated } from '@/services/auth';
import { createRouter, createWebHistory } from 'vue-router'

const routes: Array<any> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false, requiresGuest: true },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/users/index.vue'),
    meta: { requiresAuth: true},
  },
  {
    path: '/users/adduser/:id?',
    name: 'adduser',
    component: () => import('@/views/users/AddUser.vue'),
    meta: { requiresAuth: true},
  },  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest && isAuthenticated())) {
    next('/users'); 
  } else {
    next();
  }
});

export default router
