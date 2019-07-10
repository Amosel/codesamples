import { useCallback, useContext } from 'react'
import { useMappedState, StoreContext } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { iRootState, Store } from '../store/store'
import { useEffect } from 'react'
import { FileReference } from '../types'
import { getPathForStorageRef, getDownloadingForStorageRef } from '../getters'

export function useFirebaseStorage(
  ref: string,
): string | undefined | null {
  const { path } = useMappedState(
    useCallback(
      createSelector(
        getPathForStorageRef(ref),
        getDownloadingForStorageRef(ref),
        (path, loading) => ({ path, loading }),
      ),
      [ref],
    ),
  )

  const { dispatch } = useContext<Store>(StoreContext)

  useEffect(() => {
    if (!path) {
      dispatch.storage.download(ref)
    }
  }, [path])

  return path
}
