import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  // Dimensions,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native'
import { ConstPath } from '../../../../constants'
import constants from '../../../../containers/workspace/constants'
import ConstModule, { MAP_MODULE } from '../../../../constants/ConstModule'
import { scaleSize, setSpText } from '../../../../utils'
// import RenderModuleListItem from './RenderModuleListItem'
import { downloadFile } from 'react-native-fs'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import FetchUtils from '../../../../utils/FetchUtils'
class RenderModuleItem extends Component {
  props: {
    item: Object,
    importWorkspace: () => {},
    showDialog: () => {},
    getMoudleItem: () => {},
    itemAction: () => {},
  }

  constructor(props) {
    super(props)
    this.downloading = false
    this.state = {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      dialogCheck: false,
    }
  }

  setNewState = data => {
    if (!data) return
    this.setState(data)
  }

  getDialogCheck = () => {
    return this.state.dialogCheck
  }

  _renderProgressView = () => {
    let progress =
      this.state.progress.indexOf('%') === -1
        ? this.state.progress
        : `下载${this.state.progress}`
    return this.state.isShowProgressView ? (
      <View
        style={[
          {
            position: 'absolute',
            width: scaleSize(260),
            height: scaleSize(260),
            backgroundColor: '#rgba(112, 128, 144,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          },
        ]}
      >
        <Text
          style={{
            fontSize: setSpText(25),
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          {progress}
        </Text>
      </View>
    ) : (
      <View />
    )
  }

  render() {
    let item = this.props.item
    return (
      <View style={styles.moduleView}>
        <TouchableOpacity
          disabled={this.state.disabled}
          onPress={() => {
            this.props.itemAction && this.props.itemAction(item)
          }}
          style={[styles.module]}
        >
          {/* <Image source={image} style={item.img} /> */}
          <Image source={item.baseImage} style={item.style} />
          <View style={styles.moduleItem}>
            <Image
              resizeMode={'contain'}
              source={item.moduleImage}
              style={styles.moduleImage}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>
          {this._renderProgressView()}
        </TouchableOpacity>
      </View>
    )
  }
}

export default class ModuleList extends Component {
  props: {
    device: Object,
    currentUser: Object,
    latestMap: Object,
    importWorkspace: () => {},
    showDialog: () => {},
    getMoudleItem: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isShowProgressView: false,
    }
    this.testCount = 1
    this.moduleItems = []
  }

  _showAlert = (ref, downloadData, currentUserName) => {
    setTimeout(() => {
      this.props.showDialog && this.props.showDialog(true)
    }, 1500)
    this.props.getMoudleItem &&
      this.props.getMoudleItem(
        ref,
        this.sureDown,
        this.cancelDown,
        downloadData,
        currentUserName,
        ref.getDialogCheck(),
      )
  }

  _downloadModuleData = async (ref, downloadData) => {
    this.downloading = true
    let keyword
    if (downloadData.fileName.indexOf('_示范数据') !== -1) {
      keyword = downloadData.fileName
    } else {
      keyword = downloadData.fileName + '_示范数据'
    }
    let dataUrl = await FetchUtils.getFindUserZipDataUrl(
      'xiezhiyan123',
      keyword,
    )
    let cachePath = downloadData.cachePath
    let fileDirPath = cachePath + downloadData.fileName
    try {
      ref.setNewState({
        progress: '0%',
        isShowProgressView: true,
        // disabled: true,
      })
      let fileCachePath = fileDirPath + '.zip'
      await FileTools.deleteFile(fileCachePath)
      let downloadOptions = {
        fromUrl: dataUrl,
        toFile: fileCachePath,
        background: true,
        progress: res => {
          let value =
            ((res.bytesWritten / res.contentLength) * 100).toFixed(0) + '%'
          if (value === '100%') {
            ref.setNewState({
              progress: '导入中...',
              isShowProgressView: true,
              // disabled: true,
            })
            this.downloading = false
          } else if (value !== this.state.progress) {
            ref.setNewState({
              progress: value,
              isShowProgressView: true,
              // disabled: true,
            })
          }
        },
      }
      let result = downloadFile(downloadOptions)
      result.promise
        .then(async result => {
          if (result.statusCode === 200) {
            await FileTools.unZipFile(fileCachePath, cachePath)

            await this.props.importWorkspace(
              fileDirPath,
              downloadData.copyFilePath,
            )
            ref.setNewState({ isShowProgressView: false, disabled: false })
            FileTools.deleteFile(fileDirPath + '.zip')
          }
        })
        .catch(() => {
          Toast.show('下载失败')
          FileTools.deleteFile(fileCachePath)
          ref.setNewState({ isShowProgressView: false, disabled: false })
          this.downloading = false
        })
    } catch (e) {
      Toast.show('网络错误，下载失败')
      FileTools.deleteFile(fileDirPath + '.zip')
      ref.setNewState({ isShowProgressView: false, disabled: false })
    }
  }

  sureDown = (ref, downloadData, dialogCheck) => {
    // let item = downloadData.itemData
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

  itemAction = async ({ item, index }) => {
    try {
      // this.setState({
      //   disabled: true,
      // })
      let fileName
      let moduleKey = item.key
      /** 服务器上解压出来的名字就是以下的fileName，不可改动，若需要改，则必须改为解压过后的文件名*/
      if (moduleKey === '地图制图') {
        fileName = '湖南'
      } else if (moduleKey === '专题制图') {
        // fileName = '北京'
        fileName = '湖北'
      } else if (moduleKey === '外业采集') {
        fileName = '地理国情普查_示范数据'
      } else if (moduleKey === '三维场景') {
        if (Platform.OS === 'android') {
          fileName = 'OlympicGreen_android'
        } else if (Platform.OS === 'ios') {
          fileName = 'OlympicGreen_ios'
        }
      }
      let homePath = await FileTools.appendingHomeDirectory()
      let tmpCurrentUser = this.props.currentUser
      let currentUserName = tmpCurrentUser.userName
        ? tmpCurrentUser.userName
        : 'Customer'
      let toPath =
        homePath +
        ConstPath.UserPath +
        currentUserName +
        '/' +
        ConstPath.RelativePath.ExternalData +
        fileName

      let cachePath = homePath + ConstPath.CachePath
      let fileDirPath = cachePath + fileName
      let arrFile = await FileTools.getFilterFiles(fileDirPath)
      if (arrFile.length === 0) {
        let downloadData = {
          fileName: fileName,
          cachePath: cachePath,
          copyFilePath: toPath,
          itemData: item,
          tmpCurrentUser: tmpCurrentUser,
        }
        if (this.state.dialogCheck) {
          item.action && item.action(tmpCurrentUser)
        } else if (this.downloading) {
          item.action && item.action(tmpCurrentUser)
        } else {
          item.action && item.action(tmpCurrentUser)
          this._showAlert(this.moduleItems[index], downloadData, tmpCurrentUser)
        }
      } else {
        let arrFilePath = await FileTools.getFilterFiles(toPath, {
          smwu: 'smwu',
          sxwu: 'sxwu',
        })
        if (arrFilePath.length === 0) {
          await this.props.importWorkspace(fileDirPath, toPath, true)
        }
        this.moduleItems[index].setNewState({
          disabled: false,
          isShowProgressView: false,
        })

        let module
        switch (item.title) {
          case MAP_MODULE.MAP_COLLECTION:
            module = constants.COLLECTION
            break
          case MAP_MODULE.MAP_EDIT:
            module = constants.MAP_EDIT
            break
          case MAP_MODULE.MAP_3D:
            module = constants.MAP_3D
            break
          case MAP_MODULE.MAP_THEME:
            module = constants.MAP_THEME
            break
        }
        let latestMap
        if (
          this.props.latestMap[currentUserName] &&
          this.props.latestMap[currentUserName][module] &&
          this.props.latestMap[currentUserName][module].length > 0
        ) {
          latestMap = this.props.latestMap[currentUserName][module][0]
        }
        item.action && item.action(tmpCurrentUser, latestMap)
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

  _renderItem = ({ item, index }) => {
    return (
      <RenderModuleItem
        item={item}
        ref={ref => this.getRef({ item, index }, ref)}
        importWorkspace={this.props.importWorkspace}
        showDialog={this.props.showDialog}
        getMoudleItem={this.props.getMoudleItem}
        itemAction={() => this.itemAction({ item, index })}
      />
    )
  }

  _renderScrollView = () => {
    return (
      <ScrollView
        style={styles.scrollView}
        // horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <FlatList
          data={ConstModule}
          horizontal={true}
          renderItem={this._renderItem}
          keyboardShouldPersistTaps={'always'}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.device.orientation === 'LANDSCAPE' ? (
          this._renderScrollView()
        ) : (
          <FlatList
            style={styles.flatList}
            data={ConstModule}
            renderItem={this._renderItem}
            horizontal={false}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // marginTop: scaleSize(100),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  flatList: {
    position: 'absolute',
    alignSelf: 'center',
    // marginTop: '35%',
    // backgroundColor: 'white',
    // marginLeft: scaleSize(40),
  },
  module: {
    width: scaleSize(260),
    height: scaleSize(260),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#707070',
    borderRadius: scaleSize(4),
    // elevation: 2,
    // shadowOffset: { width: 0, height: 0 },
    // shadowColor: 'black',
    // shadowOpacity: 1,
    // shadowRadius: scaleSize(4),
  },
  // img:{
  //   position:"absolute",
  //   width: scaleSize(260),
  //   height: scaleSize(260),
  // },
  moduleImage: {
    width: scaleSize(100),
    height: scaleSize(100),
  },
  moduleView: {
    width: scaleSize(300),
    height: scaleSize(300),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: scaleSize(10),
    // marginTop: scaleSize(5),
  },
  moduleItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    width: scaleSize(130),
    height: scaleSize(32),
    fontSize: setSpText(25),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: scaleSize(13),
  },
  scrollView: {
    // position:"absolute",
    // width: '72%',
    // height:"100%",
    flex: 1,
    flexDirection: 'column',
    // alignItems:"center",
    // justifyContent: 'space-around',
    position: 'absolute',
    alignSelf: 'center',
  },
})
