<template>

<v-container
fluid
class="fill-height d-flex justify-center align-center bg-grey-lighten-3"
>

<v-card
width="420"
elevation="12"
rounded="xl"
class="pa-8"
>

<!-- TITULO -->

<div class="text-center mb-6">

<v-icon
size="55"
color="grey-darken-3"
class="mb-2"
>
mdi-account-circle
</v-icon>

<h1
class="text-h4 font-weight-bold"
>
Bienvenido
</h1>

<p class="text-grey">
Inicia sesión para continuar
</p>

<!-- SIN INTERNET -->

<v-alert
v-if="sinInternet"
type="error"
variant="tonal"
class="mt-4"
>

Sin conexión a Internet.<br>
No es posible conectarse al servidor.

</v-alert>

</div>

<v-form
@submit.prevent="login"
>

<!-- CORREO -->

<v-text-field
v-model="userName"
label="Correo electrónico"
prepend-inner-icon="mdi-email-outline"
variant="outlined"
rounded="lg"
class="mb-3"
required
/>

<!-- PASSWORD -->

<v-text-field
v-model="password"
label="Contraseña"
variant="outlined"
rounded="lg"
prepend-inner-icon="mdi-lock"
:type="showPassword ? 'text' : 'password'"
:append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
@click:append-inner="showPassword = !showPassword"
required
/>

<!-- MENSAJE -->

<v-alert
v-if="message"
:type="success ? 'success' : 'error'"
variant="tonal"
class="mt-4"
>

{{ message }}

</v-alert>

<!-- BOTON -->

<v-btn
block
type="submit"
color="grey-darken-4"
class="mt-5"
size="large"
:loading="loading"
:disabled="sinInternet"
>

Ingresar

</v-btn>

</v-form>

</v-card>

</v-container>

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

signInWithEmailAndPassword

}

from 'firebase/auth'

import {

auth

}

from '../firebase'

import SecureStorage from 'secure-web-storage'

import CryptoJS from 'crypto-js'

const SECRET_KEY =
'mi_clave_secreta'

const router =
useRouter()

const userName =
ref('')

const password =
ref('')

const loading =
ref(false)

const message =
ref('')

const success =
ref(false)

const showPassword =
ref(false)

const sinInternet =
ref(false)

const secureStorage =
new SecureStorage(

localStorage,

{

hash:
(key:string)=>

CryptoJS
.SHA256(
key+SECRET_KEY
)
.toString(),

encrypt:
(data:string)=>

CryptoJS
.AES
.encrypt(
data,
SECRET_KEY
)
.toString(),

decrypt:
(data:string)=>

CryptoJS
.AES
.decrypt(
data,
SECRET_KEY
)
.toString(
CryptoJS.enc.Utf8
)

}

)

/* ======================
RECUPERAR CORREO
====================== */

onMounted(()=>{

const correoNormal=

localStorage.getItem(
'ultimoCorreo'
)

const correoSeguro=

secureStorage.getItem(
'ultimoCorreoSeguro'
)

console.log(
'Normal:',
correoNormal
)

console.log(
'Cifrado:',
correoSeguro
)

if(correoSeguro){

userName.value=
correoSeguro

}

password.value=''

const revisarConexion = async()=>{

try{

await fetch(

'https://www.gstatic.com/generate_204?'+Date.now(),

{

cache:'no-store',

mode:'no-cors'

}

)

sinInternet.value=false

}

catch{

sinInternet.value=true

}

}

revisarConexion()

setInterval(

revisarConexion,

3000

)

})

/* ======================
LOGIN
====================== */

const login =
async () => {

  if (sinInternet.value) {

    success.value = false

    message.value =
      'No hay conexión a Internet. No es posible conectarse al servidor.'

    return

  }

  loading.value = true

  message.value = ''

  try {

    const userCredential =

      await signInWithEmailAndPassword(

        auth,

        userName.value,

        password.value

      )

    console.log(
      userCredential
    )

    /* GUARDAR NORMAL */

    localStorage.setItem(

      'ultimoCorreo',

      userName.value

    )

    /* GUARDAR CIFRADO */

    secureStorage.setItem(

      'ultimoCorreoSeguro',

      userName.value

    )

    success.value = true

    message.value =
      'Login correcto'

    password.value = ''

    setTimeout(() => {

      router.push('/home')

    }, 1000)

  }

  catch (error: any) {

    console.log(error)

    success.value = false

    if (!navigator.onLine) {

      message.value =
        'No hay conexión a Internet. No es posible conectarse al servidor.'

    }

    else {

      message.value =
        'Correo o contraseña incorrectos'

    }

  }

  finally {

    loading.value = false

  }

}

</script>