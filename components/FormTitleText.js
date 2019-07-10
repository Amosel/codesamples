import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { colors } from '../styles'

const styles = StyleSheet.create({
  formTitle: {
    color: colors.peach,
    fontWeight: 'bold',
    lineHeight: 36,
    fontSize: 27,
    paddingVertical: 10,
  },
})

export function FormTitleText(props) {
  return <Text style={styles.formTitle} {...props} />
}
