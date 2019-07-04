import React from 'react'
import {
  ConstToolType,
  OpenData,
  layerManagerData,
} from '../../../../constants'
import NavigationService from '../../../NavigationService'
import {
  layersetting,
  layerThemeSetting,
  layerPlottingSetting,
  layerCollectionSetting,
  layerThemeSettings,
  layereditsetting,
  taggingData,
  scaleData,
  mscaleData,
  layerSettingCanVisit,
  layerSettingCanSelect,
  layerSettingCanEdit,
  layerSettingCanSnap,
  layerSettingCanNotVisit,
  layerSettingCanNotSelect,
  layerSettingCanNotSnap,
  layerSettingCanNotEdit,
} from './LayerToolbarData'
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  Text,
  // TextInput,
  TouchableHighlight,
} from 'react-native'
import ToolBarSectionList from '../../../workspace/components/ToolBar/ToolBarSectionList'
import styles from './styles'
import { SMap, DatasetType } from 'imobile_for_reactnative'
// import { Dialog } from '../../../../components'
import { color } from '../../../../styles'
import { screen, Toast, scaleSize, setSpText } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import constants from '../../../workspace/constants'
/** 工具栏类型 **/
const list = 'list'

export default class LayerManager_tolbar extends React.Component {
  props: {
    language: string,
    type?: string,
    containerProps?: Object,
    data: Array,
    layerdata?: Object,
    existFullMap: () => {},
    getLayers: () => {}, // 更新数据（包括其他界面）
    setCurrentLayer: () => {},
    onPress: () => {},
    onThisPress: () => {},
    updateTagging: () => {},
    getOverlayView: () => {},
    device: Object,
    layers: Object,
    user: Object,
    curUserBaseMaps: Array,
  }

  static defaultProps = {
    containerProps: {
      data: [],
      containerType: list,
    },
  }

  constructor(props) {
    super(props)
    this.height =
      props.containerProps.height >= 0
        ? props.containerProps.height
        : props.containerProps.containerType === list
          ? ConstToolType.HEIGHT[3]
          : ConstToolType.HEIGHT[1]
    this.state = {
      type: props.type, // 当前传入的类型
      containerType: props.containerProps.containerType,
      data: [],
      bottom: new Animated.Value(-screen.deviceHeight),
      boxHeight: new Animated.Value(this.height),
      showMenuDialog: false,
      listSelectable: false, // 列表是否可以选择（例如地图）
      isTouch: true,
      layerdata: props.layerdata || '',
      index: 0,
      // layerName: '',
    }
    this.isShow = false
    this.isBoxShow = true
  }

