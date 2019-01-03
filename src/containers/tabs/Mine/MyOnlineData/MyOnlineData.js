/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import {
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SOnlineService } from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import Container from '../../../../components/Container/index'
import styles, { color } from './Styles'
import Toast from '../../../../utils/Toast'
import PopupModal from './PopupModal'
import ConstPath from '../../../../constants/ConstPath'

let _iLoadOnlineDataCount = 1
let _iDataListTotal = -1
let _iDownloadingIndex = -1
let _arrOnlineData = [{}]
export default class MyOnlineData extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.state = {
      data: _arrOnlineData,
      isRefreshing: false,
      modalIsVisible: false,
      downloadingIndex: -1,
      onClickItemBgColor: color.pink,
      itemBgColor: color.blackBg,
      progressWidth: this.screenWidth * 0.6,
    }
    this.pageSize = 20
    this._addListener()
  }
  componentDidMount() {
    this._firstLoadData()
  }

  componentWillUnmount() {
    this._removeListener()
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
          this._resetDownloadIndex(-1)
        },
      )
      this.downloadedListener = callBackIos.addListener(downloadedType, () => {
        let result = '下载完成'
        this._changeModalProgressState(result)
        this._resetDownloadIndex(-1)
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
          let result = '下载完成'
          this._changeModalProgressState(result)
          this._resetDownloadIndex(-1)
        },
      )
      this.downloadFailureListener = DeviceEventEmitter.addListener(
        downloadFailureType,
        () => {
          let result = '下载失败'
          this._changeModalProgressState(result)
          this._resetDownloadIndex(-1)
        },
      )
    }
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
  _firstLoadData = async () => {
    let newData = []
    if (
      _iLoadOnlineDataCount === 1 &&
      (_arrOnlineData.length === 1 &&
        _arrOnlineData[0].isDownloading === undefined)
    ) {
      this._showLoadProgressView()
    }
    try {
      for (let i = 1; i <= _iLoadOnlineDataCount; i++) {
        let tempData = await this._getOnlineData(i, this.pageSize)
        newData = newData.concat(tempData)
      }
      // 如果有数据正在下载，则重构newData
      if (_iDownloadingIndex >= 0) {
        if (!this.downloadingFileName) {
          this.downloadingFileName = this.state.data[
            _iDownloadingIndex
          ].fileName.substring(
            0,
            this.state.data[_iDownloadingIndex].fileName.length - 4,
          )
        }
        let prevData = [...this.state.data]
        // 记录是否存在下载id
        let downloadingIndexId = prevData[_iDownloadingIndex].id
        for (let i = 0; i < newData.length; i++) {
          let objContent = newData[i]
          if (objContent.id === downloadingIndexId) {
            objContent = prevData[_iDownloadingIndex]
            this._resetDownloadIndex(i)
          } else {
            objContent.isDownloading = false
          }
        }
      }
      // 如果加载出来的数据一样，则不更新
      if (JSON.stringify(this.state.data) === JSON.stringify(newData)) {
        return
      }
      _arrOnlineData = newData
      this.setState({ data: _arrOnlineData })
    } finally {
      if (_iLoadOnlineDataCount === 1) {
        this._clearInterval()
      }
    }
  }
  _clearInterval = () => {
    if (this.objProgressWidth !== undefined) {
      clearInterval(this.objProgressWidth)
      this.setState({ progressWidth: '100%' })
    }
  }
  _showLoadProgressView = () => {
    this.objProgressWidth = setInterval(() => {
      let prevProgressWidth = this.state.progressWidth
      let currentPorWidth
      if (prevProgressWidth >= this.screenWidth - 200) {
        currentPorWidth = prevProgressWidth + 1
        if (currentPorWidth >= this.screenWidth - 50) {
          currentPorWidth = this.screenWidth - 50
          return
        }
      } else {
        currentPorWidth = prevProgressWidth * 1.01
      }
      this.setState({ progressWidth: currentPorWidth })
    }, 100)
  }
  _getOnlineData = async (currentPage, pageSize) => {
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
        let fileSize = (objContent.size / 1024 / 1024).toFixed(2) + 'MB'
        objContent.downloadingProgress = '下载 (' + fileSize + ')'
        newData.push(objContent)
      }
    } catch (e) {
      Toast.show('网络错误')
    }
    return newData
  }
  _keyExtractor = (item, index) => {
    return index * index + ''
  }
  _onRefresh = async () => {
    if (!this.state.isRefreshing) {
      try {
        this.setState({ isRefreshing: true })
        _iLoadOnlineDataCount = 1
        _arrOnlineData = await this._getOnlineData(
          _iLoadOnlineDataCount,
          this.pageSize,
        )
        if (_iDownloadingIndex >= 0) {
          let prevData = [...this.state.data]
          // 记录是否存在下载id
          let downloadingIndexId = prevData[_iDownloadingIndex].id
          for (let i = 0; i < _arrOnlineData.length; i++) {
            let objContent = _arrOnlineData[i]
            if (objContent.id === downloadingIndexId) {
              _arrOnlineData[i] = prevData[_iDownloadingIndex]
              this._resetDownloadIndex(i)
            } else {
              _arrOnlineData[i].isDownloading = false
            }
          }
        }
        this.setState({ data: _arrOnlineData, isRefreshing: false })
      } catch (e) {
        Toast.show('网络错误')
        this.setState({ isRefreshing: false })
      }
    }
  }
  _onLoadData = async () => {
    if (!this.isLoadingData) {
      this.isLoadingData = true
      let dataCount = this.state.data.length
      if (
        _iDataListTotal > dataCount &&
        _iDataListTotal > _iLoadOnlineDataCount * this.pageSize
      ) {
        _iLoadOnlineDataCount = _iLoadOnlineDataCount + 1
        let data = await this._getOnlineData(
          _iLoadOnlineDataCount,
          this.pageSize,
        )
        let newData = [...this.state.data]
        _arrOnlineData = newData.concat(data)

        if (_iDownloadingIndex >= 0) {
          let prevData = [...this.state.data]
          // 记录是否存在下载id
          let downloadingIndexId = prevData[_iDownloadingIndex].id
          for (let i = 0; i < _arrOnlineData.length; i++) {
            let objContent = _arrOnlineData[i]
            if (objContent.id === downloadingIndexId) {
              _arrOnlineData[i] = prevData[_iDownloadingIndex]
              this._resetDownloadIndex(i)
            } else {
              _arrOnlineData[i].isDownloading = false
            }
          }
        }
        this.setState({ data: _arrOnlineData })
      }
      this.isLoadingData = false
    }
  }
  _footView = () => {
    return <View />
  }
  _onCloseModal = () => {
    this.setState({ modalIsVisible: false })
  }
  _unZipFile = async () => {
    if (_iDownloadingIndex >= 0) {
      let objContent = this.state.data[_iDownloadingIndex]
      let path =
        ConstPath.UserPath +
        this.props.user.currentUser.userName +
        '/Downloads/' +
        objContent.fileName
      let filePath = await FileTools.appendingHomeDirectory(path)
      let savePath = filePath.substring(0, filePath.length - 4)
      await FileTools.unZipFile(filePath, savePath)
      FileTools.deleteFile(filePath)
    }
  }
  _changeModalProgressState = progress => {
    if (_iDownloadingIndex >= 0) {
      let newData = [...this.state.data]
      newData[_iDownloadingIndex].downloadingProgress = progress
      _arrOnlineData = newData
      if (
        this.modalRef !== undefined &&
        this.modalRef !== null &&
        this.state.modalIsVisible &&
        this.index !== undefined &&
        this.state.data[this.index].isDownloading &&
        !this.state.isRefreshing
      ) {
        // console.warn("progress:"+progress)
        this.modalRef._changeDownloadingState(progress)
      }
      if (progress === '下载完成' || progress === '下载失败') {
        this._setFinalDownloadingProgressState(_iDownloadingIndex, progress)
        if (progress === '下载完成') {
          this._unZipFile()
        }
      }
    }
  }
  _setFinalDownloadingProgressState = (index, progress) => {
    let newData = [...this.state.data]
    for (let i = 0; i < newData.length; i++) {
      let objContent = newData[i]
      objContent.isDownloading = true
      if (i === index) {
        objContent.downloadingProgress = progress
      } else {
        let fileSize = (objContent.size / 1024 / 1024).toFixed(2) + 'MB'
        objContent.downloadingProgress = '下载 (' + fileSize + ')'
      }
    }
    _arrOnlineData = newData
    this.setState({ data: _arrOnlineData })
  }
  _resetDownloadingState = () => {
    let newData = [...this.state.data]
    for (let i = 0; i < this.state.data.length; i++) {
      let objContent = newData[i]
      objContent.isDownloading = true
    }
    _arrOnlineData = newData
    this.setState({ modalIsVisible: false, data: _arrOnlineData })
  }
  _resetIndex = () => {
    // this.index = undefined
  }
  _resetDownloadIndex = index => {
    if (index >= 0) {
      _iDownloadingIndex = index
    } else {
      _iDownloadingIndex = -1
    }
  }
  _setDownloadingState = index => {
    let newData = [...this.state.data]
    for (let i = 0; i < this.state.data.length; i++) {
      if (i !== index) {
        let objContent = newData[i]
        objContent.isDownloading = false
      }
    }
    _arrOnlineData = newData
    this.setState({ data: _arrOnlineData })
  }
  _onDownloadFile = async () => {
    try {
      let objContent = this.state.data[this.index]
      let dataId = objContent.id + ''
      let path =
        ConstPath.UserPath +
        this.props.user.currentUser.userName +
        '/Downloads/' +
        objContent.fileName
      let filePath = await FileTools.appendingHomeDirectory(path)
      let isFileExist = await FileTools.fileIsExist(path)
      if (isFileExist) {
        Toast.show('下载完成')
        this._changeModalProgressState('下载完成')
        return
      }
      this.downloadingFileName = objContent.fileName.substring(
        0,
        objContent.fileName.length - 4,
      )
      this._resetDownloadIndex(this.index)
      if (this.modalRef) {
        this.modalRef._changeDownloadingState('下载中...')
      }
      this._setDownloadingState(_iDownloadingIndex)
      SOnlineService.downloadFileWithDataId(filePath, dataId)
      Toast.show('开始下载')
    } catch (e) {
      Toast.show('网络错误')
      this._resetDownloadingState()
    }
  }
  _onPublishService = async () => {
    this.setState({ modalIsVisible: false })
    try {
      let newData = [...this.state.data]
      let objContent = newData[this.index]
      let dataId = objContent.id + ''
      let result = await SOnlineService.publishServiceWithDataId(dataId)
      if (typeof result === 'boolean' && result) {
        let arrDataItemServices = objContent.dataItemServices
        let dataItemServices = { serviceType: 'RESTMAP', serviceName: '' }
        arrDataItemServices.push(dataItemServices)
        _arrOnlineData = newData
        this._resetIndex()
        this.setState({ data: _arrOnlineData })
        Toast.show('服务发布成功')
      } else {
        if (result === undefined || result === '') {
          result = '服务发布失败'
        }
        Toast.show(result)
      }
    } catch (e) {
      this._resetIndex()
      Toast.show('网络错误')
    }
  }
  _onDeleteService = async () => {
    this.setState({ modalIsVisible: false })
    try {
      let newData = [...this.state.data]
      let objContent = newData[this.index]
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
        _arrOnlineData = newData
        this._resetIndex()
        this.setState({ data: _arrOnlineData })
        Toast.show('服务删除成功')
      } else {
        if (result === undefined || result === '') {
          result = '服务删除失败'
        }
        Toast.show(result)
      }
    } catch (e) {
      this._resetIndex()
      Toast.show('网络错误')
    }
  }
  _onChangeDataVisibility = async () => {
    this.setState({ modalIsVisible: false })
    try {
      let newData = [...this.state.data]
      let objContent = newData[this.index]
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
        _arrOnlineData = newData
        this.setState({ data: _arrOnlineData })
      } else {
        if (result === undefined || result === '') {
          result = '设置失败'
        }
        Toast.show(result)
      }
    } catch (e) {
      this._resetIndex()
      Toast.show('网络错误')
    }
  }
  _onDeleteData = async () => {
    this.setState({ modalIsVisible: false })
    try {
      let newData = [...this.state.data]
      let objContent = newData[this.index]
      let dataId = objContent.id + ''
      let result = await SOnlineService.deleteDataWithDataId(dataId)
      if (typeof result === 'boolean' && result) {
        newData.splice(this.index, 1)
        if (_iDownloadingIndex >= 0) {
          // 删除当前item，则取消下载
          if (_iDownloadingIndex === this.index) {
            this._resetDownloadIndex(-1)
            SOnlineService.cancelDownload()
            for (let i = 0; i < newData.length; i++) {
              newData[i].isDownloading = true
              let fileSize = (newData[i].size / 1024 / 1024).toFixed(2) + 'MB'
              newData[i].downloadingProgress = '下载 (' + fileSize + ')'
            }
          } else {
            let downloadingId = this.state.data[_iDownloadingIndex].id // 记录正在下载的id
            for (let i = 0; i < newData.length; i++) {
              if (newData[i].id === downloadingId) {
                this._resetDownloadIndex(i) // 将下载的索引重新赋值
                break
              }
            }
          }
        }
        _arrOnlineData = newData
        this.setState({ data: _arrOnlineData })
        Toast.show('数据删除成功')
      } else {
        Toast.show(result)
      }
    } catch (e) {
      this._resetIndex()
      Toast.show('网络错误')
    }
  }
  _renderModal = () => {
    if (this.state.modalIsVisible) {
      // console.warn("MyData---renderModal")
      return (
        <PopupModal
          ref={ref => (this.modalRef = ref)}
          data={this.state.data[this.index]}
          onDeleteService={this._onDeleteService}
          onDownloadFile={this._onDownloadFile}
          onPublishService={this._onPublishService}
          onChangeDataVisibility={this._onChangeDataVisibility}
          onDeleteData={this._onDeleteData}
          onCloseModal={this._onCloseModal}
          modalVisible={this.state.modalIsVisible}
          downloadingFileName={this.downloadingFileName}
        />
      )
    }
  }
  _onClickItemEvent = item => {
    this.index = item.index
    /** 重新渲染render，使modal展示出来*/
    // this.setState({ modalIsVisible: true })
    this.setState({ modalIsVisible: true, data: _arrOnlineData })
  }

  _renderItem = item => {
    let dataName = item.item.fileName
    if (dataName !== undefined) {
      let length = dataName.length - 4
      let newDataName = dataName.substring(0, length)
      let itemHeight = 50
      let itemWidth = '100%'
      return (
        <TouchableOpacity
          onPress={() => {
            this._onClickItemEvent(item)
          }}
          style={{ backgroundColor: this.state.itemBgColor }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: itemWidth,
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
              width: itemWidth,
              backgroundColor: '#2D2D2F',
            }}
          />
        </TouchableOpacity>
      )
    }
    return <View />
  }
  _renderProgressView = () => {
    return (
      <View style={styles.noDataViewStyle}>
        <View
          style={{
            height: 2,
            width: this.state.progressWidth,
            backgroundColor: '#1c84c0',
          }}
        />
      </View>
    )
  }
  _render = () => {
    if (this.state.data.length === 1 && this.state.data[0].id === undefined) {
      return this._renderProgressView()
    } else {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            style={styles.haveDataViewStyle}
            data={this.state.data}
            initialNumToRender={this.pageSize}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                colors={['orange', 'red']}
                titleColor={'white'}
                tintColor={'white'}
                title={'刷新中...'}
                enabled={true}
              />
            }
            onEndReachedThreshold={0.8}
            onEndReached={this._onLoadData}
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
