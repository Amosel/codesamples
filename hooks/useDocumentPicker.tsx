import { Platform } from 'react-native'
import { useEffect, useState } from 'react'
import {
  DocumentPicker,
  DocumentPickerUtil,
} from 'react-native-document-picker'
import { UTI, File } from '../types'


type State = {
  idle: boolean
  show?: {
    options: {
      filetype: [UTI]
    }
  }
  errored?: { error: any }
  file?: File
}

export function useDocumentPicker(callback: (file:File) => void ) : { 
  show: () => void, 
  showing: boolean
} {
  const [state, setState] = useState<State>({
    idle: true,
  })

  useEffect(() => {
    if(state.file && callback) {
      callback(state.file)
      setState({ idle: true })
    }
  }, [state.file])

  useEffect(() => {
    if (state.show) {
      const optoins = state.show.options
      DocumentPicker.show(optoins, (error: any, file: any) => {
        if (error) {
          setState({
            errored: { error },
            idle: true,
          })
        } else {
          setState({
            file,
            idle: true,
          })
        }
      })
    }
  }, [state.show])

  return {
    show() {
      setState({
        show: {
          options: {
            filetype: [DocumentPickerUtil.pdf()],
          }
        },
        idle: false,
      })
    },
    showing: !state.idle
  }
}
