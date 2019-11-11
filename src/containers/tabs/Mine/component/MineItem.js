import React, { Component } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import styles from './styles'
import { getPublicAssets } from '../../../../assets'
import TouchableItemView from '../../Friend/TouchableItemView'
let moreImg = require('../../../../assets/Mine/icon_more_gray.png')

export default class MineItem extends Component {
  props: {
    item: Object,
    image: Object,
    text: String,
    disableTouch: boolean,
    disableCheck: boolean,
    showRight: boolean,
    showCheck: boolean,
    showSeperator: boolean,
    onPress: () => {},
    onPressMore: () => {},
    onPressCheck: () => {},
    contentStyle: {},
    imageStyle: {},
    textStyle: {},
  }

  static defaultProps = {
    disableTouch: false,
    showRight: true,
    showCheck: false,
    disableCheck: false,
    showSeperator: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: props.item.checked || false,
    }
  }

  _onItemCheck = () => {
    if (this.props.item.checked === undefined) {
      this.props.item.checked = true
    } else {
      this.props.item.checked = !this.props.item.checked
    }
    this.setState({ checked: this.props.item.checked })
    this.props.onPressCheck && this.props.onPressCheck(this.props.item)
  }

  _renderLeft = () => {
    if (this.props.showCheck) {
      let icon
      if (!this.props.disableCheck) {
        icon = this.props.item.checked
          ? getPublicAssets().common.icon_check
          : getPublicAssets().common.icon_uncheck
      } else {
        icon = this.props.item.checked
          ? getPublicAssets().common.icon_check_disable
          : getPublicAssets().common.icon_uncheck_disable
      }
      return (
        <TouchableOpacity
          disable={this.props.disableCheck}
          style={[styles.btn]}
          onPress={this._onItemCheck}
          underlayColor={'transparent'}
        >
          <Image
            resizeMode={'contain'}
            style={[styles.btn_image]}
            source={icon}
          />
        </TouchableOpacity>
      )
    }
  }

  _renderRight = () => {
    if (this.props.showCheck) {
      return null
    }
    return (
      <TouchableOpacity
        style={styles.moreImgBtn}
        onPress={() => {
          this.props.onPressMore && this.props.onPressMore(this.props.item)
        }}
      >
        <Image source={moreImg} style={styles.moreImg} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <TouchableItemView
        disableTouch={this.props.showCheck}
        renderLeft={this.props.showCheck ? this._renderLeft : null}
        renderRight={this.props.showRight ? this._renderRight : null}
        image={this.props.image}
        text={this.props.text}
        onPress={() => {
          this.props.onPress && this.props.onPress(this.props.item)
        }}
        seperatorStyle={[
          { marginLeft: 0 },
          this.props.showSeperator ? null : { height: 0 },
        ]}
        checked={this.state.checked}
        contentStyle={this.props.contentStyle}
        imageStyle={this.props.imageStyle}
        textStyle={this.props.textStyle}
      />
    )
  }
}
