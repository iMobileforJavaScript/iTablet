import * as React from 'react'
import {
  NativeModules,
  Platform,
  View,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native'

import NavigationService from '../../../../containers/NavigationService'
import Thumbnails from '../../../../components/Thumbnails'
import { scaleSize, Toast } from '../../../../utils'
import { FileTools } from '../../../../native'
import { OnlineService, EngineType } from 'imobile_for_reactnative'
import { ConstPath, ExampleMapData } from '../../../../constants'

const openNativeSampleCode =
  Platform.OS === 'ios'
    ? NativeModules.SMSampleCodeBridgeModule
    : NativeModules.IntentModule

const defalutImageSrc = require('../../../../assets/public/mapImage0.png')
const vectorMap = '数据可视化',
  ObliquePhoto = '倾斜摄影',
  gl = 'GL地图瓦片',
  overLay = '影像叠加矢量地图',
  map3D = '三维场景'

export default class ExampleMapList extends React.Component {
  props: {
    setLoading: () => {},
  }

  constructor(props) {
    super(props)
    this.islogin = false
    this.unzip = true
    this.ziping = false
    this.downloaded = false
    this.progress = null
    this.downlist = []
    this.state = {
      maplist: [],
    }
  }

  componentDidMount() {
    (async function() {
      await this.mapexist()
    }.bind(this)())
  }

  cancel = async zipfile => {
    await FileTools.deleteFile(zipfile)
    let downitem = await this.getDownitem(GLOBAL.downitemname)
    downitem.downloaded(true)
  }

  mapexist = async () => {
    let testData
    if (Platform.OS === 'android') {
      testData = ExampleMapData.testData_android
    }
    if (Platform.OS === 'ios') {
      testData = ExampleMapData.testData_ios
    }
    for (let index = 0; index < testData.length; index++) {
      let exist = await FileTools.fileIsExistInHomeDirectory(
        testData[index].path,
      )
      exist
        ? (testData[index].backgroundcolor = null)
        : (testData[index].backgroundcolor = '#A3A3A3')
      exist ? (testData[index].opacity = 0) : (testData[index].opacity = 0.6)
    }
    this.setState({ maplist: testData })
  }

  _itemClick = async key => {
    let path, exist, filePath, outPath, fileName, openPath
    switch (key) {
      case vectorMap:
        path = ConstPath.SampleDataPath + 'hotMap/hotMap.smwu'
        filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.SampleDataPath)) +
          'hotMap.zip'
        outPath = await FileTools.appendingHomeDirectory(
          ConstPath.SampleDataPath,
        )
        fileName = 'hotMap'
        exist = await FileTools.fileIsExistInHomeDirectory(path)
        if (exist) {
          openNativeSampleCode.open('Visual')
        } else {
          this.alertDown(filePath, fileName, outPath, key)
        }
        break
      case map3D:
        filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.SampleDataPath)) +
          'CBD.zip'
        outPath = await FileTools.appendingHomeDirectory(
          ConstPath.SampleDataPath,
        )
        if (Platform.OS === 'ios') {
          fileName = 'CBD_ios'
          openPath =
            (await FileTools.appendingHomeDirectory(ConstPath.SampleDataPath)) +
            'CBD_ios/CBD_ios.sxwu'
          path = ConstPath.SampleDataPath + 'CBD_ios/CBD_ios.sxwu'
        } else {
          fileName = 'CBD'
          openPath =
            (await FileTools.appendingHomeDirectory(ConstPath.SampleDataPath)) +
            'CBD_android/CBD_android.sxwu'
          path = ConstPath.SampleDataPath + 'CBD_android/CBD_android.sxwu'
        }
        exist = await FileTools.fileIsExistInHomeDirectory(path)
        if (exist) {
          // NavigationService.navigate('MapView', { path: openPath, type: "", DSParams: { server: path, engineType: EngineType.UDB }, isExample: true })
          NavigationService.navigate('Map3D', {
            path: openPath,
            isExample: true,
          })
        } else {
          this.alertDown(filePath, fileName, outPath, key)
        }
        break
      case ObliquePhoto:
        filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.SampleDataPath)) +
          'MaSai.zip'
        outPath = await FileTools.appendingHomeDirectory(
          ConstPath.SampleDataPath,
        )
        if (Platform.OS === 'ios') {
          fileName = 'MaSai_ios'
          openPath =
            (await FileTools.appendingHomeDirectory(ConstPath.SampleDataPath)) +
            'MaSai_ios/MaSai.sxwu'
          path = ConstPath.SampleDataPath + 'MaSai_ios/MaSai.sxwu'
        } else {
          fileName = 'MaSai'
          openPath =
            (await FileTools.appendingHomeDirectory(ConstPath.SampleDataPath)) +
            'MaSai/MaSai.sxwu'
          path = ConstPath.SampleDataPath + 'MaSai/MaSai.sxwu'
        }
        exist = await FileTools.fileIsExistInHomeDirectory(path)
        if (exist) {
          NavigationService.navigate('Map3D', {
            path: openPath,
            isExample: true,
          })
        } else {
          this.alertDown(filePath, fileName, outPath, key)
        }
        break
      case gl:
        path = ConstPath.SampleDataPath + 'Changchun/Changchun.smwu'
        filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.SampleDataPath)) +
          'Changchun.zip'
        outPath = await FileTools.appendingHomeDirectory(
          ConstPath.SampleDataPath,
        )
        openPath =
          (await FileTools.appendingHomeDirectory(ConstPath.SampleDataPath)) +
          'Changchun/Changchun.smwu'
        fileName = 'Changchun'
        exist = await FileTools.fileIsExistInHomeDirectory(path)
        if (exist) {
          // NavigationService.navigate('MapView', { type: '', path: path, isExample: true })
          NavigationService.navigate('MapView', {
            path: openPath,
            type: '',
            DSParams: { server: path, engineType: EngineType.UDB },
            isExample: true,
          })
        } else {
          this.alertDown(filePath, fileName, outPath, key)
        }
        break
      case overLay:
        path = ConstPath.SampleDataPath + 'DOM/DOM.smwu'
        filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.SampleDataPath)) +
          'DOM.zip'
        outPath = await FileTools.appendingHomeDirectory(
          ConstPath.SampleDataPath,
        )
        openPath =
          (await FileTools.appendingHomeDirectory(ConstPath.SampleDataPath)) +
          'DOM/DOM.smwu'
        fileName = 'DOM'
        exist = await FileTools.fileIsExistInHomeDirectory(path)
        if (exist) {
          // NavigationService.navigate('MapView', { type: '', path: path, isExample: true })
          NavigationService.navigate('MapView', {
            path: openPath,
            type: '',
            DSParams: { server: path, engineType: EngineType.UDB },
            isExample: true,
          })
        } else {
          this.alertDown(filePath, fileName, outPath, key)
        }
        break
    }
  }

  downloading = async progress => {
    try {
      let mProgress
      if (progress instanceof Object) {
        mProgress = progress.progress
      } else {
        mProgress = progress
      }
      if (mProgress > 0 && mProgress > this.progress) {
        if (!this.downloaded) {
          let downitem = await this.getDownitem(GLOBAL.downitemname)
          this.progress = mProgress
          downitem.updateprogress(mProgress)
          // console.log(mProgress)
        }
      }
    } catch (e) {
      this.progress = null
      Toast.show('下载失败')
    }
  }

  onComplete = async () => {
    // console.log("success")
    let downitem = await this.getDownitem(GLOBAL.downitemname)
    this.downloaded = true
    this.progress = null
    try {
      if (this.unzip) {
        this.unzip = false
        Toast.show('文件解压中,请等待')
        // console.log("zip")
        this.ziping = true
        let result = await FileTools.unZipFile(this.zipfile, this.targetdir)
        if (result) {
          GLOBAL.downitemname = ''
          Alert.alert(
            '温馨提示',
            '文件解压完成',
            [
              {
                text: '确定',
                onPress: () => {
                  downitem.hideProgress()
                  FileTools.deleteFile(this.zipfile)
                },
              },
            ],
            { cancelable: true },
          )
        } else {
          this.unzip = false
          await FileTools.deleteFile(this.zipfile)
          Alert.alert(
            '温馨提示',
            '文件解压失败，是否重新下载',
            [
              {
                text: '确定',
                onPress: () => {
                  this.download(this.zipfile, this.downfilename)
                },
              },
              {
                text: '取消',
                onPress: () => {
                  this.cancel(this.zipfile)
                },
              },
            ],
            { cancelable: true },
          )
        }
      }
    } catch (error) {
      if (this.unzip) {
        this.unzip = false
        Alert.alert(
          '温馨提示',
          '文件解压失败，是否重新下载',
          [
            {
              text: '确定',
              onPress: () => {
                this.download(this.zipfile, this.downfilename)
              },
            },
            {
              text: '取消',
              onPress: () => {
                this.cancel(this.zipfile)
              },
            },
          ],
          { cancelable: true },
        )
      }
    }
  }

  downloadFailure = async () => {
    Toast.show('下载失败')
  }

  download = async (filePath, fileName) => {
    Toast.show('开始下载')
    this.progress = null
    this.OnlineService = new OnlineService()
    let result = await this.OnlineService.login(
      'jiushuaizhao1995@163.com',
      'z549451547',
    )
    if (result) {
      this.OnlineService.download(filePath, fileName, {
        onProgress: this.downloading,
        onComplete: this.onComplete,
        onFailure: this.downloadFailure,
      })
    } else {
      Alert.alert(
        '温馨提示',
        '下载失败，请检查网路',
        [
          {
            text: '确定',
            onPress: () => {},
          },
        ],
        { cancelable: true },
      )
    }
  }

  alertDown = async (filePath, fileName, outPath, key) => {
    if (this.progress) {
      Alert.alert(
        '温馨提示',
        '有文件正在下载中，请稍后',
        [
          {
            text: '确定',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        { cancelable: false },
      )
    } else {
      this.targetdir = outPath
      this.zipfile = filePath
      this.downfilename = fileName
      GLOBAL.downitemname = key
      this.downloaded = false
      this.unzip = true
      Alert.alert(
        '温馨提示',
        '本地实例文件不存在是否下载文件',
        [
          { text: '确定', onPress: () => this.download(filePath, fileName) },
          {
            text: '取消',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        { cancelable: true },
      )
    }
  }

  downList = (child, key) => {
    let item = { name: key, ref: child }
    this.downlist.push(item)
  }

  getDownitem = key => {
    for (let index = 0; index < this.downlist.length; index++) {
      if (key === this.downlist[index].name) {
        return this.downlist[index].ref
      }
    }
  }

  _renderItem = ({ item }) => {
    let key = item.key
    let src = defalutImageSrc
    let backgroundcolor = item.backgroundcolor
    let opacity = item.opacity
    switch (key) {
      case vectorMap:
        src = require('../../../../assets/public/beijing.png')
        break
      case map3D:
        src = require('../../../../assets/public/map3D.png')
        break
      case ObliquePhoto:
        src = require('../../../../assets/public/ObliquePhoto.png')
        break
      case gl:
        src = require('../../../../assets/public/VectorMap.png')
        // path = ConstPath.SampleDataPath + '/Changchun/Changchun.smwu'
        break
      case overLay:
        src = require('../../../../assets/public/VectorMap.png')
        break
      default:
        src = require('../../../../assets/public/VectorMap.png')
        break
    }
    return (
      <Thumbnails
        ref={ref => this.downList(ref, key)}
        title={key}
        src={src}
        btnClick={() => this._itemClick(key)}
        backgroundcolor={backgroundcolor}
        opacity={opacity}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.maplist}
          renderItem={this._renderItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          // keyboardShouldPersistTaps={'always'}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: scaleSize(20),
    flexDirection: 'column',
  },
})
