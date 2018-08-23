import * as React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { constUtil, scaleSize, Toast } from '../../utils'
import { ListSeparator } from '../../components'
import PropTypes from 'prop-types'

import MT_Btn from './MT_Btn'

const WIDTH = constUtil.WIDTH
const ITEM_HEIGHT = 0.75 * 1.4 * 0.1 * WIDTH
const ITEM_WIDTH = ITEM_HEIGHT
const BORDERCOLOR = constUtil.USUAL_SEPARATORCOLOR

const ADD_LAYER = 'add_layer'
const COLLECTION = 'collection'
const DATA_EDIT = 'data_edit'
const MAP_MANAGER = 'map_manager'
const DATA_MANAGER = 'data_manager'
const ANALYST = 'analyst'
const TOOLS = 'tools'

let show = false
let oldPress = null
let type = ''

export const MAP_LOCAL = 'MAP_LOCAL'
export const MAP_3D = 'MAP_3D'

export default class MT_BtnList extends React.Component {

  static propTypes = {
    type: PropTypes.string,
    POP_List: PropTypes.func,
    dataCollection: PropTypes.func,
    layerManager: PropTypes.func,
    dataManager: PropTypes.func,
    addLayer: PropTypes.func,
    chooseLayer: PropTypes.func,
    editLayer: PropTypes.any,
    style: PropTypes.any,
    hidden: PropTypes.bool,
  }

  static defaultProps = {
    type: MAP_LOCAL,
    hidden: false,
    editLayer: {},
  }

  constructor(props) {
    super(props)

    this.state = {
      data: props.type === MAP_LOCAL
        ? [
          { key: '新建图层', image: require('../../assets/map/icon-add-layer.png'), btnClick: this._addLayer },
          { key: '数据采集', image: require('../../assets/map/icon-data-collection.png'), btnClick: this._dataCollection },
          { key: '数据编辑', image: require('../../assets/map/icon-data-edit.png'), btnClick: this._dataEdit },
          { key: '地图管理', image: require('../../assets/map/icon-map-management.png'), btnClick: this._layerManager },
          { key: '数据管理', image: require('../../assets/map/icon-data-manangement.png'), btnClick: this._dataManager },
          { key: '数据分析', image: require('../../assets/map/icon-analyst.png'), btnClick: this._analyst },
          { key: '工具', image: require('../../assets/map/icon-tool.png'), btnClick: this._tools },
        ]
        : [{ key: '地图管理', image: require('../../assets/map/icon-map-management.png'), btnClick: this._layerManager }],
    }
  }

  _showManager = newPress => {
    if (oldPress && (oldPress === newPress)) {
      show = !show
    } else if (
      (newPress === ADD_LAYER || newPress === MAP_MANAGER || newPress === DATA_MANAGER)
      && show
    ) {
      show = false
      type = newPress
      oldPress = newPress
    } else {
      show = true
      type = newPress
      oldPress = newPress
    }
  }

  _addLayer = () => {
    this._showManager(ADD_LAYER)
    this.props.POP_List && this.props.POP_List(false, null)
    this.props.addLayer && this.props.addLayer()
  }

  _dataCollection = () => {
    this._showManager(COLLECTION)
    if (this.props.editLayer.type !== undefined && this.props.editLayer.type >= 0) {
      this.props.POP_List && this.props.POP_List(show, type)
      let name = this.props.editLayer ? this.props.editLayer.name : ''
      show && name && Toast.show('当前可编辑的图层为\n' + name)
    } else {
      this.props.POP_List && this.props.POP_List(false, null)
      this.props.chooseLayer && this.props.chooseLayer(-1, true, isShow => { // 传 -1 查询所有类型的图层
        if (this.props.POP_List) {
          this.props.POP_List(isShow, type)
        }
      })
    }
  }

  _dataEdit = () => {
    this._showManager(DATA_EDIT)
    let name = this.props.editLayer ? this.props.editLayer.name : ''
    show && name && Toast.show('当前可编辑的图层为\n' + name)
    this.props.POP_List && this.props.POP_List(show, type)
  }

  _layerManager = () => {
    this._showManager(MAP_MANAGER)
    this.props.POP_List && this.props.POP_List(false, null)
    this.props.layerManager && this.props.layerManager()
  }

  _dataManager = () => {
    this._showManager(DATA_MANAGER)
    this.props.POP_List && this.props.POP_List(false, null)
    this.props.dataManager && this.props.dataManager()
  }

  _analyst = () => {
    this._showManager(ANALYST)
    this.props.POP_List && this.props.POP_List(show, type)
  }

  _tools = () => {
    this._showManager(TOOLS)
    this.props.POP_List && this.props.POP_List(show, type)
  }

  _renderItem = ({ item }) => {
    let key = item.key
    let image = item.image
    let btnClick = item.btnClick
    // let width = (ITEM_WIDTH < WIDTH / this.state.data.length) ? WIDTH / this.state.data.length : ITEM_WIDTH
    let width = (ITEM_WIDTH < WIDTH / 6) ? WIDTH / 6 : ITEM_WIDTH
    return (
      <View style={[styles.item, { width: width }]}>
        <MT_Btn BtnText={key} image={image} BtnClick={btnClick} />
      </View>
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator mode={ListSeparator.mode.VERTICAL} />
  }

  _keyExtractor = item => item.key

  render() {
    const data = this.state.data
    // TODO BUG 临时处理 hidden map和map3d在关闭的时候会出现部分黑屏，必须要有可渲染的其他组件在屏幕上，才能正常关闭
    return (
      <View style={[this.props.hidden ? styles.hiddenContainer : styles.container, this.props.style]}>
        <FlatList
          data={data}
          renderItem={this._renderItem}
          // ItemSeparatorComponent={this._renderItemSeparatorComponent}
          keyExtractor={this._keyExtractor}
          horizontal={true}
        />
      </View>
    )
  }
}

MT_BtnList.Operation = {
  ADD_LAYER: 'add_layer',
  COLLECTION: 'collection',
  DATA_EDIT: 'data_edit',
  MAP_MANAGER: 'map_manager',
  DATA_MANAGER: 'data_manager',
  ANALYST: 'analyst',
  TOOLS: 'tools',
}

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(100),
    width: '100%',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    height: scaleSize(100),
    width: '100%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderStyle: 'solid',
    borderColor: BORDERCOLOR,
    borderTopWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    zIndex: 100,
  },
  hiddenContainer: {
    position: 'absolute',
    bottom: 0,
    height: scaleSize(100),
    width: '100%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderStyle: 'solid',
    borderColor: BORDERCOLOR,
    borderTopWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    zIndex: -1,
  },
})