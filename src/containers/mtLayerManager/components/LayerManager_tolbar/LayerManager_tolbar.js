import React from 'react'
import {
  ConstToolType,
  OpenData,
  layerManagerData,
  ConstPath,
  UserType,
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
  getVisibleScalePickerData,
  layerNavigationSetting,
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
import ToolBarSectionList from '../../../workspace/components/ToolBar/components/ToolBarSectionList'
import styles from './styles'
import { SMap, DatasetType, SMCollectorType } from 'imobile_for_reactnative'
// import { Dialog } from '../../../../components'
import { color } from '../../../../styles'
import { screen, Toast, scaleSize, setSpText } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { FileTools } from '../../../../../src/native'
import { MsgConstant } from '../../../../containers/tabs/Friend'
import ToolbarModule from '../../../workspace/components/ToolBar/modules/ToolbarModule'
import { themeModule } from '../../../workspace/components/ToolBar/modules'
import { MultiPicker } from '../../../../components'

import collectionModule from '../../../../containers/workspace/components/ToolBar/modules/collectionModule'
import DataHandler from '../../../tabs/Mine/DataHandler'
/** 工具栏类型 **/
const list = 'list'

export default class LayerManager_tolbar extends React.Component {
  props: {
    language: string,
    type?: string,
    containerProps?: Object,
    data: Array,
    layerData?: Object,
    existFullMap: () => {},
    getLayers: () => {}, // 更新数据（包括其他界面）
    setCurrentLayer: () => {},
    onPress: () => {},
    onThisPress: () => {},
    updateTagging: () => {},
    getOverlayView: () => {},
    updateData?: () => {},
    device: Object,
    // layers: Object,
    user: Object,
    navigation: Object,
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
      layerData: props.layerData || '',
      index: 0,
      // layerName: '',
      layerVisibleScaleData: [],
    }
    this.isShow = false
    this.isBoxShow = true
    this.refreshParentList = null // 当前选中图层如果是图层组中的子图层，则刷新该子图层的图层组列表
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    ) {
      return true
    }
    return false
  }
  componentDidUpdate() {
    this.getHeight()
  }
  getHeight = () => {
    let device = this.props.device
    let boxHeight
    if (this.state.isGroup) {
      boxHeight = ConstToolType.TOOLBAR_HEIGHT[3]
    } else {
      switch (this.state.type) {
        case ConstToolType.MAP_STYLE:
        case ConstToolType.MAP_THEME_STYLE:
        case ConstToolType.MAP_THEME_STYLES:
          if (device.orientation === 'LANDSCAPE') {
            boxHeight = ConstToolType.TOOLBAR_HEIGHT[3]
          } else {
            boxHeight = ConstToolType.TOOLBAR_HEIGHT[7]
          }
          break
        case ConstToolType.PLOTTING:
        case ConstToolType.MAP_EDIT_MORE_STYLE:
          if (device.orientation === 'LANDSCAPE') {
            boxHeight = ConstToolType.TOOLBAR_HEIGHT[2]
          } else {
            boxHeight = ConstToolType.TOOLBAR_HEIGHT[4]
          }
          break
        case ConstToolType.COLLECTION:
        case ConstToolType.MAP_NAVIGATION:
          if (device.orientation === 'LANDSCAPE') {
            boxHeight = ConstToolType.TOOLBAR_HEIGHT[2]
          } else {
            boxHeight = ConstToolType.TOOLBAR_HEIGHT[6]
          }
          break
        case ConstToolType.MAP_MAX_SCALE:
        case ConstToolType.MAP_MIN_SCALE:
          if (device.orientation === 'LANDSCAPE') {
            boxHeight = ConstToolType.TOOLBAR_HEIGHT[3]
          } else {
            boxHeight = ConstToolType.TOOLBAR_HEIGHT[5]
          }
          break
        case ConstToolType.MAP_SCALE:
          boxHeight = ConstToolType.TOOLBAR_HEIGHT_2[3]
          break
        case ConstToolType.MAP_EDIT_STYLE:
          boxHeight = ConstToolType.TOOLBAR_HEIGHT[1]
          break
        case ConstToolType.MAP_EDIT_TAGGING:
          boxHeight = ConstToolType.TOOLBAR_HEIGHT[2]
          break
        default:
          boxHeight = ConstToolType.TOOLBAR_HEIGHT[0]
          break
      }
    }
    this.height = boxHeight
  }
  getData = (type, isGroup = false, layerData) => {
    let data = []
    let headerData = layerSettingCanVisit(this.props.language)
    !isGroup && headerData.concat(layerSettingCanSelect(this.props.language))
    switch (type) {
      case ConstToolType.MAP_STYLE:
        data = layersetting(this.props.language, isGroup)
        data[0].headers = headerData
        break
      case ConstToolType.MAP_THEME_STYLE:
        data = layerThemeSetting(this.props.language, isGroup)
        data[0].headers = headerData
        break
      case ConstToolType.MAP_THEME_STYLES:
        data = layerThemeSettings(this.props.language, isGroup)
        data[0].headers = headerData
        break
      case ConstToolType.PLOTTING:
        //如果是cad图层 单独处理，其他图层通采集图层
        // headerData = headerData
        // .concat(layerSettingCanEdit(this.props.language))
        // .concat(layerSettingCanSnap(this.props.language))
        data = layerPlottingSetting(this.props.language, isGroup)
        data[0].headers = headerData
        break
      case ConstToolType.MAP_NAVIGATION:
        headerData = headerData.concat(layerSettingCanEdit(this.props.language))
        data = layerNavigationSetting(this.props.language, isGroup)
        data[0].headers = headerData
        break
      case ConstToolType.COLLECTION:
        //collection 单独处理
        headerData = headerData
          .concat(layerSettingCanEdit(this.props.language))
          .concat(layerSettingCanSnap(this.props.language))
        data = layerCollectionSetting(this.props.language, isGroup, layerData)
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
   *   layerData:       图层数据
   * }
   **/
  setVisible = (isShow, type, params = {}) => {
    this.height =
      params && typeof params.height === 'number'
        ? params.height
        : ConstToolType.HEIGHT[1]
    let newState = {}
    let isGroup = false
    if (isShow) {
      isGroup =
        params.layerData &&
        params.layerData.type &&
        params.layerData.type === 'layerGroup'
      let data = this.getData(type, isGroup, params.layerData)
      newState = this.updateMenuState(data, params.layerData)
    }
    if (isShow) {
      this.refreshParentList = params.refreshParentList
    }
    this.setState(
      {
        type: type,
        index: params.index,
        isGroup,
        ...newState,
      },
      () => {
        this.showToolbarAndBox(isShow)
        !isShow && this.props.existFullMap && this.props.existFullMap()
        // this.updateMenuState()
        this.updateOverlayView()
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
  updateMenuState = (data, layerData) => {
    let newState = { layerData }
    if (data && data[0] && data[0].headers && GLOBAL.Type !== 'MAP_3D') {
      let tempheader0 = layerData.isVisible
        ? layerSettingCanVisit(this.props.language)
        : layerSettingCanNotVisit(this.props.language)
      let tempheader1 = layerData.isSelectable
        ? layerSettingCanSelect(this.props.language)
        : layerSettingCanNotSelect(this.props.language)
      if (
        layerData.type === 'layerGroup' ||
        layerData.type === DatasetType.IMAGE ||
        layerData.type === DatasetType.MBImage
      ) {
        tempheader1 = layerSettingCanNotSelect(this.props.language)
      }
      data[0].headers = tempheader0.concat(tempheader1)
      if (GLOBAL.Type === 'COLLECTION') {
        let tempheader2 = layerData.isEditable
          ? layerSettingCanEdit(this.props.language)
          : layerSettingCanNotEdit(this.props.language)
        let tempheader3 = layerData.isSnapable
          ? layerSettingCanSnap(this.props.language)
          : layerSettingCanNotSnap(this.props.language)
        data[0].headers = data[0].headers.concat(tempheader2, tempheader3)
      }
    }
    newState.data = data
    return newState
  }

  //更新遮盖层状态
  updateOverlayView = () => {
    this.setOverlayViewVisible(this.isShow)
  }

  mapStyle = async () => {
    if (this.props.onPress) {
      await this.props.onPress({
        data: this.state.layerData,
      })
    } else return
  }

  _refreshParentList = async () => {
    if (
      this.refreshParentList &&
      typeof this.refreshParentList === 'function'
    ) {
      await this.refreshParentList()
    }
  }

  setThislayer = async () => {
    if (this.props.onThisPress) {
      await this.props.onThisPress({
        data: this.state.layerData,
      })
      // 无论是否是图层组中的图层，都调用refreshParentList刷新，若之前的是子图层，则刷新图层组，若不是，则不刷新
      this._refreshParentList()
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
        await SMap.removeLayer(this.state.layerData.path)
        await this.props.getLayers()
        await this._refreshParentList()
      }.bind(this)())
      this.setVisible(false)
    } else if (
      section.title ===
      getLanguage(global.language).Map_Layer.LAYERS_FULL_VIEW_LAYER
    ) {
      //'全幅显示当前图层') {
      this.setVisible(false)
      SMap.setLayerFullView(this.state.layerData.path)
      this.props.navigation.navigate('MapView')
    } else if (
      section.title === getLanguage(global.language).Map_Layer.BASEMAP_SWITH
    ) {
      //'切换底图') {
      this.setVisible(true, ConstToolType.MAP_EDIT_MORE_STYLE, {
        height: ConstToolType.TOOLBAR_HEIGHT[5],
        layerData: this.state.layerData,
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
      (async function() {
        await this.setVisibleScalePickerData()
        this.setVisible(true, ConstToolType.MAP_SCALE, {
          layerData: this.state.layerData,
        })
      }.bind(this)())
    } else if (
      section.title === getLanguage(global.language).Map_Layer.LAYERS_COLLECT
    ) {
      if (
        this.state.layerData.themeType > 0 ||
        this.state.layerData.isHeatmap
      ) {
        Toast.show(
          global.language === 'CN'
            ? '专题图层不能采集'
            : 'Cannot collect in Thematic layers',
        )
      } else {
        let type = ''
        switch (this.state.layerData.type) {
          case 1:
            type = SMCollectorType.POINT_HAND
            break
          case 3:
            type = SMCollectorType.LINE_HAND_POINT
            break
          case 5:
            type = SMCollectorType.REGION_HAND_POINT
            break
        }
        this.props.setCurrentLayer &&
          this.props.setCurrentLayer(this.state.layerData)
        collectionModule().actions.showCollection(
          type,
          this.state.layerData.name,
        )
        this.setVisible(false)
        this.props.navigation.navigate('MapView')
      }
    } else if (
      section.title === getLanguage(global.language).Map_Layer.LAYERS_RENAME
    ) {
      //'重命名') {
      NavigationService.navigate('InputPage', {
        headerTitle: getLanguage(global.language).Map_Layer.LAYERS_LAYER_NAME,
        //'图层名称',
        value: this.state.layerData ? this.state.layerData.caption : '',
        type: 'name',
        cb: async value => {
          if (value !== '') {
            (async function() {
              await SMap.renameLayer(this.state.layerData.path, value)
              await this.props.getLayers()
              await this._refreshParentList()
            }.bind(this)())
          }
          await this.setVisible(false)
          NavigationService.goBack()
        },
      })
      // this.dialog.setDialogVisible(true)
    } else if (
      section.title ===
      getLanguage(global.language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER
    ) {
      //'设置为当前图层'
      (async function() {
        await SMap.setLayerVisible(this.state.layerData.path, true)
        await SMap.setLayerEditable(this.state.layerData.path, true)
        let newState = this.updateMenuState(
          this.state.data,
          this.state.layerData,
        )
        this.setState(newState, async () => {
          // this.props.updateData && (await this.props.updateData())
          this.props.setCurrentLayer &&
            this.props.setCurrentLayer(this.state.layerData)
          this.setThislayer()
        })
        Toast.show(
          //'当前图层为'
          getLanguage(global.language).Prompt.THE_CURRENT_LAYER +
            '  ' +
            this.state.layerData.caption,
        )
        this.setVisible(false)
      }.bind(this)())
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
      let themeType = this.state.layerData.themeType
      let type = this.state.layerData.type
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
              createThemeByLayer: this.state.layerData.path,
            },
          )
        GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
        ToolbarModule.setData({
          type: ConstToolType.MAP_THEME_CREATE_BY_LAYER,
          getData: themeModule().getData,
          actions: themeModule().actions,
          currentLayer: this.state.layerData,
        })
        this.props.navigation.navigate('MapView')
      } else {
        Toast.show(
          getLanguage(global.language).Prompt.LAYER_CANNOT_CREATE_THEMATIC_MAP,
          //'不支持由该图层创建专题图'
        )
      }
    } else if (
      section.title === getLanguage(global.language).Map_Layer.LAYERS_SHARE
    ) {
      //分享图层
      //this.setVisible(true, 'Share', { layerData: this.state.layerData })
      this._onShare('friend')
    }
  }

  //header点击事件
  headerAction = ({ item }) => {
    (async function() {
      let layerData = JSON.parse(JSON.stringify(this.state.layerData))
      let rel
      switch (item.title) {
        case getLanguage(this.props.language).Map_Layer.VISIBLE:
        case getLanguage(this.props.language).Map_Layer.NOT_VISIBLE:
          layerData.isVisible = !layerData.isVisible
          rel = await SMap.setLayerVisible(layerData.path, layerData.isVisible)
          break
        case getLanguage(this.props.language).Map_Layer.EDITABLE:
        case getLanguage(this.props.language).Map_Layer.NOT_EDITABLE:
          layerData.isEditable = !layerData.isEditable
          rel = await SMap.setLayerEditable(
            layerData.path,
            layerData.isEditable,
          )
          break
        case getLanguage(this.props.language).Map_Layer.SNAPABLE:
        case getLanguage(this.props.language).Map_Layer.NOT_SNAPABLE:
          layerData.isSnapable = !layerData.isSnapable
          rel = await SMap.setLayerSnapable(
            layerData.path,
            layerData.isSnapable,
          )
          break
        case getLanguage(this.props.language).Map_Layer.OPTIONAL:
        case getLanguage(this.props.language).Map_Layer.NOT_OPTIONAL:
          layerData.isSelectable = !layerData.isSelectable
          rel = await SMap.setLayerSelectable(
            layerData.path,
            layerData.isSelectable,
          )
          break
      }
      if (rel) {
        let newState = this.updateMenuState(this.state.data, layerData)
        this.setState(
          newState,
          () => {
            if (layerData.groupName) {
              if (
                this.refreshParentList &&
                typeof this.refreshParentList === 'function'
              ) {
                this.refreshParentList()
              }
            } else {
              this.props.updateData && this.props.updateData()
            }
            Toast.show(getLanguage(global.language).Prompt.SETTING_SUCCESS)
          },
          () => {
            Toast.show(getLanguage(global.language).Prompt.SETTING_FAILED)
          },
        )
      } else {
        Toast.show(getLanguage(global.language).Prompt.SETTING_FAILED)
      }
    }.bind(this)())
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
    let layerData = this.state.layerData
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
          if (
            (layerData.themeType === 7 ||
              layerData.type === 'layerGroup' ||
              layerData.type === DatasetType.IMAGE ||
              layerData.type === DatasetType.MBImage) &&
            index === 1
          ) {
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
        {/*<View*/}
        {/*style={{*/}
        {/*flexDirection: 'column',*/}
        {/*width: '100%',*/}
        {/*height: 1,*/}
        {/*backgroundColor: color.bgG,*/}
        {/*}}*/}
        {/*/>*/}
      </View>
    )
  }

  _onShare = async type => {
    if (!UserType.isOnlineUser(this.props.user.currentUser)) {
      Toast.show(getLanguage(global.language).Prompt.PLEASE_LOGIN_AND_SHARE)
      return
    }
    //Toast.show(getLanguage(global.language).Prompt.SHARE_PREPARE)
    let layerData = JSON.parse(JSON.stringify(this.state.layerData))
    this.setVisible(false)
    if (
      layerData.type !== DatasetType.CAD &&
      layerData.type !== DatasetType.POINT &&
      layerData.type !== DatasetType.LINE &&
      layerData.type !== DatasetType.REGION
    ) {
      Toast.show(getLanguage(global.language).Prompt.UNSUPPORTED_LAYER_TO_SHARE)
      return
    }
    if (type === 'friend') {
      let targetUser = ''
      let Chat
      if (GLOBAL.coworkMode) {
        Chat = GLOBAL.getFriend().curChat
        targetUser = Chat.targetUser
      }
      NavigationService.navigate('SelectFriend', {
        user: this.props.user,
        type: 'ShareFromLayer',
        layerData: this.state.layerData,
        targetUser: targetUser,
        callBack: async (targetUser, shareDataset, sendFile) => {
          global.Loading.setLoading(
            true,
            getLanguage(global.language).Prompt.SHARING,
          )

          let homePath = await FileTools.appendingHomeDirectory()
          let tempPath =
            homePath +
            ConstPath.UserPath +
            this.props.user.currentUser.userName +
            '/' +
            ConstPath.RelativePath.Temp

          let targetPath = tempPath + layerData.name + '.xml'
          let exportName = await DataHandler.getAvailableFileName(
            tempPath,
            'MyExportLayer',
            'zip',
          )
          let zipPath = tempPath + exportName
          let xmlLayer = await SMap.getLayerAsXML(layerData.path)
          if (await FileTools.fileIsExist(targetPath)) {
            await FileTools.deleteFile(targetPath)
          }
          await FileTools.writeFile(targetPath, xmlLayer)
          await FileTools.zipFile(targetPath, zipPath)
          FileTools.deleteFile(targetPath)

          let layerAction = {
            name: 'onSendFile',
            type: MsgConstant.MSG_LAYER,
            filePath: zipPath,
            fileName: layerData.caption,
          }
          let action = [layerAction]

          if (shareDataset) {
            let datasetPath = tempPath + layerData.datasetName + '.json'
            let exportDatasetName = await DataHandler.getAvailableFileName(
              tempPath,
              'MyExportDataset',
              'zip',
            )
            let datasetZipPath = tempPath + exportDatasetName
            await SMap.getDatasetToGeoJson(
              layerData.datasourceAlias,
              layerData.datasetName,
              datasetPath,
            )
            await FileTools.zipFile(datasetPath, datasetZipPath)
            FileTools.deleteFile(datasetPath)
            let datasetAction = {
              name: 'onSendFile',
              type: MsgConstant.MSG_DATASET,
              filePath: datasetZipPath,
              fileName: layerData.datasetName,
              extraInfo: {
                datasourceAlias: layerData.datasourceAlias,
              },
            }
            action.push(datasetAction)
          }
          if (GLOBAL.coworkMode) {
            Chat = GLOBAL.getFriend().curChat
            Chat._handleAciton(action)
          } else {
            action.map(item => {
              sendFile && sendFile(item)
            })
          }
          global.Loading.setLoading(false)
          NavigationService.goBack()
        },
      })
    }
  }

  renderView = () => {
    let box
    switch (this.state.containerType) {
      case list:
        switch (this.state.type) {
          case ConstToolType.MAP_SCALE:
            box = this.renderPiker()
            break
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
          case ConstToolType.MAP_NAVIGATION:
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

  renderPiker = () => {
    return (
      <MultiPicker
        ref={ref => (this.picker = ref)}
        language={GLOBAL.language}
        confirm={async item => {
          let min = item[0].selectedItem.value
          let max = item[1].selectedItem.value
          if (min !== 0 && max !== 0 && min <= max) {
            //最大比例尺必须大于最小比例尺
            Toast.show(
              getLanguage(this.props.language).Map_Layer
                .LAYER_SCALE_RANGE_WRONG,
            )
            return
          }
          for (let i = 0; i < item.length; i++) {
            if (item[i].selectedItem.key !== item[i].initItem.key) {
              if (item[i].value === '最大可见比例尺') {
                await SMap.setMaxVisibleScale(
                  this.state.layerData.path,
                  item[i].selectedItem.value,
                )
              } else {
                await SMap.setMinVisibleScale(
                  this.state.layerData.path,
                  item[i].selectedItem.value,
                )
              }
            }
          }
          this.setVisible(false)
        }}
        cancel={() => {
          this.setVisible(false)
        }}
        popData={this.state.layerVisibleScaleData}
        viewableItems={3}
      />
    )
  }

  setVisibleScalePickerData = async () => {
    let min = await SMap.getMinVisibleScale(this.state.layerData.path)
    let max = await SMap.getMaxVisibleScale(this.state.layerData.path)
    let pickerData = await getVisibleScalePickerData(min, max)
    this.setState({ layerVisibleScaleData: pickerData })
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
  //       await SMap.renameLayer(this.state.layerData.name, this.state.layerName)
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
  //             this.state.layerData ? this.state.layerData.caption : ''
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
