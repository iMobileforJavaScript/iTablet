import React, { Component } from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import styles from './styles'
import { getPublicAssets } from '../../../../assets'
import { getLanguage } from '../../../../language/index'

export default class BatchHeadBar extends Component {
  props: {
    select: Number,
    total: Number,
    selectAll: () => {},
    deselectAll: () => {},
  }

  constructor(props) {
    super(props)
  }

  render() {
    let icon
    icon =
      this.props.total === 0
        ? getPublicAssets().common.icon_uncheck
        : this.props.total === this.props.select
          ? getPublicAssets().common.icon_check
          : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.batchHeadStyle}>
        <View style={styles.batchCheckStyle}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              if (this.props.total === this.props.select) {
                this.props.deselectAll()
              } else {
                this.props.selectAll()
              }
            }}
          >
            <Image style={styles.btn_image} source={icon} />
          </TouchableOpacity>
          <Text style={styles.batchCheckTextStyle}>
            {getLanguage(global.language).Profile.SELECT_ALL}
          </Text>
        </View>
        <Text style={styles.batchHeadTextStyle}>
          {global.language === 'CN'
            ? '已选择' + this.props.select + '个数据'
            : this.props.select + ' item(s) selected'}
        </Text>
      </View>
    )
  }
}
