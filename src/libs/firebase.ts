import { getApps, getApp, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const config = {
  apiKey: 'AIzaSyBTKbSbs-rQlXM2uyJ2qDxSlOimASDHD_M',
  authDomain: 'review-stacks.firebaseapp.com',
  projectId: 'review-stacks',
  storageBucket: 'review-stacks.appspot.com',
  messagingSenderId: '677164053044',
  appId: '1:677164053044:web:9e8fd1dc69f7a7a9245061',
}

const app = getApps().length ? getApp() : initializeApp(config)
const auth = getAuth(app)
const firestore = getFirestore(app)

export { app, auth, firestore }
