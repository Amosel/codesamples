import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Animated from 'react-native-reanimated'
import { colors } from '../styles'

type CardProps = {
  likeOpacity?: Animated.Value<number> | number
  nopeOpacity?: Animated.Value<number> | number
  content: React.ReactNode
  overlay: React.ReactNode
  onPress: () => void
}

export const SwipeLeftRightCard = React.forwardRef<View, CardProps>(
  (
    { likeOpacity = 0, nopeOpacity = 0, overlay, content, onPress }: CardProps,
    ref,
  ) => {
    return (
      <View ref={ref} style={styles.container}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        >
          {content}
        </View>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Animated.View style={[styles.like, { opacity: likeOpacity }]}>
              <Text style={styles.likeLabel}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.nope, { opacity: nopeOpacity }]}>
              <Text style={styles.nopeLabel}>NOPE</Text>
            </Animated.View>
          </View>
          {overlay}
        </View>
        <TouchableOpacity
          style={{ ...StyleSheet.absoluteFillObject }}
          onPress={onPress}
        />
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: colors.absoluteBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  footer: {
    flexDirection: 'row',
  },
  name: {
    color: 'white',
    fontSize: 32,
  },
  like: {
    borderWidth: 4,
    borderRadius: 5,
    padding: 8,
    borderColor: '#6ee3b4',
  },
  likeLabel: {
    fontSize: 32,
    color: '#6ee3b4',
    fontWeight: 'bold',
  },
  nope: {
    borderWidth: 4,
    borderRadius: 5,
    padding: 8,
    borderColor: '#ec5288',
  },
  nopeLabel: {
    fontSize: 32,
    color: '#ec5288',
    fontWeight: 'bold',
  },
})
