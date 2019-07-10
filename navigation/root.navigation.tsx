import React, { useEffect } from 'react'
// import { Linking, Alert } from 'react-native'
import { createSelector } from 'reselect'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { useMappedState } from 'redux-react-hook'
import { LoadingView } from '../components'
import { AppStack } from './app.navigation'
import { WelcomeStack } from './welcome.navigation'
import { createSwitchWrapper } from './navigation.utils'
import { getIsLoggedIn, getLoadingProfile, isInitializing } from '../getters'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { useAppPreload } from '../hooks/useAppPreload' 

const uriPrefix = 'peachmatch://'

const AppSwitch = createSwitchWrapper(
  createAppContainer(
    createSwitchNavigator(
      {
        AppStack,
        WelcomeStack,
        LoadingView,
      },
      {
        initialRouteName: 'LoadingView',
      },
    ),
  ),
  {
    uriPrefix,
  },
)

const getRootNavigationRouteName = createSelector(
  isInitializing,
  getIsLoggedIn,
  getLoadingProfile,
  (initializing, isLoggedIn, loadingProfile) => {
    if (!initializing) {
      if(isLoggedIn) {
        return 'AppStack'
      } 
      if(!loadingProfile) {
        return 'WelcomeStack'
      }
    }
    return 'LoadingView'
  },
)
export function Root() {
  const routeName = useMappedState(
    React.useCallback(getRootNavigationRouteName, []),
  )
  // useEffect(() => {
  //   Linking.addEventListener('url', event => {
  //     Alert.alert('url', JSON.stringify(event))
  //   })
  //   return () => Linking.removeListener('redirect', () => {})
  // },[])
  useSubscriptions()
  useAppPreload()
  return <AppSwitch routeName={routeName} />
}
