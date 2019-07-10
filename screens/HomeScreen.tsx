import React, { useState, useMemo, useCallback } from 'react'
import { FlatList } from 'react-navigation'
import {
  Alert,
  Image,
  SegmentedControlIOS,
  StyleSheet,
  View,
} from 'react-native'
import { useMappedState } from 'redux-react-hook'
import { createSelector } from 'reselect'
import { Button } from 'react-native-elements'

import {
  useStatusBarStyle,
  useMyPeaches,
  useLikes,
  useNavigation,
  useFirestore,
} from '../hooks'
import { addPeachButton } from '../assets'
import {
  PeachItem,
  Logo,
  EmptyPeachesBackground,
  EmptyLikedPeachesBackground,
} from '../components'
import { colors } from '../styles'
import { getCurrentUid } from '../getters'
import { getPeachInfo, toPeachInfo, stores } from '../helpers'
import { PeachInfo } from '../types'
import { SwipeableRow } from '../components/SwipeableRow'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

const AddPeachImage = () => <Image source={addPeachButton} />

export function HomeScreen() {
  const { navigate } = useNavigation()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { uid } = useMappedState(
    useCallback(
      createSelector(
        getCurrentUid,
        (uid: string) => ({
          uid,
        }),
      ),
      [],
    ),
  )
  const myPeaches = useMyPeaches()
  const { likes } = useLikes(uid)
  const likedPeaches = useMemo(() => likes.map(getPeachInfo), [likes])
  const reduxFirestore = useFirestore()


  function deletePeach(peach:PeachInfo) {
    reduxFirestore.delete({
      collection: 'peaches',
      doc: peach.id,
    })
  }

  function showDeleteAlert(peach: PeachInfo) {
    Alert.alert(
      'Please confirm',
      `This action will delete ${peach.title}`,
      [
        {
          text: 'Do it',
          onPress: () => deletePeach(peach),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        }
      ],
    )
  }

  useStatusBarStyle('dark-content')
  return (
    <View style={styles.container}>
      <View
        style={{
          elevation: 5,
          zIndex: 9999,
          position: 'absolute',
          bottom: 0,
          right: 0,
        }}
      >
        <Button
          ViewComponent={AddPeachImage}
          onPress={() => navigate('NewPeach')}
        />
      </View>
      <View
        style={{
          marginHorizontal: 15,
          paddingVertical: 15,
        }}
      >
        <SegmentedControlIOS
          tintColor={colors.darkBlue}
          values={['My Peaches', `Liked (${likedPeaches.length})`]}
          selectedIndex={selectedIndex}
          onChange={event =>
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
          }
        />
      </View>
      <FlatList<PeachInfo>
        data={selectedIndex === 0 ? myPeaches.map(toPeachInfo) : likedPeaches}
        keyExtractor={({ id }) => id}
        renderItem={({ item: peach }) => (
          <SwipeableRow
            backgroundColor={colors.offWhite}
            items={[
              {
                backgroundColor: colors.offWhite,
                icon: {
                  name: 'closecircle',
                  type: 'antdesign',
                  size: 24,
                  color: '#dd2c00',
                },
                onPress: () => showDeleteAlert(peach),
              },
            ]}
          >
            <PeachItem peach={peach} onPress={() => navigate('PeachDetails', { peachId: peach.id, store: stores.myPeaches })}/>
          </SwipeableRow>
        )}
        ListEmptyComponent={
          selectedIndex === 0 ? (
            <EmptyPeachesBackground />
          ) : (
            <EmptyLikedPeachesBackground />
          )
        }
      />
    </View>
  )
}

HomeScreen.navigationOptions = ({}) => ({
  title: 'My Peaches',
  headerTitle: Logo,
  headerStyle: {
    borderBottomWidth: 0,
  },
})
