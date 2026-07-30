<template>

<v-app>

  <!-- DRAWER -->
  <v-navigation-drawer
    v-model="drawer"
    color="grey-darken-4"
    elevation="8"
    permanent
  >

    <div class="pa-5 text-center">

      <v-avatar
        size="80"
        class="mb-3"
      >

        <v-img
          src="../assets/Marco.jpeg"
        />

      </v-avatar>

      <h2
        class="text-h6 font-weight-bold text-white"
      >
        Moncho
      </h2>

      <p
        class="text-caption text-grey-lighten-1"
      >
        Administrador
      </p>

    </div>

    <v-divider />

    <v-list
      nav
      class="mt-2"
    >

      <v-list-item
        prepend-icon="mdi-package-variant"
        title="Productos"
        rounded="xl"
        class="mx-2"
        color="deep-purple"
        to="/productos"
        link
      />

      <v-list-item
        prepend-icon="mdi-warehouse"
        title="Almacenes"
        rounded="xl"
        class="mx-2"
        color="deep-purple"
        to="/almacenes"
        link
      />

    </v-list>

    <template #append>

      <div class="pa-4">

        <v-btn
          block
          color="red-darken-2"
          prepend-icon="mdi-logout"
          rounded="xl"
          @click="logout"
        >

          Cerrar sesión

        </v-btn>

      </div>

    </template>

  </v-navigation-drawer>

  <!-- HEADER -->

  <v-app-bar
    elevation="2"
    color="white"
  >

    <v-app-bar-nav-icon
      @click="drawer=!drawer"
    />

    <v-toolbar-title>

      Sistema de Décimo xd

    </v-toolbar-title>

  </v-app-bar>

  <!-- CONTENIDO -->

  <v-main
    class="bg-grey-lighten-4"
  >

    <v-container
      class="pa-6"
    >

      <h1 class="text-h4 mb-3">

        Bienvenido 👋

      </h1>

      <p>

        Panel principal del sistema

      </p>

      <v-card
        class="pa-5 mt-5"
        rounded="xl"
      >

        <div
          class="d-flex justify-space-between align-center"
        >

          <div>

            <h2>

              Firebase Cloud Messaging

            </h2>

            <p>

              Estado:

              <strong>

                {{ permiso ? 'Activo' : 'Pendiente' }}

              </strong>

            </p>

          </div>

          <v-btn
            color="green"
            @click="activarNotificaciones"
          >

            Activar

          </v-btn>

        </div>

      </v-card>

    </v-container>

  </v-main>

</v-app>

</template>

<script setup lang="ts">

import {

ref,
onMounted

}

from 'vue'

import {

useRouter

}

from 'vue-router'

import {

signOut

}

from 'firebase/auth'

import {

getMessaging,
getToken,
onMessage

}

from 'firebase/messaging'

import {

auth,
app

}

from '../firebase'

const drawer = ref(true)

const permiso = ref(false)

const router = useRouter()

const messaging = getMessaging(app)
/* ==========================
LOGOUT
========================== */

const logout = async () => {

  try {

    await signOut(auth)

    router.push('/login')

  }

  catch (error) {

    console.log(error)

  }

}

/* ==========================
DETECTAR INTERNET
========================== */

let estadoAnterior = true

const revisarConexion = async () => {

  try {

    // Petición a un recurso externo para evitar caché del SW
    await fetch('https://www.gstatic.com/generate_204?' + Date.now(), {
      cache: 'no-store',
      mode: 'no-cors'
    })

    if (!estadoAnterior) {

      estadoAnterior = true

      alert('✅ Conexión a Internet recuperada')

    }

  }

  catch {

    if (estadoAnterior) {

      estadoAnterior = false

      alert('⚠ Se perdió la conexión a Internet')

    }

  }

}

/* ==========================
PUSH
========================== */

const activarNotificaciones = async () => {

  try {

    const estado =
      await Notification.requestPermission()

    if (estado !== 'granted') {

      alert('Permiso denegado')

      return

    }

    permiso.value = true

    const registration =
      await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      )

    await navigator.serviceWorker.ready

    console.log(
      'SW listo',
      registration
    )

    const token =
      await getToken(
        messaging,
        {
          vapidKey:
            'BDnrG9cByv2nhT9cqjqF7LVQCKkvUiNBDwImd3urRj1QXcmlaqec93MFcFUOcZfzC_v2u9qPbBo_QkKfplsz3-k',
          serviceWorkerRegistration:
            registration
        }
      )

    console.log(
      'TOKEN:',
      token
    )

    if (token) {

      localStorage.setItem(
        'pushToken',
        token
      )

    }

    alert(
      'Notificaciones activadas'
    )

  }

  catch (error) {

    console.log(
      'ERROR PUSH:',
      error
    )

  }

}

/* ==========================
MOUNT
========================== */

onMounted(() => {

  // Revisar la conexión cada segundo
  setInterval(() => {

    revisarConexion()

  }, 1000)

  onMessage(

    messaging,

    (payload) => {

      console.log(
        'NOTIFICACION:',
        payload
      )

      new Notification(

        payload.notification?.title ||
        'Mensaje',

        {

          body:
            payload.notification?.body

        }

      )

    }

  )

})
</script>