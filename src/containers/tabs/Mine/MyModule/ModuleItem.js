import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import styles from './styles'
import { color } from '../../../../styles'
export default class ModuleItem extends Component {
  props: {
    item: Object,
    index: number,
    section: Object,
    isShowMore: boolean,
    saveItemInfo: () => {},
    uploadListOfAdd: () => {},
    removeDataFromUpList: () => {},
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

  render() {
    let Img = require('../../../../assets/mapToolbar/list_type_map_black.png')
    let moreImg = require('../../../../assets/Mine/icon_more_gray.png')
    return (
      <TouchableOpacity style={{ flex: 1 }}>
        <View style={styles.rowView}>
          <Image source={Img} style={styles.Img} />
          <Text style={styles.title}>{this.state.title}</Text>
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
            {this.state.isShowMore && (
              <Image source={moreImg} style={styles.moreImg} />
            )}
          </TouchableOpacity>
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
