<script lang="ts" setup>
import { useMenuStore } from '@store/menuStore.ts'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const categories = defineModel('categories')
const menuStore = useMenuStore()
const router = useRouter()
const { clickedIcon, isOpened } = storeToRefs(menuStore)

const closeMenu = (): void => {
  isOpened.value = false
}
const handleClickedGallery = (id: number): void => {
  window.scrollTo({ top: 0 });
  router.push(`/gallery/${id}`)
}
const handleClickedAbout = (category: string): void => {
  window.scrollTo({ top: 0 });
  router.push(`/${category}`)
}
const menuSize = computed((): string => {
  if (window.innerWidth < 500) {
    return '40%'
  } else if (window.innerWidth < 769) {
    return '30%'
  } else if (window.innerWidth < 1025) {
    return '20%'
  } else {
    return '15%'
  }
})

const handleLogin = async (): Promise<void> => {
  const { data: oAuth } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
  const { data: session } = await supabase.auth.getSession()
  console.log(session)
  const { data: user, error: postUserError } = await supabase
    .from('User')
    .insert([{ name: session, email: 'otherValue' }])
    .select()
}
</script>
<template>
  <el-drawer
    class="drawer"
    v-model="isOpened"
    direction="rtl"
    :with-header="false"
    :size="menuSize"
    @click="closeMenu"
    style="background: #0c1117"
  >
    <div class="upper-drawer">
      <div class="title">▼ Gallery</div>
      <div class="menu-wrapper">
        <div
          class="menu"
          v-for="(category, index) in categories"
          :key="index"
          @click="handleClickedGallery(category.id)"
        >
          <span>{{ category.name }}</span>
        </div>
      </div>
      <div class="title">▼ About</div>
      <div class="menu-wrapper">
        <div class="menu" @click="handleClickedAbout('direction')">
          <span>Direction</span>
        </div>
        <div class="menu" @click="handleClickedAbout('profile')">
          <span>Profile</span>
        </div>
      </div>
    </div>
    <!-- <div class="lower-wrapper">
      <div @click="handleLogin" v-if="false">login</div>
    </div> -->
  </el-drawer>
</template>

<style lang="scss" scoped>
@import '@style/menu-drawer.scss';
</style>
<style lang="scss" scope>
.menu-img {
  width: 100%;
  .el-image__inner {
    width: 100%;
    height: 40px;
  }
}
</style>
