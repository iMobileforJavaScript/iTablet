import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import styles from './styles'
export default class LabelItem extends Component {
  props: {
    item: Object,
    index: number,
    saveItemInfo: () => {},
    uploadListOfAdd: () => {},
    removeDataFromUpList: () => {},
    getShowSelect: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      select: false,
    }
  }
  render() {
    let Img = require('../../../../assets/Mine/mine_my_online_data.png')
    let moreImg = require('../../../../assets/Mine/icon_more_gray.png')
    let selectImg = require('../../../../assets/mapTools/icon_multi_unselected_disable_black.png')
    let selectedImg = require('../../../../assets/mapTools/icon_multi_selected_disable_black.png')
    let showselect = this.props.getShowSelect && this.props.getShowSelect()
    return (
      <TouchableOpacity style={{ flex: 1 }}>
        <View style={styles.rowView}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ select: !this.state.select }, () => {
                if (this.state.select) {
                  this.props.uploadListOfAdd(this.props.item.title)
                } else {
                  this.props.removeDataFromUpList(this.props.item.title)
                }
              })
            }}
          >
            {showselect && (
              <Image
                source={this.state.select ? selectedImg : selectImg}
                style={styles.selectImg}
              />
            )}
          </TouchableOpacity>
          <Image source={Img} style={styles.Img} />
          <Text style={styles.title}>{this.props.item.title}</Text>
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
