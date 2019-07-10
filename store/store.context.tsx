import React, { ReactNode } from 'react'
import { StoreContext } from 'redux-react-hook'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { createFirestoreInstance } from 'redux-firestore' // <- needed if using firestore
import firebase from 'react-native-firebase'
import { store } from './store'      

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <StoreContext.Provider value={store}>
      <ReactReduxFirebaseProvider
        {...{
          firebase,
          config: {
            userProfile: 'users',
            useFirestoreForProfile: true,
          },
          dispatch: store.dispatch,
          createFirestoreInstance,
        }}
      >
        {children}
      </ReactReduxFirebaseProvider>
    </StoreContext.Provider>
  )
}
