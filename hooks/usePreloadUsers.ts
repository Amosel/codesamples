// import { useMemo, useEffect, useCallback, useContext, useRef } from 'react'
// import { difference } from 'lodash/fp'
// import { useMappedState, StoreContext } from 'redux-react-hook'
// import { createSelector } from 'reselect'
// import { getUsers } from '../getters'
// import { Store } from '../types'
// import { getUserProfileImageStorageRef, hasImage } from '../helpers'

// export function usePerloadUsers(uids: string[]) {
//   const { getState, dispatch } = useContext<Store>(StoreContext)
//   const users = useMappedState(
//     useCallback(
//       createSelector(
//         getUsers,
//         users => users,
//       ),
//       [],
//     ),
//   )
//   const storageRefs = useMemo(
//     () =>
//       users
//         ? uids
//             .filter(
//               uid => Object.keys(users).includes(uid) && hasImage(users[uid]),
//             )
//             .map(uid => getUserProfileImageStorageRef({
//               uid,
//               ...users[uid]
//             }))
//         : [],
//     [uids, users],
//   )

//   useEffect(() => {
//     if (storageRefs.length === 0) return
//     debugger
//     const { loaded, loading } = getState().firebaseStorageCache
//     const needLoad = difference([...loaded, ...loading], storageRefs)
//     if (needLoad.length) {
//       needLoad.forEach(dispatch.firebaseStorageCache.getImageFromStorage)
//     }
//   }, [storageRefs.sort().join('.')])
// }
