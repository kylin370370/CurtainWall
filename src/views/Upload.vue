<template>
<div style="background-color: #F5F5F5;">

  <el-upload
      ref="uploadRef"
      :auto-upload="false"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :file-list="fileList"
      class="upload-container"
  >
    <el-button slot="trigger" size="large" color="#B29F82" style="color:white ;" >选择文件</el-button>
<!--    <el-button-->
<!--        size="large" color="#B29F82" style="color:white"-->
<!--        @click="submitUpload"-->
<!--        :disabled="fileList.length === 0"-->
<!--    >-->
<!--      上传文件-->
<!--    </el-button>-->


  </el-upload>
  <div v-if="!showAlert" style="display: flex; align-items: center;">
    <img :src="upload.image0" alt="上传示例" style="width: 500px; height: auto; margin-right: 20px;">
    <div>
      <p>仅支持DJ Terra无人机拍摄后一键导出的压缩包（.zip)文件</p>
      <p>请确保您上传的文件包含建模(.osgb)文件与示例的定位信息：</p>

      <ul>
        <li>拍照时刻飞行器机体的Roll欧拉角:FlightRolIDegree</li>
        <li>拍照时刻飞行器机体的Yaw欧拉角: FlightYawDegree</li>
        <li>拍照时刻飞行器机体的Pitch欧拉角: FlightPitchDegree</li>
      </ul>
      <ul>
        <li>定位标准差(经度方向):RtkStdLon</li>
        <li> 定位标准差(纬度方向):RtkStdLat</li>
        <li> 定位标准差（高程方向)：RtkStdHgt</li>
      </ul>
      <ul>
        <li>飞行器拍摄目标距离：LRFTargetDistance</li>
      </ul>
      <ul>
        <li>飞行器拍摄目标经度：LRFTargetLon</li>
        <li>飞行器拍摄目标纬度：LRFTargetLat</li>
        <li>飞行器拍摄目标相对海拔：LRFTargetAlt</li>

        <!-- 更多信息项 -->
      </ul>
    </div>
  </div>
  <div v-if="showAlert">
    <el-progress :text-inside="true" :stroke-width="24" :percentage="val"
                 style="margin-top: 10px; margin-left: 50px; margin-right: 50px;" :format="format">
    </el-progress>
  </div>

  <div style="margin: 30px ; background-color: #DBD4CC; border-radius: 10px; ">
    <el-alert
        v-if="showAlert"
        title="成功检测模型和矩阵拍摄文件，文件正在上传"
        type="info"
        :closable="false"
        show-icon>
    </el-alert>
    <div v-if="!showAlert">
    <h3 class="form-title">请输入建模参数</h3>
    <el-form label-position="top" @submit.prevent="submitForm"  >
      <el-form-item label="请输入模型名称">
        <el-input v-model="modelName" placeholder="模型名称"></el-input>
      </el-form-item>
      <el-form-item label="功能选择" >
        <el-checkbox-group v-model="selectedFeatures">
          <el-checkbox label="相机" value="相机" disabled>相机</el-checkbox>
          <el-checkbox label="多选" value="多选">多选</el-checkbox>
          <el-checkbox label="测距" value="测距">测距</el-checkbox>
          <el-checkbox label="小地图" value="小地图">小地图</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择模型分辨率">
        <el-radio-group v-model="selectedResolution">
          <el-radio label="低分辨率 (640x480)">低分辨率 (640x480)</el-radio>
          <el-radio label="中分辨率 (1280x720)">中分辨率 (1280x720)</el-radio>
          <el-radio label="高分辨率 (1920x1080)">高分辨率 (1920x1080)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择光照模型">
        <el-radio-group v-model="selectedLightModel">
          <el-card class="box-card" shadow="hover" @click.native="selectLightModel('环境光')">
            <el-radio label="环境光" value="环境光">环境光（间接光，均匀照亮）</el-radio>
            <img :src="lightModelImages.image1" alt="环境光示例" class="image-size" />
          </el-card>
          <el-card class="box-card" shadow="hover" @click.native="selectLightModel('漫反射')">
            <el-radio label="漫反射" value="漫反射">漫反射（光线从表面多个方向反射）</el-radio>
            <img :src="lightModelImages.image2" alt="漫反射示例" class="image-size" />
          </el-card>
          <el-card class="box-card" shadow="hover" @click.native="selectLightModel('镜面反射')">
            <el-radio label="镜面反射" value="镜面反射">镜面反射（产生高光效果）</el-radio>
            <img :src="lightModelImages.image3" alt="镜面反射示例" class="image-size" />
          </el-card>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="模型是否为刚体">
        <el-radio-group v-model="isRigid">
          <el-radio label="是" value="是">是</el-radio>
          <el-radio label="否" value="否">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button size="large" color="#B29F82" style="color:white"  native-type="submit">确定</el-button>
      </el-form-item>
    </el-form>
    </div>
    <el-button size="large" @click="goToHome" color="#B29F82" style="color:white ;" >返回主页</el-button>
  </div>
