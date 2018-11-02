import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { constUtil, scaleSize, Toast } from '../../../../utils/index'
import { color } from '../../../../styles/index'
import { ListSeparator } from '../../../../components/index'
import { Const } from '../../../../constants/index'
import constants from '../../constants'
import PropTypes from 'prop-types'
import { Action } from 'imobile_for_reactnative'

import MT_Btn from '../../../../components/mapTools/MT_Btn'

// const WIDTH = constUtil.WIDTH
// const ITEM_HEIGHT = 0.75 * 1.4 * 0.1 * WIDTH
// const ITEM_WIDTH = ITEM_HEIGHT
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

export default class MapToolbar extends React.Component {
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
    type: constants.COLLECTION,
    hidden: false,
    editLayer: {},
  }

  constructor(props) {
    super(props)

    this.show = false
    this.oldPress = null
    this.type = ''
    const data = this.getToolbar(props.type)

    this.state = {
      data: data,
    }
  }

  getToolbar = type => {
    let list = []
    switch (type) {
      case constants.MAP_EDIT:
      case constants.COLLECTION:
        list = [
          {
            key: '地图',
            title: '地图',
            image: require('../../../../assets/mapToolbar/icon_map.png'),
            // selectedImage: require('../../../assets/mapToolbar/icon_map_selected.png'),
            btnClick: () => {},
          },
          {
            key: '图层',
            title: '图层',
            image: require('../../../../assets/mapToolbar/icon_layer.png'),
            // selectedImage: require('../../../assets/mapToolbar/icon_layer_selected.png'),
            btnClick: this._layerManager,
          },
          {
            key: '属性',
            title: '属性',
            image: require('../../../../assets/mapToolbar/icon_attribute.png'),
            // selectedImage: require('../../../assets/mapToolbar/icon_attribute_selected.png'),
            btnClick: () => {},
          },
          {
            key: '设置',
            title: '设置',
            image: require('../../../../assets/mapToolbar/icon_setting.png'),
            // selectedImage: require('../../../assets/mapToolbar/icon_setting_selected.png'),
            btnClick: () => {},
          },
        ]
        break
      case constants.Map3D:
        list = [
          {
            key: '地图管理',
            image: require('../../../../assets/map/icon-map-management.png'),
            btnClick: this._layerManager,
          },
        ]
        break
    }
    return list
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
    return (
      <MT_Btn
        key={key}
        title={key}
        textColor={'white'}
        // size={'small'}
        // separator={scaleSize(10)}
        image={image}
        onPress={btnClick}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator mode={ListSeparator.mode.VERTICAL} />
  }

  _keyExtractor = item => item.key

  renderItems = data => {
    let toolbar = []
    data.forEach(item => {
      toolbar.push(this._renderItem({ item }))
    })
    return toolbar
  }

  render() {
    return (
      <View
        style={[
          this.props.hidden ? styles.hiddenContainer : styles.container,
          this.props.style,
        ]}
      >
        {/*<FlatList*/}
        {/*data={this.state.data}*/}
        {/*renderItem={this._renderItem}*/}
        {/*// ItemSeparatorComponent={this._renderItemSeparatorComponent}*/}
        {/*keyExtractor={this._keyExtractor}*/}
        {/*horizontal={true}*/}
        {/*/>*/}
        {this.renderItems(this.state.data)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  // item: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   height: scaleSize(80),
  //   width: '100%',
  // },
  container: {
    position: 'absolute',
    bottom: 0,
    height: scaleSize(80),
    width: '100%',
    backgroundColor: color.theme,
    alignSelf: 'center',
    borderStyle: 'solid',
    borderColor: BORDERCOLOR,
    borderTopWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
