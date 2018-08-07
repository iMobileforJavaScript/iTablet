/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import {
  Action,
  DatasetType,
  ThemeType,
} from 'imobile_for_javascript'
import { PopBtnList } from '../../../../components'
import { Toast } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import styles from './styles'

export default class LayerManager_item extends React.Component {

  props: {
    layer: Object,
    map: Object,
    data: Object,
    mapControl: Object,
    showRenameDialog: () => {},
    showRemoveDialog: () => {},
    setEditable: () => {},
  }

  constructor(props){
    super(props)
    this.layer = this.props.layer
    this.map = this.props.map
    let data = this.props.data
    let options = this.getOptions(data)
    this.state = {
      options: options,
      editable: data.isEditable,
      visable: data.isVisible,
      selectable: data.isSelectable,
      snapable: data.isSnapable,
      rowShow:false,
      image: this.getStyleIconByType(data),
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.map) !== JSON.stringify(this.props.map) ||
      JSON.stringify(prevProps.layer) !== JSON.stringify(this.props.layer)
    ) {
      this.layer = this.props.layer
      this.map = this.props.map
      this.getData(this.props.data)
    }
  }

  getData = (data = this.props.data) => {
    (async function () {
      let options = this.getOptions(data)
      this.setState({
        options: options,
        editable: data.isEditable,
        visable: data.isVisible,
        selectable: data.isSelectable,
        snapable: data.isSnapable,
        rowShow: this.state.rowShow || false,
        image: this.getStyleIconByType(data),
      })
    }).bind(this)()
  }

  updateEditable = () => {
    (async function () {
      let idEditable = await this.props.layer.getEditable()
      this.setState({
        editable: idEditable,
      })
    }).bind(this)()
  }

  getOptions = data => {
    let options,
      themeSelectable = true,
      styleSelectable = true
    if (
      data.type === DatasetType.GRID ||
      data.type === DatasetType.IMAGE
    ) {
      themeSelectable = false
    }
    styleSelectable = data.themeType <= 0
    options = [
      { key: '可显示', selectable: true, action: this._visable_change },
      { key: '可选择', selectable: true, action: this._selectable_change },
      { key: '可编辑', selectable: true, action: this._editable_change },
      { key: '可捕捉', selectable: true, action: this._catchable_change },
      { key: '专题图', selectable: themeSelectable, action: this._openTheme },
      { key: '风格', selectable: styleSelectable, action: this._openStyle },
      { key: '重命名', selectable: true, action: this._rename },
      { key: '移除', selectable: true, action: this._remove },
    ]

    return options
  }

  action = () => {
    Toast.show('待做')
  }

  _editable_change=()=>{
    this.setState(oldstate=>{
      let newEdit = !oldstate.editable
      ;(async function (){
        await this.layer.setEditable(newEdit)
        await this.map.refresh()
        await this.props.mapControl.setAction(Action.PAN)
        this.props.setEditable && this.props.setEditable(newEdit ? this.props.data : null)
      }).bind(this)()
      return({editable:newEdit})
    })
  }

  _visable_change=()=>{
    this.setState(oldstate=>{
      let oldVisibe = oldstate.visable
      ;(async function (){
        await this.layer.setVisible(!oldVisibe)
        await this.map.refresh()
        await this.props.mapControl.setAction(Action.PAN)
      }).bind(this)()
      return({visable:!oldVisibe})
    })
  }

  _selectable_change=()=>{
    this.setState(oldstate=>{
      let oldSelect = oldstate.selectable
      ;(async function (){
        await this.layer.setSelectable(!oldSelect)
        await this.map.refresh()
        // await this.props.mapControl.setAction(Action.PAN)
      }).bind(this)()
      return({selectable:!oldSelect})
    })
  }

  _catchable_change=()=>{
    this.setState(oldstate=>{
      let oldCatch = oldstate.snapable
      ;(async function (){
        await this.layer.setSnapable(!oldCatch)
        await this.map.refresh()
        await this.props.mapControl.setAction(Action.PAN)
      }).bind(this)()
      return({snapable:!oldCatch})
    })
  }

  _openTheme = () => {
    NavigationService.navigate('ThemeEntry', {
      layer: this.props.layer,
      map: this.props.map,
      mapControl: this.props.mapControl,
    })
  }

  _openStyle = () => {
    NavigationService.navigate('ThemeStyle', {
      layer: this.props.layer,
      map: this.props.map,
      mapControl: this.props.mapControl,
    })
  }

  _rename = () => {
    this.props.showRenameDialog && this.props.showRenameDialog(true, this.props.layer)
  }

  _remove = () => {
    this.props.showRemoveDialog && this.props.showRemoveDialog(true, this.props.layer)
  }

  _pop_row=()=>{
    this.setState(oldstate=>{
      let oldshow = oldstate.rowShow
      return({rowShow:!oldshow})
    })
  }

  _renderAdditionView = () => {
    return (
      <PopBtnList data={this.state.options} />
    )
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
        icon = require('../../../../assets/map/icon-add-datasets.png')
        break
      case ThemeType.RANGE: // 分段专题图
        icon = require('../../../../assets/map/icon-data-collection.png')
        break
      case ThemeType.LABEL: // 标签专题图
        icon = require('../../../../assets/map/icon-map-management.png')
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
        icon = require('../../../../assets/public/input.png')
        break
      case DatasetType.CAD: // 复合数据集
        icon = require('../../../../assets/map/icon-cad.png')
        break
      default:
        icon = require('../../../../assets/public/mapLoad.png')
        break
    }
    return icon
  }

  render() {
    let name = this.props.data.caption
    const image1 = this.state.editable ? require('../../../../assets/map/icon_edit_selected.png') :require('../../../../assets/map/icon_edit.png')
    const image2 = this.state.visable ? require('../../../../assets/map/icon_visible_selected.png') :require('../../../../assets/map/icon_visible.png')
    const image3 = this.state.selectable ? require('../../../../assets/map/icon_choose_seleted.png') :require('../../../../assets/map/icon_choose.png')
    const image4 = this.state.snapable ? require('../../../../assets/map/icon_catch_selected.png') :require('../../../../assets/map/icon_catch.png')
    const image5 = this.state.rowShow ? require('../../../../assets/map/icon-arrow-up.png') :require('../../../../assets/map/icon-arrow-down.png')
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={1} style={styles.rowOne}  onPress={this._pop_row}>
          <View style={styles.btn_container}>
            <TouchableOpacity style={styles.btn} onPress={this._editable_change}><Image resizeMode={'contain'} style={styles.btn_image} source={image1}/></TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={this._visable_change}><Image resizeMode={'contain'} style={styles.btn_image} source={image2}/></TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={this._selectable_change}><Image resizeMode={'contain'} style={styles.btn_image} source={image3}/></TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={this._catchable_change}><Image resizeMode={'contain'} style={styles.btn_image} source={image4}/></TouchableOpacity>
            <View style={styles.btn}>
              <Image style={[this.props.data.type === DatasetType.POINT && this.props.data.themeType <= 0 ? styles.samllImage : styles.btn_image]} source={this.state.image} />
            </View>
          </View>
          <View style={styles.text_container}><Text>{name}</Text></View>
          {/*<TouchableOpacity style={styles.btn} underlayColor={Util.UNDERLAYCOLOR} onPress={this._pop_row}>*/}
          <Image style={styles.btn_image} source={image5}/>
          {/*</TouchableOpacity>*/}
        </TouchableOpacity>
        {this.state.rowShow && this._renderAdditionView()}
      </View>
    )
  }
}