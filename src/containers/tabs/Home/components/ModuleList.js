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
import { ConstModule, ConstPath } from '../../../../constants'
import { scaleSize, setSpText } from '../../../../utils'
import RNFS from 'react-native-fs'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
// const SCREEN_WIDTH = Dimensions.get('window').width

class RenderModuleItem extends Component {
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
    this.setState({
      disabled: true,
    })
    let fileName
    let dataUrl
    let moduleKey = item.key
    if (moduleKey === '地图制图') {
      fileName = '湖南'
      dataUrl = 'https://www.supermapol.com/web/datas/456143933/download'
    } else if (moduleKey === '专题地图') {
      fileName = '北京'
      dataUrl = 'https://www.supermapol.com/web/datas/139937185/download'
    } else if (moduleKey === '外业采集') {
      fileName = '地理国情普查'
      dataUrl = 'https://www.supermapol.com/web/datas/1449854653/download'
    } else if (moduleKey === '三维场景') {
      if (Platform.OS === 'android') {
        fileName = 'OlympicGreen_android'
        dataUrl = 'https://www.supermapol.com/web/datas/1309053453/download'
      } else if (Platform.OS === 'ios') {
        fileName = 'OlympicGreen_ios'
        dataUrl = 'https://www.supermapol.com/web/datas/1206338222/download'
      }
    }
    let homePath = await FileTools.appendingHomeDirectory()
    let cachePath = homePath + ConstPath.CachePath
    let fileDirPath = cachePath + fileName
    let arrFile = await FileTools.getFilterFiles(fileDirPath)
    let isDownloaded = true
    // console.warn('arrFile:' + arrFile)
    if (arrFile.length === 0) {
      try {
        isDownloaded = false
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
        let result = RNFS.downloadFile(downloadOptions)
        result.promise
          .then(async result => {
            if (result.statusCode === 200) {
              await FileTools.unZipFile(fileCachePath, cachePath)
              FileTools.deleteFile(fileDirPath + '.zip')
              this.props.importWorkspace(fileDirPath, item, isDownloaded)
              this.setState({ isShowProgressView: false, disabled: false })
            }
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
    } else {
      this.setState({
        disabled: false,
      })
      this.props.importWorkspace(fileDirPath, item, isDownloaded)
    }
  }

  _renderProgressView = () => {
    let progress = this.state.progress
    // console.warn(this.state.isShowProgressView + '---------')
    return this.state.isShowProgressView ? (
      <View
        style={[
          {
            position: 'absolute',
            width: scaleSize(130),
            height: scaleSize(130),
            backgroundColor: '#rgba(112, 128, 144,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
          },
        ]}
      >
        <Text
          style={{
            fontSize: scaleSize(12),
            fontWeight: 'bold',
            // fontStyle:'italic',
            color: 'white',
            // textShadowColor: '#fff',
            // textShadowRadius: 4,
          }}
        >{`下载${progress}`}</Text>
      </View>
    ) : (
      <View />
    )
  }
  render() {
    // console.warn('RenderModuleItem')
    let item = this.props.item
    return (
      <View style={styles.moduleView}>
        <TouchableOpacity
          disabled={this.state.disabled}
          onPress={() => this.itemAction(item)}
          style={[styles.module]}
        >
          <View style={styles.baseImage}>
            <Image source={item.baseImage} style={item.style} />
          </View>
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
    importWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isShowProgressView: false,
    }
  }
  _renderItem = ({ item }) => {
    return (
      <RenderModuleItem
        item={item}
        currentUser={this.props.currentUser}
        importWorkspace={this.props.importWorkspace}
      />
    )
  }
  _renderScrollView = () => {
    return (
      <ScrollView
        style={styles.scrollView}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <FlatList
          data={ConstModule}
          renderItem={this._renderItem}
          horizontal={false}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
        />
      </ScrollView>
    )
  }
  render() {
    // console.log(scaleHeight(130))
    // console.log(scaleWidth(130))
    // console.log(screen.deviceWidth)
    // console.log(screen.deviceHeight)
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          data={ConstModule}
          renderItem={this._renderItem}
          horizontal={false}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
        />
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
  baseImage: {
    position: 'absolute',
    width: scaleSize(130),
    height: scaleSize(130),
    // resizeMode: 'stretch',
    backgroundColor: '#696969',
    borderRadius: 2,
  },
  module: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleImage: {
    width: scaleSize(50),
    height: scaleSize(50),
  },
  moduleView: {
    width: scaleSize(150),
    height: scaleSize(150),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:"red"
    // paddingHorizontal: scaleSize(10),
    // marginTop: scaleSize(5),
    // elevation: 20,
  },
  moduleItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: scaleSize(65),
    height: scaleSize(16),
    fontSize: setSpText(12),
    color: '#FFFFFF',
    textAlign: 'center',
    // marginTop: scaleSize(10),
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
