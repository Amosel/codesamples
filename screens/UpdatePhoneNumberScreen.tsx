import React from 'react'
import { Alert } from 'react-native'
import { renderSingleTextInputScreen } from '../components'
import { useNavigation, useFirestoreDocUpdate } from '../hooks'
import { User } from '../types'
import { formatPhoneNumber } from '../helpers'

export function UpdatePhoneNumberScreen() {
  const { getParam, popToTop } = useNavigation()
  const user = getParam('user') as User
  const { update, isLoading } = useFirestoreDocUpdate('users', user.uid)
  const initialValue = user.phoneNumber || ''
  const [text, setText] = React.useState(initialValue || '')
  const formattedValue = formatPhoneNumber(text)
  const canSubmit = !!formattedValue && !isLoading && text !== initialValue

  async function onSubmit() {
    try {
      await update({ phoneNumber: formattedValue })
      popToTop()
    } catch (error) {
      Alert.alert(
        'Update Phone Number',
        `Update was not sucessfull, please check your internet connection and try again.`,
      )
    }
  }

  return renderSingleTextInputScreen({
    buttonProps: {
      onPress: () => onSubmit(),
      disabled: !canSubmit && !isLoading,
      loading: !!isLoading,
    },
    textInputProps: {
      style: { textAlign: 'center' },
      autoFocus: true,
      autoCapitalize: 'none',
      autoCorrect: false,
      placeholder: `Phone #`,
      onChangeText: text => setText(text),
      onEndEditing: () => {
        if (canSubmit) {
          onSubmit()
        }
      },
      value: formattedValue || text,
      editable: !isLoading,
    },
  })
}
