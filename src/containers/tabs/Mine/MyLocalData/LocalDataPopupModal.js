import React, { PureComponent } from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import PopView from '../../../../components/PopView/PopView'
const screenWidth = '100%'
export default class LocalDataPopupModal extends PureComponent {
  props: {
    language: string,
    onDeleteData: () => {},
    onImportWorkspace: () => {},
    onPublishService: () => {},
    onDeleteService: () => {},
    onChangeDataVisibility: () => {},
  }

  constructor(props) {
    super(props)
    this.fontSize = size.fontSize.fontSizeXl
    this.state = {
      data: {},
    }
  }

  setData = data => {
    this.setState({ data })
  }

  _renderSeparatorLine = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }

  _onImportWorkspace = () => {
    let height = scaleSize(80)
    let lineHeight = scaleSize(80)
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onImportWorkspace()
        }}
      >
        <Text
          style={{
            width: '100%',
            height: height,
            backgroundColor: color.content_white,
            textAlign: 'center',
            lineHeight: lineHeight,
            fontSize: this.fontSize,
          }}
        >
          {/* 导入数据 */}
          {getLanguage(this.props.language).Profile.IMPORT_DATA}
        </Text>
        {this._renderSeparatorLine()}
      </TouchableOpacity>
    )
  }
  _onDeleteButton = () => {
    let height = scaleSize(80)
    let lineHeight = scaleSize(80)
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onDeleteData()
        }}
      >
        <Text
          style={{
            width: '100%',
            height: height,
            backgroundColor: color.content_white,
            textAlign: 'center',
            lineHeight: lineHeight,
            fontSize: this.fontSize,
          }}
        >
          {/* 删除 */}
          {getLanguage(this.props.language).Profile.DELETE_DATA}
        </Text>
        {this._renderSeparatorLine()}
      </TouchableOpacity>
    )
  }

  setVisible = visible => {
    this.PopView && this.PopView.setVisible(visible)
  }
  _publishServiceButton = () => {
    let title = getLanguage(global.language).Profile.PUBLISH_SERVICE
    //'发布服务'
    let objContent = this.state.data
    if (objContent && objContent.dataItemServices) {
      if (
        objContent.serviceStatus === 'PUBLISHED' ||
        objContent.serviceStatus === 'PUBLISHING'
      ) {
        return <View />
      }
      // let dataItemServices = objContent.dataItemServices
      // for (let i = 0; i < dataItemServices.length; i++) {
      //   let serviceType = dataItemServices[i].serviceType
      //   if (serviceType === 'RESTMAP') {
      // title =
      //   getLanguage(global.language).Profile.DELETE +
      //   dataItemServices[i].serviceName +
      //   getLanguage(global.language).Profile.SERVICE
      // title =
      //     getLanguage(global.language).Profile.DELETE +
      //     getLanguage(global.language).Profile.SERVICE
      //   return <View />
      // }
      // }
      return (
        <TouchableOpacity
          style={{ backgroundColor: color.itemColorWhite }}
          onPress={async () => {
            if (
              title === getLanguage(global.language).Profile.PUBLISH_SERVICE
            ) {
              this.props.onPublishService()
            } else {
              this.props.onDeleteService()
            }
          }}
        >
          <Text
            style={{
              lineHeight: scaleSize(80),
              width: screenWidth,
              position: 'relative',
              textAlign: 'center',
              fontSize: this.fontSize,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {this._renderSeparatorLine()}
        </TouchableOpacity>
      )
    } else {
      return <View />
    }
  }

  _dataVisibleButton = () => {
    if (this.state.data && this.state.data.authorizeSetting) {
      let isPublish = false
      let authorizeSetting = this.state.data.authorizeSetting
      for (let i = 0; i < authorizeSetting.length; i++) {
        let dataPermissionType = authorizeSetting[i].dataPermissionType
        if (dataPermissionType === 'DOWNLOAD') {
          isPublish = true
          break
        }
      }
      let title
      if (isPublish) {
        title = getLanguage(global.language).Profile.SET_AS_PRIVATE_DATA
        //'设为私有数据'
      } else {
        title = getLanguage(global.language).Profile.SET_AS_PUBLIC_DATA
        //'设为公有数据'
      }
      return (
        <TouchableOpacity
          style={{ backgroundColor: color.itemColorWhite }}
          onPress={async () => {
            this.props.onChangeDataVisibility()
          }}
        >
          <Text
            style={{
              lineHeight: scaleSize(80),
              width: screenWidth,
              position: 'relative',
              textAlign: 'center',
              fontSize: this.fontSize,
            }}
          >
            {title}
          </Text>
          {this._renderSeparatorLine()}
        </TouchableOpacity>
      )
    } else {
      return <View />
    }
  }

  render() {
    // let animationType = Platform.OS === 'ios' ? 'slide' : 'fade'
    //let animationType = 'fade'
    return (
      <PopView ref={ref => (this.PopView = ref)}>
        <View
          style={{
            width: '100%',
            backgroundColor: color.contentColorWhite,
          }}
        >
          {this.props.onImportWorkspace && this._onImportWorkspace()}
          {this._publishServiceButton()}
          {this._onDeleteButton()}
          {this._dataVisibleButton()}
        </View>
      </PopView>
      // <Modal
      //   animationType={animationType}
      //   transparent={true}
      //   onRequestClose={this._onRequestClose}
      //   supportedOrientations={[
      //     'portrait',
      //     'portrait-upside-down',
      //     'landscape',
      //     'landscape-left',
      //     'landscape-right',
      //   ]}
      //   style={{ flex: 1 }}
      //   visible={this.props.modalVisible}
      // >
      //   <TouchableOpacity
      //     activeOpacity={1}
      //     onPress={() => {
      //       this._onCloseModal()
      //     }}
      //     style={{ flex: 1, backgroundColor: color.modalBgColor }}
      //   >
      //     <View
      //       style={{
      //         flex: 1,
      //         position: 'absolute',
      //         bottom: 0,
      //         left: 0,
      //         right: 0,
      //       }}
      //     >
      //       {this.props.onImportWorkspace && this._onImportWorkspace()}
      //       {this._publishServiceButton()}
      //       {this._onDeleteButton()}
      //       {this._dataVisibleButton()}
      //     </View>
      //   </TouchableOpacity>
      // </Modal>
    )
  }
}
