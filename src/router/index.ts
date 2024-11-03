import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'

import HomePage from '@pages/UiHomePage.vue'
import MainPage from '@pages/UiMainPage.vue'
import LoginPage from '@pages/UiLoginPage.vue'
import GalleryPage from '@pages/UiGallery.vue'
import DirectionPage from '@pages/UiDirection.vue'
import ProfilePage from '@pages/UiProfile.vue'
import UploadPage from '@pages/UploadPage.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPage,
    meta: {
      title: 'Phototherapy - Where Healing Meets Photography',
      description: 'Welcome to Phototherapy - where healing meets photography. Explore our curated collection of soul-soothing images.',
      keywords: 'phototherapy, healing photography, mental wellness, therapeutic images'
    }
  },
  {
    path: '/login',
    component: LoginPage,
    meta: {
      title: 'Login - Phototherapy',
      description: 'Sign in to access your personalized therapeutic photography experience',
      keywords: 'login, sign in, phototherapy account'
    }
  },
  {
    path: '/photo',
    component: HomePage,
    meta: {
      description: 'Discover a diverse array of therapeutic photographs designed to calm your mind and uplift your spirit.'
    }
  },
  {
    path: '/gallery/:id(\\d+)',
    component: GalleryPage,
    meta: {
      description: 'Immerse yourself in our specially curated photo galleries. Each image tells a story of tranquility and beauty.'
    }
  },
  {
    path: '/direction',
    component: DirectionPage,
    meta: {
      description: 'Find your way to inner peace through our guided photographic journey.'
    }
  },
  {
    path: '/profile',
    component: ProfilePage,
    meta: {
      description: 'Personalize your Phototherapy experience. Manage your profile and favorite healing images.'
    }
  },
  {
    path: '/upload',
    component: UploadPage,
    meta: {
      requiresAuth: true,
      description: 'Share your own therapeutic images and contribute to our community of healing through photography.'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
    // 404ページ実装
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      next({ path: '/login' })
    } else {
      next()
    }
  } else {
    next()
  }
})
