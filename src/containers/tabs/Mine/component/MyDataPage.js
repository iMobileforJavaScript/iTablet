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
} from 'react-native'
import { Container, ListSeparator, InputDialog } from '../../../../components'
import { ConstPath, ConstInfo } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import MyDataPopupModal from './MyDataPopupModal'
import { color } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import ModalBtns from './ModalBtns'
import UserType from '../../../../constants/UserType'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language/index'
import { MsgConstant, SimpleDialog } from '../../Friend'
import { MineItem, BatchHeadBar } from '../component'
import { getThemeAssets } from '../../../../assets'
import RNFS from 'react-native-fs'
import styles from './styles'

const appUtilsModule = NativeModules.AppUtils

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
      sectionData: [],
      title: (params && params.title) || '',
      isRefreshing: false,
      batchMode: false,
      selectedNum: 0,
    }
    this.getItemCallback = params.getItemCallback || undefined
    this.chatCallback = params.chatCallback || undefined
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

  getRelativeTempFilePath = () => {
    let userPath =
      ConstPath.UserPath + this.props.user.currentUser.userName + '/'
    let relativeTempPath =
      userPath + ConstPath.RelativePath.Temp + 'MyExport.zip'
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

  getPagePopupData = () => {
    let data
    data = [
      {
        title: getLanguage(global.language).Profile.BATCH_OPERATE,
        action: () => {
          this.setState({
            batchMode: !this.state.batchMode,
          })
        },
      },
    ]
    return data
  }

  getItemPopupData = () => {
    return []
  }

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

  _getSectionData = async () => {
    try {
      let sectionData = await this.getData()
      this.setState({
        sectionData: sectionData,
        selectedNum: 0,
      })
    } catch (e) {
      // console.log(e)
    }
  }

  _onDeleteData = async (forceDelete = false) => {
    try {
      this._closeModal()
      let relatedMap = undefined
      if (!forceDelete) {
        relatedMap = await this.getRelatedMap(this.itemInfo)
      }
      if (relatedMap) {
        this.SimpleDialog.setDialogHeight(scaleSize(270))
        this.SimpleDialog.setConfirm(() => {
          this._onDeleteData(true)
        })
        this.SimpleDialog.setExtra(this.renderRelatedMap(relatedMap))
        this.SimpleDialog.setVisible(true)
        return
      }
      if (this.itemInfo !== undefined && this.itemInfo !== null) {
        this.setLoading(
          true,
          getLanguage(this.props.language).Prompt.DELETING_DATA,
        )
        let result = false
        result = await this.deleteData()
        Toast.show(
          result
            ? getLanguage(this.props.language).Prompt.DELETED_SUCCESS
            : getLanguage(this.props.language).Prompt.FAILED_TO_DELETE,
        )
        if (result) {
          this.itemInfo = null
          this._getSectionData()
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

  _batchDelete = async (forceDelete = false) => {
    try {
      let deleteArr = this._getSelectedList()
      if (deleteArr.length === 0) {
        Toast.show(getLanguage(global.language).Prompt.SELECT_AT_LEAST_ONE)
        return
      }
      let relatedMaps = []
      if (!forceDelete) {
        relatedMaps = await this.getRelatedMaps(deleteArr)
      }
      if (relatedMaps.length !== 0) {
        let dialogHeight
        if (relatedMaps.length < 5) {
          dialogHeight = scaleSize(240) + relatedMaps.length * scaleSize(30)
        } else {
          dialogHeight = scaleSize(370)
        }
        this.SimpleDialog.setDialogHeight(dialogHeight)
        this.SimpleDialog.setConfirm(() => {
          this._batchDelete(true)
        })
        this.SimpleDialog.setExtra(this.renderRelatedMap(relatedMaps))
        this.SimpleDialog.setVisible(true)
        return
      }
      let deleteItem
      deleteItem = async info => {
        this.itemInfo = info
        await this.deleteData()
      }

      for (let i = 0; i < deleteArr.length; i++) {
        await deleteItem(deleteArr[i])
      }
      this._getSectionData()
      Toast.show(getLanguage(global.language).Prompt.DELETED_SUCCESS)
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
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
      if (
        this.state.title === getLanguage(this.props.language).Profile.MARK &&
        fileName === ''
      ) {
        this.type = type
        this.InputDialog.setDialogVisible(true)
        return
      }
      this.ModalBtns && this.ModalBtns.setVisible(false)
      this.setLoading(true, getLanguage(this.props.language).Prompt.SHARING)
      let result = undefined
      if (fileName === '') {
        fileName = this.itemInfo.item.name
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
        result
          ? Toast.show(getLanguage(global.language).Prompt.SHARE_SUCCESS)
          : Toast.show(getLanguage(this.props.language).Prompt.SHARE_FAILED)
      }
    } catch (error) {
      Toast.show(getLanguage(this.props.language).Prompt.SHARE_FAILED)
    } finally {
      this.setLoading(false)
    }
  }

  shareToWechat = async fileName => {
    await this.exportData(fileName)
    let homePath = await FileTools.appendingHomeDirectory()
    let path = homePath + this.getRelativeTempFilePath()
    let result = await appUtilsModule.sendFileOfWechat({
      filePath: path,
      title: fileName + '.zip',
      description: 'SuperMap iTablet',
    })
    return result
  }

  shareToOnline = async fileName => {
    await this.exportData(fileName)
    let homePath = await FileTools.appendingHomeDirectory()
    let path = homePath + this.getRelativeTempFilePath()
    let result
    if (this.state.title === getLanguage(this.props.language).Profile.MAP) {
      result = await SOnlineService.uploadFile(path, fileName)
    } else {
      result = await SOnlineService.uploadFilebyType(path, fileName, 'UDB')
    }
    return result
  }

  shareToIPortal = async fileName => {
    await this.exportData(fileName)
    let homePath = await FileTools.appendingHomeDirectory()
    let path = homePath + this.getRelativeTempFilePath()
    let uploadResult
    if (this.state.title === getLanguage(this.props.language).Profile.MAP) {
      uploadResult = await SIPortalService.uploadData(path, fileName + '.zip')
    } else {
      uploadResult = await SIPortalService.uploadDataByType(
        path,
        fileName + '.zip',
        'UDB',
      )
    }
    return uploadResult
  }

  shareToChat = async fileName => {
    await this.exportData(fileName)
    let homePath = await FileTools.appendingHomeDirectory()
    let path = homePath + this.getRelativeTempFilePath()
    this.chatCallback && this.chatCallback(path, fileName)
    NavigationService.goBack()
  }

  shareToFriend = async fileName => {
    let homePath = await FileTools.appendingHomeDirectory()
    let path = homePath + this.getRelativeTempFilePath()
    let type
    if (this.state.title === getLanguage(this.props.language).Profile.MAP) {
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
    NavigationService.navigate('SelectFriend', {
      user: this.props.user,
      callBack: async targetId => {
        await this.exportData(fileName)
        NavigationService.replace('CoworkTabs', {
          targetId: targetId,
          action: action,
        })
      },
    })
  }

  /***************************** 数据相关 end ******************************************/

  /****************************** 关联地图相关 *********************************************/

  /**
   * 获取地图信息
   */
  getMapsInfo = async () => {
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
   * 数据是否在地图中，返回地图名
   */
  getRelatedMapName = async (itemInfo, maps) => {
    let mapName = undefined
    let itemPath = itemInfo.item.path
    let homePath = await FileTools.appendingHomeDirectory()
    for (let i = 0; i < maps.length; i++) {
      let value = await RNFS.readFile(homePath + maps[i].path)
      let jsonObj = JSON.parse(value)
      if (this.state.title === getLanguage(this.props.language).Profile.DATA) {
        for (let n in jsonObj.Datasources) {
          if (itemPath === ConstPath.UserPath + jsonObj.Datasources[n].Server) {
            mapName = maps[i].name
            break
          }
        }
      } else if (
        this.state.title === getLanguage(this.props.language).Profile.SYMBOL
      ) {
        if (
          itemPath.substr(0, itemPath.lastIndexOf('.')) ===
          ConstPath.UserPath + jsonObj.Resources
        ) {
          mapName = maps[i].name
          break
        }
      }
    }
    return mapName ? mapName.substr(0, mapName.lastIndexOf('.')) : undefined
  }

  /**
   * 获取数据关联的地图
   */
  getRelatedMap = async itemInfo => {
    let mapName = undefined
    if (
      this.state.title !== getLanguage(this.props.language).Profile.DATA &&
      this.state.title !== getLanguage(this.props.language).Profile.SYMBOL
    ) {
      return mapName
    }

    let maps = await this.getMapsInfo()
    return await this.getRelatedMapName(itemInfo, maps)
  }

  /**
   * 批量获取关联地图
   */
  getRelatedMaps = async itemInfos => {
    let mapNames = []
    if (
      this.state.title !== getLanguage(this.props.language).Profile.DATA &&
      this.state.title !== getLanguage(this.props.language).Profile.SYMBOL
    ) {
      return mapNames
    }

    let maps = await this.getMapsInfo()
    for (let i = 0; i < itemInfos.length; i++) {
      let mapName = await this.getRelatedMapName(itemInfos[i], maps)
      mapName && mapNames.push(mapName)
    }
    return Array.from(new Set(mapNames))
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

  _closeModal = () => {
    this.ItemPopModal && this.ItemPopModal.setVisible(false)
    this.PagePopModal && this.PagePopModal.setVisible(false)
  }

  _renderItemPopup = () => {
    let data = this.getItemPopupData()
    return (
      <MyDataPopupModal
        ref={ref => (this.ItemPopModal = ref)}
        data={data}
        onCloseModal={this._closeModal}
      />
    )
  }

  _renderPagePopup = () => {
    let data = this.getPagePopupData()
    return (
      <MyDataPopupModal
        ref={ref => (this.PagePopModal = ref)}
        data={data}
        onCloseModal={this._closeModal}
      />
    )
  }

  /******************************* popup end *******************************************/

  /******************************* UI **************************************************/

  renderSectionHeader = () => {
    return <View />
  }

  _renderItem = info => {
    if (!info.section.isShowItem) {
      return <View />
    }
    let name = info.item.name
    let txtInfo =
      name.lastIndexOf('.') > 0
        ? name.substring(0, name.lastIndexOf('.'))
        : name
    let txtType =
      name.lastIndexOf('.') > 0 ? name.substring(name.lastIndexOf('.') + 1) : ''

    let img,
      isShowMore = true
    if (this.getItemCallback || this.chatCallback) {
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
          img = require('../../../../assets/Mine/mine_my_online_data_black.png')
        }
        break
      case getLanguage(this.props.language).Profile.SCENE:
        img = require('../../../../assets/mapTools/icon_scene.png')
        break
      case getLanguage(this.props.language).Profile.TEMPLATE:
        img = require('../../../../assets/mapToolbar/list_type_map_black.png')
        break
      default:
        img = require('../../../../assets/Mine/mine_my_online_data_black.png')
        break
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
        {this.state.title === getLanguage(this.props.language).Profile.MARK && (
          <TouchableOpacity
            style={styles.bottomItemStyle}
            onPress={() => {
              this.ModalBtns.setVisible(true)
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

  renderRelatedMap = relatedMap => {
    return (
      <View
        style={{
          marginTop: scaleSize(10),
          marginBottom: scaleSize(45),
          height: scaleSize(150),
          width: '80%',
        }}
      >
        {relatedMap instanceof Array ? (
          <ScrollView showsVerticalScrollIndicator={true}>
            {relatedMap.map((item, index) => {
              return (
                <Text key={index} style={{ fontSize: scaleSize(24) }}>
                  {item}
                </Text>
              )
            })}
          </ScrollView>
        ) : (
          <Text style={{ fontSize: scaleSize(24) }}>{relatedMap}</Text>
        )}
      </View>
    )
  }

  renderInputDialog = () => {
    return (
      <InputDialog
        ref={ref => (this.InputDialog = ref)}
        placeholder={getLanguage(global.language).Prompt.ENTER_DATA_NAME}
        confirmAction={name => {
          if (name === null || name === '') {
            Toast.show(getLanguage(global.language).Prompt.ENTER_DATA_NAME)
            return
          }
          this.InputDialog.setDialogVisible(false)
          this._onShareData(this.type, name)
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
          renderSectionHeader={this.renderSectionHeader}
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
        {this._renderItemPopup()}
        {this._renderPagePopup()}
        {this.state.batchMode && this.renderBatchBottom()}
        {this.renderSimpleDialog()}
        {this.renderInputDialog()}
        <ModalBtns
          ref={ref => {
            this.ModalBtns = ref
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
