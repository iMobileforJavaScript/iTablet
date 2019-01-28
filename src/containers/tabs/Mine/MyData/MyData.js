import React, { Component } from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'
import { Container, ListSeparator, TextBtn } from '../../../../components'
import { ConstPath, ConstInfo, Const } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import MyDataPopupModal from './MyDataPopupModal'
import { color } from '../../../../styles'
import NavigationService from '../../../NavigationService'

import UserType from '../../../../constants/UserType'

export default class MyLocalData extends Component {
  props: {
    user: Object,
    navigation: Object,
    upload: Object,
    uploading: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.state = {
      sectionData: [],
      // userName: this.props.navigation.getParam('userName', ''),
      modalIsVisible: false,
      textValue: '扫描文件:',
      textDisplay: 'flex',
      title: (params && params.title) || '',
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    try {
      let userPath = await FileTools.appendingHomeDirectory(
        this.props.user.currentUser.userType === UserType.PROBATION_USER
          ? ConstPath.CustomerPath
          : ConstPath.UserPath + this.props.user.currentUser.userName + '/',
      )
      let isLogin =
        this.props.user.currentUser.userType !== UserType.PROBATION_USER &&
        this.props.user.currentUser.userName

      let data = []
      if (isLogin) {
        // 获取用户数据
        let userData = await this.getSectionData(userPath)
        data.push({
          title: '我的数据',
          data: userData,
          isShowItem: true,
        })
      }

      // 获取游客数据
      let customerPath = await FileTools.appendingHomeDirectory(
        ConstPath.CustomerPath,
      )
      let customerData = await this.getSectionData(customerPath)
      data.push({
        title: '游客数据',
        data: customerData,
        isShowItem: true,
      })

      // 获取公共数据
      let publicPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath,
      )
      let publicData = await this.getSectionData(publicPath)
      data.push({
        title: '公共数据',
        data: publicData,
        isShowItem: true,
      })

      this.setState({ sectionData: data, textDisplay: 'none' })
    } catch (e) {
      this.setState({ textDisplay: 'none' })
    }
  }

  /**
   * 获取每个Section中的数据
   * @param path 目标文件的上一级目录
   * @returns {Promise.<*>}
   */
  getSectionData = async path => {
    try {
      let filter
      switch (this.state.title) {
        case Const.MAP:
          path += ConstPath.RelativePath.Map
          filter = {
            extension: 'xml',
            type: 'file',
          }
          break
        case Const.DATA:
          path += ConstPath.RelativePath.Datasource
          filter = {
            extension: 'udb',
            type: 'file',
          }
          break
        case Const.SCENE:
          path += ConstPath.RelativePath.Scene
          filter = {
            type: 'Directory',
          }
          break
        case Const.SYMBOL:
          path += ConstPath.RelativePath.Symbol
          filter = {
            type: 'file',
          }
          break
      }
      let data = await FileTools.getPathListByFilter(path, filter)
      if (this.state.title === Const.SYMBOL) {
        // 符号去重
      }
      return data || []
    } catch (e) {
      return null
    }
  }

