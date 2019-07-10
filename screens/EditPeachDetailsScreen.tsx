import React, { useMemo, useState, useRef } from 'react'
import {
  SafeAreaView,
  Image,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Button } from 'react-native-elements'
import { isEqual, range, map, differenceBy } from 'lodash/fp'

import { NavigationScreenConfigProps } from 'react-navigation'
import { HeaderButton } from '../components'
import { headerStyle, app, welcomeButton, colors } from '../styles'
import {
  useNavigation,
  useFilePicker,
  useAppText,
  useItemList,
  usePeach,
  useUid,
} from '../hooks'
import { camera } from '../assets'
import { renderFiles } from './NewPeachScreen'
import { Peach, LocalFile, FileUploadTaskRequest, FirestoreUpdate } from '../types'
import { pathForStoragageRef, getStorageRef, peachDeckFilenameAtIndex } from '../helpers'

export function renderEditPeachScreen({
  canSubmit,
  onSubmit,
  title,
  subtitle,
  setSubtitle,
  setTitle,
  files,
  setFirst,
  removeFile,
  pickImage,
}: {
  canSubmit: boolean
  onSubmit: () => void
  setSubtitle: (subtitle: string) => void
  title: string
  subtitle: string
  setTitle: (title: string) => void
  pickImage: () => void
  files: LocalFile[]
  setFirst: (file: LocalFile) => void
  removeFile: (file: LocalFile) => void
}) {
  const {
    EditPeach: {
      PickImageButton: { loadTitle, alreadyLoadedTitle },
      subtitleTextInputPlaceholder,
      titleTextInputPlaceholder,
    },
  } = useAppText()

  const subtitleTextInput = useRef<TextInput>()

  return (
    <SafeAreaView
      style={[
        app.container,
        {
          ...StyleSheet.absoluteFillObject,
          paddingHorizontal: 0,
        },
      ]}
    >
      <View
        style={{
          marginTop: 22,
          marginBottom: 11,
          marginLeft: '4%',
          marginRight: 0,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.lightGray,
        }}
      >
        <Text style={[app.textInputLabel]}>Peach Title</Text>
        <TextInput
          style={[
            app.body,
            {
              paddingTop: 10,
              color: colors.darkBlue,
            },
          ]}
          onChangeText={setTitle}
          onSubmitEditing={() => {
            if (subtitleTextInput.current) {
              subtitleTextInput.current.focus()
            }
          }}
          placeholderTextColor={colors.lightBlue}
          autoFocus
          value={title}
          placeholder={titleTextInputPlaceholder}
        />
      </View>
      <View
        style={{
          marginTop: 11,
          marginBottom: 22,
          marginLeft: '4%',
          marginRight: 0,
          maringVertical: '2%',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.lightGray,
        }}
      >
        <Text style={[app.textInputLabel]}>Peach Description</Text>
        <TextInput
          style={[
            app.body,
            {
              paddingTop: 10,
              color: colors.darkBlue,
              maxHeight: 100,
            },
          ]}
          numberOfLines={4}
          multiline
          onChangeText={setSubtitle}
          ref={subtitleTextInput}
          placeholderTextColor={colors.lightBlue}
          value={subtitle}
          placeholder={subtitleTextInputPlaceholder}
        />
      </View>
      <TouchableOpacity onPress={pickImage}>
        <View
          style={{
            marginLeft: '4%',
            marginRight: '2%',
            paddingRight: '2%',
            paddingVertical: '2%',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.lightGray,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text style={app.h5}>Upload Pitch Deck</Text>
            <Text style={app.grayHighlight}>(4 images maximum)</Text>
          </View>
          <Image source={camera} />
        </View>
      </TouchableOpacity>
      {renderFiles(files, setFirst, removeFile, pickImage)}
      <View
        style={{
          minHeight: 1,
          flexGrow: 1,
        }}
      />
      <View style={{ paddingTop: '4%' }} />
      <View
        style={{
          marginHorizontal: '4%',
          bottom: 0,
        }}
      >
        <Button
          onPress={onSubmit}
          buttonStyle={[welcomeButton.container]}
          titleStyle={[welcomeButton.text, { fontWeight: 'bold' }]}
          title={'Submit Update'}
          disabled={!canSubmit}
        />
      </View>
    </SafeAreaView>
  )
}

export function EditPeachDetailsScreen() {
  const { getParam } = useNavigation()
  const peachId = getParam('peachId')
  const store = getParam('store')
  const peach = usePeach(peachId, store) as Peach
  const uid = useUid()

  const storedLocalFiles: LocalFile[] = peach.files.map(fileName => ({
    uri: pathForStoragageRef(
      getStorageRef({
        collection: 'peaches',
        doc: peachId,
        fileName,
      }),
    ),
    fileName,
  }))

  const files = useItemList<LocalFile>({ items: storedLocalFiles }, isEqual)
  const { replace } = useNavigation()
  const [title, setTitle] = useState(peach.title)
  const [subtitle, setSubtitle] = useState(peach.subtitle)
  const { pickImage } = useFilePicker(file => {
    files.addItem(file)
  })
  const canSubmit = useMemo(
    () =>
      (subtitle !== peach.subtitle && subtitle.length > 4) ||
      (title !== peach.title && title.length > 4) ||
      (files.items.length > 0 &&
        map('uri', files.items)
          .sort()
          .join('.') !==
          map('uri', storedLocalFiles)
            .sort()
            .join('.')),
    [subtitle, title, files.items],
  )

  return renderEditPeachScreen({
    title,
    subtitle,
    canSubmit,
    onSubmit() {
      const uploads: FileUploadTaskRequest = differenceBy(
        'uri',
        files.items,
        storedLocalFiles,
      ).map(file => ({
        file,
        fileReference: {
          collection: 'peaches',
          doc: peachId,
          createdByUid: uid,
          fileName: peachDeckFilenameAtIndex(map('uri', files.items).indexOf(file.uri)),
        },
      }))
      const update: FirestoreUpdate = {
        docPath: {
          collection: 'peaches',
          doc: peachId,
        },
        data: {
          files: files.items.map((_, index) => peachDeckFilenameAtIndex(index)),
          title,
          subtitle,
        }
      }
      debugger
      replace('SubmitUpdatePeach', {
        uploads,
        update,
      })
    },
    files: files.items,
    setFirst: files.setFirst,
    removeFile: files.removeItem,
    setSubtitle,
    setTitle,
    pickImage,
  })
}

EditPeachDetailsScreen.navigationOptions = ({
  navigation,
}: NavigationScreenConfigProps) => ({
  title: null,
  headerStyle,
  headerLeft: (
    <HeaderButton title='Cancel' onPress={() => navigation.popToTop()} />
  ),
})
