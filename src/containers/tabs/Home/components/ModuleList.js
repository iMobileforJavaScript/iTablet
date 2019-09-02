import React, { Component } from 'react'
import { View, FlatList, StyleSheet, Platform } from 'react-native'
import { ConstPath } from '../../../../constants'
import constants from '../../../../containers/workspace/constants'
import ConstModule from '../../../../constants/ConstModule'
import { scaleSize, screen } from '../../../../utils'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import FetchUtils from '../../../../utils/FetchUtils'
import { SMap } from 'imobile_for_reactnative'
import { downloadFile, deleteDownloadFile } from '../../../../models/down'

import { connect } from 'react-redux'
import { getLanguage } from '../../../../language'
import ModuleItem from './ModuleItem'

let isWaiting = false // 防止重复点击

async function composeWaiting(action) {
  if (isWaiting) return
  isWaiting = true
  if (action && typeof action === 'function') {
    await action()
  }
  isWaiting = false
}

class ModuleList extends Component {
  props: {
    language: string,
    device: Object,
    currentUser: Object,
    latestMap: Object,
    downloads: Array,
    importWorkspace: () => {},
    showDialog: () => {},
    getModuleItem: () => {},
    downloadFile: () => {},
    deleteDownloadFile: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isShowProgressView: false,
    }
    this.moduleItems = []
  }

  async componentDidMount() {
    this.homePath = await FileTools.appendingHomeDirectory()
  }

  _showAlert = (ref, downloadData, currentUserName) => {
    setTimeout(() => {
      this.props.showDialog && this.props.showDialog(true)
    }, 1500)
    this.props.getModuleItem &&
      this.props.getModuleItem(
        ref,
        this.sureDown,
        this.cancelDown,
        downloadData,
        currentUserName,
        ref.getDialogCheck(),
      )
  }

  _downloadModuleData = async (ref, downloadData) => {
    ref.setDownloading(true)
    let keyword
    if (downloadData.fileName.indexOf('_示范数据') !== -1) {
      keyword = downloadData.fileName
    } else {
      keyword = downloadData.fileName + '_示范数据'
    }
    let dataUrl = await FetchUtils.getFindUserDataUrl(
      'xiezhiyan123',
      keyword,
      '.zip',
    )
    let cachePath = downloadData.cachePath
    let fileDirPath = cachePath + downloadData.fileName
    try {
      let fileCachePath = fileDirPath + '.zip'
      let downloadOptions = {
        fromUrl: dataUrl,
        toFile: fileCachePath,
        background: true,
        fileName: downloadData.fileName,
        progressDivider: 1,
        key: downloadData.key,
      }
      this.props
        .downloadFile(downloadOptions)
        .then(async () => {
          await FileTools.unZipFile(fileCachePath, cachePath)
          let arrFile = await FileTools.getFilterFiles(fileDirPath)
          await this.props.importWorkspace(
            arrFile[0].filePath,
            // downloadData.copyFilePath,
          )
          FileTools.deleteFile(fileDirPath + '_')
          FileTools.deleteFile(fileDirPath + '.zip')
          this.props.deleteDownloadFile({ id: downloadData.key })
          ref.setDownloading(false)
        })
        .catch(() => {
          Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
          FileTools.deleteFile(fileCachePath)
          this.props.deleteDownloadFile({ id: downloadData.key })
        })
    } catch (e) {
      Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
      //'网络错误，下载失败')
      FileTools.deleteFile(fileDirPath + '.zip')
      ref.setNewState({ isShowProgressView: false, disabled: false })
      ref.setDownloading(false)
    }
  }

  sureDown = (ref, downloadData, dialogCheck) => {
    this._downloadModuleData(ref, downloadData)
    ref.setNewState({
      disabled: false,
      dialogCheck: dialogCheck,
    })
    this.props.showDialog && this.props.showDialog(false)
  }

  cancelDown = (ref, dialogCheck) => {
    // let item = downloadData.itemData
    ref.setNewState({
      disabled: false,
      dialogCheck: dialogCheck,
    })
    // item.action && item.action(downloadData.tmpCurrentUser)
    this.props.showDialog && this.props.showDialog(false)
  }

  getDownloadData = (language, item) => {
    let fileName
    let moduleKey = item.key
    /** 服务器上解压出来的名字就是以下的fileName，不可改动，若需要改，则必须改为解压过后的文件名*/
    if (moduleKey === constants.MAP_EDIT) {
      fileName = language === 'CN' ? '湖南' : 'LosAngeles'
    } else if (moduleKey === constants.MAP_THEME) {
      fileName = language === 'CN' ? '湖北' : 'PrecipitationOfUSA'
    } else if (moduleKey === constants.COLLECTION) {
      fileName = '地理国情普查_示范数据'
    } else if (moduleKey === constants.MAP_ANALYST) {
      // fileName = 'Xiamen_CN'
      fileName = '数据分析数据'
    } else if (moduleKey === constants.MAP_3D) {
      if (Platform.OS === 'android') {
        fileName = 'OlympicGreen_android'
      } else if (Platform.OS === 'ios') {
        fileName = 'OlympicGreen_ios'
      }
    } else if (moduleKey === constants.MAP_PLOTTING) {
      fileName = '福建_示范数据'
    } else if (moduleKey === constants.MAP_NAVIGATION) {
      fileName = '导航数据'
    }

    let tmpCurrentUser = this.props.currentUser

    let toPath = this.homePath + ConstPath.CachePath + fileName

    let cachePath = this.homePath + ConstPath.CachePath
    return {
      key: moduleKey,
      fileName: fileName,
      cachePath: cachePath,
      copyFilePath: toPath,
      itemData: item,
      tmpCurrentUser: tmpCurrentUser,
    }
  }

  itemAction = async (language, { item, index }) => {
    try {
      let tmpCurrentUser = this.props.currentUser
      let currentUserName = tmpCurrentUser.userName
        ? tmpCurrentUser.userName
        : 'Customer'

      let module = item.key
      let latestMap
      if (
        this.props.latestMap[currentUserName] &&
        this.props.latestMap[currentUserName][module] &&
        this.props.latestMap[currentUserName][module].length > 0
      ) {
        latestMap = this.props.latestMap[currentUserName][module][0]
      }

      if (item.key === constants.MAP_AR) {
        item.action && composeWaiting(item.action(tmpCurrentUser, latestMap))
        return
      }

      let downloadData = this.getDownloadData(language, item)
      let currentDownloadData = this.getCurrentDownloadData(downloadData)
      // let toPath = this.homePath + ConstPath.CachePath + downloadData.fileName

      let cachePath = this.homePath + ConstPath.CachePath
      let fileDirPath = cachePath + downloadData.fileName
      let arrFile = await FileTools.getFilterFiles(fileDirPath)
      if (arrFile.length === 0) {
        if (
          !(
            this.moduleItems &&
            this.moduleItems[index] &&
            (this.moduleItems[index].getDialogCheck() ||
              this.moduleItems[index].getDownloading())
          ) &&
          !currentDownloadData
        ) {
          this._showAlert(this.moduleItems[index], downloadData, tmpCurrentUser)
        }
        item.action && composeWaiting(item.action(tmpCurrentUser, latestMap))
      } else {
        let filePath2
        let filePath = arrFile[0].filePath
        let fileType = filePath.substr(filePath.lastIndexOf('.')).toLowerCase()
        let fileName = filePath.substring(
          filePath.lastIndexOf('/') + 1,
          filePath.lastIndexOf('.'),
        )
        if (fileType === '.sxwu') {
          filePath2 =
            this.homePath +
            ConstPath.UserPath +
            currentUserName +
            '/Data/Scene/' +
            fileName +
            '.pxp'
        } else {
          let maps = await SMap.getMapsByFile(filePath)
          let mapName = maps[0]
          filePath2 =
            this.homePath +
            ConstPath.UserPath +
            currentUserName +
            '/Data/Map/' +
            mapName +
            '.xml'
        }
        let isExist = await FileTools.fileIsExist(filePath2)
        if (!isExist) {
          // await this.props.importWorkspace(filePath, toPath, true)
          await this.props.importWorkspace(filePath)
        }
        this.moduleItems[index].setNewState({
          disabled: false,
          isShowProgressView: false,
        })
        item.action && composeWaiting(item.action(tmpCurrentUser, latestMap))
      }
    } catch (e) {
      this.moduleItems[index].setNewState({
        disabled: false,
        isShowProgressView: false,
      })
    }
  }

  getRef = (data, ref) => {
    this.moduleItems[data.index] = ref
  }

  getCurrentDownloadData = downloadData => {
    if (this.props.downloads.length > 0) {
      for (let i = 0; i < this.props.downloads.length; i++) {
        if (this.props.downloads[i].id === downloadData.key) {
          return this.props.downloads[i]
        }
      }
    }
    return null
  }

  _renderItem = ({ item, index }) => {
    let downloadData = this.getDownloadData(global.language, item)
    return (
      <ModuleItem
        item={item}
        downloadData={this.getCurrentDownloadData(downloadData)}
        ref={ref => this.getRef({ item, index }, ref)}
        importWorkspace={this.props.importWorkspace}
        showDialog={this.props.showDialog}
        getModuleItem={this.props.getModuleItem}
        itemAction={() => this.itemAction(this.props.language, { item, index })}
      />
    )
  }

  _renderScrollView = () => {
    return (
      <View style={styles.flatListView}>
        <FlatList
          key={'landscapeList'}
          data={ConstModule(this.props.language)}
          horizontal={true}
          downloads={this.props.downloads}
          renderItem={this._renderItem}
          keyboardShouldPersistTaps={'always'}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    )
  }

  render() {
    let data = ConstModule(this.props.language)
    let height = (scaleSize(220) * data.length) / 2
    let dOffset = 20
    if (Platform.OS === 'android') {
      dOffset = scaleSize(80)
    }
    let contentH =
      screen.getScreenHeight() -
      scaleSize(88) -
      scaleSize(96) -
      scaleSize(dOffset)
    let scrollEnabled = false
    if (height >= contentH) {
      height = contentH
      scrollEnabled = true
    }
    return (
      <View style={styles.container}>
        {this.props.device.orientation === 'LANDSCAPE' ? (
          this._renderScrollView()
        ) : (
          <View style={{ width: '100%', height: height }}>
            <FlatList
              key={'list'}
              style={styles.flatList}
              data={data}
              renderItem={this._renderItem}
              scrollEnabled={scrollEnabled}
              horizontal={false}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'always'}
            />
          </View>
        )}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  downloads: state.down.toJS().downloads,
})
const mapDispatchToProps = {
  downloadFile,
  deleteDownloadFile,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModuleList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  flatList: {
    alignSelf: 'center',
    flex: 1,
  },
  flatListView: {
    height: scaleSize(220),
  },
})
