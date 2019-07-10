import React, { useMemo, useEffect, useState, useRef } from 'react'
import { map, pipe, getOr, filter, get } from 'lodash/fp'
import { StyleSheet, Image, View } from 'react-native'
import { Button } from 'react-native-elements'
import {
  Logo,
  PulseAnim,
  SwipeLeftRight,
  LoadedFileImage,
  SwipeCardOverlay,
  PeachModal,
} from '../components'
import { useStatusBarStyle, usePeaches, useUid, useLikes } from '../hooks'
import { underwaterOnlineWorld, rewind, nope, like } from '../assets'
import { colors } from '../styles'
import { SwipeDirection, Peach, Position } from '../types'

export function DiscoverScreen() {
  const [seenById, setSeenIds] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [position, setPosition] = useState<Position>()
  const uid = useUid()

  const peaches = usePeaches()
  const { likes, likePeach } = useLikes(uid)

  useEffect(() => {
    if (showModal && swipteLeftRightRef.current) {
      swipteLeftRightRef.current.measure().then(setPosition)
    } else {
      setPosition(undefined)
    }
  }, [showModal])

  const peachesToSee = useMemo(
    () =>
      filter(
        pipe(
          get('id'),
          (id: string) => !seenById.includes(id) && !map('peachId', likes).includes(id),
        ),
        peaches,
      ),
    [seenById, peaches],
  )

  function handleSwipe(peach: Peach, direction: SwipeDirection) {
    if (direction === 'Right') {
      likePeach(peach)
    }
    setSeenIds([...seenById, peach.id])
  }

  const { topItem, bottomItem } = useMemo(
    () => ({
      topItem: peachesToSee.length > 0 ? peachesToSee[0] : null,
      bottomItem: peachesToSee.length > 1 ? peachesToSee[1] : null,
    }),
    [peachesToSee],
  )
  const swipteLeftRightRef = useRef<SwipeLeftRight>()

  function renderPulse() {
    return (
      <PulseAnim
        avatar={underwaterOnlineWorld}
        containerStyle={{
          position: 'absolute',
          ...StyleSheet.absoluteFillObject,
        }}
      />
    )
  }
  function renderCards() {
    return (
      <View
        style={{
          flex: 1,
          margin: 8,
        }}
      >
        <SwipeLeftRight
          ref={swipteLeftRightRef}
          onPress={() => {
            setShowModal(true)
          }}
          onSwiped={direction => topItem && handleSwipe(topItem, direction)}
          topCard={topItem && <LoadedFileImage file={topItem.files[0]} />}
          topOverlay={topItem && <SwipeCardOverlay {...topItem} />}
          bottomCard={bottomItem && <LoadedFileImage file={bottomItem.files[0]} />}
          bottomOverlay={bottomItem && <SwipeCardOverlay {...bottomItem} />}
        />
      </View>
    )
  }
  function renderButtons() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          padding: 16,
        }}
      >
        {[
          {
            source: rewind,
            onPress: () => undefined,
          },
          {
            source: nope,
            onPress: () => {
              if (swipteLeftRightRef.current) {
                swipteLeftRightRef.current.reset()
              }
            },
          },
          {
            source: like,
            onPress: () => undefined,
          },
        ].map(({ source, onPress }) => (
          <Button
            onPress={onPress}
            buttonStyle={{ zIndex: 9999 }}
            key={source}
            ViewComponent={() => <Image source={source} />}
          />
        ))}
      </View>
    )
  }

  function renderModal(position: Position) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <PeachModal peach={topItem} position={position} onRequestClose={() => {
          setShowModal(false)
        }}/>
      </View>
    )
  }
  useStatusBarStyle('light-content')

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: colors.peach,
          paddingVertical: 7,
        }}
      />
      {renderPulse()}
      {topItem && (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.white0,
          }}
        >
          {renderCards()}
          {renderButtons()}
        </View>
      )}
    </View>
  )
}

// {showModal && position && renderModal(position)}

// <View style={StyleSheet.absoluteFill}>
// <PeachModal {...{ story, position, onRequestClose }} />
// </View>
// )
// }

DiscoverScreen.navigationOptions = ({}) => ({
  headerTitle: <Logo white />,
  headerStyle: {
    backgroundColor: colors.peach,
    borderBottomWidth: 0,
  },
})

const cardOverlayStyle = StyleSheet.create({
  cardOverlayContainer: {},
  cardTitle: {
    color: colors.black1,
    fontSize: 32,
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: '500',
    fontStyle: 'normal',
  },
  cardSubtitle: {
    color: colors.gray,
    fontSize: 15,
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: '100',
    fontStyle: 'normal',
  },
})
const styles = StyleSheet.create({
  filePreview: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    aspectRatio: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: '#fbfaff',
  },
  cardsContainer: {
    flex: 1,
    margin: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
  },
})
