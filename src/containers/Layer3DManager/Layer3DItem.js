import React, { Component } from 'react'
import { TouchableOpacity, View, Text, Image, ScrollView } from 'react-native'
import { SScene } from 'imobile_for_reactnative'
import styles from './styles'
import { scaleSize } from '../../utils'
import { ConstToolType } from '../../constants'
import { color } from '../../styles'
export default class Layer3DItem extends Component {
  props: {
    item: Object,
    device: Object,
    toHeightItem: Object,
    index: any,
    getlayer3dToolbar: () => {},
    setCurrentLayer3d: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      name: props.item.name,
      visible: props.item.visible,
      selectable: props.item.selectable,
    }
  }

  // changeSelect = async () => {
  //   let newState = this.state
  //   newState.selectable = !this.state.selectable
  //   await SScene.setSelectable(this.state.name, newState.selectable)
  //   this.setState(newState)
  //   // console.log(this.state.visible,this.state.selectable)
  // }

  setItemSelectable(selectable) {
    this.setState({ selectable: selectable })
  }

  changeVisible = async () => {
    let newState = this.state
    newState.visible = !this.state.visible
    await SScene.setVisible(this.state.name, newState.visible)
    this.setState(newState)
  }

  more = async () => {
    let layer3dToolbar = this.props.getlayer3dToolbar
      ? this.props.getlayer3dToolbar()
      : null
    if (layer3dToolbar) {
      layer3dToolbar.setVisible(true, ConstToolType.MAP3D_LAYER3DSELECT, {
        isFullScreen: true,
        height: scaleSize(165),
      })
      layer3dToolbar.getLayer3dItem(
        this.state,
        this.props.setCurrentLayer3d,
        this.setItemSelectable,
      )
    }
  }

  render() {
    // let selectImg = this.state.selectable
    //   ? require('../../assets/map/Frenchgrey/icon_selectable_selected.png')
    //   : require('../../assets/map/Frenchgrey/icon_selectable.png')
    // let typeImg=require("")
    let visibleImg = this.state.visible
      ? require('../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../assets/mapTools/icon_multi_unselected_disable_black.png')
    let textColor =
      this.props.toHeightItem.index === this.props.index
        ? { color: color.bgW }
        : { color: color.fontColorBlack }

    let moreImg = require('../../assets/map/Frenchgrey/icon_more.png')
    let typeImg = require('../../assets/map/Frenchgrey/icon_vectorfile.png')
    // console.log(this.state.visible, this.state.selectable)
    // console.log(selectImg, visibleImg)
    return (
      <View>
        <View style={styles.row}>
          {/* <TouchableOpacity onPress={this.changeSelect}>
            <Image source={selectImg} style={styles.selectImg} />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={this.changeVisible}>
            <Image source={visibleImg} style={styles.visibleImg} />
          </TouchableOpacity>

          <Image source={typeImg} style={styles.type} />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text style={[styles.itemName, textColor]}>{this.state.name}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.moreView} onPress={this.more}>
            <Image source={moreImg} style={styles.moreImg} />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.itemSeparator,
            {
              width: 0.956 * this.props.device.width,
              marginLeft: 0.022 * this.props.device.width,
            },
          ]}
        />
      </View>
    )
  }
}
