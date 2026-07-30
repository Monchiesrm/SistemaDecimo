import { ref, onMounted, onUnmounted } from 'vue'

export function useNetwork() {

  const online = ref(navigator.onLine)

  const revisar = () => {

    if (navigator.onLine !== online.value) {

      online.value = navigator.onLine

      if (online.value) {

        alert('✅ Conexión a Internet recuperada')

      } else {

        alert('⚠ Se perdió la conexión a Internet')

      }

    }

  }

  let intervalo:number

  onMounted(() => {

    intervalo = window.setInterval(revisar,500)

  })

  onUnmounted(() => {

    clearInterval(intervalo)

  })

  return {

    online

  }

}