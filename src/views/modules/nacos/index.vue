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

      <el-tabs>
        <el-tab-pane
          v-for="nacosData in nacosDatas.nameSpaces"
          :key="nacosData.namespaceShowName"
          :label="nacosData.namespaceShowName"
          :name="nacosData.namespaceShowName"
        >
          <el-tabs tab-position="left" style="height: 100%;">
            <el-tab-pane
              v-for="config in nacosData.configs"
              :key="config.id"
              :label="config.dataId"
            >
<!--              {{ config.content }}-->
              <div>
                <codemirror ref="codeDiv" v-model="config.content" :options="codeConfig" />
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

    return {
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
  // 计算属性
  computed: {
    // 在这里定义计算属性
  },
  // 观察者
  watch: {
    // 在这里定义观察者
  },
  // 生命周期钩子
  beforeCreate() {
    // 在组件创建之前执行的代码
  },
  created() {
    // 在组件创建后执行的代码
  },
  beforeMount() {
    // 在组件挂载之前执行的代码
  },
  mounted() {
    // 在组件挂载后执行的代码
    // console.info('🚀', '代码快', this.$refs.codeDiv.codemirror, ' ~file:index method:mounted line:117 -----')
    // this.$refs.codeDiv.codemirror.setSize('auto', 600)
  },
  beforeUpdate() {
    // 在组件更新之前执行的代码
  },
  updated() {
    // 在组件更新后执行的代码
  },
  beforeDestroy() {
    // 在组件销毁之前执行的代码
  },
  destroyed() {
    // 在组件销毁后执行的代码
  },
  activated() {
    // 在组件激活时执行的代码
  },
  deactivated() {
    // 在组件停用时执行的代码
  },
  // 方法
  methods: {
    // 在这里定义方法
    getNacosData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.nacosDatas = []

          getData(this.form.url).then(res => {
            this.nacosDatas = res.data
            console.info('🚀', 'nacos爬虫', res, ' ~file:index method: line:108 -----')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.CodeMirror {
  height: 1000px !important;
}
</style>
