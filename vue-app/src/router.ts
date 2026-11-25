import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

export const router = createRouter({
  history: createWebHistory(), // normal URLs, no "#"
  routes: [
    { path: '/', redirect: '/template' },
    // () => import(...) = lazy loading: the page is downloaded only when visited
    { path: '/template', component: () => import('./pages/TemplatePage.vue') },
    { path: '/state', component: () => import('./pages/StatePage.vue') },
    { path: '/conditional', component: () => import('./pages/ConditionalPage.vue') },
    { path: '/list', component: () => import('./pages/ListPage.vue') },
    { path: '/form', component: () => import('./pages/FormPage.vue') },
    { path: '/computed', component: () => import('./pages/ComputedPage.vue') },
    { path: '/effect', component: () => import('./pages/EffectPage.vue') },
    { path: '/components', component: () => import('./pages/ComponentsPage.vue') },
    { path: '/ref', component: () => import('./pages/RefPage.vue') },
    { path: '/composable', component: () => import('./pages/ComposablePage.vue') },
    { path: '/store', component: () => import('./pages/StorePage.vue') },
    { path: '/api', component: () => import('./pages/ApiPage.vue') },
    {
      path: '/routing',
      component: () => import('./pages/routing/RoutingPage.vue'),
      // Nested routes: these render inside the <RouterView /> of RoutingPage
      children: [
        { path: '', component: () => import('./pages/routing/RoutingHome.vue') },
        { path: 'users', component: () => import('./pages/routing/UserList.vue') },
        // ":id" is a dynamic segment. props: true passes it to the component as a prop
        { path: 'users/:id', name: 'user', props: true, component: () => import('./pages/routing/UserDetail.vue') },
        { path: 'login', component: () => import('./pages/routing/LoginPage.vue') },
        // meta = your own data on a route, read by the guard below
        { path: 'secret', meta: { requiresAuth: true }, component: () => import('./pages/routing/SecretPage.vue') },
      ],
    },
    { path: '/todo', component: () => import('./pages/TodoPage.vue') },
    // Catch-all: 404. Must match anything not matched above
    { path: '/:pathMatch(.*)*', component: () => import('./pages/NotFoundPage.vue') },
  ],
})

// Navigation guard: runs before every route change
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // returning a location redirects; returning nothing lets the navigation continue
    return { path: '/routing/login', query: { redirect: to.fullPath } }
  }
})
