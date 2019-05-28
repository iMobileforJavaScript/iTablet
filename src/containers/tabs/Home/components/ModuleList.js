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
import { SMap } from 'imobile_for_reactnative'

import { connect } from 'react-redux'
import { getLanguage } from '../../../../language'

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

  getDownloading = () => {
    return this.downloading
  }

  setDownloading = (downloading = false) => {
    this.downloading = downloading
  }

  _renderProgressView = () => {
    let progress =
      this.state.progress.indexOf('%') === -1
        ? this.state.progress
        : `${this.state.progress}`
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
          {/* <Image source={item.baseImage} style={item.style} /> */}
          <View style={styles.moduleItem}>
            <Image
              resizeMode={'contain'}
              source={item.moduleImage}
              style={styles.moduleImage}
            />
            <Text
              style={
                item.key === '专题制图' && global.language === 'EN'
                  ? styles.longtitle
                  : styles.title
              }
            >
              {item.title}
            </Text>
          </View>
          {this._renderProgressView()}
        </TouchableOpacity>
      </View>
    )
  }
}

export class ModuleList extends Component {
  props: {
    language: string,
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
    this.moduleItems = []
    //this.bytesInfo = 0
    this.itemAction = this.itemAction.bind(this)
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
    // this.downloading = true
    ref.setDownloading(true)
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
      // await FileTools.deleteFile(fileCachePath)
      let downloadOptions = {
        // headers: {
        //   Range: `bytes=${this.bytesInfo}-`,
        // },
        fromUrl: dataUrl,
        toFile: fileCachePath,
        background: true,
        progressDivider: 1,
        progress: res => {
          // let tempVal = ~~((res.bytesWritten / res.contentLength) * 100).toFixed(0)
          // this.bytesInfo = tempVal > this.bytesInfo ? tempVal : this.bytesInfo
          // let value = this.bytesInfo + '%'
          // if(Platform.OS === 'android'){
          // if (this.bytesInfo < res.contentLength)
          //   this.bytesInfo = res.bytesWritten + 1
          // // }
          // let valueNum = ((this.bytesInfo / res.contentLength) * 100).toFixed(0)
          let value = ~~res.progress.toFixed(0) + '%'
          if (~~res.progress >= 100) {
            ref.setNewState({
              progress: getLanguage(this.props.language).Prompt.IMPORTING,
              isShowProgressView: true,
              // disabled: true,
            })
            // this.downloading = false
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
        .then(async () => {
          await FileTools.unZipFile(fileCachePath, cachePath)
          let arrFile = await FileTools.getFilterFiles(fileDirPath)
          await this.props.importWorkspace(
            arrFile[0].filePath,
            downloadData.copyFilePath,
          )
          ref.setNewState({ isShowProgressView: false, disabled: false })

          FileTools.deleteFile(fileDirPath + '.zip')
          ref.setDownloading(false)
        })
        .catch(() => {
          Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
          //'下载失败')
          FileTools.deleteFile(fileCachePath)
          ref.setNewState({ isShowProgressView: false, disabled: false })
          // this.downloading = false
          ref.setDownloading(false)
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

  async itemAction(language, { item, index }) {
    try {
      let fileName
      // let mapname
      let moduleKey = item.key
      /** 服务器上解压出来的名字就是以下的fileName，不可改动，若需要改，则必须改为解压过后的文件名*/
      if (moduleKey === MAP_MODULE.MAP_ANALYST) {
        item.action && item.action(this.props.currentUser)
        return
      } else if (moduleKey === '地图制图') {
        fileName = language === 'CN' ? '湖南' : 'LosAngeles'
        // mapname =  language==='CN'?'SanFrancisco':'湖南'
      } else if (moduleKey === '专题制图') {
        fileName = language === 'CN' ? '湖北' : 'PrecipitationOfUSA'
        // mapname =  language==='CN'?'Precipitation':'LandBuild'
      } else if (moduleKey === '外业采集') {
        fileName = '地理国情普查_示范数据'
      } else if (moduleKey === '三维场景') {
        if (Platform.OS === 'android') {
          fileName = 'OlympicGreen_android'
        } else if (Platform.OS === 'ios') {
          fileName = 'OlympicGreen_ios'
        }
      } else if (moduleKey === '应急标绘') {
        fileName = '湖南'
      }

      let homePath = await FileTools.appendingHomeDirectory()
      let tmpCurrentUser = this.props.currentUser
      let currentUserName = tmpCurrentUser.userName
        ? tmpCurrentUser.userName
        : 'Customer'

      let module
      switch (item.key) {
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
        case MAP_MODULE.MAP_PLOTTING:
          module = constants.MAP_PLOTTING
          break
      }
      // let toPath = homePath + ConstPath.UserPath + currentUserName + '/' + ConstPath.RelativePath.ExternalData + fileName
      let latestMap
      if (
        this.props.latestMap[currentUserName] &&
        this.props.latestMap[currentUserName][module] &&
        this.props.latestMap[currentUserName][module].length > 0
      ) {
        latestMap = this.props.latestMap[currentUserName][module][0]
      }
      let toPath = homePath + ConstPath.CachePath + fileName

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
        // if (this.state.dialogCheck) {
        if (
          !(
            this.moduleItems &&
            this.moduleItems[index] &&
            (this.moduleItems[index].getDialogCheck() ||
              this.moduleItems[index].getDownloading())
          )
        ) {
          this._showAlert(this.moduleItems[index], downloadData, tmpCurrentUser)
        }
        if (latestMap) {
          item.action && item.action(tmpCurrentUser, latestMap)
        } else {
          item.action && item.action(tmpCurrentUser)
        }
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
            homePath +
            ConstPath.UserPath +
            currentUserName +
            '/Data/Scene/' +
            fileName +
            '.pxp'
        } else {
          let maps = await SMap.getMapsByFile(filePath)
          let mapName = maps[0]
          filePath2 =
            homePath +
            ConstPath.UserPath +
            currentUserName +
            '/Data/Map/' +
            mapName +
            '.xml'
        }
        let isExist = await FileTools.fileIsExist(filePath2)
        if (!isExist) {
          await this.props.importWorkspace(filePath, toPath, true)
        }
        this.moduleItems[index].setNewState({
          disabled: false,
          isShowProgressView: false,
        })
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
        itemAction={() => this.itemAction(this.props.language, { item, index })}
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
          data={ConstModule(this.props.language)}
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
            data={ConstModule(this.props.language)}
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

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModuleList)

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
    height: scaleSize(37),
    fontSize: setSpText(25),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: scaleSize(13),
  },
  longtitle: {
    width: scaleSize(130),
    height: scaleSize(70),
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
