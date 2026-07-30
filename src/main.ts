/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// COMPOSABLES
import { createApp } from 'vue'

// PLUGINS
import { registerPlugins } from '@/plugins'

// COMPONENTS
import App from './App.vue'

// STYLES
import 'unfonts.css'

// PWA
import { registerSW } from 'virtual:pwa-register'

// REGISTRAR SERVICE WORKER
registerSW({

immediate:false,

onRegistered(r){

console.log("SW registrado",r)

},

onOfflineReady(){

console.log("Offline listo")

}

})

const app = createApp(App)

registerPlugins(app)

app.mount('#app')