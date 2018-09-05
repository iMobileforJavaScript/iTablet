import * as React from 'react'
import { NativeModules, Platform, DeviceEventEmitter } from 'react-native'
import { View, StyleSheet, FlatList, Alert } from 'react-native'

import NavigationService from '../../../containers/NavigationService'
import Thumbnails from '../../../components/Thumbnails'
import { scaleSize, Toast } from '../../../utils'
import { Utility, OnlineService, EngineType } from 'imobile_for_javascript'
import { ConstPath, Constans } from '../../../constains'
const openNativeSampleCode = Platform.OS === 'ios' ? NativeModules.SMSampleCodeBridgeModule : NativeModules.IntentModule

const defalutImageSrc = require('../../../assets/public/mapImage0.png')
const vectorMap = '数据可视化', map3D = '三维场景', ObliquePhoto = '倾斜摄影', gl = 'GL地图瓦片', overLay = '影像叠加矢量地图'
const testData = [{ key: vectorMap }, { key: ObliquePhoto }, { key: gl }, { key: overLay }, { key: map3D }, { key: 'CAD' }]

export default class ExampleMapList extends React.Component {
  constructor(props) {
    super(props)
    this.islogin = false
    this.unzip = true
    this.end=false
    this.downloading=false
    this.progeress = 0
  }

  componentDidMount() {
    (async function () {
      let that = this
      try {
        DeviceEventEmitter.addListener(Constans.ONLINE_SERVICE_DOWNLOADING, function (progeress) {
          if (progeress > 0 && progeress !== that.progeress) {
              that.progeress = progeress
              if(!that.end){
                GLOBAL.child.updateprogress(that.progeress)

              }
            if (that.progeress == 99) {
              if (that.unzip) {
                that.unzip = false
                that.unZipFolder(that.zipfile, that.targetdir)   
                that.end=true
              }
              return GLOBAL.child = '', that.progeress=0
            }
            console.log(that.progeress)
          }

        })
        // DeviceEventEmitter.addListener(Constans.ONLINE_SERVICE_DOWNLOADED, function (result) {
        //    if(result){
        //      result=false
        //      that.unZipFolder(that.zipfile,that.targetdir)
        //      return
        //    }
        // })
      } catch (error) {
        console.log(error)
      }
    }).bind(this)()
  }

