import React from 'react'
import PropTypes from 'prop-types'
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  InputAccessoryView,
  InputAccessoryViewProps,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native'
import { View as AnimatableView } from 'react-native-animatable'
import { Icon } from 'react-native-elements'
import { colors, DEFAULT_HIT_SLOP } from '../styles'
import { DEV } from '../config'

const onFocusLabelPosition = 6
const onBlurLabelPosition = 29
const onFocusLabelOpacity = 1
const onBlurLabelOpacity = 0.6
const onFocusBottomBorderWidth = StyleSheet.hairlineWidth
const onBlurBottomBorderColor = 0
const onFocusBottomBorderColor = 1
const onBlurBottomBorderWidth = StyleSheet.hairlineWidth
const onFocusInputOpacity = 1
const onBlurInputOpacity = 0.8
const onFocusRightButtonOpacity = 1
const onBlurRightButtonOpacity = 0

const USE_ACCESSORY = !DEV

function Accessory({ label, ...rest }) {
  return (
    USE_ACCESSORY && (
      <InputAccessoryView nativeID={label} style={styles.accessory} {...rest} />
    )
  )
}

class FormTextInput extends React.Component {
  state = {
    inputFocused: false,
    showSecureText: false,
    /* eslint-disable react/destructuring-assignment */
    text: this.props.value,
    /* eslint-enable react/destructuring-assignment */
  }

