<script lang="ts" setup>
import { useMenuStore } from '@store/menuStore.ts'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const categories = defineModel('categories')
const menuStore = useMenuStore()
const router = useRouter()
const { isOpened } = storeToRefs(menuStore)
const user = ref()

const closeMenu = (): void => {
  isOpened.value = false
}
const handleClickedGallery = (id: number): void => {
  window.scrollTo({ top: 0 })
  router.push(`/gallery/${id}`)
}
const handleClickedAbout = (category: string): void => {
  window.scrollTo({ top: 0 })
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

const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (data) {
    user.value = data.user
  } else {
    console.error(error)
  }
}

const handleLogin = async (): Promise<void> => {
  router.push('/login')
}

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    alert('로그아웃했습니다.')
  } catch (error) {
    alert(error.message)
  }
}

onMounted(() => {
  getCurrentUser()
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
})
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
      <div class="title" v-if="user">▼ Admin</div>
      <div class="menu-wrapper" v-if="user">
        <div class="menu" @click="handleClickedAbout('upload')">
          <span>관리자</span>
        </div>
      </div>
    </div>
    <div class="lower-wrapper">
      <el-icon :size="20"><User /></el-icon>
      <span @click="handleLogin" v-if="!user">Admin Login</span>
      <span @click="handleLogout" v-else>Logout</span>
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
.drawer {
  .el-drawer__body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    span {
      padding: 8px;
      font-size: 16px;
      color: whitesmoke;
      cursor: pointer;
    }
  }
}
</style>
