<script lang="ts" setup>
import { useHomeStore } from '@store/homeStore.ts'
import { storeToRefs } from 'pinia'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const homeStore = useHomeStore()

const visible = ref<boolean>(false)

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
  router.go(0)
}

const handleDelete = async () => {
  const { error } = await supabase.from('photo').delete().eq('id', clickedPhoto.value.id)
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
        <div class="btn-wrapper">
          <el-button type="danger" @click="visible = true">삭제</el-button>
          <el-button type="primary" @click="handleSubmit">변경사항 적용</el-button>
        </div>
      </div>
    </div>
    <el-dialog v-model="visible" title="사진을 삭제하시겠습니까?" class="delete-photo-dialog">
      <div class="delete-dialog">
        <span class="dialog-text">해당 사진은 영구적으로 삭제됩니다.</span>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false">취소</el-button>
          <el-button type="danger" @click="handleDelete">확인</el-button>
        </div>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<style lang="scss" scoped>
@import '@style/photo-drawer.scss';
.drawer-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.story-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70% !important;
  .photo-input {
    width: 100%;
    margin-bottom: 8px;
  }
  .btn-wrapper {
    width: 100%;
    display: flex;
    justify-content: end;
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
.delete-photo-dialog {
  span {
    color: black !important;
  }
  .el-button--danger {
    span {
      color: white !important;
    }
  }
}
</style>
