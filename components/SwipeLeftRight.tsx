import * as React from 'react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import {
  Platform,
  StyleSheet,
  Dimensions,
  View,
  TouchableHighlight,
} from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
const {
  add,
  multiply,
  neq,
  cond,
  eq,
  event,
  lessThan,
  greaterThan,
  and,
  call,
  Clock,
  concat,
  interpolate,
  Extrapolate,
  spring,
  set,
  clockRunning,
  startClock,
  stopClock,
  Value,
} = Animated
import { SwipeDirection, Position } from '../types'
import { SwipeLeftRightCard } from './SwipeLeftRightCard'

const offset = (v: number) =>
  Platform.OS === 'android' ? v + getStatusBarHeight() : v

export function runSpring(clock: any, value: any, dest: any) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  }

  const config = {
    damping: 20,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 0.5,
    toValue: new Value(0),
  }

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, 0),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]
}

export const toRadians = (angle: number) => angle * (Math.PI / 180)
export const rotate = (width: number, height: number) =>
  width * Math.sin(toRadians(90 - 15)) + height * Math.sin(toRadians(15))

type SwipeLeftRightProps = {
  onSwiped: (direction: SwipeDirection) => void
  topCard: React.ReactNode
  topOverlay: React.ReactNode
  bottomCard?: React.ReactNode
  bottomOverlay?: React.ReactNode
  onPress: () => void
}

const { width, height } = Dimensions.get('window')
const rotatedWidth = rotate(width, height)

export class SwipeLeftRight extends React.PureComponent<SwipeLeftRightProps> {
  translationX = new Value(0)
  translationY = new Value(0)
  translateY: Animated.Node<number> | undefined
  translateX: Animated.Node<number> | undefined
  velocityX = new Value(0)
  offsetY = new Value(0)
  offsetX = new Value(0)
  gestureState = new Value(State.UNDETERMINED)
  onGestureEvent = event(
    [
      {
        nativeEvent: {
          translationX: this.translationX,
          translationY: this.translationY,
          velocityX: this.velocityX,
          state: this.gestureState,
        },
      },
    ],
    { useNativeDriver: true },
  )

  constructor(props: SwipeLeftRightProps) {
    super(props)
    this.reset()
  }

  reset = () => {
    const clockX = new Clock()
    const clockY = new Clock()
    const {
      translationX,
      translationY,
      velocityX,
      gestureState,
      offsetY,
      offsetX,
    } = this
    gestureState.setValue(State.UNDETERMINED)
    translationX.setValue(0)
    translationY.setValue(0)
    velocityX.setValue(0)
    offsetY.setValue(0)
    offsetX.setValue(0)

    const finalTranslateX = add(translationX, multiply(0.2, velocityX))
    const translationThreshold = width / 4
    const snapPoint = cond(
      lessThan(finalTranslateX, -translationThreshold),
      -rotatedWidth,
      cond(greaterThan(finalTranslateX, translationThreshold), rotatedWidth, 0),
    )
    // TODO: handle case where the user drags the card again before the spring animation finished
    this.translateY = cond(
      eq(gestureState, State.END),
      [
        set(translationY, runSpring(clockY, translationY, 0)),
        set(offsetY, translationY),
        translationY,
      ],
      cond(
        eq(gestureState, State.BEGAN),
        [stopClock(clockY), translationY],
        translationY,
      ),
    )
    this.translateX = cond(
      eq(gestureState, State.END),
      [
        set(translationX, runSpring(clockX, translationX, snapPoint)),
        set(offsetX, translationX),
        cond(and(eq(clockRunning(clockX), 0), neq(translationX, 0)), [
          call([translationX], this.swipped),
        ]),
        translationX,
      ],
      cond(
        eq(gestureState, State.BEGAN),
        [stopClock(clockX), translationX],
        translationX,
      ),
    )
  }

  swipped = ([translationX]: ReadonlyArray<number>) => {
    this.reset()
    this.props.onSwiped(translationX <= 0 ? 'Left' : 'Right')
  }

  ref = React.createRef<View>()

  measure = async (): Promise<Position> =>
    new Promise(resolve =>
      this.ref.current.measureInWindow((x, y, width, height) =>
        resolve({
          x,
          y: offset(y),
          width,
          height,
        }),
      ),
    )

  render() {
    const { onGestureEvent, translateX, translateY } = this

    const rotateZ = concat(
      interpolate(translateX, {
        inputRange: [-width / 2, width / 2],
        outputRange: [15, -15],
        extrapolate: Extrapolate.CLAMP,
      }),
      'deg',
    )
    const likeOpacity = interpolate(this.translateX as Animated.Value<number>, {
      inputRange: [0, width / 4],
      outputRange: [0, 1],
    })
    const nopeOpacity = interpolate(this.translateX as Animated.Value<number>, {
      inputRange: [-width / 4, 0],
      outputRange: [1, 0],
    })
    const bottomCardStyle = {
      ...StyleSheet.absoluteFillObject,
      zIndex: 100,
    }
    const topCardStyle = {
      ...StyleSheet.absoluteFillObject,
      zIndex: 900,
      transform: [{ translateX }, { translateY }, { rotateZ }],
    }
    return (
      <View
        style={{
          flex: 1,
          margin: 8,
          zIndex: 100,
          backgroundColor: 'transparent'
        }}
      >
        {this.props.bottomOverlay && (
          <Animated.View {...{ style: bottomCardStyle }}>
            <SwipeLeftRightCard
              overlay={this.props.bottomOverlay}
              content={this.props.bottomCard}
            />
          </Animated.View>
        )}

        <PanGestureHandler
          onHandlerStateChange={onGestureEvent}
          {...{ onGestureEvent }}
        >
          <Animated.View {...{ style: topCardStyle }}>
            <SwipeLeftRightCard
              onPress={this.props.onPress}
              ref={this.ref}
              {...{ likeOpacity, nopeOpacity }}
              content={this.props.topCard}
              overlay={this.props.topOverlay}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    )
  }
}
