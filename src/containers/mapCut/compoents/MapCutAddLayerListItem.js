/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, Image } from 'react-native'
import { ImageButton } from '../../../components/index'
import { CheckStatus } from '../../../constants/index'
import {
  getPublicAssets,
  getThemeIconByType,
  getLayerIconByType,
} from '../../../assets/index'
import styles from '../styles'

export default class MapCutAddLayerListItem extends PureComponent {
  props: {
    data: Object,
    selected?: boolean,
    onSelect?: () => {},
  }

  static defaultProps = {
    selected: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      // inputValue: props.datasourceName,
    }
    this.caption = ''
  }

  onSelect = () => {
    if (this.props.onSelect && typeof this.props.onSelect === 'function') {
      this.props.onSelect(this.props.data)
    }
  }

  renderCheckButton = ({ status = 0, action = () => {}, data }) => {
    let icon = this.props.selected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    switch (status) {
      case CheckStatus.UN_CHECK:
        icon = getPublicAssets().common.icon_uncheck
        break
      case CheckStatus.CHECKED:
        icon = getPublicAssets().common.icon_check
        break
      case CheckStatus.UN_CHECK_DISABLE:
        icon = getPublicAssets().common.icon_uncheck_disable
        break
      case CheckStatus.CHECKED_DISABLE:
        icon = getPublicAssets().common.icon_check_disable
        break
    }
    return (
      <ImageButton
        iconBtnStyle={styles.selectImgView}
        iconStyle={styles.selectImg}
        icon={icon}
        onPress={() => {
          this.setState(
            {
              isSelectAll: !this.state.isSelectAll,
            },
            () => {
              action && action(data)
            },
          )
        }}
      />
    )
  }

  render() {
    let icon =
      this.props.data.themeType > 0
        ? getThemeIconByType(this.props.data.themeType)
        : getLayerIconByType(this.props.data.type)
    return (
      <View style={[styles.topLeftView, { width: '100%' }]}>
        {this.renderCheckButton({
          status: this.props.selected
            ? CheckStatus.CHECKED
            : CheckStatus.UN_CHECK,
          action: this.onSelect,
        })}
        <View style={styles.selectImgView}>
          <Image resizeMode="contain" style={styles.selectImg} source={icon} />
        </View>
        <Text style={styles.content}>{this.props.data.caption}</Text>
      </View>
    )
  }
}
