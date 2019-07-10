import React from 'react'
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native'

export class Pulse extends React.Component {
  
  anim = new Animated.Value(0)

  componentDidMount() {
    Animated.timing(this.anim, {
      toValue: 1,
      duration: this.props.interval,
      easing: Easing.in,
      useNativeDriver: true,
    }).start()
  }

  render() {
    const {
      size,
      pulseMaxSize,
      borderColor,
      backgroundColor,
      getStyle,
    } = this.props

    return (
      <View
        style={[
          styles.circleWrapper,
          {
            width: pulseMaxSize,
            height: pulseMaxSize,
            marginLeft: -pulseMaxSize / 2,
            marginTop: -pulseMaxSize / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              borderColor,
              borderWidth: StyleSheet.hairlineWidth,
              backgroundColor,
              transform: [
                {
                  scale: this.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 2],
                  }),
                },
              ],
              width: size,
              height: size,
              borderRadius: pulseMaxSize / 2,
              opacity: this.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
            getStyle && getStyle(this.anim),
          ]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  circleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  circle: {
    borderWidth: StyleSheet.hairlineWidth,
  },
})

export class PulseAnim extends React.Component {
  state = {
    circles: [],
  }
  counter = 1
  setInterval = null
  anim = new Animated.Value(1)

  componentDidMount() {
    this.setCircleInterval()
  }

  componentWillUnmount() {
    clearInterval(this.setInterval)
  }

  setCircleInterval = () => {
    this.setInterval = setInterval(this.addCircle, this.props.interval)
    this.addCircle()
  }

  addCircle = () => {
    this.setState({ circles: [...this.state.circles, this.counter] })
    this.counter++
  }

  onPressIn = () => {
    Animated.timing(this.anim, {
      toValue: this.props.pressInValue,
      duration: this.props.pressDuration,
      easing: this.props.pressInEasing,
      useNativeDriver: true,
    }).start(() => clearInterval(this.setInterval))
  }

  onPressOut = () => {
    Animated.timing(this.anim, {
      toValue: 1,
      duration: this.props.pressDuration,
      easing: this.props.pressOutEasing,
      useNativeDriver: true,
    }).start(this.setCircleInterval)
  }

  render() {
    const { size, avatar, avatarBackgroundColor, interval } = this.props

    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          },
          this.props.containerStyle,
        ]}
      >
        {this.state.circles.map(circle => (
          <Pulse key={circle} {...this.props} />
        ))}

        <TouchableOpacity
          activeOpacity={1}
          onPressIn={this.onPressIn}
          onPressOut={this.onPressOut}
          style={{
            transform: [
              {
                scale: this.anim,
              },
            ],
          }}
        >
          <Image
            source={avatar}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: avatarBackgroundColor,
            }}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

PulseAnim.defaultProps = {
  interval: 2000,
  size: 150,
  pulseMaxSize: 200,
  avatar: undefined,
  avatarBackgroundColor: 'transparent',
  pressInValue: 0.8,
  pressDuration: 50,
  pressInEasing: Easing.bounce,
  pressOutEasing: Easing.bounce,
  borderColor: '#1c1d1f',
  backgroundColor: '#D1D1D1',
  containerStyle: null,
  getStyle: undefined,
}
