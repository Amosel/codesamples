import { useCallback } from 'react'
import { useMappedState } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { getCurrentUid, firestoreOrderedGet } from '../getters'

export function useUid() {
  return useMappedState(
    useCallback(
      createSelector(
        getCurrentUid,
        (uid: string) => uid,
      ),
      [],
    ),
  )
}