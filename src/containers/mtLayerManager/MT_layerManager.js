/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import {
  TouchableOpacity,
  Text,
  SectionList,
  View,
  Platform,
  BackHandler,
  Image,
} from 'react-native'
import { Container } from '../../components'
import constants from '../workspace/constants'
import { Toast, scaleSize } from '../../utils'
import { MapToolbar, OverlayView } from '../workspace/components'
import { SMap, ThemeType } from 'imobile_for_reactnative'
import { LayerManager_item, LayerManager_tolbar } from './components'
import {
  ConstToolType,
  ConstPath,
  getHeaderTitle,
  ConstOnline,
  UserType,
} from '../../constants'
import { color, size } from '../../styles'
import * as LayerUtils from './LayerUtils'
import {
  getThemeAssets,
  getLayerIconByType,
  getThemeIconByType,
} from '../../assets'
import { FileTools } from '../../native'
import NavigationService from '../../containers/NavigationService'
import { getLanguage } from '../../language/index'

export default class MT_layerManager extends React.Component {
  props: {
    language: string,
    navigation: Object,
    editLayer: Object,
    map: Object,
    collection: Object,
    layers: Object,
    setEditLayer: () => {},
    setCurrentLayer: () => {},
    getLayers: () => {},
    closeMap: () => {},
    clearAttributeHistory: () => {},
    device: Object,
    currentLayer: Object,
    setMapLegend: () => {},
    user: Object,
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.state = {
      // datasourceList: [],
      mapName: '',
      refreshing: false,
      currentOpenItemName: '', // 记录左滑的图层的名称
      data: [],
      selectLayer: this.props.currentLayer.name,
      type: params && params.type, // 底部Tabbar类型
    }
  }

  componentDidUpdate(prevProps) {
    let newState = {}
    let dataList = []
    if (
      JSON.stringify(prevProps.currentLayer) !==
      JSON.stringify(this.props.currentLayer)
    ) {
      newState.selectLayer = this.props.currentLayer.name
    }
    if (
      JSON.stringify(prevProps.layers) !== JSON.stringify(this.props.layers)
    ) {
      let baseData = []
      if (
        this.props.layers.length > 0 &&
        LayerUtils.isBaseLayer(
          this.props.layers[this.props.layers.length - 1].name,
        )
      ) {
        baseData = [this.props.layers[this.props.layers.length - 1]]
      }
      (async function() {
        dataList = await SMap.getTaggingLayers(
          this.props.user.currentUser.userName,
        )
        newState.data = [
          {
            title: getLanguage(this.props.language).Map_Layer.PLOTS,
            //'我的标注',
            data: dataList,
            visible: true,
          },
          {
            title: getLanguage(this.props.language).Map_Layer.LAYERS,
            //'我的图层',
            data: this.props.layers,
            visible: true,
          },
          {
            title: getLanguage(this.props.language).Map_Layer.BASEMAP,
            //'我的底图',
            data: baseData,
            visible: true,
          },
        ]
        if (Object.keys(newState).length > 0) {
          this.setState(newState)
        }
      }.bind(this)())
    }
  }

