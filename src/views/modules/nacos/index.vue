<template>
  <div>
    <el-main>
      <!-- 这里是组件的主要内容 -->
      <el-form ref="form" :model="form" :inline="true" :rules="formRules" label-width="80px">
        <el-form-item label="地址" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getNacosData">查询</el-button>
        </el-form-item>
      </el-form>

      <el-tabs v-model="tabsType" v-loading="nacosDataLoading" @tab-click="paneChange">
        <el-tab-pane
          v-for="nacosData in nacosDatas.nameSpaces"
          :key="nacosData.namespaceShowName"
          :label="nacosData.namespaceShowName"
          :name="nacosData.namespaceShowName"
        >
          <el-tabs v-model="tabsVal" tab-position="left">
            <el-tab-pane
              v-for="config in nacosData.configs"
              :key="config.id"
              :label="config.dataId"
              :name="config.id"
            >
              <div class="codeDiv">
                <codemirror v-if="tabsVal == config.id" ref="codeDiv" v-model="config.content" :options="codeConfig" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </div>
</template>

<script>
import { getData } from '@/api/tool/nacos'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

// 表单验证
const validateDomainOrIP = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入域名或IP地址'))
  }

  // 正则表达式：匹配域名
  const domainPattern = /^(https?:\/\/)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,6}$/i
  // 正则表达式：匹配IP地址
  const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\d{1,5})?$/

  if (domainPattern.test(value) || ipPattern.test(value)) {
    callback() // 验证通过
  } else {
    callback(new Error('请输入有效的域名或IP地址')) // 验证失败
  }
}

// 导出默认组件
export default {
  // 组件名称
  name: 'Nacos',
  // 注册子组件
  components: {
    // 在这里添加子组件
    codemirror
  },
  // 组件的props属性
  props: [],
  // 组件的数据
  data() {
    return {
      nacosDataLoading: false,
      tabsType: '',
      tabsVal: '', // 默认展示数据'
      // 在这里定义数据属性
      form: {
        url: '101.32.128.51:8848'
      },
      formRules: {
        url: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { validator: validateDomainOrIP, trigger: 'blur' }
        ]
      },
      nacosDatas: [],
      codeConfig: {
        disabled: false,
        indentWithTab: true,
        tabSize: 2,
        autofocus: true,
        height: 'auto',
        language: 'javascript',
        theme: 'oneDark'
      }
    }
  },
  // 方法
  methods: {
    // 第一个tabs的change事件
    paneChange(tab, event) {
      for (let i = 0, arr = this.nacosDatas.nameSpaces; i < arr.length; i++) {
        if (this.tabsType == arr[i].namespaceShowName) {
          this.tabsVal = arr[i].configs[0].id
        }
      }
    },
    // 在这里定义方法
    getNacosData() {
      this.nacosDataLoading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.nacosDatas = []
          getData(this.form.url).then(res => {
            this.nacosDatas = res.data
            this.tabsType = this.nacosDatas.nameSpaces[0].namespaceShowName
            this.tabsVal = this.nacosDatas.nameSpaces[0].configs[0].id
            this.nacosDataLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.codeDiv {
  .CodeMirror {
    /* Set height, width, borders, and global font properties here */
    font-family: monospace;
    height: calc(100vh - 240px) !important;
    color: black;
    direction: ltr;
  }
}

</style>

