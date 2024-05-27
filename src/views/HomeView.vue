<script>
import{ Search,Position,Histogram,Scissor,Moon,Pointer,Warning } from '@element-plus/icons-vue';
import { useDisabled } from 'element-plus';
import { RouterLink, RouterView } from 'vue-router'

var imageURL_1 = [
  "/home/carousel_1_1.png",
  "/home/carousel_1_2.png",
  "/home/carousel_1_3.png",
  "/home/carousel_1_4.png",
  "/home/carousel_1_5.png",
  "/home/carousel_1_6.png"
];

var imageURL_2 = [
  "/home/carousel_2_1.png",
  "/home/carousel_2_2.png",
  "/home/carousel_2_3.png",
  "/home/carousel_2_4.png"
];

var imageURL_3 = [
  "/home/carousel_3_1.png",
  "/home/carousel_3_2.png",
  "/home/carousel_3_3.png",
  "/home/carousel_3_4.png"
];

  export default {
  name: 'about',
  components:{
    Search,
    Position,
    Histogram,
    Scissor,
    Moon,
    Pointer,
  },
  data(){
    return{
      option: '0',
      imageBox: imageURL_1,
    }
  },
  methods: {
    handleClick_change() {
      if (this.option === '0') {
        this.imageBox = imageURL_1;
      }
      else if (this.option === '1') {
        this.imageBox = imageURL_2;
      }
      else {
        this.imageBox = imageURL_3;
      }
    },
    changePage() {
      if(this.option === '0'){
        this.$router.push('/about/QuakeEngMuseum')
      }
      else if(this.option === '1'){
        this.$router.push('/about/Office')
      }
      else if(this.option === '2'){
        this.$router.push('/about/Composite')
      }
    },
    navigateToUpload() {
      // 使用router.push方法跳转到/upload路由
      this.$router.push('/upload');
    }
  },
  }
</script>

<template>
  <div class="home">
    <!-- 背景图片 -->
    <img class="bk_image" src="../assets/home/bk.png">

    <!-- 顶部导航栏 -->
    <div class="option_wrapper">
      <div class="mb-2 flex items-center text-sm">
        <el-radio-group v-model="option" class="ml-4" @change="handleClick_change" fill="#B29F82">
          <el-radio-button label="0" size="middle">地震工程馆</el-radio-button>
