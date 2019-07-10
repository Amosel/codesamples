
import * as React from 'react'
import { Image, StyleSheet } from 'react-native'
import { useFirebaseStorage } from '../hooks'
import { iconsSizePlaceholder } from '../assets'
import FastImage from 'react-native-fast-image'

export function StorageImage({
  storageRef,
  style,
}: {
  storageRef: string
  style: {}
}) {
  const uri = useFirebaseStorage(storageRef)
  return (
    <FastImage
      resizeMode='cover'
      source={uri ? { uri } : iconsSizePlaceholder}
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          width: undefined,
          height: undefined,
        },
        style,
      ]}
    />
  )
}
