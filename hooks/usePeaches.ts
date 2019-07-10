import { useCallback } from 'react'
import { reject, uniq, pipe, get, map } from 'lodash/fp'
import { useMappedState } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { firestoreOrderedGet } from '../getters'
import { Peach, Like } from '../types'
import { stores } from '../helpers'

const getPeachIdsToIgnore = createSelector(
  pipe(
    firestoreOrderedGet<Like>(stores.myLikes),
    map('peachId'),
    // trace('peachIds')
  ),
  pipe(
    firestoreOrderedGet<Like>(stores.myPeaches),
    map('id')
  ),
  (likedPeachIds: string[], userPeachIds: string[]) => uniq([
    ...likedPeachIds,
    ...userPeachIds
  ])
)
export function usePeaches(): Peach[] {
  const peaches = useMappedState(
    useCallback(
      createSelector(
        getPeachIdsToIgnore,
        firestoreOrderedGet<Peach>('peaches'),
        (peachIdsToIgnore: string[], peaches: Peach[]) =>
          reject(
            pipe(
              get('id'),
              id => peachIdsToIgnore.includes(id),
            ),
            peaches,
          ),
      ),
      [],
    ),
  )
  return peaches
}
