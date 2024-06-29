<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = defineModel('visible')
const name = ref<string>('')

const closeDialog = (): void => {
  visible.value = false
}

const confirmDialog = async (): Promise<void> => {
  const { error } = await supabase
    .from('category')
    .insert([{ name: name.value }])
    .select()
  await router.go(0)
  if (error) throw error
}

const handleClose = (): void => {
  visible.value = false
  name.value = ''
}
</script>
<template>
  <el-dialog v-model="visible" title="카테고리 추가" width="600px" :before-close="handleClose">
    <div>
      <div>
        <label for="input">이름</label>
        <el-input v-model="name" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">취소</el-button>
        <el-button type="primary" @click="confirmDialog" :disabled="name === ''">추가</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
