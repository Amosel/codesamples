import React, { useEffect } from 'react'
import {
  NavigationActions,
  NavigationContainer,
  NavigationContainerComponent,
  NavigationContainerProps,
} from 'react-navigation'

type Prop = { routeName: string }

export const createSwitchWrapper = (RootNavigator: NavigationContainer, navContainerProps: NavigationContainerProps) => {
  return function({ routeName }: Prop) {
    const navigationContainerRef = React.createRef<
      NavigationContainerComponent
    >()
    function updateNaviator() {
      if (navigationContainerRef.current) {
        navigationContainerRef.current.dispatch(
          NavigationActions.navigate({ routeName }),
        )
      }
    }

    useEffect(() => {
      updateNaviator()
    }, [routeName])

    return <RootNavigator ref={navigationContainerRef} {...{
      ...navContainerProps
    }}/>
  }
}
