<script>
import Unity from "vue-unity-webgl";

  export default {
    name: 'UnityModel',
    methods:{
      sendOrders(order){
        this.$refs.unityIframe.contentWindow.sendOrders(order);
      }
    },
  }
</script>

<template>
    <div>
      <iframe id="unity-iframe" 
        ref="unityIframe"
        src="/unityModel/index.html" 
        width="1000" 
        height="660">
      </iframe>
    </div>
</template>
  
<style scoped>
  div {
    width: 1000px;
    height: 700px;
  }
</style>