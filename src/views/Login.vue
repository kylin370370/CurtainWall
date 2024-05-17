<template>
  <div class="login-container">
    <h1 class="title">幕墙3D建模与交互系统</h1>

    <el-form :model="loginForm" @submit.native.prevent="handleLogin" class="login-form">
      <div class="input-container">
        <el-form-item label="用户名" class="form-item">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" class="form-item">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </div>
      <div class="button-container">
        <el-button type="text" @click="goToRegister">注册</el-button>
        <el-button type="primary" class="login-button" @click="handleLogin">登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const loginForm = ref({
  username: '',
  password: ''
})

const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:8443/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: loginForm.value.username,
        password: loginForm.value.password
      })
    })

    const data = await response.json()
    if (data.data) {
      localStorage.setItem('loggedIn', 'true')
      router.push('/about')
    } else {
      alert('用户名或密码错误')
    }
  } catch (error) {
    console.error('登录失败：', error)
    alert('登录失败，请稍后重试')
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column; /* 将子元素垂直排列 */
  justify-content: flex-start; /* 内容垂直对齐到顶部 */
  align-items: center;
  height: 100vh;
  margin-top: 100px; /* 调整上边距 */
}

.title {
  margin-bottom: 50px; /* 调整标题下方的间距 */
  text-align: center; /* 居中标题文字 */
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.input-container {
  margin-bottom: 10px; /* 调整输入框组的底部间距 */
}

.form-item {
  margin-bottom: 10px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px; /* 调整按钮组的顶部间距 */
}
</style>
