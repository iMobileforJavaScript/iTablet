import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  StyleSheet,
} from 'react-native'
import { color, size } from '../../../styles'
import { scaleSize } from '../../../utils'
import { getThemeAssets, getPublicAssets } from '../../../assets'
import { CheckStatus } from '../../../constants'

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(30),
    paddingLeft: scaleSize(10),
    paddingRight: scaleSize(5),
    borderBottomWidth: 1,
    borderBottomColor: color.fontColorGray,
    height: scaleSize(80),
  },

  titleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },

  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchTitle: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  arrowImg: {
    marginLeft: scaleSize(10),
    width: scaleSize(40),
    height: scaleSize(40),
  },

  radioView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleSize(40),
    height: scaleSize(40),
    marginRight: scaleSize(20),
  },
  radioImg: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
})

export default class AnalystItem extends PureComponent {
  props: {
    title: string,
    value: any,
    onChange?: () => {},
    onPress?: () => {},
    radioStatus?: number,
    onRadioPress?: () => {},
  }

  // static defaultProps = {
  //   hasRadio: false,
  // }

  renderRight = () => {
    let rightView = null
    switch (typeof this.props.value) {
      case 'boolean':
        rightView = (
          <View style={styles.rightView}>
            <Switch
              style={styles.switch}
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={this.props.value ? color.bgW : color.bgW}
              ios_backgroundColor={this.props.value ? color.switch : color.bgG}
              value={this.props.value}
              onValueChange={value => {
                if (
                  this.props.onChange &&
                  typeof this.props.onChange === 'function'
                ) {
                  this.props.onChange(value)
                }
              }}
            />
          </View>
        )
        break
      case 'string':
      case 'number':
        rightView = (
          <TouchableOpacity
            style={styles.rightView}
            onPress={() => {
              if (
                this.props.onPress &&
                typeof this.props.onPress === 'function'
              ) {
                this.props.onPress()
              }
            }}
          >
            <Text style={styles.switchTitle}>{this.props.value}</Text>
            <Image
              resizeMode={'contain'}
              style={styles.radioImg}
              source={getThemeAssets().publicAssets.icon_arrow_right}
            />
          </TouchableOpacity>
        )
    }
    return rightView
  }

  renderRadio = () => {
    if (
      this.props.radioStatus === undefined ||
      this.props.radioStatus < 0 ||
      this.props.radioStatus > 3
    )
      return null
    let icon
    switch (this.props.radioStatus) {
      case CheckStatus.CHECKED:
        icon = getPublicAssets().common.icon_radio_selected
        break
      case CheckStatus.UN_CHECK_DISABLE:
        icon = getPublicAssets().common.icon_radio_unselected
        break
      case CheckStatus.CHECKED_DISABLE:
        icon = getPublicAssets().common.icon_radio_selected_disable
        break
      case CheckStatus.UN_CHECK:
        icon = getPublicAssets().common.icon_radio_unselected_disable
        break
    }
    return (
      <TouchableOpacity
        style={styles.radioView}
        onPress={() => {
          if (
            this.props.onRadioPress &&
            typeof this.props.onRadioPress === 'function'
          ) {
            this.props.onRadioPress()
          }
        }}
      >
        <Image resizeMode={'contain'} style={styles.arrowImg} source={icon} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.itemContainer}>
        {this.renderRadio()}
        <View style={styles.titleView}>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
        {this.renderRight()}
      </View>
    )
  }
}
