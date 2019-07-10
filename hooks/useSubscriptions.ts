import { useMemo, useEffect, useCallback, useContext, useRef } from 'react'
import { isEqual, map, uniqWith } from 'lodash/fp'
import { useMappedState, StoreContext } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { useUid } from './useUid'
import { useFirestore } from './firebase.hooks'
import { useCurrentUser } from './useCurrentUser'
import { firestoreOrderedGet } from '../getters'
import { Peach, Like } from '../types'
import { Store } from '../store/store'
import {
  stores,
  listenersForMyLikes,
  listenersForLikesOfMyPeaches,
  listenersForMyPeaches,
  listenersRelatedToMe,
} from '../helpers/graph.helpers'
import { getUserProfileImageFileReference, hasProfileImage, getStorageRef } from '../helpers'

export function useSubscriptions() {
  const uid = useUid()
  const currentUser = useCurrentUser()
  const reduxFirestore = useFirestore()
  const { myPeaches, likesOfMyPeaches, myLikes } = useMappedState(
    useCallback(
      createSelector(
        firestoreOrderedGet<Peach>(stores.myPeaches),
        firestoreOrderedGet<Like>(stores.likesOfMyPeaches),
        firestoreOrderedGet<Like>(stores.myLikes),
        (myPeaches, likesOfMyPeaches, myLikes) => ({
          myPeaches,
          likesOfMyPeaches,
          myLikes,
        }),
      ),
      [],
    ),
  )
  const listeners = useMemo(
    () =>
      uniqWith(isEqual, [
        ...listenersRelatedToMe(uid),
        ...listenersForMyPeaches(myPeaches),
        ...listenersForLikesOfMyPeaches(likesOfMyPeaches),
        ...listenersForMyLikes(myLikes),
      ]),
    [uid, myPeaches, likesOfMyPeaches, myLikes],
  )

  useEffect(() => {
    if (listeners.length > 0) {
      reduxFirestore.setListeners(listeners)
    }
  }, [JSON.stringify(listeners)])

  const { dispatch } = useContext<Store>(StoreContext)
  const prealoadFileRefs = useMemo(
    () => [
      ...(currentUser ? [currentUser].filter(hasProfileImage).map(getUserProfileImageFileReference).map(getStorageRef) : []),
    ],
    [currentUser],
  )

  useEffect(() => {
    if (currentUser) {
      if(prealoadFileRefs.length) {
        dispatch.initialPreload.addRefs(prealoadFileRefs)
      }
    }
  }, [prealoadFileRefs])

  useEffect(() => {
    return () => {
      reduxFirestore.unsetListeners(listeners)
      dispatch.initialPreload.removeRefs(prealoadFileRefs)
    }
  }, [])

}


// usePreloadPeaches([...map('id', myPeaches), ...map('peachId', myLikes)])
// usePerloadUsers([uid, ...map('uid', likesOfMyPeaches)])
