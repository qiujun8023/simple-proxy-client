<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="代理名称" prop="mark">
      <el-input v-model="form.mark" placeholder="反向代理名称，便于识别与区分"></el-input>
    </el-form-item>
    <el-form-item label="访问域名" prop="domain">
      <el-input v-model="form.domain" placeholder="用作反向代理的域名，如：example.com"></el-input>
    </el-form-item>
    <el-form-item label="回源地址" required>
      <el-col :span="8">
        <el-form-item prop="target_type">
          <el-select v-model="form.target_type" placeholder="回源协议" @change="setDefaultTargetPort">
            <el-option label="http://" value="HTTP"></el-option>
            <el-option label="https://" value="HTTPS"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item prop="target_domain">
          <el-input placeholder="IP 或域名" v-model="form.target_domain"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item prop="target_port">
          <el-input type="number" placeholder="端口" v-model="form.target_port"></el-input>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="回源 Host" prop="hostname">
      <el-input v-model="form.hostname" placeholder="HTTP Header 中的 Host，默认为请求域名"></el-input>
    </el-form-item>
    <el-form-item label="HTTPS 证书" v-show="config.https_port">
      <el-input
        type="textarea"
        v-model="form.ssl.cert"
        :placeholder="form.ssl.uploaded? '已上传证书，如需更换请输入新证书' : '请填写证书，可选'">
      </el-input>
    </el-form-item>
    <el-form-item label="HTTPS 密钥" v-show="config.https_port">
      <el-input
        type="textarea"
        v-model="form.ssl.key"
        :placeholder="form.ssl.uploaded? '已上传密钥，如需更换请输入新密钥' : '请填写密钥，可选'">
      </el-input>
    </el-form-item>
    <el-form-item label="请求方式" prop="proxy_type" v-show="config.https_port">
      <el-radio-group v-model="form.proxy_type">
        <el-radio label="HTTP_ONLY">仅 HTTP</el-radio>
        <el-radio label="HTTPS_ONLY">仅 HTTPS</el-radio>
        <el-radio label="BOTH">HTTP 或 HTTPS</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否启用" prop="is_enabled">
      <el-switch on-text="开" off-text="关" v-model="form.is_enabled"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="is_submit" @click="onSubmit">
        {{this.proxy_id ? '提交更新' : '立即创建'}}
      </el-button>
      <router-link :to="{name: 'proxies', query: $route.query}" v-show="!is_submit">
        <el-button>取消</el-button>
      </router-link>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'
import { isDomain, isIP, isPort } from '../../lib/utils'
import Api from '../../api'

export default {
  data () {
    let self = this

    let checkDomain = function (rule, value, callback) {
      let err = new Error('请输入有效的域名')
      isDomain(value) ? callback() : callback(err)
    }

    let checkTargetDomain = function (rule, value, callback) {
      let err = new Error('请输入有效的 IP 或域名')
      isDomain(value) || isIP(value) ? callback() : callback(err)
    }

    let checkHostname = function (rule, value, callback) {
      let err = new Error('请输入有效的 IP 或域名')
      !value || isDomain(value) || isIP(value) ? callback() : callback(err)
    }

    let checkPort = function (rule, value, callback) {
      let err = new Error('请输入有效的端口')
      isPort(value) ? callback() : callback(err)
    }

    let checkProxyType = function (rule, value, callback) {
      let ssl = self.form.ssl
      if (['HTTPS_ONLY', 'BOTH'].indexOf(value) !== -1) {
        if (!ssl.uploaded && (!ssl.cert || !ssl.key)) {
          callback(new Error('请先填写证书与密钥'))
        }
      }
      callback()
    }

    return {
      form: {
        mark: '',
        domain: '',
        target_type: 'HTTP',
        target_domain: '',
        target_port: '80',
        hostname: '',
        ssl: {
          uploaded: false,
          cert: '',
          key: ''
        },
        proxy_type: 'HTTP_ONLY',
        is_enabled: true
      },
      rules: {
        mark: [
          { required: true, message: '请输入代理名称', trigger: 'change' }
        ],
        domain: [
          { required: true, message: '请输入访问域名', trigger: 'change' },
          { validator: checkDomain, trigger: 'change' }
        ],
        target_type: [
          { required: true, message: '请选择回源协议', trigger: 'change' }
        ],
        target_domain: [
          { required: true, message: '请输入回源地址', trigger: 'change' },
          { validator: checkTargetDomain, trigger: 'change' }
        ],
        target_port: [
          { required: true, message: '请输入回源端口', trigger: 'change' },
          { validator: checkPort, trigger: 'change' }
        ],
        hostname: [
          { validator: checkHostname, trigger: 'change' }
        ],
        proxy_type: [
          { required: true, message: '请选择代理方式', trigger: 'change' },
          { validator: checkProxyType, trigger: 'change' }
        ],
        is_enabled: [
          { type: 'boolean', required: true, message: '请选择是否启用', trigger: 'change' }
        ]
      },
      is_loading: false,
      is_submit: false,
      proxy: {}
    }
  },

  computed: {
    proxy_id () {
      return this.$route.params.proxy_id
    },
    ...mapState(['config', 'profile'])
  },

  created () {
    this.fetchProxy(this.proxy_id)
  },

  methods: {
    fetchProxy (proxy_id) {
      if (!proxy_id) {
        return false
      }

      this.is_loading = true
      Api(`/api/proxies/${proxy_id}`).then((res) => {
        let tmp = res.data.target.split(':', 2)
        let default_port = res.data.target_type === 'HTTP' ? '80' : '443'
        res.data.target_domain = tmp[0]
        res.data.target_port = tmp[1] || default_port
        res.data.ssl.cert = res.data.ssl.key = ''
        if (!this.config.https_port) {
          res.data.proxy_type = 'HTTP_ONLY'
        }
        this.form = res.data
        this.is_loading = false
      }).catch(() => {
        this.is_loading = false
      })
    },

    setDefaultTargetPort (val) {
      if (val === 'HTTP' && this.form.target_port === '443') {
        this.form.target_port = '80'
      } else if (val === 'HTTPS' && this.form.target_port === '80') {
        this.form.target_port = '443'
      }
    },

    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false
        }

        this.is_submit = true
        let method = 'POST'
        let url = '/api/proxies'
        let body = Object.assign({}, this.form)
        if (body.target_type === 'HTTP' && body.target_port === '80') {
          body.target = body.target_domain
        } else if (body.target_type === 'HTTPS' && body.target_port === '443') {
          body.target = body.target_domain
        } else {
          body.target = body.target_domain + ':' + body.target_port
        }
        body.hostname = body.hostname || body.domain
        body.user_id = this.$route.query.user_id
        if (this.proxy_id) {
          method = 'PUT'
          url = '/api/proxies/' + this.proxy_id
        }

        Api(url, {method, body}).then((res) => {
          this.is_submit = false
          this.$router.push({name: 'proxies', query: this.$route.query})
        }).catch(() => {
          this.is_submit = false
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 100%;
}
.el-col {
  padding: 0 5px;
}
.el-col:first-child {
  padding-left: 0;
}
.el-col:last-child {
  padding-right: 0;
}
</style>
