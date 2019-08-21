import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import styles from './styles'
import { color } from '../../../../styles'
import { CheckBox } from '../../../../components'
import { scaleSize } from '../../../../utils'
let Img = require('../../../../assets/mapToolbar/list_type_map_black.png')
let moreImg = require('../../../../assets/Mine/icon_more_gray.png')
export default class ModuleItem extends Component {
  props: {
    item: Object,
    index: number,
    section: Object,
    isShowMore: boolean,
    saveItemInfo: () => {},
    onItemCheck: () => {},
    batchDelete: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      title: props.item.name,
      index: props.index,
      select: false,
      isShowMore: props.isShowMore || true,
    }
  }

  _renderRight = () => {
    if (!this.props.isShowMore) {
      return null
    }
    if (this.props.batchDelete) {
      return (
        <CheckBox
          style={{
            height: scaleSize(80),
            width: scaleSize(80),
          }}
          onChange={checked => {
            this.props.onItemCheck(
              {
                item: this.props.item,
                index: this.props.index,
                section: this.props.section,
              },
              checked,
            )
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
            section: this.props.section,
          })
        }}
      >
        <Image source={moreImg} style={styles.moreImg} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <TouchableOpacity style={{ flex: 1 }}>
        <View style={styles.rowView}>
          <Image source={Img} style={styles.Img} />
          <Text style={styles.title}>{this.props.item.name}</Text>
          {this._renderRight()}
          {/* <TouchableOpacity
            style={styles.moreImgBtn}
            onPress={() => {
              this.props.saveItemInfo({
                item: this.props.item,
                index: this.props.index,
                section: this.props.section,
              })
            }}
          >
            {this.state.isShowMore && (
              <Image source={moreImg} style={styles.moreImg} />
            )}
          </TouchableOpacity> */}
        </View>
        <View
          style={{
            backgroundColor: color.separateColorGray,
            flex: 1,
            height: 1,
          }}
        />
      </TouchableOpacity>
    )
  }
}
