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
  Platform,
} from 'react-native'
import { getLanguage } from '../../../../language/index'
import { SOnlineService } from 'imobile_for_reactnative'
import { scaleSize } from '../../../../utils/screen'
import NavigationService from '../../../NavigationService'
import { Const } from '../../../../constants'
var Geolocation = undefined
if (Platform.OS === 'ios') {
  var GeolocationIOS = require('Geolocation')
} else {
  import('react-native-amap-geolocation').then(result => {
    Geolocation = result.default.Geolocation
  })
}

// eslint-disable-next-line no-unused-vars
const ICONS = context => [
  {
    name: require('../../../../assets/lightTheme/friend/app_chat_map.png'),
    type: 'ionicon',
    text: getLanguage(global.language).Friends.MAP,
    onPress: () => {
      NavigationService.navigate('MyData', {
        title: Const.MAP,
        formChat: true,
        // eslint-disable-next-line
        chatCallBack: _path => {
          // console.warn(path)
          context.props.sendCallBack(1, _path)
        },
      })
      context.setModalVisible()
    },
  },
  {
    name: require('../../../../assets/lightTheme/friend/app_chat_data.png'),
    type: 'ionicon',
    text: getLanguage(global.language).Friends.TEMPLATE,
    onPress: () => {
      NavigationService.navigate('MyModule', {
        formChat: true,
        // eslint-disable-next-line
        chatCallBack: _path => {},
      })
      context.setModalVisible()
    },
  },
  {
    name: require('../../../../assets/lightTheme/friend/app_chat_location.png'),
    type: 'material',
    text: getLanguage(global.language).Friends.LOCATION,
    onPress: () => {
      context.setModalVisible()
      context.handleLocationClick()
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

  componentDidMount() {
    if (Platform.OS === 'android') {
      Geolocation.init({
        ios: '9bd6c82e77583020a73ef1af59d0c759',
        android: '078057f0e29931c173ad8ec02284a897',
      }).then(() => {
        Geolocation.setOptions({
          interval: 8000,
          distanceFilter: 20,
        })
        Geolocation.addLocationListener(location => {
          Geolocation.stop()
          SOnlineService.reverseGeocoding(
            location.longitude,
            location.latitude,
            {
              onResult: result => {
                this.props.sendCallBack(3, {
                  address: result,
                  longitude: location.longitude,
                  latitude: location.latitude,
                })
                // alert(result)
              },
            },
          )
        })
      })
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      // Geolocation.removeLocationListener();
      Geolocation.stop()
    }
  }
  setModalVisible(visible = false) {
    if (visible) {
      this.props.callBack(scaleSize(400))
    } else {
      this.props.callBack(scaleSize(0))
    }
    this.setState({ modalVisible: visible })
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
      </TouchableOpacity>
    )
  }

  handleLocationClick = () => {
    if (Platform.OS === 'ios') {
      GeolocationIOS.getCurrentPosition(
        location => {
          SOnlineService.reverseGeocoding(
            location.coords.longitude,
            location.coords.latitude,
            {
              onResult: result => {
                this.props.sendCallBack(3, {
                  address: result,
                  longitude: location.coords.longitude,
                  latitude: location.coords.latitude,
                })
                // alert(result)
              },
            },
          )
        },
        error => {
          alert(
            getLanguage(global.language).Friends.LOACTION_FAILED + '：' + error,
          )
        },
      )
    } else {
      Geolocation.start()
    }
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
