import { FirebaseReducer, FirestoreReducer, FirestoreQueryOptions } from 'react-redux-firebase'
import { UploadTaskSnapshot } from 'react-native-firebase/storage'
import { FieldValue } from 'react-native-firebase/firestore'
export { Image } from 'react-native-image-crop-picker'
export { iRootState, Dispatch, Store } from '../store/store'
export { FirestoreQueryOptions } from 'react-redux-firebase'

export interface State {
  firebase: FirebaseReducer.Reducer
  firestore: FirestoreReducer.Reducer
}

export interface User {
  uid: string
  email: string
  firstName: string
  lastName: string
  displayName?: string,
  phoneNumber?: string,
  profileImageFilename: string,
  createdAt: Date
  updatedAt: Date
  avatar?: {
    url: string
  }
}

export type PeachInfo = {
  id: string,
  title: string
  subtitle: string
  deckFiles: string[]
}

export interface Like {
  peachId: string
  uid: string
  createdAt: Date
  peachInfo: PeachInfo
}

export type FirestorePeach = {
  title: string
  subtitle: string
  peachDeckSize: number
  files: string[],
  createdByUid: string
  teamUids: [string]
  likes: number
  createdAt: FieldValue
  updatedAt: FieldValue
}

export type FirestoreLike = {
  peachId: string,
  uid: string,
  createdAt: FieldValue
}

export interface Peach {
  id: string
  title: string
  subtitle: string
  peachDeckSize: number
  files: string[]
  createdAt: Date
  updatedAt: Date
  createdByUid: string
  teamUids: [string]
  likes: number
}

export type File = {
  uri: string
  type: string
  fileName: string
  fileSize: number
}
export type LocalFile = {
  uri: string
  fileName: string
  fileSize?: number
  type?: UTI
}

export type FilePreview = {
  ref: string
  type: string
}

export type FileReference = {
  collection: FirestoreCollection
  doc: string
  fileName: string
  contentType?: UTI
  createdByUid?: string,
}

export type StoredFile = FileReference & {
  createdAt: Date,
  fileSize: number
  ref: string
}

export type LoadedFile = {
  ref: string
  path: string,
}

export type FileUploadTaskRequest = {
  file: LocalFile
  fileReference: FileReference,
}

export type FileUploadTaskResult = {
  request: FileUploadTaskRequest
  snapshot: UploadTaskSnapshot
}

export type FirestoreCollection = 'peaches' | 'users' | 'likes'

export type FirestoreUpdate = {
  docPath: string | FirestoreQueryOptions,
  data: Object
}

export type TabBarStackType = 'Peaches' | 'Discover' | 'Settings'

export type SwipeDirection = 'Left' | 'Right'

export type Position = {
  x: number
  y: number
  width: number
  height: number
}

export type StorageState = { 
  uploading: string[],
  downloading: string[],
  deleting: string[], 
  loaded: { [key: string]: string },
  cancelled: string[],
}
export type PreloadState = string[]


export type FirebaseImageCacheState = {
  loading: string[]
  loaded: string[]
}

export type QueryOptions =  & {
  storeAs: string
}


export type UTI =
  | 'public.content'
  | 'public.image'
  | 'public.plain-text'
  | 'public.audio'
  | 'public.video'
  | 'com.adobe.pdf'
  /* android */
  | '*/*'
  | 'image/*'
  | 'text/plain'
  | 'audio/*'
  | 'video/*'
  | 'application/pdf'
