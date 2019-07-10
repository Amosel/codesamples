import React, { Component, ReactElement, ReactNode } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { Icon, IconProps } from 'react-native-elements'

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})

type Item = {
  backgroundColor: string
  icon: {
    name: string
    type: string
    size: number
    color: string
  }
  onPress: () => void
}

type Props = {
  children: ReactNode
  items: Item[]
  itemSize?: number
  backgroundColor?: string
}

export function SwipeableRow({
  children,
  itemSize = 88,
  items = [],
  backgroundColor = 'white',
}: Props) {
  const swipeableRowRef = React.createRef<Swipeable>()
  function close() {
    const swipableRow = swipeableRowRef.current
    if (swipableRow) {
      swipableRow.close()
    }
  }
  function renderRightActionItem(
    iconProps: IconProps,
    backgroundColor: string,
    onPress: () => void,
    index: number,
    progress: Animated.Value,
  ) {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [index * itemSize, 0],
    })
    return (
      <Animated.View key={index} style={{ flex: 1, transform: [{ translateX }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor }]}
          onPress={onPress}
        >
          <Icon {...iconProps} />
        </RectButton>
      </Animated.View>
    )
  }
  function renderRightActions(progress: Animated.Value) {
    return (
      <View
        style={{
          width: items.length * itemSize,
          flexDirection: 'row',
          backgroundColor,
        }}
      >
        {items.map((item, index) =>
          renderRightActionItem(
            item.icon,
            item.backgroundColor,
            () => {
              close()
              item.onPress()
            },
            items.length - index,
            progress,
          ),
        )}
      </View>
    )
  }
  return (
    <Swipeable
      ref={swipeableRowRef}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      {children}
    </Swipeable>
  )
}