  getData = type => {
    let data = []
    let headerData = layerSettingCanVisit(this.props.language).concat(
      layerSettingCanSelect(this.props.language),
    )
    switch (type) {
      case ConstToolType.MAP_STYLE:
        data = layersetting(this.props.language)
        data[0].headers = headerData
        break
      case ConstToolType.MAP_THEME_STYLE:
        data = layerThemeSetting(this.props.language)
        data[0].headers = headerData
        break
      case ConstToolType.MAP_THEME_STYLES:
        data = layerThemeSettings(this.props.language)
        data[0].headers = headerData
        break
      case ConstToolType.PLOTTING:
        //如果是cad图层 单独处理，其他图层通采集图层
        // headerData = headerData
        // .concat(layerSettingCanEdit(this.props.language))
        // .concat(layerSettingCanSnap(this.props.language))
        data = layerPlottingSetting(this.props.language)
        data[0].headers = headerData
        break

      case ConstToolType.COLLECTION:
        //collection 单独处理
        headerData = headerData
          .concat(layerSettingCanEdit(this.props.language))
          .concat(layerSettingCanSnap(this.props.language))
        data = layerCollectionSetting(this.props.language)
        data[0].headers = headerData
        break
      case ConstToolType.MAP_EDIT_STYLE:
        data = layereditsetting(global.language)
        break
      case ConstToolType.MAP_EDIT_MORE_STYLE: {
        let layerManagerDataArr = [...layerManagerData]
        for (let i = 0, n = this.props.curUserBaseMaps.length; i < n; i++) {
          let baseMap = this.props.curUserBaseMaps[i]
          if (
            baseMap.DSParams.engineType === 227 ||
            baseMap.DSParams.engineType === 223
          ) {
            continue
          }
          let layerManagerData = {
            title: baseMap.mapName,
            action: () => {
              return OpenData(baseMap, baseMap.layerIndex)
            },
            data: [],
            image: require('../../../../assets/map/icon-shallow-image_black.png'),
            type: DatasetType.IMAGE,
            themeType: -1,
          }
          layerManagerDataArr.push(layerManagerData)
        }
        data = [
          {
            title: '',
            data: layerManagerDataArr,
          },
        ]
        break
      }
      //  let layerManagerDataArr = []
      //   for(let i=0,n=this.props.curUserBaseMaps.length;i<n;i++){
      //     let baseMap = this.props.curUserBaseMaps[i]
      //     let layerManagerData = {
      //       title:baseMap.mapName,
      //       action: () => {
      //         return OpenData(baseMap.DSParams, baseMap.layerIndex)
      //       },
      //       data: [],
      // image: require('../assets/map/icon-shallow-image_black.png'),
      // type: DatasetType.IMAGE,
      // themeType: -1,
      //     }
      //   }
      //     data = [
      //       {
      //         baseMaps:this.props.curUserBaseMaps,
      //         title:'',
      //         data:layerManagerData,
      //       },
      //     ]
      case ConstToolType.MAP_EDIT_TAGGING:
        data = taggingData(global.language)
        break
      case ConstToolType.MAP_SCALE:
        data = scaleData(this.props.language)
        break
      case ConstToolType.MAP_MAX_SCALE:
        data = mscaleData
        break
      case ConstToolType.MAP_MIN_SCALE:
        data = mscaleData
        break
    }
    return data
  }

