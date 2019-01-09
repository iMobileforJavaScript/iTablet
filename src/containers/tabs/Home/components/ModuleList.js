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
import { scaleSize } from '../../../../utils'
import RNFS from 'react-native-fs'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
// const SCREEN_WIDTH = Dimensions.get('window').width

class RenderModuleItem extends Component {
  props: {
    item: Object,
    importWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isShowProgressView: false,
      progress: 0,
      disabled: false,
    }
  }
  itemAction = async item => {
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
        dataUrl = 'https://www.supermapol.com/web/datas/1075928570/download'
      } else if (Platform.OS === 'ios') {
        fileName = 'OlympicGreen_ios'
        dataUrl = 'https://www.supermapol.com/web/datas/1766529829/download'
      }
    }
    let homePath = await FileTools.appendingHomeDirectory()
    let fileDirPath = homePath + ConstPath.CachePath + fileName
    let fileCachePath = fileDirPath + '.zip'
    let isExist = await FileTools.fileIsExist(fileCachePath)
    // console.warn(dataUrl + ' '+fileName+' '+isExist)
    if (!isExist) {
      this.setState({
        progress: '0%',
        isShowProgressView: true,
        disabled: true,
      })
      let fileCachePath = fileDirPath + '.zip'
      let downloadOptions = {
        fromUrl: dataUrl,
        toFile: fileCachePath,
        background: true,
        progress: res => {
          let value =
            ((res.bytesWritten / res.contentLength) * 100).toFixed(0) + '%'
          // console.warn(value)
          if (value !== this.state.progress) {
            this.setState({
              progress: value,
              isShowProgressView: true,
              disabled: true,
            })
          }
        },
      }
      try {
        let result = RNFS.downloadFile(downloadOptions)
        result.promise
          .then(async result => {
            if (result.statusCode === 200) {
              Toast.show('下载成功')
              this.props.importWorkspace(fileCachePath, item, isExist)
              this.setState({ isShowProgressView: false, disabled: false })
            }
          })
          .catch(() => {
            Toast.show('下载失败')
            this.setState({ isShowProgressView: false, disabled: false })
          })
      } catch (e) {
        Toast.show('网络错误，下载失败')
      } finally {
        this.setState({ isShowProgressView: false, disabled: false })
      }
    } else {
      this.props.importWorkspace(fileCachePath, item, isExist)
    }
  }

  _renderProgressView = () => {
    let display = this.state.isShowProgressView ? 'flex' : 'none'
    let progress = this.state.progress
    return (
      <View
        style={[
          {
            position: 'absolute',
            width: scaleSize(260),
            height: scaleSize(195),
            backgroundColor: '#rgba(128, 192, 255,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            display: display,
          },
        ]}
      >
        <Text>{progress}</Text>
      </View>
    )
  }
  render() {
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
