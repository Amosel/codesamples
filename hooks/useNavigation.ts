import { NavigationContext, NavigationEventCallback } from 'react-navigation'
import { useContext, useEffect } from 'react'

export const useNavigation = () => useContext(NavigationContext)

export const useNavigationEvents = (handleEvt:NavigationEventCallback) => {
  const navigation = useNavigation();
  useEffect(
    () => {
      const subsA = navigation.addListener('action', handleEvt);
      const subsWF = navigation.addListener('willFocus', handleEvt);
      const subsDF = navigation.addListener('didFocus', handleEvt);
      const subsWB = navigation.addListener('willBlur', handleEvt);
      const subsDB = navigation.addListener('didBlur', handleEvt);
      return () => {
        subsA.remove();
        subsWF.remove();
        subsDF.remove();
        subsWB.remove();
        subsDB.remove();
      };
    },
    // For TODO consideration: If the events are tied to the navigation object and the key
    // identifies the nav object, then we should probably pass [navigation.state.key] here, to
    // make sure react doesn't needlessly detach and re-attach this effect. In practice this
    // seems to cause troubles
    undefined
    // [navigation.state.key]
  );
}
