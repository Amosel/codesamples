import { has, concat, pipe, update, reject, isEqual } from 'lodash/fp'
import { FirebaseImageCacheState } from '../types'

export function isLoading(storageRef: string, state: FirebaseImageCacheState) {
  return state.loading.includes(storageRef)
}
export function setLoading(storageRef: string, state: FirebaseImageCacheState) {
  return update('loading', concat(storageRef), state)
}

export function removeLoading(
  storageRef: string,
  state: FirebaseImageCacheState,
) {
  return update('loading', reject(isEqual(storageRef)), state)
}

export function isLoaded(storageRef: string, state: FirebaseImageCacheState) {
  return state.loaded.includes(storageRef)
}

export function setLoaded(storageRef: string, state: FirebaseImageCacheState) {
  if (
    state.loaded.includes(storageRef) &&
    !state.loading.includes(storageRef)
  ) {
    return state
  }
  return pipe(
    update('loaded', concat(storageRef)),
    update('loading', reject(isEqual(storageRef))),
  )(state)
}
export function removeLoaded(
  storageRef: string,
  state: FirebaseImageCacheState,
) {
  return update('loaded', reject(isEqual(storageRef)), state)
}
