import React, { useReducer, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import {
  shadowStyle,
  alignItemsMap,
  getTouchableComponent,
  isAndroid,
  touchableBackground,
  DEFAULT_ACTIVE_OPACITY
} from "./shared";
import { stateReducer } from '../hooks/hooks.utils';

export function ActionButton({
  resetToken,
  active,
  reset,
  elevation,
  zIndex,
  verticalOrientation,
  style,
  bgColor,
  bgOpacity,
  backdrop,
  backgroundTappable,
  children,
  degrees,
}) {
  const mounted = useRef(false)
  [state, setState] = useReducer(stateReducer, {
    resetToken: props.resetToken,
    active: props.active
  })

  const anim = new Animated.Value(props.active ? 1 : 0)
  const timeout = null

  useEffect(() => {
    mounted.current = true
    return () => { 
      mounted.current = flase
      clearTimeout(this.timeout)
    }
  },
    [input]
  )
  useEffect(() => {
    if(state.resetToken !== resetToken) {
      if(active === falase & state.active === true) {
        if(reset) reset()
        Animated.spring(anim, { toValue: 0 }).start();
        setTimeout(
          () =>
            setState({ active: false, resetToken: resetToken }),
          250
        );
        return
      }
      if (active === true && state.active === false) {
        Animated.spring(anim, { toValue: 1 }).start();
        setState({ active: true, resetToken: nextProps.resetToken });
        return;
      }
      setState({
        resetToken,
        active,
      })
    }
  }, [resetToken, active])
  //////////////////////
  // STYLESHEET GETTERS
  //////////////////////

  function getOrientation() {
    return { alignItems: alignItemsMap[this.props.position] };
  }

  function getOffsetXY() {
    return {
      // paddingHorizontal: this.props.offsetX,
      paddingVertical: this.props.offsetY
    };
  }

  function getOverlayStyles() {
    return [
      styles.overlay,
      {
        elevation: elevation,
        zIndex: zIndex,
        justifyContent: verticalOrientation === "up"
          ? "flex-end"
          : "flex-start"
      }
    ];
  }


  function renderMainButton() {
    const animatedViewStyle = {
      transform: [
        {
          scale: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, props.outRangeScale]
          })
        },
        {
          rotate: anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", degrees + "deg"]
          })
        }
      ]
    };

    const wrapperStyle = {
      backgroundColor: this.anim.interpolate({
        inputRange: [0, 1],
        outputRange: [
          this.props.buttonColor,
          this.props.btnOutRange || this.props.buttonColor
        ]
      }),
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.size / 2
    };

    const buttonStyle = {
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.size / 2,
      alignItems: "center",
      justifyContent: "center"
    };

    const Touchable = getTouchableComponent(useNativeFeedback);
    const parentStyle = isAndroid &&
      this.props.fixNativeFeedbackRadius
      ? {
          right: this.props.offsetX,
          zIndex: this.props.zIndex,
          borderRadius: this.props.size / 2,
          width: this.props.size
        }
      : { marginHorizontal: this.props.offsetX, zIndex: this.props.zIndex };
  
    function renderTappableBackground() {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={this.getOverlayStyles()}
          onPress={this.reset.bind(this)}
        />
      );
    }
  
    return (
      <View style={[
        parentStyle,
        !this.props.hideShadow && shadowStyle,
        !this.props.hideShadow && this.props.shadowStyle
      ]}
      >
        <Touchable
          testID={this.props.testID}
          accessible={this.props.accessible}
          accessibilityLabel={this.props.accessibilityLabel}
          background={touchableBackground(
            this.props.nativeFeedbackRippleColor,
            this.props.fixNativeFeedbackRadius
          )}
          activeOpacity={this.props.activeOpacity}
          onLongPress={this.props.onLongPress}
          onPress={() => {
            this.props.onPress();
            if (this.props.children) this.animateButton();
          }}
          onPressIn={this.props.onPressIn}
          onPressOut={this.props.onPressOut}
        >
          <Animated.View
            style={wrapperStyle}
          >
            <Animated.View style={[buttonStyle, animatedViewStyle]}>
              {this._renderButtonIcon()}
            </Animated.View>
          </Animated.View>
        </Touchable>
      </View>
    );
  }


  //////////////////////
  // RENDER METHODS
  //////////////////////

    return (
      <View
        pointerEvents="box-none"
        style={[getOverlayStyles(), style]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            this.getOverlayStyles(),
            {
              backgroundColor: bgColor,
              opacity: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, bgOpacity]
              })
            }
          ]}
        >
          {backdrop}
        </Animated.View>
        <View
          pointerEvents="box-none"
          style={[
            getOverlayStyles(),
            getOrientation(),
            getOffsetXY()
          ]}
        >
          {state.active &&
            !backgroundTappable &&
            renderTappableBackground()}

          {this._renderMainButton()}
          {this.props.verticalOrientation === "down" &&
            this.props.children &&
            this._renderActions()}
        </View>
      </View>
    );
  }
  _renderButtonIcon() {
    const { icon, renderIcon, btnOutRangeTxt, buttonTextStyle, buttonText } = this.props;
    if (renderIcon) return renderIcon(this.state.active);
    if (icon) {
      console.warn('react-native-action-button: The `icon` prop is deprecated! Use `renderIcon` instead.');
      return icon;
    }

    const textColor = buttonTextStyle.color || "rgba(255,255,255,1)";

    return (
      <Animated.Text
        style={[
          styles.btnText,
          buttonTextStyle,
          {
            color: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [textColor, btnOutRangeTxt || textColor]
            })
          }
        ]}
      >
        {buttonText}
      </Animated.Text>
    );
  }


  //////////////////////
  // Animation Methods
  //////////////////////

  animateButton(animate = true) {
    if (this.state.active) return this.reset();

    if (animate) {
      Animated.spring(this.anim, { toValue: 1 }).start();
    } else {
      this.anim.setValue(1);
    }

    this.setState({ active: true, resetToken: this.state.resetToken });
  }

  reset(animate = true) {
    if (this.props.onReset) this.props.onReset();

    if (animate) {
      Animated.spring(this.anim, { toValue: 0 }).start();
    } else {
      this.anim.setValue(0);
    }

    setTimeout(() => {
      if (this.mounted) {
        this.setState({ active: false, resetToken: this.state.resetToken });  
      }
    }, 250);
  }
}

