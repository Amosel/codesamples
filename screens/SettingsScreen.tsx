import React from 'react'
import { SectionList } from 'react-navigation'
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Alert,
  ImageURISource,
  SectionListData,
} from 'react-native'
import { omit } from 'lodash/fp'
import { useDispatch } from 'redux-react-hook'
import { ListItemProps } from 'react-native-elements'
import { UserProfileHeaderComponent, CommonListItem, Logo } from '../components'
import { colors, app } from '../styles'
import {
  useNavigation,
  useStatusBarStyle,
  useFirebase,
  useCurrentUser,
} from '../hooks'
import {
  settingsScreenUser,
  settingsScreenEmail,
  settingsScreenPhoneBook,
  settingsScreenPadlock,
  settingsScreenUnlock,
  settingsScreenAirplane,
} from '../assets'
import { Dispatch } from '../store/store'
import { toDisplayName } from '../getters'
import { User } from '../types'

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
})

type CellItem = {
  title: string
  source: ImageURISource
  rightTitle?: string
  onPress?: () => void
}

const toListItemProps = (cell: CellItem): ListItemProps => ({
  ...{
    chevron: true,
    titleStyle: {
      ...app.h5,
    },
    contentContainerStyle: {
      marginHorizontal: '2%',
      backgroundColor: 'white',
    },
    rightContentContainerStyle: {
      flex: 1.5,
      alignSelf: 'center',
    },
    rightTitleStyle: {
      ...app.h5,
      color: colors.gray,
      textAlign: 'right',
    },
    rightTitleProps: {
      numberOfLines: 1,
    },
  },
  ...omit(['source'], cell),
  leftAvatar: {
    source: cell.source,
    size: 33,
  },
})

const SettingsScreen = () => {
  const { navigate } = useNavigation()
  const dispatch = useDispatch()
  const firebase = useFirebase()
  const [logginOut, setLogginOut] = React.useState(false)
  const signUserOut = () => (dispatch: Dispatch) => {
    if (logginOut) return
    setLogginOut(true)
    firebase.logout().then(() => {
      dispatch({ type: 'RESET' })
    })
  }

  const resetPasswordAndLogout = () => (dispatch: Dispatch) =>
    firebase.resetPassword(user.email).then(() => {
      dispatch({ type: 'RESET' })
    })

  const user = useCurrentUser() as User

  const sectionsData: {
    [id: string]: CellItem[]
  } = {
    Settings: [
      {
        title: 'handle',
        rightTitle: user.displayName || toDisplayName(user),
        source: settingsScreenUser,
        onPress: () => navigate('UpdateDisplayName', { user }),
      },
      {
        title: 'Email',
        rightTitle: user.email,
        source: settingsScreenEmail,
        onPress: () => navigate('UpdateEmail', { user }),
      },
      {
        title: 'Phone',
        rightTitle: '+1.929.123.5050',
        source: settingsScreenPhoneBook,
        onPress: () => navigate('UpdatePhoneNumber', { user }),
      },
      {
        title: 'Reset password',
        source: settingsScreenPadlock,
        onPress: () => {
          Alert.alert(
            'Reset Password',
            `A reset password will be sent to your email address: ${
              user.email
            }`,
            [
              {
                text: 'Do it',
                onPress: () => dispatch(resetPasswordAndLogout()),
                style: 'destructive',
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
          )
        },
      },
    ],
    Account: [
      {
        title: 'Sign Out',
        source: settingsScreenUnlock,
        onPress: () =>
          Alert.alert('Sign Out', `Please confirm Signing out`, [
            {
              text: 'Do it',
              onPress: () => dispatch(signUserOut()),
              style: 'destructive',
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]),
      },
      {
        title: 'Deactivate Account',
        source: settingsScreenAirplane,
        onPress: () => null,
      },
    ],
  }

  const sections = Object.keys(sectionsData).map(key => ({
    title: key,
    data: sectionsData[key].map(toListItemProps),
  }))

  return renderSettingsScreen(sections)
}

function renderSettingsScreen(sections: SectionListData<ListItemProps>) {
  useStatusBarStyle('dark-content')
  return (
    <SafeAreaView style={styles.screen}>
      <SectionList
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={{
              flex: 1,
              backgroundColor: colors.dawn,
            }}
          >
            <Text
              style={[
                app.listHeaderTitle,
                {
                  color: 'rgb(144,141,134)',
                  paddingVertical: '4%',
                  paddingHorizontal: '4%',
                },
              ]}
            >
              {title.toUpperCase()}
            </Text>
          </View>
        )}
        sections={sections}
        renderItem={({ item }) => <CommonListItem {...item} />}
        keyExtractor={({ title }) => title}
        ListHeaderComponent={<UserProfileHeaderComponent />}
      />
    </SafeAreaView>
  )
}

SettingsScreen.navigationOptions = ({}) => ({
  headerTitle: <Logo white />,
  headerStyle: {
    backgroundColor: colors.peach,
    borderBottomWidth: 0,
  },
})

export { SettingsScreen }
