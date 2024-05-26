<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import imageCompression from 'browser-image-compression'

const uploading = ref(false)
const uploadError = ref('')

const uploadPhoto = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''

  try {
    // Ensure the user is authenticated
    const { data: user } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
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

    alert('Photo uploaded successfully')
  } catch (error) {
    uploadError.value = `Error uploading photo: ${error.message}`
  } finally {
    uploading.value = false
  }
}
</script>
<template>
  <div class="update-container">
    <div>
      <input type="file" @change="uploadPhoto($event)" accept="image/*" />
      <div v-if="uploading">Uploading...</div>
      <div v-if="uploadError">{{ uploadError }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.update-container {
  margin-top: 80px;
}
</style>