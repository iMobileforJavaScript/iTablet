import PropTypes from 'prop-types'
import React from 'react'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewPropTypes,
  Text,
  View,
} from 'react-native'
// import MapView from 'react-native-maps'
import { scaleSize } from '../../../../utils/screen'
import NavigationService from '../../../NavigationService'
import { ConstOnline } from '../../../../constants'
import MSGConstant from '../MsgConstant'

export default class CustomView extends React.Component {
  props: {
    user: Object,
    currentMessage: any,
    position: '',
    onFileTouch: () => {},
  }

  touchFileCallback = (type, message) => {
    this.props.onFileTouch(type, message)
  }

  render() {
    let type = this.props.currentMessage.type
    /*
     * 文本消息，不渲染customview
     */
    if (type === MSGConstant.MSG_TEXT) {
      return null
    }
    /*
     * 文件下载通知消息，包括图层，数据集等
     */
    if (
      type === MSGConstant.MSG_FILE_NOTIFY ||
      type === MSGConstant.MSG_LAYER ||
      type === MSGConstant.MSG_DATASET
    ) {
      let fileType = this.props.currentMessage.type
      let fileSize = this.props.currentMessage.originMsg.message.message
        .fileSize
      let fileSizeText = fileSize.toFixed(2) + 'B'
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'KB'
      }
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'MB'
      }
      let typeText = ''
      switch (type) {
        case MSGConstant.MSG_FILE_NOTIFY:
          typeText = 'Map'
          break
        case MSGConstant.MSG_LAYER:
          typeText = 'Layer'
          break
        case MSGConstant.MSG_DATASET:
          typeText = 'Dataset'
          break
      }
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.touchFileCallback(fileType, this.props.currentMessage)
          }}
        >
          <View
            style={
              this.props.currentMessage.user._id !== this.props.user._id
                ? [styles.fileContainer, styles.fileContainerLeft]
                : [styles.fileContainer, styles.fileContainerRight]
            }
          >
            <Text
              style={
                this.props.position === 'left'
                  ? styles.fileName
                  : [styles.fileName, { color: 'white' }]
              }
            >
              {this.props.currentMessage.originMsg.message.message.fileName}
            </Text>
            <Text
              style={
                this.props.position === 'left'
                  ? styles.fileSize
                  : [styles.fileSize, { color: 'white' }]
              }
            >
              {typeText + '  ' + fileSizeText}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
    /*
     * 定位消息
     */
    if (type === MSGConstant.MSG_LOCATION) {
      let text = this.props.currentMessage.originMsg.message.message.message
      // 'LOCATION(' +
      // this.props.currentMessage.originMsg.message.message.longitude.toFixed(
      //   6,
      // ) +
      // ',' +
      // this.props.currentMessage.originMsg.message.message.latitude.toFixed(
      //   6,
      // ) +
      // ')'
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
              mapName: this.props.currentMessage.originMsg.message.message
                .message,
              showMarker: {
                longitude: this.props.currentMessage.originMsg.message.message
                  .longitude,
                latitude: this.props.currentMessage.originMsg.message.message
                  .latitude,
              },
              backAction: () => {
                NavigationService.pop()
                NavigationService.replace('CoworkTabs', {
                  targetId: this.props.currentMessage.originMsg.user.groupID,
                })
              },
            })
          }}
        >
          <View
            style={{
              width: scaleSize(340),
              padding: scaleSize(5),
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../../../assets/lightTheme/friend/app_chat_pin.png')}
              style={{
                width: scaleSize(45),
                height: scaleSize(45),
              }}
            />
            <Text
              style={{
                // textAlign: 'center',
                fontSize: scaleSize(20),
                color: textColor,
              }}
            >
              {text}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }
    /*
     * 未在上面处理的消息
     */
    let textColor = 'white'
    if (this.props.position === 'left') {
      textColor = 'black'
    }
    return (
      <Text
        style={{
          textAlign: 'center',
          fontSize: scaleSize(20),
          color: textColor,
        }}
      >
        {'暂不支持的消息类型'}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  fileContainer: {
    // backgroundColor: 'white',
    width: scaleSize(240),
    justifyContent: 'flex-start',
  },
  fileContainerLeft: {
    alignItems: 'flex-end',
    // borderTopRightRadius: scaleSize(10),
  },
  fileContainerRight: {
    alignItems: 'flex-start',
    // borderTopLeftRadius: scaleSize(10),
  },
  fileName: {
    marginTop: scaleSize(10),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    fontSize: scaleSize(24),
    color: 'black',
  },
  fileSize: {
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    marginBottom: scaleSize(10),
    fontSize: scaleSize(20),
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
