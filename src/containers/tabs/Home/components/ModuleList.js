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
  Alert,
} from 'react-native'
import { ConstModule, ConstPath } from '../../../../constants'
import { scaleSize } from '../../../../utils'
import { downloadFile } from 'react-native-fs'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'

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
    let moduleKey = item.key
    if (moduleKey === '地图制图') {
      fileName = '湖南'
    } else if (moduleKey === '专题地图') {
      fileName = '北京'
    } else if (moduleKey === '外业采集') {
      fileName = '地理国情普查'
    } else if (moduleKey === '三维场景') {
      if (Platform.OS === 'android') {
        fileName = 'OlympicGreen_android'
      } else if (Platform.OS === 'ios') {
        fileName = 'OlympicGreen_ios'
      }
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
      // this._showAlert(item.key)
      this._downloadModuleData()
    } else {
      await this.props.importWorkspace(fileDirPath, item, isDownloaded)
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
      dataUrl = 'https://www.supermapol.com/web/datas/456143933/download'
    } else if (moduleKey === '专题地图') {
      dataUrl = 'https://www.supermapol.com/web/datas/139937185/download'
    } else if (moduleKey === '外业采集') {
      dataUrl = 'https://www.supermapol.com/web/datas/1605521624/download'
    } else if (moduleKey === '三维场景') {
      if (Platform.OS === 'android') {
        dataUrl = 'https://www.supermapol.com/web/datas/1254811966/download'
      } else if (Platform.OS === 'ios') {
        dataUrl = 'https://www.supermapol.com/web/datas/595812366/download'
      }
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
        .then(async result => {
          if (result.statusCode === 200) {
            await FileTools.unZipFile(fileCachePath, cachePath)
            FileTools.deleteFile(fileDirPath + '.zip')
            await this.props.importWorkspace(fileDirPath, item, false)
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
            height: scaleSize(195),
            backgroundColor: '#rgba(112, 128, 144,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          },
        ]}
      >
        <Text
          style={{
            fontSize: scaleSize(25),
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
  _showAlert = moduleName => {
    Alert.alert(
      '下载',
      `${moduleName}没有数据`,
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
      ],
      { cancelable: true },
    )
  }
  render() {
    // console.warn('render-item')
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
  // UNSAFE_componentWillMount() {
  //   console.warn('ModuleList WILL MOUNT!')
  // }
  // componentDidMount() {
  //   console.warn('ModuleList DID MOUNT!')
  // }
  // UNSAFE_componentWillReceiveProps() {
  //   console.warn('ModuleList WILL RECEIVE PROPS!')
  // }
  // shouldComponentUpdate() {
  //   return true
  // }
  // UNSAFE_componentWillUpdate( ) {
  //   console.warn('ModuleList WILL UPDATE!')
  // }
  // componentDidUpdate( ) {
  //   console.warn('ModuleList DID UPDATE!')
  // }
  // componentWillUnmount() {
  //   console.warn('ModuleList WILL UNMOUNT!')
  // }

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
    // console.warn('render-list')
    return (
      <View style={styles.container}>
        {/*{this.props.device.orientation === 'LANDSCAPE' ? (
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
        )}*/}
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
    width: scaleSize(260),
    height: scaleSize(195),
    // resizeMode: 'stretch',
    backgroundColor: '#696969',
    borderRadius: 5,
  },
  module: {
    width: scaleSize(280),
    height: scaleSize(215),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleImage: {
    width: scaleSize(100),
    height: scaleSize(80),
  },
  moduleView: {
    width: scaleSize(280),
    height: scaleSize(215),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: scaleSize(10),
    // marginTop: scaleSize(5),
  },
  moduleItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: scaleSize(150),
    height: scaleSize(40),
    fontSize: scaleSize(25),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: scaleSize(10),
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
