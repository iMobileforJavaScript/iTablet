/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, FlatList, Animated, Platform, NativeModules } from 'react-native'
import { MTBtn } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import { scaleSize } from '../../../../utils'
import MoreToolbar from '../MoreToolbar'
import styles from './styles'

import { SAnalyst, SScene, SMap, Action } from 'imobile_for_reactnative'
import Toast from 'react-native-root-toast'

const COLLECTION = 'COLLECTION'
const NETWORK = 'NETWORK'
const EDIT = 'EDIT'
const MAP_3D = 'MAP_3D'
const MAP_EDIT = 'MAP_EDIT'
const openNativeSampleCode =
  Platform.OS === 'ios'
    ? NativeModules.SMSampleCodeBridgeModule
    : NativeModules.IntentModule
export { COLLECTION, NETWORK, EDIT }

export default class FunctionToolbar extends React.Component {
  props: {
    style?: any,
    hide?: boolean,
    direction?: string,
    separator?: number,
    type: string,
    mapControl: any,
    mapView: any,
    workspace: any,
    map: any,
    editLayer: any,
    selection: any,
    setLoading: () => {},
    data?: Array,
    showLayers: () => {},
    // showTool: () => {},
    Label: () => {},
    changeLayer: () => {},

    getToolRef: () => {},
    showFullMap: () => {},
  }

  static defaultProps = {
    type: COLLECTION,
    hide: false,
    direction: 'column',
    separator: 20,
  }

  constructor(props) {
    super(props)
    let data = props.data || this.getData(props.type)
    this.state = {
      type: props.type,
      data: data,
      right: new Animated.Value(scaleSize(20)),
    }
    this.visible = true
  }

  setVisible = visible => {
    if (this.visible === visible) return
    Animated.timing(this.state.right, {
      toValue: visible ? scaleSize(20) : scaleSize(-200),
      duration: 300,
    }).start()
    this.visible = visible
  }

  /** 一级事件 **/

