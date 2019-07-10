import React from 'react'
import { Button, ButtonProps } from 'react-native-elements'
import { colors, touchableActiveOpacity } from '../styles'
import { transcode } from 'buffer'
import { opaqueType } from '@babel/types'

const HeaderButton = ({
  bold,
  buttonStyle,
  titleStyle,
  style,
  ...rest
}: ButtonProps & { bold?: boolean }) => (
  <Button
    disabledStyle={{
      backgroundColor: 'transparent',
    }}
    disabledTitleStyle={{
      color: 'gray',
      fontWeight: 'normal',
      opacity: touchableActiveOpacity,
    }}
    buttonStyle={[
      {
        backgroundColor: 'transparent',
      },
      buttonStyle,
    ]}
    titleStyle={[
      {
        color: colors.peach,
        fontFamily: 'SFProText-Regular',
        fontWeight: bold ? 'bold' : 'normal',
      },
      titleStyle,
    ]}
    style={[{ paddingHorizontal: 5 }, style]}
    {...rest}
  />
)

export { HeaderButton }
