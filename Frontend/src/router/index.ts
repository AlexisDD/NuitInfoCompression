import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useStore } from 'vuex'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/compression',
      name: 'compression',
      component: () => import('../views/CompressionView.vue')
    }
  ]
})

/**
 * Middleware to check if user is authenticated before accessing a protected route.
 */
router.beforeEach(async (to, from) => {
  const store = useStore();
  const loggedIn = store.getters.isAuthenticated;

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    return { name: 'login' }
  }
})

export default router
