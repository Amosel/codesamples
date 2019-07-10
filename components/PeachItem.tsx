import React from 'react'
import { PeachInfo } from '../types'
import { getPeachDeckThumbImageStorageRef } from '../helpers'
import { ListItem } from 'react-native-elements'
import { useFirebaseStorage, useNavigation } from '../hooks'
import { colors, cellAvatar } from '../styles'

const { borderRadius } = cellAvatar

export function PeachItem({ peach, onPress }: { peach: PeachInfo, onPress: () => void }) {
  const ref = getPeachDeckThumbImageStorageRef({ peachId: peach.id, fileName: peach.deckFiles[0]})
  const uri = useFirebaseStorage(ref)
  const source = uri ? { uri } : null
  const { navigate } = useNavigation()

  return (
    <ListItem
      onPress={onPress}
      leftAvatar={{
        rounded: false,
        source,
        overlayContainerStyle: {
          borderRadius,
          backgroundColor: colors.white,
        },
        containerStyle: { backgroundColor: colors.white },
        avatarStyle: { borderRadius },
      }}
      {...peach}
    />
  )
}
