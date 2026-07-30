<template>
  <v-container>

    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          Almacenes
        </h1>

        <p class="text-grey">
          Administración de almacenes
        </p>
      </div>
    </div>

    <!-- FORMULARIO -->
    <v-card
      class="pa-5 mb-6"
      rounded="xl"
      elevation="3"
    >
      <v-row>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="codigo"
            label="Código"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="descripcion"
            label="Descripción"
            variant="outlined"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
          class="d-flex align-center"
        >

          <v-btn
            v-if="!editando"
            color="success"
            @click="guardarAlmacen"
          >
            Guardar
          </v-btn>

          <v-btn
            v-else
            color="warning"
            @click="actualizarAlmacen"
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
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          <tr
            v-for="almacen in almacenes"
            :key="almacen.id"
          >
            <td>{{ almacen.codigo }}</td>

            <td>{{ almacen.descripcion }}</td>

            <td>

              <v-btn
                icon
                color="blue"
                variant="text"
                @click="editarAlmacen(almacen)"
              >
                <v-icon>
                  mdi-pencil
                </v-icon>
              </v-btn>

              <v-btn
                icon
                color="red"
                variant="text"
                @click="eliminarAlmacen(almacen.id)"
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

import { ref, onMounted } from 'vue'

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore'

import { db } from '../firebase'

const codigo = ref('')
const descripcion = ref('')

const almacenes = ref<any[]>([])

const editando = ref(false)

const idAlmacen = ref('')

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

const guardarAlmacen = async () => {

  if (
    codigo.value === '' ||
    descripcion.value === ''
  ) return

  await addDoc(
    collection(db, 'almacenes'),
    {
      codigo: codigo.value,
      descripcion: descripcion.value
    }
  )

  limpiarFormulario()

  obtenerAlmacenes()

}

const editarAlmacen = (almacen: any) => {

  editando.value = true

  idAlmacen.value = almacen.id

  codigo.value = almacen.codigo

  descripcion.value =
    almacen.descripcion

}

const actualizarAlmacen = async () => {

  await updateDoc(
    doc(
      db,
      'almacenes',
      idAlmacen.value
    ),
    {
      codigo: codigo.value,
      descripcion: descripcion.value
    }
  )

  limpiarFormulario()

  obtenerAlmacenes()

}

const eliminarAlmacen = async (
  id: string
) => {

  if (
    !confirm(
      '¿Deseas eliminar este almacén?'
    )
  ) return

  await deleteDoc(
    doc(
      db,
      'almacenes',
      id
    )
  )

  obtenerAlmacenes()

}

const limpiarFormulario = () => {

  codigo.value = ''

  descripcion.value = ''

  idAlmacen.value = ''

  editando.value = false

}

onMounted(() => {

  obtenerAlmacenes()

})

</script>