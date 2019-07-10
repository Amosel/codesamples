import { useEffect } from 'react'
import { StatusBar, StatusBarStyle } from 'react-native'
import { useNavigationEvents } from './useNavigation'
import { NavigationEventPayload } from 'react-navigation'

export function useStatusBarStyle(statusBarStyle: StatusBarStyle) {
  function setStatusBar() {
    StatusBar.setBarStyle(statusBarStyle)
  }
  useEffect(() => {
    setStatusBar()
  }, [])
  useNavigationEvents((event: NavigationEventPayload) => {
    if (event.type === 'didFocus') {
      setStatusBar()
    }
  })
}
