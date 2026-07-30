import { initializeApp } from 'firebase/app'

import {
getAuth
}
from 'firebase/auth'

import {
getFirestore
}
from 'firebase/firestore'

const firebaseConfig = {

apiKey:
'AIzaSyBd3VHvch64TTD22fReGrj3jNFYYLHYCjk',

authDomain:
'android-85529.firebaseapp.com',

projectId:
'android-85529',

storageBucket:
'android-85529.firebasestorage.app',

messagingSenderId:
'231694834430',

appId:
'1:231694834430:web:b09665fac64faef46963af'

}

const app =
initializeApp(
firebaseConfig
)

export const auth =
getAuth(app)

export const db =
getFirestore(app)

export {
app
}