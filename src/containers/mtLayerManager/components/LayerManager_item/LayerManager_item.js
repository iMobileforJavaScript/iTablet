/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { DatasetType, ThemeType } from 'imobile_for_reactnative'
import { Toast, scaleSize } from '../../../../utils/index'
import { Const } from '../../../../constants/index'
import NavigationService from '../../../NavigationService'
import SwipeOut from 'react-native-swipeout'
import styles from './styles'
import { color } from '../../../../styles'
import { getThemeAssets } from '../../../../assets'

const LAYER_GROUP = 'layerGroup'

export default class LayerManager_item extends React.Component {
  props: {
    layer: Object,
    map: Object,
    data: Object,
    mapControl: Object,
    isClose: boolean,
    swipeEnabled: boolean,
    hasSelected: boolean, // 是否有选择Radio
    selected: boolean, // 选择Radio
    operable: boolean,
    showRenameDialog: () => {},
    showRemoveDialog: () => {},
    setEditable: () => {},
    onArrowPress: () => {},
    onPress: () => {},
    onAllPress: () => {},
    onToolPress: () => {},
    onOpen: () => {},
    child: Array,
    sectionID: number,
    rowID: number,
    selectLayer: Object,

    setLayerVisible: () => {},
  }

  static defaultProps = {
    isClose: true,
    swipeEnabled: false,
    hasSelected: false,
    selected: false,
    operable: true,
    child: [],
  }