  _renderSectionHeader = info => {
    let title = info.section.title
    if (title !== undefined) {
      let imageSource = info.section.isShowItem
        ? require('../../../../assets/Mine/local_data_open.png')
        : require('../../../../assets/Mine/local_data_close.png')
      let imageWidth = 20
      let height = 40
      return (
        <TouchableOpacity
          onPress={() => {
            let sectionData = [...this.state.sectionData]
            for (let i = 0; i < sectionData.length; i++) {
              let data = sectionData[i]
              if (data.title === title) {
                data.isShowItem = !data.isShowItem
                break
              }
            }
            this.setState({ sectionData: sectionData })
          }}
          style={{
            width: '100%',
            height: height,
            backgroundColor: color.contentColorGray,
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Image
            resizeMode={'contain'}
            style={{
              tintColor: color.fontColorWhite,
              marginLeft: 10,
              width: imageWidth,
              height: imageWidth,
            }}
            source={imageSource}
          />
          <Text
            style={[
              {
                color: color.fontColorWhite,
                paddingLeft: 10,
                fontSize: 20,
                fontWeight: 'bold',
                backgroundColor: 'transparent',
              },
            ]}
          >
            {title}
          </Text>
        </TouchableOpacity>
      )
    }
    return <View />
  }

  _renderItem = info => {
    // let name = info.item.name
    // let txtInfo = name.lastIndexOf('.') > 0 ? name.substring(0, name.lastIndexOf('.')) : name
    let txtInfo = info.item.name
    let itemHeight = 60
    let imageWidth = 30,
      imageHeight = 30
    // let separatorLineHeight = 1
    let fontSize = Platform.OS === 'ios' ? 18 : 16
    let display = info.section.isShowItem ? 'flex' : 'none'
    let img
    switch (this.state.title) {
      case Const.MAP:
        img = require('../../../../assets/mapToolbar/list_type_map_black.png')
        break
      case Const.DATA:
      case Const.SCENE:
      case Const.SYMBOL:
      default:
        img = require('../../../../assets/Mine/mine_my_online_data.png')
        break
    }
    return (
      <TouchableOpacity
        style={{ display: display }}
        onPress={() => {
          this.itemInfo = info
          this.setState({ modalIsVisible: true })
        }}
      >
        <View
          // display={display}
          style={{
            // display:display,
            width: '100%',
            flexDirection: 'row',
            backgroundColor: color.contentColorWhite,
            alignItems: 'center',
            height: itemHeight,
          }}
        >
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              marginLeft: 20,
              tintColor: color.font_color_white,
            }}
            resizeMode={'contain'}
            source={img}
          />
          <Text
            numberOfLines={1}
            style={{
              color: color.font_color_white,
              paddingLeft: 15,
              fontSize: fontSize,
              flex: 1,
            }}
          >
            {txtInfo}
          </Text>
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              marginRight: 10,
              tintColor: color.font_color_white,
            }}
            resizeMode={'contain'}
            source={require('../../../../assets/Mine/mine_more_white.png')}
          />
        </View>
      </TouchableOpacity>
    )
  }

  _keyExtractor = (section, index) => {
    return 'id:' + index
  }

  _closeModal = () => {
    this.setState({ modalIsVisible: false })
  }

  _onUploadData = async () => {
    try {
      if (this.itemInfo !== undefined && this.itemInfo !== null) {
        let fileName = this.itemInfo.item.name.substring(
          0,
          this.itemInfo.item.name.lastIndexOf('.'),
        )
        let targetPath =
          (await FileTools.appendingHomeDirectory()) +
          (this.props.user.currentUser.userType === UserType.PROBATION_USER
            ? ConstPath.CustomerPath + ConstPath.RelativePath.Temp
            : ConstPath.UserPath +
              this.props.user.currentUser.userName +
              '/' +
              ConstPath.RelativePath.Temp) +
          fileName +
          '.zip'

        this.setLoading(true, ConstInfo.UPLOAD_START)

        let archivePaths = []
        switch (this.state.title) {
          case Const.MAP: {
            let mapPath = await FileTools.appendingHomeDirectory(
              this.itemInfo.item.path,
            )
            let mapExpPath =
              mapPath.substring(0, mapPath.lastIndexOf('.')) + '.exp'
            archivePaths = [mapPath, mapExpPath]
            break
          }
          case Const.DATA: {
            let udbPath = await FileTools.appendingHomeDirectory(
              this.itemInfo.item.path,
            )
            let uddPath =
              udbPath.substring(0, udbPath.lastIndexOf('.')) + '.udd'
            archivePaths = [udbPath, uddPath]
            break
          }
          case Const.SCENE: {
            let scenePath = await FileTools.appendingHomeDirectory(
              this.itemInfo.item.path,
            )
            let pxpPath = scenePath + '.pxp'
            archivePaths = [scenePath, pxpPath]
            break
          }
          case Const.SYMBOL: {
            let symbolPath = await FileTools.appendingHomeDirectory(
              this.itemInfo.item.path,
            )
            archivePaths = [symbolPath]
            break
          }
        }

        this.props.uploading({
          archivePaths,
          targetPath,
          name: fileName,
          onProgress: () => {
            // console.warn('onProgress: ' + progress)
          },
          onResult: result => {
            Toast.show(
              result || result === undefined
                ? ConstInfo.UPLOAD_SUCCESS
                : ConstInfo.UPLOAD_FAILED,
            )
            // console.warn('onResult: ' + result)
          },
        })
      }
    } catch (e) {
      Toast.show(ConstInfo.DELETE_FAILED)
      this._closeModal()
    } finally {
      this.setLoading(false)
    }
  }

  _onDeleteData = async () => {
    try {
      if (this.itemInfo !== undefined && this.itemInfo !== null) {
        this.setLoading(true, ConstInfo.DELETING_DATA)
        let result = false
        switch (this.state.title) {
          case Const.MAP:
            result = await this._deleteMap()
            break
          case Const.DATA:
            result = await this._deleteDatasource()
            break
          case Const.SCENE:
            result = await this._deleteScene()
            break
          case Const.SYMBOL:
            result = await this._deleteSymbol()
            break
        }
        Toast.show(result ? ConstInfo.DELETE_SUCCESS : ConstInfo.DELETE_FAILED)
        if (result) {
          this.itemInfo = null
          this._closeModal()
          this.getData()
        }
      } else {
        Toast.show(ConstInfo.PLEASE_CHOOSE_DELETE_OBJ)
      }
    } catch (e) {
      Toast.show(ConstInfo.DELETE_FAILED)
      this._closeModal()
    } finally {
      this.setLoading(false)
    }
  }

  /** 删除地图 **/
  _deleteMap = async () => {
    // let mapPath =
    if (!this.itemInfo) return false
    let mapPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )
    let mapExpPath = mapPath.substring(0, mapPath.lastIndexOf('.')) + '.exp'

    let result = await FileTools.deleteFile(mapPath)
    result = result && (await FileTools.deleteFile(mapExpPath))

    return result
  }

  /** 删除数据源 **/
  _deleteDatasource = async () => {
    if (!this.itemInfo) return false
    let udbPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )
    let uddPath = udbPath.substring(0, udbPath.lastIndexOf('.')) + '.udd'

    let result = await FileTools.deleteFile(udbPath)
    result = result && (await FileTools.deleteFile(uddPath))

    return result
  }

  /** 删除场景 **/
  _deleteScene = async () => {
    if (!this.itemInfo) return false
    let scenePath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )
    let pxpPath = scenePath + '.pxp'

    let result = await FileTools.deleteFile(scenePath)
    result = result && (await FileTools.deleteFile(pxpPath))

    return result
  }

  /** 删除符号 **/
  _deleteSymbol = async () => {
    if (!this.itemInfo) return false
    let symbolPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )

    let result = await FileTools.deleteFile(symbolPath)

    return result
  }

  _showMyDataPopupModal = () => {
    if (this.state.modalIsVisible) {
      return (
        <MyDataPopupModal
          // onDeleteData={this._onDeleteData}
          data={[
            // {
            //   title: '上传',
            //   action: this._onUploadData,
            // },
            {
              title: '删除',
              action: this._onDeleteData,
            },
          ]}
          onCloseModal={this._closeModal}
          modalVisible={this.state.modalIsVisible}
        />
      )
    }
  }

  goToMyOnlineData = async () => {
    NavigationService.navigate('MyOnlineData')
  }

  goToMyService = () => {
    NavigationService.navigate('MyService')
  }

  _renderHeaderBtn = () => {
    let btn = null
    if (
      this.props.user.currentUser.userType !== UserType.PROBATION_USER &&
      this.props.user.currentUser.userName &&
      (this.state.title === Const.MAP || this.state.title === Const.DATA)
    ) {
      let title =
        this.state.title === Const.MAP ? Const.ONLINE_MAP : Const.ONLINE_DATA
      let action =
        this.state.title === Const.MAP
          ? this.goToMyService
          : this.goToMyOnlineData
      btn = (
        <TextBtn
          btnText={title}
          textStyle={{
            color: 'white',
            fontSize: 17,
          }}
          btnClick={action}
        />
      )
    }
    return btn
  }

  setLoading = (visible, info) => {
    this.container && this.container.setLoading(visible, info)
  }

  _renderSectionSeparatorComponent = () => {
    return <ListSeparator color={color.contentColorWhite} height={5} />
  }

  _renderItemSeparatorComponent = ({ section }) => {
    return section.isShowItem ? (
      <ListSeparator color={color.itemColorGray} height={1} />
    ) : null
  }

  render() {
    let sectionData = this.state.sectionData
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this._renderHeaderBtn(),
        }}
      >
        <Text
          numberOfLines={2}
          ellipsizeMode={'head'}
          style={{
            width: '100%',
            backgroundColor: color.content_white,
            display: this.state.textDisplay,
            fontSize: 10,
          }}
        >
          {this.state.textValue}
        </Text>
        <SectionList
          style={{
            flex: 1,
            backgroundColor: color.content_white,
          }}
          sections={sectionData}
          initialNumToRender={20}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          SectionSeparatorComponent={this._renderSectionSeparatorComponent}
        />
        {this._showMyDataPopupModal()}
      </Container>
    )
  }
}
