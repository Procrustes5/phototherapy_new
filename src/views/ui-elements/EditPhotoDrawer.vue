<script lang="ts" setup>
import { useHomeStore } from '@store/homeStore.ts'
import { storeToRefs } from 'pinia'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const homeStore = useHomeStore()
const { clickedImage, clickedPhoto, isOpened } = storeToRefs(homeStore)
const closeDrawer = () => {
  isOpened.value = false
}
const handleSubmit = async () => {
  const { data, error } = await supabase
    .from('photo')
    .update({ title: clickedPhoto.value.title, description: clickedPhoto.value.description })
    .eq('id', clickedPhoto.value.id)
    .select()
  console.log(error)
  router.go(0)
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
      <div class="img-wrapper" @click="closeDrawer">
        <el-image :src="clickedImage" fit="contain" class="drawer-img"> </el-image>
      </div>
      <div class="story-wrapper">
        <el-input v-model="clickedPhoto.title" placeholder="제목" class="photo-input" />
        <el-input
          v-model="clickedPhoto.description"
          placeholder="설명"
          type="textarea"
          autosize
          class="photo-input photo-textarea"
          min="3"
        />
        <div>
          <el-button type="primary" @click="handleSubmit">변경사항 적용</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
@import '@style/photo-drawer.scss';
.story-wrapper {
  width: 100% !important;
  .photo-input {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>
<style lang="scss" scope>
.story-wrapper {
  .photo-textarea {
    .el-textarea__inner {
      min-height: 150px !important;
    }
  }
}
</style>
