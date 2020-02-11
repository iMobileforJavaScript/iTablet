import React, { Component } from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  NativeModules,
  RefreshControl,
  ScrollView,
  Platform,
} from 'react-native'
import { Container, ListSeparator, InputDialog } from '../../../../components'
import { ConstPath, ConstInfo } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import MyDataPopupModal from './MyDataPopupModal'
import { color } from '../../../../styles'
import { scaleSize, OnlineServicesUtils } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import ModalBtns from './ModalBtns'
import UserType from '../../../../constants/UserType'
import { DatasetType } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language/index'
import { MsgConstant, SimpleDialog } from '../../Friend'
import { MineItem, BatchHeadBar } from '../component'
import { getThemeAssets } from '../../../../assets'
import RNFS from 'react-native-fs'
import styles from './styles'

const appUtilsModule = NativeModules.AppUtils
const pointImg = require('../../../../assets/mapToolbar/dataset_type_point_black.png')
const lineImg = require('../../../../assets/mapToolbar/dataset_type_line_black.png')
const regionImg = require('../../../../assets/mapToolbar/dataset_type_region_black.png')
const textImg = require('../../../../assets/mapToolbar/dataset_type_text_black.png')
const CADImg = require('../../../../assets/mapToolbar/dataset_type_cad_black.png')
const IMGImg = require('../../../../assets/mapToolbar/dataset_type_image_black.png')
const gridImg = require('../../../../assets/mapToolbar/dataset_type_grid_black.png')
const networkImg = require('../../../../assets/mapToolbar/dataset_type_network_black.png')
const defaultImg = require('../../../../assets/mapToolbar/dataset_type_else_black.png')