  render() {
    const {
      containerStyle,
      enableInputAccessoryView,
      errorColor,
      errorText,
      hideAnimationDurationMs,
      inputRef,
      label,
      multiline,
      name,
      noLabel,
      onBlur,
      onChangeText,
      onClear,
      onFocus,
      rightButtonColor,
      secure,
      showTrashIcon,
      textColor,
      tintColor,
      value,
      ...rest
    } = this.props

    const { text, inputFocused, showSecureText } = this.state

    const animatedLabelPosition = new Animated.Value(
      inputFocused || text.length ? onFocusLabelPosition : onBlurLabelPosition,
    )

    const animatedLabelOpacity = new Animated.Value(
      inputFocused || text.length ? onFocusLabelOpacity : onBlurLabelOpacity,
    )

    const animatedBottomBorderWidth = new Animated.Value(
      inputFocused || text.length
        ? onFocusBottomBorderWidth
        : onBlurBottomBorderWidth,
    )

    const animatedBottomBorderColor = new Animated.Value(
      onBlurBottomBorderColor,
    )

    const animatedInputOpacity = new Animated.Value(
      text || value ? onFocusInputOpacity : onBlurInputOpacity,
    )

    const animatedRightButtonOpacity = new Animated.Value(
      text || value || showTrashIcon
        ? onFocusRightButtonOpacity
        : onBlurRightButtonOpacity,
    )

    const sharedTimingAnimationConfig = {
      easing: Easing.elastic,
      duration: hideAnimationDurationMs,
    }

    const onFocusAnimation = () => {
      if (!text) {
        Animated.timing(animatedLabelPosition, {
          toValue: onFocusLabelPosition,
          ...sharedTimingAnimationConfig,
        }).start()
      }
      Animated.timing(animatedLabelOpacity, {
        toValue: onFocusLabelOpacity,
        ...sharedTimingAnimationConfig,
      }).start()

      // border animations
      Animated.timing(animatedBottomBorderWidth, {
        toValue: onFocusBottomBorderWidth,
        ...sharedTimingAnimationConfig,
      }).start()
      Animated.timing(animatedBottomBorderColor, {
        toValue: onFocusBottomBorderColor,
        ...sharedTimingAnimationConfig,
      }).start()

      Animated.timing(animatedInputOpacity, {
        toValue: onFocusInputOpacity,
        ...sharedTimingAnimationConfig,
      }).start()

      // clear button animation
      Animated.timing(animatedRightButtonOpacity, {
        toValue: onFocusRightButtonOpacity,
        ...sharedTimingAnimationConfig,
      }).start()
    }

    const onBlurAnimation = () => {
      // label animations
      if (!text && !value) {
        Animated.timing(animatedLabelPosition, {
          toValue: onBlurLabelPosition,
          ...sharedTimingAnimationConfig,
        }).start()
        Animated.timing(animatedLabelOpacity, {
          toValue: onBlurLabelOpacity,
          ...sharedTimingAnimationConfig,
        }).start()
        Animated.timing(animatedBottomBorderWidth, {
          toValue: errorText
            ? onFocusBottomBorderWidth
            : onBlurBottomBorderWidth,
          ...sharedTimingAnimationConfig,
        }).start()
      }
      // border animations
      Animated.timing(animatedBottomBorderColor, {
        toValue: errorText ? onFocusBottomBorderColor : onBlurBottomBorderColor,
        ...sharedTimingAnimationConfig,
      }).start()

      Animated.timing(animatedInputOpacity, {
        toValue: onBlurInputOpacity,
        ...sharedTimingAnimationConfig,
      }).start()

      // clear button animation
      Animated.timing(animatedRightButtonOpacity, {
        toValue: showTrashIcon
          ? onFocusRightButtonOpacity
          : onBlurRightButtonOpacity,
        ...sharedTimingAnimationConfig,
      }).start()
    }

    const toggleShowSecureText = () => {
      this.setState({
        showSecureText: !showSecureText,
      })
    }

    const handleOnFocus = event => {
      if (onFocus) {
        onFocus(event)
      }

      onFocusAnimation()
      this.setState({ inputFocused: true })
    }

    const handleOnBlur = async () => {
      if (onBlur) {
        await onBlur()
      }
      onBlurAnimation()
      this.setState({ inputFocused: false })
    }

    /* eslint-disable no-shadow */
    const handleOnChangeText = text => {
      this.setState({ text }, () => {
        if (onChangeText) {
          onChangeText(text, name)
        }
      })
    }
    /* eslint-enable no-shadow */

    const handleClearText = () => {
      this.setState({ text: '' }, () => {
        if (onClear) {
          onClear()
        }
      })
    }

    const secureTextToggleLabel = showSecureText ? 'Hide' : 'Show'
    const bottomBorderColorInterpolation = animatedBottomBorderColor.interpolate(
      {
        inputRange: [0, 1],
        outputRange: [tintColor, errorText ? errorColor : tintColor],
      },
    )

    return (
      <View style={styles.padding}>
        <Animated.View
          style={[
            {
              opacity: animatedInputOpacity,
              borderBottomColor: bottomBorderColorInterpolation,
              overflow: 'visible',
            },
            styles.animatedContainer,
            containerStyle,
          ]}
        >
          {!noLabel && (
            <Animated.Text
              style={[
                styles.animatedInputLabel,
                {
                  color: tintColor,
                  top: animatedLabelPosition,
                  opacity: animatedLabelOpacity,
                },
              ]}
            >
              {label.toUpperCase()}
            </Animated.Text>
          )}
          <View style={styles.textInputContainer}>
            <TextInput
              style={[
                styles.textInput,
                multiline && styles.textInputMultiline,
                {
                  color: errorText ? errorColor : textColor,
                },
              ]}
              ref={inputRef}
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              secureTextEntry={showSecureText ? false : secure}
              multiline={multiline}
              value={value || text}
              onChangeText={handleOnChangeText}
              inputAccessoryViewID={label}
              name={name || ''}
              {...rest}
            />
            {!multiline && (
              <Animated.View
                style={[
                  styles.animatedRightButtonContainer,
                  {
                    opacity: animatedRightButtonOpacity,
                  },
                ]}
              >
                {showTrashIcon && (
                  <TouchableOpacity
                    onPress={handleClearText}
                    hitSlop={DEFAULT_HIT_SLOP}
                  >
                    <Icon type='feather' name='trash-2' size={17} />
                  </TouchableOpacity>
                )}
                {!secure && !showTrashIcon && (
                  <TouchableOpacity
                    onPress={handleClearText}
                    hitSlop={DEFAULT_HIT_SLOP}
                  >
                    {inputFocused && (
                      <Icon
                        type={showTrashIcon ? 'feather' : 'ionicon'}
                        name={showTrashIcon ? 'trash-2' : 'ios-close-circle'}
                        size={showTrashIcon ? 17 : 20}
                        color={rightButtonColor}
                        backgroundColor='transparent'
                      />
                    )}
                  </TouchableOpacity>
                )}
                {secure && inputFocused && (
                  <TouchableOpacity
                    onPress={toggleShowSecureText}
                    hitSlop={DEFAULT_HIT_SLOP}
                  >
                    <Text
                      style={[
                        styles.secureTextButton,
                        { color: rightButtonColor },
                      ]}
                    >
                      {secureTextToggleLabel}
                    </Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            )}
          </View>
          <Animated.View
            style={[
              styles.animatedBorder,
              {
                backgroundColor: bottomBorderColorInterpolation,
                height: animatedBottomBorderWidth,
              },
            ]}
          />

          {enableInputAccessoryView && (
            <Accessory nativeID={label}>
              {!!errorText && (
                <AnimatableView
                  useNativeDriver
                  animation='fadeInUp'
                  duration={300}
                  delay={100}
                  style={styles.animatableView}
                >
                  <Text style={styles.text}>{errorText}</Text>
                </AnimatableView>
              )}
            </Accessory>
          )}
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  padding: {
    paddingVertical: 7,
  },
  accessory: {
    height: 44,
    bottom: 18,
  },
  animatedInputLabel: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
  },
  animatedRightButtonContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 5,
  },
  textInputMultiline: {
    lineHeight: 26,
    paddingBottom: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.95,
    lineHeight: 21,
  },
  textInputContainer: {
    minHeight: 62,
    maxHeight: 182,
    flexDirection: 'row',
    width: '100%',
    paddingTop: 20,
  },
  animatedBorder: {
    width: '100%',
    height: 1,
    position: 'absolute',
    bottom: 0,
  },
  inputAccessoryView: {
    height: 44,
    bottom: 18,
  },
  animatableView: {
    height: '100%',
    paddingVertical: 12,
  },
  text: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  animatedContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  secureTextButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
})

FormTextInput.propTypes = {
  containerStyle: PropTypes.shape({}),
  enableInputAccessoryView: PropTypes.bool,
  errorColor: PropTypes.string,
  errorText: PropTypes.string,
  hideAnimationDurationMs: PropTypes.number,
  label: PropTypes.string.isRequired,
  multiline: PropTypes.bool,
  noLabel: PropTypes.bool,
  onChangeText: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  onClear: PropTypes.func,
  rightButtonColor: PropTypes.string,
  secure: PropTypes.bool,
  textColor: PropTypes.string,
  tintColor: PropTypes.string,
}

FormTextInput.defaultProps = {
  containerStyle: {},
  enableInputAccessoryView: false,
  errorColor: colors.errorColor,
  errorText: null,
  hideAnimationDurationMs: 300,
  multiline: false,
  noLabel: false,
  onChangeText: false,
  onClear: null,
  rightButtonColor: colors.gray,
  secure: false,
  textColor: colors.peach,
  tintColor: colors.darkBlue,
}
export { FormTextInput }
