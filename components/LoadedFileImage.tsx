import React from 'react'
import { Image, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useFirebaseStorage } from '../hooks'
import { LoadedFile } from '../types'

export function LoadedFileImage({
  file,
}: {
  file: LoadedFile
}) {
  const uri = useFirebaseStorage(file.ref)
  return uri ? (
    <FastImage
      resizeMode="cover"
      source={{ uri }}
      style={{
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
        borderRadius: 8,
      }}
    />
  ) : null
}
