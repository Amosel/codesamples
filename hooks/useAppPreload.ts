import React from 'react'
import { isEqual, map, uniqWith } from 'lodash/fp'
import { useMappedState, StoreContext } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { firestoreStoresLoaded } from '../getters'
import { stores } from '../helpers'

export function useAppPreload() {
  const { storesLoaded } = useMappedState(
    React.useCallback(
      createSelector(
        firestoreStoresLoaded([stores.myLikes, stores.myPeaches]),
        (storesLoaded: boolean) => ({
          storesLoaded,
        }),
      ),
      [],
    ),
  )
  const [once, setOnce] = React.useState()
  React.useEffect(() => {
    if (storesLoaded) {

    }
  }, [storesLoaded])
}
