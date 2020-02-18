/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { TouchableOpacity, Text, SectionList, View, Image } from 'react-native'
import { Container } from '../../components'
import constants from '../workspace/constants'
import { Toast, scaleSize, LayerUtils } from '../../utils'
import { MapToolbar, OverlayView } from '../workspace/components'
import { SMap, ThemeType, SMediaCollector } from 'imobile_for_reactnative'
import { LayerManager_item, LayerManager_tolbar } from './components'
import {
  ConstToolType,
  ConstPath,
  getHeaderTitle,
  ConstOnline,
  UserType,
} from '../../constants'
import { color, size } from '../../styles'
import {
  getThemeAssets,
  getLayerIconByType,
  getThemeIconByType,
} from '../../assets'
import { FileTools } from '../../native'
import {
  themeModule,
  styleModule,
} from '../workspace/components/ToolBar/modules'
import NavigationService from '../../containers/NavigationService'
import { getLanguage } from '../../language'

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
    setBackAction: () => {},
    removeBackAction: () => {},
    user: Object,
    baseMaps: Object,
    appConfig: Object,
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.curUserBaseMaps = this.props.baseMaps[
      this.props.user.currentUser.userId
    ]
    if (!this.curUserBaseMaps) {
      this.curUserBaseMaps = this.props.baseMaps['default'] || []
    }

    let userAddBase = []
    for (let i = 0, n = this.curUserBaseMaps.length; i < n; i++) {
      if (this.curUserBaseMaps[i].userAdd) {
        userAddBase.push(this.curUserBaseMaps[i].layerName)
      }
    }
    LayerUtils.setBaseMap(userAddBase)
    this.state = {
      // datasourceList: [],
      mapName: '',
      refreshing: false,
      currentOpenItemName: '', // 记录左滑的图层的名称
      data: [],
      type: (params && params.type) || GLOBAL.Type, // 底部Tabbar类型
      allLayersVisible: false,
    }
    this.itemRefs = {} // 记录列表items
    this.currentItemRef = {} // 当前被选中的item
    this.prevItemRef = {} // 上一个被选中的item
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.layers) !== JSON.stringify(this.props.layers)
    ) {
      this.getData()
    }
  }

  componentDidMount() {
    this.getData(true)
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
      let allLayers = isInit ? this.props.layers : await this.props.getLayers()

      let baseMap = []
      if (
        allLayers.length > 0 ||
        (allLayers.length === 0 && GLOBAL.Type === constants.MAP_ANALYST)
      ) {
        if (
          (allLayers.length > 0 &&
            !LayerUtils.isBaseLayer(allLayers[allLayers.length - 1].name)) ||
          (allLayers.length === 0 && GLOBAL.Type === constants.MAP_ANALYST)
        ) {
          baseMap = [
            {
              caption: 'baseMap',
              datasetName: '',
              name: 'baseMap',
              path: '',
              themeType: 0,
              type: 81,
            },
          ]
        } else if (allLayers.length > 0) {
          baseMap = [allLayers[allLayers.length - 1]]
          allLayers.splice(allLayers.length - 1, 1)
        }
      } else if (allLayers.length === 0) {
        await SMap.openDatasource(
          ConstOnline.Google.DSParams,
          GLOBAL.Type === constants.MAP_COLLECTION
            ? 1
            : ConstOnline.Google.layerIndex,
          false,
          false, // 分析模块下，显示地图
        )
        allLayers = await this.props.getLayers()
        baseMap = allLayers.length > 0 ? [allLayers[allLayers.length - 1]] : []
      }

      let taggingLayers = [] // 标注图层
      let layers = [] // 我的图层
      // 加载标注图层后，标注图层会添加到地图中，getLayers获取的图层包含普通图层和标注图层
      for (let i = 0; i < allLayers.length; i++) {
        if (LayerUtils.getLayerType(allLayers[i]) === 'TAGGINGLAYER') {
          taggingLayers.unshift(allLayers[i])
        } else {
          layers.push(allLayers[i])
        }
      }

      // 若无标注图层，则去加载
      if (taggingLayers.length === 0) {
        taggingLayers = await SMap.getTaggingLayers(
          this.props.user.currentUser.userName,
        )
      }
      if (this.props.currentLayer.name) {
        this.prevItemRef = this.currentItemRef
        this.currentItemRef =
          this.itemRefs && this.itemRefs[this.props.currentLayer.name]
      }
      this.setState({
        data: [
          {
            title: getLanguage(this.props.language).Map_Layer.PLOTS,
            //'我的标注',
            data: taggingLayers,
            visible:
              this.state.data.length === 3 ? this.state.data[0].visible : true,
          },
          {
            title: getLanguage(this.props.language).Map_Layer.LAYERS,
            //'我的图层',
            data: layers,
            visible:
              this.state.data.length === 3 ? this.state.data[1].visible : true,
          },
          {
            title: getLanguage(this.props.language).Map_Layer.BASEMAP,
            // '我的底图',
            data: baseMap,
            visible:
              this.state.data.length === 3 ? this.state.data[2].visible : true,
          },
        ],
        refreshing: false,
        allLayersVisible: this.isAllLayersVisible(layers),
      })
      // let mapName = await this.map.getName()
    } catch (e) {
      this.setRefreshing(false)
    }
  }

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: scaleSize(80 + 1) * index,
      index,
    }
  }

  onAllPressRow = async ({ data, parentData, section }) => {
    // 之前点击的图层组中的某一项
    this.prevItemRef = this.currentItemRef
    let prevParentData =
      this.prevItemRef &&
      this.prevItemRef.props &&
      this.prevItemRef.props.parentData
    this.currentItemRef = this.itemRefs && this.itemRefs[data.name]
    if (this.props.currentLayer.caption === data.name) {
      this.props.setCurrentLayer &&
        this.props.setCurrentLayer(null, () => {
          // 取消当前地图，清除历史记录
          this.props.clearAttributeHistory && this.props.clearAttributeHistory()
        })
    } else {
      this.props.setCurrentLayer &&
        this.props.setCurrentLayer(data, () => {
          // 切换图层，清除历史记录
          if (
            JSON.stringify(this.props.currentLayer) !==
            JSON.stringify(data.name)
          ) {
            this.props.clearAttributeHistory &&
              this.props.clearAttributeHistory()
          }
        })
      if (parentData) {
        this.getChildList({ data: parentData, section }).then(children => {
          this.itemRefs[parentData.name] &&
            this.itemRefs[parentData.name].setChildrenList(children)
        })
      }
      // 若两次选中的item不再同一个图层组中
      if (
        prevParentData &&
        (!parentData || parentData.name !== prevParentData.name)
      ) {
        this.getChildList({ data: prevParentData, section }).then(children => {
          this.itemRefs[prevParentData.name] &&
            this.itemRefs[prevParentData.name].setChildrenList(children)
        })
      }
    }
  }

  onThisPress = async ({ data }) => {
    // 之前点击的图层组中的某一项
    this.prevItemRef = this.currentItemRef
    this.currentItemRef = this.itemRefs && this.itemRefs[data.name]
  }

  updateTagging = async () => {
    // this.setRefreshing(true)
    let dataList = await SMap.getTaggingLayers(
      this.props.user.currentUser.userName,
    )
    for (let item of dataList) {
      if (item.isVisible) {
        // 显示多媒体callouts
        SMediaCollector.showMedia(item.name)
      }
    }
    let data = [...this.state.data]
    data[0] = {
      title: getLanguage(this.props.language).Map_Layer.PLOTS,
      //'我的标注',
      data: dataList,
      visible: true,
    }
    this.setState({ data })
    // this.getData()
  }

  onPressRow = async ({ data, parentData, section }) => {
    // this.props.setMapLegend(false)

    this.props.setCurrentLayer &&
      this.props.setCurrentLayer(data, () => {
        // 切换地图，清除历史记录
        if (
          JSON.stringify(this.props.currentLayer) !== JSON.stringify(data.name)
        ) {
          this.props.clearAttributeHistory && this.props.clearAttributeHistory()
        }
        if (
          GLOBAL.Type !== constants.MAP_EDIT &&
          GLOBAL.Type !== constants.MAP_THEME &&
          GLOBAL.Type !== constants.MAP_ANALYST
        ) {
          return
        }

        if (data.themeType <= 0 && !data.isHeatmap) {
          // this.mapEdit(data)
          styleModule().actions.layerListAction &&
            styleModule().actions.layerListAction(data)
        } else if (GLOBAL.Type === constants.MAP_THEME) {
          // this.mapTheme(data)
          themeModule().actions.layerListAction &&
            themeModule().actions.layerListAction(data)
        } else {
          Toast.show(
            getLanguage(this.props.language).Prompt
              .THE_CURRENT_LAYER_CANNOT_BE_STYLED,
          )
        }
      })
    this.prevItemRef = this.currentItemRef
    let prevParentData =
      this.prevItemRef &&
      this.prevItemRef.props &&
      this.prevItemRef.props.parentData
    this.currentItemRef = this.itemRefs && this.itemRefs[data.name]
    if (parentData) {
      this.getChildList({ data: parentData, section }).then(children => {
        this.itemRefs[parentData.name] &&
          this.itemRefs[parentData.name].setChildrenList(children)
      })
    }
    // 若两次选中的item不再同一个图层组中
    if (
      prevParentData &&
      (!parentData || parentData.name !== prevParentData.name)
    ) {
      this.getChildList({ data: prevParentData, section }).then(children => {
        this.itemRefs[prevParentData.name] &&
          this.itemRefs[prevParentData.name].setChildrenList(children)
      })
    }
  }

  onToolBasePress = async ({ data }) => {
    this.toolBox.setVisible(true, ConstToolType.MAP_EDIT_STYLE, {
      height: ConstToolType.TOOLBAR_HEIGHT[1],
      layerData: data,
    })
  }

  taggingTool = async ({ data, index }) => {
    this.toolBox.setVisible(true, ConstToolType.MAP_EDIT_TAGGING, {
      height: ConstToolType.TOOLBAR_HEIGHT[0],
      layerData: data,
      index: index,
    })
  }

  onToolPress = async ({ data, parentData, section }) => {
    let isGroup = data.type === 'layerGroup'
    let refreshParentList = async () => {
      let prevParentData =
        this.prevItemRef &&
        this.prevItemRef.props &&
        this.prevItemRef.props.parentData
      if (prevParentData || parentData) {
        let parent = prevParentData || parentData
        let children = await this.getChildList({ data: parent, section })
        this.itemRefs[parent.name] &&
          this.itemRefs[parent.name].setChildrenList(children)
      }
    }
    if (GLOBAL.Type === constants.MAP_THEME) {
      let themeType
      switch (data.themeType) {
        case ThemeType.UNIQUE:
        case ThemeType.RANGE:
        case ThemeType.LABEL:
        case ThemeType.LABELUNIQUE:
        case ThemeType.LABELRANGE:
        case ThemeType.GRAPH:
        case ThemeType.GRADUATEDSYMBOL:
        case ThemeType.DOTDENSITY:
        case ThemeType.GRIDUNIQUE:
        case ThemeType.GRIDRANGE:
          themeType = ConstToolType.MAP_THEME_STYLES
          break
        default:
          themeType = ConstToolType.MAP_THEME_STYLE
          break
      }
      if (data.isHeatmap) {
        themeType = ConstToolType.MAP_THEME_STYLES
      }
      this.toolBox.setVisible(true, themeType, {
        height: isGroup
          ? ConstToolType.TOOLBAR_HEIGHT[3]
          : ConstToolType.TOOLBAR_HEIGHT[6],
        layerData: data,
        refreshParentList: refreshParentList,
      })
    } else if (
      GLOBAL.Type === constants.MAP_EDIT ||
      GLOBAL.Type === constants.MAP_ANALYST
    ) {
      this.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
        height: isGroup
          ? ConstToolType.TOOLBAR_HEIGHT[3]
          : ConstToolType.TOOLBAR_HEIGHT[6],
        layerData: data,
        refreshParentList: refreshParentList,
      })
    } else if (
      GLOBAL.Type === constants.MAP_PLOTTING &&
      data.name.substring(0, 9) === 'PlotEdit_'
    ) {
      this.toolBox.setVisible(true, ConstToolType.PLOTTING, {
        height: isGroup
          ? ConstToolType.TOOLBAR_HEIGHT[3]
          : ConstToolType.TOOLBAR_HEIGHT[4],
        layerData: data,
        refreshParentList: refreshParentList,
      })
    } else if (GLOBAL.Type === constants.MAP_NAVIGATION) {
      this.toolBox.setVisible(true, ConstToolType.MAP_NAVIGATION, {
        height: isGroup
          ? ConstToolType.TOOLBAR_HEIGHT[3]
          : ConstToolType.TOOLBAR_HEIGHT[4],
        layerData: data,
        refreshParentList: refreshParentList,
      })
    } else {
      this.toolBox.setVisible(true, ConstToolType.COLLECTION, {
        height: isGroup
          ? ConstToolType.TOOLBAR_HEIGHT[3]
          : ConstToolType.TOOLBAR_HEIGHT[5],
        layerData: data,
        refreshParentList: refreshParentList,
      })
    }
  }

  getChildList = async ({ data, section }) => {
    try {
      if (data.type !== 'layerGroup') return
      // this.container.setLoading(true)
      let layers = await SMap.getLayersByGroupPath(data.path)
      let child = []
      for (let i = 0; i < layers.length; i++) {
        child.push(
          this._renderItem({ item: layers[i], section, parentData: data }),
        )
      }
      // this.container.setLoading(false)
      return child
    } catch (e) {
      // this.container.setLoading(false)
      Toast.show(getLanguage(this.props.language).Prompt.GET_LAYER_GROUP_FAILD)
      //'获取失败')
      return []
    }
  }

  setLayerVisible = async (data, value, section) => {
    let layers = section.data
    // let layers = this.state.data[1].data
    // let backMaps = this.state.data[2].data
    // let Label = this.state.data[0].data
    // let hasDeal = false
    let name = data.name
    let curData = JSON.parse(JSON.stringify(this.state.data))
    let sectionIndex = 0
    for (let i = 0; i < curData.length; i++) {
      if (section.title === curData[i].title) {
        sectionIndex = i
        break
      }
    }
    let result = false
    if (data.path !== '') {
      for (let i = 0, l = layers.length; i < l; i++) {
        if (name === layers[i].name) {
          curData[sectionIndex].data[i].isVisible = value
          break
        }
      }

      // for (let i = 0, l = layers.length; i < l; i++) {
      //   if (name === layers[i].name) {
      //     curData[1].data[i].isVisible = value
      //     // /*
      //     //    *todo layers中包含了标注和底图，实际标注显示是读取的label中的属性，如果此处hasDeal设置为true
      //     //  *todo 则会造成标注设置不可见，折叠菜单再打开，不可见的标注又被勾上  是否改变数据结构？
      //     //  */
      //     // hasDeal = true
      //     break
      //   }
      // }
      // if (!hasDeal)
      //   for (let j = 0, l = backMaps.length; j < l; j++) {
      //     if (name === backMaps[j].name) {
      //       curData[2].data[j].isVisible = value
      //       hasDeal = true
      //       break
      //     }
      //   }
      // if (!hasDeal)
      //   for (let j = 0, l = Label.length; j < l; j++) {
      //     if (name === Label[j].name) {
      //       curData[0].data[j].isVisible = value
      //       hasDeal = true
      //       break
      //     }
      //   }
      result = await SMap.setLayerVisible(data.path, value)

      if (
        data.groupName &&
        this.itemRefs &&
        this.itemRefs[data.name] &&
        this.itemRefs[data.groupName]
      ) {
        this.getChildList({
          data: this.itemRefs[data.name].props.parentData,
          section,
        }).then(children => {
          this.itemRefs[data.groupName] &&
            this.itemRefs[data.groupName].setChildrenList(children)
        })
      } else {
        this.props.getLayers()
      }

      if (value) {
        // 显示多媒体callouts
        SMediaCollector.showMedia(data.name)
      } else {
        // 隐藏多媒体callouts
        SMediaCollector.hideMedia(data.name)
      }
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.CHANGE_BASE_MAP)
    }
    return result
  }

  setAllLayersVisible = async section => {
    this.setLoading(true)
    // let layers = section.data
    let layers = JSON.parse(JSON.stringify(section.data))
    let visibles = this.isAllLayersVisible(layers)
    if (visibles) {
      for (let layer of layers) {
        await SMap.setLayerVisible(layer.path, false)
        layer.isVisible = false
        SMediaCollector.hideMedia(layer.name)
      }
    } else {
      for (let layer of layers) {
        if (layer.isVisible === false) {
          await SMap.setLayerVisible(layer.path, true)
          layer.isVisible = true
          SMediaCollector.showMedia(layer.name)
        }
      }
    }
    let data = JSON.parse(JSON.stringify(this.state.data))
    for (let i = 0; i < data.length; i++) {
      if (data[i].title === section.title) {
        data[i].data = layers
        break
      }
    }
    this.setState({ data, allLayersVisible: !visibles })
    this.setLoading(false)
  }

  isAllLayersVisible = layers => {
    if (layers.length > 0) {
      for (let layer of layers) {
        if (layer.isVisible === false) {
          return false
        }
      }
    } else {
      return false
    }
    return true
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setSaveViewVisible = visible => {
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(visible, this.setLoading)
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
      type: 'name',
      cb: async value => {
        if (value !== '') {
          (async function() {
            await SMap.setLabelColor()
            let data = await SMap.newTaggingDataset(
              value,
              this.props.user.currentUser.userName,
            )
            GLOBAL.TaggingDatasetName = data && data.datasetName
            // this.setRefreshing(true)
            // this.getData()
            this.updateTagging()
            this.props.getLayers()
          }.bind(this)())
        }
        NavigationService.goBack()
      },
    })
  }

  hasBaseMap = () => {
    let hasBaseMap = false
    if (this.props.layers && this.props.layers.length > 0) {
      hasBaseMap = LayerUtils.isBaseLayer(
        this.props.layers[this.props.layers.length - 1].name,
      )
    }
    return hasBaseMap
  }

  _renderItem = ({ item, section, index, parentData }) => {
    // sectionID = sectionID || 0
    if (section.visible) {
      if (item) {
        let action
        if (
          section.title === getLanguage(this.props.language).Map_Layer.LAYERS
        ) {
          action = this.onToolPress
          if (
            this.props.layers &&
            this.props.layers.length > 0 &&
            item.name === this.props.layers[this.props.layers.length - 1].name
          ) {
            if (LayerUtils.isBaseLayer(item.name)) return true
          }
          if (
            this.props.layers &&
            this.props.layers.length > 1 &&
            item.name === this.props.layers[this.props.layers.length - 2].name
          ) {
            if (LayerUtils.isBaseLayer(item.name)) return true
          }
          if (
            this.props.layers &&
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
            ref={ref => {
              if (!this.itemRefs) {
                this.itemRefs = {}
              }
              this.itemRefs[item.name] = ref
              return this.itemRefs[item.name]
            }}
            // swipeEnabled={true}
            user={this.props.user}
            data={item}
            parentData={parentData}
            index={index}
            isClose={this.state.currentOpenItemName !== item.name}
            setLayerVisible={(data, value) =>
              this.setLayerVisible(data, value, section)
            }
            onOpen={data => {
              if (this.state.currentOpenItemName !== data.name) {
                let item = this.itemRefs[this.state.currentOpenItemName]
                item && item.close()
              }
              this.setState({
                currentOpenItemName: data.name,
              })
            }}
            getLayers={this.props.getLayers}
            isSelected={item.name === this.props.currentLayer.name}
            onPress={data => this.onPressRow({ ...data, section })}
            onAllPress={data => this.onAllPressRow({ ...data, section })}
            onArrowPress={({ data }) => this.getChildList({ data, section })}
            onToolPress={data => action({ ...data, section })}
            refreshParent={data => {
              this.getChildList({ data, section }).then(children => {
                this.itemRefs[data.name] &&
                  this.itemRefs[data.name].setChildrenList(children)
              })
            }}
            hasBaseMap={this.hasBaseMap()}
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
      ? getThemeAssets().publicAssets.icon_arrow_down
      : getThemeAssets().publicAssets.icon_arrow_right_2
    if (section.title === getLanguage(this.props.language).Map_Layer.PLOTS) {
      return (
        <TouchableOpacity
          style={{
            height: scaleSize(80),
            backgroundColor: color.bgW,
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
              color: color.content,
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
                source={getThemeAssets().mine.mine_my_plot_new}
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
            backgroundColor: color.bgW,
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
              color: color.content,
            }}
          >
            {section.title}
          </Text>
          {section.title ===
            getLanguage(this.props.language).Map_Layer.LAYERS && (
            <Text
              style={{
                fontSize: scaleSize(20),
                color: '#A0A0A0',
              }}
            >
              {getLanguage(global.language).Prompt.LONG_PRESS_TO_SORT}
            </Text>
          )}
          {section.title ===
            getLanguage(this.props.language).Map_Layer.LAYERS && (
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
                  height: scaleSize(80),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: scaleSize(10),
                }}
                onPress={() => this.setAllLayersVisible(section)}
              >
                <Text style={{ fontSize: scaleSize(24), color: '#A0A0A0' }}>
                  {this.state.allLayersVisible
                    ? getLanguage(global.language).Prompt.SET_ALL_MAP_INVISIBLE
                    : getLanguage(global.language).Prompt.SET_ALL_MAP_VISIBLE}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      )
    }
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        type={this.state.type}
        appConfig={this.props.appConfig}
      />
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
              marginLeft: scaleSize(84),
              width: '100%',
              height: 1,
              backgroundColor: color.separateColorGray,
            }}
          />
        )
      }
    } else {
      return <View />
    }
  }

  /**Section之间的分隔线组件 */
  renderSectionFooter = ({ section }) => {
    if (
      this.state.data &&
      this.state.data.length > 0 &&
      this.state.data[this.state.data.length - 1].title === section.title
    ) {
      return <View />
    }
    return (
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          height: scaleSize(10),
          backgroundColor: color.separateColorGray,
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
        curUserBaseMaps={this.curUserBaseMaps}
        ref={ref => (this.toolBox = ref)}
        onPress={this.onPressRow}
        onThisPress={this.onThisPress}
        updateTagging={this.updateTagging}
        updateData={this.getData}
        getLayers={this.props.getLayers}
        setCurrentLayer={this.props.setCurrentLayer}
        device={this.props.device}
        user={this.props.user}
        navigation={this.props.navigation}
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
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          withoutBack: true,
        }}
        bottomBar={this.renderToolBar()}
      >
        {this.renderList()}
        {this.renderOverLayer()}
        {this.renderTool()}
      </Container>
    )
  }
}
