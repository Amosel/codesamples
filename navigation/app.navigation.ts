import {
  createStackNavigator,
  createBottomTabNavigator,
  NavigationScreenConfigProps,
} from 'react-navigation'
import {
  HomeScreen,
  PeachDetailsScreen,
  DiscoverScreen,
  SettingsScreen,
  NewPeachScreen,
  NewPeachSubmittingScreen,
  UpdatePhoneNumberScreen,
  UpdateDisplayNameScreen,
  UpdateEmailScreen,
  EditPeachDetailsScreen,
  SubmitUpdatePeachScreen,
} from '../screens'
import { pipe } from 'lodash/fp'
import { TabBarStackType } from '../types'
import { tabBarIconImage, withImage } from './tabBarIcon.navigation'
import { colors } from '../styles'

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    PeachDetails: {
      screen: PeachDetailsScreen,
      path: 'peach/:id',
    },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerTintColor: colors.peach,
      headerStyle: {
        borderBottomWidth: 0,
      },
    },
  },
)

const PeachesStack = createStackNavigator(
  {
    Home: {
      screen: HomeStack,
    },
  },
  {
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: 'none',
  },
)

const NewPeachStack = createStackNavigator({
  NewPeach: {
    screen: NewPeachScreen,
  },
  SubmittingPeach: {
    screen: NewPeachSubmittingScreen,
  },
})

const EditPeachDetailsStack = createStackNavigator({
  EditPeach: {
    screen: EditPeachDetailsScreen
  },
  SubmitUpdatePeach: {
    screen: SubmitUpdatePeachScreen
  }
})

const DiscoverStack = createStackNavigator({
  Discover: {
    screen: DiscoverScreen,
  },
})

const SettignsStack = createStackNavigator(
  {
    Settings: {
      screen: SettingsScreen,
    },
    UpdateDisplayName: {
      screen: UpdateDisplayNameScreen,
    },
    UpdatePhoneNumber: {
      screen: UpdatePhoneNumberScreen,
    },
    UpdateEmail: {
      screen: UpdateEmailScreen
    }
  },
  {
    initialRouteName: 'Settings',
    defaultNavigationOptions: {
      headerTintColor: colors.peach,
      headerStyle: {
        borderBottomWidth: 0,
      },
    },
  },
)

SettignsStack.navigationOptions = ({
  navigation,
}: NavigationScreenConfigProps) => {
  let tabBarVisible = true
  if (navigation.state.index > 0) {
    tabBarVisible = false
  }

  return {
    tabBarVisible,
  }
}

const TabNavigator = createBottomTabNavigator(
  {
    Peaches: PeachesStack,
    Discover: DiscoverStack,
    Settings: SettignsStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const routeName = navigation.state.routeName as TabBarStackType
        return pipe(
          tabBarIconImage,
          withImage,
        )({ routeName, focused })
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.darkBlue,
      inactiveTintColor: colors.lightBlue,
    },
  },
)

const AppStack = createStackNavigator(
  {
    Tabs: {
      screen: TabNavigator,
    },
    NewPeachStack: {
      screen: NewPeachStack,
    },
    EditPeachStack: {
      screen: EditPeachDetailsStack
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
)

export { AppStack }
