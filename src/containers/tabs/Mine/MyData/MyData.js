import React, { Component } from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native'
import { Container, ListSeparator, TextBtn } from '../../../../components'
import { ConstPath, ConstInfo, Const } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import MyDataPopupModal from './MyDataPopupModal'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import NavigationService from '../../../NavigationService'

import UserType from '../../../../constants/UserType'

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'column',
    backgroundColor: color.contentColorWhite,
  },
  section: {
    flex: 1,
    height: scaleSize(80),
    backgroundColor: color.contentColorGray,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionText: {
    flex: 1,
    color: color.fontColorWhite,
    paddingLeft: 10,
    fontSize: size.fontSize.fontSizeXl,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  sectionImg: {
    tintColor: color.fontColorWhite,
    marginLeft: 10,
    width: scaleSize(30),
    height: scaleSize(30),
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: color.contentColorWhite,
    alignItems: 'center',
    height: scaleSize(80),
  },
  itemText: {
    color: color.fontColorBlack,
    paddingLeft: 15,
    fontSize: size.fontSize.fontSizeXl,
    flex: 1,
  },
  img: {
    width: scaleSize(30),
    height: scaleSize(30),
    marginLeft: 20,
    tintColor: color.fontColorBlack,
  },
  separator: {
    // flex: 1,
    marginHorizontal: scaleSize(16),
    height: scaleSize(1),
    backgroundColor: color.rowSeparator,
  },
  title: {
    // fontSize: size.fontSize.fontSizeLg,
    fontSize: size.fontSize.fontSizeSm,
    color: color.bgG,
  },
  moreView: {
    height: '100%',
    marginRight: 10,
    width: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImg: {
    flex: 1,
    height: scaleSize(40),
    width: scaleSize(40),
  },
})

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
        let userData = await this.getSectionData(userPath, true)
        data.push(userData)
      }

      // 获取游客数据
      let customerPath = await FileTools.appendingHomeDirectory(
        ConstPath.CustomerPath,
      )
      let customerData = await this.getSectionData(customerPath, false)
      data.push(customerData)

      this.setState({ sectionData: data, textDisplay: 'none' })
    } catch (e) {
      this.setState({ textDisplay: 'none' })
    }
  }

  /**
   * 获取每个Section中的数据
   * @param path 目标文件的上一级目录
   * @param isUser 是否是用户数据
   * @returns {Promise.<*>}
   */
  getSectionData = async (path, isUser = false) => {
    try {
      let filter,
        title = '我的数据'
      switch (this.state.title) {
        case Const.MAP:
          path += ConstPath.RelativePath.Map
          filter = {
            extension: 'xml',
            type: 'file',
          }
          title = isUser ? '我的地图' : '游客地图'
          break
        case Const.DATA:
          path += ConstPath.RelativePath.Datasource
          filter = {
            extension: 'udb',
            type: 'file',
          }
          title = isUser ? '我的数据' : '游客数据'
          break
        case Const.SCENE:
          path += ConstPath.RelativePath.Scene
          filter = {
            type: 'Directory',
          }
          title = isUser ? '我的场景' : '游客场景'
          break
        case Const.SYMBOL:
          path += ConstPath.RelativePath.Symbol
          filter = {
            type: 'file',
          }
          title = isUser ? '我的符号' : '游客符号'
          break
      }
      let data = await FileTools.getPathListByFilter(path, filter)

      let sectionData = {
        title,
        data: data || [],
        isShowItem: true,
      }
      return sectionData
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
      // let isShowMore = info.section.title !== '公共数据'
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
          style={styles.section}
        >
          <Image
            resizeMode={'contain'}
            style={styles.sectionImg}
            source={imageSource}
          />
          <Text style={styles.sectionText}>{title}</Text>
          {/*{*/}
          {/*isShowMore &&*/}
          {/*<TouchableOpacity*/}
          {/*style={styles.moreView}*/}
          {/*onPress={() => {*/}
          {/*this.itemInfo = info*/}
          {/*this.setState({ modalIsVisible: true })*/}
          {/*}}*/}
          {/*>*/}
          {/*<Image*/}
          {/*style={styles.moreImg}*/}
          {/*resizeMode={'contain'}*/}
          {/*source={require('../../../../assets/Mine/icon_more_gray.png')}*/}
          {/*/>*/}
          {/*</TouchableOpacity>*/}
          {/*}*/}
        </TouchableOpacity>
      )
    }
    return <View />
  }

  _renderItem = info => {
    let txtInfo = info.item.name
    let display = info.section.isShowItem ? 'flex' : 'none'
    let img,
      isShowMore = true
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
          // this.itemInfo = info
          // this.setState({ modalIsVisible: true })
        }}
      >
        <View style={styles.item}>
          <Image style={styles.img} resizeMode={'contain'} source={img} />
          <Text numberOfLines={1} style={styles.itemText}>
            {txtInfo}
          </Text>
          {isShowMore && (
            <TouchableOpacity
              style={styles.moreView}
              onPress={() => {
                this.itemInfo = info
                this.setState({ modalIsVisible: true })
              }}
            >
              <Image
                style={styles.moreImg}
                resizeMode={'contain'}
                source={require('../../../../assets/Mine/icon_more_gray.png')}
              />
            </TouchableOpacity>
          )}
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
          onProgress: () => {},
          onResult: (result, name) => {
            Toast.show(
              name + ' ' + result || result === undefined
                ? ConstInfo.UPLOAD_SUCCESS
                : ConstInfo.UPLOAD_FAILED,
            )
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

  getUploadingData = () => {
    if (
      this.itemInfo &&
      this.itemInfo.item &&
      this.itemInfo.item.path &&
      this.props.upload &&
      this.props.upload.length > 0
    ) {
      let path = this.itemInfo.item.path
      for (let i = 0; i < this.props.upload.length; i++) {
        for (let j = 0; j < this.props.upload[i].archivePaths.length; j++) {
          if (this.props.upload[i].archivePaths[j].indexOf(path) >= 0) {
            return this.props.upload[i]
          }
        }
      }
    }
    return null
  }

  _showMyDataPopupModal = () => {
    if (this.state.modalIsVisible) {
      let title = '上传数据'
      let uploadingData = this.getUploadingData()
      if (uploadingData && uploadingData.progress >= 0) {
        title += '  ' + uploadingData.progress + '%'
      }
      return (
        <MyDataPopupModal
          // onDeleteData={this._onDeleteData}
          data={[
            {
              title: title,
              action: this._onUploadData,
            },
            {
              title: '删除数据',
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
    return <ListSeparator color={color.contentColorWhite} height={1} />
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
