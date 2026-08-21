import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './styles/tokens.css'

// 展示名（§10 / §16 决策 13）：VITE_APP_NAME 可配置，默认"是啊吃什么"
document.title = import.meta.env.VITE_APP_NAME || '是啊吃什么'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
// 注：Element Plus 内置组件（如日期选择器按钮）文案暂固定中文，未随语言切换联动，
// 仅应用自身文案（导航/登录/注册等）跟随语言切换。
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')
