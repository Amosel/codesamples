import { Alert } from 'react-native'
import { createModel } from '@rematch/core'
import { Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  isEqual,
  pick,
  concat,
  update,
  reject,
  pipe,
  difference,
} from 'lodash/fp'
import {
  FileUploadTaskRequest,
  FileReference,
  StorageState,
  LoadedFile,
} from '../../types'
import {
  getStorageRef,
  pathForStoragageRef,
  pathExists,
  moveFile,
  deleteFile,
  uploadFile,
  downloadFile,
} from '../../helpers'

const initialStorageState: StorageState = {
  downloading: [],
  deleting: [],
  uploading: [],
  cancelled: [],
  loaded: {},
}

const arrayIncludes = <T>(items: T[]) => (item: T) =>
  items.some((value, index, array) => array.includes(value))

export const storage = createModel({
  state: initialStorageState,
  selectors: {
    cancelled: () => (state: StorageState) => state.cancelled,
  },
  reducers: {
    cancelRefs(state: StorageState, refs: string[]) {
      if (refs.length === 0) return
      const cancelled = difference(refs, state.cancelled)
      if (cancelled.length > 0) {
        return update('cancelled', concat(cancelled), state)
      }
      return state
    },
    addToDownloading(state: StorageState, refs: string[]) {
      if (refs.length === 0) return
      const downloading = difference(refs, state.downloading)
      if (downloading.length > 0) {
        return update('downloading', concat(downloading), state)
      }
      return state
    },
    addToUploading(state: StorageState, refs: string[]) {
      if (refs.length === 0) return
      const uploading = difference(refs, state.uploading)
      if (uploading.length > 0) {
        return update('uploading', concat(uploading), state)
      }
      return state
    },
    addToDeleting(state: StorageState, refs: string[]) {
      if (refs.length === 0) return
      const deleting = difference(refs, state.deleting)
      if (deleting.length > 0) {
        return update('deleting', concat(deleting), state)
      }
      return state
    },
    didLoad(state: StorageState, { ref, path }: LoadedFile) {
      if (state.cancelled.includes(ref)) {
        return
      }
      if (!Object.keys(state.loaded).includes(ref)) {
        return {
          ...state,
          uploading: reject(isEqual(ref), state.uploading),
          downloading: reject(isEqual(ref), state.downloading),
          loaded: {
            ...state.loaded,
            [ref]: path,
          },
        }
      }
      return state
    },
    removeRefs(state: StorageState, refs: string[]) {
      const loaded = difference(Object.keys(state.loaded), refs)
      const cancelled = difference(refs, state.cancelled)
      const downloading = difference(refs, state.downloading)
      const uploading = difference(refs, state.uploading)
      if (
        loaded.length > 0 ||
        cancelled.length > 0 ||
        downloading.length > 0 ||
        uploading.length > 0
      ) {
        return pipe(
          update('loaded', pick(loaded)),
          update('cancelled', reject(arrayIncludes(refs))),
          update('downloading', reject(arrayIncludes(refs))),
          update('uploading', reject(arrayIncludes(refs))),
        )(state)
      }
      return state
    },
  },
  effects: {
    async delete(fileReference: FileReference, rootState) {
      let error
      let snap

      const ref = getStorageRef(fileReference)

      if (rootState.storage.deleting.includes(ref)) {
        console.log(`already deleting ref: ${ref}`)
        return
      }
      if (Object.keys(rootState.storage.loaded).includes(ref)) {
        console.log(`already loaded ref: ${ref}`)
        return
      }
      try {
        this.addToDeleting(ref)
        await deleteFile(fileReference)
        this.removeRefs([ref])
      } catch (error) {
        console.log(`failed downloading image ${ref}`)
      } finally {
        if (error) {
          throw error
        }
        return snap
      }
    },
    async download(ref: string, rootState) {
      let error
      let snap
      try {
        const path = pathForStoragageRef(ref)
        if (rootState.storage.downloading.includes(ref)) {
          console.log(`already downloading ref: ${ref}`)
          return
        }
        if (Object.keys(rootState.storage.loaded).includes(ref)) {
          console.log(`already loaded ref: ${ref}`)
          return
        }
        this.addToDownloading([ref])
        const exists = await pathExists(path)
        if (!exists) {
          await downloadFile(ref, path)
          console.log(`downloaded image ${ref}`)
        }
        this.didLoad({ ref, path })
      } catch (error) {
        this.removeRefs([ref])
        console.log(`failed downloading image ${ref}`, error)
      } finally {
        if (error) {
          throw error
        }
        return snap
      }
    },
    async uploadMany(requests: FileUploadTaskRequest[], rootState) {
      return Promise.all(requests.map(request => this.upload(request)))
    },
    async upload(request: FileUploadTaskRequest, rootState) {
      let error
      let snap
      const ref = getStorageRef(request.fileReference)
      const path = pathForStoragageRef(ref)
      if (rootState.storage.uploading.includes(ref)) {
        console.log(`already uploading ref: ${ref}`)
        return
      }
      if (Object.keys(rootState.storage.loaded).includes(ref)) {
        console.log(`already loaded ref: ${ref}`)
        return
      }

      try {
        this.addToUploading([ref])
        const {
          file: { uri },
          fileReference,
        } = request
        const [snapshot] = await uploadFile(fileReference, uri)
        console.log(`moving file: ${request.file.uri} to ${path}`)
        await moveFile(uri, path)
        Image.prefetch(path)
        this.didLoad({
          ref,
          path,
        })
        snap = snapshot
      } catch (e) {
        this.removeRefs([ref])
        error = e
      } finally {
        if (error) {
          throw error
        }
        return snap
      }
    },
  },
})
