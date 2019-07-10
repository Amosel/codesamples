import { useMemo, useEffect, useCallback, useReducer } from 'react'
import { Alert } from 'react-native'
import { last, pick } from 'lodash/fp'
import { useMappedState } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { firestoreOrderedGet } from '../getters'
import { useFirestore } from './firebase.hooks'
import { Peach, Like } from '../types'
import { toFirestoreLike, stores } from '../helpers'

export function useLikes(
  uid: string,
): { likes: Like[]; likePeach: (peach: Peach) => void } {
  const reduxFirestore = useFirestore()

  const [likedPeaches, addPeach] = useReducer<
    (current: Peach[], add: Peach) => Peach[]
  >(
    (current, peach) =>
      current.includes(peach) ? current : [...current, peach],
    [],
  )

  const { likes } = useMappedState(
    useCallback(
      createSelector(
        firestoreOrderedGet<Like>(stores.myLikes),
        (likes: Like[]) => ({
          likes,
        }),
      ),
      [],
    ),
  )

  useEffect(() => {
    async function addLike(peach: Peach) {
      try {
        const { id } = await reduxFirestore.add(
          { collection: 'likes' },
          toFirestoreLike({
            peachId: peach.id,
            uid,
          }),
        )
      } catch (error) {
        Alert.alert('Add Like', error)
      }
    }
    const lastPeach = last(likedPeaches)
    if (lastPeach) {
      addLike(lastPeach)
    }
  }, [likedPeaches])

  return {
    likes,
    likePeach(peach: Peach) {
      addPeach(peach)
    },
  }
}
