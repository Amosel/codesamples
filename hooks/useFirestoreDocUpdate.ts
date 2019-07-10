import React from 'react'
import { useFirestore } from './firebase.hooks'

type CallbackFn = (error: any | null) => void
export function useFirestoreDocUpdate<T extends Object>(
  collection: string,
  doc: string,
) {
  const reduxFirestore = useFirestore()
  const callbackRef = React.useRef<CallbackFn>()
  const [submittingValue, setSubmitValue] = React.useState<T | null>()
  React.useEffect(() => {
    async function handleOnSubmit(update: T) {
      try {
        await reduxFirestore.update({ collection, doc }, update)
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
    update: (update: T) =>
      new Promise(r => {
        setSubmitValue(update)
        callbackRef.current = (error: any | null) => {
          if (error) throw error
          else r()
        }
      }),
  }
}
