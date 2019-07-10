import { useMemo, useEffect, useCallback, useContext, useRef } from 'react'
import { difference } from 'lodash/fp'
import { useMappedState, StoreContext } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { firestoreOrderedGet } from '../getters'
import { Store, Peach } from '../types'

export function usePreloadPeaches(peachIds: string[]) {
  const { dispatch } = useContext<Store>(StoreContext)
  const peaches = useMappedState(
    useCallback(
      createSelector(
        firestoreOrderedGet<Peach>('peaches'),
        peaches => peaches,
      ),
      [],
    ),
  )

  const previousPeachIds = useRef([])
  const newPeachIds = useMemo(
    () => difference(previousPeachIds.current, peachIds),
    [peachIds],
  )
  useEffect(() => {
    newPeachIds.forEach(peachId => {
      const peach = peaches.find(({ id }) => id === peachId) as Peach
      const firstDeckFileRef = peach.files[0].ref
      if (firstDeckFileRef) {
        dispatch.firebaseStorageCache.getImageFromStorage(firstDeckFileRef)
      }
      peach.files.forEach(({ ref }) =>
        dispatch.firebaseStorageCache.getImageFromStorage(ref),
      )
    })
  }, [newPeachIds.join('.')])

  const previousLikedUids = useRef([])
  const newLikedUids = useMemo(
    () => difference(previousPeachIds.current, peachIds),
    [peachIds],
  )
}
