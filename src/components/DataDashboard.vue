<template>
  <div class="dashboard-container">
    <!-- 顶部区域：图片和控制按钮 -->
    <div class="top-section">
      <!-- 左侧控制区 -->
      <div class="left-controls">
        <!-- 实时日期时间（两行显示） -->
        <div class="datetime-display">
            <div class="date-line">{{ currentDate }}</div>
            <div class="time-line">{{ currentTime }}</div>
        </div>
        <!-- 左侧按钮组 -->
        <div class="left-buttons">
            <button class="dashboard-button primary" @click="handleOptimizationClick">
              <span class="button-icon">⚡</span>
              <span>运行优化</span>
            </button>
            <button class="dashboard-button primary" @click="handleDiagnosisClick">
              <span class="button-icon">🔍</span>
              <span>故障诊断</span>
            </button>
        </div>
      </div>
      
      <!-- 中央图片区域（占3/5） -->
      <div class="central-image-container">
        <div class="equipment-image-wrapper">
          <!-- 底层图片 -->
          <img src="/equipment.png" alt="三联供系统设备示意图" style="width: 100%; height: 100%; object-fit: fill;">
          
          <!-- 顶层数据点层 -->
          <div class="data-points-overlay">
            <!-- 冷却水供水温度 -->
            <div class="data-value-display" style="left: 70.5%; top: 40%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.coolInTemp }}</div>
            </div>

            <!-- 冷却水回水温度 -->
            <div class="data-value-display" style="left: 82%; top: 42%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.coolOutTemp }}</div>
            </div>

            <!-- 冷水供水温度 -->
            <div class="data-value-display" style="left: 64.5%; top: 55%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.coldInTemp }}</div>
            </div>

            <!-- 冷水回水温度 -->
            <div class="data-value-display" style="left: 69.5%; top: 75%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.coldOutTemp }}</div>
            </div>

            <!-- 热水入口温度 -->
            <div class="data-value-display" style="left: 36%; top: 29.5%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.hotInTemp }}</div>
            </div>

            <!-- 热水出口温度 -->
            <div class="data-value-display" style="left: 36%; top: 34%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.hotOutTemp }}</div>
            </div>

            <!-- 发电机参数 -->
            <div class="data-value-display" style="left: 28%; top: 47%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value" style="display: flex; justify-content: space-around; gap: 20px;"> 发电Uab <span style="text-align: right;">{{systemData[currentSystemState].generator.Uab }}</span></div>
              <div class="data-value" style="display: flex; justify-content: space-around; gap: 20px;"> A相电流 <span style="text-align: right;">{{ systemData[currentSystemState].generator.currentA }}</span></div>
              <div class="data-value" style="display: flex; justify-content: space-between; gap: 20px;">总有功功率 <span style="text-align: right;">{{ systemData[currentSystemState].generator.powerTotal }}</span></div>
              <div class="data-value" style="display: flex; justify-content: space-between; gap: 20px;">总无功功率 <span style="text-align: right;">{{ systemData[currentSystemState].generator.reactiveTotal }}</span></div>
            </div>
          </div>
        </div>
        
        <!-- <div class="placeholder-image" v-else>
          <span>系统停机中，启动后显示设备运行画面</span>
        </div> -->
      </div>
      
      <!-- 右侧控制区 -->
      <div class="right-controls">
        <!-- 右侧按钮组 -->
        <div class="right-buttons">
            <button class="dashboard-button secondary" :class="{ active: currentSystemState === 'running' }" @click="setSystemState('running')">
              <span class="button-icon">▶</span>
              <span>系统启动</span>
            </button>
            <button class="dashboard-button secondary" :class="{ active: currentSystemState === 'shutdown' }" @click="setSystemState('shutdown')">
              <span class="button-icon">◼</span>
              <span>系统停机</span>
            </button>
            <button class="dashboard-button secondary" @click="handleFaultReset">
              <span class="button-icon">🔄</span>
              <span>故障复位</span>
            </button>
        </div>
      </div>
    </div>
    
    <!-- 底部区域 -->
    <div class="bottom-section">
      <!-- 左侧数据列表区域（占1/2） -->
      <div class="bottom-left">
        <div class="data-lists-container">
          <!-- 燃气发电机数据（含市电+发电参数） -->
          <div class="data-list">
            <h3 class="list-title">燃气发电机实时数据</h3>
            <!-- 市电电压 -->
            <div class="data-item">
              <span class="data-label">市电Uab</span>
              <span class="data-value">{{ systemData[currentSystemState].powerGrid.Uab }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">市电Ubc</span>
              <span class="data-value">{{ systemData[currentSystemState].powerGrid.Ubc }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">市电Uca</span>
              <span class="data-value">{{ systemData[currentSystemState].powerGrid.Uca }}</span>
            </div>
            <!-- 发电参数 -->
            <div class="data-item">
              <span class="data-label">发电Uab</span>
              <span class="data-value">{{ systemData[currentSystemState].generator.Uab }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">A相电流</span>
              <span class="data-value">{{ systemData[currentSystemState].generator.currentA }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">总有功功率</span>
              <span class="data-value">{{ systemData[currentSystemState].generator.powerTotal }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">总无功功率</span>
              <span class="data-value">{{ systemData[currentSystemState].generator.reactiveTotal }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">发电频率</span>
              <span class="data-value">{{ systemData[currentSystemState].generator.frequency }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">发电机转速</span>
              <span class="data-value">{{ systemData[currentSystemState].generator.speed }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">排气温度</span>
              <span class="data-value">{{ systemData[currentSystemState].generator.exhaustTemp }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">并网开关状态</span>
              <span class="data-value" :class="systemData[currentSystemState].generator.gridSwitch === '合闸' ? 'normal' : 'abnormal'">
                {{ systemData[currentSystemState].generator.gridSwitch }}
              </span>
            </div>
          </div>
          <!-- 溴化锂机组数据 -->
          <div class="data-list">
            <h3 class="list-title">溴化锂机组实时数据</h3>
            <div class="data-item">
              <span class="data-label">冷水供水温度</span>
              <span class="data-value">{{ systemData[currentSystemState].lithium.coldInTemp }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">冷水回水温度</span>
              <span class="data-value">{{ systemData[currentSystemState].lithium.coldOutTemp }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">热水入口温度</span>
              <span class="data-value">{{ systemData[currentSystemState].lithium.hotInTemp }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">热水出口温度</span>
              <span class="data-value">{{ systemData[currentSystemState].lithium.hotOutTemp }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">冷却水供水温度</span>
              <span class="data-value">{{ systemData[currentSystemState].lithium.coolInTemp }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">冷却水回水温度</span>
              <span class="data-value">{{ systemData[currentSystemState].lithium.coolOutTemp }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">蒸发器温度</span>
              <span class="data-value">{{ systemData[currentSystemState].lithium.evaporatorTemp }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">蒸发器压力</span>
              <span class="data-value">{{ systemData[currentSystemState].lithium.evaporatorPress }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">溴化锂启动状态</span>
              <span class="data-value" :class="systemData[currentSystemState].lithium.startState === '启动' ? 'normal' : 'abnormal'">
                {{ systemData[currentSystemState].lithium.startState }}
              </span>
            </div>
            <!-- 累计数据 -->
            <div class="data-item">
              <span class="data-label">累计发电量</span>
              <span class="data-value">{{ systemData[currentSystemState].generator.totalPower }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">累计燃气量</span>
              <span class="data-value">{{ systemData[currentSystemState].generator.totalGas }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧图表区域（占1/2） -->
      <div class="bottom-right">

        <!-- 圆形图表区域（动态绑定启动/停机数据） -->
        <div class="gauge-charts-container">
          <!-- 发电机电压 -->
          <div class="gauge-chart">
            <div class="gauge-title">发电Uab</div>
            <div class="gauge-circle" :style="{'--progress': `calc((${systemData[currentSystemState].generator.UabValue} / 450) * 100%)`}">
              <div class="gauge-progress"></div>
              <div class="gauge-value">{{ systemData[currentSystemState].generator.Uab }}</div>
            </div>
          </div>
          <!-- 发电机电流 -->
          <div class="gauge-chart">
            <div class="gauge-title">A相电流</div>
            <div class="gauge-circle" :style="{'--progress': `calc((${systemData[currentSystemState].generator.currentAValue} / 200) * 100%)`}">
              <div class="gauge-progress"></div>
              <div class="gauge-value">{{ systemData[currentSystemState].generator.currentA }}</div>
            </div>
          </div>
          <!-- 总有功功率 -->
          <div class="gauge-chart">
            <div class="gauge-title">总有功功率</div>
            <div class="gauge-circle" :style="{'--progress': `calc((${systemData[currentSystemState].generator.powerTotalValue} / 150) * 100%)`}">
              <div class="gauge-progress"></div>
              <div class="gauge-value">{{ systemData[currentSystemState].generator.powerTotal }}</div>
            </div>
          </div>
          <!-- 发电频率 -->
          <div class="gauge-chart">
            <div class="gauge-title">发电频率</div>
            <div class="gauge-circle" :style="{'--progress': `calc((${systemData[currentSystemState].generator.frequencyValue} / 52) * 100%)`}">
              <div class="gauge-progress"></div>
              <div class="gauge-value">{{ systemData[currentSystemState].generator.frequency }}</div>
            </div>
          </div>
          <!-- 冷水供水温度 -->
          <div class="gauge-chart">
            <div class="gauge-title">冷水供水温度</div>
            <div class="gauge-circle" :style="{'--progress': `calc((${systemData[currentSystemState].lithium.coldInTempValue} / 30) * 100%)`}">
              <div class="gauge-progress"></div>
              <div class="gauge-value">{{ systemData[currentSystemState].lithium.coldInTemp }}</div>
            </div>
          </div>
          <!-- 热水入口温度 -->
          <div class="gauge-chart">
            <div class="gauge-title">热水入口温度</div>
            <div class="gauge-circle" :style="{'--progress': `calc((${systemData[currentSystemState].lithium.hotInTempValue} / 100) * 100%)`}">
              <div class="gauge-progress"></div>
              <div class="gauge-value">{{ systemData[currentSystemState].lithium.hotInTemp }}</div>
            </div>
          </div>
        </div>
        <!-- 趋势图区域（新增横纵坐标+数据点标识） -->
        <div class="trend-charts-container">
          <div class="trend-chart-row">
            <!-- 1. 发电机电流趋势图（新增坐标+数据点） -->
            <div class="trend-chart">
              <div class="trend-title">发电机电流趋势（A）</div>
              <div class="trend-plot">
                <svg width="100%" height="100%" viewBox="0 0 450 180">
                  <!-- 坐标轴：X轴（时间）、Y轴（电流） -->
                  <g class="axis">
                    <!-- X轴轴线 -->
                    <line x1="40" y1="150" x2="420" y2="150" stroke="#b0c4de" stroke-width="1.5"/>
                    <!-- X轴刻度（时间：0-60分钟，每15分钟1个刻度） -->
                    <template v-for="(x, idx) in [0,15,30,45,60]" :key="idx">
                      <line :x1="40 + idx*95" y1="145" :x2="40 + idx*95" y2="155" stroke="#b0c4de" stroke-width="1.5"/>
                      <text :x="40 + idx*95" y="170" fill="#b0c4de" font-size="11" text-anchor="middle">{{ x }}min</text>
                    </template>
                    <!-- Y轴轴线 -->
                    <line x1="40" y1="30" x2="40" y2="150" stroke="#b0c4de" stroke-width="1.5"/>
                    <!-- Y轴刻度（电流：0-200A，每50A1个刻度） -->
                    <template v-for="(y, idx) in [0,50,100,150,200]" :key="idx">
                      <line x1="35" :y1="150 - idx*30" x2="45" :y2="150 - idx*30" stroke="#b0c4de" stroke-width="1.5"/>
                      <text x="30" :y="153 - idx*30" fill="#b0c4de" font-size="11" text-anchor="end">{{ y }}A</text>
                    </template>
                  </g>

                  <!-- 运行状态曲线+数据点 -->
                  <g v-if="currentSystemState === 'running'">
                    <!-- 趋势曲线 -->
                    <path d="M40,120 Q135,90 230,100 T420,70" fill="none" stroke="#00bfff" stroke-width="2.5"/>
                    <!-- 数据点（5个关键节点） -->
                    <template v-for="(point, idx) in [120,90,100,85,70]" :key="idx">
                      <circle :cx="40 + idx*95" :cy="point" r="4" fill="#00bfff" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" :y="point - 8" fill="#00bfff" font-size="10" text-anchor="middle">{{ 200 - Math.round((point-30)/1.2) }}A</text>
                    </template>
                  </g>

                  <!-- 停机状态曲线+数据点（固定0A） -->
                  <g v-else>
                    <path d="M40,150 Q135,150 230,150 T420,150" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
                    <template v-for="idx in [0,1,2,3,4]" :key="idx">
                      <circle :cx="40 + idx*95" cy="150" r="4" fill="#ff6b6b" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" y="142" fill="#ff6b6b" font-size="10" text-anchor="middle">0A</text>
                    </template>
                  </g>
                </svg>
              </div>
            </div>

            <!-- 2. 总有功功率趋势图（新增坐标+数据点） -->
            <div class="trend-chart">
              <div class="trend-title">总有功功率趋势（kW）</div>
              <div class="trend-plot">
                <svg width="100%" height="100%" viewBox="0 0 450 180">
                  <!-- 坐标轴：X轴（时间）、Y轴（功率） -->
                  <g class="axis">
                    <line x1="40" y1="150" x2="420" y2="150" stroke="#b0c4de" stroke-width="1.5"/>
                    <template v-for="(x, idx) in [0,15,30,45,60]" :key="idx">
                      <line :x1="40 + idx*95" y1="145" :x2="40 + idx*95" y2="155" stroke="#b0c4de" stroke-width="1.5"/>
                      <text :x="40 + idx*95" y="170" fill="#b0c4de" font-size="11" text-anchor="middle">{{ x }}min</text>
                    </template>
                    <line x1="40" y1="30" x2="40" y2="150" stroke="#b0c4de" stroke-width="1.5"/>
                    <template v-for="(y, idx) in [0,37.5,75,112.5,150]" :key="idx">
                      <line x1="35" :y1="150 - idx*30" x2="45" :y2="150 - idx*30" stroke="#b0c4de" stroke-width="1.5"/>
                      <text x="30" :y="153 - idx*30" fill="#b0c4de" font-size="11" text-anchor="end">{{ y }}kW</text>
                    </template>
                  </g>

                  <!-- 运行状态曲线+数据点 -->
                  <g v-if="currentSystemState === 'running'">
                    <path d="M40,90 Q135,60 230,70 T420,40" fill="none" stroke="#32cd32" stroke-width="2.5"/>
                    <template v-for="(point, idx) in [90,60,70,55,40]" :key="idx">
                      <circle :cx="40 + idx*95" :cy="point" r="4" fill="#32cd32" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" :y="point - 8" fill="#32cd32" font-size="10" text-anchor="middle">{{ Math.round((150 - (point-30))/1.2) }}kW</text>
                    </template>
                  </g>

                  <!-- 停机状态曲线+数据点（固定0kW） -->
                  <g v-else>
                    <path d="M40,150 Q135,150 230,150 T420,150" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
                    <template v-for="idx in [0,1,2,3,4]" :key="idx">
                      <circle :cx="40 + idx*95" cy="150" r="4" fill="#ff6b6b" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" y="142" fill="#ff6b6b" font-size="10" text-anchor="middle">0kW</text>
                    </template>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div class="trend-chart-row">
            <!-- 3. 冷水供水温度趋势图（新增坐标+数据点） -->
            <div class="trend-chart">
              <div class="trend-title">冷水供水温度趋势（℃）</div>
              <div class="trend-plot">
                <svg width="100%" height="100%" viewBox="0 0 450 180">
                  <!-- 坐标轴：X轴（时间）、Y轴（温度） -->
                  <g class="axis">
                    <line x1="40" y1="150" x2="420" y2="150" stroke="#b0c4de" stroke-width="1.5"/>
                    <template v-for="(x, idx) in [0,15,30,45,60]" :key="idx">
                      <line :x1="40 + idx*95" y1="145" :x2="40 + idx*95" y2="155" stroke="#b0c4de" stroke-width="1.5"/>
                      <text :x="40 + idx*95" y="170" fill="#b0c4de" font-size="11" text-anchor="middle">{{ x }}min</text>
                    </template>
                    <line x1="40" y1="30" x2="40" y2="150" stroke="#b0c4de" stroke-width="1.5"/>
                    <template v-for="(y, idx) in [0,7.5,15,22.5,30]" :key="idx">
                      <line x1="35" :y1="150 - idx*30" x2="45" :y2="150 - idx*30" stroke="#b0c4de" stroke-width="1.5"/>
                      <text x="30" :y="153 - idx*30" fill="#b0c4de" font-size="11" text-anchor="end">{{ y }}℃</text>
                    </template>
                  </g>

                  <!-- 运行状态曲线+数据点（贴合Excel运行值8.5℃波动） -->
                  <g v-if="currentSystemState === 'running'">
                    <path d="M40,80 Q135,70 230,80 T420,60" fill="none" stroke="#00bfff" stroke-width="2.5"/>
                    <template v-for="(point, idx) in [80,70,80,75,60]" :key="idx">
                      <circle :cx="40 + idx*95" :cy="point" r="4" fill="#00bfff" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" :y="point - 8" fill="#00bfff" font-size="10" text-anchor="middle">{{ Math.round((30 - (point-30)/4)) }}℃</text>
                    </template>
                  </g>

                  <!-- 停机状态曲线+数据点（贴合Excel停机值17.8℃） -->
                  <g v-else>
                    <path d="M40,58 Q135,58 230,58 T420,58" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
                    <template v-for="idx in [0,1,2,3,4]" :key="idx">
                      <circle :cx="40 + idx*95" cy="58" r="4" fill="#ff6b6b" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" y="50" fill="#ff6b6b" font-size="10" text-anchor="middle">18℃</text>
                    </template>
                  </g>
                </svg>
              </div>
            </div>

            <!-- 4. 热水入口温度趋势图（新增坐标+数据点） -->
            <div class="trend-chart">
              <div class="trend-title">热水入口温度趋势（℃）</div>
              <div class="trend-plot">
                <svg width="100%" height="100%" viewBox="0 0 450 180">
                  <!-- 坐标轴：X轴（时间）、Y轴（温度） -->
                  <g class="axis">
                    <line x1="40" y1="150" x2="420" y2="150" stroke="#b0c4de" stroke-width="1.5"/>
                    <template v-for="(x, idx) in [0,15,30,45,60]" :key="idx">
                      <line :x1="40 + idx*95" y1="145" :x2="40 + idx*95" y2="155" stroke="#b0c4de" stroke-width="1.5"/>
                      <text :x="40 + idx*95" y="170" fill="#b0c4de" font-size="11" text-anchor="middle">{{ x }}min</text>
                    </template>
                    <line x1="40" y1="30" x2="40" y2="150" stroke="#b0c4de" stroke-width="1.5"/>
                    <template v-for="(y, idx) in [0,25,50,75,100]" :key="idx">
                      <line x1="35" :y1="150 - idx*30" x2="45" :y2="150 - idx*30" stroke="#b0c4de" stroke-width="1.5"/>
                      <text x="30" :y="153 - idx*30" fill="#b0c4de" font-size="11" text-anchor="end">{{ y }}℃</text>
                    </template>
                  </g>

                  <!-- 运行状态曲线+数据点（贴合Excel运行值92.2℃波动） -->
                  <g v-if="currentSystemState === 'running'">
                    <path d="M40,36 Q135,30 230,36 T420,24" fill="none" stroke="#ff6347" stroke-width="2.5"/>
                    <template v-for="(point, idx) in [36,30,36,33,24]" :key="idx">
                      <circle :cx="40 + idx*95" :cy="point" r="4" fill="#ff6347" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" :y="point - 8" fill="#ff6347" font-size="10" text-anchor="middle">{{ Math.round((100 - (point-30))/1.2) }}℃</text>
                    </template>
                  </g>

                  <!-- 停机状态曲线+数据点（贴合Excel停机值18.0℃） -->
                  <g v-else>
                    <path d="M40,102 Q135,102 230,102 T420,102" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
                    <template v-for="idx in [0,1,2,3,4]" :key="idx">
                      <circle :cx="40 + idx*95" cy="102" r="4" fill="#ff6b6b" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" y="94" fill="#ff6b6b" font-size="10" text-anchor="middle">18℃</text>
                    </template>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
          
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'DataDashboard',
  data() {
    return {
      currentDate: '',
      currentTime: '',
      // 当前系统状态：shutdown（停机）/ running（运行）
      currentSystemState: 'running',
      // 每个数据点独立的显示状态，默认都隐藏
      dataPointsVisibility: {
        coolingWaterSupplyTemperature: true,
        coolingWaterReturnTemperature: true,
        coldWaterSupplyTemperature: true,
        coldWaterReturnTemperature: true,
        hotWaterSupplyTemperature: true,
        hotWaterReturnTemperature: true,
        generatorVoltage: true
      },
      // 两套数据：严格对应「画面数据.xlsx」
      systemData: {
        // 系统停机数据
        shutdown: {
          powerGrid: {
            Uab: '398.9v',
            Ubc: '401.5v',
            Uca: '399.9v'
          },
          generator: {
            Uab: '0.0v',
            UabValue: 0, // 用于计算进度条（纯数值）
            currentA: '0.0A',
            currentAValue: 0,
            powerTotal: '0.0kw',
            powerTotalValue: 0,
            reactiveTotal: '0.0kvar',
            frequency: '0.0Hz',
            frequencyValue: 0,
            speed: '0.0 r/min',
            exhaustTemp: '18.5℃',
            gridSwitch: '分闸',
            totalPower: '129568.5 kwh',
            totalGas: '15234.2 m³'
          },
          lithium: {
            coldInTemp: '17.8℃',
            coldInTempValue: 17.8, // 用于计算进度条（纯数值）
            coldOutTemp: '18.1℃',
            hotInTemp: '18.0℃',
            hotInTempValue: 18.0,
            hotOutTemp: '17.9℃',
            coolInTemp: '18.2℃',
            coolOutTemp: '17.6℃',
            evaporatorTemp: '16.6℃',
            evaporatorPress: '16.9kPa', // 修正Excel笔误（温度单位应为压力单位）
            startState: '启动' // 停机时溴化锂为启动状态（对应Excel）
          }
        },
        // 系统运行数据
        running: {
          powerGrid: {
            Uab: '401.2v',
            Ubc: '402.5v',
            Uca: '399.5v'
          },
          generator: {
            Uab: '401.0v',
            UabValue: 401.0,
            currentA: '156.0A',
            currentAValue: 156.0,
            powerTotal: '105.1kw',
            powerTotalValue: 105.1,
            reactiveTotal: '32.8kvar',
            frequency: '50.2Hz',
            frequencyValue: 50.2,
            speed: '2998 r/min',
            exhaustTemp: '418.5℃',
            gridSwitch: '合闸',
            totalPower: '130012.5 kwh',
            totalGas: '15265.2 m³'
          },
          lithium: {
            coldInTemp: '8.5℃',
            coldInTempValue: 8.5,
            coldOutTemp: '12.6℃',
            hotInTemp: '92.2℃',
            hotInTempValue: 92.2,
            hotOutTemp: '87.8℃',
            coolInTemp: '25.6℃',
            coolOutTemp: '29.0℃',
            evaporatorTemp: '6.5℃',
            evaporatorPress: '0.69Mpa',
            startState: '停机' // 运行时溴化锂为停机状态（对应Excel）
          }
        }
      }
    }
  },
  mounted() {
    // 初始化日期时间
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  },
  methods: {
    // 跳转运行优化页面
    handleOptimizationClick() {
      this.$router.push('/optimization');
    },
    // 跳转故障诊断页面
    handleDiagnosisClick() {
      this.$router.push('/fault-diagnosis');
    },
    // 设置系统状态（停机/运行）
    setSystemState(state) {
      this.currentSystemState = state;
      alert(`系统已${state === 'running' ? '启动' : '停机'}，数据已更新`);
    },
    // 故障复位（示例逻辑）
    handleFaultReset() {
      if (this.currentSystemState === 'running') {
        alert('故障复位成功，系统保持运行状态');
      } else {
        alert('请先启动系统再执行故障复位');
      }
    },
    // 更新日期时间
    updateDateTime() {
      const now = new Date();
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      // 格式化日期：YYYY-MM-DD 星期X
      this.currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${days[now.getDay()]}`;
      // 格式化时间：HH:MM:SS
      this.currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    },
    // 切换数据点标签的显示状态
    toggleDataLabels(pointName) {
      this.dataPointsVisibility[pointName] = !this.dataPointsVisibility[pointName];
    }
  }
}
</script>
<style scoped>
/* 保留原样式，新增坐标轴相关样式 */
.dashboard-container {
  width: 100%;
  background: #0a1929;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
  overflow-y: auto;
}

/* 确保页面可以滚动 */
body {
  margin: 0;
  padding: 0;
  overflow-y: auto;
  background: #0a1929;
}
.datetime-display {
  display: block;
  font-size: 22px;
  font-weight: bold;
  color: #00bfff;
  text-shadow: 0 0 10px rgba(0, 191, 255, 0.7), 0 0 20px rgba(0, 191, 255, 0.5);
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.1) 0%, rgba(0, 119, 204, 0.1) 100%);
  border: 1px solid rgba(0, 191, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 191, 255, 0.2);
  font-family: 'Courier New', monospace;
  animation: timePulse 3s ease-in-out infinite alternate;
  white-space: nowrap;
  margin-left: 0;
  width: fit-content;
  align-self: center;
  margin-bottom: 20px;
}
@keyframes timePulse {
  from {
    box-shadow: 0 4px 15px rgba(0, 191, 255, 0.2);
    text-shadow: 0 0 10px rgba(0, 191, 255, 0.7), 0 0 20px rgba(0, 191, 255, 0.5);
  }
  to {
    box-shadow: 0 4px 25px rgba(0, 191, 255, 0.4);
    text-shadow: 0 0 15px rgba(0, 191, 255, 0.9), 0 0 30px rgba(0, 191, 255, 0.7);
  }
}
.time-separator {
  margin: 0 10px;
  color: #00bfff;
  font-size: 24px;
}

/* 新布局样式 */
.top-section {
  display: flex;
  width: 100%;
  gap: 20px;
  margin-bottom: 20px;
  align-items: stretch;
}

.left-controls {
  width: 28%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.central-image-container {
  width: 100%;
  height: 60vh;
  min-height: 400px;
  background: rgba(10, 40, 60, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(0, 191, 255, 0.2);
  display: flex;
  align-items: center;
  padding-left: 0%;
  overflow: hidden;
  position: relative;
}

.right-controls {
  width: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.left-buttons, .right-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.bottom-section {
  display: flex;
  width: 100%;
  gap: 20px;
  flex: 1;
  overflow-y: auto;
}

.bottom-left {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bottom-right {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
/* 按钮区域样式（新增激活态） */
.dashboard-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 12px 20px;
  background: rgba(10, 40, 60, 0.7);
  border: 1px solid #00bfff;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: none;
  letter-spacing: normal;
  color: #ffffff;
  min-width: 150px;
}
.dashboard-button:hover {
  background: rgba(0, 191, 255, 0.2);
  border-color: #00d9ff;
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
}
.dashboard-button.active {
  background: linear-gradient(135deg, #00bfff 0%, #0088cc 100%);
  border-color: #00d9ff;
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.5);
}
.dashboard-button:active {
  transform: scale(0.98);
}
.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #00bfff;
  font-size: 16px;
}
.dashboard-button.primary {
  /* 运行优化和故障诊断按钮 - 更明显的样式 */
  background: linear-gradient(135deg, rgba(50, 205, 50, 0.3), rgba(34, 139, 34, 0.3));
  border-color: #32cd32;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(50, 205, 50, 0.3);
}
.dashboard-button.primary:hover {
  background: linear-gradient(135deg, rgba(50, 205, 50, 0.5), rgba(34, 139, 34, 0.5));
  border-color: #00ff00;
  box-shadow: 0 0 20px rgba(50, 205, 50, 0.5);
  transform: translateY(-2px);
}
.dashboard-button.primary:active {
  transform: translateY(0) scale(0.98);
}

/* 炫酷的实时时间两行显示样式 */
.datetime-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 15px 12px;
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.2) 0%, rgba(0, 119, 204, 0.2) 100%);
  border: 2px solid rgba(0, 191, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.3), inset 0 0 10px rgba(0, 191, 255, 0.1);
  backdrop-filter: blur(5px);
  margin-bottom: 30px;
  width: 100%;
  max-width: 220px;
  position: relative;
  overflow: hidden;
  animation: timePulse 3s ease-in-out infinite alternate;
}

/* 炫酷背景效果 */
.datetime-display::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 191, 255, 0.05),
    rgba(0, 191, 255, 0.05) 10px,
    rgba(0, 191, 255, 0.03) 10px,
    rgba(0, 191, 255, 0.03) 20px
  );
  animation: gridMove 8s linear infinite;
  pointer-events: none;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(20px, 20px); }
}

@keyframes timePulse {
  from {
    box-shadow: 0 0 20px rgba(0, 191, 255, 0.3), inset 0 0 10px rgba(0, 191, 255, 0.1);
  }
  to {
    box-shadow: 0 0 30px rgba(0, 191, 255, 0.5), inset 0 0 15px rgba(0, 191, 255, 0.2);
  }
}

.date-line {
  font-size: 18px;
  color: #00bfff;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(0, 191, 255, 0.7);
  animation: textGlow 2s ease-in-out infinite alternate;
  position: relative;
  z-index: 1;
}

.time-line {
  font-size: 24px;
  color: #ffffff;
  font-weight: bold;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 12px rgba(0, 191, 255, 0.9), 0 0 24px rgba(0, 191, 255, 0.5);
  animation: timeGlow 1.5s ease-in-out infinite alternate;
  position: relative;
  z-index: 1;
}

@keyframes textGlow {
  from { text-shadow: 0 0 8px rgba(0, 191, 255, 0.7); }
  to { text-shadow: 0 0 15px rgba(0, 191, 255, 0.9); }
}

@keyframes timeGlow {
  from {
    text-shadow: 0 0 12px rgba(0, 191, 255, 0.9), 0 0 24px rgba(0, 191, 255, 0.5);
  }
  to {
    text-shadow: 0 0 18px rgba(0, 191, 255, 1), 0 0 36px rgba(0, 191, 255, 0.8), 0 0 48px rgba(0, 191, 255, 0.6);
  }
}
.dashboard-button.secondary {
  /* 系统启动、停机、故障复位按钮 - 相对不明显的样式 */
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.1), rgba(0, 119, 204, 0.1));
  border-color: #0077cc;
  color: #b0c4de;
}
.dashboard-button.secondary:hover {
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.2), rgba(0, 119, 204, 0.2));
  border-color: #00bfff;
  color: #ffffff;
}
/* 数据列表样式（新增状态色） */
.data-lists-container {
  display: flex;
  gap: 20px;
  flex: 1;
  width: 100%;
}
.data-list {
  flex: 1;
  background: rgba(10, 40, 60, 0.7);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid rgba(0, 191, 255, 0.2);
  width: 100%;
  overflow-y: auto;
  max-height: 600px;
}
.list-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: #00bfff;
  text-align: center;
  border-bottom: 2px solid rgba(0, 191, 255, 0.3);
  padding-bottom: 10px;
}
.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.data-item:last-child {
  border-bottom: none;
}
.data-label {
  color: #b0c4de;
  font-size: 14px;
}
.data-value {
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
}
.data-value.normal {
  color: #00ff00;
}
.data-value.abnormal {
  color: #ff6b6b;
}
/* 图片区域样式（停机时显示占位符） */
.image-container {
  height: 50%;
  min-height: 325px;
  background: rgba(10, 40, 60, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(0, 191, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

/* 设备图片包装器 */
.equipment-image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

/* 数据点覆盖层 */
.data-points-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  transform: translateX(0%);
}

/* 数据值显示样式 */
.data-value-display {
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  z-index: 10;
  white-space: nowrap;
  text-align: center;
}

/* 数据值样式 */
.data-value {
  font-size: 12px;
  font-weight: normal;
  color: #d0d0d0;
}

/* 数据值异常状态（停机） */
.data-value-display.alert {
  animation: alertPulse 1s infinite;
}

.data-value-display.alert .data-value {
  color: #a0d2eb;
}

/* 数据值正常状态（运行） */
.data-value-display.running {
  animation: runningPulse 1s infinite;
}

.data-value-display.running .data-value {
  color: #ffffff;
}

@keyframes alertPulse {
  0% {
    text-shadow: 0 0 5px rgba(160, 210, 235, 0.5);
  }
  50% {
    text-shadow: 0 0 15px rgba(160, 210, 235, 0.8);
  }
  100% {
    text-shadow: 0 0 5px rgba(160, 210, 235, 0.5);
  }
}

@keyframes runningPulse {
  0% {
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
  50% {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
  }
  100% {
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
}
.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.1), rgba(0, 119, 204, 0.1));
}
.placeholder-image span {
  font-size: 24px;
  color: rgba(0, 191, 255, 0.5);
  text-align: center;
  padding: 0 20px;
}
/* 圆形图表样式（动态进度） */
.gauge-charts-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  height: 25%;
}
.gauge-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.gauge-title {
  font-size: 14px;
  color: #b0c4de;
  margin-bottom: 10px;
  text-align: center;
  white-space: nowrap;
}
.gauge-circle {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(
    rgba(0, 191, 255, 0.2) 0%,
    rgba(0, 191, 255, 0.2) var(--progress, 0%),
    rgba(0, 191, 255, 0.8) var(--progress, 0%),
    rgba(0, 191, 255, 0.8) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}
.gauge-circle::before {
  content: '';
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #0a1929;
}
.gauge-value {
  position: relative;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
}
/* 趋势图样式（新增坐标+数据点） */
.trend-charts-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.trend-chart-row {
  display: flex;
  gap: 20px;
  flex: 1;
}
.trend-chart {
  flex: 1;
  background: rgba(10, 40, 60, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(0, 191, 255, 0.2);
  padding: 15px;
  display: flex;
  flex-direction: column;
}
.trend-title {
  font-size: 14px;
  color: #b0c4de;
  margin-bottom: 10px;
  text-align: center;
}
.trend-plot {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  padding: 10px;
}
/* 坐标轴样式优化 */
.axis line {
  stroke-linecap: round;
}
.axis text {
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.5px;
}
/* 数据点样式优化 */
.trend-plot circle {
  transition: transform 0.2s ease;
}
.trend-plot circle:hover {
  transform: scale(1.2);
}
.trend-plot text {
  font-weight: 500;
  text-shadow: 0 0 3px rgba(0,0,0,0.8);
}
/* 科技感装饰 */
.dashboard-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(0, 191, 255, 0.05) 0%, rgba(0, 191, 255, 0) 70%);
  pointer-events: none;
}
/* 响应式调整 */
@media (max-width: 1200px) {
  .gauge-charts-container {
    grid-template-columns: repeat(2, 1fr);
  }
  .trend-plot svg {
    viewBox: 0 0 400 160;
  }
  .axis text {
    font-size: 10px;
  }
  .trend-plot text {
    font-size: 9px;
  }
  .bottom-section {
    flex-direction: column;
  }
  .bottom-left, .bottom-right {
    width: 100%;
  }
}
@media (max-width: 768px) {
  .top-section {
    flex-direction: column;
  }
  .left-controls, .central-image-container, .right-controls {
    width: 100%;
  }
  .central-image-container {
    height: 40%;
    min-height: 250px;
  }
  .bottom-section {
    flex-direction: column;
  }
  .bottom-left, .bottom-right {
    width: 100%;
  }
  .gauge-charts-container {
    grid-template-columns: repeat(2, 1fr);
  }
  .trend-chart-row {
    flex-direction: column;
  }
  .trend-plot svg {
    viewBox: 0 0 380 150;
  }
  .axis text {
    font-size: 9px;
  }
  .trend-plot text {
    font-size: 8px;
  }
}
</style>