import React from 'react'
import { Text, StyleSheet, View, Image } from 'react-native'
import { app, colors } from '../styles'

export function EmptyLikedPeachesBackground() {
  return (
    <View
      style={[
        app.container,
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Text
        style={[
          app.h2,
          { marginTop: '20%', textAlign: 'center', color: colors.lightBlue },
        ]}
      >
        Find amazing Peaches
      </Text>
    </View>
  )
}
