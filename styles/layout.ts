import { Dimensions } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'

const { width, height } = Dimensions.get('window')

export const widthPercent = (percent: number) => width * (percent / 100)
export const heightPercent = (percent: number) => height * (percent / 100)

export const DEFAULT_HIT_SLOP = { top: 10, right: 10, bottom: 10, left: 10 }

export const flatListPaddingHorizontal = widthPercent(8)

export const navigationBarHeight = 44
export const tagBarHeight = 49
export const SafeAreaInsets = isIphoneX
  ? { top: 44, left: 0, bottom: 34, right: 0 }
  : { top: 0, left: 0, bottom: 0, right: 0 }


export const peachImage = {
  width: 540,
  height: 960,
  aspectRatio:  9 / 16
}

export const card = {
  borderRadius: 8,
  aspectRatio: peachImage.aspectRatio,
}

export const cellAvatar = {
  borderRadius: 10,
  height: 40,
}
