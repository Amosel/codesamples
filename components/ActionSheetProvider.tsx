import React, {
  useEffect,
  createContext,
  useContext,
  createRef,
  useState,
  ReactNode,
} from 'react'
import { noop } from 'lodash/fp'
import { ViewProps } from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import { stat } from 'fs'
import { number } from 'prop-types'

export type Props = {
  title: string
  options: string[]
  cancelButtonIndex: number
  destructiveButtonIndex?: number,
  onPress: (buttonIndex: number) => void
}

export type actionSheetShowFnType = (actionSheetProps: Props) => void

export const ActionSheetContext = createContext<actionSheetShowFnType>(noop)

export function ActionOSheetProvider({
  children,
}: {
  children: ReactNode | ReactNode[]
}) {
  const actionSheet = createRef<ActionSheet>()
  const [state, setState] = useState()

  useEffect(() => {
    if (state) {
      actionSheet.current.show()
    }
  }, [state])

  return (
    <ActionSheetContext.Provider
      value={({ title, options, cancelButtonIndex, onPress }: Props) => {
        if(!state) {
          setState({
            title,
            options,
            cancelButtonIndex,
            onPress: (buttonIndex: number) => {
              onPress(buttonIndex)
              setState(null)
            },
          })
        }
      }}
    >
      <React.Fragment>
        <ActionSheet ref={actionSheet} {...state} />
        {children}
      </React.Fragment>
    </ActionSheetContext.Provider>
  )
}

export function useActionSheet(): actionSheetShowFnType {
  return useContext(ActionSheetContext)
}
