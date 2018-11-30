/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, FlatList, Animated } from 'react-native'
import { MTBtn } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import { scaleSize } from '../../../../utils'
import MoreToolbar from '../MoreToolbar'
import styles from './styles'

import { SScene, SMap, Action} from 'imobile_for_reactnative'
import Toast from 'react-native-root-toast'

const COLLECTION = 'COLLECTION'
const NETWORK = 'NETWORK'
const EDIT = 'EDIT'
const MAP_3D = 'MAP_3D'
const MAP_EDIT = 'MAP_EDIT'
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

  /** 一级事件 **/

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

  add = async () => {
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
          toolRef.setVisible(true, ConstToolType.MAP_ADD_LAYER, {
            containerType: 'list',
            isFullScreen: true,
            height: ConstToolType.HEIGHT[2],
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
    SScene.getLayerList().then(layerList => {
      const toolRef = this.props.getToolRef()
      if (toolRef) {
        toolRef.getOldLayerList(layerList)
        SScene.setAllLayersSelection(false)
      }
    })
    SScene.initsymbol().then(
      () => {
        const toolRef = this.props.getToolRef()
        if (toolRef) {
          this.props.showFullMap && this.props.showFullMap(true)
          // TODO 根据符号类型改变ToolBox内容
          toolRef.setVisible(true, ConstToolType.MAP3D_SYMBOL, {
            containerType: 'table',
            isFullScreen: false,
            column: 4,
            height: ConstToolType.HEIGHT[1],
          })
        }
      },
      () => {
        Toast.show('请打开工作场景')
      },
    )
  }

  showMap3DTool = async () => {
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
        SScene.setAllLayersSelection(false)
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
    await SMap.setAction(Action.SELECT)
    this.props.addGeometrySelectedListener &&
      (await this.props.addGeometrySelectedListener())
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      let type = ''
      switch (this.props.symbol.currentSymbol.type) {
        case 'marker':
          type = ConstToolType.MAP_EDIT_POINT
          break
        case 'line':
          type = ConstToolType.MAP_EDIT_LINE
          break
        case 'fill':
          type = ConstToolType.MAP_EDIT_REGION
          break
      }
      toolRef.setVisible(true, type, {
        isFullScreen: false,
        column: 4,
        height: ConstToolType.HEIGHT[2],
      })
    }
  }

  showMore = async e => {
    this.moreToolbar && this.moreToolbar.showMore(true, e)
  }

  showTool = async () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_TOOL, {
        isFullScreen: false,
        column: 4,
        height: ConstToolType.HEIGHT[2],
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
            height: ConstToolType.HEIGHT[2],
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
  openMap = () => {
    // NavigationService.navigate('WorkspaceFlieList', { type: "MAP_3D" })
  }

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
            action: this.showMore,
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
        data = [
          {
            title: '打开',
            action: this.openMap(),
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
