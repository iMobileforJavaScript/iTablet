import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import styles from './styles'
export default class LableItem extends Component {
  props: {
    item: Object,
    index: number,
    saveItemInfo: () => {},
    uploadListOfAdd: () => {},
    removeDataFromUpList: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      title: props.item.title,
      index: props.index,
      select: false,
    }
  }

  render() {
    let Img = require('../../../../assets/Mine/mine_my_online_data.png')
    let moreImg = require('../../../../assets/Mine/icon_more_gray.png')
    let selectImg = require('../../../../assets/mapTools/icon_multi_unselected_disable_black.png')
    let selectedImg = require('../../../../assets/mapTools/icon_multi_selected_disable_black.png')
    return (
      <TouchableOpacity style={{ flex: 1 }}>
        <View style={styles.rowView}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ select: !this.state.select }, () => {
                if (this.state.select) {
                  this.props.uploadListOfAdd(this.state.title)
                } else {
                  this.props.removeDataFromUpList(this.state.title)
                }
              })
            }}
          >
            <Image
              source={this.state.select ? selectedImg : selectImg}
              style={styles.selectImg}
            />
          </TouchableOpacity>
          <Image source={Img} style={styles.Img} />
          <Text style={styles.title}>{this.state.title}</Text>
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
        </View>
      </TouchableOpacity>
    )
  }
}
