import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
} from 'react-native'
import { heightPercent, widthPercent, colors, SafeAreaInsets } from '../styles'
import { DEV } from '../config'
import {
  showError,
  FormButton,
  FormTextInput,
  KeyboardDismissContainer,
  TextButton,
  FormTitleText,
} from '../components'
import { useLoginForm, useFirebase, useNavigation, useShowErrors } from '../hooks'
import { now } from '../firebase'

const styles = StyleSheet.create({
  title: {
    color: colors.peach,
    fontWeight: 'bold',
    lineHeight: 36,
    fontSize: 27,
  },
  textButton: {
    marginTop: 16,
    color: colors.gray,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  button: {
    marginTop: heightPercent(3.69),
  },
  container: {
    position: 'absolute',
    top: 0,
    height: SafeAreaInsets.top + 90,
    width: widthPercent(100),
    zIndex: 9999,
  },
  spacer: { height: 10 },
})

const headings = {
  signinHeading: `Hello, who's this?`,
  signupHeading: 'Enter your email & password',
}

type EmailPassword = { email: string; password: string }
type FirstLastName = {
  firstName: string
  lastName: string
}

type SubmitState = {
  idle: boolean
  login?: EmailPassword
  createUser?: [EmailPassword, FirstLastName]
  errored?: { error: any }
}

const setLogin = (login: EmailPassword): SubmitState => ({
  idle: false,
  login,
})

const setCreateUser = (
  credentials: EmailPassword,
  firstLastName: FirstLastName,
): SubmitState => ({
  idle: false,
  createUser: [credentials, firstLastName],
})

const setErrored = (error: any) => ({
  idle: true,
  errored: { error },
})


export function EmailPasswordScreen({ isForSigninScreen = false }) {
  const { getParam } = useNavigation()
  const firebase = useFirebase()
  const [submit, setSubmit] = useState<SubmitState>({ idle: true })

  useEffect(() => {
    async function firebaseSubmit() {
      try {
        if (submit.login) {
          await firebase.login(submit.login)
        } else if (submit.createUser) {
          await firebase.createUser(submit.createUser[0], submit.createUser[1])
        }
      } catch (error) {
        showError(error)
        setSubmit(setErrored(error || { message: 'Unknown Error' }))
      }
    }
    firebaseSubmit()
  }, [submit])

  const {
    validateEmail,
    validatePassword,
    checkFields,
    clearFields,
    setPassword,
    setEmail,
    email,
    password,
    emailError,
    passwordError,
  } = useLoginForm()

  const firstName = getParam('firstName', null)
  const lastName = getParam('lastName', null)

  const renderDevHelper = () =>
    DEV && (
      <TextButton
        style={styles.textButton}
        text='nuke user'
        onPress={() => {
          // if (checkFields()) nukeUser({ email, password })
        }}
      />
    )

  const buttonEnabled = email && password && !passwordError && !emailError
  const heading = isForSigninScreen
    ? headings.signinHeading
    : headings.signupHeading

  const emailInputRef = React.createRef<TextInput>()
  const passwordInputRef = React.createRef<TextInput>()

  return (
    <KeyboardDismissContainer onPress={Keyboard.dismiss}>
      <View style={styles.container} />
      <KeyboardAvoidingView enabled behavior='position'>
        <FormTitleText>{heading}</FormTitleText>
        <FormTextInput
          autoFocus
          enableInputAccessoryView
          label='Email Address'
          keyboardType='email-address'
          textContentType='emailAddress'
          returnKeyType='next'
          autoCapitalize='none'
          autoCorrect={false}
          blurOnSubmit={false}
          onChangeText={setEmail}
          value={email}
          onBlur={validateEmail}
          onClear={clearFields('email', 'emailError')}
          // errorText={emailError}
          inputRef={emailInputRef}
          onSubmitEditing={() => {
            validateEmail()
            if (passwordInputRef.current) {
              passwordInputRef.current.focus()
            }
          }}
          editable={submit.idle}
        />
        <FormTextInput
          enableInputAccessoryView
          label='Password'
          secure
          onChangeText={setPassword}
          value={password}
          onBlur={validatePassword}
          onClear={clearFields('password', 'passwordError')}
          // errorText={passwordError}
          inputRef={passwordInputRef}
          editable={submit.idle}
        />
        {renderDevHelper()}
        <View style={styles.buttonContainer}>
          <FormButton
            onPress={() => {
              if (checkFields()) {
                if (isForSigninScreen) {
                  setSubmit(
                    setLogin({
                      email,
                      password,
                    }),
                  )
                } else {
                  setSubmit(
                    setCreateUser(
                      {
                        email,
                        password,
                      },
                      {
                        firstName,
                        lastName,
                      },
                    ),
                  )
                }
              }
            }}
            title='NEXT'
            buttonStyle={{ marginTop: heightPercent(3.69) }}
            disabled={!submit.idle || !buttonEnabled}
            loading={!submit.idle}
          />
        </View>
        <View style={{ height: 10 }} />
      </KeyboardAvoidingView>
    </KeyboardDismissContainer>
  )
}
