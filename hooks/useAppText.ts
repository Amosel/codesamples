export interface AppTexts {
  PickerActionSheet: PickerActionSheet
  NewPeach: NewPeach,
  EditPeach: EditPeach,
}

export interface NewPeach {
  PickImageButton: PickImageButton
  subtitleTextInputPlaceholder: string
  titleTextInputPlaceholder: string
}

export interface EditPeach {
  PickImageButton: PickImageButton
  subtitleTextInputPlaceholder: string
  titleTextInputPlaceholder: string
}

export interface PickerActionSheet {
  title: string
  fileOption: string
  photoAlbumOption: string
  cameraOption: string
  cancelOption: string
}

export interface PickImageButton {
  alreadyLoadedTitle: string
  loadTitle: string
}

export function useAppText(): AppTexts {
  return {
    EditPeach: {
      titleTextInputPlaceholder: 'Your peach name',
      subtitleTextInputPlaceholder: 'Elevator Pitch',
      PickImageButton: {
        alreadyLoadedTitle: 'Load a different One',
        loadTitle: 'One-Pager (jpg, png)',
      },
    },
    NewPeach: {
      titleTextInputPlaceholder: 'Your peach name',
      subtitleTextInputPlaceholder: 'Elevator Pitch',
      PickImageButton: {
        alreadyLoadedTitle: 'Load a different One',
        loadTitle: 'One-Pager (jpg, png)',
      },
    },
    PickerActionSheet: {
      title: 'Choose your Pitch snapshot',
      fileOption: 'Choose File',
      photoAlbumOption: 'Choose from Photos',
      cameraOption: 'Take new Photo',
      cancelOption: 'Cancel',
    },
  }
}
