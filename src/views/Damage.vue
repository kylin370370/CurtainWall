<script setup>
import { ref } from 'vue';
import{ Document } from '@element-plus/icons-vue';

const tabs = ref([
  { 
    label: '玻璃幕墙',
    disabled: false,
    damageTypes: [
      {
        type: '自爆',
        imageUrls: [
          '/damage/glass/self1.jpg',
          '/damage/glass/self2.png',
          '/damage/glass/self3.jpg',
          '/damage/glass/self4.jpg'
        ],
        desc: '玻璃自爆是指在没有外力作用下，突然出现玻璃破裂和碎裂的现象。\
               自爆的成因通常与玻璃制造过程中的隐患有关，如玻璃表面的微小缺陷、内部应力不均匀、玻璃厚度不一致等。\
               这些隐患可能导致玻璃在使用过程中受到温度变化、风压或负载等因素的影响而破裂。\
               自爆会导致玻璃片完全破碎，可能引发安全隐患，需要及时修复或更换受损的玻璃。'
      },
      {
        type: '外力冲击',
        imageUrls: [
          '/damage/glass/force1.png',
          '/damage/glass/force2.jpg',
          '/damage/glass/force3.jpg',
          '/damage/glass/force4.png'
        ],
        desc: '外力冲击是指玻璃幕墙受到物体撞击、风压或震动等外部力量的作用而受损。\
               这种损伤可能是因为建筑周围的环境有风暴、地震或其他自然灾害，或者是由于建筑物附近发生意外事件，例如物体坠落等。\
               外力冲击可能导致玻璃破裂、碎裂或变形，进而影响幕墙的完整性和功能。严重的外力冲击可能会对建筑物内部和周围的人员安全造成威胁。'
      },
      {
        type: '热炸裂',
        imageUrls: [
          '/damage/glass/hot1.png'
        ],
        desc: '热炸裂是指在温度变化较大的情况下，玻璃突然破裂和碎裂的现象。\
               这种现象主要由于玻璃的热膨胀系数较大，当玻璃表面和内部受到不均匀的热量作用时，会导致玻璃产生应力集中，最终导致破裂。\
               热炸裂可能发生在极端温度变化的环境下，例如突然受到冷空气的冲击或高温阳光直射等情况。\
               这种损伤可能引起玻璃片的局部或完全破碎，影响建筑的外观和安全性。'
      }
    ]
  },
  { 
    label: '金属框架',
    disabled: false,
    damageTypes: [
      {
        type: '碰凹',
        imageUrls: [
          '/damage/metal/pengao1.jpg',
          '/damage/metal/pengao2.jpg',
          '/damage/metal/pengao3.jpg',
          '/damage/metal/pengao4.jpg'
        ],
        desc: '碰凹是指金属框架表面受到撞击或碰撞而产生凹陷的现象。\
               这种损伤通常是由于外部力量的作用，例如物体撞击、人员操作不慎等。\
               碰凹可能导致金属框架的形状变形，影响其外观和结构完整性。\
               严重的碰凹可能会降低金属框架的承载能力和稳定性，需要及时修复以确保建筑的安全性。'
      },
      {
        type: '凸粉',
        imageUrls: [
          '/damage/metal/tufen1.jpg',
          '/damage/metal/tufen2.jpg',
          '/damage/metal/tufen3.jpg',
          '/damage/metal/tufen4.jpg'
        ],
        desc: '凸粉是指金属框架表面出现凸起的颗粒状物质，通常是由于未清理干净的焊渣、粉尘或涂层材料等导致的。\
               凸粉可能影响金属框架的外观质量，使其显得不平整或粗糙。\
               此外，凸粉可能对后续涂层或表面处理的附着性产生负面影响，需要进行清理和修复。'
      },
      {
        type: '划伤',
        imageUrls: [
          '/damage/metal/huashang1.jpg',
          '/damage/metal/huashang2.jpg',
          '/damage/metal/huashang3.jpg',
          '/damage/metal/huashang4.jpg'
        ],
        desc: '划伤是指金属框架表面出现线性或刻痕状的损伤。\
               划伤可能是由于锐利物体的刮擦、人员操作不慎或使用不当的工具等原因引起的。\
               划伤不仅影响金属框架的外观，还可能破坏其表面保护层，导致金属暴露在环境中，增加了腐蚀和氧化的风险。\
               因此，划伤的修复和保护措施是必要的。'
      },
      {
        type: '脏点',
        imageUrls: [
          '/damage/metal/zangdian1.jpg',
          '/damage/metal/zangdian2.jpg',
          '/damage/metal/zangdian3.jpg'
        ],
        desc: '脏点是指金属框架表面出现难以清除的污渍或污点。\
               脏点可能是由于施工过程中的污染物、粉尘、油脂等引起的，也可能是由于建筑周围环境的污染导致的。\
               脏点影响金属框架的外观质量，使其显得不洁净或陈旧。\
               及时清洗和维护金属框架可以减少脏点的影响，并保持其外观的美观性。'
      },
      {
        type: '橘皮',
        imageUrls: [
          '/damage/metal/jupi1.jpg',
          '/damage/metal/jupi2.jpg',
          '/damage/metal/jupi3.jpg',
          '/damage/metal/jupi4.jpg'
        ],
        desc: '橘皮是指金属框架表面出现类似橘子皮纹理的凹凸不平现象。\
               这种损伤通常是由于涂层施工过程中的不均匀或不适当导致的。\
               橘皮影响金属框架的外观质量，使其表面看起来不光滑或不均匀。\
               橘皮可以通过适当的涂层施工技术和修复方法来修复和改善。'
      }
    ]
  },
  { 
    label: '石材幕墙',
    disabled: true,
    damageTypes: [
      {
        type: '结构损伤',
        imageUrls: [
        ]
      }
    ]
  }
]);
const damageTypeId = ref("")
</script>

<template>
    <div class="damage">
        <!-- select building -->
        <el-tabs tab-position="top" class="building-tabs">
            <el-tab-pane v-for="tab in tabs" :key="tab.label" :label="tab.label" :disabled="tab.disabled">
                <!-- select damage -->
                <el-tabs type="border-card" tab-position="top" class="damage-tabs">
                    <el-tab-pane v-for="damageType in tab.damageTypes" :key="damageType.type" :label="damageType.type">
                        <el-row>
                          <!-- display description -->
                          <el-col :span="6" class="col-container">
                            <div class="card-container">
                              <el-card shadow="always" class="desc-card">
                                <el-icon><Document /></el-icon>
                                {{ damageType.desc }}
                              </el-card>
                            </div>
                          </el-col>
                          <!-- display images -->
                          <el-col :span="18">
                            <el-carousel interval="5000" type="card" height="70vh" trigger="click" class="image-carousel">
                              <el-carousel-item v-for="imageUrl in damageType.imageUrls" :key="imageUrl">
                                  <div class="image-container">
                                      <img class="full-image" :src="imageUrl" alt="Damage Image">
                                  </div>
                              </el-carousel-item>
                            </el-carousel>
                          </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style scoped>
.building-tabs {
    margin: 1vh 4vw;
}

.damage-tabs {
    margin: 1vh 4vw;
}

.col-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.desc-card {
  margin-right: 2vw;
  padding: 1vh;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.full-image {
  max-width: 100%;
  max-height: 100%;
}
</style>