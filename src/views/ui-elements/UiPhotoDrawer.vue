<script lang="ts" setup>
import { useHomeStore } from '@store/homeStore.ts'
import { storeToRefs } from 'pinia'

const homeStore = useHomeStore()
const { clickedImage, clickedPhoto, isOpened, photoIndex } = storeToRefs(homeStore)
const closeDrawer = () => {
  isOpened.value = false
}
const handleBtnClicked = () => {
  photoIndex.value ++
}
</script>
<template>
  <el-drawer
    class="drawer"
    v-model="isOpened"
    direction="ltr"
    :with-header="false"
    size="100%"
    style="background: #0c1117"
  >
    <div class="drawer-wrapper" :class="{ vertImg: clickedImage.includes('9302') }">
      <div class="img-wrapper">
        <div @click="handleBtnClicked">next</div>
        <el-image :src="clickedImage" fit="contain" class="drawer-img" @click="closeDrawer"> </el-image>
      </div>
      <div class="story-wrapper">
        <h3>{{ clickedPhoto?.title ?? '' }}</h3>
        <p>{{ clickedPhoto?.description ?? '' }}</p>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
@import '@style/photo-drawer.scss';
</style>
<style lang="scss" scope></style>
