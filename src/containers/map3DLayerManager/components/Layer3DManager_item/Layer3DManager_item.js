/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com 
*/

import * as React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import * as Util from '../../../../utils/constUtil'

import styles from './styles'

export default class Layer3DManager_item extends React.Component {
  constructor(props){
    super(props)
    this.layer3D = this.props.layer
    this.scene = this.props.scene
    ;(async function () {
      // let editable = await this.layer3D.getEditable()
      let isVisable = await this.layer3D.getVisable()
      // let selectable = await this.layer3D.isSelectable()
      this.setState({
        // editable:editable,
        visable:isVisable,
        // selectable:selectable,
        rowShow:false,
      })
    }).bind(this)()
  }

  state={
    editable:false,
    visable:false,
    selectable:false,
    rowShow:false,
  }

  // _editable_change=()=>{
  //   this.setState((oldstate)=>{
  //     let oldEdit = oldstate.editable
  //     ;(async function (){
  //       await this.layer3D.setEditable(!oldEdit)
  //       await this.scene.refresh()
  //     }).bind(this)()
  //     return({editable:!oldEdit})
  //   })
  // }

  _visable_change=()=>{
    this.setState((oldstate)=>{
      let oldVisable = oldstate.visable
      ;(async function (){
        await this.layer3D.setVisable(!oldVisable)
        await this.scene.refresh()
      }).bind(this)();
      return({visable:!oldVisable})
    })
  }

  // _selectable_change=()=>{
  //   this.setState((oldstate)=>{
  //     let oldSelect = oldstate.selectable
  //     ;(async function (){
  //       await this.layer3D.setSelectable(!oldSelect)
  //       await this.scene.refresh()
  //     }).bind(this)()
  //     return({selectable:!oldSelect})
  //   })
  // }

  /**
   * 设置图层颜色
   */
  _setObjectsColor=()=>{
    ;(async function (){
      this.layer3D.setObjectsColor(1, 255, 0, 0, 1)
      await this.scene.refresh()
    }).bind(this)()
  }
  
  _pop_row=()=>{
    this.setState((oldstate)=>{
      let oldshow = oldstate.rowShow
      return({rowShow:!oldshow})
    })
  }

  render() {
    let name = this.props.name
    const isShow = this.state.rowShow
    const image1 = this.state.editable ? require('../../../../assets/public/edit.png') :require('../../../../assets/public/edit-off.png')
    const image2 = this.state.visable ? require('../../../../assets/public/eye.png') :require('../../../../assets/public/eye-off.png')
    const image3 = this.state.selectable ? require('../../../../assets/public/select.png') :require('../../../../assets/public/select-off.png')
    const image4 = this.state.rowShow ? require('../../../../assets/public/show.png') :require('../../../../assets/public/show-off.png')
    return (
      <View style={styles.container}>
        <View style={styles.rowOne}>
          <View style={styles.btn_container}>
            {/* <TouchableOpacity style={styles.btn} underlayColor={Util.UNDERLAYCOLOR} onPress={this._editable_change}><Image style={styles.btn_image} source={image1}/></TouchableOpacity> */}
            <TouchableOpacity activeOpacity={0.8} style={styles.btn} underlayColor={Util.UNDERLAYCOLOR} onPress={this._visable_change}><Image style={styles.btn_image} source={image2}/></TouchableOpacity>
            <TouchableOpacity style={styles.btn} underlayColor={Util.UNDERLAYCOLOR} onPress={this._setObjectsColor}><Image style={styles.btn_image} source={image3}/></TouchableOpacity>
          </View>
          <View style={styles.text_container}><Text>{name}</Text></View>
          <TouchableOpacity activeOpacity={0.8} style={styles.btn} underlayColor={Util.UNDERLAYCOLOR} onPress={this._pop_row}><Image style={styles.btn_image} source={image4}/></TouchableOpacity>
        </View>
        {isShow && <View style={styles.rowTwo}><Text>1234</Text></View>}
      </View>
    )
  }
}