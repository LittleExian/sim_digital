<template>
  <div class="dashboard-container">
    <!-- 主标题区域 -->
    <div class="dashboard-title">
      <h1>冷热电联供综合能源系统数字孪生运维管控平台</h1>
    </div>
    
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
          <!-- 3D模型容器 -->
          <div ref="modelContainer" style="width: 100%; height: 100%; position: absolute;"></div>
          <!-- 模型加载提示 -->
          <div v-if="!model" ref="loadingIndicator" style="
            width: 100%; 
            height: 100%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            position: absolute; 
            background-color: #0a1929;
            color: white; 
            font-size: 18px; 
            font-weight: bold;
          ">
            模型加载中，请稍候...
          </div>
          
          <!-- 顶层数据点层 -->
          <!-- <div class="data-points-overlay"> -->
            <!-- 冷却水供水温度 -->
            <!-- <div class="data-value-display" style="left: 69%; top: 43%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.coolInTemp }}</div>
            </div> -->

            <!-- 冷却水回水温度 -->
            <!-- <div class="data-value-display" style="left: 75%; top: 43%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.coolOutTemp }}</div>
            </div> -->

            <!-- 冷水供水温度 -->
            <!-- <div class="data-value-display" style="left: 61%; top: 55%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.coldInTemp }}</div>
            </div> -->

            <!-- 冷水回水温度 -->
            <!-- <div class="data-value-display" style="left: 66%; top: 55%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.coldOutTemp }}</div>
            </div> -->

            <!-- 烟气进口温度 -->
            <!-- <div class="data-value-display" style="left: 54%; top: 40.5%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.smokeInTemp }}</div>
            </div> -->

            <!-- 烟气出口温度 -->
            <!-- <div class="data-value-display" style="left: 54%; top: 30.5%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value">{{ systemData[currentSystemState].lithium.smokeOutTemp }}</div>
            </div> -->

            <!-- 发电机参数 -->
            <!-- <div class="data-value-display" style="left: 28%; top: 50%;" :class="{ 'alert': currentSystemState === 'shutdown', 'running': currentSystemState === 'running' }">
              <div class="data-value" style="display: flex; justify-content: space-around; gap: 20px;"> 发电Uab <span style="text-align: right;">{{systemData[currentSystemState].generator.Uab }}</span></div>
              <div class="data-value" style="display: flex; justify-content: space-around; gap: 20px;"> A相电流 <span style="text-align: right;">{{ systemData[currentSystemState].generator.currentA }}</span></div>
              <div class="data-value" style="display: flex; justify-content: space-between; gap: 20px;">总有功功率 <span style="text-align: right;">{{ systemData[currentSystemState].generator.powerTotal }}</span></div>
              <div class="data-value" style="display: flex; justify-content: space-between; gap: 20px;">总无功功率 <span style="text-align: right;">{{ systemData[currentSystemState].generator.reactiveTotal }}</span></div>
            </div> -->
          <!-- </div> -->
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
              <span class="data-label">烟气进口温度</span>
              <span class="data-value">{{ systemData[currentSystemState].lithium.smokeInTemp }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">烟气出口温度</span>
              <span class="data-value">{{ systemData[currentSystemState].lithium.smokeOutTemp }}</span>
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
          <!-- 烟气进口温度 -->
          <div class="gauge-chart">
            <div class="gauge-title">烟气进口温度</div>
            <div class="gauge-circle" :style="{'--progress': `calc((${systemData[currentSystemState].lithium.smokeInTempValue} / 300) * 100%)`}">
              <div class="gauge-progress"></div>
              <div class="gauge-value">{{ systemData[currentSystemState].lithium.smokeInTemp }}</div>
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
                    <!-- 趋势曲线 - 动态跟随实时数据 -->
                    <path :d="`M40,${currentGeneratorCurrentY} Q135,${currentGeneratorCurrentY - 2.5} 230,${currentGeneratorCurrentY + 3.5} T420,${currentGeneratorCurrentY - 1.5}`" fill="none" stroke="#00bfff" stroke-width="2.5"/>
                    <!-- 数据点（5个关键节点） - 动态跟随实时数据 -->
                    <template v-for="(offset, idx) in [0, -2.5, 3.5, 0.5, -1.5]" :key="idx">
                      <circle :cx="40 + idx*95" :cy="currentGeneratorCurrentY + offset" r="4" fill="#00bfff" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" :y="currentGeneratorCurrentY + offset - 8" fill="#00bfff" font-size="10" text-anchor="middle">{{ idx === 0 ? systemData.running.generator.currentAValue.toFixed(1) : (systemData.running.generator.currentAValue + (offset * 0.6)).toFixed(1) }}A</text>
                    </template>
                  </g>

                  <!-- 停机状态曲线+数据点（固定0A） -->
                  <g v-else>
                    <path d="M40,150 Q135,150 230,150 T420,150" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
                    <template v-for="idx in [0,1,2,3,4]" :key="idx">
                      <circle :cx="40 + idx*95" cy="150" r="4" fill="#ff6b6b" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" y="142" fill="#ff6b6b" font-size="10" text-anchor="middle">0.0A</text>
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
                    <!-- 趋势曲线 - 动态跟随实时数据 -->
                    <path :d="`M40,${currentTotalPowerY} Q135,${currentTotalPowerY - 6} 230,${currentTotalPowerY - 2} T420,${currentTotalPowerY - 13}`" fill="none" stroke="#32cd32" stroke-width="2.5"/>
                    <!-- 数据点（5个关键节点） - 动态跟随实时数据 -->
                    <template v-for="(offset, idx) in [0, -6, -2, -8, -13]" :key="idx">
                      <circle :cx="40 + idx*95" :cy="currentTotalPowerY + offset" r="4" fill="#32cd32" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" :y="currentTotalPowerY + offset - 8" fill="#32cd32" font-size="10" text-anchor="middle">{{ idx === 0 ? systemData.running.generator.powerTotalValue.toFixed(1) : (systemData.running.generator.powerTotalValue + (offset * 0.1)).toFixed(1) }}kW</text>
                    </template>
                  </g>

                  <!-- 停机状态曲线+数据点（固定0kW） -->
                  <g v-else>
                    <path d="M40,150 Q135,150 230,150 T420,150" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
                    <template v-for="idx in [0,1,2,3,4]" :key="idx">
                      <circle :cx="40 + idx*95" cy="150" r="4" fill="#ff6b6b" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" y="142" fill="#ff6b6b" font-size="10" text-anchor="middle">0.0kW</text>
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

                  <!-- 运行状态曲线+数据点（动态跟随实时数据） -->
                  <g v-if="currentSystemState === 'running'">
                    <path :d="`M40,${currentColdTempY} Q135,${currentColdTempY - 4} 230,${currentColdTempY - 1} T420,${currentColdTempY - 7}`" fill="none" stroke="#00bfff" stroke-width="2.5"/>
                    <template v-for="(offset, idx) in [0, -4, -1, -3, -7]" :key="idx">
                      <circle :cx="40 + idx*95" :cy="currentColdTempY + offset" r="4" fill="#00bfff" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" :y="currentColdTempY + offset - 8" fill="#00bfff" font-size="10" text-anchor="middle">{{ idx === 0 ? systemData.running.lithium.coldInTempValue.toFixed(1) : (systemData.running.lithium.coldInTempValue + (offset * 0.1)).toFixed(1) }}℃</text>
                    </template>
                  </g>

                  <!-- 停机状态曲线+数据点（贴合Excel停机值17.8℃） -->
                  <g v-else>
                    <path d="M40,58 Q135,58 230,58 T420,58" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
                    <template v-for="idx in [0,1,2,3,4]" :key="idx">
                      <circle :cx="40 + idx*95" cy="58" r="4" fill="#ff6b6b" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" y="50" fill="#ff6b6b" font-size="10" text-anchor="middle">18.0℃</text>
                    </template>
                  </g>
                </svg>
              </div>
            </div>

            <!-- 4. 烟气进口温度趋势图（新增坐标+数据点） -->
            <div class="trend-chart">
              <div class="trend-title">烟气进口温度趋势（℃）</div>
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
                    <template v-for="(y, idx) in [270,280,290,300,310]" :key="idx">
                      <line x1="35" :y1="150 - (idx*30)" x2="45" :y2="150 - (idx*30)" stroke="#b0c4de" stroke-width="1.5"/>
                      <text x="30" :y="153 - (idx*30)" fill="#b0c4de" font-size="11" text-anchor="end">{{ y }}℃</text>
                    </template>
                  </g>

                  <!-- 运行状态曲线+数据点（动态跟随实时数据） -->
                  <g v-if="currentSystemState === 'running'">
                    <path :d="`M40,${currentSmokeTempY} Q135,${currentSmokeTempY - 3} 230,${currentSmokeTempY - 1} T420,${currentSmokeTempY - 7}`" fill="none" stroke="#ff6347" stroke-width="2.5"/>
                    <template v-for="(offset, idx) in [0, -3, -1, -5, -7]" :key="idx">
                      <circle :cx="40 + idx*95" :cy="currentSmokeTempY + offset" r="4" fill="#ff6347" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" :y="currentSmokeTempY + offset - 8" fill="#ff6347" font-size="10" text-anchor="middle">{{ idx === 0 ? systemData.running.lithium.smokeInTempValue.toFixed(1) : (systemData.running.lithium.smokeInTempValue + (offset * 0.25)).toFixed(1) }}℃</text>
                    </template>
                  </g>

                  <!-- 停机状态曲线+数据点（贴合Excel停机值18.0℃） -->
                  <g v-else>
                    <path d="M40,150 Q135,150 230,150 T420,150" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
                    <template v-for="idx in [0,1,2,3,4]" :key="idx">
                      <circle :cx="40 + idx*95" cy="150" r="4" fill="#ff6b6b" stroke="#fff" stroke-width="1"/>
                      <text :x="40 + idx*95" y="142" fill="#ff6b6b" font-size="10" text-anchor="middle">18.0℃</text>
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
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

    // 趋势图的基础配置
    trendChartConfig: {
      // SVG视图框大小
      viewBox: {
        width: 450,
        height: 180
      },
      // 坐标轴范围
      axes: {
        // 时间轴范围（分钟）
        time: {
          min: 0,
          max: 60
        },
        // 各个参数的Y轴范围
        generatorCurrent: {
          min: 0,
          max: 200
        },
        totalPower: {
          min: 0,
          max: 150
        },
        coldTemp: {
          min: 0,
          max: 30
        },
        hotTemp: {
          min: 0,
          max: 300
        }
      }
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
            UabValue: 0.0, // 用于计算进度条（纯数值）
            currentA: '0.0A',
            currentAValue: 0.0,
            powerTotal: '0.0kw',
            powerTotalValue: 0.0,
            reactiveTotal: '0.0kvar',
            frequency: '0.0Hz',
            frequencyValue: 0.0,
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
            smokeInTemp: '18.0℃',
            smokeInTempValue: 18.0,
            smokeOutTemp: '17.9℃',
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
            currentA: '80.9A',
            currentAValue: 80.9,
            powerTotal: '55.7kw',
            powerTotalValue: 55.7,
            reactiveTotal: '16.8kvar',
            frequency: '49.9Hz',
            frequencyValue: 49.9,
            speed: '2998.0 r/min',
            exhaustTemp: '418.5℃',
            gridSwitch: '合闸',
            totalPower: '130012.5 kwh',
            totalGas: '15265.2 m³'
          },
          lithium: {
            coldInTemp: '8.5℃',
            coldInTempValue: 8.5,
            coldOutTemp: '12.6℃',
            smokeInTemp: '288.8℃',
            smokeInTempValue: 288.8,
            smokeOutTemp: '65.5℃',
            smokeOutTempValue: 65.5, // 用于计算进度条（纯数值）
            coolInTemp: '29.0℃',
            coolOutTemp: '25.6℃',
            evaporatorTemp: '6.5℃',
            evaporatorPress: '0.69Mpa',
            startState: '停机' // 运行时溴化锂为停机状态（对应Excel）
          }
        }
      }
    }
  },
  computed: {
    // 计算发电机电流的Y坐标（实时数据转SVG坐标）
    currentGeneratorCurrentY() {
      // 电流值：systemData.running.generator.currentAValue
      // 转换公式：SVG Y坐标 = 坐标轴底部Y坐标 - (电流值/最大值) * 坐标轴高度
      // 坐标轴底部Y坐标：150
      // 坐标轴高度：120 (150-30)
      return 150 - (this.systemData.running.generator.currentAValue / this.trendChartConfig.axes.generatorCurrent.max) * 120;
    },
    // 计算总有功功率的Y坐标（实时数据转SVG坐标）
    currentTotalPowerY() {
      // 功率值：systemData.running.generator.powerTotalValue
      // 转换公式：SVG Y坐标 = 坐标轴底部Y坐标 - (功率值/最大值) * 坐标轴高度
      return 150 - (this.systemData.running.generator.powerTotalValue / this.trendChartConfig.axes.totalPower.max) * 120;
    },
    // 计算冷水供水温度的Y坐标（实时数据转SVG坐标）
    currentColdTempY() {
      // 温度值：systemData.running.lithium.coldInTempValue
      // 转换公式：SVG Y坐标 = 坐标轴底部Y坐标 - (温度值/最大值) * 坐标轴高度
      return 150 - (this.systemData.running.lithium.coldInTempValue / this.trendChartConfig.axes.coldTemp.max) * 120;
    },
    // 计算烟气进口温度的Y坐标（实时数据转SVG坐标）
    currentSmokeTempY() {
      // 温度值：systemData.running.lithium.smokeInTempValue
      // 转换公式：SVG Y坐标 = 坐标轴底部Y坐标 - (温度值/最大值) * 坐标轴高度
      return 150 - (this.systemData.running.lithium.smokeInTempValue / this.trendChartConfig.axes.hotTemp.max) * 120;
    }
  },
  mounted() {
    // 初始化日期时间
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
    
    // 添加实时数据更新定时器，每1分钟更新一次
    setInterval(() => this.updateRealTimeData(), 2000);
    
    // 初始化3D场景
    this.$nextTick(() => {
      this.init3DScene();
    });
  },
  beforeUnmount() {
    // 清理3D场景以避免内存泄漏
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.scene) {
      this.scene.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
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
    },
    
    // 更新实时数据，每个数据项独立变化，部分数据项可能保持不变，创造更自然的曲线形态
    updateRealTimeData() {
      // 只有在系统运行状态下才更新数据
      if (this.currentSystemState === 'running') {
        const runningData = this.systemData.running;
        
        // 基础变化幅度因子
        const baseChangeFactor = 0.3 + Math.random() * 0.5;
        
        // 更新powerGrid数据 - 电网电压在399.0-403.0V之间波动，80%概率变化
        if (Math.random() < 0.8) {
          const gridVoltageChangeUab = (Math.random() > 0.5 ? 1 : -1) * baseChangeFactor * 1.2;
          const newUab = Math.max(399.0, Math.min(403.0, parseFloat(runningData.powerGrid.Uab) + gridVoltageChangeUab));
          runningData.powerGrid.Uab = `${newUab.toFixed(1)}v`;
        }
        
        if (Math.random() < 0.8) {
          const gridVoltageChangeUbc = (Math.random() > 0.5 ? 1 : -1) * baseChangeFactor * 1.2;
          const newUbc = Math.max(399.0, Math.min(403.0, parseFloat(runningData.powerGrid.Ubc) + gridVoltageChangeUbc));
          runningData.powerGrid.Ubc = `${newUbc.toFixed(1)}v`;
        }
        
        if (Math.random() < 0.8) {
          const gridVoltageChangeUca = (Math.random() > 0.5 ? 1 : -1) * baseChangeFactor * 1.2;
          const newUca = Math.max(399.0, Math.min(403.0, parseFloat(runningData.powerGrid.Uca) + gridVoltageChangeUca));
          runningData.powerGrid.Uca = `${newUca.toFixed(1)}v`;
        }
        
        // 更新generator数据
        // 发电机电压：在400.0-402.0V之间波动，65%概率变化，变化相对平缓
        if (Math.random() < 0.65) {
          const generatorVoltageChange = (Math.random() > 0.6 ? 1 : -1) * baseChangeFactor * 0.6;
          const newGenUab = Math.max(400.0, Math.min(402.0, runningData.generator.UabValue + generatorVoltageChange));
          runningData.generator.UabValue = parseFloat(newGenUab.toFixed(1));
          runningData.generator.Uab = `${runningData.generator.UabValue.toFixed(1)}v`;
        }
        
        // 电流：在80.0-81.5A之间波动，85%概率变化，变化较为频繁
        if (Math.random() < 0.85) {
          const currentChange = (Math.random() > 0.5 ? 1 : -1) * baseChangeFactor * 3;
          const newCurrentA = Math.max(80.0, Math.min(81.5, runningData.generator.currentAValue + currentChange));
          runningData.generator.currentAValue = parseFloat(newCurrentA.toFixed(1));
          runningData.generator.currentA = `${runningData.generator.currentAValue.toFixed(1)}A`;
        }
        
        // 总有功功率：在55.0-56.5kW之间波动，85%概率变化，与电流有一定相关性但不完全同步
        if (Math.random() < 0.85) {
          const powerChange = (Math.random() > 0.52 ? 1 : -1) * baseChangeFactor * 5;
          const newPowerTotal = Math.max(55.0, Math.min(56.5, runningData.generator.powerTotalValue + powerChange));
          runningData.generator.powerTotalValue = parseFloat(newPowerTotal.toFixed(1));
          runningData.generator.powerTotal = `${runningData.generator.powerTotalValue.toFixed(1)}kw`;
        }
        
        // 无功功率：在16.0-17.5kvar之间波动，70%概率变化，独立变化
        if (Math.random() < 0.7) {
          const reactiveChange = (Math.random() > 0.48 ? 1 : -1) * baseChangeFactor * 1.5;
          const newReactiveTotal = Math.max(16.0, Math.min(17.5, parseFloat(runningData.generator.reactiveTotal) + reactiveChange));
          runningData.generator.reactiveTotal = `${newReactiveTotal.toFixed(1)}kvar`;
        }
        
        // 频率：在49.8-50.1Hz之间波动，60%概率变化，变化较小且稳定
        if (Math.random() < 0.6) {
          const frequencyChange = (Math.random() > 0.5 ? 1 : -1) * baseChangeFactor * 0.1;
          const newFrequency = Math.max(49.8, Math.min(50.1, runningData.generator.frequencyValue + frequencyChange));
          runningData.generator.frequencyValue = parseFloat(newFrequency.toFixed(1));
          runningData.generator.frequency = `${runningData.generator.frequencyValue.toFixed(1)}Hz`;
        }
        
        // 转速：在2995-3000 r/min之间波动，50%概率变化，变化缓慢且稳定
        if (Math.random() < 0.5) {
          const speedChange = (Math.random() > 0.6 ? 1 : -1) * Math.floor(baseChangeFactor * 5);
          const newSpeed = Math.max(2995, Math.min(3000, parseInt(runningData.generator.speed)) + speedChange);
          runningData.generator.speed = `${newSpeed.toFixed(1)} r/min`;
        }
        
        // 排气温度：在417.0-420.0℃之间波动，75%概率变化，与功率变化有一定相关性
        if (Math.random() < 0.75) {
          const exhaustTempChange = (Math.random() > 0.53 ? 1 : -1) * baseChangeFactor * 3;
          const newExhaustTemp = Math.max(417.0, Math.min(420.0, parseFloat(runningData.generator.exhaustTemp) + exhaustTempChange));
          runningData.generator.exhaustTemp = `${newExhaustTemp.toFixed(1)}℃`;
        }
        
        // 累计发电量：持续增长
        const newTotalPower = parseFloat(runningData.generator.totalPower) + 0.5 + Math.random() * 1.5;
        runningData.generator.totalPower = `${newTotalPower.toFixed(1)} kwh`;
        
        // 累计燃气量：持续增长
        const newTotalGas = parseFloat(runningData.generator.totalGas) + 0.3 + Math.random() * 0.7;
        runningData.generator.totalGas = `${newTotalGas.toFixed(1)} m³`;
        
        // 更新lithium数据
        // 冷水进水温度：在8.0-9.0℃之间波动，70%概率变化，独立变化
        if (Math.random() < 0.7) {
          const coldInTempChange = (Math.random() > 0.55 ? -1 : 1) * baseChangeFactor * 0.8; // 冷水温度变化方向特殊
          const newColdInTemp = Math.max(8.0, Math.min(9.0, runningData.lithium.coldInTempValue + coldInTempChange));
          runningData.lithium.coldInTempValue = parseFloat(newColdInTemp.toFixed(1));
          runningData.lithium.coldInTemp = `${runningData.lithium.coldInTempValue.toFixed(1)}℃`;
        }
        
        // 冷水出水温度：在12.0-13.5℃之间波动，65%概率变化，与进水温度有一定相关性
        if (Math.random() < 0.65) {
          const coldOutTempChange = (Math.random() > 0.55 ? -1 : 1) * baseChangeFactor * 0.8;
          const newColdOutTemp = Math.max(12.0, Math.min(13.5, parseFloat(runningData.lithium.coldOutTemp) + coldOutTempChange));
          runningData.lithium.coldOutTemp = `${newColdOutTemp.toFixed(1)}℃`;
        }
        
        // 烟气进口温度：在280-300℃之间波动，60%概率变化，独立变化
        if (Math.random() < 0.6) {
          const smokeInTempChange = (Math.random() > 0.52 ? 1 : -1) * baseChangeFactor * 3;
          const newsmokeInTemp = Math.max(280.0, Math.min(300.0, runningData.lithium.smokeInTempValue + smokeInTempChange));
          runningData.lithium.smokeInTempValue = parseFloat(newsmokeInTemp.toFixed(1));
          runningData.lithium.smokeInTemp = `${runningData.lithium.smokeInTempValue.toFixed(1)}℃`;
        }
        
        // 烟气出口温度：在60-70℃之间波动，55%概率变化，与进水温度相关但有延迟
        if (Math.random() < 0.55) {
          const smokeOutTempChange = (Math.random() > 0.52 ? 1 : -1) * baseChangeFactor * 3;
          const newsmokeOutTemp = Math.max(60.0, Math.min(70.0, parseFloat(runningData.lithium.smokeOutTemp) + smokeOutTempChange));
          runningData.lithium.smokeOutTemp = `${newsmokeOutTemp.toFixed(1)}℃`;
        }
        
        // 冷却水进水温度：在25.0-26.5℃之间波动，65%概率变化，独立变化
        if (Math.random() < 0.65) {
          const coolInTempChange = (Math.random() > 0.5 ? 1 : -1) * baseChangeFactor * 0.8;
          const newCoolInTemp = Math.max(28.5, Math.min(30.0, parseFloat(runningData.lithium.coolInTemp) + coolInTempChange));
          runningData.lithium.coolInTemp = `${newCoolInTemp.toFixed(1)}℃`;
        }
        
        // 冷却水出水温度：在28.5-30.0℃之间波动，60%概率变化，与进水温度相关
        if (Math.random() < 0.6) {
          const coolOutTempChange = (Math.random() > 0.5 ? 1 : -1) * baseChangeFactor * 0.8;
          const newCoolOutTemp = Math.max(25.0, Math.min(26.5, parseFloat(runningData.lithium.coolOutTemp) + coolOutTempChange));
          runningData.lithium.coolOutTemp = `${newCoolOutTemp.toFixed(1)}℃`;
        }
        
        // 蒸发器温度：在6.0-7.0℃之间波动，70%概率变化，独立变化
        if (Math.random() < 0.7) {
          const evaporatorTempChange = (Math.random() > 0.55 ? -1 : 1) * baseChangeFactor * 0.5;
          const newEvaporatorTemp = Math.max(6.0, Math.min(7.0, parseFloat(runningData.lithium.evaporatorTemp) + evaporatorTempChange));
          runningData.lithium.evaporatorTemp = `${newEvaporatorTemp.toFixed(1)}℃`;
        }
        
        // 蒸发器压力：在0.68-0.70Mpa之间波动，65%概率变化，独立变化
        if (Math.random() < 0.65) {
          const evaporatorPressChange = (Math.random() > 0.5 ? 1 : -1) * baseChangeFactor * 0.008;
          const newEvaporatorPress = Math.max(0.68, Math.min(0.70, parseFloat(runningData.lithium.evaporatorPress) + evaporatorPressChange));
          runningData.lithium.evaporatorPress = `${newEvaporatorPress.toFixed(2)}Mpa`;
        }
        
        // 为了更好地观察效果，添加控制台日志
        console.log('实时数据已更新，部分数据项保持不变以创建更自然的曲线形态');
      }
    },
    
    // 初始化3D场景和加载模型
    init3DScene() {
      // 如果容器不存在或模型路径未配置，则不执行3D初始化
      if (!this.$refs.modelContainer) {
        console.warn('3D模型容器不存在');
        return;
      }
      
      // 创建场景
      this.scene = new THREE.Scene();
      
      // 创建相机
      const containerWidth = this.$refs.modelContainer.offsetWidth;
      const containerHeight = this.$refs.modelContainer.offsetHeight;
      this.camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
      
      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(containerWidth, containerHeight);
      this.renderer.setClearColor(0x000000, 0); // 透明背景
      this.$refs.modelContainer.appendChild(this.renderer.domElement);
      
      // 添加环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);
      
      // 添加方向光
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      this.scene.add(directionalLight);
      
      // 加载GLB模型
      const loader = new GLTFLoader();
      loader.load(
        '/equipment.glb',
        (gltf) => {
          this.model = gltf.scene;
          
          // 设置模型初始旋转：沿y轴顺时针旋转90度，沿z轴顺时针旋转60度
          this.model.rotation.y = -Math.PI / 2; // y轴顺时针旋转90度
          this.model.rotation.z = -Math.PI / 4; // z轴顺时针旋转45度
          
          // 计算并设置模型大小以完全适配容器
          this.resizeModelToFitContainer();
          
          this.scene.add(this.model);
          
          // 模型已加载，Vue的v-if会自动隐藏加载提示
            
            // 添加鼠标交互功能
            this.addMouseInteraction();
            
            console.log('3D模型加载成功，已适配容器大小，支持鼠标缩放和旋转');
            
            // 渲染一次
            this.renderer.render(this.scene, this.camera);
        },
        (xhr) => {
          // 加载进度
          console.log((xhr.loaded / xhr.total * 100) + '% 模型已加载');
        },
        (error) => {
          // 加载错误
          console.error('3D模型加载失败:', error);
          // 可以在这里添加错误提示，但由于v-if="!model"，加载提示会一直显示
          // 可以考虑修改加载提示文本或添加错误状态
        }
      );
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', this.handleResize);
    },
    
    // 调整模型大小以适配容器
    resizeModelToFitContainer() {
      if (!this.model || !this.$refs.modelContainer || !this.camera) return;
      
      const containerWidth = this.$refs.modelContainer.offsetWidth;
      const containerHeight = this.$refs.modelContainer.offsetHeight;
      
      // 计算模型的包围盒
      const box = new THREE.Box3().setFromObject(this.model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      // 确保模型居中
      this.model.position.x = -center.x;
      this.model.position.y = -center.y;
      this.model.position.z = -center.z;
      
     
      const scale = 8;
      this.model.scale.set(scale, scale, scale);
      
      // 重新计算相机位置，打破与scale的直接比例关系
      // 使用模型基础大小计算相机距离，并让相机距离增长速度小于scale增长速度
      const baseModelSize = Math.max(size.x, size.y, size.z);
      const fov = this.camera.fov * (Math.PI / 180);
      // 使用基础大小计算初始相机距离，然后与scale建立对数关系，避免比例增长
      const baseDistance = baseModelSize / (2 * Math.tan(fov / 2)) * 1.5;
      // 使用平方根关系，让相机距离增长速度慢于scale增长
      const cameraDistance = baseDistance * Math.sqrt(scale);
      
      // 设置相机位置
      this.camera.position.z = cameraDistance;
      this.camera.position.y = cameraDistance * 0.1; // 极低的俯视角度，确保更好地查看模型
      
      // 更新相机
      this.camera.aspect = containerWidth / containerHeight;
      this.camera.updateProjectionMatrix();
    },
    
    // 处理窗口大小变化
    handleResize() {
      if (!this.$refs.modelContainer || !this.camera || !this.renderer) return;
      
      const containerWidth = this.$refs.modelContainer.offsetWidth;
      const containerHeight = this.$refs.modelContainer.offsetHeight;
      
      this.camera.aspect = containerWidth / containerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(containerWidth, containerHeight);
      
      // 如果模型已加载，重新调整大小
      if (this.model) {
        this.resizeModelToFitContainer();
        this.renderer.render(this.scene, this.camera);
      }
    },
    
    // 添加鼠标交互功能
    addMouseInteraction() {
      if (!this.$refs.modelContainer) return;
      
      let isDragging = false;
      let isCtrlPressed = false;
      let previousMousePosition = { x: 0, y: 0 };
      
      // 监听Ctrl键按下和释放事件
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Control' || event.key === 'Ctrl') {
          isCtrlPressed = true;
        }
      });
      
      window.addEventListener('keyup', (event) => {
        if (event.key === 'Control' || event.key === 'Ctrl') {
          isCtrlPressed = false;
        }
      });
      
      // 鼠标按下事件 - 开始拖拽
      this.$refs.modelContainer.addEventListener('mousedown', (event) => {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
      });
      
      // 鼠标移动事件 - 处理旋转或平移
      this.$refs.modelContainer.addEventListener('mousemove', (event) => {
        if (!isDragging || !this.model) return;
        
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        
        if (isCtrlPressed) {
            // 按住Ctrl键时，平移模型
            // 根据缩放比例调整平移速度
            const scale = this.model.scale.x;
            const moveSpeed = 0.005 * scale;
            
            this.model.position.x += deltaX * moveSpeed;
            this.model.position.y -= deltaY * moveSpeed;
          } else {
          // 普通拖拽时，旋转模型
          this.model.rotation.y += deltaX * 0.005;
          this.model.rotation.x += deltaY * 0.005;
          
          // 限制垂直旋转角度，避免过度旋转
          this.model.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.model.rotation.x));
        }
        
        previousMousePosition = { x: event.clientX, y: event.clientY };
        this.renderer.render(this.scene, this.camera);
      });
      
      // 鼠标释放事件 - 结束拖拽
      window.addEventListener('mouseup', () => {
        isDragging = false;
      });
      
      // 鼠标滚轮事件 - 处理缩放（仅在按住Ctrl键时生效）
      this.$refs.modelContainer.addEventListener('wheel', (event) => {
        event.preventDefault();
        
        // 只有在按住Ctrl键时才执行缩放
        if (!isCtrlPressed || !this.model) return;
        
        // 根据滚轮方向调整缩放比例，增大缩放步长
        const scaleFactor = event.deltaY > 0 ? 0.8 : 1.25;
        
        // 获取当前缩放值并计算新的缩放值
        const currentScale = this.model.scale.x;
        const newScale = Math.max(0.2, Math.min(100, currentScale * scaleFactor));
        
        // 应用缩放
        this.model.scale.set(newScale, newScale, newScale);
        
        this.renderer.render(this.scene, this.camera);
      });
    },
    

    
    // 清理3D资源
    beforeUnmount() {
      if (this.renderer) {
        this.renderer.dispose();
      }
      
      window.removeEventListener('resize', this.handleResize);
      
      // 清理鼠标和键盘事件监听器
      if (this.$refs.modelContainer) {
        this.$refs.modelContainer.removeEventListener('mousedown', null);
        this.$refs.modelContainer.removeEventListener('mousemove', null);
        this.$refs.modelContainer.removeEventListener('wheel', null);
      }
      window.removeEventListener('mouseup', null);
      window.removeEventListener('keydown', null);
      window.removeEventListener('keyup', null);
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

/* 主标题样式 */
.dashboard-title {
  text-align: center;
  padding: 20px 0;
  margin-bottom: 20px;
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.1), rgba(0, 119, 204, 0.1));
  border-bottom: 1px solid rgba(0, 191, 255, 0.3);
}

.dashboard-title h1 {
  font-size: 28px;
  font-weight: bold;
  color: #00bfff;
  text-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
  margin: 0;
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