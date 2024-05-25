<script lang="ts" setup>
import { useHomeStore } from '@store/homeStore.ts'
import { storeToRefs } from 'pinia'
import { supabase } from '@/utils/supabase'
import Drawer from '@view/ui-elements/UiPhotoDrawer.vue'

const photos = ref([])
const categories = defineModel('categories')
const homeStore = useHomeStore()
const { clickedImage, isOpened } = storeToRefs(homeStore)
const handleDrawer = (img) => {
  clickedImage.value = img
  isOpened.value = true
}
const getHomePhotos = async (): Promise<void> => {
  let { data } = await supabase.from('photo').select('*').eq('category_id', 6)
  photos.value = data
}

onMounted(() => {
  getHomePhotos()
})
</script>
<template>
  <div class="home-page" ref="contentRef">
    <el-image
      class="top-image"
      :src="photos[0]?.content"
      @click="handleDrawer(photos[0].content)"
    ></el-image>
    <div class="middle-image">
      <el-image
        v-for="(photo, index) in photos.slice(1, 9)"
        class="ml-img"
        :class="`ml-img${index + 1}`"
        :src="photo?.content"
        @click="handleDrawer(photo.content)"
      ></el-image>
    </div>
    <div class="bottom-image">
      <el-image
        class="btm-img"
        :src="photos[9]?.content"
        @click="handleDrawer(photos[9].content)"
      ></el-image>
    </div>
  </div>
  <Drawer></Drawer>
</template>
<style lang="scss" scoped>
@import '@style/global.scss';
@import '@style/home-page.scss';
</style>
<style lang="scss" scope>
.ml-img {
  img {
    object-fit: cover;
  }
}
.btm-img {
  width: 100%;
}
.ml-img1 {
  grid-row: 1 / 2;
  grid-column: 1 / 3;
}
.ml-img2 {
  grid-row: 2 / 3;
  grid-column: 1 / 2;
}
.ml-img3 {
  grid-row: 2 / 3;
  grid-column: 2 / 3;
}
.ml-img4 {
  grid-row: 3 / 4;
  grid-column: 1 / 2;
}
.ml-img5 {
  grid-row: 3 / 4;
  grid-column: 2 / 3;
}
.ml-img6 {
  grid-row: 4 / 5;
  grid-column: 1 / 3;
}
.ml-img7 {
  grid-row: 1 / 4;
  grid-column: 3 / 4;
}
.ml-img8 {
  grid-row: 4 / 5;
  grid-column: 3 / 4;
}
</style>