<!--          <el-radio-button label="1" size="middle">井开区政府⼤楼</el-radio-button>-->
          <el-radio-button label="2" size="middle">衷和楼</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 地震工程馆 -->
    <div v-if="option==='0'" class="quake_info">
      <div class="text_1_1">
        <el-row style="margin-bottom: 2%">地震工程馆三维幕墙裂缝检测展示系统</el-row>
      </div>
      <div class="text_1_2">
        同济大学地震⼯程馆是当前世界规模最大、由四座振动台组合而成的大型综合试验室，通体由石材幕墙作为外维护结构。使用年限十余年，表面出现不少裂缝损伤。我们通过无人机对地震馆进行三维模型数据采集和局部图像矩阵拍摄，并将局部图像进行批量裂缝检测，将检测结果映射到三维模型上，供用户查看。系统提供如下功能：<br>▪ 将局部图像中心点映射到三维模型上，并以红⻩绿三种颜色标识其损伤程度<br>▪ 查看局部图像的处理过程和检测结果<br>▪ 批量查看严重损伤幕墙块的具体情况
      </div>

      <el-divider />

      <el-row class="text_fun">
        <el-col :span="7">
          <el-icon><Search /></el-icon><br>
          浏览建筑模型
        </el-col>

        <el-divider direction="vertical" />

        <el-col :span="7">
          <el-icon><Position /></el-icon><br>
          图像处理结果
        </el-col>

        <el-divider direction="vertical" />

        <el-col :span="7">
          <el-icon><Histogram /></el-icon><br>
          损伤等级预警
        </el-col>
      </el-row>

      <div class="router_button">
        <el-button @click="changePage" size="large" color="#B29F82" style="color:white" round>
          <el-icon><Pointer /></el-icon>前往体验
        </el-button>
        <el-button @click="navigateToUpload" size="large" color="#B29F82" style="color:white" round>上传模型</el-button>
      </div>
    </div>

    <!-- 井开区政府大楼 -->
    <div v-if="option==='1'" class="quake_info">
      <div class="text_1_1">
        <el-row style="margin-bottom: 2%">井开区政府大楼三维幕墙裂缝检测展示系统</el-row>
      </div>
      <div class="text_1_2">
        井冈山国家级经济技术开发区政府新大楼的外围护结构，由石材幕墙加玻璃幕墙混合组成。建筑整体较新，石材幕墙⽆明显裂缝损伤。为保护隐私，与井开区城市建设管理局协商，在本系统中仅展⽰政府⼤楼背面和中间的石材幕墙部分区域，可作为系统功能和泛化性的验证。
      </div>

      <el-divider />

      <el-row class="text_fun">
        <el-col :span="7">
          <el-icon><Search /></el-icon><br>
          浏览建筑模型
        </el-col>

        <el-divider direction="vertical" />

        <el-col :span="7">
          <el-icon><Position /></el-icon><br>
          图像处理结果
        </el-col>

        <el-divider direction="vertical" />

        <el-col :span="7">
          <el-icon><Histogram /></el-icon><br>
          损伤等级预警
        </el-col>
      </el-row>

      <div class="router_button">
        <el-button @click="changePage" size="large" color="#B29F82" style="color:white" round>
          <el-icon><Pointer /></el-icon>前往体验
        </el-button>
        <el-button @click="navigateToUpload" size="large" color="#B29F82" style="color:white" round>上传模型</el-button>
      </div>
    </div>

    <!-- 衷和楼 -->
    <div v-if="option==='2'" class="quake_info">
      <div class="text_1_1">
        <el-row style="margin-bottom: 2%">衷和楼三维幕墙裂缝检测展示系统</el-row>
      </div>
      <div class="text_1_2">
        同济大学衷和楼是一座现代化的教学综合楼，它是一座高层建筑，拥有多层楼层，为师生提供了一个舒适的学习和研究环境。该建筑的设计现代而简洁，外立面采用玻璃幕墙，⽆明显裂缝损伤。为了确保建筑的安全性和维护其外观品质，本系统利用先进的技术手段对衷和楼幕墙进行检测。
        <!-- 坐落于上海虹桥经济开发区，由常年展贸中心、上海世贸展馆、上海世贸大厦三大主体建筑构成，是一个集展示、交易、办公、资讯于一体的超级交易市场，为国内外商家及专业买主提供国际级的设施和服务。 -->
      </div>

      <el-divider />

      <el-row class="text_fun">
        <el-col :span="7">
          <el-icon><Search /></el-icon><br>
          浏览建筑模型
        </el-col>

        <el-divider direction="vertical" />

        <el-col :span="7">
          <el-icon><Position /></el-icon><br>
          图像处理结果
        </el-col>

        <el-divider direction="vertical" />

        <el-col :span="7">
          <el-icon><Histogram /></el-icon><br>
          损伤等级预警
        </el-col>
      </el-row>

      <!-- <el-row class="text_fun">
        <el-col :span="4">
          <el-icon><Search /></el-icon><br>
          查看幕墙
        </el-col>
        <el-divider direction="vertical" />
        <el-col :span="4">
          <el-icon><Position /></el-icon><br>
          两点测距
        </el-col>
        <el-divider direction="vertical" />
        <el-col :span="4">
          <el-icon><Histogram /></el-icon><br>
          图片对比
        </el-col>
        <el-divider direction="vertical" />
        <el-col :span="4">
          <el-icon><Scissor /></el-icon><br>
          图像分割
        </el-col>
        <el-divider direction="vertical" />
        <el-col :span="4">
          <el-icon><Moon /></el-icon><br>
          夜景模式
        </el-col>
      </el-row>  -->

      <div class="router_button">
        <el-button @click="changePage" size="large" color="#B29F82" style="color:white" round>
          <el-icon><Pointer /></el-icon>前往体验
        </el-button>
        <el-button @click="navigateToUpload" size="large" color="#B29F82" style="color:white" round>上传模型</el-button>
      </div>

    </div>

    <!-- 右侧轮播图 -->
    <div class="carousel">
      <el-carousel :interval="3000" type="card" height="65vh" direction="vertical">
        <el-carousel-item v-for="(item, index) in imageBox" :key="index">
          <el-image :src="item" style="height: 100%;"/>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<style scope>
body{
  height: 98vh;
}
.home {
  position: relative;
  height: 92vh;
  /* background: linear-gradient(180deg, #FFF 0%, #FFF 0.01%, #EFF 100%); */
}
.bk_image{
  width: 50vw;
  position: absolute;
  bottom: 0;
  left: 0;
}
.option_wrapper{
  position: absolute;
  width: 44vw;
  left:6%;
  top:5%;
}
.quake_info{
  position: absolute;
  width: 44vw;
  left:6%;
  top:12%;
}
.text_1_1{
  font-size:5lvh;
  /* color: rgb(73, 65, 56); */
  color: #6f685f;
  font-weight: 600;
}
.text_1_2{
  font-size:1.9lvh;
  line-height: 30px;
  height: 25vh;
}
.text_fun{
  text-align: center;
  color: rgb(99, 90, 90);
  font-size: 1.8lvh;
}
.router_button{
  display: flex;
  justify-content: center;
  margin-top: 4%;
}

.carousel{
  width: 40vw;
  height: 65vh;
  position: absolute;
  top:11%;
  right: 7%;
}
.el-carousel{
  text-align: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: rgba(153, 169, 191, 0.30);
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: rgba(211, 220, 230, 0.50);
}

</style>
