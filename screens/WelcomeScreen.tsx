import React from 'react'
import { TouchableOpacity, StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation, useStatusBarStyle } from '../hooks'
import { colors, touchableActiveOpacity, welcomeButton } from '../styles'
import { underwaterOnlineWorld } from '../assets'

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.darkBlue,
  },
  container: {
    paddingTop: 101,
    paddingBottom: 75,
    marginHorizontal: '4.8%',
  },
  title: {
    fontFamily: 'ParalucentW00-Light',
    fontSize: 50,
    fontWeight: '300',
    fontStyle: 'normal',
    lineHeight: 54,
    letterSpacing: -0.05,
    textAlign: 'center',
    color: colors.dawn,
  },
  description: {
    fontFamily: 'SFProText-Regular',
    paddingTop: 25,
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.6,
    textAlign: 'center',
    color: colors.dawn,
  },
  undraw_online_world_mc1t: {
    alignSelf: 'center',
    marginTop: '18.4%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const buttonStyles = StyleSheet.create({
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

export function WelcomeScreen() {
  useStatusBarStyle('light-content')
  const { navigate } = useNavigation()

  function handleSigninNavigation() {
    navigate('SignIn')
  }

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>
          <Text>{'Stop Talking.'}</Text>
          {'\n'}
          <Text>{'Start'}</Text>
          <Text
            style={{
              color: colors.peach,
            }}
          >
            {' Peachin’.'}
          </Text>
        </Text>
        <Text style={styles.description}>
          <Text style={{ color: colors.peach }}>Peach</Text>
          <Text> connects you with people who want to </Text>
          <Text>learn more about your project by reading </Text>
          <Text>your one-pager. You’re a few short steps </Text>
          <Text>from getting in front of others who are </Text>
          <Text>looking for the next best idea.</Text>
        </Text>
        <View style={styles.undraw_online_world_mc1t}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={underwaterOnlineWorld} />
          </View>
        </View>
        <Button
          onPress={() => navigate('SignUp')}
          buttonStyle={welcomeButton.container}
          titleStyle={welcomeButton.text}
          title={'Sign Up'}
        />
        <View style={{ flexDirection: 'row', paddingVertical: 26, alignItems:'center' }}>
          <Text style={{ color: colors.gray, paddingHorizontal: 3 }}>
            Already a user?
          </Text>
          <TouchableOpacity
            onPress={handleSigninNavigation}
            activeOpacity={touchableActiveOpacity}
          >
            <Text style={{ color: colors.peach }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

WelcomeScreen.navigationOptions = {
  headerBackTitle: null, //here I mean that the title will not be shown on the NEXT(!) screen
  header: null,
}
