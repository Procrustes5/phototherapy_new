<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import imageCompression from 'browser-image-compression'
import EditPhotoPage from './EditPhotoPage.vue'

const uploading = ref(false)
const uploadError = ref('')
const categories = ref([])
const selectedCategory = ref()
const categoryIdForPhoto = ref(1)
const photos = ref([])

const uploadPhoto = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''

  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('접근이 허용되지 않은 유저입니다.')
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true
    }
    const compressedFile = await imageCompression(file, options)
    const { data, error } = await supabase.storage
      .from('photo')
      .upload(`images/${compressedFile.name}`, compressedFile)

    if (error) throw error

    const storageFormerUrl = 'https://xcufblnekuysvojkwbot.supabase.co/storage/v1/object/public/'

    const { data: photo, error: postPhotoError } = await supabase
      .from('photo')
      .insert([
        { content: storageFormerUrl.concat(data.fullPath), category_id: selectedCategory.value }
      ])
      .select()

    if (!postPhotoError) {
      alert('사진이 정상적으로 업로드 되었습니다.')
    }
  } catch (error) {
    uploadError.value = `업로드 중 에러가 발생했습니다.: ${error.message}`
  } finally {
    uploading.value = false
  }
}
const getCategories = async (): Promise<void> => {
  let { data } = await supabase.from('category').select('*')
  categories.value = data
}

const getPhotoByCategory = async (categoryId: number): Promise<void> => {
  let { data: photo, error } = await supabase
    .from('photo')
    .select('*')
    .eq('category_id', categoryId)
  photos.value = photo
}
onMounted(() => {
  getCategories()
  getPhotoByCategory(1)
})
</script>
<template>
  <div class="upload-container">
    <div class="upload-image">
      <el-select v-model="selectedCategory" placeholder="카테고리 선택">
        <el-option
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>
      <input type="file" @change="uploadPhoto($event)" accept="image/*" />
      <div v-if="uploading">Uploading...</div>
      <div v-if="uploadError">{{ uploadError }}</div>
    </div>
    <div class="edit-category-wrapper">
      <span>카테고리 편집</span>
      <div class="edit-category-list">
        <div class="category-item" v-for="category in categories" :key="category.id">
          <div class="title-wrapper">
            <span>카테고리명 : </span>
            <span>{{ category.name }}</span>
          </div>
          <div class="btn-wrapper">
            <div class="btn">편집</div>
            <div class="btn">삭제</div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <span>미리보기 & 제목・설명 편집</span>
      <span>사진을 클릭해서 상세정보를 수정할 수 있습니다.</span>
      <EditPhotoPage v-model:photos="photos" v-model:categoryId="categoryIdForPhoto" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.upload-container {
  width: 100%;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  span {
    color: whitesmoke;
  }
  .upload-image {
    width: 500px;
    display: flex;
    justify-content: center;
  }
  .edit-category-wrapper {
    .edit-category-list {
      width: 500px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      .category-item {
        border: 1px solid whitesmoke;
        border-radius: 4px;
        padding: 4px 8px;
        display: flex;
      }
    }
  }
}
</style>
<style lang="scss" scope>
.upload-container {
  .el-select-dropdown__item {
    span {
      color: black !important;
    }
  }
}
</style>
