<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const selected_item = ref('1')

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <header>
    <el-menu
    :default-active="selected_item"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <el-menu-item index="1"><RouterLink to="/">Home</RouterLink></el-menu-item>
    <el-sub-menu index="2">
      <template #title>About</template>
      <el-menu-item index="2-1"><RouterLink to="/about">地震工程馆</RouterLink></el-menu-item>
      <el-menu-item index="2-2" disabled>敬请期待</el-menu-item>
    </el-sub-menu>
  </el-menu>
  </header>

  <RouterView />
</template>

<style scoped>
.router-link-active {
  text-decoration: none;
  color: rgb(248, 209, 53);
}
a{
  text-decoration: none;
  color: white;
}
</style>
