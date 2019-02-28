/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, TextInput, Image } from 'react-native'
import styles from './styles'

export default class SearchBar extends PureComponent {
  props: {
    onBlur?: () => {},
    onFocus?: () => {},
    cancelAction: () => {},

    defaultValue: string,
    editable: string,
    placeholder: string,
    isFocused?: string,
  }

  static defaultProps = {
    isFocused: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      isFocused: props.isFocused,
      value: props.defaultValue,
    }
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

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.clearImg}
          resizeMode={'contain'}
          source={require('../../assets/public/icon_input_clear.png')}
        />
        <TextInput
          ref={ref => (this.searchInput = ref)}
          underlineColorAndroid={'transparent'}
          defaultValue={this.props.defaultValue}
          editable={this.props.editable}
          placeholder={this.props.placeholder}
          style={styles.textInputStyle}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
        />
        {
          <Image
            style={styles.clearImg}
            resizeMode={'contain'}
            source={require('../../assets/public/icon_input_clear.png')}
          />
        }
      </View>
    )
  }
}
