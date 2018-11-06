/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, FlatList, Platform, NativeModules } from 'react-native'
import { MTBtn } from '../../../../components'
import MoreToolbar from '../MoreToolbar'
import styles from './styles'

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
    showTool: () => {},
    Label: () => {},
    changeLayer: () => {},
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
    }
  }

  /** 一级事件 **/

  changeBaseLayer = () => {}

  showAddLayer = () => {}

  showSymbel = () => {}

  showCollection = () => {}

  showEdit = () => {}

  showMore = e => {
    this.moreToolbar && this.moreToolbar.showMore(true, e)
  }

  changeLayer = () => {
    this.props.changeLayer()
  }

  showTool = () => {
    this.props.showTool()
  }

  add = () => {
    this.props.showLayers()
  }

  Label = () => {
    this.props.Label()
  }

  mapstyle = () => {
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
            action: this.changeLayer,
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
            action: this.Label,
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
            action: this.mapstyle,
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
            key: '分享',
            title: '分享',
            action: this.publish,
            size: 'large',
            image: require('../../../../assets/function/icon_function_tool.png'),
            selectMode: 'flash',
          },
        ]
        break
      case COLLECTION:
      case MAP_3D:
        data = [
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
            action: this.showSymbel,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '工具',
            action: this.showCollection,
            image: require('../../../../assets/function/icon_function_hand_draw.png'),
          },
          {
            title: '更多',
            action: this.showMore,
            image: require('../../../../assets/function/icon_function_share.png'),
          },
        ]
        break
      default:
        data = [
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
            title: '符号',
            action: this.showSymbel,
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
      case COLLECTION:
        break
      case MAP_3D:
        break
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
      <View style={[styles.container, this.props.style]}>
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
      </View>
    )
  }
}
