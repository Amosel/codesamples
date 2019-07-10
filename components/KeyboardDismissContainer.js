import React from 'react'
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Keyboard,
} from 'react-native'
import { heightPercent, widthPercent, colors } from '../styles'

export const KeyboardDismissContainer = props => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container} {...props} />
  </TouchableWithoutFeedback>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: heightPercent(14.41),
    paddingHorizontal: widthPercent(8),
    backgroundColor: colors.white,
  },
})
