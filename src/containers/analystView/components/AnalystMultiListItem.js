/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ImageButton } from '../../../components'
import { CheckStatus } from '../../../constants'
import { scaleSize } from '../../../utils'
import { size, color } from '../../../styles'
import { getPublicAssets } from '../../../assets'

const ROW_HEIGHT = scaleSize(80)
const styles = StyleSheet.create({
  itemView: {
    flex: 1,
    flexDirection: 'row',
    height: ROW_HEIGHT,
    paddingLeft: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  content: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },
  /** Check按钮 **/
  select: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectImgView: {
    width: ROW_HEIGHT,
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectImg: {
    width: scaleSize(40),
    height: scaleSize(40),
    backgroundColor: 'transparent',
  },
})

export default class AnalystMultiListItem extends PureComponent {
  props: {
    data: Object,
    selected?: boolean,
    onSelect?: () => {},
  }

  static defaultProps = {
    selected: false,
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
          action && action(data)
        }}
      />
    )
  }

  render() {
    return (
      <View style={[styles.itemView, { width: '100%' }]}>
        {this.renderCheckButton({
          status: this.props.selected
            ? CheckStatus.CHECKED
            : CheckStatus.UN_CHECK,
          action: this.onSelect,
        })}
        <Text style={styles.content}>{this.props.data.key}</Text>
      </View>
    )
  }
}
