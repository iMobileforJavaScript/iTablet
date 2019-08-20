import * as React from 'react'
import {
  InteractionManager,
  TouchableOpacity,
  View,
  Image,
  Text,
  DeviceEventEmitter,
} from 'react-native'
import NavigationService from '../../containers/NavigationService'
import { getPublicAssets, getThemeAssets } from '../../assets'
import {
  SMAIClassifyView,
  SAIClassifyView,
  SMediaCollector,
  SMap,
} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
// import { getLanguage } from '../../language'

import styles from './styles'
import ImageButton from '../../components/ImageButton'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import { Toast } from '../../utils'
import { getLanguage } from '../../language'

/*
 * AI分类
 */
export default class ClassifyView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}
    this.datasourceAlias = params.datasourceAlias
    this.datasetName = params.datasetName

    this.state = {
      first_result: '',
      isFirstShow: false,
      second_result: '',
      isSecondShow: false,
      third_result: '',
      isThirdShow: false,
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // 初始化数据
      (async function() {
        // SMeasureView.initMeasureCollector(
        //   this.datasourceAlias,
        //   this.datasetName,
        // )
        //注册监听
        DeviceEventEmitter.addListener('recognizeImage', this.recognizeImage)
      }.bind(this)())
    })
  }

  componentWillUnmount() {
    // Orientation.unlockAllOrientations()
    //移除监听
    DeviceEventEmitter.removeListener('recognizeImage', this.recognizeImage)
  }

  recognizeImage = params => {
    this.results = params.results
    if (this.results[0]) {
      let item = this.results[0]
      this.setState({
        isFirstShow: true,
        first_result: item.Title + ':' + item.Confidence,
      })
    } else {
      this.setState({
        isFirstShow: false,
      })
    }
    if (this.results[1]) {
      let item = this.results[1]
      this.setState({
        isSecondShow: true,
        second_result: item.Title + ':' + item.Confidence,
      })
    } else {
      this.setState({
        isSecondShow: false,
      })
    }
    if (this.results[2]) {
      let item = this.results[2]
      this.setState({
        isThirdShow: true,
        third_result: item.Title + ':' + item.Confidence,
      })
    } else {
      this.setState({
        isThirdShow: false,
      })
    }
  }

  startPreview = async () => {
    await SAIClassifyView.startPreview()
  }

  dispose = async () => {
    await SAIClassifyView.dispose()
  }

  captureImage = async () => {
    await SAIClassifyView.captureImage()
  }

  save = async name => {
    //保存数据->跳转
    (async function() {
      let isTaggingLayer = await SMap.isTaggingLayer(
        this.props.user.currentUser.userName,
      )
      if (isTaggingLayer && GLOBAL.TaggingDatasetName) {
        await SMap.setTaggingGrid(
          GLOBAL.TaggingDatasetName,
          this.props.user.currentUser.userName,
        )
        const datasourceAlias =
          'Label_' + this.props.user.currentUser.userName + '#' // 标注数据源名称
        const datasetName = GLOBAL.TaggingDatasetName // 标注图层名称
        let targetPath = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath +
            this.props.user.currentUser.userName +
            '/' +
            ConstPath.RelativeFilePath.Media,
        )
        SMediaCollector.initMediaCollector(targetPath)

        let result = await SMediaCollector.addAIClassifyMedia({
          datasourceName: datasourceAlias,
          datasetName: datasetName,
          mediaName: name,
        })
        if (result) {
          Toast.show(
            name +
              ':' +
              getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY,
          )
        }
      } else {
        Toast.show(
          getLanguage(this.props.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
        )
        this.props.navigation.navigate('LayerManager')
      }
    }.bind(this)())
  }

  /** 重置/切换模式 **/
  remake = () => {
    //安排任务在交互和动画完成之后执行
    InteractionManager.runAfterInteractions(() => {
      // 重置数据
    })
  }

  /** 确认 **/
  confirm = () => {}

  renderBottomBtns = () => {
    return (
      <View style={styles.buttonView}>
        <TouchableOpacity
          onPress={() => NavigationService.goBack()}
          style={styles.iconView}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_back_white}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.startPreview()}
          style={styles.iconView}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_measure_restart}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderCenterBtn = () => {
    return (
      <ImageButton
        containerStyle={styles.capture}
        iconStyle={styles.iconView}
        activeOpacity={0.5}
        icon={getPublicAssets().common.icon_take_camera}
        onPress={() => {
          this.captureImage()
        }}
      />
    )
  }

  renderTopBtns = () => {
    return (
      <View style={styles.topView}>
        <TouchableOpacity
          onPress={() => NavigationService.goBack()}
          style={styles.iconView}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_measure_back}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.save()} style={styles.iconView}>
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_measure_save}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderLengthChangeView() {
    return (
      <View style={styles.InfoChangeView}>
        {this.state.isFirstShow && (
          <TouchableOpacity
            onPress={() => this.save(this.state.first_result)}
            style={styles.container}
          >
            <Text style={styles.title}>{this.state.first_result}</Text>
          </TouchableOpacity>
        )}
        {this.state.isSecondShow && (
          <TouchableOpacity
            onPress={() => this.save(this.state.second_result)}
            style={styles.container}
          >
            <Text style={styles.title}>{this.state.second_result}</Text>
          </TouchableOpacity>
        )}
        {this.state.isThirdShow && (
          <TouchableOpacity
            onPress={() => this.save(this.state.third_result)}
            style={styles.container}
          >
            <Text style={styles.title}>{this.state.third_result}</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <SMAIClassifyView ref={ref => (this.SMAIClassifyView = ref)} />
        {this.renderBottomBtns()}
        {this.renderCenterBtn()}
        {/*{this.renderTopBtns()}*/}
        {this.renderLengthChangeView()}
      </View>
    )
  }
}
