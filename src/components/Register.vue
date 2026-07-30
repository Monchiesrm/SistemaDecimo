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
          mdi-account-plus
        </v-icon>

        <h1 class="text-h4 font-weight-bold text-grey-darken-4">
          Registro
        </h1>

        <p class="text-grey-darken-1 mt-2">
          Crea una cuenta para continuar
        </p>

      </div>

      <v-form @submit.prevent="register">

        <!-- CORREO -->
        <v-text-field
          v-model="userName"
          label="Correo electrónico"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          color="grey-darken-3"
          rounded="lg"
          class="mb-3"
          required
        ></v-text-field>

        <!-- PASSWORD -->
        <v-text-field
          v-model="password"
          label="Contraseña"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          color="grey-darken-3"
          rounded="lg"
          class="mb-3"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
          required
        ></v-text-field>

        <!-- CONFIRMAR PASSWORD -->
        <v-text-field
          v-model="confirmPassword"
          label="Confirmar contraseña"
          prepend-inner-icon="mdi-shield-lock-outline"
          variant="outlined"
          color="grey-darken-3"
          rounded="lg"
          :type="showConfirmPassword ? 'text' : 'password'"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          required
        ></v-text-field>

        <!-- ALERTA -->
        <v-alert
          v-if="errorMessage"
          :type="success ? 'success' : 'error'"
          variant="tonal"
          density="comfortable"
          rounded="lg"
          class="mt-4"
        >
          {{ errorMessage }}
        </v-alert>

        <!-- BOTON -->
        <v-btn
          type="submit"
          block
          size="large"
          class="mt-5"
          color="grey-darken-4"
          rounded="lg"
          :loading="loading"
        >
          Crear cuenta
        </v-btn>

      </v-form>

    </v-card>

  </v-container>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase.js'

const router = useRouter()

const loading = ref(false)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const errorMessage = ref('')
const success = ref(false)

const userName = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = async () => {

  errorMessage.value = ''
  success.value = false

  if (
    userName.value === '' ||
    password.value === '' ||
    confirmPassword.value === ''
  ) {
    errorMessage.value = 'Completa todos los campos'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true

  try {

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        userName.value,
        password.value
      )

    console.log(userCredential.user)

    success.value = true
    errorMessage.value = 'Usuario registrado correctamente'

    setTimeout(() => {
      router.push('/')
    }, 1500)

  } catch (error: any) {

    console.log(error)

    success.value = false

    switch (error.code) {

      case 'auth/invalid-email':
        errorMessage.value = 'Correo inválido'
        break

      case 'auth/email-already-in-use':
        errorMessage.value = 'El correo ya está registrado'
        break

      case 'auth/weak-password':
        errorMessage.value =
          'La contraseña debe tener al menos 6 caracteres'
        break

      default:
        errorMessage.value = 'Ocurrió un error'
        break
    }

  } finally {

    loading.value = false
  }
}

</script>