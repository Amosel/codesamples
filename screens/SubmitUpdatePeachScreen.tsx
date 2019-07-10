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
import { LocalFile, FileUploadTaskRequest, FirestoreUpdate } from '../types'
import { toFirestorePeach, createDoc } from '../helpers'

export function renderSubmitUpdatePeachScreen(submitting: boolean) {
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

export function SubmitUpdatePeachScreen() {
  const { getParam } = useNavigation()
  const [submitting, setStubmitting] = useState(true)
  const reduxFirestore = useFirestore()
  const uid = useUid()
  const { dispatch } = React.useContext<Store>(StoreContext)

  useEffect(() => {
    async function Submit({
      update,
      uploads,
    }: {
      update: FirestoreUpdate
      uploads: FileUploadTaskRequest[]
    }) {
      try {
        await dispatch.storage.uploadMany(uploads)
        await reduxFirestore.update(update.docPath, update.data)
        setStubmitting(false)
      } catch (error) {
        setStubmitting(false)
        showError(error)
      }
    }
    const update = getParam('update')
    const uploads = getParam('uploads')
    debugger

    setStubmitting(true)
    Submit({ update, uploads })
  }, [])

  return renderSubmitUpdatePeachScreen(submitting)
}

SubmitUpdatePeachScreen.navigationOptions = {
  header: null,
}
