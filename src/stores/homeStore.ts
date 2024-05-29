import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', () => {
  const clickedImage = ref()
  const clickedPhoto = ref()
  const isOpened = ref<boolean>(false)
  const isSlideVisible = ref<boolean>(true)
  return {
    clickedImage,
    clickedPhoto,
    isOpened,
    isSlideVisible
  }
})