</div>
</template>
<script>
import { useRouter } from 'vue-router';

// 获取router实例

import { ref, watch, onMounted } from 'vue';
import { ElForm, ElFormItem, ElCheckbox, ElCheckboxGroup, ElRadioGroup, ElRadio, ElButton, ElProgress, ElUpload, ElAlert } from 'element-plus';
import imageSrc1 from '@/assets/light/1.png';
import imageSrc2 from '@/assets/light/2.png';
import imageSrc3 from '@/assets/light/3.png';
import imageSrc0 from '@/assets/picture/dj.png';
export default {
  components: {
    ElForm, ElFormItem, ElCheckbox, ElCheckboxGroup, ElRadioGroup, ElRadio, ElButton, ElProgress, ElUpload, ElAlert
  },
  setup() {
    const lightModelImages = {
      image1: imageSrc1,
      image2: imageSrc2,
      image3: imageSrc3
    };
    const upload = {
      image0: imageSrc0,

    };
    const modelName = ref('');
    const showAlert = ref(false);
    const uploadRef = ref(null);
    const uploading = ref(false);
    const progress = ref(0);
    const fileList = ref([]);
    const beforeUpload = (file) => {
      fileList.value = [file]; // 保持只有一个文件在队列中
      return false; // 阻止自动上传
    };
    const router = useRouter();
    const handleChange = (file, newFileList) => {
      fileList.value = [...newFileList];
    };

    const submitUpload = () => {
      if (fileList.value.length === 0) {
        console.warn('请先选择文件');
        return;
      }
      uploading.value = true;
      progress.value = 0; // 初始化进度
      // 模拟上传过程
      let counter = 0;
      const interval = setInterval(() => {
        if (counter < 100) {
          counter += 10;
          progress.value = counter;
        } else {
          clearInterval(interval);
          uploading.value = false;
          console.log('上传完成');
        }
      }, 300);
    };


    const formatProgress = (percentage) => {
      return `${percentage}%`;
    };

    // 进度条相关的变量和逻辑
    const val = ref(0); // 设置初始进度为1%
    const isShow = ref(true); // 是否显示进度条
    const step = ref(1); // 每次自增幅度
    const initVal = ref(0); // 初始值
    const stopVal = ref(100); // 到一定进度停止
    const isOk = ref(false); // 进度条继续到成功

    // onMounted(() => {
    //   val.value = initVal.value;
    //   const timer = setInterval(() => {
    //     if (val.value >= stopVal.value) {
    //       clearInterval(timer);
    //       console.log('Progress stopped at 99%');
    //     } else {
    //       val.value += step.value;
    //     }
    //   }, 500);
    // });
    // watch(fileList, (newFileList) => {
    //   if (newFileList.length > 0) {
    //     console.log('检测到文件，开始进度条');
    //     startProgress(); // 文件列表非空时启动进度条
    //   }
    // });
    watch(showAlert, (newVal) => {
      if (newVal) {
        console.log('显示警告，开始进度条');
        startProgress();
      }
    });
    const startProgress = () => {
      // progress.value = 0; // 初始化进度
      // let counter = 0;
      // const interval = setInterval(() => {
      //   if (counter >= 100) {
      //     clearInterval(interval);
      //     console.log('上传完成');
      //   } else {
      //     counter += 10;
      //     progress.value = counter;
      //   }
      // }, 300); // 每300ms更新进度
      val.value = initVal.value;
      const timer = setInterval(() => {
        if (val.value >= stopVal.value) {
          clearInterval(timer);
          console.log('Progress stopped at 99%');
        } else {
          val.value += step.value;
        }
      }, 50000);
    };


    // 其他现有的数据和方法
    const selectedResolution = ref('低分辨率 (640x480)');
    const selectedFeatures = ref(["相机"]);
    const selectedLightModel = ref('漫反射');
    const isRigid = ref('是');

    const submitForm = async () => {
      const data = {
        features: selectedFeatures.value,
        resolution: selectedResolution.value,
        lightModel: selectedLightModel.value,
        rigid: isRigid.value
      };
      showAlert.value = true;
      // 显示弹窗
      await ElMessageBox.alert(
          '文件已开始上传，请不要关闭本页面！\n查询进度请查看进度条',
          '警告',
          {
            confirmButtonText: '确定',
            type: 'warning'
          }
      );
      // 提交数据的逻辑
    };
    const goToHome = () => {
      window.open('/', '_blank');
      // router.push('/');

    };
    // return { val, isShow, selectedFeatures, selectedResolution, selectedLightModel, isRigid, submitForm };
    // return { uploadRef, uploading, progress, fileList, submitUpload, submitForm, beforeUpload, handleChange, formatProgress };
    return {
      showAlert,//文件上传提示
      upload,
      lightModelImages,
      // 原有数据
      val,
      isShow,
      selectedFeatures,
      selectedResolution,
      selectedLightModel,
      isRigid,
      // 新增上传功能相关的数据
      uploadRef,
      uploading,
      progress,
      fileList,
      modelName,
      submitUpload,
      submitForm,
      beforeUpload,
      handleChange,
      formatProgress,
      goToHome,
      startProgress
    };

  }
}
</script>

