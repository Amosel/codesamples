import firebase from 'react-native-firebase'

// export const auth = firebase.auth()

const Firestore = firebase.firestore

const { serverTimestamp } = firebase.firestore.FieldValue

export const firestore = Firestore()
const settings = { timestampsInSnapshots: true }
firestore.settings(settings)

export const storage = firebase.storage()

export const StorageNative = firebase.storage.Native
export const now = serverTimestamp // () => Timestamp.now().serialize()
export const timestampToDate = (firestoreTimestamp: Date) => firestoreTimestamp.getTime()