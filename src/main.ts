import './assets/main.css'

import { router } from '@/router/index.ts';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import 'element-plus/dist/index.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = createApp(App);
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  app.use(router);
  app.use(createPinia());
  app.use(ElementPlus);
  // if (process.env.NODE_ENV === 'development') {
  //   worker.start();
  // }
  app.mount('#app');
});
