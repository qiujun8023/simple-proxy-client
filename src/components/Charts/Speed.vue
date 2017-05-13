<template>
  <div class="speed" v-loading="loading">
    <e-charts :options="option" v-if="!loading && option"></e-charts>
  </div>
</template>

<script>
import _ from 'lodash'
import ECharts from 'vue-echarts/components/ECharts.vue'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

export default {
  props: ['data', 'loading'],

  components: {
    ECharts
  },

  data () {
    return {
      option: null
    }
  },

  created () {
    this.update()
  },

  methods: {
    update () {
      if (this.loading) {
        return false
      }

      let data = {time: [], speed: []}
      for (let item of this.data) {
        data.time.push(item.time)
        data.speed.push(_.round(item.value / 1000, 2))
      }

      this.option = {
        title: {
          text: '峰值速率',
          textStyle: {
            color: '#475669',
            fontWeight: 'normal',
            fontFamily: 'Hiragino Sans GB'
          }
        },
        grid: {
          left: '80px',
          top: '80px',
          bottom: '40px',
          right: '80px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#99A9BF'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: data.time,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} Mbps'
            },
            textStyle: {
              color: '#475669',
              fontFamily: 'Hiragino Sans GB'
            }
          }
        ],
        series: [
          {
            name: '速率',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              normal: {
                color: '#20A0FF'
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#1D8CE0'
                }, {
                  offset: 1,
                  color: '#58B7FF'
                }])
              }
            },
            data: data.speed
          }
        ]
      }
    }
  },

  watch: {
    data () {
      this.update()
    }
  }
}

</script>

<style lang="less" scoped>
.speed {
  width: 100%;
  height: 400px;
  margin-top: 20px;
  position: relative;
  .echarts {
    width: 100%;
    height: 100%;
    margin: auto;
  }
}
</style>
