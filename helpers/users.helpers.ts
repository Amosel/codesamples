import { User, FileReference } from '../types'
import {FileUploadTaskRequest  } from '../types'


export function hasProfileImage(user: User) {
  return !!user.profileImageFilename
}

export function toUserProfileImageUpdateForFile(request: FileUploadTaskRequest) {
  return {
    profileImageFilename: request.fileReference.fileName,
  }
}

export const getUserProfileImageFileReference = ({
  uid,
  profileImageFilename,
}: User): FileReference => ({
  collection: 'users',
  doc: uid,
  fileName: profileImageFilename,
  createdByUid: uid,
})

export const getUserProfileImageThumbFileReference = ({
  uid,
  profileImageFilename,
}: User): FileReference => ({
  collection: 'users',
  doc: uid,
  fileName: `thumb.${profileImageFilename}`,
  createdByUid: uid,
})
