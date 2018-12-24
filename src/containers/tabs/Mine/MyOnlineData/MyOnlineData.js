import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter,
  NativeModules,
} from 'react-native'
import { SOnlineService, Utility, SMap } from 'imobile_for_reactnative'
import Container from '../../../../components/Container/index'
import styles from './Styles'
import Toast from '../../../../utils/Toast'
import PopupModal from './PopupModal'
import ConstPath from '../../../../constants/ConstPath'
const nativeFileTools = NativeModules.FileTools
let _iLoadOnlineDataCount = -1
let _iDataListTotal = -1
let _iDownloadingIndex = -1
let _arrOnlineData = [{}]
export default class MyOnlineData extends Component {
  props: {
    navigation: Object,
    user: Object,
    openWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: _arrOnlineData,
      isRefreshing: false,
      modalIsVisible: false,
      downloadingIndex: -1,
    }
    this.pageSize = 20
    this._addListener()
  }

  async componentDidMount() {
    _arrOnlineData = await this._initData(1, this.pageSize)
    this.setState({ data: _arrOnlineData })
  }
  componentWillUnmount() {
    this._removeListener()
  }
  _initData = async (currentPage, pageSize) => {
    let newData = []
    try {
      let strDataList = await SOnlineService.getDataList(currentPage, pageSize)
      let objDataList = JSON.parse(strDataList)
      _iDataListTotal = objDataList.total
      let arrDataContent = objDataList.content
      let contentLength = arrDataContent.length

      for (let i = 0; i < contentLength; i++) {
        let objContent = arrDataContent[i]
        objContent.isDownloading = true
        objContent.downloadingProgress = '下载'
        newData.push(objContent)
      }
      if (this.state.data.length === 1 && this.state.data[0].id === undefined) {
        _arrOnlineData = newData
        this.setState({ data: _arrOnlineData })
      }
    } catch (e) {
      Toast.show('网络错误')
    }
    return newData
  }

  _renderItem = item => {
    let dataName = item.item.fileName
    if (dataName !== undefined) {
      let length = dataName.length - 4
      let newDataName = dataName.substring(0, length)
      let itemHeight = 50
      return (
        <TouchableOpacity
          onPress={() => {
            this.index = item.index
            this.setState({ modalIsVisible: true })
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: Dimensions.get('window').width,
              height: itemHeight,
            }}
          >
            <Text
              style={{
                flex: 1,
                lineHeight: itemHeight,
                textAlign: 'left',
                fontSize: 18,
                color: 'white',
                paddingLeft: 10,
              }}
            >
              {newDataName}
            </Text>
            <Text
              style={{
                lineHeight: itemHeight,
                width: 100,
                textAlign: 'right',
                fontSize: 25,
                color: 'white',
                paddingRight: 20,
              }}
            >
              ...
            </Text>
          </View>
          <View
            style={{
              height: 2,
              width: Dimensions.get('window').width,
              backgroundColor: '#2D2D2F',
            }}
          />
        </TouchableOpacity>
      )
    }
    return <View />
  }

  _keyExtractor = (item, index) => {
    return index * index + ''
  }

  _onRefresh = async () => {
    if (!this.state.isRefreshing) {
      try {
        this.setState({ isRefreshing: true })
        _iLoadOnlineDataCount = 1
        _arrOnlineData = await this._initData(
          _iLoadOnlineDataCount,
          this.pageSize,
        )
        this.setState({ data: _arrOnlineData, isRefreshing: false })
      } catch (e) {
        this.setState({ isRefreshing: false })
      }
    }
  }

  _loadData = async () => {
    let dataCount = this.state.data.length
    if (_iDataListTotal > dataCount) {
      _iLoadOnlineDataCount = ++_iLoadOnlineDataCount
      let data = await this._initData(_iLoadOnlineDataCount, this.pageSize)
      let newData = this.state.data
      newData.push(data)
      _arrOnlineData = newData
      this.setState({ data: _arrOnlineData })
    }
  }
  _footView = () => {
    return <View />
  }

  _onCloseModal = () => {
    this.setState({ modalIsVisible: false })
  }

  _addListener = () => {
    let downloadingEventType =
      'com.supermap.RN.Mapcontrol.online_service_downloading'
    let downloadFailureType =
      'com.supermap.RN.Mapcontrol.online_service_downloadfailure'
    let downloadedType = 'com.supermap.RN.Mapcontrol.online_service_downloaded'
    if (Platform.OS === 'ios') {
      let callBackIos = SOnlineService.objCallBack()
      this.downloadingListener = callBackIos.addListener(
        downloadingEventType,
        obj => {
          let progress = obj.progress
          let result = '下载' + progress.toFixed(2) + '%'
          this._changeModalProgressState(result)
        },
      )
      this.downloadFailureListener = callBackIos.addListener(
        downloadFailureType,
        () => {
          let result = '下载失败'
          this._changeModalProgressState(result)
        },
      )
      this.downloadedListener = callBackIos.addListener(downloadedType, () => {
        let result = '下载完成，可导入'
        this._changeModalProgressState(result)
      })
    }
    if (Platform.OS === 'android') {
      this.downloadingListener = DeviceEventEmitter.addListener(
        downloadingEventType,
        progress => {
          let result = '下载' + progress.toFixed(0) + '%'
          this._changeModalProgressState(result)
        },
      )
      this.downloadedListener = DeviceEventEmitter.addListener(
        downloadedType,
        () => {
          let result = '下载完成，可导入'
          this._changeModalProgressState(result)
        },
      )
      this.downloadFailureListener = DeviceEventEmitter.addListener(
        downloadFailureType,
        () => {
          let result = '下载失败'
          this._changeModalProgressState(result)
        },
      )
    }
  }

  _unZipFile = async () => {
    let objContent = this.state.data[this.index]
    let path =
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/Data/downloads/' +
      objContent.fileName
    let filePath = await Utility.appendingHomeDirectory(path)
    let savePath = filePath.substring(0, filePath.length - 4)
    this._unZipFilePath = savePath
    nativeFileTools.unZipFile(filePath, savePath)
  }

  _changeModalProgressState = progress => {
    if (
      this.modalRef !== undefined &&
      this.modalRef !== null &&
      this.modalRef !== 'null'
    ) {
      if (
        _iDownloadingIndex >= 0 &&
        this.state.data[_iDownloadingIndex].isDownloading
      ) {
        this.modalRef._changeDownloadingState(progress)
      }
      if (progress === '下载完成，可导入' || progress === '下载失败') {
        this._resetDownloadingState()
        this._setFinalDownloadingProgress(_iDownloadingIndex, progress)
        this.setState({ data: this.state.data })
        if (progress === '下载完成，可导入') {
          this._unZipFile()
        }
      }
    }
  }

  _setFinalDownloadingProgress = (index, progress) => {
    for (let i = 0; i < this.state.data.length; i++) {
      let objContent = this.state.data[i]
      if (i === index) {
        objContent.downloadingProgress = progress
      } else {
        objContent.downloadingProgress = '下载'
      }
    }
  }

  _resetDownloadingState = () => {
    for (let i = 0; i < this.state.data.length; i++) {
      let objContent = this.state.data[i]
      objContent.isDownloading = true
    }
    _arrOnlineData = this.state.data
  }

  _downloading = index => {
    for (let i = 0; i < this.state.data.length; i++) {
      if (i !== index) {
        let objContent = this.state.data[i]
        objContent.isDownloading = false
      }
    }
    _arrOnlineData = this.state.data
  }
  _removeListener = () => {
    if (this.downloadFailureListener !== undefined) {
      this.downloadFailureListener.remove()
      this.downloadFailureListener = undefined
    }
    if (this.downloadedListener !== undefined) {
      this.downloadedListener.remove()
      this.downloadedListener = undefined
    }
    if (this.downloadingListener !== undefined) {
      this.downloadingListener.remove()
      this.downloadingListener = undefined
    }
  }
  _onDownloadFile = async () => {
    try {
      let objContent = this.state.data[this.index]
      let dataId = objContent.id + ''
      let path =
        ConstPath.UserPath +
        this.props.user.currentUser.userName +
        '/Data/downloads/' +
        objContent.fileName
      let filePath = await Utility.appendingHomeDirectory(path)
      let isFileExist = await Utility.fileIsExist(path)
      if (isFileExist) {
        Toast.show('下载完成，可导入')
        this._changeModalProgressState('下载完成，可导入')
        return
      }
      _iDownloadingIndex = this.index
      this._downloading(_iDownloadingIndex)
      this.setState({ data: this.state.data })
      this.modalRef._changeDownloadingState('下载中...')
      SOnlineService.downloadFileWithDataId(filePath, dataId)
      Toast.show('开始下载')
    } catch (e) {
      Toast.show('网络错误')
      this._resetDownloadingState()
      this.setState({ modalIsVisible: false, data: this.state.data })
    }
  }

  _onPublishService = async () => {
    this.setState({ modalIsVisible: false })
    try {
      let objContent = this.state.data[this.index]
      let dataId = objContent.id + ''
      let result = await SOnlineService.publishServiceWithDataId(dataId)
      if (typeof result === 'boolean' && result) {
        let arrDataItemServices = objContent.dataItemServices
        let dataItemServices = { serviceType: 'RESTMAP', serviceName: '' }
        arrDataItemServices.push(dataItemServices)
        this.setState({ data: this.state.data })
        Toast.show('服务发布成功')
      } else {
        Toast.show(result)
      }
    } catch (e) {
      Toast.show('网络错误')
    }
  }

  _onDeleteService = async () => {
    this.setState({ modalIsVisible: false })
    try {
      let objContent = this.state.data[this.index]
      let fileName = objContent.fileName.substring(
        0,
        objContent.fileName.length - 4,
      )
      let result = await SOnlineService.deleteServiceWithDataName(fileName)
      if (typeof result === 'boolean' && result) {
        let dataItemServices = objContent.dataItemServices
        for (let i = 0; i < dataItemServices.length; i++) {
          let serviceType = dataItemServices[i].serviceType
          if (serviceType === 'RESTMAP') {
            dataItemServices.splice(i, 1)
          }
        }
        this.setState({ data: this.state.data })
        Toast.show('服务删除成功')
      } else {
        Toast.show(result)
      }
    } catch (e) {
      Toast.show('网络错误')
    }
  }
  _onChangeDataVisibility = async () => {
    this.setState({ modalIsVisible: false })
    try {
      let objContent = this.state.data[this.index]
      let dataId = objContent.id + ''
      let isPublish = false
      let authorizeSetting = objContent.authorizeSetting
      let splice = 0
      for (let i = 0; i < authorizeSetting.length; i++) {
        let dataPermissionType = authorizeSetting[i].dataPermissionType
        if (dataPermissionType === 'DOWNLOAD') {
          isPublish = true
          splice = i
          break
        }
      }
      let result = await SOnlineService.changeDataVisibilityWithDataId(
        dataId,
        !isPublish,
      )
      if (typeof result === 'boolean' && result) {
        if (isPublish) {
          authorizeSetting.splice(splice, 1)
          Toast.show('成功设置为私有数据')
        } else {
          let dataPermissionType = { dataPermissionType: 'DOWNLOAD' }
          authorizeSetting.push(dataPermissionType)

          Toast.show('成功设置为共有数据')
        }
        this.setState({ data: this.state.data })
      } else {
        Toast.show(result)
      }
    } catch (e) {
      Toast.show('网络错误')
    }
  }

  _onDeleteData = async () => {
    this.setState({ modalIsVisible: false })
    try {
      let objContent = this.state.data[this.index]
      let dataId = objContent.id + ''
      let result = await SOnlineService.deleteDataWithDataId(dataId)
      if (typeof result === 'boolean' && result) {
        let arrContent = this.state.data
        arrContent.splice(this.index, 1)
        this.setState({ data: arrContent })
        Toast.show('数据删除成功')
      } else {
        Toast.show(result)
      }
    } catch (e) {
      Toast.show('网络错误')
    }
  }

  _openWorkspace = async () => {
    await Utility.getPathListByFilter()
    let path = this._unZipFilePath
    SMap.importWorkspace({ server: path })
  }
  _renderModal = () => {
    if (this.index !== undefined) {
      return (
        <PopupModal
          ref={ref => {
            if (this.state.data[this.index].isDownloading && ref !== 'null') {
              this.modalRef = ref
            }
          }}
          data={this.state.data[this.index]}
          openWorkspace={this._openWorkspace}
          onDeleteService={this._onDeleteService}
          onDownloadFile={this._onDownloadFile}
          onPublishService={this._onPublishService}
          onChangeDataVisibility={this._onChangeDataVisibility}
          onDeleteData={this._onDeleteData}
          onCloseModal={this._onCloseModal}
          modalVisible={this.state.modalIsVisible}
        />
      )
    }
  }

  _render = () => {
    if (this.state.data.length === 1 && this.state.data[0].id === undefined) {
      return (
        <View style={styles.noDataViewStyle}>
          <ActivityIndicator color={'gray'} animating={true} />
          <Text>Loading...</Text>
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            style={styles.haveDataViewStyle}
            data={this.state.data}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                colors={['orange', 'red']}
                tintColor={'white'}
                title={'刷新中...'}
                enabled={true}
              />
            }
            onEndReachedThreshold={0.1}
            onEndReached={this._loadData}
            ListFooterComponent={this._footView}
          />
          {this._renderModal()}
        </View>
      )
    }
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '在线数据',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this._render()}
      </Container>
    )
  }
}
