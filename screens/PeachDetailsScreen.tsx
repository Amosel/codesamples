import * as React from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-navigation'
import { Button, Avatar } from 'react-native-elements'
import { StorageImage } from '../components'
import { useNavigation, usePeach, useUid } from '../hooks'
import { colors, app } from '../styles'
import { greenCheckMark, editProfile, iconsSizePlaceholder } from '../assets'
import { Peach } from '../types'
import { useProfileImageForUid } from '../hooks'
import { getStorageRef } from '../helpers'

function renderUserRoundedProfileImage(uid: string) {
  const uri = useProfileImageForUid(uid)
  return (
    <Avatar key={uid} rounded source={uri ? { uri } : iconsSizePlaceholder} />
  )
}

function renderPeachDetailScreen({
  title,
  subtitle,
  teamUids,
  deckFileRefs,
  showEditScreen,
}: {
  title: string
  subtitle: string
  teamUids: string[]
  deckFileRefs: string[]
  showEditScreen: () => void
}) {
  return (
    <ScrollView
      contentContainerStyle={[app.container, { paddingHorizontal: 0 }]}
      stickyHeaderIndices={[0]}
    >
      <View
        style={{
          flex: 1,
          marginLeft: '4%',
          marginRight: 0,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.lightGray,
          backgroundColor: colors.white,
        }}
      >
        <View
          style={{
            paddingRight: '4%',
            paddingVertical: '2%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={[
              app.h1,
              {
                textAlign: 'left',
              },
            ]}
          >
            {title}
          </Text>
          <Button
            onPress={showEditScreen}
            buttonStyle={[
              {
                backgroundColor: 'transparent',
              },
            ]}
            icon={<Image source={editProfile} />}
          />
        </View>
      </View>
      <View
        style={{
          marginLeft: '4%',
          marginRight: 0,
          paddingVertical: '2%',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.lightGray,
        }}
      >
        <Text
          style={[
            app.h3,
            {
              paddingVertical: '2%',
              paddingRight: '4%',
              textAlign: 'left',
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          marginLeft: '4%',
          marginRight: 0,
          paddingRight: '4%',
          paddingVertical: '2%',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.lightGray,
        }}
      >
        <Text
          style={[
            app.h5,
            {
              paddingVertical: '2%',
              paddingRight: '4%',
              textAlign: 'left',
            },
          ]}
        >
          Team
        </Text>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 14,
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}
          >
            {teamUids.map(renderUserRoundedProfileImage)}
          </View>
        </View>
      </View>
      <View
        style={{
          margin: '4%',
          flexDirection: 'row',
        }}
      >
        {deckFileRefs.map(storageRef => (
          <View
            key={storageRef}
            style={{
              marginRight: '1%',
              paddingRight: '2%',
              paddingVertical: '1.5%',
              aspectRatio: 1,
              width: '20.5%',
            }}
          >
            <View
              style={{
                padding: 10,
                aspectRatio: 1,
              }}
            >
              <StorageImage
                {...{
                  storageRef,
                  style: { borderRadius: 16 },
                }}
              />
            </View>
            <Image
              source={greenCheckMark}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
export function PeachDetailsScreen() {
  const { getParam, navigate } = useNavigation()
  const peachId = getParam('peachId')
  const store = getParam('store')
  const peach = usePeach(peachId, store) as Peach

  return renderPeachDetailScreen({
    title: peach.title,
    subtitle: peach.subtitle,
    deckFileRefs: peach.files.map(fileName =>
      getStorageRef({
        collection: 'peaches',
        doc: peachId,
        fileName,
      }),
    ),
    teamUids: peach.teamUids,
    showEditScreen: () => navigate('EditPeach', { peachId, store }),
  })
}
