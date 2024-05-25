<script lang="ts" setup>
import { useHomeStore } from '@store/homeStore.ts'
import { storeToRefs } from 'pinia'
import Drawer from '@view/ui-elements/UiPhotoDrawer.vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/utils/supabase'
const route = useRoute()
const photos = ref([])
const getGalleryPhotos = async (): Promise<void> => {
  let { data } = await supabase.from('photo').select('*').eq('category_id', route.params.id)
  photos.value = data
}
const homeStore = useHomeStore()
const { clickedImage, isOpened } = storeToRefs(homeStore)
const handleDrawer = (img: string) => {
  clickedImage.value = img
  isOpened.value = true
}
window.scrollTo({ top: 0, behavior: 'smooth' });
onMounted(() => {
  getGalleryPhotos()
})
onUpdated(() => {
  getGalleryPhotos()
})
</script>
<template>
  <div class="main-wrapper">
    <div class="main-image-wrapper">
      <div class="main-image">
        <el-image :src="photos[0]?.content" class="img"></el-image>
      </div>
      <div class="fixed-content">
        <span>Docu</span>
        <span class="and">&</span>
        <span>Snap</span>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="content-header">
        <span>PHOTOS</span>
      </div>
      <div class="content">
        <div v-for="(photo, index) in photos" :key="index" class="content-img">
          <el-image :src="photo.content" class="img" @click="handleDrawer(photo.content)"></el-image>
        </div>
      </div>
    </div>
  </div>
  <Drawer></Drawer>
</template>
<style lang="scss" scoped>
@import '@style/global.scss';
.main-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  .main-image-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    .main-image {
      width: 80%;
      height: 80vh;
      display: flex;
      justify-content: center;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .fixed-content {
      width: 80%;
      height: 80vh;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        font-size: 80px;
        font-weight: 800;
        color: white;
        line-height: 80px;
        text-shadow: 5px 3px 5px rgba($color: #000000, $alpha: 0.8);
      }
      .and {
        font-size: 65px;
        display: flex;
        align-items: center;
      }
    }
  }
  .content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .content-header {
      margin: 15px 0px;
      width: 80%;
      span {
        color: whitesmoke;
        font-size: 18px;
        font-weight: 600;
      }
    }
    .content {
      width: 80%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 5px;
      padding: 0px 30px;
      .content-img {
        height: 35vh;
        .img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
@media screen and (max-width: 767px) {
  .main-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .main-image-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      .main-image {
        width: 90%;
        height: 90vh;
        display: flex;
        justify-content: center;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .fixed-content {
        width: 90%;
        height: 90vh;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span {
          font-size: 55px;
          font-weight: 800;
          color: white;
          line-height: 50px;
          text-shadow: 5px 3px 5px rgba($color: #000000, $alpha: 0.8);
        }
        .and {
          font-size: 40px;
          display: flex;
          align-items: center;
        }
      }
    }
    .content-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .content-header {
        margin: 15px 0px;
        width: 90%;
        span {
          color: whitesmoke;
          font-size: 18px;
          font-weight: 600;
        }
      }
      .content {
        width: 90%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 5px;
        padding: 0px 30px;
        .content-img {
          height: 160px;
          .img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scope>
img {
  object-fit: cover;
}
</style>
