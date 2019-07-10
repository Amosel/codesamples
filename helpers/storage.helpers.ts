import ImageResizer from 'react-native-image-resizer'
import uuid from 'uuid'
import { Image, FileReference, User, LocalFile, UTI } from '../types'
import { storage } from '../firebase'
import { unlinkStorageRef, pathForStoragageRef} from './filesystem.helpers'

export const generateUserProfileImageFileName = () =>
  `profileImage.${uuid()}.jpg`

export const refForFile = ({ collection, doc, fileName }: FileReference) =>
  storage
    .ref(collection)
    .child(`${doc}`)
    .child(`${fileName}`)

export const refForThumbFile = ({ collection, doc, fileName }: FileReference) =>
  storage
    .ref(collection)
    .child(`${doc}`)
    .child(`thumb.${fileName}`)

export const getStorageRef = ({ collection, doc, fileName }: FileReference) =>
  `${collection}/${doc}/${fileName}`

export const getStorageThumbRef = ({
  collection,
  doc,
  fileName,
}: FileReference) => `${collection}/${doc}/thumb.${fileName}`


export const downloadFile = (ref: string, path: string) => storage.ref(ref).downloadFile(path)

export const uploadFile = (fileReference: FileReference, uri: string) =>
  Promise.all([
    refForFile(fileReference).putFile(uri),
    ImageResizer.createResizedImage(uri, 300, 300, 'JPEG', 0.9).then(
      ({ path }) => refForThumbFile(fileReference).putFile(path),
    ),
  ])

export const deleteFile = (fileReference: FileReference) =>
  Promise.all([
    refForFile(fileReference).delete(),
    refForThumbFile(fileReference).delete(),
    unlinkStorageRef(getStorageThumbRef(fileReference)),
    unlinkStorageRef(getStorageRef(fileReference)),
  ])