<style >
.image-size {
  width: 100px;
  height: auto;
}
.box-card {
  margin-bottom: 20px;
  text-align: center;
  cursor: pointer; /* Optional: changes the cursor to indicate it's clickable */
}

.el-radio__inner, .el-checkbox__inner {
  border-color: #a6733a; /* 设置边框为棕色 */
}
/* 给功能选择的表单项添加棕色分割线 */
/* 给除了第一个之外的所有表单项添加顶部分割线 */
.el-form-item:not(:first-child) {
  border-top: 2px solid #a6733a; /* 设置分割线颜色为棕色和宽度 */
  padding-top: 20px; /* 在分割线上方添加一些内边距 */
  margin-top: 20px; /* 在分割线上方添加一些外边距，确保与上一个表单项有空间 */
}

/* 给第一个表单项添加顶部分割线 */
.el-form-item:first-child {
  border-top: 2px solid #a6733a; /* 设置顶部分割线颜色为棕色和宽度 */
  padding-top: 20px; /* 在顶部分割线上方添加一些内边距 */
  margin-top: 20px; /* 在顶部分割线上方添加一些外边距 */
}

/* 单选和多选按钮选中状态下的颜色调整 */
.el-radio__input.is-checked .el-radio__inner,
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-radio__input.is-checked + .el-radio__label,
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #a6733a; /* 文本颜色改为棕色 */
  background-color: #DBD4CC;
}

.el-radio__input.is-checked .el-radio__inner::after,
.el-checkbox__input.is-checked .el-checkbox__inner::after {
  background-color: #fff; /* 选中时内部小圆点或勾的颜色改为白色 */
}

/* 悬浮状态 */
.el-radio__input:hover .el-radio__inner {
  border-color: #a6733a; /* 悬浮时也使用棕色外圈 */
}

/* 聚焦状态，如果有特殊的聚焦样式 */
.el-radio__input.is-focus .el-radio__inner {
  border-color: #a6733a; /* 聚焦时也使用棕色 */
}
/* 修改卡片阴影颜色 */
.box-card {
  box-shadow: 0 2px 12px 0 rgba(166, 115, 58, 0.3);
}
.el-progress-bar__inner {
  background-image: linear-gradient(to right, #d8a876, #a6733a); /* 从深棕色渐变到浅棕色 */
}
.image-size {
  width: 100px;
  height: auto;
}

.box-card {
  margin-bottom: 20px;
  text-align: center;
  cursor: pointer; /* 可选: 改变光标以指示它是可点击的 */
}
.form-title {
  color: #a6733a; /* 设置字体颜色为棕色 */
  text-align: center; /* 设置文字居中 */
  font-size: 24px; /* 设置大号字体 */
}
</style>
