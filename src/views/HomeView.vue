<script>
import{ Search,Position,Histogram,Scissor,Moon,Pointer } from '@element-plus/icons-vue';
import { RouterLink, RouterView } from 'vue-router'

var imageURL = ["/home/carousel_1.png","/home/carousel_2.png","/home/carousel_3.png",
  "/home/carousel_4.png","/home/carousel_5.png","/home/carousel_6.png"];

var imageURL_2 = ["/home/carousel_2_1.png","/home/carousel_2_2.png","/home/carousel_2_3.png",
  "/home/carousel_2_4.png"];

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
      option:'0',
      imageBox: imageURL,
    }
  },
  methods: {
    handleClick_change(){
      if(this.option === '0'){
        this.imageBox = imageURL;
      }
      else{
        this.imageBox = imageURL_2;
      }
    },
    changePage() {
      if(this.option === '0'){
        this.$router.push('/about/QuakeEngMuseum')
      }
      else{
        this.$router.push('/about/Composite')
      }
    }
  },
  }
</script>

<template>
  <div class="home" >
    <img class="bk_image" src="../assets/home/bk.png">

    <div class="option_wrapper">
      <div class="mb-2 flex items-center text-sm">
        <el-radio-group v-model="option" class="ml-4" @change="handleClick_change">
          <el-radio label="0" size="large">地震工程馆</el-radio>
          <el-radio label="1" size="large">衷和楼</el-radio>
        </el-radio-group>
      </div>
    </div>

    <div v-if="option==='0'" class="quake_info">
      <div class="text_1_1">
        <el-row style="margin-bottom: 2%">地震工程馆</el-row>
      </div>
      <div class="text_1_2">同济大学多功能振动实验中心是当前世界规模最大、由四座振动台组合而成的大型综合试验室，为我国广泛领域内的振动和抗震试验研究、土木工程领域防灾提供了一个开放的试验平台。这一领先国际的振动台组系统不仅能对大型桥梁工程、生命管线、水坝、隧道等线状结构进行振动试验研究，还能以矩形振动台组形式对高层建筑、超高层建筑、体育场馆等大型建筑结构进行抗震试验研究。四座振动台总承载能力为200吨，为目前国内振动台承载能力之最。投入使用以来，已先后为泰州长江大桥、广东榕江桥、港珠澳隧道等大型建筑和工程进行抗震实验，有效促进了学校学科发展和人才培养，并为国家建设提供了很好的技术支撑。</div>
      <el-divider />
      <el-row class="text_fun">
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
      </el-row>
      <div class="router_button">
        <el-button @click="changePage" size="large" color="#EEFFFF" round>
          <el-icon><Pointer /></el-icon>前往体验
        </el-button>
      </div>
    </div>
    <div v-else class="quake_info">
      <div class="text_1_1">
        <el-row style="margin-bottom: 2%">衷和楼</el-row>
      </div>
      <div class="text_1_2">
        衷和楼原为综合楼，取同济当发展为综合型科研型大学之义，为教学科研综合楼。现改为衷和楼，又与原音接近，取自《尚书·皋陶谟》：“同寅协恭和衷哉”，寓意和衷共济，契合同济精神。于2007年百年校庆前建成并投入使用, 是百年校庆的标志性建筑。
        综合楼的大投资以及建立在大投资基础上的体量都是有史以来之最,其高度创造了同济校本部的新地标,无论空间的塑造方式还是立面用材分割都具时代感,但立面的分割方式、色彩又与五、六十年代建成的南北教学楼、图书馆以及八十年代末期的行政楼相协调,又从老建筑的立面中获得自身的设计依据。
      </div>

      <el-divider />
      <el-row class="text_fun">
        <el-col :span="7">
          <el-icon><Search /></el-icon><br>
          查看幕墙
        </el-col>
        <el-divider direction="vertical" />
        <el-col :span="7">
          <el-icon><Histogram /></el-icon><br>
          图片对比
        </el-col>
        <el-divider direction="vertical" />
        <el-col :span="7">
          <el-icon><Moon /></el-icon><br>
          夜景模式
        </el-col>
      </el-row>
      <div class="router_button">
        <el-button @click="changePage" size="large" color="#EEFFFF" round>
          <el-icon><Pointer /></el-icon>前往体验
        </el-button>
      </div>
    </div>


    <div class="carousel">
      <el-carousel :interval="3000" type="card" height="65vh"  direction="vertical">
        <el-carousel-item v-for="(item, index) in imageBox" :key="index">
          <el-image :src="item" style="height: 100%;"/>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<style>
body{
  height: 98vh;
}
.home {
  position: relative;
  height: 92vh;
  background: linear-gradient(180deg, #FFF 0%, #FFF 0.01%, #EFF 100%);
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
  color: rgb(73, 65, 56);
  font-weight: 600;
}
.text_1_2{
  font-size:1.7lvh;
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
