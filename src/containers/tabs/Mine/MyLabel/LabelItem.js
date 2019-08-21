import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import styles from './styles'
import { CheckBox } from '../../../../components'
import { scaleSize } from '../../../../utils'
let Img = require('../../../../assets/Mine/mine_my_online_data.png')
let moreImg = require('../../../../assets/Mine/icon_more_gray.png')
// let selectImg = require('../../../../assets/mapTools/icon_multi_unselected_disable_black.png')
// let selectedImg = require('../../../../assets/mapTools/icon_multi_selected_disable_black.png')

export default class LabelItem extends Component {
  props: {
    item: Object,
    index: number,
    saveItemInfo: () => {},
    onItemCheck: () => {},
    showSelect: Boolean,
    batchDelete: Boolean,
  }
  constructor(props) {
    super(props)
  }

  _renderRight = () => {
    if (this.props.showSelect || this.props.batchDelete) {
      return (
        <CheckBox
          style={{
            height: scaleSize(80),
            width: scaleSize(80),
          }}
          onChange={checked => {
            this.props.onItemCheck(this.props.item.title, checked)
          }}
        />
      )
    }
    return (
      <TouchableOpacity
        style={styles.moreImgBtn}
        onPress={() => {
          this.props.saveItemInfo({
            item: this.props.item,
            index: this.props.index,
          })
        }}
      >
        <Image source={moreImg} style={styles.moreImg} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <TouchableOpacity
        disabled={this.props.showSelect || this.props.batchDelete}
        style={{ flex: 1 }}
      >
        <View style={styles.rowView}>
          <Image source={Img} style={styles.Img} />
          <Text style={styles.title}>{this.props.item.title}</Text>
          {this._renderRight()}
        </View>
      </TouchableOpacity>
    )
  }
}
