<script>
import Model from '@/components/model.vue';
import data_A from '@/assets/imageCSV/A.csv';
import data_B from '@/assets/imageCSV/B.csv';
import data_C from '@/assets/imageCSV/C.csv';

/* 处理数据，获得选项2 */
var uniqueSet = new Set();    // 创建一个空Set对象
for (let i = 0; i < data_A.length; i++){
  uniqueSet.add(data_A[i].name[0]);   // 将字母添加到Set对象中，重复的字母不会被重复添加
}
var sel_2_A = Array.from(uniqueSet);

var uniqueSet = new Set();    
for (let i = 0; i < data_B.length; i++){
  uniqueSet.add(data_B[i].name[0]);  
}
var sel_2_B = Array.from(uniqueSet);

var uniqueSet = new Set();    
for (let i = 0; i < data_C.length; i++){
  uniqueSet.add(data_C[i].name[0]);  
}
var sel_2_C = Array.from(uniqueSet);
//console.log(sel_2_C);

export default {
  name: 'about',
  components: {
    Model,
  },
  data() {
    return {
      select_1: null,
      select_2: null,
      select_3: null,
      selections:[
        [
          {value: 'A',label: 'A'},
          {value: 'B',label: 'B'},
          {value: 'C', label: 'C'}
        ],
        [],
        []
      ],

      url: '',        //首张图片url
      srcList: [],    //可以放入多张图片
      info: [
        {name:'x', data: 0},
        {name:'y', data: 0},
        {name:'z', data: 0}
      ],
      unityMessage: '',     //来自unity
       
    }
  },
  methods:{
    addSelections(index, datalist){
      var that = this;
      that.selections[index] = [];
      if(index === 1){          
        for (let i = 0; i < datalist.length; i++){
          that.selections[index].push(
            {value: datalist[i], label: datalist[i]}
          );
        }
      }
      else{     //记录在data_X中的位置,便于发送信息
        for (let i = 0; i < datalist.length; i++){     //0.a_004  (index.name)  =>  0.a_004  a_004
          that.selections[index].push(
            {value: datalist[i], label: datalist[i].split(".")[1]}
          );
        }
      }
    },
    updateSelections(index){
      var that = this;      
      if(index === 0){        // A  B  C
        that.select_2 = null;
        that.select_3 = null;

        var sel_2 = sel_2_A;        
        if(that.select_1 === 'B')
          sel_2 = sel_2_B;
        else if(that.select_1 === 'C')
          sel_2 = sel_2_C;  

        that.addSelections(1, sel_2);
      }
      else if(index === 1){   // A-a
        that.select_3 = null;
        var sel_3 = [];
        var datalist = [];
        if(that.select_1 === 'A')
          datalist = data_A;      
        else if(that.select_1 === 'B')
          datalist = data_B;     
        else if(that.select_1 === 'C')
          datalist = data_C;
    
        for (let i = 0; i < datalist.length; i++){
          if(datalist[i].name.startsWith(that.select_2)){     //a_004.JPG =>  0.a_004  (index.name)
            sel_3.push(i + "." +datalist[i].name.split(".")[0]);
          }
        }
        that.addSelections(2, sel_3);
      }
      else{     //index === 2   //A-a-a_004
      }
    },
    sendSelections(){       //  按钮“确定”    1.向unity发坐标   2. 更新图片
      var that = this;
      //alert(that.select_1+" "+that.select_2+" "+that.select_3);
      var index = that.select_3.split(".")[0] - 0;
      var mess = data_A[index];
      if(that.select_1 === 'B')
        mess = data_B[index];
        else if(that.select_1 === 'C')
        mess = data_C[index];
      //alert(mess.x + "," + mess.y + "," + mess.z);
      this.$refs.unityModel.sendOrders(mess.x + "," + mess.y + "," + mess.z);


      var imageURL = "/DZGCG/Pictures/" + that.select_1 +"/" + that.select_3.split(".")[1] + ".JPG";   
      //alert(imageURL);
      that.url = imageURL;
      that.srcList = [imageURL];
      that.info[0].data = mess.x;
      that.info[1].data = mess.y;
      that.info[2].data = mess.z;
    },

    updatePicture(){
      var that = this;
      var imageURL = that.unityMessage.split('\r')[0];     //    /DZGCG/Pictures/A/a_004.JPG\r
      //console.log(that.unityMessage.split('\r'));         //  ['/DZGCG/Pictures/A/a_004.JPG', '']   
      that.url = imageURL;
      that.srcList = [imageURL];

      var des = imageURL.split('/');        //    ['DZGCG', 'Pictures', 'A', 'a_004.JPG']
      var datalist = [];
      if(des[2] === 'A')
        datalist = data_A;      
      else if(des[2] === 'B')
        datalist = data_B;     
      else if(des[2] === 'C')
        datalist = data_C;
      var mess = [];
      console.log(des);
      for (let i = 0; i < datalist.length; i++){
        //console.log(datalist[i].name);
        if(datalist[i].name === des[3]){     
          mess = datalist[i];
          //console.log(mess);
          break;
        }
      }
      //console.log(mess);
      that.info[0].data = mess.x;
      that.info[1].data = mess.y;
      that.info[2].data = mess.z;

    },
    recieve(event){
        var that = this;
        that.unityMessage = event.data.handle;
        that.updatePicture();
        console.log('(来自vue)' + that.unityMessage);  
    },
  },
  mounted(){
      window.addEventListener("message",this.recieve)
    },
}
</script>

<template>
  <div class="about">
    <div class="some-text">
      同济大学地震工程馆
    </div>

    <div class="select-wrapper">
      <el-select-v2
        v-model="select_1"
        :options="selections[0]"
        placeholder="Please select"
        @change="updateSelections(0)"
        size="large"
      />
      <el-select-v2
        v-model="select_2"
        :options="selections[1]"
        placeholder="Please select"
        @change="updateSelections(1)"
        size="large"
        :disabled="!select_1"
      />
      <el-select-v2
        v-model="select_3"
        :options="selections[2]"
        placeholder="Please select"
        @change="updateSelections(2)"
        size="large"
        :disabled="!select_2"
      />
      <el-button
      @click="sendSelections"
      color="#626aef"
      :disabled="!select_3"
      > 
      确定
      </el-button>
    </div>

    <div class="model-from-unity">
      <Model ref="unityModel"/>
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
        <a>&emsp;{{ data.data }}</a>
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
.select-wrapper{
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
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
  margin-left: 20px;
}
</style>
