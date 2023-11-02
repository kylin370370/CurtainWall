<script setup>
</script>

<template>
  <main>
    <h1>镜头使用说明</h1>
    <p>
      1.WASD去移动镜头<br>
      2.Q,E水平旋转镜头<br>
      3.set中选中usingScrollSize，鼠标放置在屏幕边缘，屏幕会根据鼠标的位置移动<br>
      4.set中选中usingMouse,操作鼠标移动镜头<br>
      5.set中选择mode，表示镜头滚轮的操作<br>
      &ensp;&ensp;(前者offset表示缩放，后者offset表示镜头垂直下降)<br>
      6.FollowOffsetMax与FollowOffsetMaxY分别表示滚轮的两种操作方式下
      镜头距离游戏物体的最大距离。相应的FollowOffsetMin与FollowOffsetMinY则表示最小距离<br>
      7.ctrl+鼠标操作为调整镜头视角。<br>
    </p>
    
  </main>
</template>
<style>

</style>