import React from 'react'
import { Alert } from 'react-native'
import { renderSingleTextInputScreen } from '../components'
import { useNavigation, useFirestoreDocUpdate } from '../hooks'
import { User } from '../types'
import { toDisplayName } from '../getters'
import { formatDisplayName } from '../helpers'

export function UpdateDisplayNameScreen() {
  const { getParam, popToTop } = useNavigation()
  const user = getParam('user') as User
  const { update, isLoading } = useFirestoreDocUpdate('users', user.uid)
  const [text, setText] = React.useState(user.displayName || '')
  const canSubmit =
    text.length > 4 && !isLoading && text !== user.displayName

  async function onSubmit() {
    if (!canSubmit) return
    try {
      await update({ displayName: text })
      popToTop()
    } catch (error) {
      Alert.alert(
        'Update Display name',
        `Update was not sucessfull, please check your internet connection and try again.`,
      )
    }
  }

  return renderSingleTextInputScreen({
    buttonProps: {
      loading: !!isLoading,
      onPress: () => onSubmit(),
      disabled: !canSubmit && !isLoading,
    },
    textInputProps: {
      onChangeText: text => setText(formatDisplayName(text)),
      onEndEditing: onSubmit,
      value: `@${text}`,
      editable: !isLoading,
      placeholder: `e.i ${toDisplayName(user)}`,
    },
  })
}
