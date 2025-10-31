<template>
  <div class="optimization-container">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        <span>返回仪表盘</span>
      </button>
      <h1 class="page-title">冷热电联供综合能源系统数字孪生运维管控平台</h1>
    </div>
    <!-- 主内容区域 -->
    <div class="optimization-content">
      <!-- 系统状态卡片 -->
      <div class="status-cards">
        <div class="status-card">
          <div class="status-title">系统状态</div>
          <div class="status-value">正常运行</div>
          <div class="status-indicator"></div>
        </div>
        <div class="status-card">
          <div class="status-title">当前综合能源利用率</div>
          <div class="status-value">{{ efficiencyData.utilizationRate }}</div>
          <div class="status-change positive">+3.5%</div>
        </div>
        <div class="status-card">
          <div class="status-title">碳排放减少</div>
          <div class="status-value">{{ efficiencyData.carbonReduction }}</div>
          <div class="status-change positive">+2.1 t</div>
        </div>
        <div class="status-card">
          <div class="status-title">节能效益</div>
          <div class="status-value">{{ efficiencyData.energySaving }}</div>
          <div class="status-change positive">+¥1,680</div>
        </div>
      </div>
      <!-- 优化参数设置 -->
      <div class="optimization-params">
        <h2 class="section-title">优化参数设置</h2>
        <div class="params-grid">
          <div class="param-group">
            <label class="param-label">发电优先级（微燃机）</label>
            <input type="range" min="0" max="100" v-model="powerPriority" class="param-slider">
            <span class="param-value">{{ powerPriority }}%</span>
          </div>
          <div class="param-group">
            <label class="param-label">制冷优先级（溴化锂机组）</label>
            <input type="range" min="0" max="100" v-model="coolingPriority" class="param-slider">
            <span class="param-value">{{ coolingPriority }}%</span>
          </div>
          <div class="param-group">
            <label class="param-label">制热优先级（热回收系统）</label>
            <input type="range" min="0" max="100" v-model="heatingPriority" class="param-slider">
            <span class="param-value">{{ heatingPriority }}%</span>
          </div>
          <div class="param-group">
            <label class="param-label">燃气消耗限制（微燃机）</label>
            <input type="range" min="50" max="150" v-model="gasLimit" class="param-slider">
            <span class="param-value">{{ gasLimit }} m³/h</span>
          </div>
          <div class="param-group">
            <label class="param-label">水泵流量设定</label>
            <input type="range" min="50" max="100" v-model="pumpFlow" class="param-slider">
            <span class="param-value">{{ pumpFlow }}%</span>
          </div>
          <div class="param-group">
            <label class="param-label">烟气设定温度</label>
            <input type="range" min="280" max="300" v-model="smokeTemp" class="param-slider">
            <span class="param-value">{{ smokeTemp }}°C</span>
          </div>
        </div>
        <button class="optimize-button" @click="runOptimization">
          <span class="button-icon">✨</span>
          <span>运行优化</span>
        </button>
      </div>
      <!-- 实时监测数据 -->
      <div class="monitoring-data">
        <h2 class="section-title">实时监测数据</h2>
        <div class="data-tables">
          <div class="data-table">
            <h3 class="table-title">微燃机数据</h3>
            <table>
              <tbody>
                <tr>
                  <td class="data-label">转速</td>
                  <td class="data-value">{{ systemData.running.generator.speed }}</td>
                </tr>
                <tr>
                  <td class="data-label">排气温度</td>
                  <td class="data-value">{{ systemData.running.generator.exhaustTemp }}</td>
                </tr>
                <tr>
                  <td class="data-label">燃气压力</td>
                  <td class="data-value">0.75 MPa</td>
                </tr>
                <tr>
                  <td class="data-label">无功功率</td>
                  <td class="data-value">{{ systemData.running.generator.reactiveTotal }}</td>
                </tr>
                <tr>
                  <td class="data-label">负载</td>
                  <td class="data-value">82%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="data-table">
            <h3 class="table-title">发电机数据</h3>
            <table>
              <tbody>
                <tr>
                  <td class="data-label">发电功率</td>
                  <td class="data-value">{{ systemData.running.generator.powerTotal }}</td>
                </tr>
                <tr>
                  <td class="data-label">输出电压</td>
                  <td class="data-value">{{ systemData.running.generator.Uab }}</td>
                </tr>
                <tr>
                  <td class="data-label">输出电流</td>
                  <td class="data-value">{{ systemData.running.generator.currentA }}</td>
                </tr>
                <tr>
                  <td class="data-label">有功功率</td>
                  <td class="data-value">{{ systemData.running.generator.powerTotal }}</td>
                </tr>
                <tr>
                  <td class="data-label">累计电量</td>
                  <td class="data-value">{{ systemData.running.generator.totalPower }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="data-table">
            <h3 class="table-title">溴化锂机组数据</h3>
            <table>
              <tbody>
                <tr>
                  <td class="data-label">冷水温度</td>
                  <td class="data-value">{{ systemData.running.lithium.coldInTemp }}</td>
                </tr>
                <tr>
                  <td class="data-label">温水温度</td>
                  <td class="data-value">{{ systemData.running.lithium.coldOutTemp }}</td>
                </tr>
                <tr>
                  <td class="data-label">蒸汽压力</td>
                  <td class="data-value">{{ systemData.running.lithium.evaporatorPress }}</td>
                </tr>
                <tr>
                  <td class="data-label">制冷量</td>
                  <td class="data-value">650.0 RT</td>
                </tr>
                <tr>
                  <td class="data-label">补水状态</td>
                  <td class="data-value">{{ systemData.running.lithium.startState }}（运行时）</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="data-table">
            <h3 class="table-title">水泵/烟气系统数据</h3>
            <table>
              <tbody>
                <tr>
                  <td class="data-label">水泵扬程</td>
                  <td class="data-value">28.0 m</td>
                </tr>
                <tr>
                  <td class="data-label">水泵流量</td>
                  <td class="data-value">150.0 m³/h</td>
                </tr>
                <tr>
                  <td class="data-label">烟气温度</td>
                  <td class="data-value">{{ systemData.running.lithium.smokeInTemp }}</td>
                </tr>
                <tr>
                  <td class="data-label">储水罐压力</td>
                  <td class="data-value">0.55 MPa</td>
                </tr>
                <tr>
                  <td class="data-label">板换进出口温差</td>
                  <td class="data-value">4.4°C</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 优化结果与建议 -->
      <div class="optimization-results">
        <h2 class="section-title">优化结果与建议</h2>
        <div class="results-content">
          <div class="result-charts">
            <div class="chart">
              <div class="chart-title">能源利用效率对比</div>
              <div class="chart-bars">
                <div class="chart-bar old" style="height: 65%">
                  <span>优化前：65%</span>
                </div>
                <div class="chart-bar new" style="height: 82.3%">
                  <span>优化后：82.3%</span>
                </div>
              </div>
            </div>
            <div class="chart">
              <div class="chart-title">系统负载分布</div>
              <div class="chart-pie">
                <div class="pie-section power" title="发电负载：45%"></div>
                <div class="pie-section cooling" title="制冷负载：30%"></div>
                <div class="pie-section heating" title="制热负载：25%"></div>
              </div>
            </div>
          </div>
          <div class="optimization-suggestions">
            <h3 class="suggestions-title">核心优化建议</h3>
            <ul class="suggestions-list">
              <li>微燃机负载保持在82%（当前82%），当前运行效率良好，可最大化发电效率，同时为溴化锂机组提供充足余热</li>
              <li>溴化锂机组蒸汽压力保持在0.69MPa（当前0.69MPa），运行稳定，可保持当前参数</li>
              <li>水泵流量设定为90%（当前90%），匹配主机需求，避免流量过剩导致能耗浪费</li>
              <li>烟气温度保持在288.8°C（当前288.8°C），满足系统需求，定期检查烟气管道</li>
              <li>每周清洗Y型过滤器1次（运行初期），每月1次常规清洗，避免水系统堵塞</li>
              <li>系统最高点自动排气阀每日检查1次，每周手动排气1次，彻底排除管道空气</li>
              <li>空调末端风盘滤网每45天清洗1次，同步对风盘手动排气，解决室温不均问题</li>
              <li>用电高峰时段（10:00-12:00、18:00-20:00）将发电优先级提至70%，余电优先自用</li>
              <li>每季度核对水泵选型参数，确保扬程/流量满足主机要求，避免长期低效率运行</li>
              <li>每年清洗板式换热器2次（夏季、冬季前），使用专用除垢剂，保证换热效率</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperationOptimization',
  data() {
    return {
      // 优化参数
      powerPriority: 60,
      coolingPriority: 25,
      heatingPriority: 15,
      gasLimit: 110,
      pumpFlow: 90,
      smokeTemp: 290,
      // 系统状态数据
      systemData: {
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
            smokeOutTemp: '152.5℃',
            coolInTemp: '25.6℃',
            coolOutTemp: '29.0℃',
            evaporatorTemp: '6.5℃',
            evaporatorPress: '0.69Mpa',
            startState: '停机'
          }
        }
      },
      // 当前系统状态
      currentSystemState: 'running',
      // 能源效率和碳排放数据
      efficiencyData: {
        utilizationRate: '82.3%',
        carbonReduction: '15.6 t/day',
        energySaving: '¥9,820/day'
      }
    }
  },
  mounted() {
    this.updateTimer = setInterval(() => this.updateRealTimeData(), 2000);
  },
  beforeUnmount() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    updateRealTimeData() {
      if (this.currentSystemState === 'running') {
        const runningData = this.systemData.running;
        const baseChangeFactor = 0.3 + Math.random() * 0.5;
        
        // 简化的数据更新逻辑
        if (Math.random() < 0.85) {
          const currentChange = (Math.random() > 0.5 ? 1 : -1) * baseChangeFactor * 3;
          const newCurrentA = Math.max(80.0, Math.min(81.5, runningData.generator.currentAValue + currentChange));
          runningData.generator.currentAValue = parseFloat(newCurrentA.toFixed(1));
          runningData.generator.currentA = `${runningData.generator.currentAValue}A`;
        }
        
        if (Math.random() < 0.85) {
          const powerChange = (Math.random() > 0.52 ? 1 : -1) * baseChangeFactor * 5;
          const newPowerTotal = Math.max(55.0, Math.min(56.5, runningData.generator.powerTotalValue + powerChange));
          runningData.generator.powerTotalValue = parseFloat(newPowerTotal.toFixed(1));
          runningData.generator.powerTotal = `${runningData.generator.powerTotalValue}kw`;
        }
        
        // 其他数据更新逻辑...
      }
    },
    runOptimization() {
      alert('优化计算已启动，将基于以下逻辑执行：\n1. 匹配当前电价时段（峰/平/谷）调整发电优先级\n2. 根据冷/热负荷需求优化溴化锂机组蒸汽压力\n3. 按水泵流量-能耗曲线设定最优流量\n4. 同步更新热水温度与储水罐运行参数');
      
      setTimeout(() => {
        this.powerPriority = 70;
        this.coolingPriority = 20;
        this.heatingPriority = 10;
        this.pumpFlow = 88;
        alert('优化计算已完成！\n效果提升：\n- 综合能源利用率从78.5%提升至82.3%\n- 燃气消耗降低4.2%（微燃机+溴化锂机组）\n- 水泵能耗降低6.5%（流量优化）\n- 烟气系统稳定性提升15%（温度+压力优化）');
      }, 2500)
    }
  }
}
</script>

