import React from 'react'
import { StyleSheet } from 'react-native'
import { ListItem } from 'react-native-elements'
import { colors } from '../styles'

const stylesheet = StyleSheet.create({
  listItemContainer: {},
  wrapper: {
    marginLeft: 0,
  },
  image: {
    height: 64,
    width: 64,
    borderRadius: 5,
  },
  subtitleStyle: {
    color: colors.gray,
    fontSize: 12,
  },
  rightTitle: {
    color: colors.gray,
    fontSize: 12,
  },
  titleStyle: {
    color: colors.absoluteBlack,
    fontSize: 16,
  },
  bold: { fontWeight: 'bold' },
  rightContentContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
})

export const styles = {
  wrapperStyle: stylesheet.wrapper,
  containerStyle: stylesheet.listItemContainer,
  avatarContainerStyle: stylesheet.image,
  avatarOverlayContainerStyle: stylesheet.image,
  avatarStyle: stylesheet.image,
  titleStyle: stylesheet.titleStyle,
  subtitleStyle: stylesheet.subtitleStyle,
  rightContentContainerStyle: stylesheet.rightContentContainer,
  rightTitleStyle: stylesheet.rightTitle,
}

export const selectedStyles = {
  titleStyle: [stylesheet.titleStyle, stylesheet.bold],
  subtitleStyle: [stylesheet.subtitleStyle, stylesheet.bold],
}

export const defaultProps = { titleNumberOfLines: 2 }

export const CommonListItem = props => (
  <ListItem
    {...{
      ...defaultProps,
      ...styles,
      ...props,
    }}
  />
)
