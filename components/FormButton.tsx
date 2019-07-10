import React from 'react'
import { StyleSheet } from 'react-native'
import { heightPercent, colors } from '../styles'
import { ButtonProps, Button } from 'react-native-elements'

const styles = StyleSheet.create({
  formButton: {
    marginTop: heightPercent(3.69),
    paddingHorizontal: 10,
    backgroundColor: colors.darkBlue,
    borderRadius: 4
  }
})

export function FormButton({ buttonStyle, ...props }: ButtonProps) {
  return <Button {...props} buttonStyle={[styles.formButton, buttonStyle]} />
}
