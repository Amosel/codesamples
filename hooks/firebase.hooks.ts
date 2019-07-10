import React, { useContext, Context } from 'react'
import firebase, { RNFirebase } from 'react-native-firebase'
import {
  ReduxFirestoreContext,
  ReactReduxFirebaseContext,
  WithFirebaseProps,
  ProfileType,
  WithFirestoreProps,
  // ReduxFirestoreApi,
} from 'react-redux-firebase'
import { User } from '../types'

export const useFirebase = () =>
  useContext(ReactReduxFirebaseContext) as WithFirebaseProps<User>['firebase']

export const useFirestore = () =>
  useContext(ReduxFirestoreContext) as WithFirestoreProps['firestore']

// as RNFirebase.firestore.Firestore & ReduxFirestoreApi
