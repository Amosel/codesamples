import { StyleSheet } from 'react-native'
import { colors } from './colors'
import { SafeAreaInsets } from './layout'

export const app = StyleSheet.create({
  container: {
    paddingHorizontal: '4%',
    backgroundColor: colors.white,
    paddingVertical: 14,
  },
  h1: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 34,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0.41,
    lineHeight: 41,
    color: colors.absoluteBlack,
  },
  h2: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 48,
    letterSpacing: 0.41,
    color: colors.absoluteBlack,
  },
  h3: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 22,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 28,
    letterSpacing: 0.35,
    color: colors.absoluteBlack,
  },
  h4: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 20,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 25,
    letterSpacing: 0.38,
    color: colors.absoluteBlack,
  },
  h5: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0.41,
    color: colors.absoluteBlack,
  },
  grayHighlight: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0.41,
    color: colors.gray1,
  },
  listHeaderTitle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0.08,
    color: 'rgb(144,141,134)',
  },
  body: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 19,
    letterSpacing: 0.19,
    color: colors.darkBlue,
  },
  textInputLabel: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 14,
    letterSpacing: 0.35,
    opacity: 0.45,
  },
})

export const welcomeButton = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: colors.peach,
    paddingVertical: 14,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 17,
    fontWeight: '500',
    color: colors.white,
  },
})

export const welcome = StyleSheet.create({
  h1: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 48,
    letterSpacing: 0.41,
    textAlign: 'center',
    color: colors.absoluteBlack,
  },
  h2: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 20,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 25,
    letterSpacing: 0.38,
    textAlign: 'center',
    color: colors.absoluteBlack,
  },
  container: {
    flex: 1,
    paddingTop: '10%',
    paddingBottom: SafeAreaInsets.bottom,
    paddingHorizontal: '4%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
})
