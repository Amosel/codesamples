import React from 'react'
import { Dimensions } from 'react-native'
import { LoadedFileImage } from './LoadedFileImage'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { Peach, Position } from '../types'

const {
  Value,
  Clock,
  cond,
  eq,
  set,
  block,
  clockRunning,
  startClock,
  spring,
  stopClock,
  event,
  and,
  lessOrEq,
  greaterThan,
  call,
  interpolate,
} = Animated

const { width: wWidth, height: wHeight } = Dimensions.get('window')

function runSpring(value: any, dest: any) {
  const clock = new Clock()
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  }

  const config = {
    toValue: new Value(0),
    damping: 100,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  }

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.velocity, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    set(value, state.position),
  ])
}

type PeachModalProps = {
  peach: Peach
  position: Position
  onRequestClose: () => void
}

export class PeachModal extends React.PureComponent<PeachModalProps> {
  clock = new Clock()
  state = new Value(State.UNDETERMINED)
  close = new Value(1)
  velocityY = new Value(0)
  translateX = new Value(this.props.position.x)
  translateY = new Value(this.props.position.y)
  width = new Value(this.props.position.width)
  height = new Value(this.props.position.height)
  onGestureEvent = event(
    [
      {
        nativeEvent: {
          translationX: this.translateX,
          translationY: this.translateY,
          velocityY: this.velocityY,
          state: this.state,
        },
      },
    ],
    { useNativeDriver: true },
  )

  render() {
    const { width, height, translateX, translateY, onGestureEvent } = this
    const { peach, position, onRequestClose } = this.props
    const style = {
      borderRadius: 5,
      width,
      height,
      transform: [{ translateX }, { translateY }],
    }
    return (
      <React.Fragment>
        <Animated.Code>
          {() =>
            block([
              cond(
                eq(this.state, State.UNDETERMINED),
                runSpring(this.translateX, 0),
              ),
              cond(
                eq(this.state, State.UNDETERMINED),
                runSpring(this.translateY, 0),
              ),
              cond(
                eq(this.state, State.UNDETERMINED),
                runSpring(this.width, wWidth),
              ),
              cond(
                eq(this.state, State.UNDETERMINED),
                runSpring(this.height, wHeight),
              ),
              cond(
                and(eq(this.state, State.END), lessOrEq(this.velocityY, 0)),
                [
                  runSpring(this.translateX, 0),
                  runSpring(this.translateY, 0),
                  runSpring(this.width, wWidth),
                  runSpring(this.height, wHeight),
                ],
              ),
              cond(
                and(eq(this.state, State.END), greaterThan(this.velocityY, 0)),
                [
                  runSpring(this.translateX, position.x),
                  runSpring(this.translateY, position.y),
                  runSpring(this.width, position.width),
                  runSpring(this.height, position.height),
                  cond(
                    eq(this.height, position.height),
                    call([], onRequestClose),
                  ),
                ],
              ),
              cond(
                eq(this.state, State.ACTIVE),
                set(
                  this.width,
                  interpolate(this.translateY, {
                    inputRange: [wHeight / 4, wHeight - position.height],
                    outputRange: [wWidth, position.width],
                  }),
                ),
              ),
              cond(
                eq(this.state, State.ACTIVE),
                set(
                  this.height,
                  interpolate(this.translateY, {
                    inputRange: [wHeight / 4, wHeight - position.height],
                    outputRange: [wHeight, position.height],
                  }),
                ),
              ),
            ])
          }
        </Animated.Code>
        <PanGestureHandler
          activeOffsetY={100}
          onHandlerStateChange={onGestureEvent}
          {...{ onGestureEvent }}
        >
          <Animated.View style={style}>
            <LoadedFileImage file={peach.previewFile} />
          </Animated.View>
        </PanGestureHandler>
      </React.Fragment>
    )
  }
}