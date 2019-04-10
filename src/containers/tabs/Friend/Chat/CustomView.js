import PropTypes from 'prop-types'
import React from 'react'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
  Text,
  View,
} from 'react-native'
// import MapView from 'react-native-maps'
import { scaleSize } from '../../../../utils/screen'
import NavigationService from '../../../NavigationService'
import { ConstOnline } from '../../../../constants'

export default class CustomView extends React.Component {
  props: {
    user: Object,
    currentMessage: any,
    position: '',
  }

  render() {
    if (
      this.props.currentMessage.message.type &&
      this.props.currentMessage.message.type === 6
    ) {
      let fileSize = this.props.currentMessage.message.message.fileSize
      let fileSizeText = ''
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'KB'
      }
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'MB'
      }
      return (
        <View
          style={
            this.props.currentMessage.user._id !== this.props.user._id
              ? styles.container1
              : [styles.container1, styles.container2]
          }
        >
          <Text style={styles.fileName}>
            {this.props.currentMessage.message.message.fileName}
          </Text>
          <Text style={styles.fileSize}>{fileSizeText}</Text>
        </View>
      )
    }
    if (
      this.props.currentMessage.message.type &&
      this.props.currentMessage.message.type === 10
    ) {
      let text =
        'LOCATION(' +
        this.props.currentMessage.message.message.longitude.toFixed(6) +
        ',' +
        this.props.currentMessage.message.message.latitude.toFixed(6) +
        ')'
      let textColor = 'white'
      if (this.props.position === 'left') {
        textColor = 'black'
      }
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
            let wsData = JSON.parse(JSON.stringify(ConstOnline.Google))
            wsData.layerIndex = 3
            NavigationService.navigate('MapView', {
              wsData,
              isExample: true,
              mapName: this.props.currentMessage.message.message.message,
              showMarker: {
                longitude: this.props.currentMessage.message.message.longitude,
                latitude: this.props.currentMessage.message.message.latitude,
              },
            })
          }}
        >
          <Image
            source={require('../../../../assets/lightTheme/friend/app_chat_pin.png')}
            style={{
              width: scaleSize(45),
              height: scaleSize(45),
              marginTop: scaleSize(10),
              marginLeft: scaleSize(10),
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: scaleSize(20),
              color: textColor,
            }}
          >
            {text}
          </Text>
        </TouchableOpacity>
      )
    }
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  container1: {
    backgroundColor: 'white',
    width: scaleSize(150),
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    borderTopLeftRadius: scaleSize(12),
    borderTopRightRadius: scaleSize(12),
  },
  container2: {
    alignItems: 'flex-start',
  },
  fileName: {
    marginTop: scaleSize(10),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    fontSize: scaleSize(14),
    color: 'black',
  },
  fileSize: {
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    marginBottom: scaleSize(10),
    fontSize: scaleSize(12),
  },
  // mapView: {
  //   width: 150,
  //   height: 100,
  //   borderRadius: 13,
  //   margin: 3,
  //   backgroundColor:'red',
  // },
})

CustomView.defaultProps = {
  currentMessage: {},
  containerStyle: {},
  mapViewStyle: {},
}

CustomView.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  mapViewStyle: ViewPropTypes.style,
}
