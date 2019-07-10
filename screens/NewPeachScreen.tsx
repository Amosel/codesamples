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
import { isEqual, range } from 'lodash/fp'

import { NavigationScreenConfigProps } from 'react-navigation'
import { HeaderButton } from '../components'
import { headerStyle, app, welcomeButton, colors } from '../styles'
import { useNavigation, useFilePicker, useAppText, useItemList } from '../hooks'
import { redCloseX, camera, iconsSizePlaceholder } from '../assets'
import { LocalFile } from '../types'

const TildStyleBase = {
  padding: 10,
  aspectRatio: 1,
}

export function renderFiles(
  files: LocalFile[],
  setFirst: (item: LocalFile) => void,
  removeFile: (file: LocalFile) => void,
  pickImage: () => void,
) {
  function renderFile(index: number) {
    const file = files.length > index && files[index]
    const uri = file && file.uri
    return (
      <View
        key={index}
        style={{
          marginRight: '1%',
          paddingRight: '2%',
          paddingVertical: '1.5%',
          aspectRatio: 1,
          width: '20.5%',
        }}
      >
        {uri ? (
          <TouchableOpacity
            style={TildStyleBase}
            disabled={!file || index === 0}
            onPress={() => setFirst(file as LocalFile)}
          >
            {uri && (
              <Image
                resizeMode='cover'
                source={uri ? { uri } : iconsSizePlaceholder}
                style={[
                  {
                    ...StyleSheet.absoluteFillObject,
                    width: undefined,
                    height: undefined,
                    borderRadius: 16,
                    opacity: uri ? 1 : 0.2,
                  },
                ]}
              />
            )}
          </TouchableOpacity>
        ) : index === files.length ? (
          <TouchableOpacity
            style={[
              {
                ...TildStyleBase,
                borderRadius: 16,
                backgroundColor: colors.lightBlue,
                opacity: 0.1,
              },
            ]}
            onPress={() => pickImage()}
          />
        ) : (
          <View
            style={{
              ...TildStyleBase,
              borderRadius: 16,
              backgroundColor: colors.lightBlue,
              opacity: 0.1,
            }}
          />
        )}
        {uri && (
          <Button
            buttonStyle={{
              backgroundColor: 'transparent',
              padding: 0,
            }}
            containerStyle={{
              position: 'absolute',
              right: 0,
              top: 0,
              opacity: uri ? 1 : 0.2,
            }}
            icon={<Image source={redCloseX} />}
            disabled={!file}
            onPress={() => removeFile(file as LocalFile)}
          />
        )}
      </View>
    )
  }
  return (
    <View>
      <View
        style={{
          margin: '4%',
          flexDirection: 'row',
        }}
      >
        {range(0, 4).map(index => renderFile(index))}
      </View>
      <Text
        numberOfLines={2}
        style={{
          marginVertical: '2%',
          marginHorizontal: '4%',
          color: colors.lightBlue,
          opacity: 0.5,
        }}
      >
        Tap Image to make it first, tap the close button to remove
      </Text>
    </View>
  )
}

export function renderNewPeachScreen({
  canSubmit,
  onSubmit,
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
  setTitle: (title: string) => void
  pickImage: () => void
  files: LocalFile[]
  setFirst: (file: LocalFile) => void
  removeFile: (file: LocalFile) => void
}) {
  const {
    NewPeach: {
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
          marginLeft: '4%',
          marginRight: 0,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.lightGray,
        }}
      >
        <TextInput
          onChangeText={setTitle}
          onSubmitEditing={() => {
            if (subtitleTextInput.current) {
              subtitleTextInput.current.focus()
            }
          }}
          placeholderTextColor={colors.lightBlue}
          style={[
            app.h1,
            {
              paddingVertical: 15,
              color: colors.darkBlue,
            },
          ]}
          autoFocus
          placeholder={titleTextInputPlaceholder}
        />
      </View>
      <View
        style={{
          marginLeft: '4%',
          marginRight: 0,
          maringVertical: '2%',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.lightGray,
        }}
      >
        <TextInput
          style={[
            app.h3,
            {
              lineHeight: null,
              marginVertical: 15,
              color: colors.darkBlue,
              maxHeight: 100,
            },
          ]}
          numberOfLines={4}
          multiline
          onChangeText={setSubtitle}
          ref={subtitleTextInput}
          placeholderTextColor={colors.lightBlue}
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
          title={'Submit'}
          disabled={!canSubmit}
        />
      </View>
    </SafeAreaView>
  )
}

export function NewPeachScreen() {
  const files = useItemList({ items: [] }, isEqual)
  const { replace } = useNavigation()
  const [title, setTitle] = useState()
  const [subtitle, setSubtitle] = useState()
  const { pickImage } = useFilePicker(file => {
    files.addItem(file)
  })
  const canSubmit = useMemo(
    () =>
      subtitle &&
      subtitle.length > 4 &&
      title &&
      title.length > 0 &&
      files.items.length > 0,
    [subtitle, title, files.items],
  )

  return renderNewPeachScreen({
    canSubmit,
    onSubmit() {
      replace('SubmittingPeach', {
        peach: { files: files.items, title, subtitle },
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

NewPeachScreen.navigationOptions = ({
  navigation,
}: NavigationScreenConfigProps) => ({
  title: null,
  headerStyle,
  headerLeft: (
    <HeaderButton title='Cancel' onPress={() => navigation.popToTop()} />
  ),
})
