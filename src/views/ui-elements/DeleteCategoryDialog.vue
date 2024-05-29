<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = defineModel('visible')
const categoryId = defineModel('categoryId')

const closeDialog = (): void => {
  visible.value = false
}

const confirmDialog = async (): Promise<void> => {
  const { error } = await supabase.from('category').delete().eq('id', categoryId.value)
  await router.go(0)
}

const handleClose = (): void => {
  visible.value = false
}
</script>
<template>
  <el-dialog
    v-model="visible"
    title="카테고리를 삭제하시겠습니까?"
    width="600px"
    :before-close="handleClose"
  >
    <div>
      <span>연결된 사진들의 정보는 사라집니다.</span>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">취소</el-button>
        <el-button type="danger" @click="confirmDialog">삭제</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
