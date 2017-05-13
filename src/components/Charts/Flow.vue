<template>
  <div class="flow" v-loading="loading">
    <e-charts :options="option" v-if="!loading && option"></e-charts>
  </div>
</template>

<script>
import _ from 'lodash'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
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
      console.log(this.data)

      let data = {time: [], flow: [], request: []}
      for (let item of this.data) {
        data.time.push(item.time)
        data.flow.push(_.round(item.flow / 1048576, 2))
        data.request.push(item.request)
      }

      this.option = {
        title: {
          text: '流量与请求',
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
        legend: {
          data: ['流量', '请求量'],
          textStyle: {
            color: '#475669',
            fontFamily: 'Hiragino Sans GB'
          }
        },
        xAxis: [
          {
            type: 'category',
            data: data.time,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '流量',
            axisLabel: {
              formatter: '{value} MB'
            },
            textStyle: {
              color: '#475669',
              fontFamily: 'Hiragino Sans GB'
            }
          },
          {
            type: 'value',
            name: '请求量',
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value} 次'
            },
            textStyle: {
              color: '#475669',
              fontFamily: 'Hiragino Sans GB'
            }
          }
        ],
        series: [
          {
            name: '流量',
            type: 'bar',
            itemStyle: {
              normal: {
                color: 'rgba(32, 160, 255, 0.8)'
              }
            },
            data: data.flow
          },
          {
            name: '请求量',
            type: 'bar',
            itemStyle: {
              normal: {
                color: 'rgba(19, 206, 102, 0.8)'
              }
            },
            yAxisIndex: 1,
            data: data.request
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
.flow {
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