  componentDidMount() {
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', this.back)
    ;(async function() {
      this.getData(true)
    }.bind(this)())
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.back)
    }
  }

  setRefreshing = refreshing => {
    if (refreshing === this.state.refreshing) return
    this.setState({
      refreshing: refreshing,
    })
  }

  getData = async (isInit = false) => {
    // this.container.setLoading(true)
    try {
      this.itemRefs = {}
      let layers = isInit ? this.props.layers : await this.props.getLayers()

      if (
        layers.length > 0 &&
        !LayerUtils.isBaseLayer(layers[layers.length - 1].name)
      ) {
        await SMap.openDatasource(
          ConstOnline.Google.DSParams,
          GLOBAL.Type === constants.COLLECTION
            ? 1
            : ConstOnline.Google.layerIndex,
          false,
          false,
        )
        layers = await this.props.getLayers()
      }

      let baseMap = []
      let dataList = []
      if (
        layers.length > 0 &&
        LayerUtils.isBaseLayer(layers[layers.length - 1].name)
      ) {
        baseMap = [layers[layers.length - 1]]
      }
      dataList = await SMap.getTaggingLayers(
        this.props.user.currentUser.userName,
      )
      this.setState({
        data: [
          {
            title: getLanguage(this.props.language).Map_Layer.PLOTS,
            //'我的标注',
            data: dataList,
            visible: true,
          },
          {
            title: getLanguage(this.props.language).Map_Layer.LAYERS,
            //'我的图层',
            data: layers,
            visible: true,
          },
          {
            title: getLanguage(this.props.language).Map_Layer.BASEMAP,
            // '我的底图',
            data: baseMap,
            visible: true,
          },
        ],
        selectLayer: this.props.currentLayer.name,
        refreshing: false,
      })
      // let mapName = await this.map.getName()
    } catch (e) {
      this.setRefreshing(false)
    }
  }

  // showSaveDialog = (isShow = true) => {
  //   this.saveDialog.setDialogVisible(isShow)
  // }
  //
  // showModifiedDialog = (isShow = true) => {
  //   this.modifiedDialog.setDialogVisible(isShow)
  // }
  //
  // showRenameDialog = (isShow = true, layer = null) => {
  //   this.renameDialog.setDialogVisible(isShow)
  //   if (layer) {
  //     this.renameLayer = layer
  //   }
  // }
  //
  // showRemoveDialog = (isShow = true, data = null, info = '') => {
  //   this.deleteDialog.setDialogVisible(isShow, info)
  //   if (data) {
  //     this.removeLayerData = data
  //   }
  // }
  //
  // /*LayerManager_tab点击方法*/
  // //地图切换
  // _map_change = async () => {
  //   let isModified = await this.map.isModified()
  //   if (isModified) {
  //     this.showModifiedDialog(true)
  //   } else {
  //     this.goToMapChange()
  //   }
  // }
  //
  // goToMapChange = () => {
  //   NavigationService.navigate('MapChange', {
  //     workspace: this.workspace,
  //     map: this.map,
  //   })
  //   // NavigationService.navigate('MapChange',{workspace: this.workspace, map:this.map, cb: this.getData})
  // }
  //
  // // 地图保存
  // saveAndGoToMapChange = () => {
  //   (async function() {
  //     try {
  //       let saveMap = await this.map.save()
  //       if (!saveMap) {
  //         Toast.show('保存失败')
  //       } else {
  //         this.showModifiedDialog(false)
  //         this.showSaveDialog(false)
  //         Toast.show('保存成功')
  //         this.goToMapChange()
  //       }
  //     } catch (e) {
  //       Toast.show('保存失败')
  //     }
  //   }.bind(this)())
  // }
  //
  // // 保存
  // saveMapAndWorkspace = ({ mapName, wsName, path }) => {
  //   this.container.setLoading(true)
  //   ;(async function() {
  //     try {
  //       let saveWs
  //       let info = {}
  //       if (!mapName) {
  //         Toast.show('请输入地图名称')
  //         return
  //       }
  //       if (this.state.path !== path || path === ConstPath.LocalDataPath) {
  //         info.path = path
  //       }
  //       if (this.showDialogCaption) {
  //         if (!wsName) {
  //           Toast.show('请输入工作空间名称')
  //           return
  //         }
  //         info.path = path
  //         info.caption = wsName
  //       }
  //       await this.map.setWorkspace(this.workspace)
  //       // 若名称相同，则不另存为
  //       // let saveMap = await this.map.save(mapName !== this.state.mapName ? mapName : '')
  //
  //       // saveWs = await this.workspace.saveWorkspace(info)
  //       if (this.showDialogCaption) {
  //         let index = await this.workspace.addMap(
  //           mapName,
  //           await this.map.toXML(),
  //         )
  //         if (index >= 0) {
  //           saveWs = await this.workspace.saveWorkspace(info)
  //           if (saveWs) {
  //             this.showSaveDialog(false)
  //             Toast.show('保存成功')
  //           } else {
  //             Toast.show('保存失败')
  //           }
  //         } else {
  //           Toast.show('该名称地图已存在')
  //         }
  //       } else {
  //         // 若名称相同，则不另存为
  //         let saveMap = await this.map.save(
  //           mapName !== this.state.mapName ? mapName : '',
  //         )
  //         saveWs = await this.workspace.saveWorkspace(info)
  //         if (!saveMap) {
  //           Toast.show('该名称地图已存在')
  //         } else if (saveWs || !this.showDialogCaption) {
  //           this.showSaveDialog(false)
  //           Toast.show('保存成功')
  //         } else if (saveWs === undefined) {
  //           Toast.show('该工作空间已存在')
  //         } else {
  //           Toast.show('保存失败')
  //         }
  //       }
  //       this.container.setLoading(false)
  //     } catch (e) {
  //       this.container.setLoading(false)
  //       Toast.show('保存失败')
  //     }
  //   }.bind(this)())
  // }
  //
  // //添加数据集
  // _add_dataset = () => {
  //   NavigationService.navigate('AddDataset', {
  //     workspace: this.workspace,
  //     map: this.map,
  //     layerList: this.state.datasourceList,
  //     cb: async () => {
  //       await this.getData()
  //       this.map && this.map.refresh()
  //     },
  //   })
  // }
  //
  // //新建图层组
  // _add_layer_group = () => {
  //   NavigationService.navigate('AddLayerGroup', {
  //     workspace: this.workspace,
  //     mapControl: this.mapControl,
  //     map: this.map,
  //     cb: this.getData,
  //   })
  // }
  //
  // //删除图层 / 解散图层组
  // _removeLayer = () => {
  //   (async function() {
  //     try {
  //       if (!this.map || !this.removeLayerData) return
  //       let result = false,
  //         info = '删除',
  //         isDeletedFromGroup = false
  //       if (this.removeLayerData.layer._SMLayerGroupId) {
  //         // 解散图层组
  //         result = await this.removeLayerData.layer.ungroup()
  //         info = '解散图层组'
  //       } else if (this.removeLayerData.groupName) {
  //         // 从图层组中删除图层
  //         let group = new LayerGroup()
  //         group._SMLayerId = this.removeLayerData.layerGroupId
  //         result = await group.remove(this.removeLayerData.layer)
  //         isDeletedFromGroup = true
  //       } else {
  //         // 删除图层
  //         let name = this.removeLayerData.name
  //         result = await this.map.removeLayer(name)
  //       }
  //       if (result) {
  //         Toast.show(info + '成功')
  //
  //         // TODO 更新解散的图层组
  //         if (
  //           (this.removeLayerData.layer._SMLayerGroupId &&
  //             this.removeLayerData.groupName) ||
  //           isDeletedFromGroup
  //         ) {
  //           let child = await this.getChildList({
  //             data: this.itemRefs[this.removeLayerData.groupName].props.data,
  //           })
  //           this.itemRefs[this.removeLayerData.groupName].updateChild(child)
  //         } else {
  //           await this.getData()
  //         }
  //         delete this.itemRefs[this.removeLayerData.name]
  //         this.removeLayerData = null
  //       } else {
  //         Toast.show(info + '失败')
  //       }
  //       this.deleteDialog && this.deleteDialog.setDialogVisible(false)
  //     } catch (e) {
  //       Toast.show('删除失败')
  //     }
  //   }.bind(this)())
  // }
  //
  // //图层重命名
  // _renameLayer = name => {
  //   (async function() {
  //     try {
  //       if (!this.map || !this.renameLayer) return
  //       await this.renameLayer.setCaption(name)
  //       Toast.show('修改成功')
  //       this.renameLayer = null
  //       await this.getData()
  //       this.renameDialog && this.renameDialog.setDialogVisible(false)
  //     } catch (e) {
  //       Toast.show('修改失败')
  //     }
  //   }.bind(this)())
  // }

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: scaleSize(80 + 1) * index,
      index,
    }
  }

  onAllPressRow = async ({ data }) => {
    this.props.setCurrentLayer &&
      this.props.setCurrentLayer(data, () => {
        // 切换地图，清除历史记录
        if (
          JSON.stringify(this.props.currentLayer) !== JSON.stringify(data.name)
        ) {
          this.props.clearAttributeHistory && this.props.clearAttributeHistory()
        }
      })
    this.setState({
      selectLayer: data.name,
    })
  }

  onThisPress = async ({ data }) => {
    this.setState({
      selectLayer: data.name,
    })
  }

  updateTagging = async () => {
    this.setRefreshing(true)
    this.getData()
  }

  /**地图制图修改风格 */
  mapEdit = data => {
    SMap.setLayerEditable(data.path, true)
    if (data.type === 83) {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.GRID_STYLE, {
          containerType: 'list',
          isFullScreen: false,
          height: ConstToolType.HEIGHT[4],
        })
      GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
      this.props.navigation.navigate('MapView')
    } else if (data.type === 1 || data.type === 3 || data.type === 5) {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
          containerType: 'symbol',
          isFullScreen: false,
          column: 4,
          height: ConstToolType.THEME_HEIGHT[3],
        })
      GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
      this.props.navigation.navigate('MapView')
    } else {
      Toast.show(
        getLanguage(this.props.language).Prompt
          .THE_CURRENT_LAYER_CANNOT_BE_STYLED,
      )
      //'当前图层无法设置风格')
    }
  }

  /**修改专题图 */
  mapTheme = data => {
    let curThemeType
    switch (data.themeType) {
      case ThemeType.UNIQUE:
        // this.props.navigation.navigate('MapView')
        // Toast.show('当前图层为:' + data.name)
        curThemeType = constants.THEME_UNIQUE_STYLE
        // GLOBAL.toolBox.showMenuAlertDialog(constants.THEME_UNIQUE_STYLE)
        break
      case ThemeType.RANGE:
        // this.props.navigation.navigate('MapView')
        // Toast.show('当前图层为:' + data.name)
        curThemeType = constants.THEME_RANGE_STYLE
        // GLOBAL.toolBox.showMenuAlertDialog(constants.THEME_RANGE_STYLE)
        break
      case ThemeType.LABEL:
        // this.props.navigation.navigate('MapView')
        // Toast.show('当前图层为:' + data.name)
        curThemeType = constants.THEME_UNIFY_LABEL
        // GLOBAL.toolBox.showMenuAlertDialog(constants.THEME_UNIFY_LABEL)
        break
      case ThemeType.DOTDENSITY:
        curThemeType = constants.THEME_DOT_DENSITY
        break
      case ThemeType.GRADUATEDSYMBOL:
        curThemeType = constants.THEME_GRADUATED_SYMBOL
        break
      case ThemeType.GRAPH:
        curThemeType = constants.THEME_GRAPH_STYLE
        break
      case ThemeType.GRIDRANGE:
        curThemeType = constants.THEME_GRID_RANGE
        break
      case ThemeType.GRIDUNIQUE:
        curThemeType = constants.THEME_GRID_UNIQUE
        break
      default:
        Toast.show('提示:当前图层暂不支持修改')
        break
    }
    if (curThemeType) {
      // GLOBAL.toolBox.showMenuAlertDialog(constants.THEME_UNIFY_LABEL)
      GLOBAL.toolBox.setVisible(
        true,
        curThemeType === constants.THEME_GRAPH_STYLE
          ? ConstToolType.MAP_THEME_PARAM_GRAPH
          : ConstToolType.MAP_THEME_PARAM,
        {
          containerType: 'list',
          isFullScreen: true,
          themeType: curThemeType,
          isTouchProgress: false,
          showMenuDialog: true,
        },
      )
      GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
      this.props.navigation.navigate('MapView')
      Toast.show(
        //'当前图层为:'
        getLanguage(this.props.language).Prompt.THE_CURRENT_LAYER + data.name,
      )
    }
  }

  onPressRow = async ({ data }) => {
    this.props.setMapLegend(false)
    this.props.setCurrentLayer &&
      this.props.setCurrentLayer(data, () => {
        // 切换地图，清除历史记录
        if (
          JSON.stringify(this.props.currentLayer) !== JSON.stringify(data.name)
        ) {
          this.props.clearAttributeHistory && this.props.clearAttributeHistory()
        }
      })
    if (GLOBAL.Type === constants.MAP_EDIT) {
      if (data.themeType <= 0) {
        this.mapEdit(data)
      } else {
        Toast.show(
          getLanguage(this.props.language).Prompt
            .THE_CURRENT_LAYER_CANNOT_BE_STYLED,
        )
        //'当前图层无法设置风格')
      }
    } else if (GLOBAL.Type === constants.MAP_THEME) {
      if (data.themeType <= 0) {
        this.mapEdit(data)
      } else {
        this.mapTheme(data)
      }
    }
    this.setState({
      selectLayer: data.name,
    })
  }

  onToolBasePress = async ({ data }) => {
    this.toolBox.setVisible(true, ConstToolType.MAP_EDIT_STYLE, {
      height: ConstToolType.TOOLBAR_HEIGHT[0],
      layerdata: data,
    })
  }

  taggingTool = async ({ data, index }) => {
    this.toolBox.setVisible(true, ConstToolType.MAP_EDIT_TAGGING, {
      height: ConstToolType.TOOLBAR_HEIGHT[1],
      layerdata: data,
      index: index,
    })
  }

  onToolPress = async ({ data }) => {
    if (GLOBAL.Type === constants.MAP_THEME) {
      let themeType
      switch (data.themeType) {
        case ThemeType.UNIQUE:
          themeType = ConstToolType.MAP_THEME_STYLES
          break
        case ThemeType.RANGE:
          themeType = ConstToolType.MAP_THEME_STYLES
          break
        case ThemeType.LABEL:
          themeType = ConstToolType.MAP_THEME_STYLES
          break
        default:
          themeType = ConstToolType.MAP_THEME_STYLE
          break
      }
      this.toolBox.setVisible(true, themeType, {
        height: ConstToolType.TOOLBAR_HEIGHT[6],
        layerdata: data,
      })
    }
    if (GLOBAL.Type === constants.MAP_EDIT) {
      this.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
        height: ConstToolType.TOOLBAR_HEIGHT[6],
        layerdata: data,
      })
    }
    if (GLOBAL.Type === constants.COLLECTION) {
      this.toolBox.setVisible(true, ConstToolType.COLLECTION, {
        height: ConstToolType.TOOLBAR_HEIGHT[5],
        layerdata: data,
      })
    }
  }

  getChildList = async ({ data, section }) => {
    try {
      if (data.type !== 'layerGroup') return
      this.container.setLoading(true)
      let layers = await SMap.getLayersByGroupPath(data.path)
      let child = []
      for (let i = 0; i < layers.length; i++) {
        child.push(this._renderItem({ item: layers[i], section }))
      }
      this.container.setLoading(false)
      return child
    } catch (e) {
      this.container.setLoading(false)
      Toast.show( getLanguage(this.props.language).Prompt
        .GET_LAYER_GROUP_FAILD,
      )
      //'获取失败')
      return []
    }
  }

  setLayerVisible = (data, value) => {
    let layers = this.state.data[1].data
    let backMaps = this.state.data[2].data
    let Label = this.state.data[0].data
    let hasDeal = false
    let caption = data.caption
    let curData = this.state.data.concat()
    for (let i = 0, l = layers.length; i < l; i++) {
      if (caption === layers[i].caption) {
        curData[1].data[i].isVisible = value
        /*
         *todo layers中包含了标注和底图，实际标注显示是读取的label中的属性，如果此处hasDeal设置为true
         *todo 则会造成标注设置不可见，折叠菜单再打开，不可见的标注又被勾上  是否改变数据结构？
         */
        //hasDeal = true
        break
      }
    }
    if (!hasDeal)
      for (let j = 0, l = backMaps.length; j < l; j++) {
        if (caption === backMaps[j].caption) {
          curData[2].data.isVisible = value
          hasDeal = true
          break
        }
      }
    if (!hasDeal)
      for (let j = 0, l = Label.length; j < l; j++) {
        if (caption === Label[j].caption) {
          curData[0].data.isVisible = value
          hasDeal = true
          break
        }
      }
    SMap.setLayerVisible(data.path, value)
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setSaveViewVisible = visible => {
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(visible, this.setLoading)
  }

  back = () => {
    this.props.navigation.navigate('MapView')
    // if (GLOBAL.Type === ConstToolType.MAP_3D) {
    //   NavigationService.goBack()
    // } else {
    //   this.backAction = async () => {
    //     try {
    //       this.setLoading(true, '正在关闭地图')
    //       await this.props.closeMap()
    //       GLOBAL.clearMapData()
    //       this.setLoading(false)
    //       NavigationService.goBack()
    //     } catch (e) {
    //       this.setLoading(false)
    //     }
    //   }
    //   SMap.mapIsModified().then(async result => {
    //     if (result) {
    //       this.setSaveViewVisible(true)
    //     } else {
    //       await this.backAction()
    //       this.backAction = null
    //     }
    //   })
    // }
    return true
  }

  getStyleIconByType = item => {
    if (item.themeType > 0) {
      return getThemeIconByType(item.themeType)
    } else {
      return getLayerIconByType(item.type)
    }
  }

  tool_row = async () => {
    let userPath =
      this.props.user.currentUser.userName &&
      this.props.user.currentUser.userType !== UserType.PROBATION_USER
        ? ConstPath.UserPath + this.props.user.currentUser.userName + '/'
        : ConstPath.CustomerPath
    let mapPath = await FileTools.appendingHomeDirectory(
      userPath + ConstPath.RelativePath.Map,
    )
    let newName = await FileTools.getAvailableMapName(
      mapPath,
      this.props.map.currentMap.name || 'DefaultMap',
    )
    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(this.props.language).Map_Main_Menu.TOOLS_NAME,
      value: newName,
      placeholder: getLanguage(this.props.language).Prompt.ENTER_NAME,
      cb: async value => {
        if (value !== '') {
          (async function() {
            await SMap.setLabelColor()
            GLOBAL.TaggingDatasetName = await SMap.newTaggingDataset(
              value,
              this.props.user.currentUser.userName,
            )
            this.setRefreshing(true)
            this.getData()
          }.bind(this)())
        }
        NavigationService.goBack()
      },
    })
  }

  _renderItem = ({ item, section, index }) => {
    // sectionID = sectionID || 0
    if (section.visible) {
      if (item) {
        let action
        if (
          section.title === getLanguage(this.props.language).Map_Layer.LAYERS
        ) {
          action = this.onToolPress
          if (
            this.props.layers.length > 0 &&
            item.name === this.props.layers[this.props.layers.length - 1].name
          ) {
            if (LayerUtils.isBaseLayer(item.name)) return true
          }
          if (
            this.props.layers.length > 1 &&
            item.name === this.props.layers[this.props.layers.length - 2].name
          ) {
            if (LayerUtils.isBaseLayer(item.name)) return true
          }
          if (
            this.props.layers.length > 0 &&
            item.name.indexOf('@Label_') >= 0
          ) {
            return true
          }
        } else if (
          section.title === getLanguage(this.props.language).Map_Layer.BASEMAP
        ) {
          action = this.onToolBasePress
        } else if (
          section.title === getLanguage(this.props.language).Map_Layer.PLOTS
        ) {
          action = this.taggingTool
        }
        return (
          <LayerManager_item
            key={item.name}
            // sectionID={sectionID}
            // rowID={item.index}
            ref={ref => {
              if (!this.itemRefs) {
                this.itemRefs = {}
              }
              this.itemRefs[item.name] = ref
              return this.itemRefs[item.name]
            }}
            layer={item.layer}
            // map={this.map}
            data={item}
            index={index}
            isClose={this.state.currentOpenItemName !== item.name}
            mapControl={this.mapControl}
            setLayerVisible={this.setLayerVisible}
            onOpen={data => {
              // data, sectionID, rowID
              if (this.state.currentOpenItemName !== data.name) {
                let item = this.itemRefs[this.state.currentOpenItemName]
                item && item.close()
              }
              this.setState({
                currentOpenItemName: data.name,
              })
            }}
            selectLayer={this.state.selectLayer}
            onPress={this.onPressRow}
            onAllPress={this.onAllPressRow}
            onArrowPress={({ data, layer }) =>
              this.getChildList({ data, layer, section })
            }
            onToolPress={action}
          />
        )
      } else {
        return <View />
      }
    } else {
      return <View />
    }
  }

  refreshList = section => {
    let newData = this.state.data
    section.visible = !section.visible
    newData[section.index] = section
    this.setState({
      data: newData.concat(),
    })
  }

  renderSection = ({ section }) => {
    let image = section.visible
      ? (image = getThemeAssets().publicAssets.list_section_packup)
      : (image = getThemeAssets().publicAssets.list_section_spread)
    if (section.title === getLanguage(this.props.language).Map_Layer.PLOTS) {
      return (
        <TouchableOpacity
          style={{
            height: scaleSize(80),
            backgroundColor: color.content,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            this.refreshList(section)
          }}
        >
          <Image
            source={image}
            style={{
              width: scaleSize(40),
              height: scaleSize(40),
              marginLeft: scaleSize(20),
            }}
          />
          <Text
            style={{
              marginLeft: scaleSize(25),
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: size.fontSize.fontSizeXXl,
              color: color.white,
            }}
          >
            {section.title}
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                height: scaleSize(50),
                width: scaleSize(60),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: scaleSize(10),
              }}
              onPress={this.tool_row}
            >
              <Image
                resizeMode={'contain'}
                style={{ height: scaleSize(60), width: scaleSize(60) }}
                source={require('../../assets/function/new_tagging_white.png')}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={{
            height: scaleSize(80),
            backgroundColor: color.content,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            this.refreshList(section)
          }}
        >
          <Image
            source={image}
            style={{
              width: scaleSize(40),
              height: scaleSize(40),
              marginLeft: scaleSize(20),
            }}
          />
          <Text
            style={{
              marginLeft: scaleSize(25),
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: size.fontSize.fontSizeXXl,
              color: color.white,
            }}
          >
            {section.title}
          </Text>
        </TouchableOpacity>
      )
    }
  }

  renderToolBar = () => {
    return (
      <MapToolbar navigation={this.props.navigation} type={this.state.type} />
    )
  }

  renderList = () => {
    return (
      <View style={{ flex: 1 }}>
        <SectionList
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.setRefreshing(true)
            this.getData()
          }}
          ref={ref => (this.listView = ref)}
          sections={this.state.data}
          renderItem={this._renderItem}
          renderSectionHeader={this.renderSection}
          getItemLayout={this.getItemLayout}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={15}
          ItemSeparatorComponent={this.renderItemSeparator}
          renderSectionFooter={this.renderSectionFooter}
        />
      </View>
    )
  }

  /**行与行之间的分隔线组件 */
  renderItemSeparator = ({ section, leadingItem }) => {
    if (section.visible) {
      if (
        this.props.layers.length > 0 &&
        leadingItem.name.indexOf('@Label_') >= 0 &&
        section.title === getLanguage(this.props.language).Map_Layer.LAYERS
      ) {
        return <View />
      } else {
        return (
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              height: 1,
              backgroundColor: color.bgG,
            }}
          />
        )
      }
    } else {
      return <View />
    }
  }

  /**Section之间的分隔线组件 */
  renderSectionFooter = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          height: 1,
          backgroundColor: color.bgG,
        }}
      />
    )
  }

  //遮盖层
  renderOverLayer = () => {
    return <OverlayView ref={ref => (GLOBAL.LayerManagerOverlayView = ref)} />
  }

  renderTool = () => {
    return (
      <LayerManager_tolbar
        language={this.props.language}
        ref={ref => (this.toolBox = ref)}
        {...this.props}
        onPress={this.onPressRow}
        onThisPress={this.onThisPress}
        updateTagging={this.updateTagging}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getHeaderTitle(GLOBAL.Type),
          navigation: this.props.navigation,
          // backAction: this.back,
          // backImg: require('../../assets/mapTools/icon_close.png'),
          withoutBack: true,
        }}
        bottomBar={this.renderToolBar()}
      >
        {/*<LayerManager_tab*/}
        {/*mapChange={this._map_change}*/}
        {/*showSaveDialog={this.showSaveDialog}*/}
        {/*addDataset={this._add_dataset}*/}
        {/*addLayerGroup={this._add_layer_group}*/}
        {/*/>*/}
        {this.renderList()}
        {this.renderOverLayer()}
        {this.renderTool()}
        {/*<SaveDialog*/}
        {/*ref={ref => (this.saveDialog = ref)}*/}
        {/*confirmAction={this.saveMapAndWorkspace}*/}
        {/*showWsName={this.showDialogCaption}*/}
        {/*mapName={this.state.mapName}*/}
        {/*wsName={this.state.wsName}*/}
        {/*path={this.state.path}*/}
        {/*/>*/}
        {/*<ModifiedDialog*/}
        {/*ref={ref => (this.modifiedDialog = ref)}*/}
        {/*info={'当前地图已修改，是否保存？'}*/}
        {/*confirmAction={this.saveAndGoToMapChange}*/}
        {/*cancelAction={this.goToMapChange}*/}
        {/*/>*/}
        {/*<ModifiedDialog*/}
        {/*ref={ref => (this.deleteDialog = ref)}*/}
        {/*info={'是否要删除该图层？'}*/}
        {/*confirmAction={this._removeLayer}*/}
        {/*/>*/}
        {/*<InputDialog*/}
        {/*ref={ref => (this.renameDialog = ref)}*/}
        {/*title={'图层重命名'}*/}
        {/*label={'图层名称'}*/}
        {/*confirmAction={this._renameLayer}*/}
        {/*/>*/}
      </Container>
    )
  }
}
