import { defineStore } from 'pinia'

interface Photo {
  content: string
  title?: string
  description?: string
}

export const useHomeStore = defineStore('home', () => {
  const clickedImage = ref<string>('')
  const clickedPhoto = ref<Photo | null>(null)
  const isOpened = ref<boolean>(false)
  const isSlideVisible = ref<boolean>(true)
  const photoIndex = ref<number>(0)

  const reset = () => {
    clickedImage.value = ''
    clickedPhoto.value = null
    isOpened.value = false
    photoIndex.value = 0
  }

  return {
    clickedImage,
    clickedPhoto,
    isOpened,
    isSlideVisible,
    photoIndex,
    reset
  }
})
