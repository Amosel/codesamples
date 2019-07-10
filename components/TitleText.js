import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { colors } from '../styles'

const styles = StyleSheet.create({
  title: {
    color: colors.tintColor,
    lineHeight: 36,
    fontSize: 27,
    paddingVertical: 10,
  }
})

export function TitleText({ style, ...props}) {
  return <Text style={[styles.title, style]} {...props} />
}

