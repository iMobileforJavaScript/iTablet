import * as React from 'react'
import {
  InteractionManager,
  TouchableOpacity,
  View,
  Image,
  Text,
  DeviceEventEmitter,
  Platform,
} from 'react-native'
import NavigationService from '../../containers/NavigationService'
import { getPublicAssets, getThemeAssets } from '../../assets'
import {
  SMAIClassifyView,
  SAIClassifyView,
  SMediaCollector,
  DatasetType,
} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
// import { getLanguage } from '../../language'
import { Container, ImagePicker, Loading } from '../../components'
import styles from './styles'
import ImageButton from '../../components/ImageButton'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import { getLanguage } from '../../language'
import RadioButton from './RadioButton'
import { Toast } from '../../utils'

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
    this.checkedItem = 0

    this.state = {
      isCameraVisible: false,
      isClassifyInfoVisible: false,
      first_result: '',
      first_result_confidence: '',
      isFirstShow: false,
      second_result: '',
      second_result_confidence: '',
      isSecondShow: false,
      third_result: '',
      third_result_confidence: '',
      isThirdShow: false,
      bgImageSource: '',
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
        SAIClassifyView.initAIClassify(
          this.datasourceAlias,
          this.datasetName,
          this.props.language,
        )
        this.setState({
          isCameraVisible: true,
        })
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
    this.Loading.setLoading(false)
    this.results = params.results
    if (this.results.length > 0) {
      this.setState({
        isClassifyInfoVisible: true,
      })
    } else {
      Toast.show('分类失败,请重试.')
      this.clear()
      return
    }
    if (this.results[0]) {
      let item = this.results[0]
      this.setState(
        {
          isFirstShow: true,
          first_result: item.Title,
          first_result_confidence: item.Confidence,
        },
        () => {
          if (this.FirstRB) {
            this.checkedItem = 0
            this.FirstRB.setChecked(true) //默认选中第一个
          }
        },
      )
    } else {
      this.setState({
        isFirstShow: false,
      })
    }
    if (this.results[1]) {
      let item = this.results[1]
      this.setState({
        isSecondShow: true,
        second_result: item.Title,
        second_result_confidence: item.Confidence,
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
        third_result: item.Title,
        third_result_confidence: item.Confidence,
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

  stopPreview = async () => {
    await SAIClassifyView.stopPreview()
  }

  dispose = async () => {
    await SAIClassifyView.dispose()
  }

  captureImage = async () => {
    this.Loading.setLoading(true, '正在分类中...')
    await SAIClassifyView.captureImage()
    await SAIClassifyView.stopPreview()
  }

  save = async () => {
    //保存数据->跳转
    (async function() {
      let currentLayer = GLOBAL.currentLayer
      // let reg = /^Label_(.*)#$/
      let isTaggingLayer = false
      if (currentLayer) {
        isTaggingLayer = currentLayer.type === DatasetType.CAD
        // && currentLayer.datasourceAlias.match(reg)
      }
      if (isTaggingLayer) {
        const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
        const datasetName = currentLayer.datasetName // 标注图层名称
        let targetPath = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath +
            this.props.user.currentUser.userName +
            '/' +
            ConstPath.RelativeFilePath.Media,
        )
        SMediaCollector.initMediaCollector(targetPath)

        let mediaName = this.results[this.checkedItem].Title
        let classifyTime = this.results[this.checkedItem].Time
        let imagePath = targetPath + mediaName + '.jpg'
        let result = await SMediaCollector.addAIClassifyMedia({
          datasourceName: datasourceAlias,
          datasetName: datasetName,
          mediaName: mediaName,
        })
        if (result) {
          // Toast.show(
          //   madiaName +
          //     ':' +
          //     getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY,
          // )
          if (
            Platform.OS === 'android' &&
            imagePath.toLowerCase().indexOf('content://') !== 0
          ) {
            imagePath = 'file://' + imagePath
          }
          NavigationService.navigate('ClassifyResultEditView', {
            datasourceAlias,
            datasetName,
            imagePath,
            mediaName,
            classifyTime,
            cb: async () => {
              NavigationService.goBack()
              await this.clear()
              await this.startPreview()
            },
          })
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

  back = () => {
    NavigationService.goBack()
    return true
  }

  clear = async () => {
    this.setState({
      isClassifyInfoVisible: false,
      isCameraVisible: true,
    })
    this.startPreview()
    await SAIClassifyView.clearBitmap()
  }

  openAlbum = () => {
    ImagePicker.AlbumListView.defaultProps.showDialog = false
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
    ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
    ImagePicker.getAlbum({
      maxSize: 1,
      callback: async data => {
        let mediaPaths = []
        if (data.length > 0) {
          data.forEach(item => {
            mediaPaths.push(item.uri)
          })
          let path =
            'file://' + (await SAIClassifyView.getImagePath(mediaPaths[0]))
          this.setState(
            {
              isCameraVisible: false,
              bgImageSource: path,
            },
            () => {
              this.stopPreview()
            },
          )
        } else {
          Toast.show('未选择任何图片')
        }
      },
    })
  }

  RadioButtonOnChange = index => {
    if (index === 0) {
      this.FirstRB && this.FirstRB.setChecked(true)
      this.SecondRB && this.SecondRB.setChecked(false)
      this.ThridRB && this.ThridRB.setChecked(false)
    } else if (index === 1) {
      this.FirstRB && this.FirstRB.setChecked(false)
      this.SecondRB && this.SecondRB.setChecked(true)
      this.ThridRB && this.ThridRB.setChecked(false)
    } else if (index === 2) {
      this.FirstRB && this.FirstRB.setChecked(false)
      this.SecondRB && this.SecondRB.setChecked(false)
      this.ThridRB && this.ThridRB.setChecked(true)
    }
    this.checkedItem = index
  }

  renderBottomBtns = () => {
    return (
      <View style={styles.toolbar}>
        <View style={styles.buttonView}>
          {this.state.isClassifyInfoVisible && (
            <TouchableOpacity
              onPress={() => this.clear()}
              style={styles.iconView}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_delete}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
          )}
          {this.state.isClassifyInfoVisible && (
            <TouchableOpacity
              onPress={() => this.save()}
              style={styles.iconView}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_save}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
          )}
          {!this.state.isClassifyInfoVisible && (
            <TouchableOpacity style={styles.iconView}></TouchableOpacity>
          )}
          {!this.state.isClassifyInfoVisible && (
            <TouchableOpacity
              onPress={() => this.openAlbum()}
              style={styles.iconView}
            >
              <Image
                resizeMode={'contain'}
                source={getPublicAssets().common.icon_album}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  renderCenterBtn = () => {
    return (
      <ImageButton
        containerStyle={styles.capture}
        iconStyle={styles.cameraIcon}
        activeOpacity={0.8}
        icon={getThemeAssets().ar.icon_camera_classify}
        onPress={() => {
          this.captureImage()
        }}
      />
    )
  }

  renderOverlayPreview = () => {
    return (
      <View style={styles.preview}>
        {<View style={styles.overlayPreviewLeft} />}
        {<View style={styles.overlayPreviewTop} />}
        {<View style={styles.overlayPreviewRight} />}
        {<View style={styles.overlayPreviewBottom} />}
      </View>
    )
  }

  renderClassifyTitle = () => {
    return (
      <View style={styles.classifyTitleView}>
        <View style={styles.takeplace} />
        <Text style={styles.title}>{'识别结果'}</Text>
        <Text style={styles.titleConfidence}>{'置信度'}</Text>
      </View>
    )
  }

  renderImgPickerView = () => {
    let show = this.state.bgImageSource && this.state.bgImageSource !== ''
    if (!show) return
    return (
      <View style={styles.newcontainer}>
        <Image
          style={styles.backImg}
          // resizeMode={'contain'}
          resizeMode={'cover'}
          source={{ uri: this.state.bgImageSource }}
        />
      </View>
    )
  }

  renderClassifyInfoView() {
    return (
      <View style={styles.InfoChangeView}>
        {this.renderClassifyTitle()}
        {this.state.isFirstShow && (
          <TouchableOpacity
            onPress={() => this.RadioButtonOnChange(0)}
            style={styles.classifyTitleView}
          >
            <RadioButton
              ref={ref => (this.FirstRB = ref)}
              onChange={() => {
                this.RadioButtonOnChange(0)
              }}
            />
            <Text style={styles.title}>{this.state.first_result}</Text>
            <Text style={styles.titleConfidence}>
              {this.state.first_result_confidence}
            </Text>
          </TouchableOpacity>
        )}
        {this.state.isSecondShow && (
          <TouchableOpacity
            onPress={() => this.RadioButtonOnChange(1)}
            style={styles.classifyTitleView}
          >
            <RadioButton
              ref={ref => (this.SecondRB = ref)}
              onChange={() => {
                this.RadioButtonOnChange(1)
              }}
            />
            <Text style={styles.title}>{this.state.second_result}</Text>
            <Text style={styles.titleConfidence}>
              {this.state.second_result_confidence}
            </Text>
          </TouchableOpacity>
        )}
        {this.state.isThirdShow && (
          <TouchableOpacity
            onPress={() => this.RadioButtonOnChange(2)}
            style={styles.classifyTitleView}
          >
            <RadioButton
              ref={ref => (this.ThridRB = ref)}
              onChange={() => {
                this.RadioButtonOnChange(2)
              }}
            />
            <Text style={styles.title}>{this.state.third_result}</Text>
            <Text style={styles.titleConfidence}>
              {this.state.third_result_confidence}
            </Text>
          </TouchableOpacity>
        )}
        {/* {(
          <TouchableOpacity
            onPress={() => this.save(this.state.third_result)}
            style={styles.classifyTitleView}
          >
            <CheckBox onChange={value => {
              this.firstOnChange(value)
            }}/>
            <Text style={styles.titleElse}>{'以上结果都不对'}</Text>
          </TouchableOpacity>
        )}*/}
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: '目标分类',
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        {<SMAIClassifyView ref={ref => (this.SMAIClassifyView = ref)} />}
        {!this.state.isCameraVisible && this.renderImgPickerView()}
        {this.state.isCameraVisible && this.renderOverlayPreview()}
        {this.renderBottomBtns()}
        {!this.state.isClassifyInfoVisible && this.renderCenterBtn()}
        {this.state.isClassifyInfoVisible && this.renderClassifyInfoView()}
        <Loading ref={ref => (this.Loading = ref)} initLoading={false} />
      </Container>
    )
  }
}
