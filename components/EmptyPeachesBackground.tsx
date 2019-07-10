import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { peachSuccessGraphic } from '../assets'
import { app } from '../styles'
import { colors } from '../styles';

export function EmptyPeachesBackground() {
  return (
    <View
      style={[
        app.container,
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Text style={[app.h2, { marginTop: '20%', textAlign: 'center', color: colors.lightBlue }]}>
        Create your first Peach
      </Text>
      <Text
        style={[
          app.h4,
          {
            color: colors.lightBlue,
            textAlign: 'center',
            marginVertical: '10%',
          },
        ]}
      >
        Yay
      </Text>
      <FastImage source={peachSuccessGraphic} />
    </View>
  )
}
