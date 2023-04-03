import { createApp, toRaw } from 'vue'
import { createPinia, Store } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './style.css'
import localForage from "localforage";
import { deepUnref } from 'vue-deepunref';
declare global {
    interface Window {
        selectedElement : HTMLElement | null
    }
}
localForage.config({
    driver: localForage.INDEXEDDB, // This force IndexedDB as the driver
})

async function indexDbPlugin({ store }: { store: Store }) {
    const stored = await localForage.getItem('nlu-state')
    if (stored) {
        stored.controlPanel.freeze = false
        store.$patch(stored)
    }
    store.$subscribe(() => {
        localForage
            .setItem('nlu-state',deepUnref(store.$state)) // Destructure to transform to plain object
    })
}

const pinia = createPinia()
const app = createApp(App)
pinia.use(indexDbPlugin)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')