  showToolbarAndBox = isShow => {
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      Animated.timing(this.state.bottom, {
        toValue: isShow ? 0 : -screen.deviceHeight,
        duration: 300,
      }).start()
      this.isShow = isShow
    }
    // Box内容框的显示和隐藏
    if (this.state.type === ConstToolType.MAP_THEME_PARAM) {
      Animated.timing(this.state.boxHeight, {
        toValue: 0,
        duration: 300,
      }).start()
      this.isBoxShow = false
    } else {
      if (JSON.stringify(this.state.boxHeight) !== this.height.toString()) {
        Animated.timing(this.state.boxHeight, {
          toValue: this.height,
          duration: 300,
        }).start()
      }
      this.isBoxShow = true
    }
  }

  showToolbar = isShow => {
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      Animated.timing(this.state.bottom, {
        toValue: isShow ? 0 : -screen.deviceHeight,
        duration: 300,
      }).start()
      this.isShow = isShow
    }
    // Box内容框的显示和隐藏
    if (JSON.stringify(this.state.boxHeight) !== this.height.toString()) {
      Animated.timing(this.state.boxHeight, {
        toValue: this.height,
        duration: 300,
      }).start()
    }
  }

  /**
   * 设置是否显示
   * isShow: 是否显示
   * type:   显示数据类型
   * params: {
   *   isFullScreen:    是否全屏，
   *   height:          工具栏高度
   *   column:          表格列数（仅table可用）
   *   containerType:   容器的类型, list | table
   * }
   **/
  setVisible = (isShow, type, params = {}) => {
    this.height =
      params && typeof params.height === 'number'
        ? params.height
        : ConstToolType.HEIGHT[1]
    let data = this.getData(type)
    this.setState(
      {
        data: data,
        type: type,
        layerdata: params.layerdata,
        index: params.index,
      },
      () => {
        this.showToolbarAndBox(isShow)
        !isShow && this.props.existFullMap && this.props.existFullMap()
        this.updateMenuState()
        this.updateOverlayerView()
      },
    )
  }

  /**
   * 设置遮罩层的显隐
   * @param visible
   */
  setOverlayViewVisible = visible => {
    GLOBAL.LayerManagerOverlayView &&
      GLOBAL.LayerManagerOverlayView.setVisible(visible)
  }

  //更新菜单按钮状态
  updateMenuState = () => {
    let layerdata = this.state.layerdata
    let data = this.state.data
    if (data && data[0] && data[0].headers && GLOBAL.Type !== 'MAP_3D') {
      let tempheader0 = layerdata.isVisible
        ? layerSettingCanVisit(this.props.language)
        : layerSettingCanNotVisit(this.props.language)
      let tempheader1 = layerdata.isSelectable
        ? layerSettingCanSelect(this.props.language)
        : layerSettingCanNotSelect(this.props.language)
      data[0].headers = tempheader0.concat(tempheader1)
      if (GLOBAL.Type === 'COLLECTION') {
        let tempheader2 = layerdata.isEditable
          ? layerSettingCanEdit(this.props.language)
          : layerSettingCanNotEdit(this.props.language)
        let tempheader3 = layerdata.isSnapable
          ? layerSettingCanSnap(this.props.language)
          : layerSettingCanNotSnap(this.props.language)
        data[0].headers = data[0].headers.concat(tempheader2, tempheader3)
      }
      this.setState({
        data,
      })
    }
  }

  //更新遮盖层状态
  updateOverlayerView = () => {
    this.setOverlayViewVisible(this.isShow)
  }

  mapStyle = async () => {
    if (this.props.onPress) {
      await this.props.onPress({
        data: this.state.layerdata,
      })
    } else return
  }

  setThislayer = async () => {
    if (this.props.onThisPress) {
      await this.props.onThisPress({
        data: this.state.layerdata,
      })
    } else return
  }

  updateTagging = async () => {
    if (this.props.updateTagging) {
      await this.props.updateTagging({
        index: this.state.index,
      })
    } else return
  }

  listAction = ({ section }) => {
    if (section.action) {
      (async function() {
        await section.action()
        this.props.getLayers()
        this.setVisible(false)
      }.bind(this)())
    }
    if (
      section.title === getLanguage(global.language).Map_Layer.LAYERS_REMOVE
    ) {
      //'移除'
      (async function() {
        await SMap.removeLayer(this.state.layerdata.path)
        await this.props.getLayers()
      }.bind(this)())
      this.setVisible(false)
    } else if (
      section.title ===
      getLanguage(global.language).Map_Layer.LAYERS_FULL_VIEW_LAYER
    ) {
      //'全幅显示当前图层') {
      this.setVisible(false)
      SMap.setLayerFullView(this.state.layerdata.path)
      // eslint-disable-next-line react/prop-types
      this.props.navigation.navigate(
        GLOBAL.Type === constants.MAP_ANALYST ? 'MapAnalystView' : 'MapView',
      )
    } else if (
      section.title === getLanguage(global.language).Map_Layer.BASEMAP_SWITH
    ) {
      //'切换底图') {
      this.setVisible(true, ConstToolType.MAP_EDIT_MORE_STYLE, {
        height: ConstToolType.TOOLBAR_HEIGHT[5],
        layerdata: this.state.layerdata,
      })
    } else if (
      section.title ===
      getLanguage(global.language).Map_Layer.LAYERS_LAYER_STYLE
    ) {
      // '图层风格'
      this.mapStyle()
      this.setVisible(false)
    } else if (
      section.title ===
      getLanguage(global.language).Map_Layer.LAYERS_SET_VISIBLE_SCALE
    ) {
      //'可见比例尺范围'
      this.setVisible(true, ConstToolType.MAP_SCALE, {
        height: ConstToolType.TOOLBAR_HEIGHT[1],
        layerdata: this.state.layerdata,
      })
    } else if (
      section.title === getLanguage(global.language).Map_Layer.LAYERS_MAXIMUM
    ) {
      //'最大可见比例尺') {
      this.setVisible(true, ConstToolType.MAP_MAX_SCALE, {
        height: ConstToolType.TOOLBAR_HEIGHT[6],
        layerdata: this.state.layerdata,
      })
    } else if (
      section.title === getLanguage(global.language).Map_Layer.LAYERS_MINIMUM
    ) {
      //'最小可见比例尺') {
      this.setVisible(true, ConstToolType.MAP_MIN_SCALE, {
        height: ConstToolType.TOOLBAR_HEIGHT[6],
        layerdata: this.state.layerdata,
      })
    } else if (section.title === '1:5,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.path, 5000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.path, 5000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:10,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.path, 10000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.path, 10000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:25,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.path, 25000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.path, 25000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:50,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.path, 50000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.path, 50000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:100,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.path, 100000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.path, 100000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:250,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.path, 250000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.path, 250000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:500,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.path, 500000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.path, 500000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (section.title === '1:1,000,000') {
      (async function() {
        if (this.state.type === ConstToolType.MAP_MIN_SCALE) {
          await SMap.setMinVisibleScale(this.state.layerdata.path, 1000000)
          this.setVisible(false)
        } else {
          await SMap.setMaxVisibleScale(this.state.layerdata.path, 1000000)
          this.setVisible(false)
        }
      }.bind(this)())
    } else if (
      section.title === getLanguage(global.language).Map_Layer.LAYERS_RENAME
    ) {
      //'重命名') {
      NavigationService.navigate('InputPage', {
        headerTitle: getLanguage(global.language).Map_Layer.LAYERS_LAYER_NAME,
        //'图层名称',
        value: this.state.layerdata ? this.state.layerdata.caption : '',
        cb: async value => {
          if (value !== '') {
            (async function() {
              await SMap.renameLayer(this.state.layerdata.path, value)
              await this.props.getLayers()
            }.bind(this)())
          }
          await this.setVisible(false)
          NavigationService.goBack()
        },
      })
      // this.dialog.setDialogVisible(true)
    }
    // else if (
    //   section.title === getLanguage(global.language).Map_Layer.LAYERS_MOVE_UP
    // ) {
    //   //''上移') {
    //   (async function() {
    //     await SMap.moveUpLayer(this.state.layerdata.name)
    //     await this.props.getLayers()
    //   }.bind(this)())
    // } else if (
    //   section.title === getLanguage(global.language).Map_Layer.LAYERS_MOVE_DOWN
    // ) {
    //   //''下移') {
    //   (async function() {
    //     await SMap.moveDownLayer(this.state.layerdata.name)
    //     await this.props.getLayers()
    //   }.bind(this)())
    // } else if (
    //   section.title === getLanguage(global.language).Map_Layer.LAYERS_TOP
    // ) {
    //   //''置顶') {
    //   (async function() {
    //     await SMap.moveToTop(this.state.layerdata.name)
    //     let count = await SMap.getTaggingLayerCount(
    //       this.props.user.currentUser.userName,
    //     )
    //     for (let i = 0; i < count; i++) {
    //       await SMap.moveDownLayer(this.state.layerdata.name)
    //     }
    //     await this.props.getLayers()
    //     this.setVisible(false)
    //   }.bind(this)())
    // } else if (
    //   section.title === getLanguage(global.language).Map_Layer.LAYERS_BOTTOM
    // ) {
    //   //''置底') {
    //   (async function() {
    //     await SMap.moveToBottom(this.state.layerdata.name)
    //   }.bind(this)())
    //   SMap.moveUpLayer(this.state.layerdata.name)
    //   if (
    //     this.props.layers[this.props.layers.length - 1].name.indexOf(
    //       'vec@TD',
    //     ) >= 0
    //   ) {
    //     SMap.moveUpLayer(this.state.layerdata.name)
    //   }
    //   this.props.getLayers()
    //   this.setVisible(false)
    // }
    else if (
      section.title ===
      getLanguage(global.language).Map_Layer.PLOTS_SET_AS_CURRENT
    ) {
      //'设置为当前标注'
      (async function() {
        GLOBAL.TaggingDatasetName = await SMap.getCurrentTaggingDataset(
          this.state.layerdata.path,
        )
        this.updateTagging()
        this.setVisible(false)
      }.bind(this)())
    } else if (
      section.title ===
      getLanguage(global.language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER
    ) {
      //'设置为当前图层'
      this.props.setCurrentLayer &&
        this.props.setCurrentLayer(this.state.layerdata)
      this.setThislayer()
      Toast.show(
        //'当前图层为'
        getLanguage(global.language).Prompt.THE_CURRENT_LAYER +
          '  ' +
          this.state.layerdata.caption,
      )
      this.setVisible(false)
    } else if (
      section.title ===
      getLanguage(global.language).Map_Layer.LAYERS_MODIFY_THEMATIC_MAP
    ) {
      //'修改专题图') {
      this.mapStyle()
      this.setVisible(false)
    } else if (
      section.title ===
      getLanguage(global.language).Map_Layer.LAYERS_CREATE_THEMATIC_MAP
    ) {
      //'新建专题图') {
      let themeType = this.state.layerdata.themeType
      let type = this.state.layerdata.type
      if (parseInt(themeType) > 0) {
        Toast.show(
          getLanguage(global.language).Prompt.LAYER_CANNOT_CREATE_THEMATIC_MAP,
          //'不支持由该图层创建专题图'
        )
      } else if (
        parseInt(type) === 1 ||
        parseInt(type) === 3 ||
        parseInt(type) === 5 ||
        parseInt(type) === 83
      ) {
        //由图层创建专题图(点，线，面, 栅格)
        this.setVisible(false)
        GLOBAL.toolBox &&
          GLOBAL.toolBox.setVisible(
            true,
            ConstToolType.MAP_THEME_CREATE_BY_LAYER,
            {
              isFullScreen: true,
              column: this.props.device.orientation === 'LANDSCAPE' ? 8 : 4,
              height:
                this.props.device.orientation === 'LANDSCAPE'
                  ? ConstToolType.THEME_HEIGHT[4]
                  : ConstToolType.THEME_HEIGHT[10],
              createThemeByLayer: this.state.layerdata.path,
            },
          )
        GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
        // eslint-disable-next-line react/prop-types
        this.props.navigation.navigate('MapView')
      } else {
        Toast.show(
          getLanguage(global.language).Prompt.LAYER_CANNOT_CREATE_THEMATIC_MAP,
          //'不支持由该图层创建专题图'
        )
      }
    }
  }

  //header点击事件
  headerAction = ({ item }) => {
    let layerdata = JSON.parse(JSON.stringify(this.state.layerdata))
    let rel
    switch (item.title) {
      case getLanguage(this.props.language).Map_Layer.VISIBLE:
      case getLanguage(this.props.language).Map_Layer.NOT_VISIBLE:
        layerdata.isVisible = !layerdata.isVisible
        rel = SMap.setLayerVisible(layerdata.path, layerdata.isVisible)
        break
      case getLanguage(this.props.language).Map_Layer.EDITABLE:
      case getLanguage(this.props.language).Map_Layer.NOT_EDITABLE:
        layerdata.isEditable = !layerdata.isEditable
        rel = SMap.setLayerEditable(layerdata.path, layerdata.isEditable)
        break
      case getLanguage(this.props.language).Map_Layer.SNAPABLE:
      case getLanguage(this.props.language).Map_Layer.NOT_SNAPABLE:
        layerdata.isSnapable = !layerdata.isSnapable
        rel = SMap.setLayerSnapable(layerdata.path, layerdata.isSnapable)
        break
      case getLanguage(this.props.language).Map_Layer.OPTIONAL:
      case getLanguage(this.props.language).Map_Layer.NOT_OPTIONAL:
        layerdata.isSelectable = !layerdata.isSelectable
        rel = SMap.setLayerSelectable(layerdata.path, layerdata.isSelectable)
        break
    }
    rel.then(isSuccess => {
      if (isSuccess) {
        this.setState(
          {
            layerdata,
          },
          () => {
            this.updateMenuState()
            this.props.getLayers()
            Toast.show(getLanguage(global.language).Prompt.SETTING_SUCCESS)
          },
          () => {
            Toast.show(getLanguage(global.language).Prompt.SETTING_FAILED)
          },
        )
      } else {
        Toast.show(getLanguage(global.language).Prompt.SETTING_FAILED)
      }
    })
    this.setVisible(false)
    let overlayView = this.props.getOverlayView
      ? this.props.getOverlayView()
      : null
    if (overlayView) {
      overlayView.setVisible(false)
    }
  }
  renderList = () => {
    if (this.state.data.length === 0) return
    return (
      <ToolBarSectionList
        sections={this.state.data}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderHeader}
        layerManager={true}
      />
    )
  }

  renderHeader = ({ section }) => {
    if (!section.headers) {
      return <View style={{ height: 0 }} />
    }
    return (
      <View
        style={{
          height: scaleSize(86),
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: color.bgW,
        }}
      >
        {section.headers.map((item, index) => {
          if (this.state.layerdata.themeType === 7 && index === 1) {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
                activeOpacity={1}
              >
                <Image
                  source={item.image}
                  style={{
                    width: scaleSize(60),
                    height: scaleSize(60),
                  }}
                />
              </TouchableOpacity>
            )
          }
          return (
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
              }}
              key={index}
              onPress={() => this.headerAction({ item, index, section })}
            >
              <Image
                source={item.image}
                style={{
                  width: scaleSize(60),
                  height: scaleSize(60),
                }}
              />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            this.listAction({ section: item })
          }}
          underlayColor={color.headerBackground}
        >
          <View
            style={{
              height: scaleSize(86),
              backgroundColor: color.content_white,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {item.image && (
              <Image
                resizeMode={'contain'}
                style={{
                  marginLeft: scaleSize(60),
                  height: scaleSize(60),
                  width: scaleSize(60),
                }}
                source={item.image}
              />
            )}
            <Text
              style={{
                fontSize: setSpText(24),
                marginLeft: scaleSize(60),
                textAlign: 'center',
                backgroundColor: 'transparent',
              }}
            >
              {item.title}
            </Text>
          </View>
        </TouchableHighlight>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            height: 1,
            backgroundColor: color.bgG,
          }}
        />
      </View>
    )
  }

  renderView = () => {
    let box
    switch (this.state.containerType) {
      case list:
        switch (this.state.type) {
          case ConstToolType.MAP_SCALE:
          case ConstToolType.MAP_MAX_SCALE:
          case ConstToolType.MAP_MIN_SCALE:
          case ConstToolType.MAP_EDIT_TAGGING:
          case ConstToolType.MAP_STYLE:
          case ConstToolType.MAP_THEME_STYLE:
          case ConstToolType.MAP_THEME_STYLES:
          case ConstToolType.COLLECTION:
          case ConstToolType.PLOTTING:
          case ConstToolType.MAP_EDIT_STYLE:
          case ConstToolType.MAP_EDIT_MORE_STYLE:
            box = this.renderList()
            break
        }
        break
    }
    return (
      <Animated.View style={{ height: this.state.boxHeight }}>
        {box}
      </Animated.View>
    )
  }

  // confirm = () => {
  //   this.dialog.setDialogVisible(false)
  //   this.setState({
  //     layerName: '',
  //   })
  // }
  //
  // cancel = () => {
  //   if (this.state.layerName !== '') {
  //     (async function() {
  //       await SMap.renameLayer(this.state.layerdata.name, this.state.layerName)
  //       await this.props.getLayers()
  //     }.bind(this)())
  //   }
  //   this.dialog.setDialogVisible(false)
  //   this.setVisible(false)
  //   this.setState({
  //     layerName: '',
  //   })
  // }

  // renderDialog = () => {
  //   return (
  //     <Dialog
  //       ref={ref => (this.dialog = ref)}
  //       showDialog={true}
  //       confirmAction={this.confirm}
  //       cancelAction={this.cancel}
  //       confirmBtnTitle={'取消'}
  //       cancelBtnTitle={'确认'}
  //     >
  //       <View style={styles.item}>
  //         <Text style={styles.title}>图层名称</Text>
  //         <TextInput
  //           underlineColorAndroid={'transparent'}
  //           accessible={true}
  //           accessibilityLabel={'图层名称'}
  //           onChangeText={text => {
  //             this.setState({
  //               layerName: text,
  //             })
  //           }}
  //           placeholderTextColor={color.themeText2}
  //           defaultValue={
  //             this.state.layerdata ? this.state.layerdata.caption : ''
  //           }
  //           placeholder={'请输入图层名称'}
  //           keyboardAppearance="dark"
  //           style={styles.textInputStyle}
  //         />
  //       </View>
  //     </Dialog>
  //   )
  // }

  render() {
    let containerStyle = styles.fullContainer
    return (
      <Animated.View style={[containerStyle, { bottom: this.state.bottom }]}>
        {
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.setVisible(false)
              let overlayView = this.props.getOverlayView
                ? this.props.getOverlayView()
                : null
              if (overlayView) {
                overlayView.setVisible(false)
              }
            }}
            style={styles.overlay}
          />
        }
        <View style={styles.containers}>{this.renderView()}</View>
        {/*{this.renderDialog()}*/}
      </Animated.View>
    )
  }
}
