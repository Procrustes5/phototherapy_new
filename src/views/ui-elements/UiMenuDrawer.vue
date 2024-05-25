<script lang="ts" setup>
import { useMenuStore } from '@store/menuStore.ts'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const menuStore = useMenuStore()
const router = useRouter()
const { clickedIcon, isOpened } = storeToRefs(menuStore)

const closeMenu = (): void => {
  isOpened.value = false
}
const handleClickedCategory = (category): void => {
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
        <div class="menu" @click="handleClickedCategory('conatus')">
          <span>Conatus</span>
        </div>
        <div class="menu" @click="handleClickedCategory('moment')">
          <span>The Moment</span>
        </div>
        <div class="menu" @click="handleClickedCategory('gyeongju')">
          <span>Gyeongju</span>
        </div>
        <div class="menu" @click="handleClickedCategory('docu')">
          <span>Docu&Snap</span>
        </div>
      </div>
      <div class="title">▼ About</div>
      <div class="menu-wrapper">
        <div class="menu" @click="handleClickedCategory('direction')">
          <span>Direction</span>
        </div>
        <div class="menu" @click="handleClickedCategory('profile')">
          <span>Profile</span>
        </div>
      </div>
    </div>
    <div class="lower-wrapper">
      <div @click="handleLogin" v-if="false">login</div>
    </div>
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
