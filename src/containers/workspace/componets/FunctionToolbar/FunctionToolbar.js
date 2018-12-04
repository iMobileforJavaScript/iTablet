/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, FlatList, Animated } from 'react-native'
import { MTBtn } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import { scaleSize, Toast } from '../../../../utils'
// import MoreToolbar from '../MoreToolbar'
import styles from './styles'

import { SScene, SMap, Action } from 'imobile_for_reactnative'

const COLLECTION = 'COLLECTION'
const NETWORK = 'NETWORK'
const EDIT = 'EDIT'
const MAP_3D = 'MAP_3D'
const MAP_EDIT = 'MAP_EDIT'
const MAP_THEME = 'MAP_THEME'
export { COLLECTION, NETWORK, EDIT }

export default class FunctionToolbar extends React.Component {
  props: {
    style?: any,
    hide?: boolean,
    direction?: string,
    separator?: number,
    type: string,
    data?: Array,
    Label: () => {},

    getToolRef: () => {},
    showFullMap: () => {},
    setMapType: () => {},

    save: () => {},
    saveAs: () => {},
    closeOneMap: () => {},
    addGeometrySelectedListener: () => {},
    removeGeometrySelectedListener: () => {},
    symbol: Object,
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

  start = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_START, {
        containerType: 'table',
      })
    }
  }

  startTheme = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_THEME_START, {
        containerType: 'table',
        isFullScreen: true,
        column: 4,
        height: ConstToolType.HEIGHT[0],
      })
    }
  }

  changeBaseLayer = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)

      switch (this.props.type) {
        case 'MAP_3D':
          toolRef.setVisible(true, ConstToolType.MAP3D_BASE, {
            containerType: 'list',
          })
          break

        default:
          toolRef.setVisible(true, ConstToolType.MAP_BASE, {
            containerType: 'list',
            height: ConstToolType.HEIGHT[3],
          })
          break
      }
    }
  }

  showDataLists = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_OPEN, {
        containerType: 'list',
      })
    }
  }
  showAddLayer = async () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)

      switch (this.props.type) {
        case 'MAP_3D':
          toolRef.setVisible(true, ConstToolType.MAP3D_ADD_LAYER, {
            containerType: 'list',
            isFullScreen: true,
            height: ConstToolType.HEIGHT[3],
          })
          break

        default:
          toolRef.setVisible(true, ConstToolType.MAP_BASE, {
            containerType: 'list',
            isFullScreen: true,
            height: ConstToolType.HEIGHT[3],
          })
          break
      }
    }
  }
  showSymbol = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_SYMBOL, {
        isFullScreen: true,
        height: ConstToolType.HEIGHT[3],
      })
    }
  }

  showMap3DSymbol = async () => {
    SScene.checkoutListener('startLabelOperate')
    SScene.getLayerList().then(layerList => {
      const toolRef = this.props.getToolRef()
      if (toolRef) {
        toolRef.getOldLayerList(layerList)
        // SScene.setAllLayersSelection(false)
        this.props.showFullMap && this.props.showFullMap(true)
        // TODO 根据符号类型改变ToolBox内容
        toolRef.setVisible(true, ConstToolType.MAP3D_SYMBOL, {
          containerType: 'table',
          isFullScreen: false,
          column: 4,
          height: ConstToolType.HEIGHT[1],
        })
      }
    })
  }

  showMap3DTool = async () => {
    SScene.checkoutListener('startMeasure')
    SScene.getLayerList().then(layerList => {
      const toolRef = this.props.getToolRef()
      if (toolRef) {
        this.props.showFullMap && this.props.showFullMap(true)
        // TODO 根据符号类型改变ToolBox内容
        toolRef.setVisible(true, ConstToolType.MAP3D_TOOL, {
          containerType: 'table',
          isFullScreen: false,
          column: 4,
          height: ConstToolType.HEIGHT[1],
        })
        toolRef.getOldLayerList(layerList)
        // SScene.setAllLayersSelection(false)
      }
    })
  }

  showCollection = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      let type = ''
      switch (this.props.symbol.currentSymbol.type) {
        case 'marker':
          type = ConstToolType.MAP_COLLECTION_POINT
          break
        case 'line':
          type = ConstToolType.MAP_COLLECTION_LINE
          break
        case 'fill':
          type = ConstToolType.MAP_COLLECTION_REGION
          break
      }
      // 选中符号后打开对应的采集界面
      // 没有选择符号则打开符号选择界面
      if (type) {
        toolRef.setVisible(true, type, {
          isFullScreen: false,
        })
      } else {
        this.showSymbol()
      }
    }
  }

  showEdit = async () => {
    if (!this.props.symbol.currentSymbol.type) {
      Toast.show('请选择图层')
      return
    }
    await SMap.setAction(Action.SELECT)
    // this.props.addGeometrySelectedListener &&
    //   (await this.props.addGeometrySelectedListener())
    const toolRef = this.props.getToolRef()
    let height = ConstToolType.HEIGHT[3]
    let column = 4
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      let type = '',
        tableType = 'normal'
      switch (this.props.symbol.currentSymbol.type) {
        case 'marker':
          type = ConstToolType.MAP_EDIT_POINT
          height = ConstToolType.HEIGHT[0]
          column = 5
          break
        case 'line':
          type = ConstToolType.MAP_EDIT_LINE
          height = ConstToolType.HEIGHT[2]
          break
        case 'fill':
          type = ConstToolType.MAP_EDIT_REGION
          height = ConstToolType.HEIGHT[2]
          tableType = 'scroll'
          break
      }
      GLOBAL.currentToolbarType = type
      toolRef.setVisible(true, type, {
        isFullScreen: false,
        column,
        height,
        tableType,
      })
    }
  }

  showMore = async type => {
    // this.moreToolbar && this.moreToolbar.showMore(true, e)
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, type, {
        isFullScreen: true,
        column: 4,
        height: ConstToolType.HEIGHT[0],
      })
    }
  }

  showThemeCreate = async () => {
    // this.moreToolbar && this.moreToolbar.showMore(true, e)
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      // TODO 根据符号类型改变ToolBox 编辑内容
      toolRef.setVisible(true, ConstToolType.MAP_THEME_CREATE, {
        isFullScreen: true,
        column: 4,
        height: ConstToolType.HEIGHT[2],
      })
    }
  }

  showTool = async () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_TOOL, {
        isFullScreen: true,
        column: 4,
        height: ConstToolType.HEIGHT[3],
      })
    }
  }

  mapStyle = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_STYLE, {
        containerType: 'symbol',
        isFullScreen: false,
        column: 4,
        height: ConstToolType.HEIGHT[2],
      })
    }
  }

  Tagging = async () => {
    const toolRef = this.props.getToolRef()
    switch (this.props.type) {
      case 'MAP_3D':
        SScene.getLayerList().then(layerList => {
          const toolRef = this.props.getToolRef()
          if (toolRef) {
            toolRef.getOldLayerList(layerList)
            SScene.setAllLayersSelection(false)
          }
        })
        if (toolRef) {
          this.props.showFullMap && this.props.showFullMap(true)
          toolRef.setVisible(true, ConstToolType.MAP3D_TOOL, {
            isFullScreen: false,
          })
        }
        break

      case 'MAP_EDIT':
        if (toolRef) {
          this.props.showFullMap && this.props.showFullMap(true)
          // TODO 根据符号类型改变ToolBox 编辑内容
          toolRef.setVisible(true, ConstToolType.MAP_EDIT_TAGGING, {
            isFullScreen: false,
            column: 4,
            height: ConstToolType.HEIGHT[3],
          })
        }
        break

      default:
        if (toolRef) {
          this.props.showFullMap && this.props.showFullMap(true)
          toolRef.setVisible(true, ConstToolType.MAP_TOOL, {
            isFullScreen: false,
          })
        }
        break
    }
  }

  Label = () => {
    this.props.Label()
  }

  /** 二级事件 **/
  openOneMap = async e => {
    this.showDataLists()

    this.moreToolbar.showMore(false, e)
    this.props.setMapType('LOAD')
  }

  closeOneMap = async e => {
    this.props.closeOneMap()
    this.moreToolbar.showMore(false, e)
  }

  save = async e => {
    this.props.save()
    this.moreToolbar.showMore(false, e)
  }

  saveAs = async e => {
    this.props.saveAs()
    this.moreToolbar.showMore(false, e)
  }

  recent = () => {}

  share = () => {}

  /** 获取一级数据 **/
  getData = type => {
    let data
    switch (type) {
      case MAP_EDIT:
        data = [
          // {
          //   key: '底图',
          //   title: '底图',
          //   action: this.changeBaseLayer,
          //   size: 'large',
          //   image: require('../../../../assets/function/icon_function_base_map.png'),
          // },
          // {
          //   key: '添加',
          //   title: '添加',
          //   action: this.add,
          //   size: 'large',
          //   image: require('../../../../assets/function/icon_function_add.png'),
          // },
          {
            key: '开始',
            title: '开始',
            action: this.start,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: '标注',
            title: '标注',
            action: this.Tagging,
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
          // {
          //   title: '底图',
          //   action: this.changeBaseLayer,
          //   image: require('../../../../assets/function/icon_function_base_map.png'),
          // },
          // {
          //   title: '添加',
          //   action: this.add,
          //   image: require('../../../../assets/function/icon_function_add.png'),
          // },
          {
            title: '底图',
            action: this.changeBaseLayer,
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            title: '添加',
            action: this.showAddLayer,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '标注',
            action: this.showMap3DSymbol,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '工具',
            action: this.showMap3DTool,
            image: require('../../../../assets/function/icon_function_hand_draw.png'),
          },
          {
            title: '更多',
            action: () => {
              this.showMore(ConstToolType.MAP_MORE_MAP3D)
            },
            image: require('../../../../assets/function/icon_function_share.png'),
          },
        ]
        break
      case MAP_THEME:
        data = [
          {
            key: '开始',
            title: '开始',
            action: this.startTheme,
            size: 'large',
            image: require('../../../../assets/function/icon_function_theme_start.png'),
          },
          {
            key: '专题图',
            title: '专题图',
            action: this.showThemeCreate,
            size: 'large',
            image: require('../../../../assets/function/icon_function_theme_create.png'),
            selectMode: 'flash',
          },
          {
            key: '参数',
            title: '参数',
            size: 'large',
            image: require('../../../../assets/function/icon_function_theme_param.png'),
            selectMode: 'flash',
          },
          {
            key: '标注',
            title: '标注',
            size: 'large',
            image: require('../../../../assets/function/icon_function_theme_label.png'),
            selectMode: 'flash',
          },
          {
            key: '工具',
            title: '工具',
            action: this.showTool,
            size: 'large',
            image: require('../../../../assets/function/icon_function_theme_tools.png'),
            selectMode: 'flash',
          },
          {
            key: '撤销',
            title: '撤销',
            image: require('../../../../assets/function/icon_function_theme_revert.png'),
          },
          {
            key: '更多',
            title: '更多',
            action: this.showMore,
            image: require('../../../../assets/function/icon_function_theme_more.png'),
          },
        ]
        break
      case COLLECTION:
      default:
        data = [
          // {
          //   title: '底图',
          //   action: this.changeBaseLayer,
          //   image: require('../../../../assets/function/icon_function_base_map.png'),
          // },
          // {
          //   title: '添加',
          //   action: this.add,
          //   image: require('../../../../assets/function/icon_function_add.png'),
          // },
          {
            key: '开始',
            title: '开始',
            action: this.start,
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          // {
          //   title: '符号',
          //   action: this.showSymbol,
          //   image: require('../../../../assets/function/icon_function_add.png'),
          // },
          {
            title: '采集',
            action: this.showSymbol,
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
            action: () => {
              this.showMore(ConstToolType.MAP_MORE)
            },
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
            action: this.openOneMap,
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            title: '关闭',
            action: this.closeOneMap,
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
        data = [
          {
            title: '打开',
            action: this.open3DMap,
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          // {
          //   title: '关闭',
          //   action: this.closeMap(),
          //   image: require('../../../../assets/function/icon_function_add.png'),
          // },
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
      case COLLECTION:
      default:
        data = [
          {
            title: '打开',
            action: this.openOneMap,
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            title: '关闭',
            action: this.closeOneMap,
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
        {/*<MoreToolbar*/}
        {/*ref={ref => (this.moreToolbar = ref)}*/}
        {/*data={this.getMoreData(this.props.type)}*/}
        {/*/>*/}
      </Animated.View>
    )
  }
}
