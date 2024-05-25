import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@pages/UiHomePage.vue'
import MainPage from '@pages/UiMainPage.vue'
import GalleryPage from '@pages/UiGallery.vue'
import GyeongjuPage from '@pages/UiGyeongju.vue'
import MomentPage from '@pages/UiMoment.vue'
import ConatusPage from '@pages/UiConatus.vue'
import DirectionPage from '@pages/UiDirection.vue'
import ProfilePage from '@pages/UiProfile.vue'

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
    path: '/gallery/:id(\\d+)',
    component: GalleryPage
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
    path: '/:pathMatch(.*)*',
    redirect: '/'
    // 404ページ実装
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  }
})
