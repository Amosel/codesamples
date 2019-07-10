import { last, filter, pipe, get, getOr, isArray, where } from 'lodash/fp'
import { createSelector } from 'reselect'
import { User, State, FileReference, iRootState } from './types'

export const isInitializing = (state: State) => state.firebase.isInitializing
export const getProfile = (state: State) => state.firebase.profile
export const getUsers = (state: State) =>
  get('users', state.firestore.data) as { [id: string]: User }

export const getUser = (uid:string) => pipe(
  getUsers,
  users => users[uid]
)

export const getAuth = (state: State) => state.firebase.auth
export const getIsLoggedIn = createSelector(
  getAuth,
  getProfile,
  ({ isLoaded, isEmpty }, profile) =>
    isLoaded && !isEmpty && profile.isLoaded && !profile.isEmpty,
)
export const getLoadingProfile = createSelector(
  getAuth,
  getProfile,
  ({ isLoaded, isEmpty }, profile) => isLoaded && !isEmpty && !profile.isLoaded,
)

export const getCurrentUid = (state: State): string =>
  get('firebase.auth.uid', state)
export const getAuthLoaded = get('firebase.auth.isLoaded')
export const getIsDonePreloadingInitialData = pipe(
  get('firestore.ordered.peaches'),
  isArray,
)

export const getCurrentUser = createSelector(
  getCurrentUid,
  getUsers,
  (uid, users) => uid && users && ({ uid, ...users[uid] } as User),
)

export const firestoreOrderedGet = <T>(store: string) => (state: State): T[] =>
  getOr([], `firestore.ordered.${store}`, state) as T[]

export const firestoreStoresLoaded = (names: string[]) => (
  state: State,
): boolean => names.every(store => !!get(`firestore.ordered.${store}`, state))

export const getIntials = (user: User) =>
  [user.firstName, user.lastName].map(char => char[0].toUpperCase()).join('')

export const toFullName = (user: User) => `${user.firstName} ${user.lastName}`
export const toDisplayName = (user: User) =>
  `@${user.firstName}${user.lastName.slice(0, 2)}`.toLowerCase()

export const getAvatar = (user: User) => ({
  title: getIntials(user),
  source: { uri: user.avatar && user.avatar.url },
})

export const getAuthError = (errorType: string) =>
  pipe(
    getOr([], 'firebase.errors'),
    filter(['domain', errorType]),
    last,
    error =>
      error && {
        title: 'Failed',
        message: getOr('Unknown', 'userInfo.NSLocalizedDescription', error),
      },
  )

export const getPathForStorageRef = (ref: string) => (
  state: iRootState,
): string | undefined => state.storage.loaded[ref]

export const getDownloadingForStorageRef = (ref: string) => (
  state: iRootState,
): boolean => state.storage.downloading.includes(ref)
