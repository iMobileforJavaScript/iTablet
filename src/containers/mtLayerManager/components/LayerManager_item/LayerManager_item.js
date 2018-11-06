/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Action, DatasetType, ThemeType } from 'imobile_for_reactnative'
import { Toast, scaleSize } from '../../../../utils'
import { Const } from '../../../../constants'
import NavigationService from '../../../NavigationService'
import SwipeOut from 'react-native-swipeout'
import styles from './styles'

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
    onPress: () => {},
    onOpen: () => {},
    child: Array,
    sectionID: number,
    rowID: number,
  }

  static defaultProps = {
    isClose: true,
    swipeEnabled: true,
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
    if (
      JSON.stringify(prevProps.map) !== JSON.stringify(this.props.map) ||
      JSON.stringify(prevProps.layer) !== JSON.stringify(this.props.layer)
    ) {
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
        visable: data.isVisible && !showLevelOne,
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

  _editable_change = () => {
    if (!this.state.visable) return
    this.setState(oldstate => {
      let newEdit = !oldstate.editable
      ;(async function() {
        await this.props.layer.setEditable(newEdit)
        await this.props.map.refresh()
        await this.props.mapControl.setAction(Action.PAN)
        this.props.setEditable && this.props.setEditable(this.props.data)
      }.bind(this)())
      return { editable: newEdit }
    })
  }

  _visable_change = () => {
    this.setState(oldstate => {
      let oldVisibe = oldstate.visable
      ;(async function() {
        await this.props.layer.setVisible(!oldVisibe)
        await this.props.map.refresh()
        await this.props.mapControl.setAction(Action.PAN)
      }.bind(this)())
      return { visable: !oldVisibe }
    })
  }

  _selectable_change = () => {
    this.setState(oldstate => {
      let oldSelect = oldstate.selectable
      ;(async function() {
        await this.props.layer.setSelectable(!oldSelect)
        await this.props.map.refresh()
        // await this.props.mapControl.setAction(Action.PAN)
      }.bind(this)())
      return { selectable: !oldSelect }
    })
  }

  _catchable_change = () => {
    this.setState(oldstate => {
      let oldCatch = oldstate.snapable
      ;(async function() {
        await this.props.layer.setSnapable(!oldCatch)
        await this.props.map.refresh()
        await this.props.mapControl.setAction(Action.PAN)
      }.bind(this)())
      return { snapable: !oldCatch }
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
    let isShow = !this.state.rowShow
    if (this.props.data.layer._SMLayerGroupId) {
      let child = []
      if (isShow) {
        child =
          (this.props.onPress &&
            (await this.props.onPress({
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
    // return (
    //   <PopBtnList data={this.state.options} />
    // )
    return <View style={styles.additionView}>{this.state.child}</View>
  }

  getStyleIconByType = item => {
    if (item.themeType > 0) {
      return this.getThemeIconByType(item.themeType)
    } else {
      return this.getLayerIconByType(item.type)
    }
  }

  getThemeIconByType = type => {
    let icon
    switch (type) {
      case ThemeType.UNIQUE: // 单值专题图
        icon = require('../../../../assets/map/icon-theme.unique.png')
        break
      case ThemeType.RANGE: // 分段专题图
        icon = require('../../../../assets/map/icon-theme-range.png')
        break
      case ThemeType.LABEL: // 标签专题图
        icon = require('../../../../assets/map/icon-theme-label.png')
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
        icon = require('../../../../assets/map/icon-dot.png')
        break
      case DatasetType.LINE: // 线数据集
        icon = require('../../../../assets/map/icon-line.png')
        break
      case DatasetType.REGION: // 多边形数据集
        icon = require('../../../../assets/map/icon-polygon.png')
        break
      case DatasetType.TEXT: // 文本数据集
        icon = require('../../../../assets/map/icon-text.png')
        break
      case DatasetType.IMAGE: // 影像数据集
        icon = require('../../../../assets/map/icon-surface.png')
        break
      case DatasetType.CAD: // 复合数据集
        icon = require('../../../../assets/map/icon-cad.png')
        break
      case DatasetType.Network: // 复合数据集
        icon = require('../../../../assets/map/icon-network.png')
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

  renderSwipeRow = () => {
    let name = this.props.data.caption
    const image1 = this.state.editable
      ? require('../../../../assets/map/icon_edit_selected.png')
      : require('../../../../assets/map/icon_edit.png')
    const image2 = this.state.visable
      ? require('../../../../assets/map/icon_visible_selected.png')
      : require('../../../../assets/map/icon_visible.png')
    const image3 = this.state.selectable
      ? require('../../../../assets/map/icon_choose_seleted.png')
      : require('../../../../assets/map/icon_choose.png')
    const image4 = this.state.snapable
      ? require('../../../../assets/map/icon_catch_selected.png')
      : require('../../../../assets/map/icon_catch.png')
    const image5 = this.state.rowShow
      ? require('../../../../assets/mapEdit/icon-arrow-down.png')
      : require('../../../../assets/mapEdit/icon-arrow-left.png')
    let leftView = this.props.hasSelected ? (
      this.renderRadioBtn()
    ) : this.props.data.groupName ? (
      <View style={styles.btn} />
    ) : null
    return (
      <View style={styles.container}>
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
          <TouchableOpacity
            activeOpacity={1}
            style={styles.rowOne}
            onPress={this._pop_row}
          >
            <View style={styles.btn_container}>
              {this.props.data.type === LAYER_GROUP ? (
                <TouchableOpacity style={styles.btn} onPress={this._pop_row}>
                  <Image
                    resizeMode={'contain'}
                    style={styles.btn_image_samll}
                    source={image5}
                  />
                </TouchableOpacity>
              ) : (
                leftView
              )}
              {this.props.operable && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this._visable_change}
                >
                  <Image
                    resizeMode={'contain'}
                    style={styles.btn_image}
                    source={image2}
                  />
                </TouchableOpacity>
              )}
              {this.props.operable &&
                this.state.isVectorLayer &&
                this.state.showLevelOne && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this._selectable_change}
                >
                  <Image
                    resizeMode={'contain'}
                    style={styles.btn_image}
                    source={image3}
                  />
                </TouchableOpacity>
              )}
              {this.props.operable &&
                this.state.isVectorLayer &&
                this.state.showLevelOne &&
                this.state.showLevelTwo && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this._editable_change}
                >
                  <Image
                    resizeMode={'contain'}
                    style={styles.btn_image}
                    source={image1}
                  />
                </TouchableOpacity>
              )}
              {this.props.operable &&
                this.state.isVectorLayer &&
                this.state.showLevelOne &&
                this.state.showLevelTwo && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this._catchable_change}
                >
                  <Image
                    resizeMode={'contain'}
                    style={styles.btn_image}
                    source={image4}
                  />
                </TouchableOpacity>
              )}
              <View style={styles.btn}>
                <Image
                  resizeMode={'contain'}
                  style={[
                    this.props.data.type === DatasetType.POINT &&
                    this.props.data.themeType <= 0
                      ? styles.samllImage
                      : styles.btn_image,
                  ]}
                  source={this.state.image}
                />
              </View>
            </View>
            <View style={styles.text_container}>
              <Text style={styles.text}>{name}</Text>
            </View>
          </TouchableOpacity>
        </SwipeOut>
        {this.state.rowShow && this._renderAdditionView()}
      </View>
    )
  }

  renderRow = () => {
    let name = this.props.data.caption
    const image1 = this.state.editable
      ? require('../../../../assets/map/icon_edit_selected.png')
      : require('../../../../assets/map/icon_edit.png')
    const image2 = this.state.visable
      ? require('../../../../assets/map/icon_visible_selected.png')
      : require('../../../../assets/map/icon_visible.png')
    const image3 = this.state.selectable
      ? require('../../../../assets/map/icon_choose_seleted.png')
      : require('../../../../assets/map/icon_choose.png')
    const image4 = this.state.snapable
      ? require('../../../../assets/map/icon_catch_selected.png')
      : require('../../../../assets/map/icon_catch.png')
    const image5 = this.state.rowShow
      ? require('../../../../assets/mapEdit/icon-arrow-down.png')
      : require('../../../../assets/mapEdit/icon-arrow-left.png')

    let leftView = this.props.hasSelected ? (
      this.renderRadioBtn()
    ) : this.props.data.groupName ? (
      <View style={styles.btn} />
    ) : null

    return (
      <View style={[styles.container, { backgroundColor: 'white' }]}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.rowOne}
          onPress={this._pop_row}
        >
          <View style={styles.btn_container}>
            {this.props.data.type === LAYER_GROUP ? (
              <TouchableOpacity style={styles.btn} onPress={this._pop_row}>
                <Image
                  resizeMode={'contain'}
                  style={styles.btn_image_samll}
                  source={image5}
                />
              </TouchableOpacity>
            ) : (
              leftView
            )}
            {this.props.operable && (
              <TouchableOpacity
                style={styles.btn}
                onPress={this._visable_change}
              >
                <Image
                  resizeMode={'contain'}
                  style={styles.btn_image}
                  source={image2}
                />
              </TouchableOpacity>
            )}
            {this.props.operable &&
              this.state.isVectorLayer &&
              this.state.showLevelOne && (
              <TouchableOpacity
                style={styles.btn}
                onPress={this._selectable_change}
              >
                <Image
                  resizeMode={'contain'}
                  style={styles.btn_image}
                  source={image3}
                />
              </TouchableOpacity>
            )}
            {this.props.operable &&
              this.state.isVectorLayer &&
              this.state.showLevelOne &&
              this.state.showLevelTwo && (
              <TouchableOpacity
                style={styles.btn}
                onPress={this._editable_change}
              >
                <Image
                  resizeMode={'contain'}
                  style={styles.btn_image}
                  source={image1}
                />
              </TouchableOpacity>
            )}
            {this.props.operable &&
              this.state.isVectorLayer &&
              this.state.showLevelOne &&
              this.state.showLevelTwo && (
              <TouchableOpacity
                style={styles.btn}
                onPress={this._catchable_change}
              >
                <Image
                  resizeMode={'contain'}
                  style={styles.btn_image}
                  source={image4}
                />
              </TouchableOpacity>
            )}
            <View style={styles.btn}>
              <Image
                resizeMode={'contain'}
                style={[
                  this.props.data.type === DatasetType.POINT &&
                  this.props.data.themeType <= 0
                    ? styles.samllImage
                    : styles.btn_image,
                ]}
                source={this.state.image}
              />
            </View>
          </View>
          <View style={styles.text_container}>
            <Text style={styles.text}>{name}</Text>
          </View>
        </TouchableOpacity>
        {this.state.rowShow && this._renderAdditionView()}
      </View>
    )
  }

  render() {
    if (this.props.swipeEnabled) {
      return this.renderSwipeRow()
    } else {
      return this.renderRow()
    }
  }
}
