import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../styles'

export function SwipeCardOverlay({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <View
      style={{
        padding: 16,
        backgroundColor: colors.white,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      }}
    >
      <Text
        style={{
          color: colors.black1,
          fontSize: 32,
          fontFamily: 'SFProDisplay-Regular',
          fontWeight: '500',
          fontStyle: 'normal',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: colors.gray,
          fontSize: 15,
          fontFamily: 'SFProDisplay-Regular',
          fontWeight: '100',
          fontStyle: 'normal',
        }}
      >
        {subtitle}
      </Text>
    </View>
  )
}
