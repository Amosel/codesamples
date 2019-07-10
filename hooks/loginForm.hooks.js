import { useReducer } from 'react'
import validator from 'validator'
import { stateReducer } from './hooks.utils'

const errorForPassword = password =>
password.length < 6 ? 'password needs to be 6 and characters.' : null

const errorForEmail = email =>
validator.isEmail(email) ? null : 'Invalid email. Please check if email is correct.'

export const useLoginForm = (
  initialState = {
    email: '',
    password: '',
    emailError: null,
    passwordError: null
  }
) => {
  const [state, setState] = useReducer(stateReducer, initialState)
  const { emailError, passwordError } = state
  const setPassword = password =>
    setState({
      password,
      passwordError: password.length > 0 && passwordError ? errorForPassword(password) : null
    })

  const setEmail = email =>
    setState({
      emailError: email.length > 0 && emailError ? errorForEmail(email) : null,
      email
    })

  const { email, password } = state

  const validatePassword = () =>
    setState({ passwordError: password.length > 0 ? errorForPassword(password) : null })

  const validateEmail = () =>
    setState({ emailError: email.length > 0 ? errorForEmail(email) : null })

  const clearFields = (...fieldNames) => () =>
    setState(
      fieldNames.reduce((sum, name) => ({
        ...sum,
        [name]: ''
      }))
    )
  const checkFields = () => {
    validateEmail()
    validatePassword()
    return !emailError && !passwordError
  }
  return {
    ...state,
    validateEmail,
    validatePassword,
    checkFields,
    clearFields,
    setPassword,
    setEmail
  }
}