<style scoped>
.optimization-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

.navbar {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(66, 133, 244, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(66, 133, 244, 0.1);
  border: 1px solid rgba(66, 133, 244, 0.3);
  border-radius: 6px;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.back-button:hover {
  background: rgba(66, 133, 244, 0.2);
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.2);
  transform: translateY(-1px);
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #4285f4;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.optimization-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 20px;
  color: #4285f4;
  margin-bottom: 15px;
  border-bottom: 2px solid rgba(66, 133, 244, 0.3);
  padding-bottom: 10px;
  font-weight: 600;
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.status-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.status-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.status-title {
  font-size: 14px;
  color: #5f6368;
  font-weight: 500;
}

.status-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.status-indicator {
  width: 10px;
  height: 10px;
  background: #34a853;
  border-radius: 50%;
  align-self: flex-end;
  box-shadow: 0 0 6px rgba(52, 168, 83, 0.4);
}

.status-change {
  font-size: 12px;
  align-self: flex-end;
  font-weight: 500;
}

.status-change.positive {
  color: #34a853;
}

.optimization-params {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.param-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.param-label {
  font-size: 14px;
  color: #5f6368;
  font-weight: 500;
}

.param-slider {
  width: 100%;
  height: 6px;
  background: rgba(66, 133, 244, 0.2);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.param-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #4285f4;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.param-value {
  font-size: 14px;
  color: #4285f4;
  align-self: flex-end;
  font-weight: 500;
}

.optimize-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4285f4 0%, #3367d6 100%);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.optimize-button:hover {
  box-shadow: 0 6px 20px rgba(66, 133, 244, 0.4);
  transform: translateY(-2px);
}

.monitoring-data {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.data-tables {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.data-table {
  background: rgba(248, 249, 250, 0.8);
  border-radius: 8px;
  padding: 15px;
  border: 1px solid rgba(66, 133, 244, 0.1);
}

.table-title {
  font-size: 16px;
  color: #4285f4;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 600;
}

table {
  width: 100%;
  border-collapse: collapse;
}

tr {
  border-bottom: 1px solid rgba(66, 133, 244, 0.1);
}

tr:last-child {
  border-bottom: none;
}

td {
  padding: 8px 0;
}

.data-label {
  color: #5f6368;
  font-size: 14px;
  font-weight: 500;
}

.data-value {
  color: #2c3e50;
  font-size: 14px;
  font-weight: bold;
  text-align: right;
}

.optimization-results {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.results-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.result-charts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart {
  background: rgba(248, 249, 250, 0.8);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid rgba(66, 133, 244, 0.1);
}

.chart-title {
  font-size: 14px;
  color: #5f6368;
  text-align: center;
  font-weight: 500;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 30px;
  height: 180px;
}

.chart-bar {
  width: 80px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #ffffff;
  font-size: 13px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.chart-bar.old {
  background: linear-gradient(135deg, #ea4335, #d23c2e);
  border: 1px solid #ea4335;
}

.chart-bar.new {
  background: linear-gradient(135deg, #34a853, #2e9447);
  border: 1px solid #34a853;
}

.chart-pie {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(
    #4285f4 0% 45%,
    #ea4335 45% 75%,
    #34a853 75% 100%
  );
  align-self: center;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-pie::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
}

.optimization-suggestions {
  background: rgba(248, 249, 250, 0.8);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(66, 133, 244, 0.1);
}

.suggestions-title {
  font-size: 16px;
  color: #4285f4;
  margin-bottom: 15px;
  font-weight: 600;
}

.suggestions-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestions-list li {
  font-size: 13px;
  color: #5f6368;
  padding-left: 20px;
  position: relative;
  line-height: 1.4;
  font-weight: 500;
}

.suggestions-list li::before {
  content: '•';
  color: #4285f4;
  position: absolute;
  left: 0;
  font-weight: bold;
  font-size: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .status-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .params-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  .data-tables {
    grid-template-columns: repeat(1, 1fr);
  }
  .results-content {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>