  _itemClick = async (key, child) => {
    let path, exist, filePath, outPath
    switch (key) {
      case vectorMap:
        path = ConstPath.SampleDataPath + '/hotMap/hotMap.smwu'
        filePath = await Utility.appendingHomeDirectory(ConstPath.SampleDataPath) + '/hotMap.zip'
        outPath = await Utility.appendingHomeDirectory(ConstPath.SampleDataPath)
        fileName = "hotMap"
        exist = await Utility.fileIsExistInHomeDirectory(path)
        if (exist) {
          openNativeSampleCode.open("Visual")
        } else {
          this.alertDown(filePath, fileName, outPath, child)
        }
        break
      case map3D:
        path = ConstPath.SampleDataPath + '/凯德Mall/凯德Mall.sxwu'
        filePath = await Utility.appendingHomeDirectory(ConstPath.SampleDataPath) + "/凯德Mall.zip"
        outPath = await Utility.appendingHomeDirectory(ConstPath.SampleDataPath)
        openPath= await Utility.appendingHomeDirectory(ConstPath.SampleDataPath)+'/凯德Mall/凯德Mall.smwu'
        fileName = "凯德Mall"
        exist = await Utility.fileIsExistInHomeDirectory(path)
        if (exist) {
          NavigationService.navigate('Map3D', { path: path, isExample: true })
        } else {
          this.alertDown(filePath, fileName, outPath, child)
        }
        break
      case ObliquePhoto:
        path = ConstPath.SampleDataPath + '/MaSai/MaSai.sxwu'
        filePath = await Utility.appendingHomeDirectory(ConstPath.SampleDataPath) + "/MaSai.zip"
        outPath = await Utility.appendingHomeDirectory(ConstPath.SampleDataPath)
        openPath= await Utility.appendingHomeDirectory(ConstPath.SampleDataPath)+'/MaSai/MaSai.smwu'
        fileName = "MaSai"
        exist = await Utility.fileIsExistInHomeDirectory(path)
        if (exist) {
          NavigationService.navigate('Map3D', { path: openPath, isExample: true })
        } else {
          this.alertDown(filePath, fileName, outPath, child)
        }
        break
      case gl:
        path = ConstPath.SampleDataPath + '/Changchun/Changchun.smwu'
        filePath = await Utility.appendingHomeDirectory(ConstPath.SampleDataPath) + "/Changchun.zip"
        outPath = await Utility.appendingHomeDirectory(ConstPath.SampleDataPath)
        openPath= await Utility.appendingHomeDirectory(ConstPath.SampleDataPath)+'/Changchun/Changchun.smwu'
        fileName = "Changchun"
        exist = await Utility.fileIsExistInHomeDirectory(path)
        if (exist) {
          // NavigationService.navigate('MapView', { type: '', path: path, isExample: true })
          NavigationService.navigate('MapView', { path: openPath, type: "", DSParams: { server: path, engineType: EngineType.UDB } ,isExample: true })
        } else {
          this.alertDown(filePath, fileName, outPath, child)

        }
        break
      default:
        path = ConstPath.SampleDataPath + '/Changchun/Changchun.smwu'
        filePath = await Utility.appendingHomeDirectory(ConstPath.SampleDataPath) + "/Changchun.zip"
        outPath = await Utility.appendingHomeDirectory(ConstPath.SampleDataPath)
        openPath= await Utility.appendingHomeDirectory(ConstPath.SampleDataPath)+'/Changchun/Changchun.smwu'
        fileName = "Changchun"
        exist = await Utility.fileIsExistInHomeDirectory(path)
        if (exist) {
          NavigationService.navigate('MapView',{ path: openPath, type: "", DSParams: { server: path, engineType: EngineType.UDB } ,isExample: true })
        } else {
          Toast.show("本地实例文件不存在")
        }
        break
    }
  }
  unZipFolder = async (zipfile, targetdir) => {
    let result = await Utility.unZipFolder(zipfile, targetdir)
    if (result) {
      Alert.alert(
        "温馨提示",
        "文件下载完成",
        [
          { text: "确定", onPress: () => console.log('yes') },
        ],
        { cancelable: true }
      )
    }
    else {
      Alert.alert(
        "温馨提示",
        "文件下载失败，请重新下载",
        [
          { text: "确定", onPress: () => console.log('ok') },
        ],
        { cancelable: true }
      )
    }
  }

  alertDown = async (filePath, fileName, outPath, child) => {
    if (this.progeress>0) {
      Alert.alert(
        "温馨提示",
        "有文件正在下载中，请稍后下载",
        [
          { text: "确定", onPress: () => console.log('ok') },
        ],
        { cancelable: true }
      )
    }
    else {
      this.OnlineService = new OnlineService()
      let result = await this.OnlineService.login("imobile1234", "imobile")
      if (result) {
        this.targetdir = outPath
        this.zipfile = filePath
        GLOBAL.child = child
        Alert.alert(
          "温馨提示",
          "本地实例文件不存在是否下载文件",
          [
            { text: "确定", onPress: () => this.OnlineService.download(filePath, fileName) },
            { text: "取消", onPress: () => console.log('Pressde'), style: "cancel" },
          ],
          { cancelable: true }
        )
      }
      else{
        Alert.alert(
          "温馨提示",
          "下载失败，请检查网路",
          [
            { text: "确定", onPress: () =>{}},
          ],
          { cancelable: true }
        )
      }
    }

  }

  _renderItem = ({ item }) => {
    let key = item.key
    let src = defalutImageSrc
    let child
    switch (key) {
      case vectorMap:
        src = require('../../../assets/public/beijing.png')
        break
      case map3D:
        src = require('../../../assets/public/map3D.png')
        break
      case ObliquePhoto:
        src = require('../../../assets/public/ObliquePhoto.png')
        break
      default:
        src = require('../../../assets/public/VectorMap.png')
        break
    }
    return (
      <Thumbnails ref={ref => child = ref} title={key} src={src} btnClick={() => this._itemClick(key, child)} />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={testData}
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
  // item: {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   height: 40,
  //   width: width,
  //   paddingLeft: 15,
  //   backgroundColor: color.grayLight,
  // },
  // container: {aa
  //   flex: 1,
  //   backgroundColor: 'white',
  //   alignSelf: 'center',
  // },
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: scaleSize(20),
    flexDirection: 'column',
  },
})