<script lang="ts" setup>
import AppHeader from '@app/AppHeader.vue'
import AppFooter from '@app/AppFooter.vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/utils/supabase'
import Menu from '@view/ui-elements/UiMenuDrawer.vue'

const categories = ref([])
const route = useRoute()
const getCategories = async (): Promise<void> => {
  let { data } = await supabase.from('category').select('*').neq('id', 5).neq('id', 6).order('id', { ascending: true })
  categories.value = data
}

onMounted(() => {
  getCategories()
})
</script>
<template>
  <div class="app">
    <app-header v-if="route.path !== '/'" />
    <router-view v-model:categories="categories" />
    <app-footer v-if="route.path !== '/' && route.path !== '/profile'" />
    <Menu v-model:categories="categories" />
  </div>
</template>
<style lang="scss" scoped>
@import '@style/global.scss';
@import '@style/app.scss';
</style>
