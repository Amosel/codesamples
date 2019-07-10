import { createStackNavigator } from 'react-navigation'
import { withProps } from 'recompose'
import { WelcomeScreen, EmailPasswordScreen, UserNameScreen } from '../screens'
import { colors } from '../styles'

const SignInFlow = createStackNavigator(
  {
    SignIn: {
      screen: withProps({ isForSigninScreen: true })(EmailPasswordScreen)
    }
  },
  {
    initialRouteName: 'SignIn',
    navigationOptions: {
      headerTransparent: true
    }
  }
)

const SignUpFlow = createStackNavigator(
  {
    SignUpNameScreen: {
      screen: UserNameScreen
    },
    SignupEmailPassword: {
      screen: EmailPasswordScreen
    }
  },
  {
    initialRouteName: 'SignUpNameScreen',

    navigationOptions: {
      headerTransparent: true,
    }
  }
)

const WelcomeStack = createStackNavigator(
  {
    Welcome: {
      screen: WelcomeScreen
    },
    SignIn: {
      screen: SignInFlow
    },
    SignUp: {
      screen: SignUpFlow
    }
  },
  {
    initialRouteName: 'Welcome',
    defaultNavigationOptions: {
      headerTintColor: colors.darkBlue,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerStyle: {
        borderBottomWidth: 0,
      },    
    },
  }
)


export { WelcomeStack }
