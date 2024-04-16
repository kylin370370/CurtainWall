<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const selected_item = ref('1')

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <header v-if="false">
    <el-menu
    :default-active="selected_item"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="1"><RouterLink to="/">Home</RouterLink></el-menu-item>
    <el-sub-menu index="2">
      <template #title>About</template>
      <el-menu-item index="2-1"><RouterLink to="/about/QuakeEngMuseum">地震工程馆</RouterLink></el-menu-item>
      <el-menu-item index="2-2"><RouterLink to="/about/Composite">衷和楼</RouterLink></el-menu-item>
      <el-menu-item index="2-3"><RouterLink to="/about/Library" disabled>图书馆</RouterLink></el-menu-item>
      <el-menu-item index="2-4"><RouterLink to="/about/Office">政府大楼</RouterLink></el-menu-item>
      <el-menu-item index="2-5" disabled>敬请期待</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="3"><RouterLink to="/damage">Damage</RouterLink></el-menu-item>
  </el-menu>
  </header>

  <RouterView />
</template>

<style scoped>
.el-menu{
  background: linear-gradient(270deg, rgba(172, 176, 255, 0.94) 3.68%, rgba(209, 241, 255, 0.97) 34.53%, rgba(210, 241, 255, 0.97) 34.54%, rgba(251, 254, 255, 0.98) 58.26%, rgba(254, 254, 255, 1.00) 94.07%, #D8E6FF 99.65%, #FEFEFF 99.87%);
  height: 7vh;
}
.router-link-active {
  text-decoration: none;
  color: #409EFF;
}
a{
  text-decoration: none;
  color: black;
}
</style>
