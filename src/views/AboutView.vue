<script>
import Model from '@/components/model.vue';


export default {
  name: 'about',
  components: {
    Model,
  },
  data() {
    return {
      url: '',        //首张图片url
      srcList: [],    //可以放入多张图片
      info: [
        {name:'参数1', data: 1.00001},
        {name:'参数2', data: 2.00002},
        {name:'参数3', data: 3.00001}
      ],
      unityMessage: '',     //来自unity
      userInput: '',        
    }
  },
  methods:{
    changeText(text){
      //this.$refs.Model.sendOrders();
      this.$refs.child.sendOrders(text);
    },
    updatePicture(){
      var that = this;
      if(that.unityMessage === '1_white'){
        that.url = '/pictures/1.jpg';
        that.srcList = ['/pictures/1.jpg'];
      }
      else if(that.unityMessage === '2_black'){
        that.url = '/pictures/2.jpg';
        that.srcList = ['/pictures/2.jpg'];
      }
      else if(that.unityMessage === '3_gray'){
        that.url = '/pictures/3.jpg';
        that.srcList = ['/pictures/3.jpg'];
      }
      else{
        that.url = '';
        that.srcList = [];
      }
    },
    recieve(event){
        var that = this;
        that.unityMessage = event.data.handle;
        that.updatePicture();
        console.log('(来自vue)' + that.unityMessage);  
    },
  },
  mounted(){
      // document.getElementById("unity-infame").addEventListener("message",this.recieve)
      window.addEventListener("message",this.recieve)
    },

  /*
  mounted() {
  // 获取 Unity WebGL 的 iframe 元素
  const unityIframe = document.getElementById('unity-iframe');

  // 在 iframe 中执行 JavaScript 代码
  unityIframe.contentWindow.postMessage('getPlayerPrefs', '*');

  // 监听 Unity WebGL 发送的消息
  window.addEventListener('message', this.handleUnityMessage);
  
  window.ReceiveStringFromUnity = (message) => {
      // 在这里处理来自Unity的字符串
      console.log("Received string from Unity:", message);
    };
  },

  methods: {
    handleUnityMessage(event) {
    // 检查消息来源是否是 Unity WebGL
      if (event && event.source && event.source === document.getElementById('unity-iframe').contentWindow) {
      const data = event.data;

      // 在这里处理从 Unity WebGL 获取到的数据
      console.log('Received data from Unity WebGL:', data);
    }
  }
  },
/*
  computed: {
    localStorageData() {
      // 获取保存的数据
      return localStorage.getItem("myData");
    }
  },
  watch: {
    localStorageData(newData) {
      // 当 localStorageData 发生变化时更新 savedData
      this.unityMessage = newData;
      this.updatePicture();
      console.log("保存的数据：", this.unityMessage);
    }
  },
  mounted() {
    // 初始化时获取一次保存的数据
    this.unityMessage = this.localStorageData;
    console.log("保存的数据：", this.unityMessage);
  },
  */

}
</script>

<template>
  <div class="about">
    <div class="some-text">
      同济大学地震工程馆
    </div>
    <div class="model-from-unity">
      <Model ref="child"/>
    </div>
    <div v-if="0" class="orders">
      <el-input
        v-model="userInput"
        maxlength="20"
        placeholder="Please input"
        show-word-limit
        type="text"
      />
      <el-button v-if="userInput" @click="changeText(userInput)">
        确定
      </el-button>
    </div>
    <div v-if="url" class="details">
      <div class="image">
        <el-image
          style="width: 200px; height: 200px"
          :src="url"
          :zoom-rate="1.2"
          :preview-src-list="srcList"
          :initial-index="4"
          fit="cover"
        />
      </div>
      <div class="info">
        <p v-for="data in info" :key="data">
        <a>{{ data.name }}:</a>
        <a>&emsp;&emsp;{{ data.data }}</a>
        </p>
      </div>
    
  </div>

  </div>
</template>

<style>
.some-text{
  height: 80px;
  font-size: 40px;
  font-weight: bold;
  line-height: 80px;
  margin-left: 30px;
}
.model-from-unity{
  display: flex;
  justify-content: center;
  align-items: center;
}
.details{
  display: flex;
  align-items: flex-start;
  margin-left: 200px;
}
.image{
  margin-left: 0px;
}
.info{
  margin-left: 10px;
}
.orders{
  display: flex;
  align-items: flex-start;
  margin-left: 200px;
  margin-right: 200px;
}
</style>
