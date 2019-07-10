import React, { useReducer, useMemo } from 'react'
import { View, TextInput } from 'react-native'
import { useNavigation } from '../hooks'
import {
  FormTitleText,
  FormButton,
  FormTextInput,
  KeyboardDismissContainer,
} from '../components'
import { stateReducer } from '../hooks/hooks.utils'
import { colors } from '../styles'

const heading = {
  title: `Let's get to know you`,
}

export function UserNameScreen() {
  const { getParam, navigate } = useNavigation()
  const [{ firstName, lastName }, setState] = useReducer(stateReducer, {
    firstName: '',
    lastName: '',
  })
  const lastNameInputRef = React.createRef<TextInput>()
  const flow = getParam('flow')

  function handleOnNext() {
    navigate('SignupEmailPassword', {
      screenType: 'signup',
      ...{ firstName, lastName, flow },
    })
  }

  function handleClearField(fieldName: string) {
    return function setFieldName() {
      setState({ [fieldName]: null })
    }
  }

  const buttonEnabled = useMemo(() => firstName && lastName, [
    firstName,
    lastName,
  ])

  return (
    <KeyboardDismissContainer>
      <FormTitleText>{heading.title}</FormTitleText>
      <FormTextInput
        textColor={colors.peach}
        value={firstName}
        autoFocus
        onChangeText={(text: string) => setState({ firstName: text })}
        label='First Name'
        textContentType='givenName'
        onClear={handleClearField('firstName')}
        onSubmitEditing={() => {
          if (lastNameInputRef.current) {
            lastNameInputRef.current.focus()
          }
        }}
        blurOnSubmit={false}
        autoCorrect={false}
      />
      <FormTextInput
        textColor={colors.peach}
        inputRef={lastNameInputRef}
        value={lastName}
        onChangeText={(text: string) => setState({ lastName: text })}
        label='Last Name'
        textContentType='familyName'
        onClear={handleClearField('lastName')}
        autoCorrect={false}
      />
      <View style={{ alignItems: 'flex-end' }}>
        <FormButton
          onPress={handleOnNext}
          title='NEXT'
          disabled={!buttonEnabled}
        />
      </View>
    </KeyboardDismissContainer>
  )
}

UserNameScreen.navigationOptions = () => ({
  headerBackTitle: null,
  headerStyle: {
    borderBottomWidth: 0,
  },
})
