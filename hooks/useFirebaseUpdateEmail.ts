import React from 'react'
import { useFirebase } from './firebase.hooks'

type CallbackFn = (error: any | null) => void
export function useFirebaseUpdateEmail() {
  const reduxFirebase = useFirebase()
  const callbackRef = React.useRef<CallbackFn>()
  const [submittingValue, setSubmitValue] = React.useState<T | null>()
  React.useEffect(() => {
    async function handleOnSubmit(newEmail:string) {
      try {
        await reduxFirebase.updateEmail(newEmail, true)
        if (callbackRef.current) {
          callbackRef.current(null)
        }
      } catch (error) {
        if (callbackRef.current) {
          callbackRef.current(null)
        }

        setSubmitValue(null)
      } finally {
      }
    }
    if (submittingValue) {
      handleOnSubmit(submittingValue)
    }
  }, [submittingValue])
  return {
    isLoading: !!submittingValue,
    update: (newEmail: string) =>
      new Promise(r => {
        setSubmitValue(newEmail)
        callbackRef.current = (error: any | null) => {
          if (error) throw error
          else r()
        }
      }),
  }
}
