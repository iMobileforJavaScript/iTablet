import * as React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { constUtil, scaleSize, Toast } from '../../utils'
import { ListSeparator } from '../../components'
import { Const } from '../../constains'
import PropTypes from 'prop-types'
import { Action } from 'imobile_for_reactnative'

import MT_Btn from './MT_Btn'

const WIDTH = constUtil.WIDTH
const ITEM_HEIGHT = 0.75 * 1.4 * 0.1 * WIDTH
const ITEM_WIDTH = ITEM_HEIGHT
const BORDERCOLOR = constUtil.USUAL_SEPARATORCOLOR

// const ADD_LAYER = 'add_layer'
// const COLLECTION = 'collection'
// const DATA_EDIT = 'data_edit'
// const MAP_MANAGER = 'map_manager'
// const DATA_MANAGER = 'data_manager'
// const ANALYST = 'analyst'
// const TOOLS = 'tools'

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
    setEditLayer: PropTypes.func,
    editLayer: PropTypes.any,
    style: PropTypes.any,
    mapControl: PropTypes.any,
    hidden: PropTypes.bool,
  }

  static defaultProps = {
    type: MAP_LOCAL,
    hidden: false,
    editLayer: {},
  }

  constructor(props) {
    super(props)

    this.show = false
    this.oldPress = null
    this.type = ''

    this.state = {
      data:
        props.type === MAP_LOCAL
          ? [
            {
              key: '新建图层',
              title: '新建图层',
              image: require('../../assets/map/icon-add-layer.png'),
              btnClick: this._addLayer,
            },
            {
              key: '数据采集',
              title: '数据采集',
              image: require('../../assets/map/icon-data-collection.png'),
              btnClick: this._dataCollection,
            },
            {
              key: '数据编辑',
              title: '数据编辑',
              image: require('../../assets/map/icon-data-edit.png'),
              btnClick: this._dataEdit,
            },
            {
              key: '地图管理',
              title: '地图管理',
              image: require('../../assets/map/icon-map-management.png'),
              btnClick: this._layerManager,
            },
            {
              key: '数据管理',
              title: '数据管理',
              image: require('../../assets/map/icon-data-manangement.png'),
              btnClick: this._dataManager,
            },
            {
              key: '数据分析',
              title: '数据分析',
              image: require('../../assets/map/icon-analyst.png'),
              btnClick: this._analyst,
            },
            {
              key: '工具',
              title: '工具',
              image: require('../../assets/map/icon-tool.png'),
              btnClick: this._tools,
            },
          ]
          : [
            {
              key: '地图管理',
              image: require('../../assets/map/icon-map-management.png'),
              btnClick: this._layerManager,
            },
          ],
    }
  }

  _showManager = newPress => {
    GLOBAL.toolType = newPress
    if (this.oldPress && this.oldPress === newPress) {
      this.show = !this.show
    } else if (
      (newPress === Const.ADD_LAYER ||
        newPress === Const.MAP_MANAGER ||
        newPress === Const.DATA_MANAGER) &&
      this.show
    ) {
      this.show = false
      this.type = newPress
      this.oldPress = newPress
    } else {
      this.show = true
      this.type = newPress
      this.oldPress = newPress
    }
  }

  /**
   * 设置可编辑图层的可编辑状态
   * 除了数据编辑和地图管理之外，其余操作可编辑图层时，均为不可编辑状态
   * @param editable
   * @returns {Promise.<void>}
   */
  setLayerEditable = async (editable = false) => {
    if (!this.props.editLayer.id) return
    if (this.props.editLayer.isEditable !== editable) {
      await this.props.editLayer.layer.setEditable(editable)
      let newLayer = this.props.editLayer
      newLayer.isEditable = await this.props.editLayer.layer.getEditable()

      if (GLOBAL.toolType !== Const.DATA_EDIT) {
        await this.props.mapControl.setAction(Action.SELECT)
      }

      this.props.setEditLayer(newLayer)
    }
  }

  _addLayer = () => {
    this._showManager(Const.ADD_LAYER)
    this.props.POP_List && this.props.POP_List(false, null)
    this.props.addLayer && this.props.addLayer()
  }

  _dataCollection = async () => {
    await this.setLayerEditable(false)
    this._showManager(Const.COLLECTION)
    if (
      this.props.editLayer.type !== undefined &&
      this.props.editLayer.type >= 0
    ) {
      this.props.POP_List && this.props.POP_List(this.show, this.type)
      let name = this.props.editLayer ? this.props.editLayer.name : ''
      this.show && name && Toast.show('当前采集图层为\n' + name)
    } else {
      this.props.POP_List && this.props.POP_List(false, null)
      this.props.chooseLayer &&
        this.props.chooseLayer(
          {
            type: -1,
            isEdit: true,
            title: '选择采集图层',
          },
          isShow => {
            // 传 -1 查询所有类型的图层
            if (this.props.POP_List) {
              this.props.POP_List(isShow, this.type)
            }
          },
        )
    }
  }

  _dataEdit = async () => {
    await this.setLayerEditable(true)
    this._showManager(Const.DATA_EDIT)
    if (
      this.props.editLayer.type !== undefined &&
      this.props.editLayer.type >= 0
    ) {
      let name = this.props.editLayer.name ? this.props.editLayer.name : ''
      this.show && name && Toast.show('当前可编辑的图层为\n' + name)
      this.props.POP_List && this.props.POP_List(this.show, this.type)
    } else {
      this.props.POP_List && this.props.POP_List(false, null)
      this.props.chooseLayer &&
        this.props.chooseLayer(
          {
            type: -1,
            isEdit: true,
            title: '选择编辑图层',
          },
          isShow => {
            // 传 -1 查询所有类型的图层
            if (this.props.POP_List) {
              this.props.POP_List(isShow, this.type)
            }
          },
        )
    }
  }

  _layerManager = async () => {
    await this.setLayerEditable(true)
    this._showManager(Const.MAP_MANAGER)
    this.props.POP_List && this.props.POP_List(false, null)
    this.props.layerManager && this.props.layerManager()
  }

  _dataManager = () => {
    this._showManager(Const.DATA_MANAGER)
    this.props.POP_List && this.props.POP_List(false, null)
    this.props.dataManager && this.props.dataManager()
  }

  _analyst = async () => {
    await this.setLayerEditable(false)
    this._showManager(Const.ANALYST)
    this.props.POP_List && this.props.POP_List(this.show, this.type)
  }

  _tools = () => {
    this._showManager(Const.TOOLS)
    this.props.POP_List && this.props.POP_List(this.show, this.type)
  }

  _renderItem = ({ item }) => {
    let key = item.key
    let image = item.image
    let btnClick = item.btnClick
    // let width = (ITEM_WIDTH < WIDTH / this.state.data.length) ? WIDTH / this.state.data.length : ITEM_WIDTH
    let width = ITEM_WIDTH < WIDTH / 6 ? WIDTH / 6 : ITEM_WIDTH
    return (
      <View style={[styles.item, { width: width }]}>
        <MT_Btn title={key} image={image} onPress={btnClick} />
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
      <View
        style={[
          this.props.hidden ? styles.hiddenContainer : styles.container,
          this.props.style,
        ]}
      >
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

// MT_BtnList.Operation = {
//   ADD_LAYER: 'add_layer',
//   COLLECTION: 'collection',
//   DATA_EDIT: 'data_edit',
//   MAP_MANAGER: 'map_manager',
//   DATA_MANAGER: 'data_manager',
//   ANALYST: 'analyst',
//   TOOLS: 'tools',
// }

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
