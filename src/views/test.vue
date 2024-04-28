<div class="setting_and_model">
    <el-card v-if="setting_is_open" class="setting_wrapper">
      <el-row>
        <el-col :span="2">
          <el-button color="#B29F82" @click="handleClick_setting" round>
            <el-icon color="white"><Setting/></el-icon>
          </el-button>
        </el-col>
        <el-col :span="22">
          <el-tabs v-model="setting_type" @tab-click="handleClick_type">
            <el-tab-pane name="camera">
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon color="#463929"><VideoCamera /></el-icon>
                  <span style="color:#463929">便捷控制台</span>
                </span>
              </template>
              <!-- 你的其他代码 -->
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
  </div>