<script>
import{ Location,Setting,Search,Delete,QuestionFilled,InfoFilled,VideoCamera,Histogram,
  RefreshLeft,RefreshRight,ZoomIn,ZoomOut,Place,Scissor,Hide,More } from '@element-plus/icons-vue';
import axios  from "axios";
//import Model from '@/components/model_1.vue';
import Model from '@/components/model.vue';
import data_A from '@/assets/imageCSV_1/new_A.csv';
import data_B from '@/assets/imageCSV_1/new_B.csv';
import data_C from '@/assets/imageCSV_1/new_C.csv';

/* 处理数据，获得选项2 */
var uniqueSet = new Set();    // 创建一个空Set对象
for (let i = 0; i < data_A.length; i++){
  if(data_A[i].state === '1')
    uniqueSet.add(data_A[i].name[0]);   // 将字母添加到Set对象中，重复的字母不会被重复添加
}
var sel_2_A = Array.from(uniqueSet);

var uniqueSet = new Set();
for (let i = 0; i < data_B.length; i++){
  if(data_B[i].state === '1')
    uniqueSet.add(data_B[i].name[0]);
}
var sel_2_B = Array.from(uniqueSet);

var uniqueSet = new Set();
for (let i = 0; i < data_C.length; i++){
  if(data_C[i].state === '1')
    uniqueSet.add(data_C[i].name[0]);
}
var sel_2_C = Array.from(uniqueSet);
//console.log(sel_2_C);

