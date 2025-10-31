<template>
  <div class="diagnosis-container">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        <span>返回仪表盘</span>
      </button>
      <h1 class="page-title">冷热电联供综合能源系统数字孪生运维管控平台</h1>
    </div>
    <!-- 主内容区域 -->
    <div class="diagnosis-content">
      <!-- 诊断状态卡片 -->
      <div class="diagnosis-status">
        <div class="status-card">
          <div class="status-title">系统状态</div>
          <div class="status-value" :class="systemStatus === '正常' ? 'normal' : 'abnormal'">
            {{ systemStatus }}
          </div>
          <div class="status-indicator" :class="systemStatus === '正常' ? 'normal' : 'abnormal'"></div>
        </div>
        <div class="status-card">
          <div class="status-title">活跃告警</div>
          <div class="status-value">{{ activeAlarms }} 个</div>
          <div class="status-change">{{ alarmTrend }}</div>
        </div>
        <div class="status-card">
          <div class="status-title">平均无故障时间</div>
          <div class="status-value">{{ mtbf }} 小时</div>
          <div class="status-change">+{{ mtbfChange }}%</div>
        </div>
        <div class="status-card">
          <div class="status-title">最近诊断时间</div>
          <div class="status-value">{{ lastDiagnosis }}</div>
          <div class="status-indicator update"></div>
        </div>
      </div>
      <!-- 设备概览图 -->
      <div class="equipment-overview">
        <h2 class="section-title">设备状态概览</h2>
        <div class="equipment-diagram">
          <div class="equipment-node" :class="microTurbine.status">
            <div class="node-icon">⚙️</div>
            <div class="node-name">微燃机</div>
            <div class="node-status">{{ microTurbine.statusText }}</div>
          </div>
          <div class="equipment-arrow">→</div>
          <div class="equipment-node" :class="generator.status">
            <div class="node-icon">⚡</div>
            <div class="node-name">发电机</div>
            <div class="node-status">{{ generator.statusText }}</div>
          </div>
          <div class="equipment-arrow">→</div>
          <div class="equipment-node" :class="lithiumBromide.status">
            <div class="node-icon">❄️</div>
            <div class="node-name">溴化锂机组</div>
            <div class="node-status">{{ lithiumBromide.statusText }}</div>
          </div>
          <div class="equipment-arrow">→</div>
          <div class="equipment-node" :class="coolingTower.status">
            <div class="node-icon">💧</div>
            <div class="node-name">冷却塔</div>
            <div class="node-status">{{ coolingTower.statusText }}</div>
          </div>
          <div class="equipment-arrow">→</div>
          <div class="equipment-node" :class="waterPump.status">
            <div class="node-icon">🔄</div>
            <div class="node-name">水泵</div>
            <div class="node-status">{{ waterPump.statusText }}</div>
          </div>
          <div class="equipment-arrow">→</div>
          <div class="equipment-node" :class="airConditioner.status">
            <div class="node-icon">🏠</div>
            <div class="node-name">空调末端</div>
            <div class="node-status">{{ airConditioner.statusText }}</div>
          </div>
        </div>
      </div>
      <!-- 故障列表 -->
      <div class="fault-list">
        <h2 class="section-title">故障列表</h2>
        <div class="fault-table">
          <div class="table-header">
            <div class="header-cell">设备</div>
            <div class="header-cell">故障类型</div>
            <div class="header-cell">严重程度</div>
            <div class="header-cell">发生时间</div>
            <div class="header-cell">处理状态</div>
            <div class="header-cell">操作</div>
          </div>
          <div v-for="fault in faultData" :key="fault.id" class="table-row">
            <div class="table-cell">{{ fault.equipment }}</div>
            <div class="table-cell">{{ fault.type }}</div>
            <div class="table-cell"><span :class="'severity ' + fault.severity">{{ fault.severityText }}</span></div>
            <div class="table-cell">{{ fault.time }}</div>
            <div class="table-cell"><span :class="'status ' + fault.status">{{ fault.statusText }}</span></div>
            <div class="table-cell">
              <button class="detail-button" @click="viewFaultDetail(fault)">详情</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 诊断报告 -->
      <div class="diagnosis-report">
        <h2 class="section-title">诊断报告</h2>
        <div class="report-content">
          <div class="report-chart">
            <div class="chart-title">故障分布</div>
            <div class="chart-bars">
              <div class="chart-bar micro-turbine" style="height: 35%">
                <span>微燃机</span>
              </div>
              <div class="chart-bar lithium" style="height: 55%">
                <span>溴化锂机组</span>
              </div>
              <div class="chart-bar water-pump" style="height: 70%">
                <span>水泵/管道</span>
              </div>
              <div class="chart-bar air-conditioner" style="height: 40%">
                <span>空调末端</span>
              </div>
            </div>
          </div>
          <div class="maintenance-suggestions">
            <h3 class="suggestions-title">核心维护建议</h3>
            <ul class="suggestions-list">
              <li>每月清洗Y型过滤器（运行初期需加强频次），避免水系统堵塞</li>
              <li>系统最高点安装自动排气阀，每周手动辅助排气1次，排除管道空气</li>
              <li>每季度核对水泵参数，确保扬程/流量满足主机要求，避免流量不足</li>
              <li>每2个月清洗风机盘管回风滤网，同步对风盘手动排气</li>
              <li>每年对储水罐除垢+清洗生活热水侧板换，确保热水供应稳定</li>
              <li>主机安装基础每半年检查平整度，必要时补充减震垫，降低噪音振动</li>
              <li>高低压故障报警后，优先清洗换热器并排查冷媒泄漏，避免频繁停机</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FaultDiagnosis',
  data() {
    return {
      systemStatus: '正常',
      activeAlarms: 8,
      alarmTrend: '-2',
      mtbf: 2980,
      mtbfChange: 3.8,
      lastDiagnosis: '2025-09-16 09:45',
      
      // 设备状态
      microTurbine: {
        status: 'warning',
        statusText: '过滤器堵塞'
      },
      generator: {
        status: 'normal',
        statusText: '正常'
      },
      lithiumBromide: {
        status: 'warning',
        statusText: '溶液浓度异常'
      },
      coolingTower: {
        status: 'normal',
        statusText: '正常'
      },
      waterPump: {
        status: 'error',
        statusText: '扬程不足'
      },
      airConditioner: {
        status: 'warning',
        statusText: '滤网脏堵'
      },
      
      // 故障数据
      faultData: [
        {
          id: 1,
          equipment: '水泵/管道',
          type: '效果差、能耗高（水系统问题）',
          severity: 'medium',
          severityText: '中等',
          time: '2025-07-16 08:45',
          status: 'processing',
          statusText: '处理中',
          solution: {
            reason: '水过滤器堵塞、系统管道内有空气、水泵扬程/流量不足、阀门未全开/损坏、水质差导致板换结垢',
            measure: '1.每月清洗Y型过滤器（运行初期加强）；2.系统最高点装自动排气阀+定期手动排气；3.核对水泵选型确保满足流量扬程；4.检查阀门确保球阀全开；5.用软化水+每月投缓蚀阻垢剂，每年清洗板换'
          }
        },
        {
          id: 2,
          equipment: '溴化锂机组',
          type: '效果差、主机频繁启停（氟系统问题）',
          severity: 'medium',
          severityText: '中等',
          time: '2025-07-16 07:30',
          status: 'processing',
          statusText: '处理中',
          solution: {
            reason: '冷媒泄漏/充注量不当、电子膨胀阀卡滞/故障、室外机换热器脏堵（制热时）',
            measure: '1.用卤素检漏仪/肥皂水查漏，按要求定量补冷媒；2.检查电子膨胀阀线圈+阀体，故障则更换；3.定期清洗室外机翅片，保持通风'
          }
        },
        {
          id: 3,
          equipment: '空调末端',
          type: '室温不均、个别区域不冷/不热（风系统问题）',
          severity: 'low',
          severityText: '轻微',
          time: '2025-07-15 16:45',
          status: 'processing',
          statusText: '处理中',
          solution: {
            reason: '风盘滤网脏堵、风盘内有空气、二通/三通阀未开/故障、水力不平衡',
            measure: '1.每1-2个月清洗风盘回风滤网；2.为每个风盘手动排气；3.检查电动阀是否得电动作；4.调试系统水力平衡，调节支路平衡阀确保流量均匀'
          }
        },
        {
          id: 4,
          equipment: '储水罐/板换',
          type: '热水不热、等待时间长',
          severity: 'medium',
          severityText: '中等',
          time: '2025-07-15 14:20',
          status: 'pending',
          statusText: '待处理',
          solution: {
            reason: '储水罐容量不足/结垢、板换结垢/堵塞、水温设定低、主机热水模式未启动/功率不足',
            measure: '1.按人口选储水罐，每年除垢清洗；2.清洗生活热水侧板换；3.设定水温50-55℃；4.检查主机模式，确保优先满足热水需求'
          }
        },
        {
          id: 5,
          equipment: '热水回路',
          type: '热水供应不稳定、忽冷忽热',
          severity: 'low',
          severityText: '轻微',
          time: '2025-07-15 11:10',
          status: 'pending',
          statusText: '待处理',
          solution: {
            reason: '系统混入冷水、水泵/三通阀动作异常、储水罐内盘管破裂',
            measure: '1.检查热水回路上止回阀是否失效；2.检查热水循环泵/三通阀运行逻辑，确保稳定切换；3.压力测试储水罐盘管，破裂则更换'
          }
        },
        {
          id: 6,
          equipment: '主机',
          type: '噪音大、振动大',
          severity: 'medium',
          severityText: '中等',
          time: '2025-07-14 19:50',
          status: 'resolved',
          statusText: '已解决',
          solution: {
            reason: '安装基础不平稳、水泵气蚀/轴承损坏、压缩机液击/磨损、水系统有空气',
            measure: '1.确保主机安装在坚固平整基础上，加减震垫；2.检查水泵确保进口压力足够，故障则更换；3.检查冷媒量确保回气过热度正常，避免液击；4.彻底排除系统空气'
          }
        },
        {
          id: 7,
          equipment: '压缩机',
          type: '频繁报高压/低压故障',
          severity: 'high',
          severityText: '严重',
          time: '2025-07-14 15:30',
          status: 'resolved',
          statusText: '已解决',
          solution: {
            reason: '高压：换热器脏堵、冷却水流量不足、有空气；低压：冷媒泄漏、过滤器堵塞、环境温度过低',
            measure: '1.高压：清洗换热器、检查水泵阀门、排气；2.低压：查漏补漏、更换干燥过滤器、低温环境下调整运行参数'
          }
        },
        {
          id: 8,
          equipment: '整机',
          type: '完全不启动、无任何反应',
          severity: 'high',
          severityText: '严重',
          time: '2025-07-14 10:05',
          status: 'resolved',
          statusText: '已解决',
          solution: {
            reason: '电源问题（跳闸/插头未插/电压异常/缺相）、控制器/线路问题（断电/设置错误/断路短路/保险丝熔断）',
            measure: '1.自查：检查总开关/插头/空开；2.专业检查：测供电电压、查控制线路通断、检查保险丝'
          }
        }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    viewFaultDetail(fault) {
      alert(`
        【故障详情】
        设备：${fault.equipment}
        故障类型：${fault.type}
        严重程度：${fault.severityText}
        发生时间：${fault.time}
        处理状态：${fault.statusText}
        \n【可能原因】
        ${fault.solution.reason}
        \n【优化措施】
        ${fault.solution.measure}
      `)
    }
  }
}
</script>

<style scoped>
.diagnosis-container {
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

.diagnosis-content {
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

.diagnosis-status {
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

.status-value.normal {
  color: #34a853;
}

.status-value.abnormal {
  color: #ea4335;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  align-self: flex-end;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}

.status-indicator.normal {
  background: #34a853;
}

.status-indicator.abnormal {
  background: #ea4335;
}

.status-indicator.update {
  background: #4285f4;
}

.status-change {
  font-size: 12px;
  align-self: flex-end;
  font-weight: 500;
  color: #34a853;
}

.equipment-overview {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.equipment-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.equipment-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(66, 133, 244, 0.3);
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.equipment-node:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.equipment-node.normal {
  border-color: #34a853;
  background: rgba(52, 168, 83, 0.1);
}

.equipment-node.warning {
  border-color: #fbbc05;
  background: rgba(251, 188, 5, 0.1);
}

.equipment-node.error {
  border-color: #ea4335;
  background: rgba(234, 67, 53, 0.1);
}

.node-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.node-name {
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
}

.node-status {
  font-size: 12px;
  color: #5f6368;
  font-weight: 500;
}

.equipment-arrow {
  font-size: 20px;
  color: #4285f4;
  font-weight: bold;
}

.fault-list {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.fault-table {
  background: rgba(248, 249, 250, 0.8);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(66, 133, 244, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1.8fr 1fr 1.2fr 1fr 0.8fr;
  background: rgba(66, 133, 244, 0.1);
  padding: 15px;
  font-weight: bold;
  color: #4285f4;
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1.8fr 1fr 1.2fr 1fr 0.8fr;
  border-bottom: 1px solid rgba(66, 133, 244, 0.1);
  transition: background 0.3s ease;
}

.table-row:hover {
  background: rgba(66, 133, 244, 0.05);
}

.table-cell {
  padding: 12px;
  color: #5f6368;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.severity {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  border: 1px solid;
}

.severity.low {
  background: rgba(52, 168, 83, 0.1);
  color: #34a853;
  border-color: #34a853;
}

.severity.medium {
  background: rgba(251, 188, 5, 0.1);
  color: #fbbc05;
  border-color: #fbbc05;
}

.severity.high {
  background: rgba(234, 67, 53, 0.1);
  color: #ea4335;
  border-color: #ea4335;
}

.status {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  border: 1px solid;
}

.status.pending {
  background: rgba(251, 188, 5, 0.1);
  color: #fbbc05;
  border-color: #fbbc05;
}

.status.processing {
  background: rgba(66, 133, 244, 0.1);
  color: #4285f4;
  border-color: #4285f4;
}

.status.resolved {
  background: rgba(52, 168, 83, 0.1);
  color: #34a853;
  border-color: #34a853;
}

.detail-button {
  padding: 6px 12px;
  background: rgba(66, 133, 244, 0.1);
  border: 1px solid rgba(66, 133, 244, 0.3);
  border-radius: 4px;
  color: #4285f4;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  font-weight: 500;
}

.detail-button:hover {
  background: rgba(66, 133, 244, 0.2);
  box-shadow: 0 2px 6px rgba(66, 133, 244, 0.2);
  transform: translateY(-1px);
}

.diagnosis-report {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.report-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.report-chart {
  background: rgba(248, 249, 250, 0.8);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid rgba(66, 133, 244, 0.1);
}

.chart-title {
  font-size: 16px;
  color: #4285f4;
  text-align: center;
  font-weight: 600;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  gap: 15px;
}

.chart-bar {
  flex: 1;
  border-radius: 6px 6px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 10px;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.chart-bar:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.chart-bar.micro-turbine {
  border-color: #fbbc05;
  background: linear-gradient(135deg, rgba(251, 188, 5, 0.2), rgba(251, 188, 5, 0.3));
}

.chart-bar.lithium {
  border-color: #ea4335;
  background: linear-gradient(135deg, rgba(234, 67, 53, 0.2), rgba(234, 67, 53, 0.3));
}

.chart-bar.water-pump {
  border-color: #ea4335;
  background: linear-gradient(135deg, rgba(234, 67, 53, 0.3), rgba(234, 67, 53, 0.4));
}

.chart-bar.air-conditioner {
  border-color: #fbbc05;
  background: linear-gradient(135deg, rgba(251, 188, 5, 0.3), rgba(251, 188, 5, 0.4));
}

.chart-bar span {
  font-size: 12px;
  color: #2c3e50;
  font-weight: bold;
}

.maintenance-suggestions {
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
  .diagnosis-status {
    grid-template-columns: repeat(2, 1fr);
  }
  .equipment-diagram {
    flex-direction: column;
  }
  .equipment-arrow {
    transform: rotate(90deg);
  }
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
  }
  .report-content {
    grid-template-columns: 1fr;
  }
}
</style>