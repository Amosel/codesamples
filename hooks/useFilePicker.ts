import {
  useActionSheet,
  actionSheetShowFnType,
} from '../components/ActionSheetProvider'
// import { useDocumentPicker } from './useDocumentPicker'
import { useImagePicker, Options } from './useImagePicker'
import { LocalFile } from '../types'
import { toFile } from '../helpers'
import { useAppText } from './useAppText'

export function useFilePicker(
  callback: (file: LocalFile) => void,
): {
  loading: boolean
  pickImage: (options?: Options) => void
} {
  const showActionSheet: actionSheetShowFnType = useActionSheet()

  const imagePicker = useImagePicker(image => {
    callback(toFile(image))
  })

  /*
  const documentPicker = useDocumentPicker(file => {
    callback(file)
  })
  */

  const {
    PickerActionSheet: { title, photoAlbumOption, cameraOption, cancelOption },
  } = useAppText()

  const loading = imagePicker.loading /*|| documentPicker.showing */
  return {
    loading,
    pickImage(options?: Options) {
      showActionSheet({
        title: title,
        options: [
          // fileOption
          photoAlbumOption,
          cameraOption,
          cancelOption,
        ],
        cancelButtonIndex: 3,
        onPress: index => {
          /*
          if (index === 0) {
            documentPicker.show()
          }
          */
          if (index === 0) {
            imagePicker.chooseNewPhoto(options)
          }
          if (index === 1) {
            imagePicker.takeNewNewPhoto(options)
          }
        },
      })
    },
  }
}
