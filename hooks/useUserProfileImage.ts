import React from 'react'
import { useFirebaseStorage } from '../hooks/useFirestoreStorage'
import { User } from '../types'
import { hasProfileImage, getStorageRef } from '../helpers'
import { useMappedState } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { getUsers } from '../getters'

export function useProfileImageForUid(uid: string) {
  const user: User = useMappedState(
    React.useCallback(
      createSelector(
        getUsers,
        users => (users[uid] ? { ...users[uid], uid } : null),
      ),
      [],
    ),
  )
  return useUserProfileImage(user)
}

export function useUserProfileImage(user: User) {
  if (hasProfileImage(user)) {
    return useFirebaseStorage(
      getStorageRef({
        collection: 'users',
        doc: user.uid,
        fileName: user.profileImageFilename,
        createdByUid: user.uid,
      }),
    )
  }
}