  changeBaseLayer = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_BASE, {
        containerType: 'list',
      })
    }
  }

  getFlyRouteNames = async () => {
    this.list = await SScene.getFlyRouteNames()
    await SScene.setPosition(this.list[0].index)
  }

  setMeasureLineAnalyst = async () => {
    await SAnalyst.setMeasureLineAnalyst({
      callback: result => {
        // console.log(result + '米')
        Toast.show(result + '米')
      },
    })
  }

  setMeasureSquareAnalyst = async () => {
    await SAnalyst.setMeasureSquareAnalyst({
      callback: result => {
        // console.log(result + '平方米')
        Toast.show(result + '平方米')
      },
    })
  }

  closeAnalysis = async () => {
    await SAnalyst.closeAnalysis()
  }

  getFlyProgress = async () => {
    await SScene.getFlyProgress({
      callback: result => {
        Toast.show(result)
      },
    })
  }

  flyPauseOrStart = async () => {
    await SScene.flyPauseOrStart()
  }

  flyPause = async () => {
    await SScene.flyPause()
  }

  flyStop = async () => {
    await SScene.flyStop()
  }

  showAddLayer = async () => {}

  showSymbol = () => {
    // const toolRef = this.props.getToolRef()
    // if (toolRef) {
    //   this.props.showFullMap && this.props.showFullMap(true)
    //   toolRef.setVisible(true, ConstToolType.MAP_SYMBOL, {
    //     isFullScreen: false,
    //   })
    // }
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      // TODO 根据符号类型改变ToolBox内容
      toolRef.setVisible(true, ConstToolType.MAP_COLLECTION_POINT, {
        isFullScreen: false,
      })
    }
  }

  showCollection = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      // TODO 根据符号类型改变ToolBox内容
      toolRef.setVisible(true, ConstToolType.MAP_COLLECTION_REGION, {
        isFullScreen: false,
      })
    }
  }

  showEdit = async () => {
    await SMap.setAction(Action.SELECT)
    await this._addGeometrySelectedListener()
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      // TODO 根据符号类型改变ToolBox 编辑内容
      toolRef.setVisible(true, ConstToolType.MAP_EDIT_REGION, {
        isFullScreen: false,
        column: 4,
        height: ConstToolType.HEIGHT[1],
      })
    }
  }

  showMore = async e => {
    this.moreToolbar && this.moreToolbar.showMore(true, e)
  }

  showTool = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_TOOL, {
        isFullScreen: false,
      })
    }
  }

  add = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_ADD_LAYER, {
        containerType: 'list',
      })
    }
  }

  Label = () => {
    this.props.Label()
  }

  mapStyle = () => {
    openNativeSampleCode.open('Layer')
  }

  /** 二级事件 **/
  openMap = () => {}

  closeMap = () => {}

  save = () => {}

  saveAs = () => {}

  recent = () => {}

  share = () => {}

  /** 获取一级数据 **/
  getData = type => {
    let data
    switch (type) {
      case MAP_EDIT:
        data = [
          {
            key: '底图',
            title: '底图',
            action: this.changeBaseLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: '添加',
            title: '添加',
            action: this.add,
            size: 'large',
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            key: '标注',
            title: '标注',
            action: this.showSymbol,
            size: 'large',
            image: require('../../../../assets/function/icon_function_Tagging.png'),
            selectMode: 'flash',
          },
          {
            key: '工具',
            title: '工具',
            action: this.showTool,
            size: 'large',
            image: require('../../../../assets/function/icon_function_tool.png'),
            selectMode: 'flash',
          },
          {
            key: '风格',
            title: '风格',
            action: this.mapStyle,
            size: 'large',
            image: require('../../../../assets/function/icon_function_style.png'),
            selectMode: 'flash',
          },
          {
            key: '保存',
            title: '保存',
            action: this.save,
            size: 'large',
            image: require('../../../../assets/function/icon_function_save.png'),
            selectMode: 'flash',
          },
          {
            title: '更多',
            action: this.showMore,
            image: require('../../../../assets/function/icon_function_share.png'),
          },
        ]
        break
      case MAP_3D:
        data = [
          {
            title: '量算',
            action: this.changeBaseLayer,
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            title: '面积',
            action: this.add,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '标注',
            action: this.showSymbol,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '工具',
            action: this.showTool,
            image: require('../../../../assets/function/icon_function_hand_draw.png'),
          },
          {
            title: '更多',
            action: this.closeAnalysis,
            image: require('../../../../assets/function/icon_function_share.png'),
          },
        ]
        break
      case COLLECTION:
      default:
        data = [
          {
            title: '底图',
            action: this.changeBaseLayer,
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            title: '添加',
            action: this.add,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '符号',
            action: this.showSymbol,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '采集',
            action: this.showCollection,
            image: require('../../../../assets/function/icon_function_hand_draw.png'),
          },
          {
            title: '编辑',
            action: this.showEdit,
            image: require('../../../../assets/function/icon_function_edit.png'),
          },
          {
            title: '工具',
            action: this.showTool,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },
          {
            title: '更多',
            action: this.showMore,
            image: require('../../../../assets/function/icon_function_share.png'),
          },
        ]
        break
    }
    return data
  }

  /** 获取 更多 数据 **/
  getMoreData = type => {
    let data
    switch (type) {
      case MAP_EDIT:
        data = [
          {
            title: '打开',
            action: this.openMap(),
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            title: '关闭',
            action: this.closeMap(),
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '保存',
            action: this.save,
            image: require('../../../../assets/function/icon_function_hand_draw.png'),
          },
          {
            title: '另存',
            action: this.saveAs,
            image: require('../../../../assets/function/icon_function_edit.png'),
          },
          {
            title: '历史',
            action: this.recent,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '分享',
            action: this.showTool,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },
        ]
        break
      case MAP_3D:
        break
      case COLLECTION:
      default:
        data = [
          {
            title: '打开',
            action: this.openMap(),
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            title: '关闭',
            action: this.closeMap(),
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '保存',
            action: this.save,
            image: require('../../../../assets/function/icon_function_hand_draw.png'),
          },
          {
            title: '另存',
            action: this.saveAs,
            image: require('../../../../assets/function/icon_function_edit.png'),
          },
          {
            title: '历史',
            action: this.recent,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '分享',
            action: this.showTool,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },
        ]
    }
    return data
  }

  /** 设置监听 **/
  /** 选择事件监听 **/
  _addGeometrySelectedListener = async () => {
    await SMap.addGeometrySelectedListener({
      geometrySelected: this.geometrySelected,
      geometryMultiSelected: this.geometryMultiSelected,
    })
  }

  _removeGeometrySelectedListener = async () => {
    await SMap.removeGeometrySelectedListener()
  }

  geometrySelected = event => {
    SMap.appointEditGeometry(event.id, event.layerInfo.name)
  }

  geometryMultiSelected = () => {
    // TODO 处理多选
  }

  _renderItem = ({ item, index }) => {
    return (
      <MTBtn
        style={styles.btn}
        key={index}
        title={item.title}
        textColor={'black'}
        size={MTBtn.Size.NORMAL}
        image={item.image}
        onPress={item.action}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <View style={styles.separator} />
  }

  _keyExtractor = (item, index) => index + '-' + item.title

  render() {
    if (this.props.hide) {
      return null
    }
    return (
      <Animated.View
        style={[
          styles.container,
          this.props.style,
          { right: this.state.right },
        ]}
      >
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          // ItemSeparatorComponent={this._renderItemSeparatorComponent}
          keyExtractor={this._keyExtractor}
        />
        <MoreToolbar
          ref={ref => (this.moreToolbar = ref)}
          data={this.getMoreData(this.props.type)}
        />
      </Animated.View>
    )
  }
}
