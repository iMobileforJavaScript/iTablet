/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, TextInput, Image, TouchableOpacity } from 'react-native'
import { getPublicAssets } from '../../assets'
import styles from './styles'

export default class SearchBar extends PureComponent {
  props: {
    onBlur?: () => {},
    onFocus?: () => {},
    onClear?: () => {},
    onSubmitEditing?: () => {},

    defaultValue: string,
    editable: string,
    placeholder: string,
    isFocused?: string,
    keyboardAppearance?: string,
    returnKeyType?: string,
    returnKeyLabel?: string,
    blurOnSubmit?: string,
  }

  static defaultProps = {
    isFocused: false,
    keyboardAppearance: 'default',
    returnKeyType: 'search',
    returnKeyLabel: '搜索',
    blurOnSubmit: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      isFocused: props.isFocused,
      value: props.defaultValue,
    }
  }

  focus = () => {
    this.searchInput && this.searchInput.focus()
  }

  blur = () => {
    this.searchInput && this.searchInput.blur()
  }

  _onBlur = () => {
    if (this.state.value === '' && this.state.isFocused) {
      this.setState({
        isFocused: false,
      })
    }
    if (this.props.onBlur && typeof this.props.onBlur === 'function') {
      this.props.onBlur(this.state.value)
    }
  }

  _onFocus = () => {
    if (!this.state.isFocused) {
      this.setState({
        isFocused: true,
      })
    }
    if (this.props.onFocus && typeof this.props.onFocus === 'function') {
      this.props.onFocus(this.state.value)
    }
  }

  _clear = () => {
    if (this.props.onClear && typeof this.props.onClear === 'function') {
      this.props.onClear()
    }
    this.searchInput && this.searchInput.clear()
  }

  _onSubmitEditing = () => {
    if (
      this.props.onSubmitEditing &&
      typeof this.props.onSubmitEditing === 'function'
    ) {
      this.props.onSubmitEditing(this.state.value)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.searchImg}
          resizeMode={'contain'}
          source={getPublicAssets().common.icon_search_a0}
        />
        <TextInput
          ref={ref => (this.searchInput = ref)}
          underlineColorAndroid={'transparent'}
          defaultValue={this.props.defaultValue}
          editable={this.props.editable}
          placeholder={this.props.placeholder}
          style={styles.input}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          onSubmitEditing={this._onSubmitEditing}
          returnKeyLabel={this.props.returnKeyLabel}
          returnKeyType={this.props.returnKeyType}
          keyboardAppearance={this.props.keyboardAppearance}
          blurOnSubmit={this.props.blurOnSubmit}
          onChangeText={value => {
            this.setState({ value })
          }}
        />
        {
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={this._clear}
          >
            <Image
              style={styles.clearImg}
              resizeMode={'contain'}
              source={require('../../assets/public/icon_input_clear.png')}
            />
          </TouchableOpacity>
        }
      </View>
    )
  }
}
