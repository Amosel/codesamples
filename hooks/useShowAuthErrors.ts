import { useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useMappedState } from 'redux-react-hook'
import { getAuthError } from '../getters'

export function useShowErrors(errorType: string) {
  const error = useMappedState(
    useCallback(getAuthError(errorType), [errorType]),
  )
  useEffect(() => {
    if (error) {
      Alert.alert(error.title, error.message)
    }
  }, [error])
}
