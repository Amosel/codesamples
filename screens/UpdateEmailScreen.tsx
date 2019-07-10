import React from 'react'
import { Alert } from 'react-native'
import { renderSingleTextInputScreen } from '../components'
import { useNavigation, useFirebaseUpdateEmail } from '../hooks'
import { User } from '../types'
import { formatEmail } from '../helpers'

export function UpdateEmailScreen() {
  const { getParam, popToTop } = useNavigation()
  const user = getParam('user') as User
  const { update, isLoading} = useFirebaseUpdateEmail()
  const initialValue = user.email
  const [text, setText] = React.useState(initialValue || '')
  const formattedValue = formatEmail(text)
  const canSubmit = !!formattedValue && !isLoading && text !== initialValue

  async function onSubmit() {
    if(!formattedValue) return
    try {
      await update(formattedValue)
      popToTop()
    } catch (error) {
      Alert.alert(
        'Update Email',
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
      keyboardType: 'email-address',
      placeholder: `email`,
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