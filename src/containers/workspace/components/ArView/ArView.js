import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { SMArView } from 'imobile_for_reactnative'
import { MTBtn } from '../../../../components'
import { scaleSize } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { color } from '../../../../styles'
import { RNCamera } from 'react-native-camera'

export default class ArView extends React.Component {
  props: {}

  constructor(props) {
    super(props)
    this.state = {
      name: '公交站',
      x: 104.06827,
      y: 30.537225,
      isNaviPoint: true,
    }
    this.clickable = true
  }

  _renderARNavigationIcon = () => {
    return (
      <View style={styles.arnavigation}>
        <MTBtn
          style={styles.iconNav}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/Navigation/switch_ar_2d.png')}
          activeOpacity={0.5}
          onPress={this.changeAR}
        />
      </View>
    )
  }

  changeAR = () => {
    if (this.clickable) {
      this.clickable = false
      NavigationService.goBack()
    }
  }

  render() {
    return (
      <View style={styles.table}>
        {this._renderARNavigationIcon()}
        <SMArView
          style={styles.table}
          ARView={{
            name: GLOBAL.NAVIPOINTNAME,
            address: GLOBAL.NAVIPOINTADDRESS,
            isNaviPoint: this.state.isNaviPoint,
            x: GLOBAL.NAVIPOINTX,
            y: GLOBAL.NAVIPOINTY,
          }}
        />
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          {({ camera, status }) => {
            // recordAudioPermissionStatus
            if (status === 'READY') this.camera = camera
          }}
        </RNCamera>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  table: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  arnavigation: {
    backgroundColor: 'transparent',
    bottom: scaleSize(300),
    right: scaleSize(31),
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1000,
  },
  iconNav: {
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
    backgroundColor: color.blue2,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})
