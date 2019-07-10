import React from 'react'
import { ImageURISource } from 'react-native'
import { Avatar, AvatarProps } from 'react-native-elements'
import { getIntials } from '../getters'
import { useFirebaseStorage } from '../hooks'
import { User } from '../types'
import { getUserProfileImageStorageRef } from '../helpers'

type Props = AvatarProps & { user: User }

export function UserProfileImageAvatar({ user, ...props }: Props) {
  const uri = useFirebaseStorage(getUserProfileImageStorageRef(user))
  const source: ImageURISource = uri && { uri }
  return (
    <Avatar
      title={'text'}
      {...{
        ...props,
        title: getIntials(user),
        source,
      }}
    />
  )
}
