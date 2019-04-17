/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { FlatList, RefreshControl, View, NetInfo } from 'react-native'
import { SOnlineService, SMap } from 'imobile_for_reactnative'
import OnlineDataItem from './OnlineDataItem'
import { color } from '../../../../styles'
import Toast from '../../../../utils/Toast'
import PopupModal from './PopupModal'
import { scaleSize } from '../../../../utils'
import ConstPath from '../../../../constants/ConstPath'
import { downloadFile } from 'react-native-fs'
import { FileTools } from '../../../../native'
export default class MyOnlineData extends Component {
  props: {
    navigation: Object,
    user: Object,
    down: any,
    importWorkspace: () => {},
    setLoading: () => {},
    updateDownList: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      isRefreshing: false,
      modalIsVisible: false,
    }
    this.pageSize = 20
    this.dataListTotal = null
    this.currentPage = 1
    this.addDataing = false
  }

  componentDidMount() {
    this.getOnlineData(this.currentPage, this.pageSize).then(data => {
      if (data.length > 0) {
        this.setState({ data: data }, () => {
          this.props.setLoading(false)
        })
      } else {
        Toast.show('在线数据请求失败')
      }
    })
    SOnlineService.getAndroidSessionID().then(cookie => {
      this.cookie = cookie
    })
  }

  getOnlineData = async (currentPage, pageSize) => {
    let newData = []
    try {
      let strDataList = await SOnlineService.getDataList(currentPage, pageSize)
      let objDataList = JSON.parse(strDataList)
      this.dataListTotal = objDataList.total
      let arrDataContent = objDataList.content
      let contentLength = arrDataContent.length
      for (let i = 0; i < contentLength; i++) {
        let objContent = arrDataContent[i]
        objContent.fileName = objContent.fileName.substring(
          0,
          objContent.fileName.length - 4,
        )
        objContent.id = objContent.id + ''
        newData.push(objContent)
      }
    } catch (e) {
      let result = await NetInfo.getConnectionInfo()
      if (result.type === 'unknown' || result.type === 'none') {
        Toast.show('网络错误')
      } else {
        // Toast.show('登录失效，请重新登录')
      }
    }
    return newData
  }

  _onRefresh = async () => {
    try {
      let data = await this.getOnlineData(1, this.pageSize)
      this.setState({ data: data })
    } catch (error) {
      Toast.show('网络错误')
      this.setState({ isRefreshing: false })
    }
  }

  _onLoadData = async () => {
    try {
      if (this.state.data.length < 20) return
      //防止data为空时调用
      if (this.addDataing) return
      this.addDataing = true
      if (this.dataListTotal && this.state.length >= this.dataListTotal) return
      let newData = [...this.state.data]
      this.currentPage = this.currentPage + 1
      let data = await this.getOnlineData(this.currentPage, 5)
      if (data.length > 1) {
        let onlineData = newData.concat(data)
        this.setState({ data: onlineData }, () => {
          this.addDataing = false
        })
      }
    } catch (error) {
      Toast.show('网络异常')
    }
  }

  itemOnPress = async (item = {}) => {
    this.itemInfo = item
    this.setState({ modalIsVisible: true })
  }

  downFileAction = async () => {
    try {
      if (
        this.props.down[0].id &&
        this.itemInfo.id === this.props.down[0].id &&
        this.props.down[0].progress > 0
      ) {
        Toast.show('文件正在导入，请稍后')
        return
      } else {
        if (this.itemInfo.id) {
          let path =
            ConstPath.UserPath +
            this.props.user.currentUser.userName +
            '/' +
            ConstPath.RelativePath.ExternalData +
            this.itemInfo.fileName
          let filePath = await FileTools.appendingHomeDirectory(path + '.zip')
          let toPath = await FileTools.appendingHomeDirectory(path)
          // await SOnlineService.downloadFileWithDataId(filePath, this.itemInfo.id+"")
          let dataUrl = `https://www.supermapol.com/web/datas/${
            this.itemInfo.id
          }/download`
          let downloadOptions = {
            fromUrl: dataUrl,
            toFile: filePath,
            background: true,
            headers: {
              Cookie: 'JSESSIONID=' + this.cookie,
              'Cache-Control': 'no-cache',
            },
            progressDivider: 2,
            begin: () => {
              Toast.show('开始导入')
            },
            progress: res => {
              let value = ~~res.progress.toFixed(0)
              this.props.updateDownList({
                id: this.itemInfo.id,
                progress: value,
                downed: false,
              })
            },
          }
          let result = downloadFile(downloadOptions)
          result.promise.then(
            async result => {
              if (result.statusCode) {
                //下载成功后解压导入
                if (result.statusCode >= 200 && result.statusCode < 300) {
                  Toast.show('文件导入中')
                  let result = await FileTools.unZipFile(filePath, toPath)
                  if (result) {
                    await FileTools.deleteFile(filePath)
                    this._setFilterDatas(toPath, {
                      smwu: 'smwu',
                      sxwu: 'sxwu',
                      udb: 'udb',
                    })
                    this.props.updateDownList({
                      id: this.itemInfo.id,
                      progress: 0,
                      downed: true,
                    })
                  }
                } else {
                  Toast.show('请求异常，导入失败')
                }
              }
            },
            () => {
              Toast.show('请求异常，导入失败')
            },
          )
        }
      }
    } catch (error) {
      this.downloading = false
      Toast.show('导入失败')
    }
  }

  _setFilterDatas = async (fullFileDir, fileType) => {
    try {
      let isRecordFile = false
      let arrDirContent = await FileTools.getDirectoryContent(fullFileDir)
      for (let i = 0; i < arrDirContent.length; i++) {
        let fileContent = arrDirContent[i]
        let isFile = fileContent.type
        let fileName = fileContent.name
        let newPath = fullFileDir + '/' + fileName
        if (isFile === 'file' && !isRecordFile) {
          // (fileType.udb && fileName.indexOf(fileType.udb) !== -1)
          if (
            (fileType.smwu && fileName.indexOf(fileType.smwu) !== -1) ||
            (fileType.sxwu && fileName.indexOf(fileType.sxwu) !== -1) ||
            (fileType.sxw && fileName.indexOf(fileType.sxw) !== -1) ||
            (fileType.smw && fileName.indexOf(fileType.smw) !== -1)
          ) {
            if (
              !(
                fileName.indexOf('~[') !== -1 &&
                fileName.indexOf(']') !== -1 &&
                fileName.indexOf('@') !== -1
              )
            ) {
              this.props.importWorkspace &&
                (await this.props
                  .importWorkspace({ path: newPath })
                  .then(result => {
                    result.mapsInfo.length > 0
                      ? Toast.show('数据导入成功')
                      : Toast.show('数据导入失败')
                  }))
              isRecordFile = true
              break
            }
          } else if (fileType.udb && fileName.indexOf(fileType.udb) !== -1) {
            await SMap.importDatasourceFile(newPath).then(
              result => {
                result.length > 0
                  ? Toast.show('数据导入成功')
                  : Toast.show('数据导入失败')
              },
              () => {
                Toast.show('数据导入失败')
              },
            )
            break
          }
        } else if (isFile === 'directory') {
          await this._setFilterDatas(newPath, fileType)
        }
      }
    } catch (e) {
      Toast.show('数据导入失败')
    }
  }

  _onDeleteData = async () => {
    this.props.setLoading(true, '删除数据中...')
    this.setState({ modalIsVisible: false })
    if (this.addDataing) {
      this._onDeleteData()
    }
    try {
      let objContent = this.state.data[this.itemInfo.index]
      let dataId = objContent.id + ''
      let result = await SOnlineService.deleteDataWithDataId(dataId)
      if (typeof result === 'boolean' && result) {
        this.state.data.splice(this.itemInfo.index, 1)
        let newData = []
        for (let index = 0; index < this.state.data.length; index++) {
          const element = this.state.data[index]
          newData.push(element)
        }
        this.setState({ data: newData })
        Toast.show('数据删除成功')
      } else {
        Toast.show('数据删除失败')
      }
    } catch (e) {
      Toast.show('网络错误')
    } finally {
      this.props.setLoading(false)
    }
  }

  _keyExtractor = (item, index) => {
    return index * index + ''
  }

  renderItem = ({ item, index }) => {
    return (
      <OnlineDataItem
        item={item}
        itemOnPress={this.itemOnPress}
        down={this.props.down}
        updateDownList={this.props.updateDownList}
        index={index}
      />
    )
  }

  renderItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: scaleSize(80 + 1) * index,
      index,
    }
  }

  _onDownloadFile = async () => {
    try {
      await this._onCloseModal()
      this.downFileAction && this.downFileAction()
    } catch (error) {
      Toast.show('导入失败')
    }
  }

  _renderModal = () => {
    return (
      <PopupModal
        ref={ref => (this.modalRef = ref)}
        onDownloadFile={this._onDownloadFile}
        onDeleteData={this._onDeleteData}
        onCloseModal={this._onCloseModal}
        modalVisible={this.state.modalIsVisible}
      />
    )
  }

  _onCloseModal = () => {
    this.setState({ modalIsVisible: false }, () => {})
  }

  _render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          getItemLayout={this.getItemLayout}
          extraData={this.state}
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          initialNumToRender={this.pageSize}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderItemSeparator}
          ListFooterComponent={this.renderItemSeparator}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              colors={['orange', 'red']}
              titleColor={'orange'}
              tintColor={'orange'}
              title={'刷新中...'}
              enabled={true}
            />
          }
        />
        {this._renderModal()}
      </View>
    )
  }
  render() {
    return <View style={{ flex: 1 }}>{this._render()}</View>
  }
}
