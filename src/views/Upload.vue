<template>

  <el-upload
      ref="uploadRef"
      :auto-upload="false"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :file-list="fileList"
  >
    <el-button slot="trigger" type="primary">选择文件</el-button>
    <el-button
        type="success"
        @click="submitUpload"
        :disabled="fileList.length === 0"
    >
      上传文件
    </el-button>
  </el-upload>
  <div v-if="isShow">
    <el-progress :text-inside="true" :stroke-width="24" :percentage="val"
                 style="margin-top: 10px;" :format="format">
    </el-progress>
  </div>

  <div style="margin: 20px;">
    <el-alert
        title="成功检测模型和矩阵拍摄文件，请选择建模参数"
        type="info"
        :closable="false"
        show-icon>
    </el-alert>
    <el-form label-position="top" @submit.prevent="submitForm">
      <el-form-item label="功能选择">
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
        <el-button type="primary" native-type="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { ref, watch, onMounted } from 'vue';
import { ElForm, ElFormItem, ElCheckbox, ElCheckboxGroup, ElRadioGroup, ElRadio, ElButton, ElProgress, ElUpload, ElAlert } from 'element-plus';
import imageSrc1 from '@/assets/light/1.png';
import imageSrc2 from '@/assets/light/2.png';
import imageSrc3 from '@/assets/light/3.png';
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
    const uploadRef = ref(null);
    const uploading = ref(false);
    const progress = ref(0);
    const fileList = ref([]);
    const beforeUpload = (file) => {
      fileList.value = [file]; // 保持只有一个文件在队列中
      return false; // 阻止自动上传
    };

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
    const initVal = ref(1); // 初始值
    const stopVal = ref(99); // 到一定进度停止
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
      // 提交数据的逻辑
    };

    // return { val, isShow, selectedFeatures, selectedResolution, selectedLightModel, isRigid, submitForm };
    // return { uploadRef, uploading, progress, fileList, submitUpload, submitForm, beforeUpload, handleChange, formatProgress };
    return {
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
      submitUpload,
      submitForm,
      beforeUpload,
      handleChange,
      formatProgress
    };

  }
}
</script>

<style scoped>
.image-size {
  width: 100px;
  height: auto;
}
.box-card {
  margin-bottom: 20px;
  text-align: center;
  cursor: pointer; /* Optional: changes the cursor to indicate it's clickable */
}

/* 覆盖单选按钮选中时的颜色 */
.el-radio__input.is-checked .el-radio__inner,
.el-radio__input.is-checked + .el-radio__label {
  color: #a6733a; /* 文本颜色 */
}

.el-radio__input.is-checked .el-radio__inner::after {
  background-color: #a6733a;
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

.image-size {
  width: 100px;
  height: auto;
}

.box-card {
  margin-bottom: 20px;
  text-align: center;
  cursor: pointer; /* 可选: 改变光标以指示它是可点击的 */
}
</style>
