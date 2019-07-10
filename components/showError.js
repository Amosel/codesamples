import { Alert } from 'react-native'

export const showError = error => {
  if (error.code && error.nativeErrorMessage) {
    Alert.alert(`Error: ${error.code}`, error.nativeErrorMessage)
    console.log('Error:', { error })
  } else {
    Alert.alert(`Error`, error.message)
    console.log('error:' , error.message)
  }
}
