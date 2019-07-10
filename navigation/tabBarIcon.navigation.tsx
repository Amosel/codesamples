import React from 'react'
import { Image, ImageSourcePropType } from 'react-native'
import {
  peachesNotSelected,
  peachesSelected,
  discoverNotSelected,
  discoverSelected,
  settingsNotSelected,
  settingsSelected,
} from '../assets'
import { TabBarStackType } from '../types'
export type Props = {
  routeName: TabBarStackType
  focused: boolean
}

export function tabBarIconImage({ routeName, focused }: Props): ImageSourcePropType {
  switch (routeName) {
    case 'Peaches':
      return focused ? peachesSelected : peachesNotSelected
    case 'Discover':
      return focused ? discoverSelected : discoverNotSelected
    case 'Settings':
      return focused ? settingsSelected : settingsNotSelected
  }
}
export function withImage(source: ImageSourcePropType) {
  return <Image source={source} />
}
