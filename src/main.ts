import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './style.css'
declare global {
    interface Window {
        selectedElement : HTMLElement | null
    }
}
const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')