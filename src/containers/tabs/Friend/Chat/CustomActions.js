/**
 * Created by imobile-xzy on 2019/3/9.
 */
import PropTypes from 'prop-types'
import React from 'react'
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Text,
  Image,
  NativeModules,
  NetInfo,
  Platform,
  PermissionsAndroid,
} from 'react-native'
import { getLanguage } from '../../../../language/index'
import { SOnlineService } from 'imobile_for_reactnative'
import { scaleSize } from '../../../../utils/screen'
import NavigationService from '../../../NavigationService'
import { SimpleDialog } from '../Component'
import { Toast } from '../../../../utils'
import { ImagePicker } from '../../../../components'
let AppUtils = NativeModules.AppUtils

// if (Platform.OS === 'android') {
//   var AMapGeolocation = require('react-native-amap-geolocation')
// } else {
//   var GeolocationIOS = require('Geolocation')
// }

// eslint-disable-next-line no-unused-vars
const ICONS = context => [
  {
    name: require('../../../../assets/lightTheme/friend/app_chat_map.png'),
    type: 'ionicon',
    text: getLanguage(global.language).Friends.MAP,
    onPress: () => {
      NavigationService.navigate('MyMap', {
        title: getLanguage(global.language).Profile.MAP,
        chatCallback: (_path, fileName) => {
          context.props.sendCallBack(1, _path, fileName)
        },
      })
      context.setModalVisible()
    },
  },
  // {
  //   name: require('../../../../assets/lightTheme/friend/app_chat_data.png'),
  //   type: 'ionicon',
  //   text: getLanguage(global.language).Friends.TEMPLATE,
  //   onPress: () => {
  //     NavigationService.navigate('MyModule', {
  //       formChat: true,
  //       // eslint-disable-next-line
  //       chatCallBack: _path => {},
  //     })
  //     context.setModalVisible()
  //   },
  // },
  {
    name: require('../../../../assets/lightTheme/friend/app_chat_location.png'),
    type: 'material',
    text: getLanguage(global.language).Friends.LOCATION,
    onPress: () => {
      context.setModalVisible()
      context.handleLocationClick()
    },
  },
  {
    name: require('../../../../assets/lightTheme/friend/app_chat_pic.png'),
    type: 'material',
    text: getLanguage(global.language).Friends.PICTURE,
    onPress: () => {
      context.setModalVisible()
      ImagePicker.AlbumListView.defaultProps.showDialog = false
      ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
      ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
      ImagePicker.getAlbum({
        maxSize: 1,
        callback: async data => {
          // console.log(data)
          if (data.length > 0) {
            context.props.sendCallBack(2, data[0])
          }
        },
      })
    },
  },
]

export default class CustomActions extends React.Component {
  props: {
    callBack: () => {},
    sendCallBack: () => {},
  }

  constructor(props) {
    super(props)
    this._images = []
    this.state = {
      modalVisible: false,
    }
    // this.onActionsPress = this.onActionsPress.bind(this)
    // this.selectImages = this.selectImages.bind(this)
  }

  componentDidMount() {}
  componentWillUnmount() {}
  setModalVisible(visible = false) {
    if (visible) {
      this.props.callBack(scaleSize(400))
    } else {
      this.props.callBack(scaleSize(0))
    }
    this.setState({ modalVisible: visible })
  }

  handleLocationClick = async () => {
    let isConnected = await NetInfo.isConnected.fetch()
    if (!isConnected) {
      Toast.show(getLanguage(global.language).Prompt.NO_NETWORK)
      return
    }
    if (!(await AppUtils.isLocationOpen())) {
      this.SimpleDialog.setConfirm(() => {
        AppUtils.startAppLoactionSetting()
      })
      this.SimpleDialog.setText(
        getLanguage(global.language).Prompt.OPEN_LOCATION,
      )
      this.SimpleDialog.setVisible(true)
      return
    }

    let allowed = true
    if (Platform.OS === 'ios') {
      if (!(await AppUtils.isLocationAllowed())) {
        allowed = false
      }
    } else {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
      if (PermissionsAndroid.RESULTS.GRANTED !== granted) {
        allowed = false
      }
    }
    if (!allowed) {
      this.SimpleDialog.setConfirm(() => {
        AppUtils.startAppLoactionSetting()
      })
      this.SimpleDialog.setText(
        getLanguage(global.language).Prompt.REQUEST_LOCATION,
      )
      this.SimpleDialog.setVisible(true)
      return
    }

    let location = await AppUtils.getCurrentLocation()
    if (location.longitude === 0 && location.latitude === 0) {
      Toast.show(getLanguage(global.language).Prompt.LOCATION_ERROR)
      return
    }
    SOnlineService.reverseGeocoding(location.longitude, location.latitude, {
      onResult: result => {
        this.props.sendCallBack(3, {
          address: result,
          longitude: location.longitude,
          latitude: location.latitude,
        })
      },
    })
  }

  renderIcon() {
    if (this.props.icon) {
      return this.props.icon()
    }
    return (
      <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
      </View>
    )
  }

  renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={() => {
          this.setModalVisible(true)
        }}
      >
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          animationType={'fade'}
          onRequestClose={() => this.setModalVisible()}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={modalStyles.overlay}
              activeOpacity={1}
              onPress={() => this.setModalVisible()}
            />

            <View style={modalStyles.modal}>
              {ICONS(this).map((v, i) => (
                <View
                  key={i}
                  style={[
                    modalStyles.itemView,
                    {
                      marginRight: (i + 1) % 4 === 0 ? 0 : scaleSize(40),
                    },
                  ]}
                >
                  <TouchableOpacity onPress={() => v.onPress(this)}>
                    <Image
                      source={v.name}
                      style={{ width: scaleSize(85), height: scaleSize(85) }}
                    />
                  </TouchableOpacity>
                  <Text style={modalStyles.textStyle}>{v.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </Modal>
        {this.renderIcon()}
        {this.renderSimpleDialog()}
      </TouchableOpacity>
    )
  }
}
const modalStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#rgba(255,0,0,0)',
  },
  modal: {
    position: 'absolute',
    backgroundColor: 'white',
    borderTopColor: '#rgba(160,160,160,1)',
    borderTopWidth: 1,
    right: 0,
    bottom: 0,
    left: 0,
    height: scaleSize(400),
    padding: scaleSize(5),
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  itemView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleSize(20),
    marginLeft: scaleSize(20),
    width: scaleSize(110),
    height: scaleSize(90),
  },
  textStyle: {
    color: 'black',
    fontSize: scaleSize(25),
    // marginLeft: scaleSize(6),
    textAlign: 'center',
  },
  imgStyle: {
    width: 20,
    height: 20,
  },
})
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
}

CustomActions.defaultProps = {
  onSend: () => {},
  options: {},
  icon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
}

CustomActions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  icon: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style,
}
