import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import { ButtonProps, Button } from 'react-native-elements'
import {
  colors
} from '../styles'

const buttonStyles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: '3.7%',
    width: 315,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    height: 50,
    backgroundColor: colors.peach,
    borderRadius: 25,
    width: 315,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    width: 72,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 17,
    fontWeight: '500',
    color: colors.white
  },
})

export function WelcomeButton({ title, ...rest }: { title: string }) {
  return (
    <TouchableOpacity style={buttonStyles.container} {...rest}>
      <View style={buttonStyles.background}>
        <View style={buttonStyles.textContainer}>
          <Text style={buttonStyles.text}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
