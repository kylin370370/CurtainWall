<template>
  <div class="container">
    <h1 class="title">幕墙3D建模与交互系统</h1>
    <el-form :model="registerForm" @submit.native.prevent="handleRegister" class="register-form">
      <el-form-item label="用户名" prop="username" class="form-item">
        <el-input v-model="registerForm.username" maxlength="20" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" class="form-item">
        <el-input type="password" v-model="registerForm.password" maxlength="20" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item class="form-item button-container">
        <el-button type="primary" @click="handleRegister">注册</el-button>
        <el-button type="text" @click="goToLogin">返回登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const registerForm = ref({
  username: '',
  password: ''
})

const router = useRouter()

const handleRegister = async () => {
  try {
    const response = await fetch('http://localhost:8443/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: registerForm.value.username,
        password: registerForm.value.password
      })
    })

    const data = await response.json()
    console.log(data);
    if (data.msg=="success") {
      alert('注册成功！请登录。')
      router.push('/')
    } else {
      alert('注册失败，请稍后重试。')
    }
  } catch (error) {
    console.error('注册失败：', error)
    alert('注册失败，请稍后重试。')
  }
}

const goToLogin = () => {
  router.push('/')
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  margin-top: 100px;
}

.title {
  margin-bottom: 50px;
  text-align: center;
}

.register-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.form-item {
  margin-bottom: 10px;
}

.input-container {
  margin-bottom: 10px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}
</style>
