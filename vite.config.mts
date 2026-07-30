import VueRouter from 'unplugin-vue-router/vite'

import {
fileURLToPath,
URL
}
from 'node:url'

import Vue from '@vitejs/plugin-vue'

import Fonts from 'unplugin-fonts/vite'

import {
defineConfig
}
from 'vite'

import Vuetify, {
transformAssetUrls
}
from 'vite-plugin-vuetify'

import {
VitePWA
}
from 'vite-plugin-pwa'

export default defineConfig({

plugins: [

VueRouter(),

Vue({

template: {

transformAssetUrls

}

}),

Vuetify({

autoImport: true,

styles: {

configFile:
'src/styles/settings.scss'

}

}),

Fonts({

fontsource: {

families: [

{

name:
'Roboto',

weights:
[100,300,400,500,700,900],

styles:
['normal','italic']

}

]

}

}),

/* PWA */

VitePWA({

registerType:
'autoUpdate',

injectRegister:
'auto',

includeAssets: [

'favicon.ico',

'pwa-192x192.png',

'pwa-512x512.png'

],

manifest: {

name:
'Sistema de Décimo',

short_name:
'Sistema',

description:
'CRUD Firebase + Vue + Vuetify',

theme_color:
'#212121',

background_color:
'#ffffff',

display:
'standalone',

orientation:
'portrait',

start_url:
'/',

icons: [

{

src:
'pwa-192x192.png',

sizes:
'192x192',

type:
'image/png'

},

{

src:
'pwa-512x512.png',

sizes:
'512x512',

type:
'image/png'

}

]

},

workbox: {

  skipWaiting: true,

  clientsClaim: true,

  cleanupOutdatedCaches: true,

  navigateFallback: 'index.html',

  globPatterns: [

    '**/*.{html,js,css,ico,png,jpg,jpeg,svg,woff,woff2,json}'

  ],

  runtimeCaching: [

    {

      urlPattern: ({ request }) =>

        request.destination === 'document',

      handler: 'NetworkFirst',

      options: {

        cacheName: 'pages-cache'

      }

    },

    {

      urlPattern: ({ request }) =>

        request.destination === 'script' ||

        request.destination === 'style' ||

        request.destination === 'image' ||

        request.destination === 'font',

      handler: 'CacheFirst',

      options: {

        cacheName: 'assets-cache'

      }

    }

  ]

},

devOptions: {

enabled: false

}

})

],

define: {

'process.env': {}

},

resolve: {

alias: {

'@':
fileURLToPath(
new URL(
'src',
import.meta.url
)
)

},

extensions: [

'.js',
'.json',
'.jsx',
'.mjs',
'.ts',
'.tsx',
'.vue'

]

},

server: {

port:
3000

}

})