import { useEffect, useState, useRef } from 'react'
import { isArray } from 'lodash'
import ImagePicker, { Options, Image } from 'react-native-image-crop-picker'

type State = {
  pickingNewPhoto?: {
    options: Options
  }
  takingNewPhoto?: {
    options: Options
  }
  errored?: {
    error: any
  }
  idle: boolean
  image?: Image
}

const setPickingNewPhotos = (options: Options) => ({
  pickingNewPhoto: {
    options,
  },
  idle: false,
})

const setTakingNewPhoto = (options: Options) => ({
  takingNewPhoto: {
    options,
  },
  idle: false,
})

const setCancel = () => ({
  idle: true,
})

const setErrored = (error: any) => ({
  errored: { error },
  idle: true,
})

const coerceToImage = (image: Image | Image[]): Image | null => {
  if (isArray(image) && image.length > 0) {
    return image[0]
  } else if (image) {
    return image as Image
  }
  return null
}

const setImage = (image: Image) => ({
  idle: true,
  image,
})

const defaultOptions: Options = {
  cropping: true,
  useFrontCamera: false,
  width: 540,
  height: 960,
  includeBase64: false,
  includeExif: true,
  compressImageQuality: 0.9,
  forceJpg: true,
  mediaType: 'photo',
}

type ImagePickerProps = {
  chooseNewPhoto: (options?: Options) => void
  takeNewNewPhoto: (options?: Options) => void
  cancel: () => void
  loading: boolean
}

export { Options }

export function useImagePicker(
  callback: (image: Image) => void,
): ImagePickerProps {
  const [state, setState] = useState<State>({ idle: true })

  const usePickerAction = async (action: () => Promise<Image | Image[]>) => {
    try {
      const image = await action().then(coerceToImage)
      if (!state.idle && image) {
        await setState(setImage(image))
      }
    } catch (error) {
      setState(setErrored(error))
    } finally {
      setState({ idle: true })
    }
  }

  useEffect(() => {
    if (state && state.pickingNewPhoto) {
      const options = state.pickingNewPhoto.options
      usePickerAction(() => ImagePicker.openPicker(options))
    }
  }, [state.pickingNewPhoto])
  useEffect(() => {
    if (state && state.takingNewPhoto) {
      const options = state.takingNewPhoto.options
      usePickerAction(() => ImagePicker.openCamera(options))
    }
  }, [state.takingNewPhoto])
  useEffect(() => {
    if (state.image && callback) {
      callback(state.image)
      setState({ idle: true })
    }
  }, [state.image])

  return {
    chooseNewPhoto(options) {
      setState(
        setPickingNewPhotos({
          ...defaultOptions,
          ...options,
        }),
      )
    },
    takeNewNewPhoto(options) {
      setState(
        setTakingNewPhoto({
          ...defaultOptions,
          ...options,
        }),
      )
    },
    cancel() {
      setState(setCancel())
    },
    loading: !state.idle,
  }
}
