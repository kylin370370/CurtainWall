<script>
import{ Location,Setting,Search,Delete,QuestionFilled,InfoFilled } from '@element-plus/icons-vue';
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
    Location,
    Setting,
    Search,
    Delete,
    QuestionFilled,
    InfoFilled,
  },
  data() {
    return {

      setting_is_open: false,     //是否打开设置边栏
      setting_type: 'camera',     //设置--相机/对比
      setting_camera:{
        is_info: false,           //是否显示使用说明
        //is_keyboard: false,       
        //is_mouse: false,          
        rotating: 0,              //旋转角度  0-360   xz面
      },//其他按钮： 重置
      is_keyboard: false,         //是否允许使用键盘
      is_mouse:false,             //是否允许使用鼠标
      selectedOption: '0',
      modeSelections: [
        { value: '0', label: '靠近' },
        { value: '1', label: '降落' }
      ],

      setting_compare:{
        is_open: false,         //是否开启对比
        is_show: true,          //是否显示坐标等信息
        max_num: 1,             //对比数量      1-10
        points:[],
      },//其他按钮： 清空

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

      url: '',        //图片url
      srcList: [],    //打开图片预览，可以放入多张图片
      info: [
        {name:'x', data: 0},
        {name:'y', data: 0},
        {name:'z', data: 0}
      ],
      unityMessage: '',     //来自unity
       
    }
  },
  watch: {
    is_keyboard: function () {
      //alert('键盘' + this.is_keyboard);
      var that = this;
      that.$refs.unityModel.changeUse('key', that.is_keyboard.toString());
    },
    is_mouse: function(){
      //alert('鼠标' + this.is_mouse);
      var that = this;
      that.$refs.unityModel.changeUse('mouse', that.is_mouse.toString());
    },
    selectedOption: function () {
      var that = this;
      that.$refs.unityModel.changeMode(that.selectedOption);
    },
  },
  methods:{
    handleClick_setting(){            //设置按钮
      this.setting_is_open = !this.setting_is_open;
    },
    handleClick_type(tab, event) {    //设置类型--相机/对比
      console.log(tab, event);
    },
    handleClick_compare(){            //对比--开启对比按钮
      var that = this;
      if(!that.setting_compare.is_open)
        that.setting_compare.max_num = 1;
    },
    handleClick_reset(){              //相机--重置按钮
      var that = this;
      that.setting_camera.is_info = false;
      //that.setting_camera.is_keyboard = false;
      //that.setting_camera.is_mouse = false;
      //that.setting_camera.rotating = 0;
      that.$refs.unityModel.reset();
    },
    handleClick_clear(){              //对比--清空按钮
      var that = this;
      var des = that.setting_compare.points;
      for(var i = 0; i < des.length; i++){
        that.$refs.unityModel.hide_des(des[i].info[0].data + "," + des[i].info[1].data + "," + des[i].info[2].data);
      }
      that.setting_compare.points = [];
    },
    handleClick_search(index){        //对比--显示特定位点
      var that = this;
      var des = this.setting_compare.points[index];
      that.$refs.unityModel.specialize_des(des.info[0].data + "," + des.info[1].data + "," + des.info[2].data);
      //alert("specialize_des: " + des.info[0].data + "," + des.info[1].data + "," + des.info[2].data);
    },
    handleClick_delete(index){        //对比--删除特定位点
      var that = this;
      var des = this.setting_compare.points[index];
      that.$refs.unityModel.hide_des(des.info[0].data + "," + des.info[1].data + "," + des.info[2].data);
      //alert("hide_des: " + des.info[0].data + "," + des.info[1].data + "," + des.info[2].data);
      that.setting_compare.points.splice(index, 1);  
    },
    handleClick_info(){               //相机--是否显示使用说明
      var that = this;
      that.setting_camera.is_info = !that.setting_camera.is_info;
    },
    format_rotating(value){         //格式化角度显示
      return `${value}°`;
    },
    add_points(image_url, x, y, z){       //对比的信息列表    添加新元素+显示在模型上
      var that = this;
      while(that.setting_compare.points.length >= that.setting_compare.max_num){     //已满，删去第一个         //在模型上隐藏位点
        var points = that.setting_compare.points; 
        that.$refs.unityModel.hide_des(points[0].info[0].data + "," + points[0].info[1].data + "," + points[0].info[2].data);      
        //alert("hide_des: " + points[0].info[0].data + "," + points[0].info[1].data + "," + points[0].info[2].data);
        that.setting_compare.points.splice(0, 1);                       //列表中删去
      }
      that.setting_compare.points.push({            //添加新元素
          url:image_url,
          srcList:[ image_url ],
          info:[        
            {name:'x', data: x},
            {name:'y', data: y},
            {name:'z', data: z}  ]
      });
      that.$refs.unityModel.draw_des(x + "," + y + "," + z);    //在模型上显示
      //alert("draw_des" + x + "," + y + "," + z);
    },

    addSelections(index, datalist){     //更新选项
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
    updateSelections(index){            //更新选项
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
      //this.$refs.unityModel.sendOrders(mess.x + "," + mess.y + "," + mess.z);

      var imageURL = "/DZGCG/Pictures/" + that.select_1 +"/" + that.select_3.split(".")[1] + ".JPG";   
      //alert(imageURL);
      that.url = imageURL;
      that.srcList = [imageURL];
      that.info[0].data = mess.x;
      that.info[1].data = mess.y;
      that.info[2].data = mess.z;

      that.add_points(imageURL, mess.x, mess.y, mess.z);        ////加入对比列表并在模型上显示
    },

    updatePicture(){            //接收unity信息后更新显示          
      var that = this;                              //"52.12,13.28,85.74,/DZGCG/Pictures/A/a_004.JPG\r"
      var des_url = that.unityMessage.split(',');   //["52.12","13.28","85.74","/DZGCG/Pictures/A/a_004.JPG\r"]
      that.info[0].data = des_url[0] - 0;
      that.info[1].data = des_url[1] - 0;
      that.info[2].data = des_url[2] - 0;
      var imageURL = des_url[3].split('\r')[0];
      that.url = imageURL;
      that.srcList = [imageURL];
      that.add_points(imageURL, des_url[0] - 0, des_url[1] - 0, des_url[2] - 0);      //加入对比列表并在模型上显示
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
      <el-icon><Location /></el-icon>
      同济大学地震工程馆
    </div>

    <div class="select-wrapper">
      <el-button color="#626aef"  @click="handleClick_setting" round>
        <el-icon><Setting/></el-icon>
      </el-button>
      &emsp;
      <el-select-v2
        v-model="select_1"
        :options="selections[0]"
        placeholder="Please select"
        @change="updateSelections(0)"
        size="large"
      />
      &ensp;
      <el-select-v2
        v-model="select_2"
        :options="selections[1]"
        placeholder="Please select"
        @change="updateSelections(1)"
        size="large"
        :disabled="!select_1"
      />
      &ensp;
      <el-select-v2
        v-model="select_3"
        :options="selections[2]"
        placeholder="Please select"
        @change="updateSelections(2)"
        size="large"
        :disabled="!select_2"
      />
      &ensp;
      <el-button
      @click="sendSelections"
      color="#626aef"
      :disabled="!select_3"
      > 
      确定
      </el-button>
    </div>

    <div class="setting_and_model">
      <el-card v-if="setting_is_open" class="setting_wrapper">
        <el-tabs v-model="setting_type" @tab-click="handleClick_type">
          <el-tab-pane label="相机" name="camera">
            
            <a>
              <el-checkbox 
                v-model="is_keyboard" 
                label="启用键盘控制" 
                size="large"
              />
              <br>
              <el-checkbox 
                v-model="is_mouse" 
                label="启用鼠标控制" 
                size="large" 
              /> 
              <br>
              <el-select v-model="selectedOption" placeholder="请选择">
                <el-option v-for="option in modeSelections" :key="option.value" :value="option.value"
                  :label="option.label">
                </el-option>
              </el-select> 
            </a>
            <!--
            <span>旋转角度：  {{ setting_camera.rotating }}°</span>
            <a class="rotating_slider">
              &emsp;
              <el-slider 
              v-model="setting_camera.rotating"
              @change="handleClick_compare"
              :min="0"
              :max="360"
              :format-tooltip="format_rotating($event)"
              :disabled="setting_camera.is_keyboard || setting_camera.is_mouse"/>
            </a>
            -->
            <el-button color="#626aef" @click="handleClick_reset" :dark="isDark">重置</el-button>
            <el-button @click="handleClick_info" size="small" round>
                  <el-icon><InfoFilled /></el-icon>
            </el-button>
            <p v-if="setting_camera.is_info">这里是使用说明</p>

          </el-tab-pane>
          <el-tab-pane label="对比" name="compare">

            <a> 
              开启对比： 
              <el-switch 
              v-model="setting_compare.is_open" 
              @click="handleClick_compare" />
            </a>
            <br>
            <a>
              对比数：&emsp;
              <el-input-number 
              v-model="setting_compare.max_num" 
              :min="1" 
              :max="10"
              :step="1"
              :disabled="!setting_compare.is_open" />
            </a>
            <br>
            <a>
              显示坐标：
              <el-switch 
              v-model="setting_compare.is_show" 
              :disabled="!setting_compare.is_open" />
            </a>
            <br>
            <el-button 
              color="#626aef" 
              @click="handleClick_clear" 
              :dark="isDark" 
              :disabled="!setting_compare.is_open">
              清空
            </el-button>
            
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <div class="model-from-unity">
        <Model ref="unityModel"/>
      </div>
    </div>

    <div class="details_and_compare">
      <p v-if="url" class="text_1">当前查看：</p>
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
      <div v-if="setting_compare.is_open" class="compare">
        <el-divider />
        <p class="text_1">最近查看：</p>
        <el-scrollbar>
          <div style="display: flex;">
            <el-card 
              v-for="(point, index) in setting_compare.points" 
              :key="index" 
              :body-style="{ padding: '0px' }"
              class="compare_card">
              <a>NO. {{ index + 1 }}</a>
              <div class="compare_image">
                <el-image
                  style="width: 200px; height: 200px"
                  :src="point.url"
                  :zoom-rate="1.2"
                  :preview-src-list="point.srcList"
                  :initial-index="4"
                  fit="cover"
                />
              </div>
              <div v-if="setting_compare.is_show" class="compare_info">
                <p v-for="data in point.info" :key="data">
                <a>{{ data.name }}:</a>
                <a>&emsp;{{ data.data }}</a>
                </p>
              </div>
              <div class="compare_operation">
                <el-button @click="handleClick_search(index)">
                  <el-icon><Search/></el-icon>
                </el-button>
                <el-button @click="handleClick_delete(index)">
                  <el-icon><Delete/></el-icon>
                </el-button>

              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </div>
    </div>


  <br><br><br>
  </div>
</template>

<style>
.some-text{
  height: 80px;
  font-size: 40px;
  font-weight: bold;
  line-height: 80px;
  margin-left: 30px;
  width: 100%;
}
.select-wrapper{
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
}

.setting_and_model{
  display: flex;
  justify-content: center;
  align-items: center;
}
.setting_wrapper{
  width:300px;
  margin-top: -35px;
  height: 660px;
  line-height: 50px;
}
.el-checkbox__label {
  font-size: 16px !important; /* 使用 !important 来提高优先级 */
}

.rotating_slider{
  display: flex;
  align-items: center;
  width: 90%;
}

.model-from-unity{
  margin-left: 10px;
}

.details_and_compare{
  margin-left:15%;
  width: 70%;
}
.text_1{
  font-size: 20px;
  font-weight: bold;
}
.details{
  display: flex;
  align-items: flex-start;
}
.image{
  margin-left: 0px;
}
.info{
  margin-left: 20px;
}
.compare{
  line-height: 25px;
}
.compare_card{
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 210px;
  margin: 10px;
}
.compare_image{

}
.compare_info{
  line-height: 18px;
}
.compare_operation{
  display: flex;
  justify-content: center;
  height: 40px;
}
</style>
