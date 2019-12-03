import React, { Component } from 'react'
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import FileTools from '../../../../native/FileTools'
import ConstPath from '../../../../constants/ConstPath'
import { downloadFile } from 'react-native-fs'
import Toast from '../../../../utils/Toast'
import { scaleSize, setSpText } from '../../../../utils'

export default class RenderModuleListItem extends Component {
  props: {
    item: Object,
    currentUser: Object,
    importWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isShowProgressView: false,
      progress: '',
      disabled: false,
    }
  }
  itemAction = async item => {
    try {
      this.setState({
        disabled: true,
      })
      let fileName
      let moduleKey = item.key
      /** 服务器上解压出来的名字就是以下的fileName，不可改动，若需要改，则必须改为解压过后的文件名*/
      if (moduleKey === '地图制图') {
        fileName = '湖南'
      } else if (moduleKey === '专题制图') {
        // fileName = '北京'
        fileName = '湖北'
      } else if (moduleKey === '外业采集') {
        fileName = '地理国情普查'
      } else if (moduleKey === '三维场景') {
        if (Platform.OS === 'android') {
          fileName = 'OlympicGreen_android'
        } else if (Platform.OS === 'ios') {
          fileName = 'OlympicGreen_ios'
        }
      } else if (moduleKey === '导航地图') {
        fileName = 'Navigation_示范数据'
      }
      let homePath = await FileTools.appendingHomeDirectory()
      let cachePath = homePath + ConstPath.CachePath
      let fileDirPath = cachePath + fileName
      let arrFile = await FileTools.getFilterFiles(fileDirPath)
      let isDownloaded = true
      if (arrFile.length === 0) {
        this.downloadData = {
          fileName: fileName,
          cachePath: cachePath,
          itemData: item,
        }
        this._showAlert(item)
        // this._downloadModuleData()
      } else {
        this.setState({
          isShowProgressView: true,
          progress: '导入中...',
        })
        await this.props.importWorkspace(fileDirPath, item, isDownloaded)
        this.setState({
          disabled: false,
          isShowProgressView: false,
        })
      }
    } catch (e) {
      this.setState({
        disabled: false,
        isShowProgressView: false,
      })
    }
  }

  _downloadModuleData = async () => {
    let item = this.downloadData.itemData
    let moduleKey = item.key
    let dataUrl
    if (moduleKey === '地图制图') {
      dataUrl = 'https://www.supermapol.com/web/datas/1333580434/download'
    } else if (moduleKey === '专题制图') {
      dataUrl = 'https://www.supermapol.com/web/datas/717499323/download'
    } else if (moduleKey === '外业采集') {
      dataUrl = 'https://www.supermapol.com/web/datas/1435593818/download'
    } else if (moduleKey === '三维场景') {
      if (Platform.OS === 'android') {
        dataUrl = 'https://www.supermapol.com/web/datas/785640414/download'
      } else if (Platform.OS === 'ios') {
        dataUrl = 'https://www.supermapol.com/web/datas/2014161764/download'
      }
    } else if (moduleKey === '导航地图') {
      dataUrl = 'https://www.supermapol.com/web/datas/1070422678/download'
    }
    let cachePath = this.downloadData.cachePath
    let fileDirPath = cachePath + this.downloadData.fileName
    try {
      this.setState({
        progress: '0%',
        isShowProgressView: true,
        disabled: true,
      })
      let fileCachePath = fileDirPath + '.zip'
      FileTools.deleteFile(fileCachePath)
      let downloadOptions = {
        fromUrl: dataUrl,
        toFile: fileCachePath,
        background: true,
        progress: res => {
          let value =
            ((res.bytesWritten / res.contentLength) * 100).toFixed(0) + '%'
          // console.warn(value)
          if (value === '100%') {
            this.setState({
              progress: '导入中...',
              isShowProgressView: true,
              disabled: true,
            })
          } else if (value !== this.state.progress) {
            this.setState({
              progress: value,
              isShowProgressView: true,
              disabled: true,
            })
          }
        },
      }
      let result = downloadFile(downloadOptions)
      result.promise
        .then(async () => {
          // .then(async result => {
          // if (result.statusCode === 200)
          await FileTools.unZipFile(fileCachePath, cachePath)
          FileTools.deleteFile(fileDirPath + '.zip')
          await this.props.importWorkspace(fileDirPath, item, false)
          this.setState({ isShowProgressView: false, disabled: false })
        })
        .catch(() => {
          Toast.show('下载失败')
          FileTools.deleteFile(fileCachePath)
          this.setState({ isShowProgressView: false, disabled: false })
        })
    } catch (e) {
      Toast.show('网络错误，下载失败')
      FileTools.deleteFile(fileDirPath + '.zip')
      this.setState({ isShowProgressView: false, disabled: false })
    }
  }
  _renderProgressView = () => {
    let progress =
      this.state.progress.indexOf('%') === -1
        ? this.state.progress
        : `下载${this.state.progress}`
    // console.warn(progress)
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
            // fontStyle:'italic',
            color: 'white',
            // textShadowColor: '#fff',
            // textShadowRadius: 4,
          }}
        >
          {progress}
        </Text>
      </View>
    ) : (
      <View />
    )
  }
  _showAlert = item => {
    Alert.alert(
      '下载',
      `${item.key}没有数据`,
      [
        {
          text: '取消',
          onPress: () => {
            this.setState({
              disabled: false,
            })
          },
          style: 'cancel',
        },
        {
          text: '确认',
          onPress: () => {
            this._downloadModuleData()
          },
          style: 'destructive',
        },
        {
          text: '进入模块',
          onPress: () => {
            item.action && item.action(this.props.currentUser)
            this.setState({
              disabled: false,
            })
          },
          style: 'default',
        },
      ],
      { cancelable: false },
    )
  }
  render() {
    let item = this.props.item
    return (
      <View style={styles.moduleView}>
        <TouchableOpacity
          disabled={this.state.disabled}
          onPress={() => {
            this.itemAction(item)
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
