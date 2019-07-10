import * as React from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
})

const LoadingView = ({ style }: { style: any }) => (
  <View style={[styles.container, style]}>
    <ActivityIndicator />
  </View>
)

export { LoadingView }
