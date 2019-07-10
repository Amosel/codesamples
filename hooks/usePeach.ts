import { useCallback } from 'react'
import { find, get, isEqual, pipe, map, first } from 'lodash/fp'
import { useMappedState } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { firestoreOrderedGet } from '../getters'
import { Peach } from '../types'

export function usePeach(peachId: string, store: string = 'peaches'): Peach | undefined {
  return useMappedState(
    useCallback(
      createSelector(
        pipe(
          firestoreOrderedGet<Peach>(store),
          find(
            pipe(
              get('id'),
              isEqual(peachId),
            ),
          ),
        ),
        (peach: Peach | undefined) => peach,
      ),
      [],
    ),
  )
}
