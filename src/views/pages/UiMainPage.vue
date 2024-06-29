<script setup lang="ts">
import UiHomePage from './UiHomePage.vue'
import AppHeader from '@app/AppHeader.vue'
import AppFooter from '@app/AppFooter.vue'
import { supabase } from '@/utils/supabase'

const categories = defineModel('categories')

const photos = ref([])
const currentIndex = ref(0)
const isSlideShown = ref(true)
const headerRef = ref()

const getSlidePhotos = async (): Promise<void> => {
  let { data } = await supabase.from('photo').select('*').eq('category_id', 5)
  photos.value = data
}

onMounted(() => {
  getSlidePhotos()
  const headerObserver = new IntersectionObserver(
    (entries) => {
      const firstEntry = entries[0]
      if (firstEntry.isIntersecting) {
        isSlideShown.value = true
      } else {
        isSlideShown.value = false
      }
    },
    {
      root: null,
      threshold: 0
    }
  )
  headerObserver.observe(headerRef.value!)
})

setInterval(() => {
  currentIndex.value = (currentIndex.value + 1) % photos.value.length
}, 3000)
</script>
<template>
  <div class="wrapper">
    <div class="header" ref="headerRef">
      <div
        class="main-image"
        v-for="(image, index) in photos"
        :key="index"
        :class="{ active: index === currentIndex }"
      >
        <div class="sized-box" v-if="!photos"></div>
        <el-image :src="image.content" :lazy="index !== 0" class="img" v-else></el-image>
      </div>
      <div class="fixed-content" :class="{ active: currentIndex === 0 }">
        <div class="title">Phototherapy</div>
        <div class="sub-title">Light Up Your Life: Embrace the Power of Phototherapy</div>
      </div>
    </div>
    <app-header v-show="!isSlideShown" class="main-header" />
    <div class="content">
      <div class="header-spacing"></div>
      <UiHomePage />
      <app-footer />
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@style/global.scss';
.wrapper {
  width: 100%;
  height: 100%;
  background: $main;
}
.main-header {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}
.header {
  width: 100%;
  height: 100%;
  padding: 100px;
  background: $main;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  opacity: 0;
  animation: fadeInUp 1.5s ease-out forwards;
}
.header-spacing {
  height: 92px;
}
.main-image {
  min-width: 100%;
  height: 100%;
  position: absolute;
  transition: opacity 1s ease;
  opacity: 0;
  box-sizing: border-box;
  border: 30px solid whitesmoke;
  .img {
    width: 100%;
    height: 90%;
    box-sizing: border-box;
  }
}
.sized-box {
  height: 100%;
  width: 100%;
}
.main-image.active {
  opacity: 1;
}
.fixed-content {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  .title {
    margin: 70px 0px;
    font-size: 90px;
    font-weight: 600;
    color: whitesmoke;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    opacity: 0;
    transform: translateY(20px); /* 아래에서 시작 */
    animation: fadeInUp 1s ease-out forwards;
  }
  .sub-title {
    font-size: 24px;
    font-weight: 400;
    color: whitesmoke;
    opacity: 0.8;
    font-style: italic;
  }
  .prepare {
    color: whitesmoke;
    margin-top: 30px;
    border: 1px solid whitesmoke;
    font-weight: 600;
    padding: 4px 6px;
  }
}
.fixed-content.active {
  opacity: 1;
}
@keyframes fadeInUp {
  to {
    opacity: 1; /* 완전히 불투명하게 */
    transform: translateY(0); /* 원래 위치로 */
  }
}
.content {
  padding: 12px 30px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
}
@media screen and (max-width: 1023px) {
  .header {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    opacity: 0;
    animation: fadeInUp 1.5s ease-out forwards;
  }
  .sizedBox {
    height: 300px;
    background: $main;
  }
  .main-image {
    position: absolute;
    transition: opacity 1s ease;
    opacity: 0;
    .img {
      height: 100%;
    }
  }
  .main-image.active {
    opacity: 1;
  }
  .fixed-content {
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      margin: 50px 0px;
      font-size: 70px;
      font-weight: 600;
      color: whitesmoke;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      opacity: 0;
      transform: translateY(20px); /* 아래에서 시작 */
      animation: fadeInUp 1s ease-out forwards;
    }
    .sub-title {
      font-size: 20px;
      font-weight: 400;
      color: whitesmoke;
      font-style: italic;
    }
  }
}

@media screen and (max-width: 767px) {
  .header {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    opacity: 0;
    animation: fadeInUp 1.5s ease-out forwards;
  }
  .sizedBox {
    height: 300px;
    background: $main;
  }
  .main-image {
    position: absolute;
    transition: opacity 1s ease;
    opacity: 0;
    height: fit-content;
    .img {
      width: 100%;
      height: auto;
      img {
        height: 100% !important;
      }
    }
  }
  .main-image.active {
    opacity: 1;
  }
  .fixed-content {
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      margin: 30px 0px;
      font-size: 40px;
      font-weight: 600;
      color: whitesmoke;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      opacity: 0;
      transform: translateY(20px); /* 아래에서 시작 */
      animation: fadeInUp 1s ease-out forwards;
    }
    .sub-title {
      font-size: 8px;
      font-weight: 400;
      color: whitesmoke;
      font-style: italic;
    }
    .prepare {
      color: whitesmoke;
      border: 1px solid whitesmoke;
      font-size: 8px;
      font-weight: 600;
      padding: 2px 4px;
      margin-top: 16px;
    }
  }
}
</style>
<style lang="scss" scope>
.main-image {
  .img {
    height: 100% !important;
  }
}
img {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* 標準構文 */
}
</style>
