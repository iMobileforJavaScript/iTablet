/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, FlatList, Animated } from 'react-native'
import { MTBtn } from '../../../../components'
import { scaleSize } from '../../../../utils'
import MoreToolbar from '../MoreToolbar'
import styles from './styles'

const COLLECTION = 'COLLECTION'
const NETWORK = 'NETWORK'
const EDIT = 'EDIT'

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
  }

  setVisible = visible => {
    if (visible) {
      Animated.timing(this.state.right, {
        toValue: scaleSize(20),
        duration: 300,
      }).start()
    } else {
      Animated.timing(this.state.right, {
        toValue: scaleSize(-200),
        duration: 300,
      }).start()
    }
  }

  /** 一级事件 **/

  changeBaseLayer = () => {}

  showAddLayer = () => {}

  showSymbel = () => {}

  showCollection = () => {}

  showEdit = () => {}

  showTool = () => {}

  showMore = e => {
    this.moreToolbar && this.moreToolbar.showMore(true, e)
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
    }
    return data
  }

  /** 获取 更多 数据 **/
  getMoreData = type => {
    let data
    switch (type) {
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
