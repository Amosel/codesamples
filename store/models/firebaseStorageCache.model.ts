import { Image } from 'react-native'
import { createModel, RematchDispatch } from '@rematch/core'
import { FirebaseImageCacheState } from '../../types'
import { storage } from '../../firebase'
import { iRootState } from '../store'
import {
  isLoading,
  setLoading,
  isLoaded,
  removeLoading,
  setLoaded,
  removeLoaded,
  pathForStoragageRef,
  pathExists,
} from '../../helpers'

const initialState: FirebaseImageCacheState = { loading: [], loaded: [] }

export const firebaseStorageCache = createModel({
  state: initialState,
  effects: dispatch => ({
    async getImageFromStorage(storageRef: string, state: iRootState) {

      const path = pathForStoragageRef(storageRef)

      if (isLoaded(storageRef, state.firebaseStorageCache)) {
        return
      }
      dispatch.firebaseStorageCache.setLoading(storageRef)

      try {
        const exists = await pathExists(path)
        if (exists) {
          dispatch.firebaseStorageCache.setLoaded({ storageRef, path })
          console.log(`image ${storageRef} already cached`)
        } else {
          await storage.ref(storageRef).downloadFile(path)
          console.log(`downloaded image ${storageRef}`)
          dispatch.firebaseStorageCache.setLoaded({ storageRef, path })
        }
        Image.prefetch(path)
      } catch (error) {
        dispatch.firebaseStorageCache.remove(storageRef)
        console.log(`failed downloading image ${storageRef}`)
      }
    },
  }),
  reducers: {
    setLoading(state: FirebaseImageCacheState, payload: string) {
      if (isLoading(payload, state)) {
        return state
      }
      return setLoading(payload, state)
    },
    remove: (
      state: FirebaseImageCacheState,
      payload: string,
    ): FirebaseImageCacheState => {
      if (isLoaded(payload, state)) {
        return removeLoaded(payload, state)
      } else if (isLoading(payload, state)) {
        return removeLoading(payload, state)
      }
      return state
    },
    setLoaded: (
      state: FirebaseImageCacheState,
      { storageRef }: { storageRef: string },
    ): FirebaseImageCacheState => {
      if (isLoaded(storageRef, state) && !isLoading(storageRef, state)) {
        return state
      }
      return setLoaded(storageRef, state)
    },
  },
})
