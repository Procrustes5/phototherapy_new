<script lang="ts" setup>
import { supabase } from '@/utils/supabase'
import { useHomeStore } from '@store/homeStore.ts'
import { storeToRefs } from 'pinia'
import Drawer from '@view/ui-elements/EditPhotoDrawer.vue'
import draggable from 'vuedraggable'

const photos = defineModel('photos')
const categoryId = defineModel('categoryId')
const category = ref()

const homeStore = useHomeStore()
const { clickedImage, clickedPhoto, isOpened } = storeToRefs(homeStore)
const handleDrawer = (photo) => {
  clickedImage.value = photo.content
  clickedPhoto.value = photo
  isOpened.value = true
}

const getCategory = async (): Promise<void> => {
  let { data } = await supabase.from('category').select('*').eq('id', categoryId.value)
  category.value = data
}

const saveOrder = async (): Promise<void> => {
  const updateOrder = () => {
    photos.value.forEach(async (photo, index) => {
      const { error } = await supabase.from('photo').update({ index }).eq('id', photo.id).select()
      if (error) throw error
    })
  }

  updateOrder()
}

onMounted(() => {
  getCategory()
})
</script>

<template>
  <div class="main-wrapper">
    <div class="main-image-wrapper">
      <div class="main-image" v-show="categoryId !== 5">
        <el-image :src="photos[0]?.content" alt="loading" class="img"></el-image>
      </div>
      <div class="conatus" v-if="categoryId === 1">
        <span>Conatus</span>
      </div>
      <div class="moment" v-else-if="categoryId === 2">
        <span>The Moment</span>
      </div>
      <div class="gyeongju" v-else-if="categoryId === 3">
        <span class="en">Gyeongju</span>
        <span>慶州</span>
      </div>
      <div class="docu" v-else-if="categoryId === 4">
        <span>Docu</span>
        <span class="and">&</span>
        <span>Snap</span>
      </div>
      <div class="conatus" v-else>
        <span>{{ category.name }}</span>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="content-header">
        <span>PHOTOS</span>
        <hr />
        <span>사진을 드래그하면 배치를 변경할 수 있습니다.</span>
      </div>
      <div class="content">
        <draggable v-model="photos" group="photos" item-key="id" tag="ul" @end="saveOrder">
          <template #item="{ photo, index }">
            <div class="photo-wrapper">
              <el-image
                :src="photos[index].content"
                class="img"
                :id="photo"
                @click="handleDrawer(photos[index])"
              ></el-image>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
  <Drawer />
</template>

<style lang="scss" scoped>
@import '@style/global.scss';
.main-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  .main-image-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    .main-image {
      width: 80%;
      height: 85vh;
      display: flex;
      justify-content: center;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .docu {
      width: 80%;
      height: 85vh;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        font-size: 80px;
        font-weight: 800;
        color: white;
        line-height: 80px;
        text-shadow: 5px 3px 5px rgba($color: #000000, $alpha: 0.8);
      }
      .and {
        font-size: 65px;
        display: flex;
        align-items: center;
      }
    }
    .conatus {
      width: 80%;
      height: 90vh;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-size: 100px;
        font-weight: 800;
        color: white;
        text-shadow: 5px 5px 30px rgba($color: #000000, $alpha: 0.8);
      }
    }
    .moment {
      width: 80%;
      height: 90vh;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        text-align: center;
        font-size: 100px;
        font-weight: 800;
        color: white;
        text-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.8);
      }
    }
    .gyeongju {
      width: 80%;
      height: 90vh;
      position: absolute;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        writing-mode: vertical-rl;
        font-size: 100px;
        font-weight: 800;
        color: white;
        text-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.8);
      }
      .en {
        font-size: 60px;
        letter-spacing: 4px;
        margin-left: 25px;
      }
    }
  }
  .content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .content-header {
      margin: 15px 0px;
      width: 80%;
      span {
        color: whitesmoke;
        font-size: 18px;
        font-weight: 600;
      }
    }
    .content {
      display: flex;
      justify-content: center;
    }
    ul {
      width: 80%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 5px;
      padding: 0px 30px;
      .photo-wrapper {
        height: 35vh;
        .img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
@media screen and (max-width: 767px) {
  .main-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .main-image-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      .main-image {
        width: 90%;
        height: 90vh;
        display: flex;
        justify-content: center;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .docu {
        width: 90%;
        height: 90vh;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span {
          font-size: 55px;
          font-weight: 800;
          color: white;
          line-height: 50px;
          text-shadow: 5px 3px 5px rgba($color: #000000, $alpha: 0.8);
        }
        .and {
          font-size: 40px;
          display: flex;
          align-items: center;
        }
      }
      .conatus {
        width: 90%;
        height: 85vh;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center span {
          font-size: 60px;
          font-weight: 800;
          color: white;
          text-shadow: 1px 1px 30px rgba($color: #000000, $alpha: 0.8);
        }
      }
      .moment {
        width: 90%;
        height: 85vh;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          text-align: center;
          font-size: 40px;
          font-weight: 800;
          color: white;
          text-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.8);
        }
      }
      .gyeongju {
        box-sizing: border-box;
        width: 90%;
        height: 85vh;
        position: absolute;
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;
        align-items: center;
        padding-top: 10px;
        span {
          writing-mode: horizontal-tb;
          font-size: 60px;
          font-weight: 800;
          color: white;
          text-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.8);
        }
        .en {
          font-size: 35px;
          margin-bottom: 8px;
          letter-spacing: 2px;
        }
      }
    }
    .content-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .content-header {
        margin: 15px 0px;
        width: 90%;
        span {
          color: whitesmoke;
          font-size: 18px;
          font-weight: 600;
        }
      }
      .content {
        width: 90%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 5px;
        padding: 0px 30px;
        .content-img {
          height: 160px;
          .img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
img {
  object-fit: cover;
}
</style>
