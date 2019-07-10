import {
  LoadedFile,
  FirestorePeach,
  FirestoreCollection,
  FirestoreLike,
} from '../types'
import { firestore, now } from '../firebase'

export const toFirestoreLike = ({uid, peachId }: {uid: string, peachId: string}): FirestoreLike  => ({
  peachId,
  uid,
  createdAt: now(),
})

export const toFirestorePeach = ({
  title,
  subtitle,
  files,
  uid,
}: {
  title: string
  subtitle: string
  files: string[]
  uid: string
}): FirestorePeach => ({
  subtitle,
  title,
  files,
  peachDeckSize: files.length,
  createdByUid: uid,
  teamUids: [uid],
  likes: 0,
  createdAt: now(),
  updatedAt: now(),
})

export const createDoc = (collection: FirestoreCollection): string =>
  firestore.collection(collection).doc().id as string