import React from 'react'
import RootSiblings from 'react-native-root-siblings'
import PageKeys from './PageKeys'
import PhotoModalPage from './PhotoModalPage'
import AlbumListView from './AlbumListView'
import AlbumView from './AlbumView'
// import PreviewMultiView from './PreviewMultiView'

/**
 * --OPTIONS--
 * maxSize?: number. Camera or Video.
 * sideType?: RNCamera.Constants.Type. Camera or Video.
 * flashMode?: RNCamera.Constants.FlashMode. Camera or Video.
 * pictureOptions?: RNCamera.PictureOptions. Camera.
 * recordingOptions?: RNCamera.RecordingOptions Video.
 * callback: (data: any[]) => void. Donot use Alert.
 */

export const getAlbum = options => showImagePicker(PageKeys.album_list, options)

let sibling = null

function showImagePicker(initialRouteName, options) {
  if (sibling) {
    return null
  }
  sibling = new RootSiblings(
    (
      <PhotoModalPage
        initialRouteName={initialRouteName}
        onDestroy={() => {
          sibling && sibling.destroy()
          sibling = null
        }}
        {...options}
      />
    ),
  )
}

export {
  PhotoModalPage,
  // PreviewMultiView,
  AlbumListView,
  AlbumView,
}
