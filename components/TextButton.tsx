import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, TouchableOpacity } from 'react-native'
import { ButtonProps } from 'react-native-elements'
import { touchableActiveOpacity, colors } from '../styles'

const propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  textStyle: PropTypes.shape({}),
  containerStyle: PropTypes.shape({}),
  buttonProps: PropTypes.shape({}),
  textProps: PropTypes.shape({})
}

const defaultProps = {
  textStyle: null,
  containerStyle: null,
  buttonProps: null,
  textProps: null
}

const TextButton = (props: ButtonProps) => {
  const { onPress, title, titleStyle, containerStyle, titleProps } = props
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={touchableActiveOpacity}>
      <View style={containerStyle} >
        <Text
          style={[
            {
              color: colors.peach,
              fontWeight: 'normal',
              fontSize: 18,
              lineHeight: 20
            },
            titleStyle
          ]}
          {...titleProps}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

TextButton.propTypes = propTypes
TextButton.defaultProps = defaultProps

export { TextButton }
