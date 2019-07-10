import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  Text,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { StoreContext } from 'redux-react-hook'
import { Store } from '../store/store'
import { Button } from 'react-native-elements'
import { peachSuccessGraphic } from '../assets'
import { app, colors, welcomeButton } from '../styles'
import { useNavigation, useFirestore, useUid } from '../hooks'
import { showError } from '../components'
import { LocalFile, FileUploadTaskRequest } from '../types'
import {
  toFirestorePeach,
  createDoc,
  getStorageRef,
  pathForStoragageRef,
  peachDeckFilenameAtIndex
} from '../helpers'

export function renderNewPeachSubmittingScreen(submitting: boolean) {
  const { popToTop } = useNavigation()
  if (submitting) {
    return (
      <View
        style={[{ ...StyleSheet.absoluteFillObject, justifyContent: 'center' }]}
      >
        <ActivityIndicator size='large' color={colors.lightBlue} />
      </View>
    )
  }
  return (
    <SafeAreaView
      style={[
        app.container,
        {
          flex: 1,
          paddingHorizontal: '4%',
          paddingVertical: '2%',
          justifyContent: 'space-between',
          alignItems: 'stretch',
        },
      ]}
    >
      <View>
        <Text
          style={[
            app.h2,
            { color: colors.darkBlue, marginTop: '20%', textAlign: 'center' },
          ]}
        >
          Your Peach Was Added
        </Text>
        <Text
          numberOfLines={0}
          style={[
            app.h4,
            {
              color: colors.darkBlue,
              marginVertical: '10%',
              textAlign: 'center',
            },
          ]}
        >
          {'Your peach will go live shortly. Thank you for submitting!'}
        </Text>
        <View
          style={{
            marginVertical: '10%',
            alignItems: 'center',
          }}
        >
          <Image source={peachSuccessGraphic} />
        </View>
      </View>
      <Button
        onPress={() => {
          popToTop()
        }}
        containerStyle={{
          paddingHorizontal: '4%',
        }}
        buttonStyle={[welcomeButton.container]}
        titleStyle={welcomeButton.text}
        title={'Done'}
        disabled={submitting}
      />
    </SafeAreaView>
  )
}

export function NewPeachSubmittingScreen() {
  const { getParam } = useNavigation()
  const [submitting, setStubmitting] = useState(true)
  const reduxFirestore = useFirestore()
  const uid = useUid()
  const { dispatch } = React.useContext<Store>(StoreContext)

  useEffect(() => {
    async function Submit(
      localFiles: LocalFile[],
      subtitle: string,
      title: string,
    ) {
      const collection = 'peaches'
      const doc = createDoc(collection)
      
      try {
        const requests: FileUploadTaskRequest[] = localFiles.map(
          (file: LocalFile, index: number): FileUploadTaskRequest => ({
            file,
            fileReference: {
              collection: 'peaches',
              doc,
              createdByUid: uid,
              fileName: peachDeckFilenameAtIndex(index)
            },
          }),
        )
        await dispatch.storage.uploadMany(requests)
        await reduxFirestore.set(
          { collection, doc },
          toFirestorePeach({
            subtitle,
            title,
            files: requests.map((request: FileUploadTaskRequest) => {
              return request.fileReference.fileName
            }),
            uid,
          }),
        )
        setStubmitting(false)
      } catch (error) {
        setStubmitting(false)
        showError(error)
      }
    }
    const {
      files,
      subtitle,
      title,
    }: {
      files: LocalFile[]
      title: string
      subtitle: string
    } = getParam('peach')
    setStubmitting(true)
    Submit(files, subtitle, title)
  }, [])

  return renderNewPeachSubmittingScreen(submitting)
}

NewPeachSubmittingScreen.navigationOptions = {
  header: null,
}
