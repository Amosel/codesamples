import { useCallback } from 'react'
import { useMappedState } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { getCurrentUser } from '../getters'

export function useCurrentUser() {
  return useMappedState(
    useCallback(
      createSelector(
        getCurrentUser,
        user => user,
      ),
      [],
    ),
  )
}
