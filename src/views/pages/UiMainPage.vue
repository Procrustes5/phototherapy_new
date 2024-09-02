<script setup lang="ts">
import UiHomePage from './UiHomePage.vue'
import AppHeader from '@app/AppHeader.vue'
import AppFooter from '@app/AppFooter.vue'
import { supabase } from '@/utils/supabase'

const photos = ref([])
const currentIndex = ref(0)
const isSlideShown = ref<boolean>(true)
const headerRef = ref()
const isLoading = ref<boolean>(true)
const imageLoaded = ref<boolean>(false)

const getSlidePhotos = async (): Promise<void> => {
  isLoading.value = true
  try {
    let { data, error } = await supabase.from('photo').select('*').eq('category_id', 5)
    if (error) throw error
    photos.value = data || []
  } catch (error) {
    console.error('Error fetching photos:', error)
    photos.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getSlidePhotos()
  const headerObserver = new IntersectionObserver(
    (entries) => {
      const firstEntry = entries[0]
      isSlideShown.value = firstEntry.isIntersecting
    },
    { root: null, threshold: 0 }
  )
  if (headerRef.value) {
    headerObserver.observe(headerRef.value)
  }
})

const changeSlide = () => {
  if (!isLoading.value && photos.value.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % photos.value.length
  }
}

let slideInterval: number | null = null

watch(isLoading, (newValue) => {
  if (!newValue && photos.value.length > 0) {
    if (slideInterval) clearInterval(slideInterval)
    slideInterval = setInterval(changeSlide, 3000)
  }
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})

const handleImageLoad = () => {
  imageLoaded.value = true
}
</script>

<template>
  <div class="wrapper">
    <div class="header" ref="headerRef">
      <el-loading :fullscreen="true" v-if="isLoading" />
      <template v-else>
        <div
          v-for="(image, index) in photos"
          :key="index"
          class="main-image"
          :class="{ active: index === currentIndex }"
        >
          <el-image
            :src="image.content"
            fit="cover"
            :alt="image.description || 'Phototherapy image'"
            @load="handleImageLoad"
          >
            <template #placeholder>
              <div class="image-placeholder">
                <el-loading />
              </div>
            </template>
            <template #error>
              <div class="image-error">Failed to load image</div>
            </template>
          </el-image>
        </div>
      </template>
      <div class="fixed-content" :class="{ active: imageLoaded && !isLoading }">
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
  width: 100%;
  height: 100%;
  position: absolute;
  transition: opacity 1s ease;
  opacity: 0;
  box-sizing: border-box;
  border: 30px solid whitesmoke;

  .el-image {
    width: 100%;
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
  opacity: 0;
  transition: opacity 0.5s ease;

  .title {
    margin: 70px 0px;
    font-size: 90px;
    font-weight: 600;
    color: whitesmoke;
    user-select: none;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 1s ease-out forwards;
  }
  .sub-title {
    font-size: 24px;
    font-weight: 400;
    color: whitesmoke;
    opacity: 0.8;
    font-style: italic;
  }
}
.fixed-content.active {
  opacity: 1;
}
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.content {
  padding: 12px 30px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
}

.image-placeholder,
.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  color: #666;
}
@media screen and (min-width: 1023px) {
  .header {
    height: 100%;
  }
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
    height: 50vh;
    padding: 0;
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    opacity: 0;
    animation: fadeInUp 1.5s ease-out forwards;
  }
  .sizedBox {
    height: 30px;
    background: $main;
  }
  .main-image {
    position: absolute;
    transition: opacity 1s ease;
    opacity: 0;
    height: 100%;
    border: 15px solid whitesmoke;
    .img {
      width: 100%;
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
  .content {
    padding: 12px;
  }
  .header-spacing {
    height: 12px;
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
