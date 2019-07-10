import React from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TextInputProperties,
} from 'react-native'
import { Button, ButtonProps } from 'react-native-elements'
import { welcomeButton, app, colors } from '../styles'

export function renderSingleTextInputScreen({
  buttonProps,
  textInputProps,
}: {
  buttonProps: ButtonProps
  textInputProps: TextInputProperties
}) {
  return (
    <SafeAreaView
      style={[
        app.container,
        {
          ...StyleSheet.absoluteFillObject,
          paddingHorizontal: 0,
        },
      ]}
    >
      <View
        style={{
          marginLeft: '4%',
          marginRight: 0,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.lightGray,
        }}
      >
        <TextInput
          {...textInputProps}
          style={[
            app.h1,
            {
              paddingVertical: 15,
              color: colors.darkBlue,
            },
            textInputProps.style
          ]}
        />
      </View>
      <View
        style={{
          minHeight: 1,
          flexGrow: 1,
        }}
      />
      <View style={{ paddingTop: '4%' }} />
      <View
        style={{
          marginHorizontal: '4%',
          bottom: 0,
        }}
      >
        <Button
          buttonStyle={[welcomeButton.container]}
          titleStyle={[welcomeButton.text, { fontWeight: 'bold' }]}
          title={'Submit'}
          {...buttonProps}
        />
      </View>
    </SafeAreaView>
  )
}
