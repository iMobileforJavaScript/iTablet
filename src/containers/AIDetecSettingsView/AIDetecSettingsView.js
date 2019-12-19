import * as React from 'react'
import { InteractionManager, View, Image, Text, ScrollView } from 'react-native'
import NavigationService from '../../containers/NavigationService'
import { getThemeAssets } from '../../assets'
import Orientation from 'react-native-orientation'
import styles from './styles'
import { Container, Loading } from '../../components'
import Button from '../../components/Button/Button'
import FetchUtils from '../../utils/FetchUtils'
import { FileTools } from '../../native'
import Toast from '../../utils/Toast'
import { getLanguage } from '../../language'
import { ConstPath } from '../../constants'
import { SAIDetectView } from 'imobile_for_reactnative'

const DEFAULT_MODEL = 'detect' //默认模型
const DETECT_DUSTBIN_MODEL = 'detect_lajixiang_300' //垃圾箱模型
const ROAD_MODEL = 'road_crack_detect' //道路模型

/*
 * 目标采集模型选择界面
 */
export default class AIDetecSettingsView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
    downloads: Array,
    downloadFile: () => {},
  }

  constructor(props) {
    super(props)

    this.state = {
      currentModel: DEFAULT_MODEL, //当前使用的模型
      defaultBtx: '',
      dustbinBtx: '',
      plantBtx: '',
    }

    this.clickAble = true // 防止重复点击
    SAIDetectView.setProjectionModeEnable(false)
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.downloads) !==
      JSON.stringify(this.props.downloads)
    ) {
      for (let index = 0; index < this.props.downloads.length; index++) {
        const element = this.props.downloads[index]
        if (element.id === 'DETECT_DUSTBIN_MODEL') {
          if (element.progress < 100) {
            this.setState({
              dustbinBtx: element.progress + '%',
            })
          }
        } else if (element.id === 'ROAD_MODEL') {
          if (element.progress < 100) {
            this.setState({
              plantBtx: element.progress + '%',
            })
          }
        }
      }
    }
  }

  componentDidMount() {
    // 初始化数据
    (async function() {
      this.homePath = await FileTools.appendingHomeDirectory()
      let dustbinPath =
        this.homePath +
        ConstPath.Common_AIClassifyModel +
        DETECT_DUSTBIN_MODEL +
        '/'
      this.dustbin_model = dustbinPath + DETECT_DUSTBIN_MODEL + '.tflite'
      this.dustbin_txt = dustbinPath + DETECT_DUSTBIN_MODEL + '.txt'
      let isDustbin =
        (await FileTools.fileIsExist(this.dustbin_model)) &&
        (await FileTools.fileIsExist(this.dustbin_txt))
      if (isDustbin) {
        this.setState({
          dustbinBtx: getLanguage(this.props.language).Prompt.USED_IMMEDIATELY,
        })
      } else {
        this.setState({
          dustbinBtx: getLanguage(this.props.language).Prompt.DOWNLOAD,
        })
      }
      let plantPath =
        this.homePath + ConstPath.Common_AIClassifyModel + ROAD_MODEL + '/'
      this.plant_model = plantPath + ROAD_MODEL + '.tflite'
      this.plant_txt = plantPath + ROAD_MODEL + '.txt'
      let isPlant =
        (await FileTools.fileIsExist(this.plant_model)) &&
        (await FileTools.fileIsExist(this.plant_txt))
      if (isPlant) {
        this.setState({
          plantBtx: getLanguage(this.props.language).Prompt.USED_IMMEDIATELY,
        })
      } else {
        this.setState({
          plantBtx: getLanguage(this.props.language).Prompt.DOWNLOAD,
        })
      }
      //当前使用的模型文件
      let currentmodel = await SAIDetectView.getDetectInfo()
      if (currentmodel.ModelType === 'ASSETS_FILE') {
        this.setState({
          currentModel: DEFAULT_MODEL,
          defaultBtx: getLanguage(this.props.language).Prompt.USING,
        })
      } else if (currentmodel.ModelType === 'ABSOLUTE_FILE_PATH') {
        if (currentmodel.ModelPath.indexOf(DETECT_DUSTBIN_MODEL) !== -1) {
          this.setState({
            currentModel: DETECT_DUSTBIN_MODEL,
            defaultBtx: getLanguage(this.props.language).Prompt
              .USED_IMMEDIATELY,
            dustbinBtx: getLanguage(this.props.language).Prompt.USING,
          })
        } else if (currentmodel.ModelPath.indexOf(ROAD_MODEL) !== -1) {
          this.setState({
            currentModel: ROAD_MODEL,
            defaultBtx: getLanguage(this.props.language).Prompt
              .USED_IMMEDIATELY,
            plantBtx: getLanguage(this.props.language).Prompt.USING,
          })
        }
      }
    }.bind(this)())
    InteractionManager.runAfterInteractions(() => {})
  }

  componentWillUnmount() {
    // Orientation.unlockAllOrientations()
    //移除监听
  }

  back = async () => {
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 1500)
      await SAIDetectView.setProjectionModeEnable(true)
      NavigationService.goBack()
    }
    return true
  }

  renderModelItemFirst = () => {
    return (
      <View style={styles.ModelItemView}>
        <Image
          source={getThemeAssets().ar.classify_normal}
          style={styles.img}
        />
        <Button
          style={styles.btnSwitchModelsView}
          titleStyle={styles.txtBtnSwitchModelsView}
          title={this.state.defaultBtx}
          type={'BLUE'}
          activeOpacity={0.5}
          onPress={() =>
            this.useOrDownloadModel(
              this.state.defaultBtx,
              'DEFAULT_MODEL',
              DEFAULT_MODEL,
            )
          }
        />
        <Text style={styles.titleSwitchModelsView}>
          {getLanguage(this.props.language).Prompt.DEFAULT_MODEL}
        </Text>
        <View style={styles.DividingLine} />
      </View>
    )
  }
  renderModelItemSecond = () => {
    return (
      <View style={styles.ModelItemView}>
        <Image
          source={getThemeAssets().ar.classify_dustbin}
          style={styles.img}
        />
        <Button
          style={styles.btnSwitchModelsView}
          titleStyle={styles.txtBtnSwitchModelsView}
          title={this.state.dustbinBtx}
          type={'BLUE'}
          activeOpacity={0.5}
          onPress={() =>
            this.useOrDownloadModel(
              this.state.dustbinBtx,
              'DETECT_DUSTBIN_MODEL',
              DETECT_DUSTBIN_MODEL,
            )
          }
        />
        <Text style={styles.titleSwitchModelsView}>
          {getLanguage(this.props.language).Prompt.DETECT_DUSTBIN_MODEL}
        </Text>
        <View style={styles.DividingLine} />
      </View>
    )
  }
  renderModelItemThird = () => {
    return (
      <View style={styles.ModelItemView}>
        <Image source={getThemeAssets().ar.classify_road} style={styles.img} />
        <Button
          style={styles.btnSwitchModelsView}
          titleStyle={styles.txtBtnSwitchModelsView}
          title={this.state.plantBtx}
          type={'BLUE'}
          activeOpacity={0.5}
          onPress={() =>
            this.useOrDownloadModel(
              this.state.plantBtx,
              'ROAD_MODEL',
              ROAD_MODEL,
            )
          }
        />
        <Text style={styles.titleSwitchModelsView}>
          {getLanguage(this.props.language).Prompt.ROAD_MODEL}
        </Text>
        <View style={styles.DividingLine} />
      </View>
    )
  }

  renderSwitchModels = () => {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.SwitchModelsView}
          contentContainerStyle={styles.scrollViewContentContainer}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        >
          {this.renderModelItemFirst()}
          {this.renderModelItemSecond()}
          {this.renderModelItemThird()}
        </ScrollView>
      </View>
    )
  }

  useOrDownloadModel = async (title, key, fileName) => {
    let params = {
      ModelType: '',
      ModelPath: '',
      LabelPath: '',
    }
    if (title === getLanguage(this.props.language).Prompt.USED_IMMEDIATELY) {
      this.Loading.setLoading(
        true,
        getLanguage(this.props.language).Prompt.CHANGING,
      )
      if (fileName === DEFAULT_MODEL) {
        params.ModelType = 'ASSETS_FILE'
      } else if (fileName === DETECT_DUSTBIN_MODEL) {
        params.ModelType = 'ABSOLUTE_FILE_PATH'
        params.ModelPath = this.dustbin_model
        params.LabelPath = this.dustbin_txt
      } else if (fileName === ROAD_MODEL) {
        params.ModelType = 'ABSOLUTE_FILE_PATH'
        params.ModelPath = this.plant_model
        params.LabelPath = this.plant_txt
      }
      let result = await SAIDetectView.setDetectInfo(params)
      if (result) {
        Toast.show(getLanguage(this.props.language).Prompt.CHANGE_SUCCESS)
        let dustbinBtx =
          this.state.dustbinBtx ===
          getLanguage(this.props.language).Prompt.USING
        let plantBtx =
          this.state.plantBtx === getLanguage(this.props.language).Prompt.USING
        if (fileName === DEFAULT_MODEL) {
          this.setState({
            currentModel: fileName,
            defaultBtx: getLanguage(this.props.language).Prompt.USING,
            dustbinBtx: dustbinBtx
              ? getLanguage(this.props.language).Prompt.USED_IMMEDIATELY
              : this.state.dustbinBtx,
            plantBtx: plantBtx
              ? getLanguage(this.props.language).Prompt.USED_IMMEDIATELY
              : this.state.plantBtx,
          })
        } else if (fileName === DETECT_DUSTBIN_MODEL) {
          this.setState({
            currentModel: fileName,
            defaultBtx: getLanguage(this.props.language).Prompt
              .USED_IMMEDIATELY,
            dustbinBtx: getLanguage(this.props.language).Prompt.USING,
            plantBtx: plantBtx
              ? getLanguage(this.props.language).Prompt.USED_IMMEDIATELY
              : this.state.plantBtx,
          })
        } else if (fileName === ROAD_MODEL) {
          this.setState({
            currentModel: fileName,
            defaultBtx: getLanguage(this.props.language).Prompt
              .USED_IMMEDIATELY,
            dustbinBtx: dustbinBtx
              ? getLanguage(this.props.language).Prompt.USED_IMMEDIATELY
              : this.state.dustbinBtx,
            plantBtx: getLanguage(this.props.language).Prompt.USING,
          })
        }
      } else {
        Toast.show(getLanguage(this.props.language).Prompt.CHANGE_FAULT)
      }
      this.Loading.setLoading(false)
    } else if (title === getLanguage(this.props.language).Prompt.DOWNLOAD) {
      if (fileName === DETECT_DUSTBIN_MODEL) {
        this.setState({
          dustbinBtx: getLanguage(this.props.language).Prompt.DOWNLOADING,
        })
      } else if (fileName === ROAD_MODEL) {
        this.setState({
          plantBtx: getLanguage(this.props.language).Prompt.DOWNLOADING,
        })
      }
      let downloadData = this.getDownloadData(key, fileName)
      this._downloadData(downloadData)
    } else if (title === getLanguage(this.props.language).Prompt.USING) {
      Toast.show(getLanguage(this.props.language).Prompt.USING)
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.DOWNLOADING)
      return
    }
  }

  getDownloadData = (key, fileName) => {
    let cachePath = this.homePath + ConstPath.CachePath
    let toPath = this.homePath + ConstPath.Common_AIClassifyModel + fileName
    return {
      key: key,
      fileName: fileName,
      cachePath: cachePath,
      copyFilePath: toPath,
    }
  }

  _downloadData = async downloadData => {
    let keyword = downloadData.fileName
    let dataUrl = await FetchUtils.getFindUserDataUrl(
      'xiezhiyan123',
      keyword,
      '.zip',
    )
    let cachePath = downloadData.cachePath
    let fileDirPath = downloadData.copyFilePath
    let fileCachePath = cachePath + downloadData.fileName + '.zip'
    await FileTools.deleteFile(fileCachePath)
    try {
      let downloadOptions = {
        fromUrl: dataUrl,
        toFile: fileCachePath,
        background: true,
        fileName: downloadData.fileName,
        progressDivider: 1,
        key: downloadData.key,
        // progress: res => {
        //   let value = ~~res.progress.toFixed(0)
        //   let progress = value + '%'
        //   if (downloadData.fileName === DUSTBIN_MODEL) {
        //     this.setState({
        //       dustbinBtx: progress,
        //     })
        //   } else if (downloadData.fileName === ROAD_MODEL) {
        //     this.setState({
        //       plantBtx: progress,
        //     })
        //   }
        // },
      }

      // const ret = RNFS.downloadFile(downloadOptions)
      // ret.promise
      this.props
        .downloadFile(downloadOptions)
        .then(async () => {
          await FileTools.unZipFile(fileCachePath, fileDirPath)
          await FileTools.deleteFile(fileCachePath)
          if (downloadData.fileName === DETECT_DUSTBIN_MODEL) {
            this.setState({
              dustbinBtx: getLanguage(this.props.language).Prompt
                .USED_IMMEDIATELY,
            })
          } else if (downloadData.fileName === ROAD_MODEL) {
            this.setState({
              plantBtx: getLanguage(this.props.language).Prompt
                .USED_IMMEDIATELY,
            })
          }
        })
        .catch(() => {
          Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
          FileTools.deleteFile(fileCachePath)
        })
    } catch (e) {
      Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
      //'网络错误，下载失败'
      FileTools.deleteFile(fileCachePath)
    }
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Prompt.CHOOSE_CLASSIFY_MODEL,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        {this.renderSwitchModels()}
        <Loading ref={ref => (this.Loading = ref)} initLoading={false} />
      </Container>
    )
  }
}
