import React from 'react'
import {
  StyleSheet,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Text,
} from 'react-native'
import { StoreContext } from 'redux-react-hook';
import { Avatar } from 'react-native-elements'
import { widthPercent, colors } from '../styles'
import { UserProfileImageAvatar } from './UserProfileImageAvatar'
import { toFullName, getIntials } from '../getters'
import { Store } from '../store/store'
import {
  useCurrentUser,
  useFilePicker,
  useFirestore,
  useUserProfileImage,
} from '../hooks'
import {
  generateUserProfileImageFileName,
  toUserProfileImageUpdateForFile,
} from '../helpers'
import { User, FileUploadTaskRequest } from '../types'
import { app } from '../styles'
import { showError } from './showError'

const styles = StyleSheet.create({
  avatarLayoutContainer: {
    paddingVertical: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    marginHorizontal: 15,
    borderWidth: 0.5,
    borderColor: colors.gray,
  },
  screen: {
    flex: 1,
  },
  rootScrollView: {
    paddingHorizontal: widthPercent(8),
  },
})

type Props = {
  user: User
  uri: string | undefined | null
  isCurrentUser: boolean
  uploadingImage: boolean
  pickingImage: boolean
  pickImage: () => void
}

const renderHeaderComponent = ({
  user,
  uri,
  isCurrentUser,
  uploadingImage,
  pickingImage,
  pickImage,
}: Props) => (
  <View>
    <TouchableHighlight
      disabled={uploadingImage || pickingImage}
      onPress={pickImage}
      underlayColor='transparent'
    >
      <View style={styles.avatarLayoutContainer}>
        <Avatar
          showEditButton={isCurrentUser && !uploadingImage}
          onEditPress={isCurrentUser && !uploadingImage ? pickImage : null}
          onEdit
          size='large'
          rounded
          onPress={pickImage}
          containerStyle={styles.avatarContainer}
          {...{
            title: getIntials(user),
            source: uri && { uri },
          }}
        />
        {isCurrentUser && uploadingImage && (
          <View>
            <Text>Uploading</Text>
            <ActivityIndicator />
          </View>
        )}
      </View>
    </TouchableHighlight>
    <View
      style={{
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={[app.h3, { fontWeight: 'bold' }]}>{toFullName(user)}</Text>
    </View>
  </View>
)

export function UserProfileHeaderComponent() {
  const reduxFirestore = useFirestore()
  const user = useCurrentUser() as User
  const { dispatch } = React.useContext<Store>(StoreContext)
  const [uploadingImage, setUploadingImage] = React.useState(false)
  const { pickImage, loading: pickingImage } = useFilePicker(async file => {
    setUploadingImage(true)
    try {
      const uploadRequest :FileUploadTaskRequest = {
        file,
        fileReference: {
          collection: 'users',
          doc: user.uid,
          createdByUid: user.uid,
          fileName: generateUserProfileImageFileName()
        }
      }
      await dispatch.storage.upload(uploadRequest)
      reduxFirestore.update(
        { collection: 'users', doc: user.uid },
        toUserProfileImageUpdateForFile(uploadRequest),
      )
      if(user.profileImageFilename) {
        await dispatch.storage.delete({
          createdByUid: user.uid,
          collection: 'users',
          doc: user.uid,
          fileName: user.profileImageFilename
        })
      }
    } catch (error) {
      showError(error)
    } finally {
      setUploadingImage(false)
    }
  })  
  
  const uri = useUserProfileImage(user)

  return renderHeaderComponent({
    isCurrentUser: true,
    user,
    uri,
    pickImage: () =>
      pickImage({
        cropperCircleOverlay: true,
        width: 540,
        height: 540,
      }),
    pickingImage,
    uploadingImage: !!uploadingImage,
  })
}