var JSOnlineService
var JSIPortalServce
export default class MyDataPage extends Component {
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
      shareToLocal: false,
      shareToOnline: false,
      shareToIPortal: false,
      shareToWechat: false,
      shareToFriend: false,
      showSectionHeader: false,
      sectionData: [],
      title: (params && params.title) || '',
      isRefreshing: false,
      batchMode: false,
      selectedNum: 0,
    }
    JSOnlineService = new OnlineServicesUtils('online')
    JSIPortalServce = new OnlineServicesUtils('iportal')
    this.getItemCallback = params.getItemCallback || undefined
    this.chatCallback = params.chatCallback || undefined
    this.exportPath = ''
  }

  types = {
    data: 'DATA',
    map: 'MAP',
    scene: 'SCENE',
    mark: 'MARK',
    symbol: 'SYMBOL',
    template: 'TEMPLATE',
    dataset: 'DATASET',
    color: 'COLOR_SCHEME',
  }

  componentDidMount() {
    this._getSectionData()
  }

  /********************************** 接口 *************************************/

  /**各个页面实现 */
  getData = async () => {
    return []
  }

  /**各个页面实现 */
  deleteData = async () => {
    return false
  }

  /**各个页面实现 */
  exportData = async () => {
    return false
  }

  onItemPress = async () => {}

  getRelativeTempPath = () => {
    let userPath =
      ConstPath.UserPath + this.props.user.currentUser.userName + '/'
    let relativeTempPath = userPath + ConstPath.RelativePath.Temp
    return relativeTempPath
  }

  getRelativeExportPath = () => {
    let userPath =
      ConstPath.UserPath + this.props.user.currentUser.userName + '/'
    let relativeExportPath =
      userPath +
      ConstPath.RelativePath.ExternalData +
      ConstPath.RelativeFilePath.ExportData
    return relativeExportPath
  }

  //页面popup选项，不会合并公共选项
  getPagePopupData = () => []

  //项目popup选项，不会合并公共选项
  getItemPopupData = () => []

  //页面自定义选项，会合并公共选项
  getCustomPagePopupData = () => []

  //项目自定义选项，会合并公共选项
  getCustomItemPopupData = () => []

  /******************************** 接口 end **************************************/

  /******************************** 数据相关 *************************************/

  _getAvailableFileName = async (path, name, ext) => {
    let result = await FileTools.fileIsExist(path)
    if (!result) {
      await FileTools.createDirectory(path)
    }
    let availableName = name + '.' + ext
    if (await FileTools.fileIsExist(path + '/' + availableName)) {
      for (let i = 1; ; i++) {
        availableName = name + '_' + i + '.' + ext
        if (!(await FileTools.fileIsExist(path + '/' + availableName))) {
          return availableName
        }
      }
    } else {
      return availableName
    }
  }

  _getSectionData = async (showLoading = false) => {
    try {
      showLoading &&
        this.container.setLoading(
          true,
          getLanguage(global.language).Prompt.LOADING,
        )
      let sectionData = await this.getData()
      this.setState({
        sectionData: sectionData,
        selectedNum: 0,
      })
      setTimeout(() => {
        showLoading && this.container && this.container.setLoading(false)
      }, 1000)
    } catch (e) {
      // console.log(e)
      setTimeout(() => {
        showLoading && this.container && this.container.setLoading(false)
        Toast.show(getLanguage(global.language).Profile.GET_DATA_FAILED)
      }, 1000)
    }
  }

  _onDeleteData = async (forceDelete = false) => {
    try {
      this._closeModal()
      if (!forceDelete) {
        let relatedMaps = []
        relatedMaps = await this.getRelatedMaps([this.itemInfo])
        if (relatedMaps.length > 0) {
          this.showRelatedMapsDialog({
            confirmAction: () => this._onDeleteData(true),
            relatedMaps: relatedMaps,
          })
          return
        } else {
          this.showDeleteConfirmDialog({
            confirmAction: () => this._onDeleteData(true),
          })
          return
        }
      }
      if (this.itemInfo !== undefined && this.itemInfo !== null) {
        this.setLoading(true, getLanguage(global.language).Prompt.DELETING_DATA)
        let result = false
        result = await this.deleteData()
        Toast.show(
          result
            ? getLanguage(global.language).Prompt.DELETED_SUCCESS
            : getLanguage(global.language).Prompt.FAILED_TO_DELETE,
        )
        if (result) {
          this.itemInfo = null
          this._getSectionData()
        }
      } else {
        Toast.show(ConstInfo.PLEASE_CHOOSE_DELETE_OBJ)
      }
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
      this._closeModal()
    } finally {
      this.setLoading(false)
    }
  }

  _batchDelete = async (forceDelete = false) => {
    try {
      let deleteArr = this._getSelectedList()
      if (!forceDelete) {
        let relatedMaps = []
        relatedMaps = await this.getRelatedMaps(deleteArr)
        if (relatedMaps.length !== 0) {
          this.showRelatedMapsDialog({
            confirmAction: () => this._batchDelete(true),
            relatedMaps: relatedMaps,
          })
          return
        } else {
          this.showBatchDeleteConfirmDialog({
            confirmAction: () => this._batchDelete(true),
          })
          return
        }
      }
      let deleteItem
      deleteItem = async info => {
        this.itemInfo = info
        return await this.deleteData()
      }
      this.setLoading(true, getLanguage(global.language).Prompt.DELETING_DATA)
      let result = false
      for (let i = 0; i < deleteArr.length; i++) {
        result = await deleteItem(deleteArr[i])
        if (!result) {
          break
        }
      }
      this._getSectionData()
      Toast.show(
        result
          ? getLanguage(global.language).Prompt.DELETED_SUCCESS
          : getLanguage(global.language).Prompt.FAILED_TO_DELETE,
      )
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
    } finally {
      this.setLoading(false)
    }
  }

  _onShareData = async (type, fileName = '') => {
    try {
      if (this.state.batchMode) {
        let list = this._getSelectedList()
        if (list.length === 0) {
          Toast.show(getLanguage(global.language).Prompt.SELECT_AT_LEAST_ONE)
          return
        }
      }
      this.ShareModal && this.ShareModal.setVisible(false)
      this.shareType = type
      if (this.type === this.types.mark && fileName === '') {
        this.InputDialog.setDialogVisible(true)
        return
      }
      if (this.type === this.types.dataset && this.exportType === '') {
        if (!this.isExportable(this.itemInfo)) {
          this.showUnableExportDialog()
        } else {
          this.showSelectExportTypeDialog()
        }
        return
      }

      this.setLoading(
        true,
        type === 'local'
          ? getLanguage(global.language).Prompt.EXPORTING
          : getLanguage(global.language).Prompt.SHARING,
      )
      let result = undefined
      if (fileName === '') {
        if (this.type === this.types.dataset) {
          fileName = this.itemInfo.item.datasetName
        } else {
          fileName = this.itemInfo.item.name
        }
        let index = fileName.lastIndexOf('.')
        if (index > 0) {
          fileName = fileName.substring(0, index)
        }
      }
      switch (type) {
        case 'local':
          result = await this.exportData(fileName, false)
          break
        case 'online':
          result = await this.shareToOnline(fileName)
          break
        case 'iportal':
          result = await this.shareToIPortal(fileName)
          break
        case 'wechat':
          result = await this.shareToWechat(fileName)
          break
        case 'chat':
          result = await this.shareToChat(fileName)
          break
        case 'friend':
          result = await this.shareToFriend(fileName)
          break
        default:
          result = false
          break
      }

      if (result !== undefined) {
        if (result) {
          Toast.show(
            type === 'local'
              ? getLanguage(global.language).Prompt.EXPORT_SUCCESS
              : getLanguage(global.language).Prompt.SHARE_SUCCESS,
          )
          if (this.exportPath !== '') {
            this.showExportPathDialog()
          }
        } else {
          Toast.show(
            type === 'local'
              ? getLanguage(global.language).Prompt.EXPORT_FAILED
              : getLanguage(global.language).Prompt.SHARE_FAILED,
          )
        }
      }
    } catch (error) {
      Toast.show(
        type === 'local'
          ? getLanguage(global.language).Prompt.EXPORT_FAILED
          : getLanguage(global.language).Prompt.SHARE_FAILED,
      )
    } finally {
      this.setLoading(false)
    }
  }

  shareToWechat = async fileName => {
    let result
    let isInstalled
    if (Platform.OS === 'ios') {
      isInstalled = true
    } else {
      isInstalled = await appUtilsModule.isWXInstalled()
    }
    // let isInstalled = await appUtilsModule.isWXInstalled()
    if (isInstalled) {
      await this.exportData(fileName)
      let path = this.exportPath
      this.exportPath = ''
      let copyPath
      if (Platform.OS === 'android') {
        copyPath =
          global.homePath + this.getRelativeTempPath() + 'MyExportWX.zip'
        await FileTools.copyFile(path, copyPath, true)
      }
      result = await appUtilsModule.sendFileOfWechat({
        filePath: Platform.OS === 'ios' ? path : copyPath,
        title: fileName + '.zip',
        description: 'SuperMap iTablet',
      })
      await FileTools.deleteFile(path)
      if (!result) {
        Toast.show(getLanguage(global.language).Prompt.WX_SHARE_FAILED)
        return undefined
      }
    } else {
      Toast.show(getLanguage(global.language).Prompt.WX_NOT_INSTALLED)
    }
    return result === false ? result : undefined
  }

  shareToOnline = async fileName => {
    await this.exportData(fileName)
    let path = this.exportPath
    this.exportPath = ''
    let result
    let { ext, onlineDataType } = this._getUploadType()
    if (ext && onlineDataType) {
      result = await JSOnlineService.uploadFile(
        path,
        fileName + '.' + ext,
        onlineDataType,
      )
    } else {
      result = false
    }
    await FileTools.deleteFile(path)
    return result
  }

  shareToIPortal = async fileName => {
    await this.exportData(fileName)
    let path = this.exportPath
    this.exportPath = ''
    let result
    let { ext, onlineDataType } = this._getUploadType()
    if (ext && onlineDataType) {
      result = await JSIPortalServce.uploadFile(
        path,
        fileName + '.' + ext,
        onlineDataType,
      )
    } else {
      result = false
    }
    await FileTools.deleteFile(path)
    return result
  }

  shareToChat = async fileName => {
    await this.exportData(fileName)
    let path = this.exportPath
    this.exportPath = ''
    this.chatCallback && this.chatCallback(path, fileName)
    NavigationService.goBack()
  }

  shareToFriend = async fileName => {
    NavigationService.navigate('SelectFriend', {
      user: this.props.user,
      callBack: async targetId => {
        try {
          GLOBAL.Loading.setLoading(
            true,
            getLanguage(global.language).Prompt.SHARE_PREPARE,
          )
          await this.exportData(fileName)
          let path = this.exportPath
          this.exportPath = ''
          let type
          if (this.type === this.types.map) {
            type = MsgConstant.MSG_MAP
          }
          let action = [
            {
              name: 'onSendFile',
              type: type,
              filePath: path,
              fileName: fileName,
            },
          ]
          NavigationService.replace('CoworkTabs', {
            targetId: targetId,
            action: action,
          })
        } catch (error) {
          Toast.show(getLanguage(global.language).Prompt.SHARE_FAILED)
        } finally {
          GLOBAL.Loading.setLoading(false)
        }
      },
    })
  }

  _getUploadType = () => {
    let ext, onlineDataType
    if (this.type === this.types.map || this.type === this.types.scene) {
      ext = 'zip'
      onlineDataType = 'WORKSPACE'
    } else if (this.type === this.types.data || this.type === this.types.mark) {
      ext = 'zip'
      onlineDataType = 'UDB'
    } else if (this.type === this.types.color) {
      ext = 'scs'
      onlineDataType = 'COLORSCHEME'
    } else if (this.type === this.types.symbol) {
      let name = this.itemInfo.item.name
      let type =
        name.lastIndexOf('.') > 0
          ? name.substring(name.lastIndexOf('.') + 1).toLowerCase()
          : ''
      ext = type
      if (type === 'sym') {
        onlineDataType = 'MARKERSYMBOL'
      } else if (type === 'lsl') {
        onlineDataType = 'LINESYMBOL'
      } else if (type === 'bru') {
        onlineDataType = 'FILLSYMBOL'
      }
    } else if (this.type === this.types.template) {
      ext = 'zip'
      onlineDataType = 'UDB'
    }
    return {
      ext,
      onlineDataType,
    }
  }

  /***************************** 数据相关 end ******************************************/

  /****************************** 关联地图相关 *********************************************/

  /**
   * 获取关联地图
   * @param itemInfos  要删除的数据的数组
   */
  getRelatedMaps = async itemInfos => {
    let mapNames = []
    if (this.type !== this.types.data && this.type !== this.types.symbol) {
      return mapNames
    }

    let maps = await this._getMapsInfo()
    mapNames = await this._getRelatedMapNames(itemInfos, maps)
    return mapNames
  }

  /**
   * 获取地图信息
   */
  _getMapsInfo = async () => {
    let homePath = await FileTools.appendingHomeDirectory()
    let userPath =
      homePath +
      (this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? ConstPath.CustomerPath
        : ConstPath.UserPath + this.props.user.currentUser.userName + '/')

    let mapPath = userPath + ConstPath.RelativePath.Map
    let filter = {
      extension: 'exp',
      type: 'file',
    }
    let maps = await FileTools.getPathListByFilter(mapPath, filter)
    return maps
  }

  /**
   * 查询数据是否在地图中，返回地图名数组
   */
  _getRelatedMapNames = async (itemInfos, maps) => {
    let mapNames = []
    let homePath = await FileTools.appendingHomeDirectory()
    let getMap = false
    if (itemInfos.length > 0) {
      for (let i = 0; i < maps.length; i++) {
        let value = await RNFS.readFile(homePath + maps[i].path)
        let jsonObj = JSON.parse(value)
        if (this.type === this.types.data) {
          for (let j = 0; j < jsonObj.Datasources.length; j++) {
            for (let k = 0; k < itemInfos.length; k++) {
              let itemPath = itemInfos[k].item.path
              if (
                itemPath ===
                ConstPath.UserPath + jsonObj.Datasources[j].Server
              ) {
                let mapName = maps[i].name
                mapNames.push(mapName.substr(0, mapName.lastIndexOf('.')))
                getMap = true
                break
              }
            }
            if (getMap) {
              getMap = false
              break
            }
          }
        } else if (this.type === this.types.symbol) {
          for (let j = 0; j < itemInfos.length; j++) {
            let itemPath = itemInfos[j].item.path
            if (
              itemPath.substr(0, itemPath.lastIndexOf('.')) ===
              ConstPath.UserPath + jsonObj.Resources
            ) {
              let mapName = maps[i].name
              mapNames.push(mapName.substr(0, mapName.lastIndexOf('.')))
              break
            }
          }
        }
      }
    }
    return mapNames
  }

  /****************************** 关联地图相关 end ****************************************/

  /******************************* 批量操作 *******************************************/

  _selectAll = () => {
    let section = this.state.sectionData.clone()
    let j = 0
    for (let i = 0; i < section.length; i++) {
      for (let n = 0; n < section[i].data.length; n++) {
        section[i].data[n].checked = true
        j++
      }
    }
    this.setState({ section, selectedNum: j })
  }

  _deselectAll = () => {
    let section = this.state.sectionData.clone()
    for (let i = 0; i < section.length; i++) {
      for (let n = 0; n < section[i].data.length; n++) {
        section[i].data[n].checked = false
      }
    }
    this.setState({ section, selectedNum: 0 })
  }

  _getTotalItemNumber = () => {
    let section = this.state.sectionData
    let j = 0
    for (let i = 0; i < section.length; i++) {
      for (let n = 0; n < section[i].data.length; n++) {
        j++
      }
    }
    return j
  }

  _getSelectedList = () => {
    let list = []
    for (let i = 0; i < this.state.sectionData.length; i++) {
      for (let n = 0; n < this.state.sectionData[i].data.length; n++) {
        if (this.state.sectionData[i].data[n].checked === true) {
          list.push({
            item: this.state.sectionData[i].data[n],
            section: { title: this.state.sectionData[i].title },
          })
        }
      }
    }
    return list
  }

  /******************************* 批量操作 end *******************************************/

  /******************************* popup ***********************************************/

  //页面公共选项
  getCommonPagePopupData = () => [
    {
      title: getLanguage(global.language).Profile.BATCH_OPERATE,
      action: () => {
        this.setState({
          batchMode: !this.state.batchMode,
        })
      },
    },
  ]

  //项目公共选项
  getCommonItemPopupData = () => [
    {
      title: getLanguage(global.language).Profile[`UPLOAD_${this.type}`],
      action: () => {
        this._closeModal()
        this.exportType = ''
        this.ShareModal && this.ShareModal.setVisible(true)
      },
    },
    {
      title: getLanguage(global.language).Profile[`DELETE_${this.type}`],
      action: this._onDeleteData,
    },
  ]

  _getPagePopupData = () => {
    if (this.getPagePopupData().length > 0) {
      return this.getPagePopupData()
    } else {
      return this.getCustomPagePopupData().concat(this.getCommonPagePopupData())
    }
  }

  _getItemPopupData = () => {
    if (this.getItemPopupData().length > 0) {
      return this.getItemPopupData()
    } else {
      return this.getCustomItemPopupData().concat(this.getCommonItemPopupData())
    }
  }

  _closeModal = () => {
    this.PagePopModal && this.PagePopModal.setVisible(false)
    this.ItemPopModal && this.ItemPopModal.setVisible(false)
  }

  _renderPagePopup = () => {
    let data = this._getPagePopupData()
    return (
      <MyDataPopupModal
        ref={ref => (this.PagePopModal = ref)}
        data={data}
        onCloseModal={this._closeModal}
      />
    )
  }

  _renderItemPopup = () => {
    let data = this._getItemPopupData()
    return (
      <MyDataPopupModal
        ref={ref => (this.ItemPopModal = ref)}
        data={data}
        onCloseModal={this._closeModal}
      />
    )
  }

  /******************************* popup end *******************************************/

  /******************************* dialog **********************************************/

  showDeleteConfirmDialog = ({ confirmAction }) => {
    this.SimpleDialog.set({
      text: getLanguage(global.language).Prompt.DELETE_CONFIRM,
      confirmAction: confirmAction || this._onDeleteData,
    })
    this.SimpleDialog.setVisible(true)
  }

  showBatchDeleteConfirmDialog = ({ confirmAction }) => {
    let deleteArr = this._getSelectedList()
    if (deleteArr.length === 0) {
      Toast.show(getLanguage(global.language).Prompt.SELECT_AT_LEAST_ONE)
      return
    }
    this.SimpleDialog.set({
      text: getLanguage(global.language).Prompt.BATCH_DELETE_CONFIRM,
      confirmAction: confirmAction || this._batchDelete,
    })
    this.SimpleDialog.setVisible(true)
  }

  showRelatedMapsDialog = ({ confirmAction, relatedMaps }) => {
    let dialogHeight
    if (relatedMaps.length < 5) {
      dialogHeight = scaleSize(270) + relatedMaps.length * scaleSize(35)
    } else {
      dialogHeight = scaleSize(410)
    }
    this.SimpleDialog.set({
      text: getLanguage(global.language).Prompt.DELETE_MAP_RELATE_DATA,
      confirmAction: confirmAction,
      renderExtra: () => this.renderRelatedMap(relatedMaps),
      dialogStyle: { height: dialogHeight },
    })
    this.SimpleDialog.setVisible(true)
  }

  showExportPathDialog = () => {
    this.SimpleDialog.set({
      text: getLanguage(global.language).Prompt.EXPORT_TO,
      textStyle: { fontSize: scaleSize(28) },
      renderExtra: () => {
        return (
          <Text
            style={{
              textAlign: 'center',
              fontSize: scaleSize(24),
              marginTop: scaleSize(5),
            }}
          >
            {this.exportPath}
          </Text>
        )
      },
      confirmAction: () => (this.exportPath = ''),
      cancelAction: () => (this.exportPath = ''),
      dialogStyle: { width: scaleSize(500), height: scaleSize(340) },
    })
    this.SimpleDialog.setVisible(true)
  }

  /******************************* dialog end ******************************************/

  /******************************* UI **************************************************/

  renderSectionHeader = ({ section }) => {
    let title = section.title
    let imageSource = section.isShowItem
      ? require('../../../../assets/Mine/local_data_open.png')
      : require('../../../../assets/Mine/local_data_close.png')
    return (
      <TouchableOpacity
        style={styles.sectionView}
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
      >
        <Image source={imageSource} style={styles.sectionImg} />
        <Text style={styles.sectionText}>{section.title}</Text>
      </TouchableOpacity>
    )
  }

  _renderItem = info => {
    if (!info.section.isShowItem) {
      return <View />
    }

    let txtInfo,
      txtType,
      img,
      isShowMore = true
    if (this.getItemCallback || this.chatCallback) {
      isShowMore = false
    }

    if (this.type === this.types.dataset) {
      txtInfo = info.item.datasetName
      let type = info.item.datasetType
      if (type === DatasetType.POINT) {
        img = pointImg
      } else if (type === DatasetType.LINE) {
        img = lineImg
      } else if (type === DatasetType.REGION) {
        img = regionImg
      } else if (type === DatasetType.TEXT) {
        img = textImg
      } else if (type === DatasetType.CAD) {
        img = CADImg
      } else if (type === DatasetType.IMAGE || type === DatasetType.MBImage) {
        img = IMGImg
      } else if (type === DatasetType.GRID) {
        img = gridImg
      } else if (type === DatasetType.Network) {
        img = networkImg
      } else {
        img = defaultImg
      }
    } else {
      let name = info.item.name
      txtInfo =
        name.lastIndexOf('.') > 0
          ? name.substring(0, name.lastIndexOf('.'))
          : name
      txtType =
        name.lastIndexOf('.') > 0
          ? name.substring(name.lastIndexOf('.') + 1)
          : ''
      switch (this.type) {
        case this.types.map:
          img = require('../../../../assets/mapToolbar/list_type_map_black.png')
          break
        case this.types.symbol:
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
            img = require('../../../../assets/Mine/mine_my_online_data_black.png')
          }
          break
        case this.types.scene:
          img = require('../../../../assets/mapTools/icon_scene.png')
          break
        case this.types.template:
          img = require('../../../../assets/mapToolbar/list_type_map_black.png')
          break
        default:
          img = require('../../../../assets/Mine/mine_my_online_data_black.png')
          break
      }
    }
    return (
      <MineItem
        item={info.item}
        image={img}
        text={txtInfo}
        disableTouch={this.state.batchMode}
        showRight={isShowMore}
        showCheck={this.state.batchMode}
        onPress={() => {
          this.itemInfo = info
          if (this.chatCallback) {
            this._onShareData('chat')
          } else if (this.getItemCallback) {
            this.getItemCallback(info)
          } else {
            this.onItemPress(info)
          }
        }}
        onPressMore={() => {
          this.itemInfo = info
          this.ItemPopModal && this.ItemPopModal.setVisible(true)
        }}
        onPressCheck={item => {
          let selectedNum = this.state.selectedNum
          if (item.checked) {
            this.setState({ selectedNum: ++selectedNum })
          } else {
            this.setState({ selectedNum: --selectedNum })
          }
        }}
      />
    )
  }

  _keyExtractor = (section, index) => {
    return 'id:' + index
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

  _renderHeaderRight = () => {
    if (this.getItemCallback || this.chatCallback) return null
    if (this.state.batchMode) {
      return (
        <TouchableOpacity
          onPress={() => {
            this._deselectAll()
            this.setState({ batchMode: false })
          }}
          style={styles.moreView}
        >
          <Text style={styles.headerRightTextStyle}>
            {getLanguage(global.language).Prompt.COMPLETE}
          </Text>
        </TouchableOpacity>
      )
    }
    let moreImg = require('../../../../assets/home/Frenchgrey/icon_else_selected.png')
    return (
      <TouchableOpacity
        onPress={() => {
          this.PagePopModal.setVisible(true)
        }}
        style={styles.moreView}
      >
        <Image resizeMode={'contain'} source={moreImg} style={styles.moreImg} />
      </TouchableOpacity>
    )
  }

  _renderBatchHead = () => {
    return (
      <BatchHeadBar
        select={this.state.selectedNum}
        total={this._getTotalItemNumber()}
        selectAll={this._selectAll}
        deselectAll={this._deselectAll}
      />
    )
  }

  renderBatchBottom = () => {
    return (
      <View style={styles.bottomStyle}>
        {this.type === this.types.mark && (
          <TouchableOpacity
            style={styles.bottomItemStyle}
            onPress={() => {
              this.ShareModal.setVisible(true)
            }}
          >
            <Image
              style={{
                height: scaleSize(50),
                width: scaleSize(50),
                marginRight: scaleSize(20),
              }}
              source={getThemeAssets().share.share}
            />
            <Text style={{ fontSize: scaleSize(20) }}>
              {getLanguage(global.language).Profile.BATCH_SHARE}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.bottomItemStyle}
          onPress={() => this._batchDelete()}
        >
          <Image
            style={{
              height: scaleSize(50),
              width: scaleSize(50),
              marginRight: scaleSize(20),
            }}
            source={getThemeAssets().attribute.icon_delete}
          />
          <Text style={{ fontSize: scaleSize(20) }}>
            {getLanguage(global.language).Profile.BATCH_DELETE}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderSimpleDialog = () => {
    return (
      <SimpleDialog
        ref={ref => (this.SimpleDialog = ref)}
        text={getLanguage(global.language).Prompt.DELETE_MAP_RELATE_DATA}
        disableBackTouch={true}
      />
    )
  }

  renderRelatedMap = relatedMaps => {
    return (
      <View
        style={{
          marginTop: scaleSize(10),
          marginBottom: scaleSize(45),
          height: scaleSize(150),
          width: '80%',
        }}
      >
        <ScrollView showsVerticalScrollIndicator={true}>
          {relatedMaps.map((item, index) => {
            return (
              <Text
                key={index}
                style={{ fontSize: scaleSize(26), alignSelf: 'center' }}
              >
                {item}
              </Text>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  renderInputDialog = () => {
    return (
      <InputDialog
        ref={ref => (this.InputDialog = ref)}
        title={getLanguage(global.language).Prompt.ENTER_DATA_NAME}
        confirmAction={name => {
          if (name === null || name === '') {
            Toast.show(getLanguage(global.language).Prompt.ENTER_DATA_NAME)
            return
          }
          this.InputDialog.setDialogVisible(false)
          this._onShareData(this.shareType, name)
        }}
        cancelAction={() => {
          this.InputDialog.setDialogVisible(false)
        }}
        confirmBtnTitle={getLanguage(global.language).Prompt.SHARE}
        cancelBtnTitle={getLanguage(global.language).Prompt.CANCEL}
      />
    )
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
          headerRight: this._renderHeaderRight(),
        }}
      >
        {this.state.batchMode && this._renderBatchHead()}
        <SectionList
          style={{
            flex: 1,
            backgroundColor: color.contentColorWhite,
          }}
          sections={sectionData}
          initialNumToRender={20}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={
            this.state.showSectionHeader ? this.renderSectionHeader : null
          }
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
                  this._getSectionData().then(() => {
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
        {this._renderItemPopup()}
        {this._renderPagePopup()}
        {this.state.batchMode && this.renderBatchBottom()}
        {this.renderSimpleDialog()}
        {this.renderInputDialog()}
        <ModalBtns
          ref={ref => {
            this.ShareModal = ref
          }}
          actionOfLocal={
            this.state.shareToLocal
              ? () => {
                this._onShareData('local')
              }
              : undefined
          }
          actionOfOnline={
            this.state.shareToOnline
              ? UserType.isOnlineUser(this.props.user.currentUser)
                ? () => {
                  this._onShareData('online')
                }
                : undefined
              : undefined
          }
          actionOfIPortal={
            this.state.shareToIPortal
              ? UserType.isIPortalUser(this.props.user.currentUser)
                ? () => {
                  this._onShareData('iportal')
                }
                : undefined
              : undefined
          }
          actionOfWechat={
            this.state.shareToWechat
              ? () => {
                this._onShareData('wechat')
              }
              : undefined
          }
          actionOfFriend={
            this.state.shareToFriend
              ? UserType.isOnlineUser(this.props.user.currentUser)
                ? () => {
                  this._onShareData('friend')
                }
                : undefined
              : undefined
          }
        />
      </Container>
    )
  }
}
