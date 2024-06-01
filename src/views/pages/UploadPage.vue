<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import imageCompression from 'browser-image-compression'
import EditPhotoPage from './EditPhotoPage.vue'
import AddCategoryDialog from '../ui-elements/AddCategoryDialog.vue'
import DeleteCategoryDialog from '../ui-elements/DeleteCategoryDialog.vue'

const uploading = ref<boolean>(false)
const uploadError = ref<string>('')
const categories = ref([])
const selectedCategory = ref()
const categoryIdForPhoto = ref<number>(1)
const photos = ref([])
const isEditing = ref<boolean>(false)
const visibleAddDialog = ref<boolean>(false)
const visibleDeleteDialog = ref<boolean>(false)

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
  let { data } = await supabase.from('category').select('*').order('id', { ascending: true })
  categories.value = data
}

const getPhotoByCategory = async (categoryId: number): Promise<void> => {
  let { data: photo, error } = await supabase
    .from('photo')
    .select('*')
    .eq('category_id', categoryId)
  photos.value = photo
}

const handleOpenAddDialog = () => {
  visibleAddDialog.value = true
}

const handleOpenDeleteDialog = () => {
  visibleDeleteDialog.value = true
}

const handleEditCategory = async (id: number, name: string): Promise<void> => {
  const { data, error } = await supabase.from('category').update({ name }).eq('id', id).select()
  isEditing.value = false
}

watch(categoryIdForPhoto, (id: number) => {
  getPhotoByCategory(id)
})

onMounted(() => {
  getCategories()
  getPhotoByCategory(1)
})
</script>
<template>
  <div class="upload-container">
    <div class="upper-part">
      <div class="upload-image">
        <span class="title">사진 업로드</span>
        <el-select class="category-select" v-model="selectedCategory" placeholder="카테고리 선택">
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
        <span class="edit-title title">카테고리 편집</span>
        <div class="edit-category-list">
          <div class="category-item" v-for="category in categories" :key="category.id">
            <div class="title-wrapper">
              <span class="title-label">카테고리명 : </span>
              <span v-if="!isEditing">{{ category.name }}</span>
              <el-input
                v-else
                v-model="category.name"
                placeholder="카테고리를 편집"
                clearable
                class="edit-input"
              >
              </el-input>
            </div>
            <div class="btn-wrapper">
              <div class="btn" v-if="!isEditing" @click="() => (isEditing = true)">편집</div>
              <div class="btn delete" v-if="!isEditing" @click="handleOpenDeleteDialog">삭제</div>
              <div class="btn delete" v-if="isEditing" @click="() => (isEditing = false)">취소</div>
              <div
                class="btn"
                v-if="isEditing"
                @click="handleEditCategory(category.id, category.name)"
              >
                확인
              </div>
            </div>
            <DeleteCategoryDialog
              v-model:visible="visibleDeleteDialog"
              v-model:categoryId="category.id"
            />
          </div>
        </div>
        <div class="add-category-btn">
          <div class="btn" @click="handleOpenAddDialog">+ 카테고리 추가</div>
        </div>
      </div>
    </div>
    <div class="edit-photo-container">
      <div class="edit-photo-header">
        <span class="title">사진 미리보기 & 제목・설명 편집</span>
        <span class="description">사진을 클릭해서 상세정보를 수정할 수 있습니다.</span>
        <el-select v-model="categoryIdForPhoto" placeholder="카테고리 선택">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </div>
      <EditPhotoPage v-model:photos="photos" v-model:categoryId="categoryIdForPhoto" />
    </div>
    <AddCategoryDialog v-model:visible="visibleAddDialog" />
  </div>
</template>
<style lang="scss" scoped>
.upload-container {
  width: 100%;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    font-size: 18px;
    font-weight: 600;
  }
  .description {
    margin-left: 8px;
  }
  span {
    color: whitesmoke;
  }
  .upper-part {
    width: 80%;
    display: flex;
    justify-content: space-between;
    .category-select {
      margin-bottom: 8px;
    }
  }
  .upload-image {
    width: 500px;
    display: flex;
    flex-direction: column;
    padding: 0px 16px;
  }
  .edit-category-wrapper {
    .edit-title {
      font-weight: 600;
      margin: 12px 0px;
    }
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
        justify-content: space-between;
        align-items: center;
        .title-wrapper {
          width: 300px !important;
          display: flex;
          width: fit-content;
          align-items: center;
          gap: 4px;
          .title-label {
            min-width: 80px;
          }
          .edit-input {
            width: 100%;
            height: 100%;
          }
        }
        .btn-wrapper {
          display: flex;
          gap: 4px;
          .btn {
            border: 1px solid whitesmoke;
            border-radius: 4px;
            padding: 4px 8px;
            color: whitesmoke;
            cursor: pointer;
          }
          .delete {
            background: rgb(239, 89, 89);
          }
        }
      }
    }
    .add-category-btn {
      display: flex;
      justify-content: end;
      margin-top: 8px;
      .btn {
        cursor: pointer;
      }
    }
  }
  .edit-photo-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    .edit-photo-header {
      width: 80%;
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
