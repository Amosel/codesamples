import { useCallback } from 'react'
import { useMappedState } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { firestoreOrderedGet } from '../getters'
import { Peach } from '../types'
import { stores } from '../helpers/graph.helpers'

export function useMyPeaches():  Peach[] {
  return useMappedState(
    useCallback(
      createSelector(
        firestoreOrderedGet<Peach>(stores.myPeaches),
        (peaches) => peaches,
      ),
      [],
    ),
  )
}
