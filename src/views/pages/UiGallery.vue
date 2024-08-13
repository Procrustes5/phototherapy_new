<script lang="ts" setup>
import { useHomeStore } from '@store/homeStore.ts'
import { storeToRefs } from 'pinia'
import Drawer from '@view/ui-elements/UiPhotoDrawer.vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/utils/supabase'

const route = useRoute()
const photos = ref([])

const getGalleryPhotos = async (): Promise<void> => {
  let { data } = await supabase.from('photo').select('*').eq('category_id', route?.params?.id)
  photos.value = data
}
const homeStore = useHomeStore()
const { clickedPhoto, clickedImage, isOpened, photoIndex } = storeToRefs(homeStore)
const handleDrawer = (photo, index) => {
  clickedImage.value = photo.content
  clickedPhoto.value = photo
  isOpened.value = true
  photoIndex.value = index
}
window.scrollTo({ top: 0, behavior: 'smooth' })
onMounted(() => {
  getGalleryPhotos()
})
watch(route, () => {
  getGalleryPhotos()
})
watch(photoIndex, (index) => {
  clickedImage.value = photos.value[index].content
  clickedPhoto.value = photos.value[index]
})
</script>
<template>
  <div class="main-wrapper">
    <div class="main-image-wrapper">
      <div class="main-image">
        <el-image :src="photos[0]?.content" alt="loading" class="img"></el-image>
      </div>
      <div class="conatus main-img" v-if="route.params.id === '1'">
        <span class="title-text">Conatus</span>
      </div>
      <div class="moment main-img" v-else-if="route.params.id === '2'">
        <span class="title-text">The Moment</span>
      </div>
      <div class="conatus main-img" v-else-if="route.params.id === '3'">
        <span class="en title-text">Gyeongju</span>
      </div>
      <div class="docu main-img" v-else-if="route.params.id === '4'">
        <span class="title-text">Docu</span>
        <span class="and title-text">&</span>
        <span class="title-text">Snap</span>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="content-header">
        <span>PHOTOS</span>
      </div>
      <div class="content">
        <div v-for="(photo, index) in photos" :key="index" class="content-img">
          <el-image :src="photo.content" class="img" @click="handleDrawer(photo, index)"></el-image>
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
    .title {
      display: none;
    }
    .main-image {
      width: 80%;
      display: flex;
      justify-content: center;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .docu {
      width: 80%;
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
    .conatus {
      width: 80%;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-size: 100px;
        font-weight: 800;
        color: white;
        text-shadow: 5px 5px 30px rgba($color: #000000, $alpha: 0.8);
      }
    }
    .moment {
      width: 80%;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        text-align: center;
        font-size: 100px;
        font-weight: 800;
        color: white;
        text-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.8);
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
        display: flex;
        justify-content: center;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .docu {
        width: 90%;
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
      .conatus {
        width: 90%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          font-size: 60px;
          font-weight: 800;
          color: white;
          text-shadow: 1px 1px 30px rgba($color: #000000, $alpha: 0.8);
        }
      }
      .moment {
        width: 90%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          text-align: center;
          font-size: 50px;
          font-weight: 800;
          color: white;
          text-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.8);
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
.main-image {
  img {
    object-fit: contain;
    height: 100%;
  }
}
</style>
