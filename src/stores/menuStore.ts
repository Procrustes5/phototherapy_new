import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const clickedIcon = ref<string>('')
  const isOpened = ref<boolean>(false)
  const isSlideVisible = ref<boolean>(true)

  const reset = () => {
    clickedIcon.value = ''
    isOpened.value = false
  }

  return {
    clickedIcon,
    isOpened,
    isSlideVisible,
    reset
  }
})
