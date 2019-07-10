import React from 'react'
import { Image } from 'react-native'
import {
  peachesNavigationBarLogo,
  peachesNavigationBarLogoWhite,
} from '../assets'

export const Logo = ({ white = false }: { white: boolean }) => (
  <Image
    // style={{ marginVertical: 7, borderColor: 'green', borderWidth: 1, }}
    source={white ? peachesNavigationBarLogoWhite : peachesNavigationBarLogo}
  />
)