  constructor(props) {
    super(props)
    let data = this.props.data
    let options = this.getOptions(data)
    let { showLevelOne, showLevelTwo, isVectorLayer } = this.getValidate(data)
    this.state = {
      selected: props.selected,
      options: options,
      editable: data.isEditable,
      visable: data.isVisible,
      selectable: data.isSelectable,
      snapable: data.isSnapable,
      rowShow: false,
      image: this.getStyleIconByType(data),
      showLevelOne: showLevelOne,
      showLevelTwo: showLevelTwo,
      isVectorLayer: isVectorLayer,
      isClose: false,
      child: props.child,
      sectionID: props.sectionID || 0,
      rowID: props.rowID || 0,
    }
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.getData(this.props.data)
    }
  }

  getValidate = data => {
    let isThemeLayer = false,
      showLevelOne = true,
      isVectorLayer = false
    switch (data.themeType) {
      case 0: // 非专题图层
        isThemeLayer = false
        showLevelOne = true
        break
      case ThemeType.UNIQUE:
      case ThemeType.RANGE:
        isThemeLayer = true
        showLevelOne = true
        break
      case ThemeType.LABEL:
      default:
        isThemeLayer = true
        showLevelOne = false
        break
    }
    let showLevelTwo =
      data.type !== DatasetType.CAD && data.type !== LAYER_GROUP
    if (
      data.type === DatasetType.CAD ||
      data.type === DatasetType.LINE ||
      data.type === DatasetType.LINE3D ||
      data.type === DatasetType.POINT ||
      data.type === DatasetType.POINT3D ||
      data.type === DatasetType.REGION ||
      data.type === DatasetType.REGION3D ||
      data.type === DatasetType.TEXT ||
      data.type === DatasetType.TABULAR
    ) {
      isVectorLayer = true
    }

    return { isThemeLayer, showLevelOne, showLevelTwo, isVectorLayer }
  }

  getData = (data = this.props.data) => {
    (async function() {
      let options = this.getOptions(data)
      let { showLevelOne, isVectorLayer } = this.getValidate(data)
      this.setState({
        showLevelOne: !showLevelOne,
        isVectorLayer: isVectorLayer,
        options: options,
        editable: data.isEditable && !showLevelOne,
        // visable: data.isVisible && !showLevelOne,
        visable: data.isVisible,
        selectable: data.isSelectable && !showLevelOne,
        snapable: data.isSnapable && !showLevelOne,
        rowShow: this.state.rowShow || false,
        image: this.getStyleIconByType(data),
      })
    }.bind(this)())
  }

  updateEditable = () => {
    (async function() {
      let idEditable = await this.props.layer.getEditable()
      this.setState({
        editable: idEditable,
      })
    }.bind(this)())
  }

  getOptions = data => {
    let { isThemeLayer, isVectorLayer } = this.getValidate(data)
    let options = []

    if (
      !isThemeLayer &&
      isVectorLayer &&
      this.props.data.type !== DatasetType.TEXT &&
      this.props.data.type !== DatasetType.CAD
    ) {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-theme-white.png')}
            />
          </View>
        ),
        onPress: this._openTheme,
      })
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-style-white.png')}
            />
          </View>
        ),
        onPress: this._openStyle,
      })
    } else if (isThemeLayer || this.props.data.type === DatasetType.CAD) {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-theme-white.png')}
            />
          </View>
        ),
        onPress: this._openTheme,
      })
    }
    options.push({
      component: (
        <View style={styles.btnImageView}>
          <Image
            resizeMode={'contain'}
            style={styles.btnImage}
            source={require('../../../../assets/mapEdit/icon-rename-white.png')}
          />
        </View>
      ),
      onPress: this._rename,
    })

    if (this.props.data.type === 'layerGroup') {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-ungroup-white.png')}
            />
          </View>
        ),
        onPress: this._unGroup,
      })
    } else {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-delete-white.png')}
            />
          </View>
        ),
        onPress: this._remove,
      })
    }

    return options
  }

  action = () => {
    Toast.show('待做')
  }

  _visable_change = () => {
    this.setState(oldstate => {
      let oldVisibe = oldstate.visable
      ;(async function() {
        this.props.setLayerVisible(this.props.data, !oldVisibe)
      }.bind(this)())
      return { visable: !oldVisibe }
    })
  }

  _openTheme = () => {
    let title = '',
      themeType = ''
    switch (this.props.data.themeType) {
      case ThemeType.LABEL:
        title = Const.LABEL
        break
      case ThemeType.UNIQUE:
        title = Const.UNIQUE
        break
      case ThemeType.RANGE:
        title = Const.RANGE
        break
    }
    if (this.props.data.type === DatasetType.CAD) {
      title = Const.LABEL
      themeType = ThemeType.LABEL
    }
    if (title) {
      let editLayer = this.props.layer
      Object.assign(editLayer, {
        index: this.props.data.index,
        themeType: themeType || this.props.data.themeType,
        name: this.props.data.name,
        caption: this.props.data.caption,
      })
      NavigationService.navigate('ThemeEdit', {
        title,
        layer: this.props.layer,
        map: this.props.map,
        mapControl: this.props.mapControl,
        isThemeLayer: !themeType,
      })
    } else {
      NavigationService.navigate('ThemeEntry', {
        layer: this.props.layer,
        map: this.props.map,
        mapControl: this.props.mapControl,
      })
    }
  }

  _openStyle = () => {
    NavigationService.navigate('ThemeStyle', {
      layer: this.props.layer,
      map: this.props.map,
      mapControl: this.props.mapControl,
      type: this.props.data.type,
    })
  }

  _rename = () => {
    this.props.showRenameDialog &&
      this.props.showRenameDialog(true, this.props.layer)
  }

  _remove = () => {
    this.props.showRemoveDialog &&
      this.props.showRemoveDialog(true, this.props.data, '是否要删除该图层？')
  }

  _unGroup = () => {
    this.props.showRemoveDialog &&
      this.props.showRemoveDialog(true, this.props.data, '是否要解散该图层组？')
  }

  _pop_row = async () => {
    if (this.props.onPress) {
      await this.props.onPress({
        data: this.props.data,
      })
    } else return
  }

  _all_pop_row = async () => {
    if (this.props.onAllPress) {
      await this.props.onAllPress({
        data: this.props.data,
      })
    } else return
  }

  _tool_row = async () => {
    if (this.props.onToolPress) {
      await this.props.onToolPress({
        data: this.props.data,
      })
    } else return
  }

  _arrow_pop_row = async () => {
    let isShow = !this.state.rowShow
    if (this.props.data.type === 'layerGroup') {
      let child = []
      if (isShow) {
        child =
          (this.props.onArrowPress &&
            (await this.props.onArrowPress({
              layer: this.props.data.layer,
              data: this.props.data,
              // sectionID: this.state.sectionID,
            }))) ||
          []
      }
      this.setState({
        rowShow: isShow,
        child: child,
      })
    } else {
      this.setSelected(!this.state.selected, async () => {
        this.props.onPress &&
          (await this.props.onPress({
            data: this.props.data,
          }))
      })
    }
  }

  updateChild = (child = []) => {
    this.setState({
      child: child,
    })
  }

  _renderAdditionView = () => {
    return <View style={styles.additionView}>{this.state.child}</View>
  }

  getStyleIconByType = item => {
    if (item.themeType > 0) {
      if (this.props.selectLayer === this.props.data.caption) {
        return this.getThemeWhiteIconByType(item.themeType)
      } else {
        return this.getThemeIconByType(item.themeType)
      }
    } else {
      if (this.props.selectLayer === this.props.data.caption) {
        return this.getLayerWhiteIconByType(item.type)
      } else {
        return this.getLayerIconByType(item.type)
      }
    }
  }

  getThemeWhiteIconByType = type => {
    let icon
    switch (type) {
      case ThemeType.UNIQUE: // 单值专题图
        icon = require('../../../../assets/map/layers_theme_unique_style.png')
        break
      case ThemeType.RANGE: // 分段专题图
        icon = require('../../../../assets/map/layers_theme_range_style.png')
        break
      case ThemeType.LABEL: // 标签专题图
        icon = require('../../../../assets/map/layers_theme_unify_label_style.png')
        break
      case ThemeType.GRAPH: // 统计专题图
        icon = getThemeAssets().themeType.theme_graphmap_selected
        break
      case ThemeType.DOTDENSITY: // 点密度专题图
        icon = getThemeAssets().themeType.theme_dot_density_selected
        break
      case ThemeType.GRADUATEDSYMBOL: // 等级符号专题图
        icon = getThemeAssets().themeType.theme_graduated_symbol_selected
        break
      case ThemeType.GRIDUNIQUE: // 栅格单值专题图
        icon = getThemeAssets().themeType.theme_grid_unique_selected
        break
      case ThemeType.GRIDRANGE: // 栅格分段专题图
        icon = getThemeAssets().themeType.theme_grid_range_selected
        break
      default:
        icon = require('../../../../assets/public/mapLoad.png')
        break
    }
    return icon
  }

  getThemeIconByType = type => {
    let icon
    switch (type) {
      case ThemeType.UNIQUE: // 单值专题图
        icon = require('../../../../assets/map/layers_theme_unique_style_black.png')
        break
      case ThemeType.RANGE: // 分段专题图
        icon = require('../../../../assets/map/layers_theme_range_style_black.png')
        break
      case ThemeType.LABEL: // 标签专题图
        icon = require('../../../../assets/map/layers_theme_unify_label_style_black.png')
        break
      case ThemeType.GRAPH: // 统计专题图
        icon = getThemeAssets().themeType.theme_graphmap
        break
      case ThemeType.DOTDENSITY: // 点密度专题图
        icon = getThemeAssets().themeType.theme_dot_density
        break
      case ThemeType.GRADUATEDSYMBOL: // 等级符号专题图
        icon = getThemeAssets().themeType.theme_graduated_symbol
        break
      case ThemeType.GRIDUNIQUE: // 栅格单值专题图
        icon = getThemeAssets().themeType.theme_grid_unique
        break
      case ThemeType.GRIDRANGE: // 栅格分段专题图
        icon = getThemeAssets().themeType.theme_grid_range
        break
      default:
        icon = require('../../../../assets/public/mapLoad.png')
        break
    }
    return icon
  }

  getLayerWhiteIconByType = type => {
    let icon
    switch (type) {
      case LAYER_GROUP:
        icon = require('../../../../assets/map/icon-directory.png')
        break
      case DatasetType.POINT: // 点数据集
        icon = require('../../../../assets/map/icon-shallow-dot.png')
        break
      case DatasetType.LINE: // 线数据集
        icon = require('../../../../assets/map/icon-shallow-line.png')
        break
      case DatasetType.REGION: // 多边形数据集
        icon = require('../../../../assets/map/icon-shallow-polygon.png')
        break
      case DatasetType.TEXT: // 文本数据集
        icon = require('../../../../assets/map/icon-shallow-text.png')
        break
      case DatasetType.IMAGE: // 影像数据集
        icon = require('../../../../assets/map/icon-shallow-image.png')
        break
      case DatasetType.CAD: // 复合数据集
        icon = require('../../../../assets/map/icon-cad.png')
        break
      case DatasetType.Network: // 复合数据集
        icon = require('../../../../assets/map/icon-network.png')
        break
      case DatasetType.GRID: // GRID数据集
        icon = require('../../../../assets/map/icon-grid.png')
        break
      default:
        icon = require('../../../../assets/public/mapLoad.png')
        break
    }
    return icon
  }

  getLayerIconByType = type => {
    let icon
    switch (type) {
      case LAYER_GROUP:
        icon = require('../../../../assets/map/icon-directory.png')
        break
      case DatasetType.POINT: // 点数据集
        icon = require('../../../../assets/map/icon-shallow-dot_black.png')
        break
      case DatasetType.LINE: // 线数据集
        icon = require('../../../../assets/map/icon-shallow-line_black.png')
        break
      case DatasetType.REGION: // 多边形数据集
        icon = require('../../../../assets/map/icon-shallow-polygon_black.png')
        break
      case DatasetType.TEXT: // 文本数据集
        icon = require('../../../../assets/map/icon-shallow-text_black.png')
        break
      case DatasetType.IMAGE: // 影像数据集
        icon = require('../../../../assets/map/icon-shallow-image_black.png')
        break
      case DatasetType.CAD: // 复合数据集
        icon = require('../../../../assets/map/icon-cad_black.png')
        break
      case DatasetType.Network: // 复合数据集
        icon = require('../../../../assets/map/icon-network.png')
        break
      case DatasetType.GRID: // GRID数据集
        icon = require('../../../../assets/map/icon-grid_black.png')
        break
      default:
        icon = require('../../../../assets/public/mapLoad.png')
        break
    }
    return icon
  }

  close = () => {
    this.setState({
      isClose: true,
    })
  }

  /**
   * 设置是否选择
   * @param isSelect
   * @param cb
   */
  setSelected = (isSelect, cb?: () => {}) => {
    let select = isSelect
    if (isSelect === null) {
      select = !this.state.selected
    }
    this.setState(
      {
        selected: select,
      },
      () => {
        cb && cb(this.props.data)
      },
    )
  }

  renderRadioBtn = () => {
    let viewStyle = styles.radioView,
      dotStyle = styles.radioSelected
    return (
      <View style={viewStyle}>
        {this.state.selected && <View style={dotStyle} />}
      </View>
    )
  }

  renderItem = () => {
    let name = this.props.data.caption
    const visibleImgWhite = this.state.visable
      ? require('../../../../assets/mapTools/icon_multi_selected_disable.png')
      : require('../../../../assets/mapTools/icon_multi_unselected_disable.png')
    const visibleImgBlack = this.state.visable
      ? require('../../../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../../../assets/mapTools/icon_multi_unselected_disable_black.png')
    const arrowImg = this.state.rowShow
      ? require('../../../../assets/mapEdit/icon-arrow-down.png')
      : require('../../../../assets/mapEdit/icon-arrow-left.png')
    let leftView = this.props.hasSelected ? (
      this.renderRadioBtn()
    ) : this.props.data.groupName ? (
      <View style={styles.btn} />
    ) : null
    let select = 'transparent'
    let selectcolor = color.black
    let visibleImg = visibleImgBlack
    let moreImg = require('../../../../assets/function/icon_shallow_more_black.png')
    let image = this.getStyleIconByType(this.props.data)
    if (this.props.selectLayer === this.props.data.caption) {
      select = '#rgba(0,157,249,1)'
      selectcolor = color.white
      visibleImg = visibleImgWhite
      moreImg = require('../../../../assets/function/icon_shallow_more.png')
    } else {
      select = 'transparent'
      selectcolor = color.black
      visibleImg = visibleImgBlack
      moreImg = require('../../../../assets/function/icon_shallow_more_black.png')
    }
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.rowOne, { backgroundColor: select }]}
        onPress={this._all_pop_row}
      >
        <View style={styles.btn_container}>
          {this.props.data.type === LAYER_GROUP ? (
            <TouchableOpacity style={styles.btn} onPress={this._arrow_pop_row}>
              <Image
                resizeMode={'contain'}
                style={styles.btn_image_samll}
                source={arrowImg}
              />
            </TouchableOpacity>
          ) : (
            leftView
          )}
          {this.props.operable && (
            <TouchableOpacity style={styles.btn} onPress={this._visable_change}>
              <Image
                resizeMode={'contain'}
                style={styles.btn_image}
                source={visibleImg}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btn1} onPress={this._pop_row}>
            <Image
              resizeMode={'contain'}
              style={[
                this.props.data.type === DatasetType.POINT &&
                this.props.data.themeType <= 0
                  ? styles.samllImage
                  : styles.btn_image,
              ]}
              source={image}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.text_container}>
          <Text style={[styles.text, { color: selectcolor }]}>{name}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={this._tool_row}>
          <Image
            resizeMode={'contain'}
            style={styles.more_image}
            source={moreImg}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  renderSwipeItem = () => {
    return (
      <SwipeOut
        style={styles.container}
        close={this.state.isClose}
        // left={rowData.left}
        right={this.state.options}
        // rowID={this.state.rowID}
        // sectionID={this.state.sectionID}
        autoClose={true}
        backgroundColor={'white'}
        onOpen={() => {
          // 参数sectionID, rowID
          this.props.onOpen && this.props.onOpen(this.props.data)
        }}
        buttonWidth={scaleSize(100)}
        // onClose={() => console.log('===close') }
        // scroll={event => console.log('scroll event') }
      >
        {this.renderItem()}
      </SwipeOut>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.swipeEnabled ? this.renderSwipeItem() : this.renderItem()}
        {this.state.rowShow && this._renderAdditionView()}
      </View>
    )
  }
}
