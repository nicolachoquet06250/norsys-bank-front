const routes = [
  // user login & register part
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/RegisterPage.vue')
      }
    ]
  },
  {
    path: '/login/biometric',
    name: 'biometric-login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/BiometricPage.vue')
      }
    ]
  },
  {
    path: '/test',
    component: () => import('layouts/TabsLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'images',
        name: 'images',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'videos',
        name: 'videos',
        component: () => import('pages/RegisterPage.vue')
      },
      {
        path: 'articles',
        name: 'articles',
        component: () => import('pages/RegisterPage.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
