import {

getMessaging,

getToken,

onMessage

}

from 'firebase/messaging'

import {

app

}

from './firebase'

const messaging =
getMessaging(app)

const VAPID_KEY =

'BDnrG9cByv2nhT9cqjqF7LVQCKkvUiNBDwImd3urRj1QXcmlaqec93MFcFUOcZfzC_v2u9qPbBo_QkKfplsz3-k'

/* ==================
ACTIVAR
================== */

export const activarNotificaciones =
async()=>{

try{

const permiso =

await Notification
.requestPermission()

if(
permiso !==
'granted'
){

alert(
'Permiso denegado'
)

return

}

const registration =

await navigator
.serviceWorker
.register(

'/firebase-messaging-sw.js'

)

await navigator
.serviceWorker
.ready

const token =

await getToken(

messaging,

{

vapidKey:
VAPID_KEY,

serviceWorkerRegistration:
registration

}

)

console.log(
'FCM TOKEN:'
)

console.log(
token
)

localStorage.setItem(
'fcmToken',
token
)

alert(
'Push activado'
)

}

catch(error){

console.log(
'ERROR FCM:',
error
)

}

}

/* ==================
RECIBIR
================== */

export const escucharNotificaciones =
()=>{

onMessage(

messaging,

(payload)=>{

console.log(
'MENSAJE:',
payload
)

new Notification(

payload.notification?.title
||

'Notificación',

{

body:
payload.notification?.body

}

)

}

)

}