ActionButton.propTypes = {
  resetToken: PropTypes.any,
  active: PropTypes.bool,

  position: PropTypes.string,
  elevation: PropTypes.number,
  zIndex: PropTypes.number,

  hideShadow: PropTypes.bool,
  shadowStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number
  ]),

  renderIcon: PropTypes.func,

  bgColor: PropTypes.string,
  bgOpacity: PropTypes.number,
  buttonColor: PropTypes.string,
  buttonTextStyle: Text.propTypes.style,
  buttonText: PropTypes.string,

  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  spacing: PropTypes.number,
  size: PropTypes.number,
  autoInactive: PropTypes.bool,
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  degrees: PropTypes.number,
  verticalOrientation: PropTypes.oneOf(["up", "down"]),
  backgroundTappable: PropTypes.bool,
  activeOpacity: PropTypes.number,

  useNativeFeedback: PropTypes.bool,
  fixNativeFeedbackRadius: PropTypes.bool,
  nativeFeedbackRippleColor: PropTypes.string,

  testID: PropTypes.string,
  accessibilityLabel: PropTypes.string,
  accessible: PropTypes.bool
};

ActionButton.defaultProps = {
  resetToken: null,
  active: false,
  bgColor: "transparent",
  bgOpacity: 1,
  buttonColor: "rgba(0,0,0,1)",
  buttonTextStyle: {},
  buttonText: "+",
  spacing: 20,
  outRangeScale: 1,
  autoInactive: true,
  onPress: () => {},
  onPressIn: () => {},
  onPressOn: () => {},
  backdrop: false,
  degrees: 45,
  position: "right",
  offsetX: 30,
  offsetY: 30,
  size: 56,
  verticalOrientation: "up",
  backgroundTappable: false,
  useNativeFeedback: true,
  activeOpacity: DEFAULT_ACTIVE_OPACITY,
  fixNativeFeedbackRadius: false,
  nativeFeedbackRippleColor: "rgba(255,255,255,0.75)",
  testID: undefined,
  accessibilityLabel: undefined,
  accessible: undefined
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "transparent"
  },
  btnText: {
    marginTop: -4,
    fontSize: 24,
    backgroundColor: "transparent"
  }
});