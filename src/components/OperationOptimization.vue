<template>
  <div class="optimization-container">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        <span>返回仪表盘</span>
      </button>
      <h1 class="page-title">三联供系统运行优化</h1>
    </div>
    <!-- 主内容区域 -->
    <div class="optimization-content">
      <!-- 系统状态卡片（匹配文档能耗/效率指标） -->
      <div class="status-cards">
        <div class="status-card">
          <div class="status-title">系统状态</div>
          <div class="status-value">正常运行</div>
          <div class="status-indicator"></div>
        </div>
        <div class="status-card">
          <div class="status-title">当前综合能源利用率</div>
          <div class="status-value">82.3%</div>
          <div class="status-change">+3.5%</div>
        </div>
        <div class="status-card">
          <div class="status-title">碳排放减少</div>
          <div class="status-value">15.6 t/day</div>
          <div class="status-change">+2.1 t</div>
        </div>
        <div class="status-card">
          <div class="status-title">节能效益</div>
          <div class="status-value">¥9,820/day</div>
          <div class="status-change">+¥1,680</div>
        </div>
      </div>
      <!-- 优化参数设置（匹配文档核心调控项） -->
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
            <label class="param-label">热水设定温度</label>
            <input type="range" min="40" max="60" v-model="hotWaterTemp" class="param-slider">
            <span class="param-value">{{ hotWaterTemp }}°C</span>
          </div>
        </div>
        <button class="optimize-button" @click="runOptimization">
          <span class="button-icon">✨</span>
          <span>运行优化</span>
        </button>
      </div>
      <!-- 实时监测数据（匹配文档3D工艺流程参数） -->
      <div class="monitoring-data">
        <h2 class="section-title">实时监测数据</h2>
        <div class="data-tables">
          <div class="data-table">
            <h3 class="table-title">微燃机数据</h3>
            <table>
              <tr>
                <td class="data-label">转速</td>
                <td class="data-value">12,500 rpm</td>
              </tr>
              <tr>
                <td class="data-label">排气温度</td>
                <td class="data-value">580°C</td>
              </tr>
              <tr>
                <td class="data-label">燃气压力</td>
                <td class="data-value">0.92 MPa</td>
              </tr>
              <tr>
                <td class="data-label">无功功率</td>
                <td class="data-value">12 kvar</td>
              </tr>
              <tr>
                <td class="data-label">负载</td>
                <td class="data-value">85%</td>
              </tr>
            </table>
          </div>
          <div class="data-table">
            <h3 class="table-title">发电机数据</h3>
            <table>
              <tr>
                <td class="data-label">发电功率</td>
                <td class="data-value">1,250 kW</td>
              </tr>
              <tr>
                <td class="data-label">输出电压</td>
                <td class="data-value">6,300 V</td>
              </tr>
              <tr>
                <td class="data-label">输出电流</td>
                <td class="data-value">115 A</td>
              </tr>
              <tr>
                <td class="data-label">有功功率</td>
                <td class="data-value">1,220 kW</td>
              </tr>
              <tr>
                <td class="data-label">累计电量</td>
                <td class="data-value">1,850 Kwh</td>
              </tr>
            </table>
          </div>
          <div class="data-table">
            <h3 class="table-title">溴化锂机组数据</h3>
            <table>
              <tr>
                <td class="data-label">冷水温度</td>
                <td class="data-value">7.2°C</td>
              </tr>
              <tr>
                <td class="data-label">温水温度</td>
                <td class="data-value">14.8°C</td>
              </tr>
              <tr>
                <td class="data-label">蒸汽压力</td>
                <td class="data-value">0.75 MPa</td>
              </tr>
              <tr>
                <td class="data-label">制冷量</td>
                <td class="data-value">850 RT</td>
              </tr>
              <tr>
                <td class="data-label">补水状态</td>
                <td class="data-value">开阀（稳定）</td>
              </tr>
            </table>
          </div>
          <div class="data-table">
            <h3 class="table-title">水泵/热水系统数据</h3>
            <table>
              <tr>
                <td class="data-label">水泵扬程</td>
                <td class="data-value">32 m</td>
              </tr>
              <tr>
                <td class="data-label">水泵流量</td>
                <td class="data-value">180 m³/h</td>
              </tr>
              <tr>
                <td class="data-label">热水温度</td>
                <td class="data-value">52°C</td>
              </tr>
              <tr>
                <td class="data-label">储水罐压力</td>
                <td class="data-value">0.45 MPa</td>
              </tr>
              <tr>
                <td class="data-label">板换进出口温差</td>
                <td class="data-value">8°C</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <!-- 优化结果与建议（完整覆盖文档优化措施） -->
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
              <li>微燃机负载调整至85%（当前85%），可最大化发电效率，同时为溴化锂机组提供充足余热</li>
              <li>溴化锂机组蒸汽压力降至0.75MPa（原0.8MPa），减少燃气消耗，同时保证制冷量稳定</li>
              <li>水泵流量设定为90%（当前90%），匹配主机需求，避免流量过剩导致能耗浪费</li>
              <li>热水温度设定52°C（原48°C），满足使用需求且避免过度耗能，储水罐每月除垢1次</li>
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
      // 优化参数（匹配文档调控需求）
      powerPriority: 60,
      coolingPriority: 25,
      heatingPriority: 15,
      gasLimit: 110,
      pumpFlow: 90,
      hotWaterTemp: 52
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    // 运行优化（模拟文档优化逻辑）
    runOptimization() {
      alert('优化计算已启动，将基于以下逻辑执行：\n1. 匹配当前电价时段（峰/平/谷）调整发电优先级\n2. 根据冷/热负荷需求优化溴化锂机组蒸汽压力\n3. 按水泵流量-能耗曲线设定最优流量\n4. 同步更新热水温度与储水罐运行参数');
      
      // 模拟优化完成，更新参数与提示
      setTimeout(() => {
        this.powerPriority = 70;
        this.coolingPriority = 20;
        this.heatingPriority = 10;
        this.pumpFlow = 88;
        alert('优化计算已完成！\n效果提升：\n- 综合能源利用率从78.5%提升至82.3%\n- 燃气消耗降低4.2%（微燃机+溴化锂机组）\n- 水泵能耗降低6.5%（流量优化）\n- 热水供应稳定性提升15%（温度+压力优化）');
      }, 2500)
    }
  }
}
</script>
<style scoped>
.optimization-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0a1929 0%, #172a3f 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.navbar {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  background: rgba(10, 40, 60, 0.8);
  border-bottom: 1px solid rgba(0, 191, 255, 0.3);
}
.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 191, 255, 0.1);
  border: 1px solid rgba(0, 191, 255, 0.3);
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}
.back-button:hover {
  background: rgba(0, 191, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
}
.page-title {
  flex: 1;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #00bfff;
  margin: 0;
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
  color: #00bfff;
  margin-bottom: 15px;
  border-bottom: 2px solid rgba(0, 191, 255, 0.3);
  padding-bottom: 10px;
}
.status-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.status-card {
  background: rgba(10, 40, 60, 0.7);
  border: 1px solid rgba(0, 191, 255, 0.3);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.status-title {
  font-size: 14px;
  color: #b0c4de;
}
.status-value {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}
.status-indicator {
  width: 10px;
  height: 10px;
  background: #00ff00;
  border-radius: 50%;
  align-self: flex-end;
}
.status-change {
  font-size: 12px;
  color: #00ff00;
  align-self: flex-end;
}
.optimization-params {
  background: rgba(10, 40, 60, 0.7);
  border: 1px solid rgba(0, 191, 255, 0.3);
  border-radius: 10px;
  padding: 20px;
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
  color: #b0c4de;
}
.param-slider {
  width: 100%;
  height: 6px;
  background: rgba(0, 191, 255, 0.2);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}
.param-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #00bfff;
  border-radius: 50%;
  cursor: pointer;
}
.param-value {
  font-size: 14px;
  color: #00bfff;
  align-self: flex-end;
}
.optimize-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #00bfff 0%, #0088cc 100%);
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
}
.optimize-button:hover {
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.6);
  transform: translateY(-2px);
}
.monitoring-data {
  background: rgba(10, 40, 60, 0.7);
  border: 1px solid rgba(0, 191, 255, 0.3);
  border-radius: 10px;
  padding: 20px;
}
.data-tables {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.data-table {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
}
.table-title {
  font-size: 16px;
  color: #00bfff;
  margin-bottom: 15px;
  text-align: center;
}
table {
  width: 100%;
  border-collapse: collapse;
}
tr {
  border-bottom: 1px solid rgba(0, 191, 255, 0.2);
}
tr:last-child {
  border-bottom: none;
}
td {
  padding: 8px 0;
}
.data-label {
  color: #b0c4de;
  font-size: 14px;
}
.data-value {
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  text-align: right;
}
.optimization-results {
  background: rgba(10, 40, 60, 0.7);
  border: 1px solid rgba(0, 191, 255, 0.3);
  border-radius: 10px;
  padding: 20px;
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
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.chart-title {
  font-size: 14px;
  color: #b0c4de;
  text-align: center;
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
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #ffffff;
  font-size: 13px;
  text-align: center;
}
.chart-bar.old {
  background: rgba(255, 0, 0, 0.3);
  border: 1px solid rgba(255, 0, 0, 0.5);
}
.chart-bar.new {
  background: rgba(0, 255, 0, 0.3);
  border: 1px solid rgba(0, 255, 0, 0.5);
}
.chart-pie {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(
    #00bfff 0% 45%,
    #ff6b6b 45% 75%,
    #4ecdc4 75% 100%
  );
  align-self: center;
  position: relative;
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
  background: rgba(0, 0, 0, 0.3);
}
.pie-section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.pie-section.power {
  clip-path: polygon(50% 50%, 100% 0, 100% 50%);
  background: #00bfff;
}
.pie-section.cooling {
  clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
  background: #ff6b6b;
}
.pie-section.heating {
  clip-path: polygon(50% 50%, 50% 100%, 0 100%, 0 50%, 50% 50%);
  background: #4ecdc4;
}
.optimization-suggestions {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 20px;
}
.suggestions-title {
  font-size: 16px;
  color: #00bfff;
  margin-bottom: 15px;
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
  color: #b0c4de;
  padding-left: 20px;
  position: relative;
  line-height: 1.4;
}
.suggestions-list li::before {
  content: '•';
  color: #00bfff;
  position: absolute;
  left: 0;
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