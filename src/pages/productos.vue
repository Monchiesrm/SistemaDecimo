<template>

  <v-container>

    <!-- TITULO -->
    <div
      class="d-flex justify-space-between align-center mb-6"
    >

      <div>

        <h1 class="text-h4 font-weight-bold">
          Productos
        </h1>

        <p class="text-grey">
          CRUD con Firebase Firestore
        </p>

      </div>

    </div>

    <!-- FORM -->
    <v-card
      rounded="xl"
      elevation="3"
      class="pa-5 mb-6"
    >

      <v-row>

        <!-- CODIGO -->
        <v-col cols="12" md="3">

          <v-text-field
            v-model="codigo"
            label="Código"
            variant="outlined"
          ></v-text-field>

        </v-col>

        <!-- DESCRIPCION -->
        <v-col cols="12" md="3">

          <v-text-field
            v-model="descripcion"
            label="Descripción"
            variant="outlined"
          ></v-text-field>

        </v-col>

        <!-- ALMACEN -->
        <v-col cols="12" md="3">

          <v-select
            v-model="almacenSeleccionado"
            :items="almacenes"
            item-title="descripcion"
            item-value="id"
            label="Almacén"
            variant="outlined"
          ></v-select>

        </v-col>

        <!-- BOTON -->
        <v-col
          cols="12"
          md="3"
          class="d-flex align-center"
        >

          <v-btn
            v-if="!editando"
            color="deep-purple"
            size="large"
            @click="guardarProducto"
          >
            Guardar
          </v-btn>

          <v-btn
            v-else
            color="orange-darken-2"
            size="large"
            @click="actualizarProducto"
          >
            Actualizar
          </v-btn>

        </v-col>

      </v-row>

    </v-card>

    <!-- TABLA -->
    <v-card
      rounded="xl"
      elevation="3"
    >

      <v-table>

        <thead>

          <tr>

            <th>Código</th>

            <th>Descripción</th>

            <th>Almacén</th>

            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          <tr
            v-for="producto in productos"
            :key="producto.id"
          >

            <td>{{ producto.codigo }}</td>

            <td>{{ producto.descripcion }}</td>

            <td>{{ producto.almacenNombre }}</td>

            <td>

              <v-btn
                icon
                color="blue"
                variant="text"
                @click="editarProducto(producto)"
              >

                <v-icon>
                  mdi-pencil
                </v-icon>

              </v-btn>

              <v-btn
                icon
                color="red"
                variant="text"
                @click="eliminarProducto(producto.id)"
              >

                <v-icon>
                  mdi-delete
                </v-icon>

              </v-btn>

            </td>

          </tr>

        </tbody>

      </v-table>

    </v-card>

  </v-container>

</template>

<script setup lang="ts">

import {
  ref,
  onMounted
} from 'vue'

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore'

import { db } from '../firebase'

const codigo = ref('')
const descripcion = ref('')

const productos = ref<any[]>([])
const almacenes = ref<any[]>([])

const almacenSeleccionado = ref('')

const editando = ref(false)
const idProducto = ref('')

/* =========================
   PRODUCTOS PENDIENTES
========================= */

const PRODUCTOS_PENDIENTES =
'productosPendientes'

/* =========================
   OBTENER PRODUCTOS
========================= */

const obtenerProductos = async () => {

  productos.value = []

  const querySnapshot =
    await getDocs(
      collection(db, 'productos')
    )

  querySnapshot.forEach((documento) => {

    productos.value.push({

      id: documento.id,

      ...documento.data()

    })

  })

}

/* =========================
   OBTENER ALMACENES
========================= */

const obtenerAlmacenes = async () => {

  almacenes.value = []

  const querySnapshot =
    await getDocs(
      collection(db, 'almacenes')
    )

  querySnapshot.forEach((documento) => {

    almacenes.value.push({

      id: documento.id,

      ...documento.data()

    })

  })

}

/* =========================
   SINCRONIZAR
========================= */

const sincronizarPendientes = async () => {

  const pendientes = JSON.parse(

    localStorage.getItem(
      PRODUCTOS_PENDIENTES
    ) || '[]'

  )

  if (pendientes.length === 0) return

  for (const producto of pendientes) {

    await addDoc(

      collection(db,'productos'),

      producto

    )

  }

  localStorage.removeItem(
    PRODUCTOS_PENDIENTES
  )

  alert(
    'Productos sincronizados correctamente'
  )

  obtenerProductos()

}
/* =========================
   GUARDAR
========================= */

const guardarProducto = async () => {

  const almacen =
    almacenes.value.find(
      a => a.id === almacenSeleccionado.value
    )

  const producto = {

    codigo: codigo.value,

    descripcion: descripcion.value,

    almacenId:
      almacenSeleccionado.value,

    almacenNombre:
      almacen?.descripcion || ''

  }

  if (!navigator.onLine) {

    const pendientes = JSON.parse(

      localStorage.getItem(
        PRODUCTOS_PENDIENTES
      ) || '[]'

    )

    pendientes.push(producto)

    localStorage.setItem(

      PRODUCTOS_PENDIENTES,

      JSON.stringify(
        pendientes
      )

    )

    alert(
      'Sin Internet. Producto guardado localmente.'
    )

    limpiarFormulario()

    return

  }

  await addDoc(

    collection(db,'productos'),

    producto

  )

  limpiarFormulario()

  obtenerProductos()

}

/* =========================
   ELIMINAR
========================= */

const eliminarProducto = async (
  id: string
) => {

  await deleteDoc(
    doc(
      db,
      'productos',
      id
    )
  )

  obtenerProductos()

}

/* =========================
   EDITAR
========================= */

const editarProducto = (
  producto: any
) => {

  editando.value = true

  idProducto.value =
    producto.id

  codigo.value =
    producto.codigo

  descripcion.value =
    producto.descripcion

  almacenSeleccionado.value =
    producto.almacenId

}

/* =========================
   ACTUALIZAR
========================= */

const actualizarProducto = async () => {

  const almacen =
    almacenes.value.find(
      a => a.id === almacenSeleccionado.value
    )

  await updateDoc(

    doc(
      db,
      'productos',
      idProducto.value
    ),

    {

      codigo: codigo.value,

      descripcion: descripcion.value,

      almacenId:
        almacenSeleccionado.value,

      almacenNombre:
        almacen?.descripcion || ''

    }

  )

  limpiarFormulario()

  obtenerProductos()

}

/* =========================
   LIMPIAR
========================= */

const limpiarFormulario = () => {

  codigo.value = ''

  descripcion.value = ''

  almacenSeleccionado.value = ''

  idProducto.value = ''

  editando.value = false

}

/* =========================
   INICIO
========================= */

onMounted(() => {

  obtenerProductos()

  obtenerAlmacenes()

  window.addEventListener(

  'online',

  () => {

    sincronizarPendientes()

  }

)

onMounted(() => {

  if (navigator.onLine) {

    sincronizarPendientes()

  }

})

})

</script>