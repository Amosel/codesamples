import React from 'react'
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker'
import { stateReducer } from '../hooks/hooks.utils'

const initialState = {
  pickingImage: false,
  uploadingImage: false
}

const defaultPickerOptions = {
  cropping: true,
  cropperCircleOverlay: true,
  includeBase64: true,
  includeExif: true,
  compressImageQuality: 0.6,
  mediaType: 'photo'
}

export function ImagePickerAndUploaderRenderProps({
  children,
  pickerOptions = defaultPickerOptions,
  onImage,
  onError,
  onPickingImage,
  uploadImage
}) {
  const [state, setState] = React.useReducer(stateReducer, initialState)
  const actionSheet = React.createRef()

  const handleImage = async image => {
    setState({
      ...initialState,
      uploadingImage: true,
      image
    })
    if (onImage) {
      onImage(image)
    }
    try {
      await uploadImage(image)
    } catch (error) {
      console.log('error', error)
    }
    setState({
      ...initialState
    })
  }

  const handleError = error => {
    setState({ error })
    if (onError) {
      onError(error)
    }
  }

  const handlePickingImage = () => {
    setState({ pickingImage: true })
    if (onPickingImage) {
      onPickingImage()
    }
  }

  const handleChooseNewPhoto = async () => {
    try {
      handlePickingImage()
      const image = await ImagePicker.openPicker(pickerOptions)
      await handleImage(image)
    } catch (error) {
      handleError(error)
    }
  }

  const handleTakeNewPhoto = async () => {
    try {
      handlePickingImage()
      const image = await ImagePicker.openCamera(pickerOptions)
      console.log('image', image)
      await handleImage(image)
    } catch (error) {
      handleError(error)
    }
  }

  const pickImage = () => actionSheet.current.show()

  return (
    <React.Fragment>
      <ActionSheet
        ref={actionSheet}
        title="Which one do you like ?"
        options={['Choose New Photo', 'Take new Photo', 'Cancel']}
        cancelButtonIndex={2}
        onPress={buttonIndex => {
          if (buttonIndex === 0) {
            handleChooseNewPhoto()
            console.log('choose new photo')
          } else if (buttonIndex === 1) {
            console.log('take new photo')
            handleTakeNewPhoto()
          }
          console.log('user cancelled')
        }}
      />
      {children({
        ...state,
        pickImage
      })}
    </React.Fragment>
  )
}
