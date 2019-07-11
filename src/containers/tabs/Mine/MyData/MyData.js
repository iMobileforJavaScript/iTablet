import React, { Component } from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  StyleSheet,
  NativeModules,
  RefreshControl,
} from 'react-native'
import { Container, ListSeparator, TextBtn } from '../../../../components'
import { ConstPath, ConstInfo, Const } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import MyDataPopupModal from './MyDataPopupModal'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import ModalBtns from '../MyModule/ModalBtns'
import UserType from '../../../../constants/UserType'
import { SOnlineService } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language/index'

const appUtilsModule = NativeModules.AppUtils
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
    height: 1,
    backgroundColor: color.separateColorGray,
  },
  title: {
    // fontSize: size.fontSize.fontSizeLg,
    fontSize: size.fontSize.fontSizeSm,
    color: color.bgG,
  },
  moreView: {
    height: '100%',
    marginRight: 10,
    // width: scaleSize(80),
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
    language: string,
    user: Object,
    navigation: Object,
    upload: Object,
    uploading: () => {},
    exportWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.state = {
      sectionData: [],
      // userName: this.props.navigation.getParam('userName', ''),
      modalIsVisible: false,
      isFirstLoadingModal: true,
      textValue: '扫描文件:',
      textDisplay: 'none',
      title: (params && params.title) || '',
      isRefreshing: false,
    }
    this.formChat = params.formChat || false
    this.chatCallBack = params.chatCallBack
    this.callBackMode = params.callBackMode
  }

  componentDidMount() {
    this.getData()
    // this.getData2()
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
      } else {
        // 获取游客数据
        let customerPath = await FileTools.appendingHomeDirectory(
          ConstPath.CustomerPath,
        )
        let customerData = await this.getSectionData(customerPath, false)
        data.push(customerData)
      }
      this.setState({ sectionData: data, textDisplay: 'none' })
    } catch (e) {
      this.setState({ textDisplay: 'none' })
    }
  }

  /** 获取FlatList数据*/
  getData2 = async () => {
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
        data = userData.data
      } else {
        // 获取游客数据
        let customerPath = await FileTools.appendingHomeDirectory(
          ConstPath.CustomerPath,
        )
        let customerData = await this.getSectionData(customerPath, false)
        data = customerData.data
      }
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
      let filter, title
      switch (this.state.title) {
        case getLanguage(this.props.language).Profile.MAP:
          path += ConstPath.RelativePath.Map
          filter = {
            extension: 'xml',
            type: 'file',
          }
          title = isUser ? 'MY_MAP' : 'MAP'
          break
        case getLanguage(this.props.language).Profile.DATA:
          path += ConstPath.RelativePath.Datasource
          filter = {
            extension: 'udb',
            type: 'file',
          }
          title = isUser ? 'MY_DATA' : 'DATA'
          break
        case getLanguage(this.props.language).Profile.SCENE:
          path += ConstPath.RelativePath.Scene
          filter = {
            type: 'Directory',
          }
          title = isUser ? 'MY_SCENE' : 'SCENE'
          break
        case getLanguage(this.props.language).Profile.SYMBOL:
          path += ConstPath.RelativePath.Symbol
          filter = {
            type: 'file',
          }
          title = isUser ? 'MY_SYMBOL' : 'SYMBOL'
          break
        case getLanguage(this.props.language).Profile.COLOR_SCHEME:
          //Const.MINE_COLOR:
          path += ConstPath.RelativePath.Color
          filter = {
            extension: 'scs',
            type: 'file',
          }
          title = isUser ? 'MY_COLOR_SCHEME' : 'COLOR_SCHEME'
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

  _returnItem = () => {}

  _renderItem = info => {
    let name = info.item.name
    let txtInfo =
      name.lastIndexOf('.') > 0
        ? name.substring(0, name.lastIndexOf('.'))
        : name
    let txtType =
      name.lastIndexOf('.') > 0 ? name.substring(name.lastIndexOf('.') + 1) : ''

    let display = info.section.isShowItem ? 'flex' : 'none'
    let img,
      isShowMore = true
    let labelUDBName = 'Label_' + this.props.user.currentUser.userName + '#'
    if (labelUDBName === txtInfo) {
      return <View />
    }
    if (this.formChat && this.chatCallBack) {
      isShowMore = false
    }
    switch (this.state.title) {
      case getLanguage(this.props.language).Profile.MAP:
        img = require('../../../../assets/mapToolbar/list_type_map_black.png')
        break
      case getLanguage(this.props.language).Profile.SYMBOL:
        if (txtType === 'sym') {
          // 点
          img = require('../../../../assets/map/icon-shallow-dot_black.png')
        } else if (txtType === 'lsl') {
          // 线
          img = require('../../../../assets/map/icon-shallow-line_black.png')
        } else if (txtType === 'bru') {
          // 面
          img = require('../../../../assets/map/icon-shallow-polygon_black.png')
        } else {
          // 默认
          img = require('../../../../assets/Mine/mine_my_online_data.png')
        }
        break
      case getLanguage(this.props.language).Profile.SCENE:
        img = require('../../../../assets/mapTools/icon_scene.png')
        break
      case getLanguage(this.props.language).Profile.TEMPLATE:
        img = require('../../../../assets/mapToolbar/list_type_map_black.png')
        break
      default:
        img = require('../../../../assets/Mine/mine_my_online_data.png')
        break
    }
    return (
      <TouchableOpacity
        style={[styles.item, { display: display }]}
        onPress={async () => {
          if (this.formChat && this.chatCallBack) {
            if (this.callBackMode && this.callBackMode === 'getName') {
              this.itemInfo = info
              this.chatCallBack(info.item.name)
            } else {
              this.itemInfo = info
              this._onUploadData('')
            }
          }
        }}
      >
        <Image style={styles.img} resizeMode={'contain'} source={img} />
        <Text numberOfLines={1} style={styles.itemText}>
          {txtInfo}
        </Text>
        {isShowMore && (
          <TouchableOpacity
            style={styles.moreView}
            onPress={() => {
              this.itemInfo = info
              if (this.state.isFirstLoadingModal) {
                this.setState({
                  modalIsVisible: true,
                  isFirstLoadingModal: false,
                })
              } else {
                this.setState({ modalIsVisible: true })
              }
            }}
          >
            <Image
              style={styles.moreImg}
              resizeMode={'contain'}
              source={require('../../../../assets/Mine/icon_more_gray.png')}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    )
  }

  _renderItem2 = info => {
    let name = info.item.name
    let txtInfo =
      name.lastIndexOf('.') > 0
        ? name.substring(0, name.lastIndexOf('.'))
        : name
    let txtType =
      name.lastIndexOf('.') > 0 ? name.substring(name.lastIndexOf('.') + 1) : ''
    let img,
      isShowMore = true
    switch (this.state.title) {
      case getLanguage(this.props.language).Profile.MAP:
        img = require('../../../../assets/mapToolbar/list_type_map_black.png')
        break
      case getLanguage(this.props.language).Profile.SYMBOL:
        if (txtType === 'sym') {
          // 点
          img = require('../../../../assets/map/icon-shallow-dot_black.png')
        } else if (txtType === 'lsl') {
          // 线
          img = require('../../../../assets/map/icon-shallow-line_black.png')
        } else if (txtType === 'bru') {
          // 面
          img = require('../../../../assets/map/icon-shallow-polygon_black.png')
        } else {
          // 默认
          img = require('../../../../assets/Mine/mine_my_online_data.png')
        }
        break
      case getLanguage(this.props.language).Profile.SCENE:
        img = require('../../../../assets/mapTools/icon_scene.png')
        break
      case getLanguage(this.props.language).Profile.DATA:
      default:
        img = require('../../../../assets/Mine/mine_my_online_data.png')
        break
    }
    return (
      <View style={{ width: '100%' }}>
        <TouchableOpacity
          style={[styles.item]}
          onPress={() => {
            // this.itemInfo = info
            // this.setState({ modalIsVisible: true })
          }}
        >
          <Image style={styles.img} resizeMode={'contain'} source={img} />
          <Text numberOfLines={1} style={styles.itemText}>
            {txtInfo}
          </Text>
          {isShowMore && (
            <TouchableOpacity
              style={styles.moreView}
              onPress={() => {
                this.itemInfo = info
                if (this.state.isFirstLoadingModal) {
                  this.setState({
                    modalIsVisible: true,
                    isFirstLoadingModal: false,
                  })
                } else {
                  this.setState({ modalIsVisible: true })
                }
              }}
            >
              <Image
                style={styles.moreImg}
                resizeMode={'contain'}
                source={require('../../../../assets/Mine/icon_more_gray.png')}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: color.separateColorGray,
          }}
        />
      </View>
    )
  }

  _keyExtractor = (section, index) => {
    return 'id:' + index
  }
  _keyExtractor2 = (item, index) => {
    return 'id:' + index
  }
  _closeModal = () => {
    this.setState({ modalIsVisible: false })
  }

  _onUploadData = async type => {
    try {
      // this.setLoading(true, getLanguage(this.props.language).Prompt.SHARING)
      //'分享中')
      Toast.show(getLanguage(this.props.language).Prompt.SHARING)
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
          'MyExport.zip'
        let archivePaths = []
        switch (this.state.title) {
          case getLanguage(this.props.language).Profile.MAP: {
            let mapPath = await FileTools.appendingHomeDirectory(
              this.itemInfo.item.path,
            )
            let mapExpPath =
              mapPath.substring(0, mapPath.lastIndexOf('.')) + '.exp'
            archivePaths = [mapPath, mapExpPath]
            break
          }
          case getLanguage(this.props.language).Profile.DATA: {
            let udbPath = await FileTools.appendingHomeDirectory(
              this.itemInfo.item.path,
            )
            let uddPath =
              udbPath.substring(0, udbPath.lastIndexOf('.')) + '.udd'
            archivePaths = [udbPath, uddPath]
            break
          }
          case getLanguage(this.props.language).Profile.SCENE: {
            let scenePath = await FileTools.appendingHomeDirectory(
              this.itemInfo.item.path,
            )
            let pxpPath = scenePath + '.pxp'
            archivePaths = [scenePath, pxpPath]
            break
          }
          case getLanguage(this.props.language).Profile.SYMBOL: {
            let symbolPath = await FileTools.appendingHomeDirectory(
              this.itemInfo.item.path,
            )
            archivePaths = [symbolPath]
            break
          }
          case getLanguage(this.props.language).Profile.MINE_COLOR: {
            let colorPath = await FileTools.appendingHomeDirectory(
              this.itemInfo.item.path,
            )
            archivePaths = [colorPath]
            break
          }
        }
        if (type === 'weChat') {
          if (
            this.state.title === getLanguage(this.props.language).Profile.SCENE
          ) {
            Toast.show(getLanguage(this.props.language).Prompt.SHARED_DATA_10M)
            //'所分享文件超过10MB')
            return
          }
          let zipResult
          if (
            this.state.title === getLanguage(this.props.language).Profile.MAP
          ) {
            let result = await this._exportData(true)
            if (!result) {
              Toast.show(getLanguage(this.props.language).Prompt.SHARE_FAILED)
              //'分享失败')
              this.setLoading(false)
              return
            }
            zipResult = true
          } else {
            zipResult = await FileTools.zipFiles(archivePaths, targetPath)
          }
          await this.setLoading(false)
          zipResult &&
            appUtilsModule
              .sendFileOfWechat({
                filePath: targetPath,
                title: fileName + '.zip',
                description: 'SuperMap iTablet',
              })
              .then(result => {
                !result &&
                  Toast.show(
                    getLanguage(this.props.language).Prompt.SHARED_DATA_10M,
                  )
                //'所分享文件超过10MB')
                !result && FileTools.deleteFile(targetPath)
                this.setLoading(false)
              })
        } else if (type === 'online') {
          if (
            this.state.title === getLanguage(this.props.language).Profile.MAP
          ) {
            let result = await this._exportData(true)
            if (!result) {
              Toast.show(getLanguage(this.props.language).Prompt.SHARE_FAILED)
              //'分享失败')
              this.setLoading(false)
              return
            }
            await SOnlineService.uploadFile(targetPath, fileName, {
              onResult: result => {
                this.setLoading(false)
                result &&
                  Toast.show(
                    getLanguage(this.props.language).Prompt.SHARE_SUCCESS,
                  )
                //'分享成功')
                this.ModalBtns && this.ModalBtns.setVisible(false)
                FileTools.deleteFile(targetPath)
              },
            })
          } else {
            this.props.uploading({
              archivePaths,
              targetPath,
              name: fileName,
              onProgress: () => {},
              onResult: (result, name) => {
                this.setLoading(false)
                Toast.show(
                  name + ' ' + result || result === undefined
                    ? getLanguage(this.props.language).Prompt.SHARE_SUCCESS
                    : //'分享成功'
                    getLanguage(this.props.language).Prompt.SHARE_FAILED,
                  //'分享失败',
                )
                this.ModalBtns && this.ModalBtns.setVisible(false)
              },
            })
          }
        } else if (this.formChat) {
          if (
            this.state.title === getLanguage(this.props.language).Profile.MAP
          ) {
            await this._exportData(true)
            this.chatCallBack && this.chatCallBack(targetPath, fileName)
            NavigationService.goBack()
          } else {
            let zipResult = await FileTools.zipFiles(archivePaths, targetPath)
            if (zipResult) {
              this.setLoading(false)
              this.chatCallBack && this.chatCallBack(targetPath.fileName)
              NavigationService.goBack()
            }
          }
        }
      }
    } catch (e) {
      Toast.show(getLanguage(this.props.language).Prompt.SHARE_FAILED)
      //'分享失败')
      this.ModalBtns && this.ModalBtns.setVisible(false)
      this._closeModal()
      this.setLoading(false)
    }
  }

  _onDeleteData = async () => {
    try {
      this._closeModal()
      if (this.itemInfo !== undefined && this.itemInfo !== null) {
        this.setLoading(
          true,
          //ConstInfo.DELETING_DATA
          getLanguage(this.props.language).Prompt.DELETING_DATA,
        )
        let result = false
        switch (this.state.title) {
          case getLanguage(this.props.language).Profile.MAP:
            result = await this._deleteMap()
            break
          case getLanguage(this.props.language).Profile.DATA:
            result = await this._deleteDatasource()
            break
          case getLanguage(this.props.language).Profile.SCENE:
            result = await this._deleteScene()
            break
          case getLanguage(this.props.language).Profile.SYMBOL:
            result = await this._deleteSymbol()
            break
          case getLanguage(this.props.language).Profile.MINE_COLOR:
            result = await this._deleteSymbol()
            break
        }
        Toast.show(
          result
            ? getLanguage(this.props.language).Prompt.DELETED_SUCCESS
            : getLanguage(this.props.language).Prompt.FAILED_TO_DELETE,
        )
        if (result) {
          this.itemInfo = null
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
    this._closeModal()
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
    this._closeModal()
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
    this._closeModal()
    if (!this.itemInfo) return false
    let symbolPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )

    let result = await FileTools.deleteFile(symbolPath)

    return result
  }

  _exportData = async (isShare = false, showToast = false) => {
    this._closeModal()
    let name = this.state.sectionData[0].data[this.itemInfo.index].name
    let mapName = name.substring(0, name.length - 4)
    let homePath = await FileTools.appendingHomeDirectory()
    let zipPath = ''
    let path =
      homePath +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.ExternalData +
      ConstPath.RelativeFilePath.ExportData +
      mapName +
      '/' +
      mapName +
      '.smwu'
    if (isShare) {
      zipPath =
        homePath +
        ConstPath.UserPath +
        this.props.user.currentUser.userName +
        '/' +
        ConstPath.RelativePath.Temp +
        'MyExport.zip'
    }
    let exportResult = false
    await this.props.exportWorkspace(
      { maps: [mapName], outPath: path, isOpenMap: true, zipPath },
      result => {
        if (result === true) {
          showToast &&
            Toast.show(getLanguage(this.props.language).Prompt.EXPORT_SUCCESS)
          //'导出成功')
        } else {
          showToast &&
            Toast.show(getLanguage(this.props.language).Prompt.EXPORT_FAILED)
          //'导出失败')
        }
        exportResult = result
      },
    )
    return exportResult
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
    if (!this.state.isFirstLoadingModal) {
      let data
      // let title = getLanguage(this.props.language).Profile.UPLOAD_DATA
      //'分享'
      if (
        this.props.user.currentUser.userName &&
        this.props.user.currentUser.userType !== UserType.PROBATION_USER
      ) {
        // let uploadingData = this.getUploadingData()
        // if (uploadingData && uploadingData.progress >= 0) {
        //   title += '  ' + uploadingData.progress + '%'
        // }
        if (this.state.sectionData[0].title.indexOf('MY_MAP') !== -1) {
          data = [
            {
              title: getLanguage(this.props.language).Profile.UPLOAD_MAP,
              action: () => {
                this._closeModal()
                this.ModalBtns && this.ModalBtns.setVisible(true)
              },
            },
            {
              title: getLanguage(this.props.language).Profile.EXPORT_MAP,
              // '导出数据',
              action: () => {
                this._exportData(false, true)
              },
            },
            {
              //'删除数据'
              title: getLanguage(this.props.language).Profile.DELETE_MAP,
              action: this._onDeleteData,
            },
          ]
        } else if (this.state.sectionData[0].title.indexOf('MY') !== -1) {
          let _type = this.state.sectionData[0].title.split('_')[1]
          data = [
            {
              title: getLanguage(this.props.language).Profile[
                `UPLOAD_${_type}`
              ],
              //'分享',
              action: () => {
                this._closeModal()
                this.ModalBtns && this.ModalBtns.setVisible(true)
              },
            },
            {
              //'删除数据'
              title: getLanguage(this.props.language).Profile[
                `DELETE_${_type}`
              ],
              action: this._onDeleteData,
            },
          ]
        }
      } else {
        if (this.state.sectionData[0].title.indexOf('MAP') !== -1) {
          data = [
            {
              title: getLanguage(this.props.language).Profile.EXPORT_MAP,
              //'导出数据',
              action: () => {
                this._exportData(false, true)
              },
            },
            {
              //'删除数据'
              title: getLanguage(this.props.language).Profile.DELETE_MAP,
              action: this._onDeleteData,
            },
          ]
        } else {
          let _type = this.state.sectionData[0].title.split('_')
          data = [
            {
              //'删除数据'
              title: getLanguage(this.props.language).Profile[
                `DELETE_${_type}`
              ],
              action: this._onDeleteData,
            },
          ]
        }
      }
      return (
        <MyDataPopupModal
          // onDeleteData={this._onDeleteData}
          data={data}
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
      let title = Const.ONLINE_DATA
      let action = this.goToMyOnlineData

      btn =
        this.state.title === Const.DATA ? (
          <TextBtn
            btnText={title}
            textStyle={{
              color: 'white',
              fontSize: 17,
            }}
            btnClick={action}
          />
        ) : (
          <View />
        )
    }
    return btn
  }

  setLoading = (visible, info) => {
    this.container && this.container.setLoading(visible, info)
  }

  _renderSectionSeparatorComponent = () => {
    return <ListSeparator color={color.separateColorGray} height={1} />
  }

  _renderItemSeparatorComponent = ({ section }) => {
    return section.isShowItem ? (
      <ListSeparator color={color.separateColorGray} height={1} />
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
            backgroundColor: color.contentColorWhite,
          }}
          sections={sectionData}
          initialNumToRender={20}
          keyExtractor={this._keyExtractor}
          // renderSectionHeader={this._renderSectionHeader}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          // SectionSeparatorComponent={this._renderSectionSeparatorComponent}
          renderSectionFooter={this._renderSectionSeparatorComponent}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                try {
                  this.setState({ isRefreshing: true })
                  this.getData().then(() => {
                    this.setState({ isRefreshing: false })
                  })
                } catch (error) {
                  Toast.show('刷新失败')
                }
              }}
              colors={['orange', 'red']}
              titleColor={'orange'}
              tintColor={'orange'}
              title={'刷新中...'}
              enabled={true}
            />
          }
        />
        {/* <FlatList
          style={{
            flex: 1,
            backgroundColor: color.contentColorWhite,
          }}
          renderItem={this._renderItem2}
          data={sectionData}
          initialNumToRender={20}
          keyExtractor={this._keyExtractor2}
        />*/}
        {this._showMyDataPopupModal()}
        <ModalBtns
          ref={ref => {
            this.ModalBtns = ref
          }}
          actionOfOnline={() => this._onUploadData('online')}
          actionOfWechat={() => {
            this._onUploadData('weChat')
          }}
        />
      </Container>
    )
  }
}
