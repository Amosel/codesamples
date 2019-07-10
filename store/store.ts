import { init, RematchRootState } from '@rematch/core'
import selectorsPlugin from '@rematch/select'
import firebase from 'react-native-firebase'
import thunk from 'redux-thunk'

import { firebaseReducer, getFirebase } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'

import * as models from './models'

const select = selectorsPlugin()

export const store = init({
  models,
  plugins: [select],
  redux: {
    middlewares: [thunk.withExtraArgument(getFirebase)],
    rootReducers: {
      RESET: (state, action) => undefined,
    },
    reducers: {
      firebase: firebaseReducer,
      firestore: firestoreReducer,
    },
  },
})

export type Store = typeof store
export type Dispatch = typeof store.dispatch
export type iRootState = RematchRootState<typeof models>