export default {
  name: 'quake',
  components: {
    Model,
    Location,
    Setting,
    Search,
    Delete,
    QuestionFilled,
    InfoFilled,
    VideoCamera,
    Histogram,
    RefreshLeft,
    RefreshRight,
    ZoomIn,
    ZoomOut,
    Place,
    Scissor,
    Hide,
    More,
  },
  data() {
    return {

      setting_is_open: true,     //是否打开设置边栏
      setting_type: 'compare',     //设置--相机/对比/测距
      setting_camera:{
        is_info: false,           //是否显示使用说明
        //is_keyboard: false,     //放此处watch不到所以挪出
        //is_mouse: false,
        modeSelection: '0',       //  靠近/降落
      },//其他按钮： 重置
      is_keyboard: true,         //是否允许使用键盘
      is_mouse: true,            //是否允许使用鼠标
      skyType: true ,         //false白天，true为晚间

      setting_compare:{
        is_open: false,         //是否开启对比
        is_show: true,          //是否显示坐标等信息
        max_num: 1,             //对比数量      1-10
        points:[],              //url,info,colorinfo, state  state各点位card显示状态['1'显示, '0'不显示, '2'中间态(显示卡片不显示详细内容)]
        type: false,
      },//其他按钮： 清空
      type_compare: false,      //对比显示形式  false逐个/true全部

      setting_measure:{
        is_open: false,
        step:'0',             //当前完成步数  '0' '1' '2'
        distance:['0.0','0.0','0.0'],  //水平/垂直/直线距离
        has_data: false,      //是否接收到距离数据
      },

      select_1: null,
      select_2: null,
      select_3: null,
      selections:[
        [
          {value: 'A',label: 'A (NE-1.5°)'},
          {value: 'B',label: 'B (SW-1.5°)'},
          {value: 'C', label: 'C (SE-1.5°)'}
        ],
        [],
        []
      ],
      urlList:[],
      url: '',        //图片url
      //srcList: [],    //打开图片预览，可以放入多张图片
      info: [
        {name:'x', data: 0},
        {name:'y', data: 0},
        {name:'z', data: 0},
        {name:'path', data:''},
      ],
      //当前查看位置图片的颜色信息
      infocolor: {
        color: 0,
        reason: ''  
      },
      unityMessage: '',     //来自unity

      StoneCrackDetect:{
        is_show: false,      //是否开启图像分割栏
        raw_path: '',       //原图路径
        path: '',           //原图路径(请求接口时使用)
        des:{               //原图坐标
          x:0,
          y:0,
          z:0
        },
        has_crack: false,   //有无裂痕
        crack_data: {},     //裂痕数据
        seg_path: '',       //图像分割中间结果图片
        detect_path:'',
        seg_count: 0,       //分割块数
        block_data: [{}],   //每块数据
        onshow:{
          no:[],        //要显示的块block_data中位置
          options:[],   //选项
        },
        success:false,  //请求接口是否成功
      },

      //一个字典用于存放所有位点的颜色信息，前面是id后面是颜色
      pointColor: {},
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
    setting_type: function(){
      var that  = this;
      if(that.setting_type === 'measure'){
        that.setting_measure.step = '0';
        that.setting_measure.is_open = false;
        that.$refs.unityModel.isMeasuring(that.setting_measure.is_open.toString());
      }
      else{
        that.setting_measure.is_open = false;  //切换至切换即关闭测距
        that.setting_measure.step = '0';
        that.setting_measure.has_data = false;
        that.$refs.unityModel.isMeasuring(that.setting_measure.is_open.toString());
      }
    },
    type_compare: function(){
      var that = this;
      var points = that.setting_compare.points;
      if(that.type_compare){      //全部--全为1
        for (let i = 0; i < points.length; i++){
          points[i].state = '1';
        }
      }
      else{                       //逐个--  0,0,0,2,1
        for (let i = 0; i < points.length; i++){
          points[i].state = '0';
        }
        points[points.length - 2].state = '2';
        points[points.length - 1].state = '1';
      }
    },
  },
  methods:{
    handleClick_setting(){            //设置按钮
      this.setting_is_open = !this.setting_is_open;
    },
    handleClick_type(tab, event){    //设置类型--相机/对比/测距
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
    handleClick_search(index){        //对比--显示特定位点    index>=0对比处search按钮  index=-1图像分割处search按钮
      var that = this;
      if(index >= 0){   //对比处search按钮
      var des = this.setting_compare.points[index];
      that.$refs.unityModel.specialize_des(des.info[0].data + "," + des.info[1].data + "," + des.info[2].data);
      //alert("specialize_des: " + des.info[0].data + "," + des.info[1].data + "," + des.info[2].data);
      }
      else{       //图像分割处search按钮
        var SCD = that.StoneCrackDetect;
        that.$refs.unityModel.specialize_des(SCD.des.x + "," + SCD.des.y + "," + SCD.des.z);
      }
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
    handleClick_mode(){               //相机-模式选择 靠近/降落
      //alert(this.setting_camera.modeSelection);
      var that = this;
      that.$refs.unityModel.changeMode(that.setting_camera.modeSelection);
    },
    handleClick_rotating(type){       //相机--旋转    0顺时针 / 1逆时针
      var that = this;
      that.$refs.unityModel.setRotating(type.toString());
    },
    handleClick_size(type){           //相机--调整    1放大 / 0缩小
      var that = this;
      that.$refs.unityModel.setSize(type.toString());
    },
    handleClick_quick(type){          //相机--快捷选择    'A' 'B' 'C'
      var that = this;
      that.$refs.unityModel.setQuick(type.toString());
    },
    handleClick_divide(path,info){         //进行图像分割        path路径 info坐标
      var that = this;
      var SCD = that.StoneCrackDetect;
      SCD.is_show = true;           //显示分隔栏
      SCD.des.x = info[0].data;     //保存坐标
      SCD.des.y = info[1].data;
      SCD.des.z = info[2].data;
      SCD.onshow.no = [];
      SCD.onshow.options = [];
      SCD.success = false;
      if(path){         // /DZGCG/Pictures/A/a_004.JPG
        SCD.path = path.split("/DZGCG/source_image/")[1];
 // console.log( SCD.path)
        SCD.raw_path = "https://stone-wall.obs.cn-east-3.myhuaweicloud.com/DZGCG/source_image/"+SCD.path;

        SCD.seg_path =  SCD.raw_path.replace('.JPG',"/segment_whole.png");
        SCD.seg_path =  SCD.seg_path.replace('source_image',"segment_image");
        SCD.detect_path="https://stone-wall.obs.cn-east-3.myhuaweicloud.com/DZGCG/detect_image/"+SCD.path;
        SCD.detect_path=SCD.detect_path.replace('JPG','png');
        SCD.path= SCD.path.replace('/','_')
        SCD.path= SCD.path.replace('.JPG','')
        console.log(SCD.path)
        var  urlList=that. urlList;
        // alert(SCD.path);
        //alert(that.StoneCrackDetect.path);    //  A/a_004.JPG
        //console.log('请求的URL:', `http://localhost:8443/api/image/${SCD.path}`);
          axios
              .get(`http://localhost:8443/api/image/${SCD.path}`)
              // .get(`http://120.46.136.85:8443/api/image/${SCD.path}`)
              .then((response) => {
                SCD.seg_count = response.data.length;
                SCD.block_data = response.data.map((item, index) => {
                  const block = {
                    has_crack: item.hasCrack,
                    block_num:index,
                    block_seg_image_path:item.imagePath,
                    block_detect_image_path: item.binaryImagePath,
                    crack_data: {
                      crackArea: item.crackArea,
                      crackLength: item.crackLength,
                      crackAverageWidth: item.crackAverageWidth,
                      crackMaxWidth: item.crackMaxWidth
                    }
                  };

                  // 打印每个block块
                  console.log('Block 数据:', block);
                  SCD.onshow.options.push({
                    value: index.toString(),
                    label: 'Block ' + index.toString() // 如果有具体的block_num，请使用 item.block_num
                  });
                  return block;

                });
              })
              .catch((error) => {
                console.error('获取URL列表失败：', error);
              });
        SCD.success = true;
        // axios.get('/api/StoneCrackDetect/data?image_name='+ SCD.path).then(res =>{
        //   SCD.has_crack = res.data.has_crack;
        //
        //   //alert(SCD.raw_path);
        //   if(res.data.has_crack)
        //     SCD.crack_data = res.data.crack_data;
        //   SCD.success = true;
        // });
        // axios.get('/api/StoneCrackDetect/block_data?image_name='+ SCD.path).then(res=>{
        //
        //   SCD.seg_count = res.data.seg_count;
        //   SCD.block_data = res.data.block_data;
        //   for(let i=0; i< SCD.seg_count; i++){
        //     SCD.onshow.options.push(
        //       {value: i.toString(), label: SCD.block_data[i].block_num.toString()}
        //     );
        //   }
        // });
      }
    },
    handleClick_hideDivide(){         //隐藏分割栏
      var that = this;
      that.StoneCrackDetect.is_show = false;
      that.StoneCrackDetect.onshow.no = [];
      that.StoneCrackDetect.onshow.options = [];
      that.StoneCrackDetect.success = false;
    },
    handleClick_measure(){            //测距--开启测距
      var that = this;
      that.$refs.unityModel.isMeasuring(that.setting_measure.is_open.toString());
      if(!that.setting_measure.is_open){    //关闭
        that.setting_measure.step = '0';
        that.setting_measure.has_data = false;
      }
    },
    handleClick_more(){               //对比--逐个显示--点击查看更多
      var that = this;
      var points = that.setting_compare.points;
      for (let i = points.length - 1; i >= 0; i--){
        if(points[i].state === '2'){
          points[i].state = '1';
          if(i)
            points[i - 1].state = '2';
          break;
        }
      }
    },
    handleClick_setSky(){             //相机--改变天空背景
      var that = this;
      that.$refs.unityModel.setSky((this.skyType ? 1 : 0 ).toString());//true的话传1，false传0
    },
    add_points(image_url, x, y, z, path){       //对比的信息列表    添加新元素+显示在模型上
      var that = this;
      var points = that.setting_compare.points;
      while(points.length >= that.setting_compare.max_num){     //已满，删去第一个         //在模型上隐藏位点
        that.$refs.unityModel.hide_des(points[0].info[0].data + "," + points[0].info[1].data + "," + points[0].info[2].data);
        //alert("hide_des: " + points[0].info[0].data + "," + points[0].info[1].data + "," + points[0].info[2].data);
        that.setting_compare.points.splice(0, 1);                       //列表中删去
      }

      var len = points.length;
      if(!that.type_compare && len){          //逐个显示时,最后一个点位state为'1',倒数第二个为'2',其余均为'0'
        for (let i = 0; i < len; i++){
          points[i].state = '0';
        }
        points[len - 1].state = '2';
      }
      //alert(image_url);
      points.push({            //添加新元素
          url:image_url,
          //srcList:[ image_url ],
          info:[
            {name:'x', data: x},
            {name:'y', data: y},
            {name:'z', data: z},
            {name:'path', data: path} ],
          state: '1',
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
          if(datalist[i].name.startsWith(that.select_2) && datalist[i].state === '1'){     //a_004.JPG =>  0.a_004  (index.name)
            sel_3.push(i + "." +datalist[i].name.split(".")[0]);
          }
        }
        that.addSelections(2, sel_3);
      }
      else{     //index === 2   //A-a-a_004
      }
    },
    searchColorData(infoid) {
      console.log('请求颜色信息：', `http://localhost:8443/api/color/${infoid}`);
      axios.get(`http://localhost:8443/api/color/${infoid}`)
        .then(response => {
          this.infocolor.color = response.data.color;
          this.infocolor.reason = response.data.reason;
          console.log('颜色信息：', response.data);
        })
        .catch(error => {
          console.error(error);
          console.log('颜色信息：', '请求失败');
        });
    },
    sendSelections(){       //  按钮“确定”    1.向unity发坐标   2. 更新图片
      var that = this;
      //alert(that.select_1+" "+that.select_2+" "+that.select_3);
      //console.log(that.select_3); =>1.a_005
      //console.log(that.select_3.split(".")[0] - 0); =>2 即第三栏第二张
      //console.log(that.select_3[1].split(".")[0] - 0); =>0
      var index = that.select_3.split(".")[0] - 0;
      var mess = data_A[index];
      if(that.select_1 === 'B')
        mess = data_B[index];
      else if(that.select_1 === 'C')
        mess = data_C[index];
      //alert(mess.x + "," + mess.y + "," + mess.z);
      //this.$refs.unityModel.sendOrders(mess.x + "," + mess.y + "," + mess.z);

      var imageURL = "Pictures/DZGCG/source_image/" + that.select_1 +"/" + that.select_3.split(".")[1] + ".JPG";

      //修改为OBS读取
      var baseURL = "https://stone-wall.obs.cn-east-3.myhuaweicloud.com";
      imageURL = imageURL.replace('Pictures', baseURL);

      //alert(imageURL);
      that.url = imageURL;
      //that.srcList = [imageURL];
      that.info[0].data = mess.x;
      that.info[1].data = mess.y;
      that.info[2].data = mess.z;
      that.info[3].data = "/" + that.select_1 +"/" + that.select_3.split(".")[1] + ".JPG";
      

      var coloruId = that.select_1 + "_" + that.select_3.split(".")[1].replace('.JPG','').replace('/','_');
      //console.log('请求的URL:', `${coloruId}`);

      that.searchColorData(coloruId);
      that.add_points(imageURL, mess.x, mess.y, mess.z, that.info[3].data);        ////加入对比列表并在模型上显示
    },
    updatePicture(){            //接收unity信息后更新显示
      var that = this;                              //"52.12,13.28,85.74,/DZGCG/Pictures/A/a_004.JPG\r"
      var des_url = that.unityMessage.split(',');   //["52.12","13.28","85.74","/DZGCG/Pictures/A/a_004.JPG\r"]
      that.info[0].data = des_url[0] - 0;
      that.info[1].data = des_url[1] - 0;
      that.info[2].data = des_url[2] - 0;

      var imageURL = des_url[3].split('\r')[0];
      that.info[3].data = imageURL.replace('/DZGCG/Pictures', '');
      //修改为OBS读取
      var baseURL = "https://stone-wall.obs.cn-east-3.myhuaweicloud.com/DZGCG/source_image";
      imageURL = imageURL.replace('/DZGCG/Pictures', baseURL);
      // console.log("打印")
      // console.log(imageURL)
      that.url = imageURL;
      //that.srcList = [imageURL];
      that.add_points(imageURL, des_url[0] - 0, des_url[1] - 0, des_url[2] - 0, that.info[3].data);      //加入对比列表并在模型上显示
    },
    updateDistance(){         //接收unity信息后更新测距步骤条与测距结果
      var that = this;
      if(that.unityMessage[0] === '1'){
        that.setting_measure.step = '1';
        that.setting_measure.has_data = false;
      }
      else if(that.unityMessage[0] === '2'){          //'2,6,8,10/r'
        that.setting_measure.step = '2';
        var dis = that.unityMessage.split(',');       //["2","6","8","10/r"]
        that.setting_measure.distance[0] = dis[1];
        that.setting_measure.distance[1] = dis[2];
        that.setting_measure.distance[2] = dis[3].split('\r')[0];
        that.setting_measure.has_data = true;
      }
    },
    recieve(event){
        var that = this;
        that.unityMessage = event.data.handle;
        //alert(event.data.type);
        if(event.data.type === '0')
          that.updatePicture();
        else if(event.data.type === '1')   //测距相关      '1/r'   '2,6,8,10/r'
          that.updateDistance();
        console.log('(来自vue)' + that.unityMessage);
        //console.log('(来自vue)' + event.data.type);

    },
    DoItYourself() {
      // 获取路由路径
      // const routePath = this.$router.resolve({ name: 'NewPage' }).href;
      // 在新标签页中打开页面
      // window.open(routePath, '_blank');
      window.open('https://www.baidu.com', '_blank');
    },
  },
  mounted(){
    window.addEventListener("message",this.recieve);
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
          <el-tab-pane name="camera">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><VideoCamera /></el-icon>
                <span>相机</span>
              </span>
            </template>
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
              <a class="text_2">
                移动方式：
                <el-row :span="24" style="margin-top: -5%;">
                  <el-radio-group v-model="setting_camera.modeSelection" class="ml-4" @change="handleClick_mode">
                    <el-radio label="0" size="large">靠近</el-radio>
                    <el-radio label="1" size="large">降落</el-radio>
                  </el-radio-group>
                </el-row>
              </a>
              <a class="text_2">
                旋转：
                <el-button @click="handleClick_rotating(0)">
                  <el-icon><RefreshRight /></el-icon>&ensp;90°
                </el-button>
                <el-button @click="handleClick_rotating(1)">
                  <el-icon><RefreshLeft /></el-icon>&ensp;90°
                </el-button>
                <br>
              </a>
              <a class="text_2">
                调整：
                <el-button @click="handleClick_size(1)">
                  <el-icon><ZoomIn /></el-icon>放大
                </el-button>
                <el-button @click="handleClick_size(0)">
                  <el-icon><ZoomOut /></el-icon>缩小
                </el-button>
                <br>
              </a>
              <a class="text_2">
                快捷选择：
                <el-row :span="24" style="margin-top: -2%; margin-bottom: 3%;">
                <el-button  @click="handleClick_quick('A')" >
                  <el-icon><Place /></el-icon>&ensp;A
                </el-button>
                <el-button @click="handleClick_quick('B')" >
                  <el-icon><Place /></el-icon>&ensp;B
                </el-button>
                <el-button @click="handleClick_quick('C')" >
                  <el-icon><Place /></el-icon>&ensp;C
                </el-button>
                </el-row>
              </a>
<!--              <a class="text_2">-->
<!--                <a> 夜景模式：-->
<!--                  <el-switch  v-model="this.skyType"  @click="handleClick_setSky" />-->
<!--                </a>-->
<!--              </a>-->

            </a>
            <el-row style="margin-top: 5%; margin-bottom: 5%">
            <el-button color="#626aef" @click="handleClick_reset" :dark="isDark">重置</el-button>
            <el-button @click="handleClick_info" size="small" round>
                  <el-icon><InfoFilled /></el-icon>
            </el-button>
            </el-row>
            <a v-if="setting_camera.is_info" class="text_info">
              <el-scrollbar height="130px">
                <li>键盘控制：</li>
                <a class="text_3">
                  <el-row>
                    <el-col :span="12">
                      <br>&emsp;启用键盘后，使用
                    </el-col>
                    <el-col :span="8.5">
                      <el-row justify="center">
                        <el-tag>W</el-tag>
                      </el-row>
                      <el-row>
                        <el-tag>A</el-tag><el-tag>S</el-tag><el-tag>D</el-tag>
                      </el-row>
                    </el-col>
                    <br>&ensp;可移
                  </el-row>
                  <el-row>
                    动镜头,使用&ensp;
                    <el-tag>Q</el-tag><el-tag>E</el-tag>
                    &ensp;可水平旋转镜头
                  </el-row>
                </a>
                <li>鼠标控制：</li>
                <a class="text_3">
                  &emsp;启用鼠标后，按住鼠标左键拖动镜头，滚轮调整镜头距离，
                  按住&ensp;<el-tag>Ctrl</el-tag>+鼠标左键可调整镜头视角
                </a>
                <li>快捷选择：</li>
                <a class="text_3">
                  &emsp;快捷切换至所选立面
                </a>
                <li>重置：</li>
                <a class="text_3">
                  &emsp;可使模型位置回归初始状态
                </a>
              </el-scrollbar>
            </a>

          </el-tab-pane>

          <el-tab-pane name="compare">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><Histogram /></el-icon>
                <span>对比</span>
              </span>
            </template>
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
            <a>
              显示形式：
              <el-switch
                v-model="type_compare"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #6A8BFF; --el-switch-off-color: #75D9D3"
                active-text="显示全部"
                inactive-text="逐个显示"
                :disabled="!setting_compare.is_open"
              />
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

          <el-tab-pane name="measure">
            <template #label>
              <span class="custom-tabs-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2929 1.29289C16.6834 0.902369 17.3166 0.902369 17.7071 1.29289L22.7071 6.29289C23.0976 6.68342 23.0976 7.31658 22.7071 7.70711L7.70711 22.7071C7.31658 23.0976 6.68342 23.0976 6.29289 22.7071L1.29289 17.7071C0.902369 17.3166 0.902369 16.6834 1.29289 16.2929L3.79275 13.793L13.7928 3.79303L16.2929 1.29289ZM14.5 5.91421L13.4142 7L15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071C15.3166 11.0976 14.6834 11.0976 14.2929 10.7071L12 8.41421L10.9142 9.5L12.2071 10.7929C12.5976 11.1834 12.5976 11.8166 12.2071 12.2071C11.8166 12.5976 11.1834 12.5976 10.7929 12.2071L9.5 10.9142L8.41421 12L10.7071 14.2929C11.0976 14.6834 11.0976 15.3166 10.7071 15.7071C10.3166 16.0976 9.68342 16.0976 9.29289 15.7071L7 13.4142L5.91421 14.5L7.20711 15.7929C7.59763 16.1834 7.59763 16.8166 7.20711 17.2071C6.81658 17.5976 6.18342 17.5976 5.79289 17.2071L4.5 15.9142L3.41421 17L7 20.5858L20.5858 7L17 3.41421L15.9142 4.5L17.2071 5.79289C17.5976 6.18342 17.5976 6.81658 17.2071 7.20711C16.8166 7.59763 16.1834 7.59763 15.7929 7.20711L14.5 5.91421Z" fill="black" fill-opacity="0.85"/>
                </svg>
                <span>测距</span>
              </span>
            </template>

            <a>
              开启测距：
              <el-switch
              v-model="setting_measure.is_open"
              @click="handleClick_measure" />
            </a>

            <div class="measure_steps">
              <el-steps direction="vertical" :active="Number(setting_measure.step)" finish-status="success">
                <el-step title="选择第一个点位" />
                <el-step title="选择第二个点位" />
              </el-steps>
            </div>
            <a v-if="setting_measure.has_data">
              <a>水平距离：{{ setting_measure.distance[0] }}</a><br>
              <a>垂直距离：{{ setting_measure.distance[1] }}</a><br>
              <a>直线距离：{{ setting_measure.distance[2] }}</a><br>
            </a>
          </el-tab-pane>

        </el-tabs>
      </el-card>
      <div class="model-from-unity">
        <Model ref="unityModel"/>
      </div>
    </div>

    <div class="details_and_compare">
      <p class="text_1">当前查看：</p>
      <div class="details">
        <div class="image">
          <el-image
            style="width: 200px; height: 200px"
            :src="url"
            :zoom-rate="1.2"
            :preview-src-list="[url]"
            :initial-index="4"
            fit="cover"
          >
            <template #error>
              <div class="image-slot">NULL</div>
            </template>
          </el-image>
        </div>
        <div class="info">
          
          <!--红绿灯-->
          <el-tag v-if="infocolor.color === 0" type="success" class="mx-1" effect="plain" round>
            幕墙质量良好
          </el-tag>
          <el-tag v-if="infocolor.color === 1" type="warning" class="mx-1" effect="plain" round>
            {{ infocolor.reason }}
          </el-tag>
          <el-tag v-if="infocolor.color === 2" type="danger" class="mx-1" effect="plain" round>
            {{ infocolor.reason }}
          </el-tag>
          <!---->
          <p v-for="data in info" :key="data">
            
            <a>{{ data.name }}:</a>
            <a>&emsp;{{ data.data }}</a>
          </p>
          <a v-if="url">
            <el-button @click="handleClick_divide(url,info)" round>
              <el-icon><Scissor /></el-icon>进行分割
            </el-button>
            <el-button @click="DoItYourself">Do-It-Yourself!</el-button>
          </a>
        </div>
      </div>


      <div v-if="setting_compare.is_open" class="compare">
        <el-divider />
        <p class="text_1">最近查看：</p>
        <el-scrollbar>
          <div style="display: flex;">
            <a
              v-for="(point, index) in setting_compare.points.slice().reverse()"
              :key="index"
            >
            <el-card
              v-if="point.state === '1'"
              :body-style="{ padding: '0px' }"
              class="compare_card">
              <el-row style="margin-top: 3%; margin-bottom: 3%; position: relative;">
                <a>NO. {{ setting_compare.points.length - index }}</a>
                <a v-if="!index" style="position: absolute; right: 1%;">
                  <el-tag type="danger" class="mx-1" effect="plain" round>
                    new
                  </el-tag>
                </a>
              </el-row>
              <div class="compare_image">
                <el-image
                  style="width: 200px; height: 200px"
                  :src="point.url"
                  :zoom-rate="1.2"
                  :preview-src-list="[point.url]"
                  :initial-index="4"
                  fit="cover"
                >
                  <template #error>
                    <div class="image-slot">NULL</div>
                  </template>
                </el-image>
              </div>
              <div v-if="setting_compare.is_show" class="compare_info">
                <p v-for="data in point.info" :key="data">
                <a>{{ data.name }}:</a>
                <a>&emsp;{{ data.data }}</a>
                </p>
              </div>
              <div class="compare_operation">
                <el-button @click="handleClick_search(setting_compare.points.length - index - 1)">
                  <el-icon><Search/></el-icon>
                </el-button>
                <a v-if="point.url">
                  <el-button @click="handleClick_divide(point.url,point.info)">
                    <el-icon><Scissor /></el-icon>
                  </el-button>
               

                </a>
                <el-button @click="handleClick_delete(setting_compare.points.length - index - 1)">
                  <el-icon><Delete/></el-icon>
                </el-button>
              </div>
            </el-card>
            <el-card
              v-else-if="point.state === '2'"
              :body-style="{ padding: '0px' }"
              class="compare_card">
              <a>
                <el-icon color="#939393" :size="65" @click="handleClick_more">
                  <More />
                </el-icon>
              </a>
            </el-card>
            </a>
          </div>
        </el-scrollbar>
      </div>

      <div v-if="StoneCrackDetect.is_show" class="divide">
        <el-divider />
        <p class="text_1">
          图像分割与裂缝识别
          <el-icon color="#409EFF" @click="handleClick_hideDivide">
            <Hide />
          </el-icon>
        </p>

        <el-card>
          <el-row>
            <el-col :span="8">
              <p class="text_2">
                当前图片&ensp;
                <el-button @click="handleClick_search(-1)" size="small" circle>
                  <el-icon><Search /></el-icon>
                </el-button>
              </p>
              <el-image
                style="width: 200px; height: 200px"
                :src="StoneCrackDetect.raw_path"
                :zoom-rate="1.2"
                :preview-src-list="[StoneCrackDetect.raw_path]"
                :initial-index="4"
                fit="cover"
              >
                <template #error>
                  <div class="image-slot">NULL</div>
                </template>
              </el-image>
              <el-row>
                x: {{ StoneCrackDetect.des.x }}&emsp;
                y: {{ StoneCrackDetect.des.y }}&emsp;
                z: {{ StoneCrackDetect.des.z }}
              </el-row>
            </el-col>
            <el-col :span="8">
              <p class="text_2">检测图片</p>
              <a v-if="StoneCrackDetect.success">
                <el-row>

                  <el-image
                      style="width: 200px; height: 200px"
                      :src="StoneCrackDetect.detect_path"
                      :zoom-rate="1.2"
                      :preview-src-list="[StoneCrackDetect.detect_path]"
                      :initial-index="4"
                      fit="cover"
                  >
                    <template #error>
                      <div class="image-slot">NULL</div>
                    </template>
                  </el-image>
                </el-row>
              </a>
            </el-col>
            <el-col :span="8">
              <p class="text_2">分割情况</p>
              <a v-if="StoneCrackDetect.success">
                <el-image
                  style="width: 200px; height: 200px"
                  :src="StoneCrackDetect.seg_path"
                  :zoom-rate="1.2"
                  :preview-src-list="[StoneCrackDetect.seg_path]"
                  :initial-index="4"
                  fit="cover"
                >
                  <template #error>
                    <div class="image-slot">NULL</div>
                  </template>
                </el-image>
                <el-row>共分割得 &ensp;{{StoneCrackDetect.seg_count}}&ensp; 块</el-row>
              </a>
            </el-col>

          </el-row>
        </el-card>

        <p class="text_2">
          查看分割块：
          <el-select
            v-model="StoneCrackDetect.onshow.no"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            placeholder="Select"
            style="width: 260px"
          >
            <el-option
              v-for="item in StoneCrackDetect.onshow.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </p>
        <div v-if="StoneCrackDetect.onshow.no[0]">
          <el-scrollbar  height="500px">
            <el-card v-for="block in StoneCrackDetect.onshow.no" :key="block">
              <el-row>NO. {{ StoneCrackDetect.block_data[block].block_num }}</el-row>
              <el-row>
                <el-col :span="16">
                  <el-row>
                    <el-image
                      style="height: 100px"
                      :src="StoneCrackDetect.block_data[block].block_seg_image_path"
                      :zoom-rate="1.2"
                      :preview-src-list="[StoneCrackDetect.block_data[block].block_seg_image_path]"
                      :initial-index="4"
                      fit="cover"
                    >
                    <template #error>
                      <div class="image-slot">NULL</div>
                    </template>
                    </el-image>
                  </el-row>
                  <el-row style="margin-top: 1%;">
                    <el-image
                      style="height: 100px"
                      :src="StoneCrackDetect.block_data[block].block_detect_image_path"
                      :zoom-rate="1.2"
                      :preview-src-list="[StoneCrackDetect.block_data[block].block_detect_image_path]"
                      :initial-index="4"
                      fit="cover"
                    >
                      <template #error>
                        <div class="image-slot">NULL</div>
                      </template>
                    </el-image>
                  </el-row>
                </el-col>
                <el-col :span="7" style="margin-left: 1%;">
                  <el-row>
                    存在裂缝：
                    <a v-if="StoneCrackDetect.block_data[block].has_crack">是</a>
                    <a v-else>否</a>
                  </el-row>
                  <a v-if="StoneCrackDetect.block_data[block].has_crack">
                    <el-row>裂痕像素面积：{{ StoneCrackDetect.block_data[block].crack_data.crackArea }}</el-row>
                    <el-row>裂痕像素长度：{{ StoneCrackDetect.block_data[block].crack_data.crackLength}}</el-row>
                    <el-row>裂痕像素平均宽度：{{ StoneCrackDetect.block_data[block].crack_data.crackAverageWidth  }}</el-row>

                    <el-row>裂痕像素最大宽度：{{ StoneCrackDetect.block_data[block].crack_data.crackMaxWidth }}</el-row>

                  </a>
                </el-col>
              </el-row>
            </el-card>
          </el-scrollbar>
        </div>
      </div>


    </div>

  <br><br><br>
  </div>
</template>

<style>
.about{
  background-color: white;
}
.some-text{
  height: 80px;
  font-size: 40px;
  font-weight: bold;
  line-height: 80px;
  margin-left: 30px;
  letter-spacing:1px;
  width: 100%;
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 20px;
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
  line-height: 45px;
}
.setting_wrapper .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.el-checkbox__label {
  font-size: 16px !important; /* 使用 !important 来提高优先级 */
}
.el-radio.el-radio--large .el-radio__label {
  font-size: 15px !important;
}
.text_2{
  font-size: 15px;
  font-weight: bold;
}
.text_info{
  font-size: 14px;
  line-height: 20px;
  font-weight: bold;
}
.text_3{
  font-weight: normal;
  line-height: 26px;
}
.measure_steps{
  margin-top: 10%;
  margin-left: 5%;
  margin-bottom: 5%;
  height: 100px;
}

.el-step.is-vertical .el-step__line {
    width: 2px;
    top: 15px;
    bottom: -15px;
    left: 11px;
}
.el-step__icon.is-text {
    border-radius: 50%;
    border: 2px solid;
    border-color: inherit;
    top:-10%;
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
  height: 430px;
  margin-left: 1%;
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

.divide{
  line-height: 25px;
}
.divide.steps.el-step__line {
      top: 50% !important;
      height: 4px;
    }

</style>
