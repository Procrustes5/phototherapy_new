import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'

import HomePage from '@pages/UiHomePage.vue'
import MainPage from '@pages/UiMainPage.vue'
import LoginPage from '@pages/UiLoginPage.vue'
import GalleryPage from '@pages/UiGallery.vue'
import DirectionPage from '@pages/UiDirection.vue'
import ProfilePage from '@pages/UiProfile.vue'
import EditCategoryPage from '@pages/EditCategory.vue'
import EditPhotoPage from '@pages/EditPhotoPage.vue'
import UploadPage from '@pages/UploadPage.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPage
  },
  {
    path: '/photo',
    component: HomePage
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/gallery/:id(\\d+)',
    component: GalleryPage,
    scrollBehavior(to, from, savedPosition) {
      return { top: 0 }
    }
  },
  {
    path: '/direction',
    component: DirectionPage
  },
  {
    path: '/profile',
    component: ProfilePage
  },
  {
    path: '/edit/category',
    component: EditCategoryPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit/photo',
    component: EditPhotoPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/upload',
    component: UploadPage,
    meta: { requiresAuth: true }
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
    document.getElementById('app').scrollTop = 0
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
