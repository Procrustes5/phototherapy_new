<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const photo = ref([])
const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')

const getLoginPhoto = async (): Promise<void> => {
  let { data } = await supabase.from('photo').select('*').eq('id', 100)
  photo.value = data
}

const validateEmail = () => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  emailError.value = regex.test(email.value) ? '' : 'Invalid email address'
}

const validatePassword = () => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  passwordError.value = regex.test(password.value) ? '' : 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character'
}

const isFormValid = computed(() => !emailError.value && !passwordError.value && email.value && password.value)

const login = async () => {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
    console.log(error)
    if (error) throw error
    alert('Login successful')
    router.push('/')
  } catch (error) {
    alert(error.message)
  }
}


onMounted(() => {
  getLoginPhoto();
})
</script>
<template>
  <div class="login-page">
    <el-image :src="photo[0]?.content"></el-image>
    <div class="login-form-wrapper">
      <div class="title-wrapper">
        <span class="title">Admin Login</span>
      </div>
      <div class="form">
        <div class="form-item">
          <span>Email</span>
          <el-input @input="validateEmail" placeholder="email" type="email" v-model="email" />
        </div>
        <div class="form-item">
          <span>Password</span>
          <el-input @input="validatePassword" placeholder="password" type="password" v-model="password" />
        </div>
      </div>
      <div class="btn-wrapper">
        <button class="btn" @click="login">
          Go
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100%;
  margin-top: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 8px 32px;
  box-sizing: border-box;
  .login-form-wrapper {
    min-width: 400px;
    min-height: 200px;
    border: 1px solid whitesmoke;
    padding: 12px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title-wrapper {
      .title {
        color: whitesmoke;
        font-size: 30px;
        font-weight: 600;      
      }
      margin-bottom: 24px;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      .form-item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      span {
        min-width: 90px;
        color: whitesmoke;
        font-weight: 600;
      }
      input {
        width: 100%;
        border: 1px solid whitesmoke;
        padding: 4px 8px;
        border-radius: 4px;
        height: 24px;
        outline: none;
      }
    }
    .btn-wrapper {
      width: 100%;
      display: flex;
      justify-content: end;
      margin-top: 20px;
      .btn {
        width: 80px;
        height: 36px;
        border-radius: 4px;
        color: whitesmoke;
        background: transparent;
        border: 1px solid whitesmoke;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
      }
    }
  }
}
</style>