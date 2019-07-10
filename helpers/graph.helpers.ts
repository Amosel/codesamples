import { pipe, map, flatten } from 'lodash/fp'
import { Peach, Like } from '../types'

export const toUserListener = (uid: string) => ({
  collection: 'users',
  doc: uid,
})
export const toPeachListener = (peachId: string) => ({
  collection: 'peaches',
  doc: peachId,
})

export const stores = {
  myLikes: 'myLikes',
  myPeaches: 'myPeaches',
  likesOfMyPeaches: 'likesOfMyPeaches',
}

export const listenersForMyLikes = (likes: Like[]) => [
  ...likes.map(like => like.peachId).map(toPeachListener),
]

export const listenersForLikesOfMyPeaches = (likes: Like[]) => [
  ...likes.map(like => like.uid).map(toUserListener),
]

export const listenersForMyPeaches = (peaches: Peach[]) => [
  ...pipe(
    map((peach: Peach) => peach.teamUids.map(toUserListener)),
    flatten,
  )(peaches),
  ...peaches.map(peach => ({
    collection: 'likes',
    orderBy: [['createdAt', 'asc']],
    where: [['peachId', '==', peach.id]],
    storeAs: stores.likesOfMyPeaches,
  })),
]

export const listenersRelatedToMe = (uid: string) => [
  {
    collection: 'likes',
    orderBy: [['createdAt', 'asc']],
    where: [['uid', '==', uid]],
    storeAs: stores.myLikes,
  },
  {
    collection: 'peaches',
    orderBy: [['updatedAt', 'asc']],
    where: [['teamUids', 'array-contains', uid]],
    storeAs: stores.myPeaches,
  },
  toUserListener(uid)
]